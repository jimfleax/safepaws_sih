import pytest
import pytest_asyncio
from app.services.registration_service import RegistrationService
from app.schemas.pet import PetCreate
from app.core.exceptions import InfrastructureError

class MockBiometricService:
    def __init__(self, fail_faiss=False):
        self.fail_faiss = fail_faiss
        self.vector_store = self
        self.embedder = self
        self.is_scaffold_mode = True
        
    async def _process_image(self, b): return b"emb"
    async def add_vector(self, pet_id, emb):
        if self.fail_faiss:
            return False
        return True

class MockStorage:
    async def upload_image(self, name, b, ct): return "url"

class MockDB:
    def __init__(self):
        self.committed = False
        self.rollbacked = False
    async def commit(self): self.committed = True
    async def rollback(self): self.rollbacked = True

@pytest.mark.asyncio
async def test_enroll_success():
    db = MockDB()
    service = RegistrationService(db, MockBiometricService(), MockStorage())
    
    res = await service.enroll_image("pet-1", "file.jpg", b"dummy", "image/jpeg")
    assert res["status"] == "success"
    assert db.committed is True
    assert db.rollbacked is False

@pytest.mark.asyncio
async def test_enroll_faiss_failure_rollback():
    db = MockDB()
    service = RegistrationService(db, MockBiometricService(fail_faiss=True), MockStorage())
    
    with pytest.raises(InfrastructureError) as exc:
        await service.enroll_image("pet-1", "file.jpg", b"dummy", "image/jpeg")
        
    assert "Enrollment compensation triggered" in str(exc.value)
    assert db.committed is False
    assert db.rollbacked is True
