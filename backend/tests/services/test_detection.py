import pytest
from app.services.detection import YoloNoseDetector
from app.core.exceptions import NoDogDetectedError

@pytest.mark.asyncio
async def test_yolo_nose_detector_detects_nose():
    detector = YoloNoseDetector()
    result = await detector.detect(b'fake_image_with_dog')
    assert len(result) == 1
    assert result[0]['confidence'] == 0.95

@pytest.mark.asyncio
async def test_yolo_nose_detector_raises_error():
    detector = YoloNoseDetector()
    with pytest.raises(NoDogDetectedError):
        await detector.detect(b'NO_NOSE')
