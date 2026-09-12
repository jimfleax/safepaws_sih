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
from app.services.detector import MockNoseDetector
from app.services.quality_gate import ClassicalQualityGate
from app.ml.embedding.inference import BiometricEmbeddingModel
from app.ml.embedding.config import EmbeddingModelConfig
from app.vector_store.faiss_store import FAISSVectorStore

class MockImageStorage:
    """Mock image storage for M0 tests."""
    async def upload_image(self, file_name: str, file_bytes: bytes, content_type: str) -> str:
        return f"https://mock-storage.com/{file_name}"

# ------------------------------------------------------------------
# Provider functions — wired via FastAPI Depends
# ------------------------------------------------------------------

def get_detector() -> NoseDetector:
    # Panel 2 canonical implementation
    return MockNoseDetector()

def get_quality_gate() -> QualityGate:
    # Panel 2 canonical implementation
    return ClassicalQualityGate()

def get_embedder() -> EmbeddingModel:
    # Panel 3 implementation, scaffold_mode=True for M0
    config = EmbeddingModelConfig(scaffold_mode=True)
    return BiometricEmbeddingModel(config=config)

def get_vector_store() -> VectorStore:
    # Panel 4 canonical implementation
    return FAISSVectorStore()

def get_image_storage() -> ImageStorage:
    return MockImageStorage()

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
