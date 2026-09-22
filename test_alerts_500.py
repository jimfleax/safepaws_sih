import asyncio
import httpx

async def main():
    async with httpx.AsyncClient(base_url='http://127.0.0.1:8000/api/v1') as client:
        r = await client.get('/alerts/')
        print("GET /alerts/ :", r.status_code, r.text)
asyncio.run(main())
