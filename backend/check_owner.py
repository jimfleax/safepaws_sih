import asyncio
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine

async def check():
    engine = create_async_engine('postgresql+asyncpg://postgres:postgres@localhost:5432/safepaws')
    async with engine.connect() as conn:
        result = await conn.execute(text("SELECT id, name FROM owners WHERE id = 'test-owner-journey'"))
        print(result.all())

asyncio.run(check())
