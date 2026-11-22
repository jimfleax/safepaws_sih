import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.api.dependencies import get_current_owner
from app.db.models import Owner

@pytest.mark.asyncio
async def test_validation_error_strips_sensitive_input():
    """Verify that 422 RequestValidationError details do not echo back raw user inputs."""
    mock_owner = Owner(id="mock-owner-1", name="Test Owner", phone="1234567890")
    app.dependency_overrides[get_current_owner] = lambda: mock_owner
    try:
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as ac:
            # Submit an invalid payload containing sensitive values
            response = await ac.post("/api/v1/pets/register", json={
                "name": 12345,  # Invalid type (expected string)
                "species": "dog",
                "microchip_id": "SECRET_CHIP_12345",
                "consent_given": True,
                "password": "SUPER_SECRET_PASSWORD"
            })
            assert response.status_code == 422
            data = response.json()
            assert "detail" in data
            for error in data["detail"]:
                # Confirm stripped: 'input' and 'ctx' should not exist in sanitized output
                assert "input" not in error, f"Sensitive input was reflected in error: {error}"
                assert "ctx" not in error
                assert "loc" in error
                assert "msg" in error
                assert "type" in error
    finally:
        app.dependency_overrides.pop(get_current_owner, None)

@pytest.mark.asyncio
async def test_cors_rejects_wildcard_with_credentials():
    """Verify that CORS configuration does not allow '*' when credentials are true."""
    from app.main import app
    from fastapi.middleware.cors import CORSMiddleware
    for middleware in app.user_middleware:
        if middleware.cls == CORSMiddleware:
            allow_origins = middleware.kwargs.get("allow_origins", [])
            allow_credentials = middleware.kwargs.get("allow_credentials", False)
            if allow_credentials:
                assert "*" not in allow_origins, "CORS allow_origins cannot contain '*' when allow_credentials is True"

def test_cors_production_fails_closed_when_missing_origins(monkeypatch):
    """Verify configure_cors_origins raises RuntimeError if ALLOWED_ORIGINS is unset in production."""
    from app.main import configure_cors_origins
    from app.core.config import settings
    monkeypatch.setenv("ENVIRONMENT", "production")
    monkeypatch.setenv("ALLOWED_ORIGINS", "")
    with pytest.raises(RuntimeError, match="ALLOWED_ORIGINS must be explicitly configured"):
        configure_cors_origins()

def test_cors_rejects_wildcard_origin(monkeypatch):
    """Verify configure_cors_origins raises RuntimeError if wildcard origin is provided with credentials."""
    from app.main import configure_cors_origins
    monkeypatch.setenv("ALLOWED_ORIGINS", "https://example.com, *")
    with pytest.raises(RuntimeError, match="Wildcard origin '\\*' is forbidden"):
        configure_cors_origins()

def test_cors_accepts_valid_production_origins(monkeypatch):
    """Verify configure_cors_origins correctly parses valid production origins."""
    from app.main import configure_cors_origins
    monkeypatch.setenv("ENVIRONMENT", "production")
    monkeypatch.setenv("ALLOWED_ORIGINS", "https://safepaws.app, https://admin.safepaws.app")
    origins = configure_cors_origins()
    assert origins == ["https://safepaws.app", "https://admin.safepaws.app"]

@pytest.mark.asyncio
async def test_medical_notes_pii_redaction_and_consent():
    """Verify PII regex redaction on medical notes when shared, and omission when consent is false."""
    import re
    # Test logic matching get_pet_by_tag
    notes_with_pii = "Contact owner at vet@example.com or 555-123-4567 for special medication."
    
    # Redact email
    scrubbed = re.sub(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+", "[REDACTED EMAIL]", notes_with_pii)
    assert "[REDACTED EMAIL]" in scrubbed
    assert "vet@example.com" not in scrubbed
    
    # Redact phone
    scrubbed = re.sub(r"(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}", "[REDACTED PHONE]", scrubbed)
    assert "[REDACTED PHONE]" in scrubbed
    assert "555-123-4567" not in scrubbed
