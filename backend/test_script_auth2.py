import asyncio
import httpx
import uuid
import jwt
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from app.db.models import Owner

DATABASE_URL = "postgresql+asyncpg://postgres:postgres@localhost:5432/safepaws"
engine = create_async_engine(DATABASE_URL, echo=False)
async_session = sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)

async def setup_test_user():
    user_id = str(uuid.uuid4())
    async with async_session() as db:
        owner = Owner(id=user_id, name="Test User", email="test@example.com", phone="1234567890", neighborhood="Test Neighborhood")
        db.add(owner)
        await db.commit()
    
    exp = datetime.utcnow() + timedelta(days=30)
    jwt_payload = {
        "userId": user_id,
        "tokenVersion": 0,
        "exp": exp
    }
    token = jwt.encode(jwt_payload, 'supersecret', algorithm="HS256")
    return token

async def main():
    token = await setup_test_user()
    
    async with httpx.AsyncClient(base_url='http://127.0.0.1:5000/api') as client:
        # 1. Anonymous Read /posts
        r = await client.get('/v1/community/posts')
        print("GET /community/posts (Anon):", r.status_code)

        # 2. Try anonymous create post
        r = await client.post('/v1/community/posts', json={
            "channel": "General",
            "title": "Test",
            "content": "Test"
        })
        print("POST /community/posts (Anon):", r.status_code)

        client.cookies.set("jwt", token)

        # 3. Create post (Auth)
        r = await client.post('/v1/community/posts', json={
            "channel": "Lost & Found",
            "title": "Auth Post",
            "content": "Content"
        })
        print("POST /community/posts (Auth):", r.status_code)
        post_id = r.json()['id']

        # 4. Search
        r = await client.get('/v1/community/search?query=Auth')
        print("GET /community/search:", r.status_code, len(r.json()), "results")

        # 5. Read single post
        r = await client.get(f'/v1/community/posts/{post_id}')
        print("GET /community/posts/{id}:", r.status_code)
        
        # 6. Create reply
        r = await client.post(f'/v1/community/posts/{post_id}/replies', json={
            "content": "Reply content"
        })
        print("POST /community/posts/{id}/replies:", r.status_code)
        reply_id = r.json()['id']
        
        # 7. Edit post
        r = await client.put(f'/v1/community/posts/{post_id}', json={
            "content": "Edited content"
        })
        print("PUT /community/posts/{id}:", r.status_code)

        # 8. Report post
        r = await client.post('/v1/community/reports', json={
            "post_id": post_id,
            "reason": "spam"
        })
        print("POST /community/reports:", r.status_code)

        # 9. Create task
        r = await client.post(f'/v1/community/tasks?alert_id=dummy-alert', json={
            "task_type": "Search",
            "description": "Task desc"
        })
        print("POST /community/tasks:", r.status_code)

        # 10. Notifications
        r = await client.get('/v1/community/notifications')
        print("GET /community/notifications:", r.status_code)

        # 11. Preferences
        r = await client.post('/v1/community/preferences', json={
            "interests": ["Lost & Found"]
        })
        print("POST /community/preferences:", r.status_code)

        # 12. Delete Reply
        r = await client.delete(f'/v1/community/replies/{reply_id}')
        print("DELETE /community/replies/{id}:", r.status_code)

        # 13. Delete Post
        r = await client.delete(f'/v1/community/posts/{post_id}')
        print("DELETE /community/posts/{id}:", r.status_code)

asyncio.run(main())
