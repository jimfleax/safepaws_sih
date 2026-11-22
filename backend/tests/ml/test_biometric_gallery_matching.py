import os
import pytest
from app.services.yolo_detector import YoloNoseDetector
from app.ml.embedding.inference import BiometricEmbeddingModel
from app.ml.embedding.config import EmbeddingModelConfig
from app.services.biometric_service import BiometricPipelineService
from app.vector_store.faiss_store import FAISSVectorStore
from app.core.exceptions import NoDogDetectedError


class MockQualityGate:
    async def evaluate(self, image_bytes: bytes, bbox: dict):
        class QualityResult:
            accepted = True
            rejection_reason = None
            score = 0.99
        return QualityResult()


@pytest.fixture(scope="module")
def real_pipeline():
    test_faiss_path = "test_gallery_match_faiss.bin"
    resolved_bin = os.path.join("backend", test_faiss_path)
    resolved_meta = f"{resolved_bin}.meta.json"
    
    if os.path.exists(resolved_bin):
        os.remove(resolved_bin)
    if os.path.exists(resolved_meta):
        os.remove(resolved_meta)

    vector_store = FAISSVectorStore(dimension=1280, index_path=test_faiss_path)
    detector = YoloNoseDetector()
    embedder = BiometricEmbeddingModel(EmbeddingModelConfig(
        model_weights_path="backend/model_weights/embedding_v1.pt",
        checkpoint_metadata_path="backend/model_weights/checkpoint.json",
        backbone_architecture="mobilenet_v2",
        embedding_dimension=1280
    ))
    pipeline = BiometricPipelineService(detector, MockQualityGate(), embedder, vector_store)
    
    yield pipeline, vector_store
    
    if os.path.exists(resolved_bin):
        os.remove(resolved_bin)
    if os.path.exists(resolved_meta):
        os.remove(resolved_meta)


@pytest.mark.asyncio
async def test_empty_gallery_returns_unknown(real_pipeline):
    """Scenario 1: Query against an empty gallery must return UNKNOWN with no matches."""
    pipeline, vs = real_pipeline
    with open("docs/assets/real_dog.jpg", "rb") as f:
        img_bytes = f.read()

    response = await pipeline.identify(img_bytes)
    assert response.status == "UNKNOWN"
    assert len(response.matches) == 0
    assert "No candidates in gallery" in response.message


@pytest.mark.asyncio
async def test_gallery_matching_same_dog(real_pipeline):
    """Scenario 2 & 3: Enroll dog A (unique_dog.jpg) and identify with second capture (real_dog.jpg) -> MATCH."""
    pipeline, vs = real_pipeline
    
    with open("docs/assets/unique_dog.jpg", "rb") as f:
        enroll_bytes = f.read()
    with open("docs/assets/real_dog.jpg", "rb") as f:
        query_same_dog = f.read()

    # Enroll dog A
    emb_enroll = await pipeline._process_image(enroll_bytes)
    added = await vs.add_vector("pet-gold-101", emb_enroll)
    assert added is True

    # Identify query
    response = await pipeline.identify(query_same_dog)
    assert response.status == "MATCH"
    assert len(response.matches) >= 1
    assert response.matches[0].pet_id == "pet-gold-101"
    assert response.matches[0].confidence >= 0.85


@pytest.mark.asyncio
async def test_gallery_matching_ambiguous_candidate(real_pipeline):
    """Scenario 4: Query with visually similar dog (dog.jpg) produces AMBIGUOUS status."""
    pipeline, vs = real_pipeline
    with open("docs/assets/dog.jpg", "rb") as f:
        ambiguous_bytes = f.read()

    response = await pipeline.identify(ambiguous_bytes)
    assert response.status == "AMBIGUOUS"
    assert len(response.matches) >= 1
    assert 0.70 <= response.matches[0].confidence < 0.85


@pytest.mark.asyncio
async def test_gallery_matching_different_dog_rejection(real_pipeline):
    """Scenario 5: Query with different dog (dog_nose.jpg) produces UNKNOWN rejection."""
    pipeline, vs = real_pipeline
    with open("docs/assets/dog_nose.jpg", "rb") as f:
        different_bytes = f.read()

    response = await pipeline.identify(different_bytes)
    assert response.status == "UNKNOWN"
    assert len(response.matches) == 0


@pytest.mark.asyncio
async def test_non_dog_image_rejection(real_pipeline):
    """Scenario 6: Non-dog image (nodog.jpg) is rejected with NoDogDetectedError."""
    pipeline, vs = real_pipeline
    with open("docs/assets/nodog.jpg", "rb") as f:
        nodog_bytes = f.read()

    with pytest.raises(NoDogDetectedError):
        await pipeline.identify(nodog_bytes)
