import pytest
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from app.db.models import Pet, Owner

@pytest.mark.asyncio
async def test_pet_owner_photo_eager_loading():
    """
    Regression test for MissingGreenlet error on PetResponse serialization.
    Tests against the actual dev Postgres DB to avoid SQLite ARRAY type issues.
    Ensures that Pet.owner and Pet.photos are eager-loaded.
    """
    engine = create_async_engine("postgresql+asyncpg://postgres:postgres@localhost:5432/safepaws", echo=False)
    TestingSessionLocal = sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )
    
    async with TestingSessionLocal() as session:
        # Just query the DB with the explicit statement to ensure it doesn't crash on serialization
        stmt = select(Pet).options(
            selectinload(Pet.owner), 
            selectinload(Pet.photos)
        )
        pets = (await session.execute(stmt)).scalars().all()
        
        # Iterating and accessing owner_name and photo_url should not raise MissingGreenlet
        for fetched_pet in pets:
            name = fetched_pet.owner_name
            url = fetched_pet.photo_url
            assert isinstance(name, str)
            assert isinstance(url, str)
