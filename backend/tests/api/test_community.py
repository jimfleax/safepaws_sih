import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.api.dependencies import get_db, get_current_owner
from app.db.models import Owner, CommunityPost, CommunityReply, Report, CommunityPreference
import datetime


def setup_app_overrides(current_user, post=None, replies=None, pref=None):
    class MockResult:
        def __init__(self, val):
            self.val = val
        def scalars(self):
            class MockScalars:
                def __init__(self, val): self.val = val
                def first(self): return self.val if not isinstance(self.val, list) else (self.val[0] if self.val else None)
                def all(self): return self.val if isinstance(self.val, list) else ([self.val] if self.val else [])
            return MockScalars(self.val)

    class CustomMockSession:
        def __init__(self):
            self.committed = False

        def add(self, item):
            import uuid
            if not getattr(item, 'id', None):
                item.id = str(uuid.uuid4())
            if not getattr(item, 'created_at', None):
                item.created_at = datetime.datetime.now(datetime.UTC)
            if hasattr(item, 'updated_at') and not getattr(item, 'updated_at', None):
                item.updated_at = datetime.datetime.now(datetime.UTC)
            # Set status default explicitly since SQLAlchemy defaults don't fire without a session
            if hasattr(item, 'status') and getattr(item, 'status', None) is None:
                item.status = 'pending'

        async def commit(self): self.committed = True
        async def refresh(self, item): pass
        async def rollback(self): pass
        async def close(self): pass

        async def execute(self, stmt):
            s = str(stmt).lower()
            if "community_posts" in s:
                val = [post] if post and "limit" in s else (post if "limit" not in s else [])
                return MockResult(val)
            if "community_replies" in s:
                return MockResult(replies or [])
            if "community_preferences" in s:
                return MockResult(pref)
            return MockResult(None)

    async def override_get_db():
        yield CustomMockSession()

    async def override_get_current_owner():
        if current_user is None:
            from fastapi import HTTPException
            raise HTTPException(status_code=401, detail="Not authenticated")
        return current_user

    app.dependency_overrides[get_db] = override_get_db
    app.dependency_overrides[get_current_owner] = override_get_current_owner


def teardown_app_overrides():
    app.dependency_overrides.clear()


def test_create_post(client: TestClient):
    owner = Owner(id="owner_1")
    setup_app_overrides(owner)
    try:
        resp = client.post("/api/v1/community/posts", json={"channel": "General", "title": "Test Post", "content": "Content"})
        assert resp.status_code == 200
        data = resp.json()
        assert data["title"] == "Test Post"
        assert data["id"] is not None
    finally:
        teardown_app_overrides()


def test_create_post_unauthorized(client: TestClient):
    setup_app_overrides(None)
    try:
        resp = client.post("/api/v1/community/posts", json={"channel": "General", "title": "Test Post", "content": "Content"})
        assert resp.status_code == 401
    finally:
        teardown_app_overrides()


def test_fetch_posts(client: TestClient):
    owner = Owner(id="owner_1")
    post = CommunityPost(
        id="post_1", author_id="owner_1", channel="General", title="Fetched Post", content="C",
        created_at=datetime.datetime.now(datetime.UTC), updated_at=datetime.datetime.now(datetime.UTC)
    )
    setup_app_overrides(owner, post=post)
    try:
        resp = client.get("/api/v1/community/posts")
        assert resp.status_code == 200
        data = resp.json()
        assert len(data) >= 1
        assert data[0]["title"] == "Fetched Post"
    finally:
        teardown_app_overrides()


def test_reply(client: TestClient):
    owner = Owner(id="owner_1")
    post = CommunityPost(
        id="post_1", author_id="owner_1", channel="General", title="Post", content="C",
        created_at=datetime.datetime.now(datetime.UTC), updated_at=datetime.datetime.now(datetime.UTC)
    )
    reply = CommunityReply(
        id="reply_1", post_id="post_1", author_id="owner_1", content="Reply Content",
        created_at=datetime.datetime.now(datetime.UTC)
    )
    setup_app_overrides(owner, post=post, replies=[reply])
    try:
        resp = client.post("/api/v1/community/posts/post_1/replies", json={"content": "Reply Content"})
        assert resp.status_code == 200
        assert resp.json()["content"] == "Reply Content"

        resp = client.get("/api/v1/community/posts/post_1/replies")
        assert resp.status_code == 200
        assert len(resp.json()) == 1
    finally:
        teardown_app_overrides()


def test_search(client: TestClient):
    owner = Owner(id="owner_1")
    post = CommunityPost(
        id="post_1", author_id="owner_1", channel="General", title="Unique Search Term", content="C",
        created_at=datetime.datetime.now(datetime.UTC), updated_at=datetime.datetime.now(datetime.UTC)
    )
    setup_app_overrides(owner, post=post)
    try:
        resp = client.get("/api/v1/community/search?query=Unique+Search+Term")
        assert resp.status_code == 200
        data = resp.json()
        assert len(data) >= 1
        assert data[0]["title"] == "Unique Search Term"
    finally:
        teardown_app_overrides()


def test_report(client: TestClient):
    owner = Owner(id="owner_1")
    setup_app_overrides(owner)
    try:
        resp = client.post("/api/v1/community/reports", json={"post_id": "post_1", "reason": "spam"})
        assert resp.status_code == 200
        data = resp.json()
        assert data["reason"] == "spam"
        assert data["status"] == "pending"
        assert data["id"] is not None
    finally:
        teardown_app_overrides()
