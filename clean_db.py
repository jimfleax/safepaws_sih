import asyncio
import asyncpg
async def main():
    conn = await asyncpg.connect('postgresql://postgres:postgres@localhost:5432/safepaws')
    await conn.execute('DELETE FROM alerts WHERE pet_id IN (SELECT id FROM pets WHERE breed IS NULL)')
    await conn.execute('DELETE FROM pets WHERE breed IS NULL')
    await conn.close()
asyncio.run(main())
