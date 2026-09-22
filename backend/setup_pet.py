import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
from datetime import datetime, timedelta

async def setup():
    engine = create_async_engine("postgresql+asyncpg://postgres:postgres@localhost:5432/safepaws")
    async with engine.connect() as db:
        pet_id = "test-pet-journey"
        owner_id = "test-owner-journey"
        qr_tag = "QR-JOURNEY-123"

        await db.execute(text(f"DELETE FROM sightings WHERE alert_id IN (SELECT id FROM alerts WHERE pet_id = '{pet_id}')"))
        await db.execute(text(f"DELETE FROM alerts WHERE pet_id = '{pet_id}'"))
        await db.execute(text(f"DELETE FROM pet_photos WHERE pet_id = '{pet_id}'"))
        await db.execute(text(f"DELETE FROM pets WHERE id = '{pet_id}'"))
        await db.execute(text(f"INSERT INTO pets (id, owner_id, name, species, breed, status, qr_tag_id, created_at) VALUES ('{pet_id}', '{owner_id}', 'Journey Dog', 'dog', 'Mix', 'safe', '{qr_tag}', '{datetime.utcnow().isoformat()}')"))
        await db.commit()

if __name__ == '__main__':
    asyncio.run(setup())
