import pytest
import asyncio
from httpx import AsyncClient, ASGITransport
from app.main import app
import jwt
from datetime import datetime, timedelta
import os
import uuid
import asyncpg
from app.core.config import settings
from app.api.dependencies import get_db

SECRET_KEY = os.getenv('JWT_SECRET', 'supersecret')

@pytest.mark.asyncio
async def test_real_postgres_identity_persistence():
    old_overrides = app.dependency_overrides.copy()
    try:
        if get_db in app.dependency_overrides:
            del app.dependency_overrides[get_db]
            
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as real_async_client:
            # 1. Connect to Real DB
            conn = await asyncpg.connect(settings.DATABASE_URL.replace("+asyncpg", ""))
            
            try:
                # 2. Seed a real Owner
                random_suffix = uuid.uuid4().hex[:6]
                owner_id = f"test-real-owner-{random_suffix}"
                owner_name = f"Real Owner {random_suffix}"
                await conn.execute(
                    "INSERT INTO owners (id, name, phone, neighborhood) VALUES ($1, $2, $3, $4)",
                    owner_id, owner_name, "000", "Old Hood"
                )
                
                # 3. Create a JWT for the owner
                token = jwt.encode(
                    {"userId": owner_id, "exp": datetime.utcnow() + timedelta(hours=1)},
                    SECRET_KEY,
                    algorithm="HS256"
                )
                
                # 3.5 Test unauthenticated /me
                res_me_unauth = await real_async_client.get("/api/auth/me")
                assert res_me_unauth.status_code == 401
                
                # 3.6 Test authenticated /me
                res_me = await real_async_client.get(
                    "/api/auth/me",
                    cookies={"jwt": token}
                )
                assert res_me.status_code == 200
                data = res_me.json()
                assert data["id"] == owner_id
                assert data["name"] == owner_name
                
                # 4. Profile Update using real API (tests PUT /api/users/profile)
                res_profile = await real_async_client.put(
                    "/api/users/profile",
                    json={"phone": "123-456", "neighborhood": "Real Hood"},
                    cookies={"jwt": token}
                )
                assert res_profile.status_code == 200
                
                # 5. Pet Registration (Integration between Auth + Pet insert)
                pet_data = {
                    "name": "Real Integration Dog",
                    "species": "dog",
                    "breed": "Mix",
                    "color": "Black",
                    "age": "2",
                    "consent_given": True
                }
                
                # 5.1 Unauth registration fails
                res_pet_unauth = await real_async_client.post(
                    "/api/v1/pets/register",
                    json=pet_data
                )
                assert res_pet_unauth.status_code == 401
                
                # 5.2 Authenticated registration succeeds
                res_pet = await real_async_client.post(
                    "/api/v1/pets/register",
                    json=pet_data,
                    cookies={"jwt": token}
                )
                assert res_pet.status_code == 201
                pet_id = res_pet.json()["id"]
                
                # 6. Verify Persistence in Real DB
                owner_row = await conn.fetchrow("SELECT phone, neighborhood FROM owners WHERE id = $1", owner_id)
                assert owner_row["phone"] == "123-456"
                assert owner_row["neighborhood"] == "Real Hood"
                
                pet_row = await conn.fetchrow("SELECT owner_id FROM pets WHERE id = $1", pet_id)
                assert pet_row["owner_id"] == owner_id
                
                # 7. Verify no duplicate owners were created
                duplicate_check = await conn.fetch("SELECT id FROM owners WHERE name = $1 AND id != $2", owner_name, owner_id)
                assert len(duplicate_check) == 0
            
            finally:
                # Cleanup
                if 'pet_id' in locals():
                    await conn.execute("DELETE FROM pets WHERE id = $1", pet_id)
                if 'owner_id' in locals():
                    await conn.execute("DELETE FROM owners WHERE id = $1", owner_id)
                await conn.close()
    finally:
        app.dependency_overrides = old_overrides
