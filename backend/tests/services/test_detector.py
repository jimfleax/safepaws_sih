"""
Panel 2 — MockNoseDetector tests
==================================

Covers: single dog, no dog, multi-dog, low confidence,
        valid bbox keys, invalid/empty image, raw-byte logging guard.
"""
import logging
import pytest

from app.services.detector import MockNoseDetector
from app.services.ml_interfaces import BoundingBox
from app.core.exceptions import NoDogDetectedError, MultiDogDetectedError


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _assert_canonical_bbox(bbox: dict) -> None:
    """Assert that a bbox dict satisfies the canonical Panel 2 contract."""
    required = {"x_min", "y_min", "x_max", "y_max", "confidence"}
    assert required.issubset(bbox.keys()), (
        f"Bbox missing required keys. Got: {set(bbox.keys())}"
    )
    assert bbox["x_max"] > bbox["x_min"], "x_max must be > x_min"
    assert bbox["y_max"] > bbox["y_min"], "y_max must be > y_min"
    assert 0.0 <= bbox["confidence"] <= 1.0, "confidence must be in [0, 1]"
    # Validate via dataclass (raises ValueError if invalid)
    BoundingBox.from_dict(bbox)


# ---------------------------------------------------------------------------
# Single-dog detection (happy path)
# ---------------------------------------------------------------------------

@pytest.mark.asyncio
async def test_valid_detection_returns_one_bbox():
    detector = MockNoseDetector()
    result = await detector.detect(b"valid_dog_image")
    assert len(result) == 1, "Expected exactly one bbox for a single-dog image"


@pytest.mark.asyncio
async def test_valid_bbox_has_canonical_keys():
    detector = MockNoseDetector()
    result = await detector.detect(b"valid_dog_image")
    _assert_canonical_bbox(result[0])


@pytest.mark.asyncio
async def test_valid_detection_confidence_value():
    detector = MockNoseDetector()
    result = await detector.detect(b"valid_dog_image")
    assert result[0]["confidence"] == 0.98


@pytest.mark.asyncio
async def test_valid_bbox_no_legacy_xywh_keys():
    """Ensure old {x, y, w, h} schema is absent from canonical output."""
    detector = MockNoseDetector()
    result = await detector.detect(b"valid_dog_image")
    bbox = result[0]
    for bad_key in ("x", "y", "w", "h"):
        assert bad_key not in bbox, (
            f"Legacy key '{bad_key}' found in bbox — canonical schema violated"
        )


# ---------------------------------------------------------------------------
# No-dog detection
# ---------------------------------------------------------------------------

@pytest.mark.asyncio
async def test_no_dog_raises_no_dog_error():
    detector = MockNoseDetector()
    with pytest.raises(NoDogDetectedError):
        await detector.detect(b"mock_no_dog")


@pytest.mark.asyncio
async def test_no_dog_error_code():
    detector = MockNoseDetector()
    with pytest.raises(NoDogDetectedError) as exc_info:
        await detector.detect(b"mock_no_dog")
    assert exc_info.value.error_code == "NO_DOG_DETECTED"


@pytest.mark.asyncio
async def test_no_dog_http_status():
    detector = MockNoseDetector()
    with pytest.raises(NoDogDetectedError) as exc_info:
        await detector.detect(b"mock_no_dog")
    assert exc_info.value.status_code == 422


@pytest.mark.asyncio
async def test_empty_image_raises_no_dog_error():
    detector = MockNoseDetector()
    with pytest.raises(NoDogDetectedError):
        await detector.detect(b"")


# ---------------------------------------------------------------------------
# Multi-dog detection
# ---------------------------------------------------------------------------

@pytest.mark.asyncio
async def test_multi_dog_raises_multi_dog_error():
    detector = MockNoseDetector()
    with pytest.raises(MultiDogDetectedError):
        await detector.detect(b"mock_multi_dog")


@pytest.mark.asyncio
async def test_multi_dog_error_code():
    detector = MockNoseDetector()
    with pytest.raises(MultiDogDetectedError) as exc_info:
        await detector.detect(b"mock_multi_dog")
    assert exc_info.value.error_code == "MULTI_DOG_DETECTED"


@pytest.mark.asyncio
async def test_multi_dog_http_status():
    detector = MockNoseDetector()
    with pytest.raises(MultiDogDetectedError) as exc_info:
        await detector.detect(b"mock_multi_dog")
    assert exc_info.value.status_code == 422


@pytest.mark.asyncio
async def test_multi_dog_never_silently_selects_one():
    """Contract: detector MUST raise, never silently return one of the dogs."""
    detector = MockNoseDetector()
    raised = False
    try:
        result = await detector.detect(b"mock_multi_dog")
        # If it returns, it must NOT return multiple bboxes quietly
        assert False, (
            f"Expected MultiDogDetectedError but got result: {result}"
        )
    except MultiDogDetectedError:
        raised = True
    assert raised


# ---------------------------------------------------------------------------
# Low confidence
# ---------------------------------------------------------------------------

@pytest.mark.asyncio
async def test_low_confidence_returns_bbox_not_raises():
    """Low confidence detection is returned; the QualityGate decides rejection."""
    detector = MockNoseDetector()
    result = await detector.detect(b"mock_low_confidence")
    assert len(result) == 1


@pytest.mark.asyncio
async def test_low_confidence_value():
    detector = MockNoseDetector()
    result = await detector.detect(b"mock_low_confidence")
    assert result[0]["confidence"] == 0.45


@pytest.mark.asyncio
async def test_low_confidence_bbox_still_canonical():
    """Even a low-confidence result must satisfy the canonical bbox schema."""
    detector = MockNoseDetector()
    result = await detector.detect(b"mock_low_confidence")
    _assert_canonical_bbox(result[0])


# ---------------------------------------------------------------------------
# Logging guard — raw bytes must NOT appear in logs
# ---------------------------------------------------------------------------

@pytest.mark.asyncio
async def test_no_raw_bytes_logged_on_success(caplog):
    detector = MockNoseDetector()
    with caplog.at_level(logging.DEBUG, logger="app.services.detector"):
        await detector.detect(b"valid_dog_image")
    for record in caplog.records:
        assert b"valid_dog_image" not in record.getMessage().encode("utf-8", errors="ignore"), (
            "Raw image bytes appeared in log output — security violation"
        )


@pytest.mark.asyncio
async def test_no_raw_bytes_logged_on_no_dog(caplog):
    detector = MockNoseDetector()
    with caplog.at_level(logging.DEBUG, logger="app.services.detector"):
        try:
            await detector.detect(b"mock_no_dog_SENSITIVE_PAYLOAD_XYZ")
        except NoDogDetectedError:
            pass
    for record in caplog.records:
        assert b"SENSITIVE_PAYLOAD_XYZ" not in record.getMessage().encode("utf-8", errors="ignore"), (
            "Sensitive image bytes appeared in log output"
        )
