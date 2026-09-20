import io
import logging
from typing import List
from PIL import Image
import numpy as np

from app.services.ml_interfaces import NoseDetector
from app.core.exceptions import NoDogDetectedError, MultiDogDetectedError

try:
    from ultralytics import YOLO
except ImportError:
    YOLO = None

logger = logging.getLogger(__name__)

class YoloNoseDetector(NoseDetector):
    def __init__(self, model_path: str = "yolov8n.pt"):
        if YOLO is None:
            raise RuntimeError("ultralytics package is required for YoloNoseDetector")
        self.model = YOLO(model_path)
        self.dog_class_id = 16

    async def detect(self, image: bytes) -> List[dict]:
        if not image:
            logger.warning("Empty image payload received.")
            raise NoDogDetectedError()

        try:
            img = Image.open(io.BytesIO(image)).convert("RGB")
        except Exception as e:
            logger.error(f"Image decode failed: {e}")
            raise NoDogDetectedError()

        results = self.model(img, verbose=False)
        
        bboxes = []
        for result in results:
            boxes = result.boxes
            for box in boxes:
                cls_id = int(box.cls[0].item())
                if cls_id == self.dog_class_id:
                    conf = float(box.conf[0].item())
                    x1, y1, x2, y2 = box.xyxy[0].tolist()
                    
                    w = x2 - x1
                    h = y2 - y1
                    
                    nx1 = x1 + w * 0.35
                    ny1 = y1 + h * 0.35
                    nx2 = x2 - w * 0.35
                    ny2 = y2 - h * 0.35
                    
                    bboxes.append({
                        "x_min": float(nx1),
                        "y_min": float(ny1),
                        "x_max": float(nx2),
                        "y_max": float(ny2),
                        "confidence": conf
                    })
                    
        if len(bboxes) == 0:
            logger.info("No dog detected by YOLO.")
            raise NoDogDetectedError()
            
        if len(bboxes) > 1:
            logger.warning(f"Multiple dogs detected ({len(bboxes)}).")
            raise MultiDogDetectedError()
            
        return bboxes
