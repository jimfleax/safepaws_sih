import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.exceptions import (
    NoDogDetectedError, 
    LowQualityImageError, 
    VectorStoreError,
    DomainException
)

@pytest.fixture(scope="module")
def client() -> TestClient:
    with TestClient(app) as c:
        yield c
