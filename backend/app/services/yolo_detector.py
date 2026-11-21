import io
import logging
import os
from pathlib import Path

from PIL import Image

from app.core.exceptions import MultiDogDetectedError, NoDogDetectedError
from app.services.ml_interfaces import NoseDetector

try:
    from ultralytics import YOLO
except ImportError:
    YOLO = None

logger = logging.getLogger(__name__)


def _resolve_model_path(model_path: str = "yolov8n.pt") -> str:
    env_path = os.environ.get("YOLO_MODEL_PATH")
    if env_path and os.path.exists(env_path):
        return env_path
    if os.path.exists(model_path):
        return model_path
    backend_dir = Path(__file__).resolve().parent.parent.parent
    candidates = [
        backend_dir / "model_weights" / model_path,
        backend_dir / model_path,
        backend_dir / "model_weights" / "yolov8n.pt",
        backend_dir / "yolov8n.pt",
    ]
    for c in candidates:
        if c.exists():
            return str(c)
    return model_path


class YoloNoseDetector(NoseDetector):
    def __init__(self, model_path: str = "yolov8n.pt"):
        if YOLO is None:
            raise RuntimeError("ultralytics package is required for YoloNoseDetector")
        resolved_path = _resolve_model_path(model_path)
        self.model = YOLO(resolved_path)
        self.dog_class_id = 16

    async def detect(self, image: bytes) -> list[dict]:
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
