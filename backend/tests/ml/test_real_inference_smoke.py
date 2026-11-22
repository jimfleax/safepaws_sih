import asyncio
from pathlib import Path
import numpy as np
import pytest

from app.core.exceptions import NoDogDetectedError
from app.ml.embedding.config import EmbeddingModelConfig
from app.ml.embedding.inference import BiometricEmbeddingModel
from app.services.quality_gate import ClassicalQualityGate
from app.services.yolo_detector import YoloNoseDetector
from app.services.biometric_service import BiometricPipelineService
from app.vector_store.faiss_store import FAISSVectorStore


@pytest.fixture(scope="module")
def sample_dog_image():
    backend_dir = Path(__file__).resolve().parent.parent.parent
    img_path = backend_dir / "static" / "images" / "3476f4aad32242f791fde89e09f6f740_dog_nose.jpg"
    assert img_path.exists(), f"Sample image {img_path} must exist"
    return img_path.read_bytes()


@pytest.fixture(scope="module")
def non_dog_image():
    backend_dir = Path(__file__).resolve().parent.parent.parent
    img_path = backend_dir / "dummy.jpg"
    assert img_path.exists(), f"Dummy image {img_path} must exist"
    return img_path.read_bytes()


@pytest.mark.asyncio
async def test_real_yolo_detection(sample_dog_image):
    """Verify genuine YOLO detection against physical model weights (yolov8n.pt)."""
    detector = YoloNoseDetector()
    boxes = await detector.detect(sample_dog_image)
    assert len(boxes) == 1
    box = boxes[0]
    
    # Must be real detection, not mock [10, 10, 50, 50] with 0.95 confidence
    assert box["confidence"] > 0.80
    assert box["x_min"] > 100.0
    assert box["y_min"] > 100.0
    assert box["x_max"] > box["x_min"]
    assert box["y_max"] > box["y_min"]


@pytest.mark.asyncio
async def test_real_yolo_rejection_on_non_dog(non_dog_image):
    """Verify that images without dogs are rejected with NoDogDetectedError."""
    detector = YoloNoseDetector()
    with pytest.raises(NoDogDetectedError):
        await detector.detect(non_dog_image)


@pytest.mark.asyncio
async def test_real_embedding_generation(sample_dog_image):
    """Verify genuine 1280-d embedding extraction with L2 normalization."""
    detector = YoloNoseDetector()
    boxes = await detector.detect(sample_dog_image)
    
    embedder = BiometricEmbeddingModel(config=EmbeddingModelConfig(
        scaffold_mode=False,
        embedding_dimension=1280,
        backbone_architecture="mobilenet_v2"
    ))
    assert embedder.is_scaffold_mode is False
    
    embedding = await embedder.generate_embedding(sample_dog_image, boxes[0])
    assert isinstance(embedding, np.ndarray)
    assert embedding.shape == (1280,)
    assert embedding.dtype == np.float32
    
    # Check L2 unit-normalization
    norm = np.linalg.norm(embedding)
    assert np.isclose(norm, 1.0, atol=1e-4)


@pytest.mark.asyncio
async def test_real_biometric_pipeline_end_to_end(sample_dog_image):
    """Verify full BiometricPipelineService execution using real ML components."""
    detector = YoloNoseDetector()
    quality_gate = ClassicalQualityGate()
    embedder = BiometricEmbeddingModel(config=EmbeddingModelConfig(
        scaffold_mode=False,
        embedding_dimension=1280,
        backbone_architecture="mobilenet_v2"
    ))
    vector_store = FAISSVectorStore()
    
    pipeline = BiometricPipelineService(
        detector=detector,
        quality_gate=quality_gate,
        embedder=embedder,
        vector_store=vector_store
    )
    
    result = await pipeline.identify(sample_dog_image)
    assert result.status in ["MATCH", "NO_MATCH", "AMBIGUOUS", "UNKNOWN"]
    assert result.pipeline_mode == "PRODUCTION"
