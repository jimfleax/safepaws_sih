import asyncio
from sqlalchemy.orm import selectinload
from sqlalchemy.future import select
from app.db.models import Alert, Pet
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession

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
