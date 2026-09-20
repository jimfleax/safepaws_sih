import asyncpg
import asyncio

async def test():
    try:
        conn = await asyncpg.connect('postgresql://postgres:postgres@localhost:5432/postgres')
        dbs = await conn.fetch("SELECT datname FROM pg_database")
        print("Connected to Postgres!")
        print("Databases:", [r['datname'] for r in dbs])
        has_safepaws = any(r['datname'] == 'safepaws' for r in dbs)
        if not has_safepaws:
            print("Creating safepaws database...")
            await conn.execute("CREATE DATABASE safepaws")
            print("safepaws database created!")
        else:
            print("safepaws database already exists.")
        await conn.close()
    except Exception as e:
        print(f"Error: {e}")

asyncio.run(test())
