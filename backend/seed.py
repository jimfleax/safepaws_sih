import asyncio
import asyncpg
async def main():
    conn = await asyncpg.connect('postgresql://postgres:postgres@localhost:5432/safepaws')
    await conn.execute("UPDATE owners SET phone = '', neighborhood = '' WHERE id='test-owner-1'")
    await conn.close()
asyncio.run(main())
