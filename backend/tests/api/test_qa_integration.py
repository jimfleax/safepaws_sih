import pytest
from fastapi.testclient import TestClient
from app.main import app
import io

@pytest.fixture(scope="module")
def client() -> TestClient:
    with TestClient(app) as c:
        yield c

# 1. Health
def test_health(client: TestClient):
    response = client.get("/api/v1/health/")
    assert response.status_code == 200

# 2. Valid registration
def test_valid_registration(client: TestClient):
    pet_data = {
        "name": "Buddy",
        "species": "dog",
        "breed": "Golden Retriever",
        "color": "Golden",
        "age": "3",
        "owner_name": "Alice",
        "owner_phone": "555-0100",
        "neighborhood": "Uptown",
        "consent_given": True,
    }
    response = client.post("/api/v1/pets/register", json=pet_data)
    assert response.status_code == 201

# 16. Invalid consent — now maps to 400 (not 403).
# Rationale: consent_given=False is a malformed/invalid request at the data level,
# not an authorization failure. 400 is semantically correct per the error contract.
def test_invalid_consent(client: TestClient):
    pet_data = {
        "name": "Buddy",
        "species": "dog",
        "breed": "Golden Retriever",
        "color": "Golden",
        "age": "3",
        "owner_name": "Alice",
        "owner_phone": "555-0100",
        "neighborhood": "Uptown",
        "consent_given": False,
    }
    response = client.post("/api/v1/pets/register", json=pet_data)
    assert response.status_code == 400
    assert "consent" in response.json()["detail"].lower()

# 17. Oversized file — error message now includes size note.
def test_oversized_file(client: TestClient):
    large_file = io.BytesIO(b"0" * (6 * 1024 * 1024))
    response = client.post(
        "/api/v1/pets/mock-pet-id-123/enroll-image",
        files={"file": ("large.jpg", large_file, "image/jpeg")},
    )
    assert response.status_code == 413
    assert "too large" in response.json()["detail"].lower()

# 18. Unsupported file type
def test_unsupported_file_type(client: TestClient):
    pdf_file = io.BytesIO(b"fake pdf content")
    response = client.post(
        "/api/v1/pets/identify",
        files={"file": ("document.pdf", pdf_file, "application/pdf")},
    )
    assert response.status_code == 415
    assert "unsupported" in response.json()["detail"].lower()

# M0 Scaffold Tests for Search/Verify
# The real MockVectorStore in dependencies returns ("mock-pet-id-123", 0.9)
# which is >= MATCH_THRESHOLD(0.85), so status == "MATCH" is still expected.
# We override the embedder so fake bytes don't fail PIL decode in scaffold path.
def test_identify_scaffold_response(client: TestClient):
    import numpy as np
    from app.api import dependencies
    from app.services.ml_interfaces import QualityResult

    class _FakeEmbedder:
        async def generate_embedding(self, image: bytes, bbox: dict):
            return np.random.rand(128).astype("float32")

    class _FakeDetector:
        async def detect(self, image: bytes):
            return [{"x_min": 0, "y_min": 0, "x_max": 10, "y_max": 10, "confidence": 0.98}]

    class _FakeQuality:
        async def evaluate(self, image: bytes, bbox: dict) -> QualityResult:
            return QualityResult(accepted=True, score=0.95)

    class _FakeVectorStore:
        async def add_vector(self, pet_id: str, vector: np.ndarray): return True
        async def search(self, vector: np.ndarray, top_k: int): return [("mock-pet-id-123", 0.9)]
        async def remove_vector(self, pet_id: str): return True
        async def rebuild(self, vectors): return True

    app.dependency_overrides[dependencies.get_embedder] = lambda: _FakeEmbedder()
    app.dependency_overrides[dependencies.get_detector] = lambda: _FakeDetector()
    app.dependency_overrides[dependencies.get_quality_gate] = lambda: _FakeQuality()
    app.dependency_overrides[dependencies.get_vector_store] = lambda: _FakeVectorStore()

    img = io.BytesIO(b"fake image data")
    try:
        response = client.post(
            "/api/v1/pets/identify",
            files={"file": ("image.jpg", img, "image/jpeg")},
        )
        assert response.status_code == 200
        assert response.json()["status"] == "MATCH"
    finally:
        app.dependency_overrides.clear()


def test_verify_scaffold_response(client: TestClient):
    import numpy as np
    from app.api import dependencies
    from app.services.ml_interfaces import QualityResult

    class _FakeEmbedder:
        async def generate_embedding(self, image: bytes, bbox: dict):
            return np.random.rand(128).astype("float32")

    class _FakeDetector:
        async def detect(self, image: bytes):
            return [{"x_min": 0, "y_min": 0, "x_max": 10, "y_max": 10, "confidence": 0.98}]

    class _FakeQuality:
        async def evaluate(self, image: bytes, bbox: dict) -> QualityResult:
            return QualityResult(accepted=True, score=0.95)

    class _FakeVectorStore:
        async def add_vector(self, pet_id: str, vector: np.ndarray): return True
        async def search(self, vector: np.ndarray, top_k: int): return [("mock-pet-id-123", 0.9)]
        async def remove_vector(self, pet_id: str): return True
        async def rebuild(self, vectors): return True

    app.dependency_overrides[dependencies.get_embedder] = lambda: _FakeEmbedder()
    app.dependency_overrides[dependencies.get_detector] = lambda: _FakeDetector()
    app.dependency_overrides[dependencies.get_quality_gate] = lambda: _FakeQuality()
    app.dependency_overrides[dependencies.get_vector_store] = lambda: _FakeVectorStore()

    img = io.BytesIO(b"fake image data")
    try:
        response = client.post(
            "/api/v1/pets/verify?pet_id=mock-pet-id-123",
            files={"file": ("image.jpg", img, "image/jpeg")},
        )
        assert response.status_code == 200
        assert response.json()["status"] == "MATCH"
    finally:
        app.dependency_overrides.clear()
