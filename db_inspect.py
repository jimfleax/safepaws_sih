import asyncio
import asyncpg

async def main():
    conn = await asyncpg.connect('postgresql://postgres:postgres@localhost:5432/safepaws')
    alerts = await conn.fetch('SELECT id, pet_id FROM alerts')
    for a in alerts:
        print("Alert:", dict(a))
    pets = await conn.fetch('SELECT id, owner_id FROM pets')
    for p in pets:
        print("Pet:", dict(p))
    await conn.close()

if __name__ == "__main__":
    asyncio.run(main())
