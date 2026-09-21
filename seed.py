import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy import text

async def seed():
    engine = create_async_engine('postgresql+asyncpg://postgres:postgres@localhost:5432/safepaws')
    async with AsyncSession(engine) as s:
        await s.execute(text("INSERT INTO owners (id, email, name, phone, neighborhood) VALUES ('test-owner-1', 'owner_a@test.com', 'Owner A', '555-0000', 'Downtown') ON CONFLICT (id) DO NOTHING;"))
        await s.commit()
        print('seeded')

asyncio.run(seed())
