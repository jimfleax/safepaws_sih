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
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Buddy"
    assert "id" in data


def test_get_pet_not_found(client: TestClient):
    """
    GET /pets/{id} returns 404 for all IDs until Panel 5 DB integration is wired.
    Previously this tested a hardcoded mock — now it correctly tests the scaffold 404.
    """
    response = client.get("/api/v1/pets/mock-pet-id-123")
    assert response.status_code == 404


def test_get_pet_not_found_special(client: TestClient):
    response = client.get("/api/v1/pets/not-found")
    assert response.status_code == 404
