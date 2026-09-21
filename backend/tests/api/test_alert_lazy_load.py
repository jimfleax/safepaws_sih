import pytest
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from app.db.models import Alert, Pet

@pytest.mark.asyncio
async def test_alert_photo_url_eager_loading():
    """
    Regression test for MissingGreenlet error on Alert.photo_url.
    Tests against the actual dev Postgres DB to avoid SQLite ARRAY type issues.
    """
    engine = create_async_engine("postgresql+asyncpg://postgres:postgres@localhost:5432/safepaws", echo=False)
    TestingSessionLocal = sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )
    
    async with TestingSessionLocal() as session:
        # Just query the DB with the explicit statement to ensure it doesn't crash on serialization
        stmt = select(Alert).options(
            selectinload(Alert.sightings), 
            selectinload(Alert.pet).selectinload(Pet.photos)
        )
        alerts = (await session.execute(stmt)).scalars().all()
        
        # Iterating and accessing photo_url should not raise MissingGreenlet
        for fetched_alert in alerts:
            url = fetched_alert.photo_url
            assert isinstance(url, str)
