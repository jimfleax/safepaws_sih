import asyncio
import httpx
import uuid

async def main():
    async with httpx.AsyncClient(base_url='http://127.0.0.1:5000/api') as client:
        email = f"test_{uuid.uuid4().hex[:6]}@example.com"
        r = await client.post('/auth/register', json={
            "email": email,
            "password": "password",
            "full_name": "Test User",
            "phone": "1234567890"
        })
        print("Register:", r.status_code)
        
        r = await client.post('/auth/login', data={
            "username": email,
            "password": "password"
        })
        print("Login:", r.status_code, r.text)
        token = r.json().get('access_token')
        
        headers = {"Authorization": f"Bearer {token}"}
        r = await client.post('/v1/community/posts', json={
            "channel": "Lost & Found",
            "title": "Auth Post",
            "content": "Content"
        }, headers=headers)
        print("POST /community/posts (Auth):", r.status_code, r.text)

asyncio.run(main())
