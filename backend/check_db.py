import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text

DATABASE_URL = "postgresql+asyncpg://postgres:postgres@localhost:5432/safepaws"
engine = create_async_engine(DATABASE_URL, echo=False)
async_session = sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)

async def check_db():
    async with async_session() as db:
        print("\n--- ALERTS ---")
        alerts = await db.execute(text("SELECT id, status, pet_id FROM alerts WHERE pet_id = 'test-pet-journey'"))
        for row in alerts:
            print(row)
            
        print("\n--- SIGHTINGS ---")
        sightings = await db.execute(text("SELECT s.id, s.alert_id, s.notes FROM sightings s JOIN alerts a ON s.alert_id = a.id WHERE a.pet_id = 'test-pet-journey'"))
        for row in sightings:
            print(row)

asyncio.run(check_db())
