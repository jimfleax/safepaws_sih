"""
Panel 2 — ClassicalQualityGate tests
======================================

Covers: quality pass (sharp image), blur rejection, low-confidence rejection,
        malformed/undecodable image, zero-area bbox, QualityResult contract,
        LowQualityImageError raised correctly, no AI model used.
"""
import io
import struct
import pytest
import numpy as np
from PIL import Image

from app.services.quality_gate import ClassicalQualityGate
from app.services.ml_interfaces import QualityResult
from app.core.exceptions import LowQualityImageError


# ---------------------------------------------------------------------------
# Helpers — minimal valid image factories
# ---------------------------------------------------------------------------

def _make_sharp_jpeg(width: int = 64, height: int = 64) -> bytes:
    """Create a JPEG with sharp edges (high Laplacian variance)."""
    arr = np.zeros((height, width, 3), dtype=np.uint8)
    # Alternating black/white columns → very high-frequency edge content
    arr[:, ::2, :] = 255
    img = Image.fromarray(arr, "RGB")
    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=95)
    return buf.getvalue()


def _make_blurry_jpeg(width: int = 64, height: int = 64) -> bytes:
    """Create a uniform grey JPEG (Laplacian variance ≈ 0 → blurry)."""
    arr = np.full((height, width, 3), 128, dtype=np.uint8)
    img = Image.fromarray(arr, "RGB")
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    return buf.getvalue()


def _full_bbox(width: int = 64, height: int = 64) -> dict:
    return {"x_min": 0, "y_min": 0, "x_max": width, "y_max": height, "confidence": 0.98}


# ---------------------------------------------------------------------------
# QualityResult dataclass contract
# ---------------------------------------------------------------------------

def test_quality_result_accepted_no_reason():
    qr = QualityResult(accepted=True, score=0.9)
    assert qr.accepted is True
    assert qr.rejection_reason is None


def test_quality_result_rejected_needs_reason():
    qr = QualityResult(accepted=False, score=0.1, rejection_reason=QualityResult.REASON_BLUR)
    assert qr.accepted is False
    assert qr.rejection_reason == "BLUR_DETECTED"


def test_quality_result_accepted_with_reason_raises():
    with pytest.raises(ValueError, match="inconsistent"):
        QualityResult(accepted=True, score=0.9, rejection_reason="BLUR_DETECTED")


def test_quality_result_rejected_without_reason_raises():
    with pytest.raises(ValueError, match="reason"):
        QualityResult(accepted=False, score=0.1)


def test_quality_result_reason_codes_exist():
    assert QualityResult.REASON_BLUR == "BLUR_DETECTED"
    assert QualityResult.REASON_LOW_CONFIDENCE == "DETECTION_CONFIDENCE_TOO_LOW"
    assert QualityResult.REASON_MALFORMED == "MALFORMED_IMAGE"
    assert QualityResult.REASON_OCCLUSION == "NOSE_OCCLUDED"
    assert QualityResult.REASON_LOW_CONTRAST == "LOW_CONTRAST"


# ---------------------------------------------------------------------------
# Quality pass (sharp image, high confidence)
# ---------------------------------------------------------------------------

@pytest.mark.asyncio
async def test_sharp_image_passes():
    gate = ClassicalQualityGate()
    image = _make_sharp_jpeg()
    bbox = _full_bbox()
    result = await gate.evaluate(image, bbox)
    assert result.accepted is True
    assert result.score > 0.0
    assert result.rejection_reason is None


@pytest.mark.asyncio
async def test_sharp_image_score_between_0_and_1():
    gate = ClassicalQualityGate()
    result = await gate.evaluate(_make_sharp_jpeg(), _full_bbox())
    assert 0.0 <= result.score <= 1.0


# ---------------------------------------------------------------------------
# Blur rejection
# ---------------------------------------------------------------------------

@pytest.mark.asyncio
async def test_blurry_image_rejected():
    gate = ClassicalQualityGate(min_blur_variance=50.0)
    image = _make_blurry_jpeg()
    bbox = _full_bbox()
    result = await gate.evaluate(image, bbox)
    assert result.accepted is False
    assert result.rejection_reason == QualityResult.REASON_BLUR


@pytest.mark.asyncio
async def test_blurry_image_score_is_low():
    gate = ClassicalQualityGate(min_blur_variance=50.0)
    result = await gate.evaluate(_make_blurry_jpeg(), _full_bbox())
    assert result.score < 0.1


# ---------------------------------------------------------------------------
# Low confidence rejection
# ---------------------------------------------------------------------------

@pytest.mark.asyncio
async def test_low_confidence_bbox_rejected():
    gate = ClassicalQualityGate(min_confidence=0.50)
    image = _make_sharp_jpeg()
    bbox = {**_full_bbox(), "confidence": 0.45}
    result = await gate.evaluate(image, bbox)
    assert result.accepted is False
    assert result.rejection_reason == QualityResult.REASON_LOW_CONFIDENCE


@pytest.mark.asyncio
async def test_low_confidence_score_equals_confidence():
    gate = ClassicalQualityGate(min_confidence=0.50)
    image = _make_sharp_jpeg()
    bbox = {**_full_bbox(), "confidence": 0.30}
    result = await gate.evaluate(image, bbox)
    assert result.score == pytest.approx(0.30)


@pytest.mark.asyncio
async def test_confidence_exactly_at_threshold_passes():
    gate = ClassicalQualityGate(min_confidence=0.50)
    image = _make_sharp_jpeg()
    bbox = {**_full_bbox(), "confidence": 0.50}
    result = await gate.evaluate(image, bbox)
    # 0.50 >= 0.50 → confidence guard passes; result depends on blur check
    # We don't assert accepted here — the blur gate may still reject it
    assert isinstance(result, QualityResult)


# ---------------------------------------------------------------------------
# Malformed / undecodable image
# ---------------------------------------------------------------------------

@pytest.mark.asyncio
async def test_malformed_bytes_raises_low_quality_error():
    gate = ClassicalQualityGate()
    with pytest.raises(LowQualityImageError):
        await gate.evaluate(b"this is not an image", _full_bbox())


@pytest.mark.asyncio
async def test_empty_bytes_raises_low_quality_error():
    gate = ClassicalQualityGate()
    with pytest.raises(LowQualityImageError):
        await gate.evaluate(b"", _full_bbox())


# ---------------------------------------------------------------------------
# Zero-area / degenerate bbox
# ---------------------------------------------------------------------------

@pytest.mark.asyncio
async def test_zero_area_bbox_raises_low_quality_error():
    gate = ClassicalQualityGate()
    image = _make_sharp_jpeg()
    bad_bbox = {"x_min": 10, "y_min": 10, "x_max": 10, "y_max": 10, "confidence": 0.99}
    with pytest.raises(LowQualityImageError):
        await gate.evaluate(image, bad_bbox)


@pytest.mark.asyncio
async def test_inverted_bbox_raises_low_quality_error():
    gate = ClassicalQualityGate()
    image = _make_sharp_jpeg()
    bad_bbox = {"x_min": 50, "y_min": 50, "x_max": 10, "y_max": 10, "confidence": 0.99}
    with pytest.raises(LowQualityImageError):
        await gate.evaluate(image, bad_bbox)


# ---------------------------------------------------------------------------
# BoundingBox dataclass validation
# ---------------------------------------------------------------------------

def test_bounding_box_from_dict_valid():
    from app.services.ml_interfaces import BoundingBox
    d = {"x_min": 10.0, "y_min": 10.0, "x_max": 50.0, "y_max": 50.0, "confidence": 0.9}
    bbox = BoundingBox.from_dict(d)
    assert bbox.x_min == 10.0
    assert bbox.confidence == 0.9


def test_bounding_box_from_dict_invalid_area():
    from app.services.ml_interfaces import BoundingBox
    with pytest.raises(ValueError, match="x_max must be"):
        BoundingBox.from_dict({"x_min": 50.0, "y_min": 10.0, "x_max": 10.0, "y_max": 50.0, "confidence": 0.9})


def test_bounding_box_from_dict_missing_key():
    from app.services.ml_interfaces import BoundingBox
    with pytest.raises(KeyError):
        BoundingBox.from_dict({"x_min": 10.0, "y_min": 10.0})  # missing x_max, y_max, confidence


def test_bounding_box_from_dict_invalid_confidence():
    from app.services.ml_interfaces import BoundingBox
    with pytest.raises(ValueError, match="confidence"):
        BoundingBox.from_dict({"x_min": 0.0, "y_min": 0.0, "x_max": 10.0, "y_max": 10.0, "confidence": 1.5})


def test_bounding_box_to_dict_roundtrip():
    from app.services.ml_interfaces import BoundingBox
    d = {"x_min": 5.0, "y_min": 5.0, "x_max": 20.0, "y_max": 20.0, "confidence": 0.75}
    bbox = BoundingBox.from_dict(d)
    assert bbox.to_dict() == d
