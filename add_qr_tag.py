import asyncio
import asyncpg
async def main():
    conn = await asyncpg.connect('postgresql://postgres:postgres@localhost:5432/safepaws')
    await conn.execute('UPDATE pets SET qr_tag_id = id || \'-qr\' WHERE name LIKE \'TestBioDog%\'')
    await conn.close()
asyncio.run(main())
