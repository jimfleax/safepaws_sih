import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.api.dependencies import get_db, get_current_owner
from app.db.models import Pet, Alert, Owner
import datetime

# Clean up any overrides from conftest that might interfere
# But we will inject our own overrides

def setup_app_overrides(current_user: Owner, pet: Pet, alert: Alert):
    class MockResult:
        def __init__(self, val):
            self.val = val
        def scalars(self):
            class MockScalars:
                def __init__(self, val): self.val = val
                def first(self): return self.val
                def all(self): return [self.val] if self.val else []
            return MockScalars(self.val)
            
    class CustomMockSession:
        def __init__(self, alert, pet):
            self.alert = alert
            self.pet = pet
            self.committed = False
            
        def add(self, item): pass
        async def commit(self):
            self.committed = True
        async def refresh(self, item): pass
        async def rollback(self): pass
        async def close(self): pass
        
        async def execute(self, stmt):
            stmt_str = str(stmt).lower()
            if "alerts" in stmt_str:
                return MockResult(self.alert)
            if "pets" in stmt_str:
                return MockResult(self.pet)
            return MockResult(None)

    async def override_get_db():
        yield CustomMockSession(alert, pet)

    async def override_get_current_owner():
        if current_user is None:
            from fastapi import HTTPException
            raise HTTPException(status_code=401, detail="Not authenticated")
        return current_user

    app.dependency_overrides[get_db] = override_get_db
    app.dependency_overrides[get_current_owner] = override_get_current_owner

def teardown_app_overrides():
    app.dependency_overrides.clear()

def test_owner_can_resolve_own_alert(client: TestClient):
    owner = Owner(id="owner_1")
    pet = Pet(id="pet_1", owner_id="owner_1", status="lost")
    alert = Alert(id="alert_1", pet_id="pet_1", status="active", created_at=datetime.datetime.utcnow(), updated_at=datetime.datetime.utcnow())
    
    setup_app_overrides(owner, pet, alert)
    try:
        response = client.put("/api/v1/alerts/alert_1/resolve")
        assert response.status_code == 200
        assert response.json()["status"] == "resolved"
    finally:
        teardown_app_overrides()

def test_authenticated_non_owner_cannot_resolve_alert(client: TestClient):
    owner_imposter = Owner(id="owner_2")
    pet = Pet(id="pet_1", owner_id="owner_1", status="lost")
    alert = Alert(id="alert_1", pet_id="pet_1", status="active", created_at=datetime.datetime.utcnow(), updated_at=datetime.datetime.utcnow())
    
    setup_app_overrides(owner_imposter, pet, alert)
    try:
        response = client.put("/api/v1/alerts/alert_1/resolve")
        assert response.status_code == 403
    finally:
        teardown_app_overrides()

def test_anonymous_cannot_resolve_alert(client: TestClient):
    pet = Pet(id="pet_1", owner_id="owner_1", status="lost")
    alert = Alert(id="alert_1", pet_id="pet_1", status="active", created_at=datetime.datetime.utcnow(), updated_at=datetime.datetime.utcnow())

    
    setup_app_overrides(None, pet, alert)
    try:
        response = client.put("/api/v1/alerts/alert_1/resolve")
        assert response.status_code == 401
    finally:
        teardown_app_overrides()

def test_missing_alert_returns_404(client: TestClient):
    owner = Owner(id="owner_1")
    pet = Pet(id="pet_1", owner_id="owner_1", status="lost")
    # Alert is None
    setup_app_overrides(owner, pet, None)
    try:
        response = client.put("/api/v1/alerts/alert_1/resolve")
        assert response.status_code == 404
    finally:
        teardown_app_overrides()
