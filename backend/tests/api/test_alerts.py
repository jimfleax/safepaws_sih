import pytest
from httpx import AsyncClient
from app.db.models import Pet, Alert, Owner
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, timedelta
import jwt
from app.core.config import settings

@pytest.fixture
def create_token():
    def _create_token(user_id: str):
        expire = datetime.utcnow() + timedelta(hours=1)
        to_encode = {"userId": user_id, "exp": expire}
        return jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    return _create_token

@pytest.mark.asyncio
async def test_owner_can_resolve_own_alert(async_client: AsyncClient, db_session: AsyncSession, create_token):
    # Create owner
    owner = Owner(id="owner_1", name="Owner 1", email="owner1@test.com", phone="123")
    db_session.add(owner)
    
    # Create pet
    pet = Pet(id="pet_1", owner_id="owner_1", name="Fido", species="Dog", status="lost")
    db_session.add(pet)
    
    # Create alert
    alert = Alert(id="alert_1", pet_id="pet_1", status="active")
    db_session.add(alert)
    await db_session.commit()
    
    token = create_token("owner_1")
    response = await async_client.put(
        "/api/v1/alerts/alert_1/resolve",
        cookies={"auth_token": token}
    )
    
    assert response.status_code == 200
    assert response.json()["status"] == "resolved"

@pytest.mark.asyncio
async def test_authenticated_non_owner_cannot_resolve_alert(async_client: AsyncClient, db_session: AsyncSession, create_token):
    # Create owner 1
    owner1 = Owner(id="owner_1_b", name="Owner 1", email="owner1b@test.com", phone="123")
    db_session.add(owner1)
    
    # Create owner 2 (imposter)
    owner2 = Owner(id="owner_2_b", name="Owner 2", email="owner2b@test.com", phone="456")
    db_session.add(owner2)
    
    # Create pet for owner 1
    pet = Pet(id="pet_1_b", owner_id="owner_1_b", name="Fido", species="Dog", status="lost")
    db_session.add(pet)
    
    # Create alert
    alert = Alert(id="alert_1_b", pet_id="pet_1_b", status="active")
    db_session.add(alert)
    await db_session.commit()
    
    # Try resolving with owner 2's token
    token = create_token("owner_2_b")
    response = await async_client.put(
        "/api/v1/alerts/alert_1_b/resolve",
        cookies={"auth_token": token}
    )
    
    assert response.status_code == 403

@pytest.mark.asyncio
async def test_anonymous_cannot_resolve_alert(async_client: AsyncClient, db_session: AsyncSession):
    # Create owner
    owner = Owner(id="owner_1_c", name="Owner 1", email="owner1c@test.com", phone="123")
    db_session.add(owner)
    
    # Create pet
    pet = Pet(id="pet_1_c", owner_id="owner_1_c", name="Fido", species="Dog", status="lost")
    db_session.add(pet)
    
    # Create alert
    alert = Alert(id="alert_1_c", pet_id="pet_1_c", status="active")
    db_session.add(alert)
    await db_session.commit()
    
    # No auth token
    response = await async_client.put(
        "/api/v1/alerts/alert_1_c/resolve"
    )
    
    assert response.status_code == 401

@pytest.mark.asyncio
async def test_missing_alert_returns_404(async_client: AsyncClient, db_session: AsyncSession, create_token):
    owner = Owner(id="owner_1_d", name="Owner 1", email="owner1d@test.com", phone="123")
    db_session.add(owner)
    await db_session.commit()
    
    token = create_token("owner_1_d")
    response = await async_client.put(
        "/api/v1/alerts/non_existent_alert/resolve",
        cookies={"auth_token": token}
    )
    
    assert response.status_code == 404
