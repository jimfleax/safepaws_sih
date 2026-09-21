import asyncio
import httpx

async def main():
    async with httpx.AsyncClient(base_url='http://localhost:5000/api/v1') as client:
        # 1. Anonymous Read /posts
        r = await client.get('/community/posts')
        print("GET /community/posts (Anon):", r.status_code)
        posts = r.json()
        print(f"   Found {len(posts)} posts. {posts[0]['author_name'] if posts else ''}")

        # 2. Try anonymous create post
        r = await client.post('/community/posts', json={
            "channel": "General",
            "title": "Test",
            "content": "Test"
        })
        print("POST /community/posts (Anon):", r.status_code)

        # Login to get a token
        r = await client.post('/auth/login', data={
            "username": "test@example.com",
            "password": "password"
        })
        if r.status_code != 200:
            print("Login failed:", r.status_code, r.text)
            # Register user
            r = await client.post('/auth/register', json={
                "email": "test@example.com",
                "password": "password",
                "full_name": "Test User",
                "phone": "1234567890"
            })
            r = await client.post('/auth/login', data={
                "username": "test@example.com",
                "password": "password"
            })
        
        token = r.json().get('access_token')
        headers = {"Authorization": f"Bearer {token}"}

        # 3. Create post (Auth)
        r = await client.post('/community/posts', json={
            "channel": "Lost & Found",
            "title": "Auth Post",
            "content": "Content"
        }, headers=headers)
        print("POST /community/posts (Auth):", r.status_code)
        post_id = r.json()['id']

        # 4. Search
        r = await client.get('/community/search?query=Auth')
        print("GET /community/search:", r.status_code, len(r.json()), "results")

        # 5. Read single post
        r = await client.get(f'/community/posts/{post_id}')
        print("GET /community/posts/{id}:", r.status_code)
        
        # 6. Create reply
        r = await client.post(f'/community/posts/{post_id}/replies', json={
            "content": "Reply content"
        }, headers=headers)
        print("POST /community/posts/{id}/replies:", r.status_code)
        reply_id = r.json()['id']
        
        # 7. Edit post
        r = await client.put(f'/community/posts/{post_id}', json={
            "content": "Edited content"
        }, headers=headers)
        print("PUT /community/posts/{id}:", r.status_code)

        # 8. Report post
        r = await client.post('/community/reports', json={
            "post_id": post_id,
            "reason": "spam"
        }, headers=headers)
        print("POST /community/reports:", r.status_code)

        # 9. Create task
        r = await client.post(f'/community/tasks?alert_id=dummy-alert', json={
            "task_type": "Search",
            "description": "Task desc"
        }, headers=headers)
        print("POST /community/tasks:", r.status_code)

        # 10. Notifications
        r = await client.get('/community/notifications', headers=headers)
        print("GET /community/notifications:", r.status_code)

        # 11. Preferences
        r = await client.post('/community/preferences', json={
            "interests": ["Lost & Found"]
        }, headers=headers)
        print("POST /community/preferences:", r.status_code)

        # 12. Delete Reply
        r = await client.delete(f'/community/replies/{reply_id}', headers=headers)
        print("DELETE /community/replies/{id}:", r.status_code)

        # 13. Delete Post
        r = await client.delete(f'/community/posts/{post_id}', headers=headers)
        print("DELETE /community/posts/{id}:", r.status_code)

asyncio.run(main())
