import httpx
import asyncio

async def main():
    async with httpx.AsyncClient(base_url="http://localhost:5000") as client:
        # We can't easily test POST /api/auth/google without a real google token.
        # But we can test if the endpoint exists (it should return 400 for empty token)
        print("Testing POST /api/auth/google...")
        res = await client.post("/api/auth/google", json={"token": ""})
        print(f"Status: {res.status_code}, Body: {res.text}")

        # Test PUT /api/users/profile without cookie (should be 401)
        print("\nTesting PUT /api/users/profile without cookie...")
        res = await client.put("/api/users/profile", json={"phone": "12345", "neighborhood": "Test"})
        print(f"Status: {res.status_code}, Body: {res.text}")

        # Create a mock JWT to test if PUT works with a valid cookie
        import jwt
        import os
        from datetime import datetime, timedelta
        import uuid
        
        # We need an owner in the DB first!
        # Let's hit the DB to insert an owner manually, then update them.
        import asyncpg
        conn = await asyncpg.connect('postgresql://postgres:postgres@localhost:5432/safepaws')
        test_id = f"test-{uuid.uuid4().hex[:8]}"
        await conn.execute("INSERT INTO owners (id, name, phone, email, neighborhood) VALUES ($1, $2, $3, $4, $5)", test_id, "Test User", "000", "test@test.com", "Old")
        await conn.close()
        
        token = jwt.encode(
            {"userId": test_id, "exp": datetime.utcnow() + timedelta(hours=1)},
            "supersecret",
            algorithm="HS256"
        )
        
        print("\nTesting PUT /api/users/profile with cookie...")
        res = await client.put("/api/users/profile", json={"phone": "999-999-9999", "neighborhood": "New Hood"}, cookies={"jwt": token})
        print(f"Status: {res.status_code}, Body: {res.text}")

if __name__ == "__main__":
    asyncio.run(main())
