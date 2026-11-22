"""
Phase 1B — Biometric Enrollment Authorization & Security Verification Tests

Coverage:
  - Anonymous caller receives 401 Unauthorized (via get_current_owner dependency)
  - Non-owner caller receives 403 Forbidden
  - Nonexistent pet ID receives 404 Not Found
  - Verified owner successfully reaches enrollment service
  - Endpoint signature requires owner auth dependency
"""
import asyncio
import io
import sys
from unittest.mock import AsyncMock, MagicMock
import pytest

# Ensure compatibility with test environments where external C/GPU packages are not installed
for mod in ["fastapi", "asyncpg", "faiss", "torch", "torchvision", "ultralytics", "geoalchemy2"]:
    if mod not in sys.modules:
        try:
            __import__(mod)
        except ImportError:
            m = MagicMock()
            if mod == "torch":
                class MockTensor:
                    pass
                m.Tensor = MockTensor
            if mod == "fastapi":
                class MockHTTPException(Exception):
                    def __init__(self, status_code: int = 400, detail: str = ""):
                        self.status_code = status_code
                        self.detail = detail
                        super().__init__(detail)
                m.HTTPException = MockHTTPException
                m.status.HTTP_404_NOT_FOUND = 404
                m.status.HTTP_403_FORBIDDEN = 403
                m.status.HTTP_401_UNAUTHORIZED = 401
                m.status.HTTP_400_BAD_REQUEST = 400
                m.status.HTTP_200_OK = 200
                m.status.HTTP_201_CREATED = 201
                def make_router(*a, **k):
                    r = MagicMock()
                    r.post = lambda *a, **k: (lambda f: f)
                    r.get = lambda *a, **k: (lambda f: f)
                    r.put = lambda *a, **k: (lambda f: f)
                    r.delete = lambda *a, **k: (lambda f: f)
                    return r
                m.APIRouter = make_router
                def _mock_depends(dep=None):
                    dep_mock = MagicMock()
                    dep_mock.dependency = dep
                    return dep_mock
                m.Depends = _mock_depends
                m.File = lambda *a, **k: MagicMock()
                m.UploadFile = MagicMock
            sys.modules[mod] = m

from app.api.dependencies import get_current_owner
from app.api.v1.endpoints.pets import enroll_image


def _mock_pet(pet_id: str, owner_id: str):
    pet = MagicMock()
    pet.id = pet_id
    pet.owner_id = owner_id
    return pet


def _mock_owner(owner_id: str):
    owner = MagicMock()
    owner.id = owner_id
    return owner


def _mock_upload_file(filename: str = "nose.jpg", content_type: str = "image/jpeg", data: bytes = b"mock_jpeg"):
    f = MagicMock()
    f.filename = filename
    f.content_type = content_type
    f.read = AsyncMock(return_value=data)
    f.file = MagicMock()
    f.file.seek = MagicMock()
    f.file.tell = MagicMock(return_value=len(data))
    return f


def test_enrollment_nonexistent_pet_returns_404():
    """Attempting to enroll an image for a pet ID that doesn't exist returns 404."""
    async def _test():
        mock_db = AsyncMock()
        mock_result = MagicMock()
        mock_result.scalars.return_value.first.return_value = None
        mock_db.execute.return_value = mock_result

        current_owner = _mock_owner("owner_123")
        mock_service = AsyncMock()
        file = _mock_upload_file()

        with pytest.raises(Exception) as exc_info:
            await enroll_image(
                pet_id="nonexistent-id",
                file=file,
                service=mock_service,
                current_owner=current_owner,
                db=mock_db,
            )

        assert exc_info.value.status_code == 404
        assert "not found" in exc_info.value.detail.lower()
        mock_service.enroll_image.assert_not_called()

    asyncio.run(_test())


def test_enrollment_unauthorized_owner_returns_403():
    """Attempting to enroll an image for someone else's pet returns 403 Forbidden."""
    async def _test():
        mock_db = AsyncMock()
        mock_result = MagicMock()
        pet = _mock_pet(pet_id="pet_abc", owner_id="owner_victim")
        mock_result.scalars.return_value.first.return_value = pet
        mock_db.execute.return_value = mock_result

        current_owner = _mock_owner("owner_attacker")
        mock_service = AsyncMock()
        file = _mock_upload_file()

        with pytest.raises(Exception) as exc_info:
            await enroll_image(
                pet_id="pet_abc",
                file=file,
                service=mock_service,
                current_owner=current_owner,
                db=mock_db,
            )

        assert exc_info.value.status_code == 403
        assert "not authorized" in exc_info.value.detail.lower()
        mock_service.enroll_image.assert_not_called()

    asyncio.run(_test())


def test_enrollment_authorized_owner_success():
    """Legitimate owner can enroll images for their own pet."""
    async def _test():
        mock_db = AsyncMock()
        mock_result = MagicMock()
        pet = _mock_pet(pet_id="pet_abc", owner_id="owner_legit")
        mock_result.scalars.return_value.first.return_value = pet
        mock_db.execute.return_value = mock_result

        current_owner = _mock_owner("owner_legit")
        mock_service = AsyncMock()
        mock_service.enroll_image.return_value = {"status": "SUCCESS", "message": "Enrolled"}
        file = _mock_upload_file()

        res = await enroll_image(
            pet_id="pet_abc",
            file=file,
            service=mock_service,
            current_owner=current_owner,
            db=mock_db,
        )

        assert res["status"] == "SUCCESS"
        mock_service.enroll_image.assert_awaited_once()

    asyncio.run(_test())


def test_enrollment_endpoint_signature_requires_owner_auth():
    """Verify endpoint signature includes current_owner dependency (preventing anonymous bypass)."""
    import inspect

    sig = inspect.signature(enroll_image)
    assert "current_owner" in sig.parameters
    param = sig.parameters["current_owner"]
    assert hasattr(param.default, "dependency")
    assert param.default.dependency == get_current_owner
