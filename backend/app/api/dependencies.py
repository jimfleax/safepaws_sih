
import logging

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

logger = logging.getLogger(__name__)

from app.db.session import get_db
from app.ml.embedding.config import EmbeddingModelConfig
from app.ml.embedding.inference import BiometricEmbeddingModel
from app.services.biometric_service import BiometricPipelineService
from app.services.ml_interfaces import (
    EmbeddingModel,
    NoseDetector,
    QualityGate,
)
from app.services.quality_gate import ClassicalQualityGate
from app.services.registration_service import RegistrationService

# ------------------------------------------------------------------
# Import real Panel implementations
# ------------------------------------------------------------------
from app.services.yolo_detector import YoloNoseDetector
from app.storage.interfaces import ImageStorage
from app.storage.local_storage import LocalFileSystemStorage
from app.vector_store.faiss_store import FAISSVectorStore
from app.vector_store.interfaces import VectorStore

# ------------------------------------------------------------------
# Provider functions — wired via FastAPI Depends
# ------------------------------------------------------------------

# ------------------------------------------------------------------
# Global Singletons with Production Fail-Closed Invariants
# ------------------------------------------------------------------
import os
from app.core.config import settings
from app.core.exceptions import DomainException

is_production = (os.getenv("ENVIRONMENT", "").lower() == "production") or (not settings.DEBUG)

class UnavailableNoseDetector(NoseDetector):
    def __init__(self, reason: str):
        self.reason = reason
    async def detect(self, image: bytes) -> list[dict]:
        raise DomainException(
            message=f"Biometric detection engine unavailable in production: {self.reason}",
            error_code="BIOMETRIC_DETECTOR_UNAVAILABLE",
            status_code=503,
        )

class UnavailableEmbeddingModel(EmbeddingModel):
    def __init__(self, reason: str):
        self.reason = reason
        self.is_scaffold_mode = False
    async def extract_features(self, image: bytes, bbox: dict) -> list[float]:
        raise DomainException(
            message=f"Biometric embedding engine unavailable in production: {self.reason}",
            error_code="BIOMETRIC_EMBEDDER_UNAVAILABLE",
            status_code=503,
        )

try:
    _detector = YoloNoseDetector()
except Exception as e:
    if is_production:
        logger.error("PRODUCTION FAIL-CLOSED: YoloNoseDetector failed to initialize: %s", e)
        _detector = UnavailableNoseDetector(str(e))
    else:
        logger.warning("YoloNoseDetector failed to initialize, using development fallback: %s", e)
        class FallbackNoseDetector(NoseDetector):
            async def detect(self, image: bytes) -> list[dict]:
                return [{"box": [10, 10, 50, 50], "confidence": 0.95}]
        _detector = FallbackNoseDetector()

_quality_gate = ClassicalQualityGate()

try:
    _embedder = BiometricEmbeddingModel(config=EmbeddingModelConfig(
        scaffold_mode=False,
        embedding_dimension=settings.EMBEDDING_DIMENSION,
        backbone_architecture="mobilenet_v2"
    ))
except Exception as e:
    if is_production:
        logger.error("PRODUCTION FAIL-CLOSED: BiometricEmbeddingModel failed to initialize: %s", e)
        _embedder = UnavailableEmbeddingModel(str(e))
    else:
        logger.warning("BiometricEmbeddingModel failed in production mode, falling back to scaffold: %s", e)
        _embedder = BiometricEmbeddingModel(config=EmbeddingModelConfig(
            scaffold_mode=True,
            embedding_dimension=settings.EMBEDDING_DIMENSION,
            backbone_architecture="mobilenet_v2"
        ))

_vector_store = FAISSVectorStore()
_image_storage = LocalFileSystemStorage()

# Try to load existing FAISS index on startup
import asyncio

try:
    asyncio.run(_vector_store.load_local())
except Exception:
    pass # Ignore if it doesn't exist yet

def get_detector() -> NoseDetector:
    return _detector

def get_quality_gate() -> QualityGate:
    return _quality_gate

def get_embedder() -> EmbeddingModel:
    return _embedder

def get_vector_store() -> VectorStore:
    return _vector_store

def get_image_storage() -> ImageStorage:
    return _image_storage

def get_biometric_service(
    detector: NoseDetector = Depends(get_detector),
    quality_gate: QualityGate = Depends(get_quality_gate),
    embedder: EmbeddingModel = Depends(get_embedder),
    vector_store: VectorStore = Depends(get_vector_store)
) -> BiometricPipelineService:
    return BiometricPipelineService(detector, quality_gate, embedder, vector_store)

def get_registration_service(
    db: AsyncSession = Depends(get_db),
    biometric_service: BiometricPipelineService = Depends(get_biometric_service),
    storage: ImageStorage = Depends(get_image_storage)
) -> RegistrationService:
    return RegistrationService(db, biometric_service, storage)
import os

import jwt
from fastapi import HTTPException, Request
from sqlalchemy import select

from app.db.models import Owner

SECRET_KEY = os.getenv('JWT_SECRET', 'supersecret')

async def get_current_owner(request: Request, db: AsyncSession = Depends(get_db)) -> Owner:
    token = request.cookies.get('jwt')
    if not token:
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
            
    if not token:
        raise HTTPException(status_code=401, detail='Not authenticated')
        
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        owner_id = payload.get('userId')
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail='Invalid token')
        
    if not owner_id:
        raise HTTPException(status_code=401, detail='Invalid token payload')
        
    stmt = select(Owner).where(Owner.id == owner_id)
    result = await db.execute(stmt)
    owner = result.scalars().first()
    
    if not owner:
        raise HTTPException(status_code=404, detail='Owner not found')
        
    return owner
async def get_optional_current_owner(request: Request, db: AsyncSession = Depends(get_db)):
    try:
        return await get_current_owner(request, db)
    except HTTPException:
        return None
