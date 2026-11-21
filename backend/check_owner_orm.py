import asyncio
from sqlalchemy import select
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
import sys
import os

sys.path.append(os.getcwd())
from app.db.models import Owner

async def check():
    engine = create_async_engine('postgresql+asyncpg://postgres:postgres@localhost:5432/safepaws')
    async_session = sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)
    
    async with async_session() as db:
        owner_id = 'test-owner-journey'
        stmt = select(Owner).where(Owner.id == owner_id)
        result = await db.execute(stmt)
        owner = result.scalars().first()
        print('Found owner:', owner)
        if owner:
            print(owner.id, owner.name)

asyncio.run(check())
