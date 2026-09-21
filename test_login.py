import asyncio
import httpx

async def main():
    async with httpx.AsyncClient(base_url='http://127.0.0.1:5000/api') as client:
        # Login
        r = await client.post('/auth/login', data={
            "username": "test@example.com",
            "password": "password"
        })
        print("Login status:", r.status_code, r.text)

asyncio.run(main())
