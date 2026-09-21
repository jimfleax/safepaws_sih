import asyncio
import httpx
import uuid

async def main():
    async with httpx.AsyncClient(base_url='http://127.0.0.1:5000/api') as client:
        # 1. Anonymous Read /posts
        r = await client.get('/v1/community/posts')
        print("GET /community/posts (Anon):", r.status_code)
        if r.status_code == 200:
            posts = r.json()
            print(f"   Found {len(posts)} posts.")
            if posts:
                print(f"   Sample author: {posts[0].get('author_name', 'MISSING')}")

        # 2. Try anonymous create post
        r = await client.post('/v1/community/posts', json={
            "channel": "General",
            "title": "Test",
            "content": "Test"
        })
        print("POST /community/posts (Anon):", r.status_code)

        # Login to get a token
        email = f"test_{uuid.uuid4().hex[:6]}@example.com"
        r = await client.post('/auth/register', json={
            "email": email,
            "password": "password",
            "full_name": "Test User",
            "phone": "1234567890"
        })
        r = await client.post('/auth/login', data={
            "username": email,
            "password": "password"
        })
        token = r.json().get('access_token')
        headers = {"Authorization": f"Bearer {token}"}

        # 3. Create post (Auth)
        r = await client.post('/v1/community/posts', json={
            "channel": "Lost & Found",
            "title": "Auth Post",
            "content": "Content"
        }, headers=headers)
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
        }, headers=headers)
        print("POST /community/posts/{id}/replies:", r.status_code)
        reply_id = r.json()['id']
        
        # 7. Edit post
        r = await client.put(f'/v1/community/posts/{post_id}', json={
            "content": "Edited content"
        }, headers=headers)
        print("PUT /community/posts/{id}:", r.status_code)

        # 8. Report post
        r = await client.post('/v1/community/reports', json={
            "post_id": post_id,
            "reason": "spam"
        }, headers=headers)
        print("POST /community/reports:", r.status_code)

        # 9. Create task
        r = await client.post(f'/v1/community/tasks?alert_id=dummy-alert', json={
            "task_type": "Search",
            "description": "Task desc"
        }, headers=headers)
        print("POST /community/tasks:", r.status_code)

        # 10. Notifications
        r = await client.get('/v1/community/notifications', headers=headers)
        print("GET /community/notifications:", r.status_code)

        # 11. Preferences
        r = await client.post('/v1/community/preferences', json={
            "interests": ["Lost & Found"]
        }, headers=headers)
        print("POST /community/preferences:", r.status_code)

        # 12. Delete Reply
        r = await client.delete(f'/v1/community/replies/{reply_id}', headers=headers)
        print("DELETE /community/replies/{id}:", r.status_code)

        # 13. Delete Post
        r = await client.delete(f'/v1/community/posts/{post_id}', headers=headers)
        print("DELETE /community/posts/{id}:", r.status_code)

asyncio.run(main())
