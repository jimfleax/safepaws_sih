import pytest
from fastapi.testclient import TestClient
import jwt
from datetime import datetime, timedelta
import os
from unittest.mock import patch, MagicMock

from app.main import app
from app.db.models import Owner, Pet
from app.api.dependencies import get_db, get_current_owner

SECRET_KEY = os.getenv('JWT_SECRET', 'supersecret')

def test_update_profile_unauthorized(client: TestClient):
    response = client.put(
        "/api/users/profile",
        json={"phone": "12345", "neighborhood": "Test"}
    )
    assert response.status_code == 401
    assert response.json() == {"detail": "Not authenticated"}

def test_google_login_no_token(client: TestClient):
    response = client.post(
        "/api/auth/google",
        json={"token": ""}
    )
    assert response.status_code in (422, 400)

class StatefulMockSession:
    def __init__(self):
        self.owners = {}
        self.pets = {}
        self.added = []
    
    def add(self, item):
        self.added.append(item)
        if isinstance(item, Owner):
            self.owners[item.id] = item
        if isinstance(item, Pet):
            self.pets[item.id] = item
            
    async def commit(self): pass
    async def rollback(self): pass
    async def close(self): pass
    async def refresh(self, item): pass
    
    async def execute(self, stmt, *args, **kwargs):
        class MockResult:
            def __init__(self, items):
                self.items = items
            def scalars(self):
                class MockScalars:
                    def __init__(self, items):
                        self.items = items
                    def first(self):
                        return self.items[0] if self.items else None
                return MockScalars(self.items)
        
        stmt_str = str(stmt).lower()
        if "owners" in stmt_str:
            return MockResult(list(self.owners.values()))
        if "pets" in stmt_str:
            return MockResult(list(self.pets.values()))
        return MockResult([])

# Global state to inspect after tests
last_mock_session = None

def get_stateful_db():
    global last_mock_session
    session = StatefulMockSession()
    # Pre-seed an owner for auth tests
    owner = Owner(id="mock-google-123", name="Mock", email="mock@test.com", phone="000")
    session.owners[owner.id] = owner
    last_mock_session = session
    yield session

@pytest.fixture
def stateful_client():
    app.dependency_overrides[get_db] = get_stateful_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()

def test_authenticated_profile_update(stateful_client: TestClient):
    global last_mock_session
    token = jwt.encode(
        {"userId": "mock-google-123", "exp": datetime.utcnow() + timedelta(hours=1)},
        SECRET_KEY,
        algorithm="HS256"
    )
    response = stateful_client.put(
        "/api/users/profile",
        json={"phone": "999-999", "neighborhood": "New Hood"},
        cookies={"jwt": token}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["phone"] == "999-999"
    assert data["neighborhood"] == "New Hood"
    assert data["id"] == "mock-google-123"

def test_pet_registration_links_to_authenticated_owner(stateful_client: TestClient):
    global last_mock_session
    token = jwt.encode(
        {"userId": "mock-google-123", "exp": datetime.utcnow() + timedelta(hours=1)},
        SECRET_KEY,
        algorithm="HS256"
    )
    pet_data = {
        "name": "Buddy",
        "species": "dog",
        "breed": "Golden Retriever",
        "color": "Golden",
        "age": "3",
        "owner_name": "Mock",
        "owner_phone": "999-999",
        "neighborhood": "New Hood",
        "consent_given": True,
    }
    
    # Authenticated pet registration
    response = stateful_client.post(
        "/api/v1/pets/register",
        json=pet_data,
        cookies={"jwt": token}
    )
    assert response.status_code == 201
    
    # Assert no duplicate owner was created
    added_owners = [item for item in last_mock_session.added if isinstance(item, Owner)]
    assert len(added_owners) == 0  # Should use existing owner
    
    added_pets = [item for item in last_mock_session.added if isinstance(item, Pet)]
    assert len(added_pets) == 1
    assert added_pets[0].owner_id == "mock-google-123"

def test_unauthenticated_pet_registration_returns_401(stateful_client: TestClient):
    global last_mock_session
    pet_data = {
        "name": "Stray",
        "species": "cat",
        "breed": "Mix",
        "color": "Black",
        "age": "1",
        "owner_name": "Anon",
        "owner_phone": "111-111",
        "neighborhood": "Old Hood",
        "consent_given": True,
    }
    response_unauth = stateful_client.post("/api/v1/pets/register", json=pet_data)
    assert response_unauth.status_code == 401
    pass

def test_profile_completed_logic(client: TestClient):
    def get_mock_owner_missing_both():
        return Owner(id="mock-1", name="Mock", phone=None, neighborhood=None)
    def get_mock_owner_missing_hood():
        return Owner(id="mock-2", name="Mock", phone="123", neighborhood="")
    def get_mock_owner_missing_phone():
        return Owner(id="mock-3", name="Mock", phone="", neighborhood="Hood")
    def get_mock_owner_both():
        return Owner(id="mock-4", name="Mock", phone="123", neighborhood="Hood")
        
    # 1. Missing phone, missing neighborhood
    app.dependency_overrides[get_current_owner] = get_mock_owner_missing_both
    res1 = client.get("/api/auth/me")
    assert res1.json()["profileCompleted"] is False

    # 2. Missing neighborhood
    app.dependency_overrides[get_current_owner] = get_mock_owner_missing_hood
    res2 = client.get("/api/auth/me")
    assert res2.json()["profileCompleted"] is False

    # 3. Missing phone
    app.dependency_overrides[get_current_owner] = get_mock_owner_missing_phone
    res3 = client.get("/api/auth/me")
    assert res3.json()["profileCompleted"] is False

    # 4. Both present -> true
    app.dependency_overrides[get_current_owner] = get_mock_owner_both
    res4 = client.get("/api/auth/me")
    assert res4.json()["profileCompleted"] is True
    
    app.dependency_overrides.pop(get_current_owner, None)

