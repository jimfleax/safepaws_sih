import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text

async def check():
    engine = create_async_engine("postgresql+asyncpg://postgres:postgres@localhost:5432/safepaws")
    async with engine.connect() as conn:
        res = await conn.execute(text("SELECT id, status FROM pets WHERE id = 'test-pet-journey'"))
        for row in res:
            print("PET STATUS:", row[1])

if __name__ == '__main__':
    asyncio.run(check())
