import asyncio
import jwt
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text

DATABASE_URL = "postgresql+asyncpg://postgres:postgres@localhost:5432/safepaws"
engine = create_async_engine(DATABASE_URL, echo=False)
async_session = sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)

async def setup():
    owner_id = "test-owner-journey"
    
    async with async_session() as db:
        await db.execute(text(f"DELETE FROM alerts WHERE pet_id IN (SELECT id FROM pets WHERE owner_id = '{owner_id}')"))
        await db.execute(text(f"DELETE FROM pets WHERE owner_id = '{owner_id}'"))
        await db.execute(text(f"DELETE FROM owners WHERE id = '{owner_id}'"))
        
        await db.execute(text(f"INSERT INTO owners (id, name, email, phone, neighborhood, created_at) VALUES ('{owner_id}', 'Journey Tester', 'journey@example.com', '555-0000', 'Downtown', '{datetime.utcnow().isoformat()}')"))
        await db.commit()
        
    exp = datetime.utcnow() + timedelta(days=30)
    jwt_payload = {
        "userId": owner_id,
        "tokenVersion": 0,
        "exp": exp
    }
    token = jwt.encode(jwt_payload, 'supersecret', algorithm="HS256")
    print(token)

asyncio.run(setup())
