"""
Phase 1B — Bounding Box Clamping and Numerical Robustness Tests

Coverage:
  - Exact boundary coordinates (accepted and intact)
  - Slightly out-of-bounds coordinates (safely clamped without crash)
  - Inverted bounding box (x_min >= x_max or y_min >= y_max -> 422 BBOX_ZERO_AREA)
  - Zero-area bounding box -> 422 BBOX_ZERO_AREA
  - Negative/out-of-bounds coordinates with zero image overlap -> 422 BBOX_OUT_OF_BOUNDS
  - Non-finite coordinates (NaN, +inf, -inf) -> 422 INVALID_BBOX_FORMAT
  - Missing keys -> 422 INVALID_BBOX_FORMAT
"""
import pytest
from app.core.exceptions import DomainException
from app.ml.embedding.inference import _validate_bbox


def test_bbox_exact_boundaries():
    """Box covering the entire image boundaries is valid."""
    W, H = 200, 200
    bbox = {"x_min": 0, "y_min": 0, "x_max": 200, "y_max": 200}
    x1, y1, x2, y2 = _validate_bbox(bbox, img_width=W, img_height=H)
    assert (x1, y1, x2, y2) == (0, 0, 200, 200)


def test_bbox_interior_valid():
    """Interior box returns correctly clamped integer coordinates."""
    W, H = 300, 300
    bbox = {"x_min": 10.2, "y_min": 20.8, "x_max": 150.5, "y_max": 250.1}
    x1, y1, x2, y2 = _validate_bbox(bbox, img_width=W, img_height=H)
    assert x1 == 10
    assert y1 == 20
    assert x2 == 150
    assert y2 == 250


def test_bbox_slightly_out_of_bounds_clamped():
    """Slightly out-of-bounds box (e.g. YOLO jitter -5, 205) is clamped to [0, W], [0, H]."""
    W, H = 200, 200
    bbox = {"x_min": -5.0, "y_min": -2.0, "x_max": 205.0, "y_max": 190.0}
    x1, y1, x2, y2 = _validate_bbox(bbox, img_width=W, img_height=H)
    assert x1 == 0
    assert y1 == 0
    assert x2 == 200
    assert y2 == 190


def test_bbox_inverted_x_raises_domain_exception():
    """Inverted coordinates (x_min >= x_max) raise 422 BBOX_ZERO_AREA."""
    bbox = {"x_min": 100, "y_min": 10, "x_max": 50, "y_max": 100}
    with pytest.raises(DomainException) as exc_info:
        _validate_bbox(bbox, img_width=200, img_height=200)
    assert exc_info.value.status_code == 422
    assert exc_info.value.error_code == "BBOX_ZERO_AREA"


def test_bbox_inverted_y_raises_domain_exception():
    """Inverted coordinates (y_min >= y_max) raise 422 BBOX_ZERO_AREA."""
    bbox = {"x_min": 10, "y_min": 150, "x_max": 100, "y_max": 100}
    with pytest.raises(DomainException) as exc_info:
        _validate_bbox(bbox, img_width=200, img_height=200)
    assert exc_info.value.status_code == 422
    assert exc_info.value.error_code == "BBOX_ZERO_AREA"


def test_bbox_zero_area_raises_domain_exception():
    """Zero-area box (x_min == x_max) raises 422 BBOX_ZERO_AREA."""
    bbox = {"x_min": 50, "y_min": 10, "x_max": 50, "y_max": 100}
    with pytest.raises(DomainException) as exc_info:
        _validate_bbox(bbox, img_width=200, img_height=200)
    assert exc_info.value.status_code == 422
    assert exc_info.value.error_code == "BBOX_ZERO_AREA"


def test_bbox_zero_image_overlap_raises_domain_exception():
    """Box completely outside the image bounds raises 422 BBOX_OUT_OF_BOUNDS."""
    # Box entirely to the right
    bbox_right = {"x_min": 250, "y_min": 10, "x_max": 300, "y_max": 100}
    with pytest.raises(DomainException) as exc_info:
        _validate_bbox(bbox_right, img_width=200, img_height=200)
    assert exc_info.value.status_code == 422
    assert exc_info.value.error_code == "BBOX_OUT_OF_BOUNDS"

    # Box entirely to the left (negative coordinates)
    bbox_left = {"x_min": -100, "y_min": 10, "x_max": -10, "y_max": 100}
    with pytest.raises(DomainException) as exc_info:
        _validate_bbox(bbox_left, img_width=200, img_height=200)
    assert exc_info.value.status_code == 422
    assert exc_info.value.error_code == "BBOX_OUT_OF_BOUNDS"


def test_bbox_nan_or_inf_raises_domain_exception():
    """NaN or Inf values in coordinates raise 422 INVALID_BBOX_FORMAT."""
    for bad_val in [float("nan"), float("inf"), float("-inf")]:
        bbox = {"x_min": bad_val, "y_min": 10, "x_max": 100, "y_max": 100}
        with pytest.raises(DomainException) as exc_info:
            _validate_bbox(bbox, img_width=200, img_height=200)
        assert exc_info.value.status_code == 422
        assert exc_info.value.error_code == "INVALID_BBOX_FORMAT"


def test_bbox_missing_keys_raises_domain_exception():
    """Missing required coordinate keys raise 422 INVALID_BBOX_FORMAT."""
    bbox = {"x_min": 10, "y_min": 10, "x_max": 100}
    with pytest.raises(DomainException) as exc_info:
        _validate_bbox(bbox, img_width=200, img_height=200)
    assert exc_info.value.status_code == 422
    assert exc_info.value.error_code == "INVALID_BBOX_FORMAT"
