import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.exceptions import (
    NoDogDetectedError, 
    LowQualityImageError, 
    VectorStoreError,
    DomainException
)

from app.db.session import get_db

class MockAsyncSession:
    def add(self, item): pass
    async def commit(self): pass
    async def rollback(self): pass
    async def close(self): pass
    async def execute(self, *args, **kwargs):
        class MockResult:
            def scalars(self):
                class MockScalars:
                    def first(self): return None
                return MockScalars()
        return MockResult()

async def override_get_db():
    yield MockAsyncSession()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(autouse=True)
def ensure_db_override():
    # Save the original overrides before the test
    original_overrides = app.dependency_overrides.copy()
    yield
    # Restore them exactly as they were
    app.dependency_overrides = original_overrides

@pytest.fixture(scope="module")
def client() -> TestClient:
    with TestClient(app) as c:
        yield c
