from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Tuple
import numpy as np

from app.db.session import get_db
from app.services.biometric_service import BiometricPipelineService
from app.services.registration_service import RegistrationService

from app.services.ml_interfaces import NoseDetector, QualityGate, EmbeddingModel
from app.vector_store.interfaces import VectorStore
from app.storage.interfaces import ImageStorage

# --- Mock Implementations for P0 ---
class MockNoseDetector:
    async def detect(self, image: bytes) -> List[dict]:
        return [{"x": 0, "y": 0, "w": 100, "h": 100}]

class MockQualityGate:
    async def evaluate(self, image: bytes, bounding_box: dict) -> float:
        return 0.95

class MockEmbeddingModel:
    async def generate_embedding(self, image: bytes, bounding_box: dict) -> np.ndarray:
        return np.random.rand(128).astype('float32')

class MockVectorStore:
    async def add_vector(self, pet_id: str, vector: np.ndarray) -> bool:
        return True

    async def search(self, vector: np.ndarray, top_k: int = 5) -> List[Tuple[str, float]]:
        return [("mock-pet-id-123", 0.9)]

class MockImageStorage:
    async def upload_image(self, file_name: str, file_bytes: bytes, content_type: str) -> str:
        return f"https://mock-storage.com/{file_name}"
# -----------------------------------

def get_detector() -> NoseDetector:
    return MockNoseDetector()

def get_quality_gate() -> QualityGate:
    return MockQualityGate()

def get_embedder() -> EmbeddingModel:
    return MockEmbeddingModel()

def get_vector_store() -> VectorStore:
    return MockVectorStore()

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
