from fastapi.testclient import TestClient
from fastapi import APIRouter
from app.main import app
from app.core.exceptions import NoDogDetectedError

# Add a temporary test route to trigger the exception
router = APIRouter()
@router.get("/trigger-error")
async def trigger_error():
    raise NoDogDetectedError(message="Custom no dog error")

app.include_router(router)

def test_no_dog_detected_error_serialization(client: TestClient):
    response = client.get("/trigger-error")
    assert response.status_code == 400
    data = response.json()
    assert data["error_code"] == "NO_DOG_DETECTED"
    assert data["message"] == "Custom no dog error"
    assert "details" in data
