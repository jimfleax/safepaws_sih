"""
Panel 6 — Dependency Injection wiring.

Responsibility:
  - Connect interfaces (NoseDetector, QualityGate, EmbeddingModel, VectorStore, ImageStorage)
    to their concrete implementations via FastAPI Depends.
  - Mock providers are available for tests but clearly labeled.
  - Production providers use real Panel 2/3/4/5 implementations once their contracts are locked.

DO NOT copy implementation logic here. Import from owner panels.

Canonical bbox contract: x_min, y_min, x_max, y_max (see ml_interfaces.py BoundingBox).
QualityGate returns QualityResult dataclass — not a bare float.
"""
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
# Import real Panel 2/3/4 implementations (mock stage, not inline copies)
# ------------------------------------------------------------------
# Panel 2 — detector
from app.services.detector import MockNoseDetector

# Panel 3 — embedding
from app.ml.embedding.inference import BiometricEmbeddingModel
from app.ml.embedding.config import EmbeddingModelConfig


# ------------------------------------------------------------------
# Test / development mock providers
# These are used in tests and as fallbacks while real implementations
# are being calibrated. They are clearly identified — never passed off
# as production implementations.
# ------------------------------------------------------------------

class MockQualityGate:
    """
    Mock quality gate for M0 tests.
    Uses canonical QualityResult return type (NOT a bare float).
    Accepts all images by default; returns rejection on mock_low_quality payload.
    """
    async def evaluate(self, image: bytes, bounding_box: dict) -> QualityResult:
        payload = image.decode("utf-8", errors="ignore")
        if "mock_low_quality" in payload:
            return QualityResult(
                accepted=False,
                score=0.25,
                rejection_reason=QualityResult.REASON_BLUR
            )
        return QualityResult(accepted=True, score=0.95)


class MockVectorStore:
    """
    Mock vector store for M0 tests.
    Returns a predictable result for test assertions.
    """
    async def add_vector(self, pet_id: str, vector: np.ndarray) -> bool:
        return True

    async def search(self, vector: np.ndarray, top_k: int = 5) -> List[Tuple[str, float]]:
        return [("mock-pet-id-123", 0.9)]


class MockImageStorage:
    """Mock image storage for M0 tests."""
    async def upload_image(self, file_name: str, file_bytes: bytes, content_type: str) -> str:
        return f"https://mock-storage.com/{file_name}"


# ------------------------------------------------------------------
# Provider functions — wired via FastAPI Depends
# ------------------------------------------------------------------

def get_detector() -> NoseDetector:
    """
    Provides the canonical nose detector.
    Currently: MockNoseDetector (Panel 2, deterministic test mock).
    Future: real YOLO-nano implementation once Panel 2 contract is locked.
    """
    return MockNoseDetector()


def get_quality_gate() -> QualityGate:
    """
    Provides the quality gate.
    Currently: MockQualityGate using correct QualityResult contract.
    Future: real CV quality implementation from Panel 2.
    """
    return MockQualityGate()


def get_embedder() -> EmbeddingModel:
    """
    Provides the embedding model.
    Currently: BiometricEmbeddingModel in scaffold_mode=True (Panel 3).
    Future: scaffold_mode=False with a real trained checkpoint.
    """
    config = EmbeddingModelConfig(scaffold_mode=True)
    return BiometricEmbeddingModel(config=config)


def get_vector_store() -> VectorStore:
    """
    Provides the vector store.
    Currently: MockVectorStore for P0 tests.
    Future: FAISSVectorStore (Panel 4) once its UUID mapping is resolved.
    """
    return MockVectorStore()


def get_image_storage() -> ImageStorage:
    """
    Provides image storage.
    Currently: MockImageStorage.
    Future: real cloud/local storage implementation.
    """
    return MockImageStorage()


# ------------------------------------------------------------------
# Composite service providers
# ------------------------------------------------------------------

def get_biometric_service(
    detector: NoseDetector = Depends(get_detector),
    quality_gate: QualityGate = Depends(get_quality_gate),
    embedder: EmbeddingModel = Depends(get_embedder),
    vector_store: VectorStore = Depends(get_vector_store),
) -> BiometricPipelineService:
    return BiometricPipelineService(detector, quality_gate, embedder, vector_store)


def get_registration_service(
    db: AsyncSession = Depends(get_db),
    biometric_service: BiometricPipelineService = Depends(get_biometric_service),
    storage: ImageStorage = Depends(get_image_storage),
) -> RegistrationService:
    return RegistrationService(db, biometric_service, storage)
