import asyncpg
import asyncio

async def check():
    conn = await asyncpg.connect('postgresql://postgres:postgres@localhost:5432/safepaws')
    await conn.execute("DELETE FROM pet_biometric_enrollments")
    await conn.execute("DELETE FROM pet_photos")
    await conn.execute("DELETE FROM sightings")
    await conn.execute("DELETE FROM alerts")
    await conn.execute("DELETE FROM pets")
    await conn.execute("DELETE FROM owners")
    print("Database cleared!")
    await conn.close()

asyncio.run(check())
