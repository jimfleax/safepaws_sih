from fastapi.testclient import TestClient


def test_register_pet(client: TestClient):
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
    assert response.status_code == 401


def test_get_pet_not_found(client: TestClient):
    """
    GET /pets/{id} returns 404 for all non-existent IDs for an authenticated owner.
    """
    from app.api.dependencies import get_current_owner
    from app.db.models import Owner
    from app.main import app

    app.dependency_overrides[get_current_owner] = lambda: Owner(id="mock-owner", name="Mock", phone="123")
    try:
        response = client.get("/api/v1/pets/mock-pet-id-123")
        assert response.status_code == 404
    finally:
        app.dependency_overrides.pop(get_current_owner, None)


def test_get_pet_not_found_special(client: TestClient):
    from app.api.dependencies import get_current_owner
    from app.db.models import Owner
    from app.main import app

    app.dependency_overrides[get_current_owner] = lambda: Owner(id="mock-owner", name="Mock", phone="123")
    try:
        response = client.get("/api/v1/pets/not-found")
        assert response.status_code == 404
    finally:
        app.dependency_overrides.pop(get_current_owner, None)
