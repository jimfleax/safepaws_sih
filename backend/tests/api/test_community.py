import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db import models
from tests.conftest import TestingSessionLocal

pytestmark = pytest.mark.asyncio

async def test_create_post(client: AsyncClient, test_user_token_headers: dict):
    response = await client.post(
        "/api/v1/community/posts",
        headers=test_user_token_headers,
        json={"channel": "Lost & Found", "title": "Test Post", "content": "Test content"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Test Post"
    assert "id" in data

async def test_create_post_unauthorized(client: AsyncClient):
    response = await client.post(
        "/api/v1/community/posts",
        json={"channel": "Lost & Found", "title": "Test Post", "content": "Test content"}
    )
    assert response.status_code == 401

async def test_fetch_posts(client: AsyncClient, test_user_token_headers: dict):
    # Create first
    await client.post(
        "/api/v1/community/posts",
        headers=test_user_token_headers,
        json={"channel": "Lost & Found", "title": "Fetch Me", "content": "Yes"}
    )
    
    response = await client.get("/api/v1/community/posts")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert data[0]["title"] == "Fetch Me"

async def test_reply(client: AsyncClient, test_user_token_headers: dict):
    post_resp = await client.post(
        "/api/v1/community/posts",
        headers=test_user_token_headers,
        json={"channel": "General", "title": "Reply to this", "content": "Please"}
    )
    post_id = post_resp.json()["id"]

    reply_resp = await client.post(
        f"/api/v1/community/posts/{post_id}/replies",
        headers=test_user_token_headers,
        json={"content": "Here is a reply"}
    )
    assert reply_resp.status_code == 200
    assert reply_resp.json()["content"] == "Here is a reply"

    get_replies = await client.get(f"/api/v1/community/posts/{post_id}/replies")
    assert get_replies.status_code == 200
    assert len(get_replies.json()) == 1

async def test_search(client: AsyncClient, test_user_token_headers: dict):
    await client.post(
        "/api/v1/community/posts",
        headers=test_user_token_headers,
        json={"channel": "General", "title": "Unique Search Term 123", "content": "Content"}
    )
    
    response = await client.get("/api/v1/community/search?query=Unique Search Term")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert data[0]["title"] == "Unique Search Term 123"

async def test_report(client: AsyncClient, test_user_token_headers: dict):
    post_resp = await client.post(
        "/api/v1/community/posts",
        headers=test_user_token_headers,
        json={"channel": "General", "title": "Bad Post", "content": "Spam"}
    )
    post_id = post_resp.json()["id"]

    report_resp = await client.post(
        "/api/v1/community/reports",
        headers=test_user_token_headers,
        json={"post_id": post_id, "reason": "spam"}
    )
    assert report_resp.status_code == 200
    assert report_resp.json()["reason"] == "spam"
    assert report_resp.json()["status"] == "pending"
