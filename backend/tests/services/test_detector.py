import pytest
from app.services.detector import MockNoseDetector
from app.core.exceptions import NoDogDetectedError, MultiDogDetectedError

@pytest.mark.asyncio
async def test_valid_detection():
    detector = MockNoseDetector()
    result = await detector.detect(b"valid_dog_image")
    assert len(result) == 1
    bbox = result[0]
    assert "x_min" in bbox
    assert "y_min" in bbox
    assert "x_max" in bbox
    assert "y_max" in bbox
    assert "confidence" in bbox
    assert bbox["confidence"] == 0.98

@pytest.mark.asyncio
async def test_no_detection():
    detector = MockNoseDetector()
    with pytest.raises(NoDogDetectedError):
        await detector.detect(b"mock_no_dog")

@pytest.mark.asyncio
async def test_multi_dog_detection():
    detector = MockNoseDetector()
    with pytest.raises(MultiDogDetectedError):
        await detector.detect(b"mock_multi_dog")

@pytest.mark.asyncio
async def test_low_confidence():
    detector = MockNoseDetector()
    result = await detector.detect(b"mock_low_confidence")
    assert len(result) == 1
    assert result[0]["confidence"] == 0.45

@pytest.mark.asyncio
async def test_empty_image():
    detector = MockNoseDetector()
    with pytest.raises(NoDogDetectedError):
        await detector.detect(b"")
