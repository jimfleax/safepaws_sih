import pytest
import numpy as np
from app.services.biometric_service import BiometricPipelineService
from app.schemas.search import SearchResponse
from app.core.config import settings
from app.services.ml_interfaces import QualityResult

class MockDetector:
    async def detect(self, image: bytes):
        return [{"x_min": 0, "y_min": 0, "x_max": 10, "y_max": 10, "confidence": 0.98}]

class MockQualityGate:
    async def evaluate(self, image: bytes, bbox: dict) -> QualityResult:
        return QualityResult(accepted=True, score=0.9)

class MockEmbedder:
    async def generate_embedding(self, image: bytes, bbox: dict): return np.array([1.0])

class MockVectorStore:
    def __init__(self, results):
        self.results = results
    async def search(self, vector: np.ndarray, top_k: int = 5):
        return self.results

@pytest.mark.asyncio
async def test_identify_match():
    store = MockVectorStore([("pet-1", settings.MATCH_THRESHOLD + 0.05)])
    service = BiometricPipelineService(MockDetector(), MockQualityGate(), MockEmbedder(), store)
    
    response = await service.identify(b"dummy")
    assert response.status == "MATCH"
    assert response.matches[0].pet_id == "pet-1"

@pytest.mark.asyncio
async def test_identify_ambiguous():
    store = MockVectorStore([("pet-2", settings.AMBIGUOUS_THRESHOLD + 0.05)])
    service = BiometricPipelineService(MockDetector(), MockQualityGate(), MockEmbedder(), store)
    
    response = await service.identify(b"dummy")
    assert response.status == "AMBIGUOUS"

@pytest.mark.asyncio
async def test_identify_unknown():
    store = MockVectorStore([("pet-3", settings.AMBIGUOUS_THRESHOLD - 0.1)])
    service = BiometricPipelineService(MockDetector(), MockQualityGate(), MockEmbedder(), store)
    
    response = await service.identify(b"dummy")
    assert response.status == "UNKNOWN"
