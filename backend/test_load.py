import asyncio

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app.db.models import Alert, Pet


async def main():
    engine = create_async_engine("postgresql+asyncpg://postgres:postgres@localhost:5432/safepaws")
    async with AsyncSession(engine) as session:
        stmt = select(Alert).options(
            selectinload(Alert.sightings), 
            selectinload(Alert.pet).selectinload(Pet.photos)
        )
        alerts = (await session.execute(stmt)).scalars().all()
        for a in alerts:
            print(a.photo_url)
asyncio.run(main())
