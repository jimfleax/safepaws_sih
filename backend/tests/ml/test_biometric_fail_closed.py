import pytest
from httpx import ASGITransport, AsyncClient

from app.api.dependencies import UnavailableEmbeddingModel, UnavailableNoseDetector, get_detector, get_embedder
from app.core.exceptions import DomainException
from app.main import app


@pytest.mark.asyncio
async def test_unavailable_detector_fails_closed():
    """Verify that UnavailableNoseDetector raises 503 DomainException when invoked."""
    detector = UnavailableNoseDetector("Model weights missing")
    with pytest.raises(DomainException) as exc_info:
        await detector.detect(b"fake_image")
    assert exc_info.value.status_code == 503
    assert exc_info.value.error_code == "BIOMETRIC_DETECTOR_UNAVAILABLE"


@pytest.mark.asyncio
async def test_unavailable_embedder_fails_closed():
    """Verify that UnavailableEmbeddingModel raises 503 DomainException when invoked."""
    embedder = UnavailableEmbeddingModel("Weights failed checksum")
    with pytest.raises(DomainException) as exc_info:
        await embedder.extract_features(b"fake_image", {"x_min": 0, "y_min": 0, "x_max": 10, "y_max": 10})
    assert exc_info.value.status_code == 503
    assert exc_info.value.error_code == "BIOMETRIC_EMBEDDER_UNAVAILABLE"


@pytest.mark.asyncio
async def test_readiness_diagnostic_endpoint_structure():
    """Verify that /api/v1/health/readiness returns granular subsystem status."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/api/v1/health/readiness")
        assert response.status_code in [200, 503]
        data = response.json()
        assert "status" in data
        assert "checks" in data
        assert "database" in data["checks"]
        assert "detector" in data["checks"]
        assert "embedder" in data["checks"]
        assert "weights" in data["checks"]


@pytest.mark.asyncio
async def test_readiness_endpoint_fails_closed_in_production(monkeypatch):
    """Verify that in production mode, an unavailable detector causes 503 readiness response."""
    monkeypatch.setenv("ENVIRONMENT", "production")
    app.dependency_overrides[get_detector] = lambda: UnavailableNoseDetector("Detector crash")
    
    try:
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as ac:
            response = await ac.get("/api/v1/health/readiness")
            assert response.status_code == 503
            data = response.json()
            assert data["status"] == "not_ready"
            assert data["checks"]["detector"]["status"] == "degraded"
    finally:
        app.dependency_overrides.pop(get_detector, None)
