import logging
from typing import List
from app.services.ml_interfaces import NoseDetector
from app.core.exceptions import NoDogDetectedError, MultiDogDetectedError

logger = logging.getLogger(__name__)

class MockNoseDetector(NoseDetector):
    async def detect(self, image: bytes) -> List[dict]:
        """
        Deterministic mock implementation of NoseDetector.
        Parses special byte sequences to simulate detection states for M0 tests.
        """
        if not image:
            logger.warning("Empty image payload received for nose detection.")
            raise NoDogDetectedError()

        # Deterministic simulation based on mock image payload
        payload = image.decode("utf-8", errors="ignore")
        
        if "mock_no_dog" in payload:
            logger.info("Mock evaluation: No dog detected.")
            raise NoDogDetectedError()
            
        if "mock_multi_dog" in payload:
            logger.warning("Mock evaluation: Multiple dogs detected in single frame.")
            raise MultiDogDetectedError()
            
        if "mock_low_confidence" in payload:
            bboxes = [{
                "x_min": 10.0,
                "y_min": 10.0,
                "x_max": 30.0,
                "y_max": 30.0,
                "confidence": 0.45
            }]
            logger.info(f"Mock evaluation: Low confidence detection completed. BBoxes: {bboxes}")
            return bboxes
            
        # Default successful single detection
        bboxes = [{
            "x_min": 40.0,
            "y_min": 40.0,
            "x_max": 160.0,
            "y_max": 160.0,
            "confidence": 0.98
        }]
        logger.info(f"Mock evaluation: Successful detection. BBoxes: {bboxes}")
        return bboxes

