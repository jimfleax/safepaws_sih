from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Tuple
import numpy as np

from app.db.session import get_db
from app.services.biometric_service import BiometricPipelineService
from app.services.registration_service import RegistrationService
from app.services.ml_interfaces import NoseDetector, QualityGate, EmbeddingModel, QualityResult
from app.vector_store.interfaces import VectorStore
from app.storage.interfaces import ImageStorage

# ------------------------------------------------------------------
# Import real Panel implementations
# ------------------------------------------------------------------
from app.services.yolo_detector import YoloNoseDetector
from app.services.quality_gate import ClassicalQualityGate
from app.ml.embedding.inference import BiometricEmbeddingModel
from app.ml.embedding.config import EmbeddingModelConfig
from app.vector_store.faiss_store import FAISSVectorStore

from app.storage.local_storage import LocalFileSystemStorage

# ------------------------------------------------------------------
# Provider functions — wired via FastAPI Depends
# ------------------------------------------------------------------

# ------------------------------------------------------------------
# Global Singletons
# ------------------------------------------------------------------
_detector = YoloNoseDetector()
_quality_gate = ClassicalQualityGate()
from app.core.config import settings

_embedder = BiometricEmbeddingModel(config=EmbeddingModelConfig(
    scaffold_mode=False,
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
from fastapi import Request, HTTPException
import jwt
import os
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
