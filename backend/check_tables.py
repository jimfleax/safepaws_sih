import asyncpg
import asyncio

async def check():
    conn = await asyncpg.connect('postgresql://postgres:postgres@localhost:5432/safepaws')
    tables = await conn.fetch("SELECT tablename FROM pg_tables WHERE schemaname='public'")
    print('Tables:', [r['tablename'] for r in tables])
    await conn.close()

asyncio.run(check())
