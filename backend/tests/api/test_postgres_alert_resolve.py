import pytest
import asyncio
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from app.db.models import Pet, Alert, Owner
from app.main import app
from app.api.dependencies import get_current_owner, get_db
import uuid

@pytest.mark.asyncio
async def test_real_postgres_alert_resolve_authorization():
    engine = create_async_engine("postgresql+asyncpg://postgres:postgres@localhost:5432/safepaws", echo=False)
    TestingSessionLocal = sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )
    
    owner_1_id = f"test-owner-{uuid.uuid4()}"
    owner_2_id = f"test-owner-{uuid.uuid4()}"
    pet_id = f"test-pet-{uuid.uuid4()}"
    alert_id = f"test-alert-{uuid.uuid4()}"
    
    async with TestingSessionLocal() as session:
        # Create test data directly in DB
        o1 = Owner(id=owner_1_id, name="Owner 1", email=f"{owner_1_id}@test.com", phone="123")
        o2 = Owner(id=owner_2_id, name="Owner 2", email=f"{owner_2_id}@test.com", phone="456")
        session.add(o1)
        session.add(o2)
        
        p = Pet(id=pet_id, owner_id=owner_1_id, name="Test Pet", species="Dog")
        session.add(p)
        
        a = Alert(id=alert_id, pet_id=pet_id, status="active", description="Test")
        session.add(a)
        await session.commit()

        from app.api.v1.endpoints.alerts import resolve_alert
        from fastapi import HTTPException
        
        # 1. Simulate Owner 2 (Different Owner) -> 403
        try:
            await resolve_alert(alert_id=alert_id, db=session, current_owner=o2)
            assert False, "Should have raised 403 HTTPException"
        except HTTPException as e:
            assert e.status_code == 403
            assert "Not authorized" in e.detail
            
        # 2. Simulate Owner 1 (Correct Owner) -> 200
        resolved_alert = await resolve_alert(alert_id=alert_id, db=session, current_owner=o1)
        assert resolved_alert.status == "resolved"
        
    # Clean up
    async with TestingSessionLocal() as session:
        await session.execute(Alert.__table__.delete().where(Alert.id == alert_id))
        await session.execute(Pet.__table__.delete().where(Pet.id == pet_id))
        await session.execute(Owner.__table__.delete().where(Owner.id.in_([owner_1_id, owner_2_id])))
        await session.commit()

