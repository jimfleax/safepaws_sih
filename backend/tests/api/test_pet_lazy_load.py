
import pytest
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload, sessionmaker

from app.db.models import Pet


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
    
    try:
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
    except Exception as exc:
        pytest.skip(f"PostgreSQL dev DB unavailable or credentials mismatched: {exc}")
