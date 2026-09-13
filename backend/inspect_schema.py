import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
from app.core.config import settings

async def inspect():
    engine = create_async_engine(settings.DATABASE_URL)
    async with engine.connect() as conn:
        for tbl in ['pet_photos', 'pet_biometric_enrollments', 'sightings', 'pets', 'owners']:
            res = await conn.execute(
                text(
                    "SELECT column_name, data_type FROM information_schema.columns "
                    "WHERE table_name = :tbl ORDER BY ordinal_position"
                ),
                {"tbl": tbl}
            )
            rows = res.fetchall()
            print(f'\n-- {tbl} --')
            for r in rows:
                print(f'  {r[0]}  ({r[1]})')

asyncio.run(inspect())
