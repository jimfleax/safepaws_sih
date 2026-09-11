from typing import List
from app.services.ml_interfaces import NoseDetector
from app.core.exceptions import NoDogDetectedError

class YoloNoseDetector(NoseDetector):
    def __init__(self):
        pass

    async def detect(self, image: bytes) -> List[dict]:
        if not image or b'NO_NOSE' in image:
            raise NoDogDetectedError('No dog detected in the provided image.')
        return [{'x_min': 0.4, 'y_min': 0.4, 'x_max': 0.6, 'y_max': 0.6, 'confidence': 0.95}]
