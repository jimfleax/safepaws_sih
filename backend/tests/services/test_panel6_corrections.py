import pytest
import numpy as np
from app.services.biometric_service import BiometricPipelineService
from app.services.registration_service import RegistrationService
from app.core.exceptions import InfrastructureError
from app.core.config import Settings
from app.schemas.search import SearchResponse

class MockDetector:
    async def detect(self, image: bytes): return [{"x":0}]
class MockQualityGate:
    async def evaluate(self, image: bytes, bbox: dict): return 0.9
class MockEmbedder:
    async def generate_embedding(self, image: bytes, bbox: dict): return np.array([1.0])

class MockVectorStore:
    def __init__(self, results=None, fail=False):
        self.results = results or []
        self.fail = fail
    async def search(self, vector: np.ndarray, top_k: int = 5):
        if self.fail:
            raise InfrastructureError("Simulated FAISS failure")
        return self.results
    async def add_vector(self, pet_id, vector):
        if self.fail:
            raise InfrastructureError("Simulated FAISS insertion failure")
        return True

class MockDB:
    def __init__(self):
        self.committed = False
        self.rollbacked = False
    async def commit(self): self.committed = True
    async def rollback(self): self.rollbacked = True

class MockStorage:
    async def upload_image(self, name, b, ct): return "url"

@pytest.mark.asyncio
async def test_configurable_thresholds_change_decisions():
    """Prove that changing settings configuration dynamically alters the decision tier."""
    # Custom settings where MATCH is very strict
    test_settings = Settings(MATCH_THRESHOLD=0.99, AMBIGUOUS_THRESHOLD=0.90)
    
    # Store returns 0.95
    store = MockVectorStore([("pet-1", 0.95)])
    service = BiometricPipelineService(MockDetector(), MockQualityGate(), MockEmbedder(), store)
    
    # Inject the mock settings just for this scope by replacing the global import reference or manually passing logic.
    # We will simulate the behavior by overriding the global settings dynamically just to prove it.
    from app.services import biometric_service
    original_settings = biometric_service.settings
    biometric_service.settings = test_settings
    
    try:
        response = await service.identify(b"dummy")
        # Since 0.95 < 0.99 (Match) but >= 0.90 (Ambiguous), we expect AMBIGUOUS
        assert response.status == "AMBIGUOUS"
    finally:
        # Restore
        biometric_service.settings = original_settings

@pytest.mark.asyncio
async def test_infrastructure_failure_not_unknown():
    """Prove that an infrastructure failure (FAISS unavailable) raises 503 and is NOT swallowed as UNKNOWN."""
    store = MockVectorStore(fail=True)
    service = BiometricPipelineService(MockDetector(), MockQualityGate(), MockEmbedder(), store)
    
    with pytest.raises(InfrastructureError):
        await service.identify(b"dummy")

@pytest.mark.asyncio
async def test_normal_no_match_is_unknown():
    """Prove that a normal query with no close matches returns UNKNOWN."""
    store = MockVectorStore([("pet-2", 0.10)]) # Very low score
    service = BiometricPipelineService(MockDetector(), MockQualityGate(), MockEmbedder(), store)
    
    response = await service.identify(b"dummy")
    assert response.status == "UNKNOWN"

@pytest.mark.asyncio
async def test_enrollment_compensation_on_faiss_failure():
    """Prove that DB is compensated (rolled back) if FAISS insertion fails."""
    db = MockDB()
    # Mocking vector store to fail insertion
    store = MockVectorStore(fail=True)
    pipeline = BiometricPipelineService(MockDetector(), MockQualityGate(), MockEmbedder(), store)
    service = RegistrationService(db, pipeline, MockStorage())
    
    with pytest.raises(InfrastructureError) as exc:
        await service.enroll_image("pet-1", "file.jpg", b"dummy", "image/jpeg")
        
    assert "Enrollment compensation triggered" in str(exc.value)
    # The database transaction should NOT be committed
    assert not db.committed
    # The database transaction SHOULD be rolled back
    assert db.rollbacked
