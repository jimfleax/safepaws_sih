import pytest

try:
    from fastapi.testclient import TestClient
    from app.db.session import get_db
    from app.main import app
    HAS_FASTAPI = True
except ImportError:
    HAS_FASTAPI = False

if HAS_FASTAPI:
    class MockAsyncSession:
        def add(self, item): pass
        async def commit(self): pass
        async def rollback(self): pass
        async def close(self): pass
        async def execute(self, *args, **kwargs):
            class MockResult:
                def scalars(self):
                    class MockScalars:
                        def first(self): return None
                    return MockScalars()
            return MockResult()

    async def override_get_db():
        yield MockAsyncSession()

    app.dependency_overrides[get_db] = override_get_db

    @pytest.fixture(scope="module")
    def client() -> TestClient:
        with TestClient(app) as c:
            yield c
