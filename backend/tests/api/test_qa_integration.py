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
        "consent_given": True
    }
    response = client.post("/api/v1/pets/register", json=pet_data)
    assert response.status_code == 201

# 16. Invalid consent
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
        "consent_given": False
    }
    response = client.post("/api/v1/pets/register", json=pet_data)
    assert response.status_code == 403
    assert response.json()["detail"] == "Consent is required for registration"

# 17. Oversized file
def test_oversized_file(client: TestClient):
    # 6MB file
    large_file = io.BytesIO(b"0" * (6 * 1024 * 1024))
    response = client.post(
        "/api/v1/pets/mock-pet-id-123/enroll-image",
        files={"file": ("large.jpg", large_file, "image/jpeg")}
    )
    assert response.status_code == 413
    assert response.json()["detail"] == "File too large"

# 18. Unsupported file type
def test_unsupported_file_type(client: TestClient):
    pdf_file = io.BytesIO(b"fake pdf content")
    response = client.post(
        "/api/v1/pets/identify",
        files={"file": ("document.pdf", pdf_file, "application/pdf")}
    )
    assert response.status_code == 415
    assert response.json()["detail"] == "Unsupported file type"

# M0 Scaffold Tests for Search/Verify
def test_identify_scaffold_response(client: TestClient):
    img = io.BytesIO(b"fake image data")
    response = client.post(
        "/api/v1/pets/identify",
        files={"file": ("image.jpg", img, "image/jpeg")}
    )
    assert response.status_code == 200
    assert response.json()["status"] == "MATCH"

def test_verify_scaffold_response(client: TestClient):
    img = io.BytesIO(b"fake image data")
    response = client.post(
        "/api/v1/pets/verify?pet_id=mock-pet-id-123",
        files={"file": ("image.jpg", img, "image/jpeg")}
    )
    assert response.status_code == 200
    assert response.json()["status"] == "MATCH"
