import pytest
import numpy as np
from app.ml.embedding.inference import BiometricEmbeddingModel
from app.ml.embedding.config import EmbeddingModelConfig
from app.core.exceptions import DomainException

def test_model_initialization():
    config = EmbeddingModelConfig(embedding_dimension=128)
    model = BiometricEmbeddingModel(config=config)
    assert model.is_loaded is True

@pytest.mark.asyncio
async def test_generate_embedding_deterministic():
    config = EmbeddingModelConfig(embedding_dimension=256)
    model = BiometricEmbeddingModel(config=config)
    
    # Create a dummy valid image (e.g., a simple solid color 224x224 PNG in bytes)
    # Since we can't easily generate a real PNG here without PIL in the test, 
    # we'll mock the _preprocess function to just return a numpy array
    model._preprocess = lambda image, bbox: np.ones((224, 224, 3), dtype=np.float32)
    
    bbox = {"x": 0, "y": 0, "w": 100, "h": 100}
    emb1 = await model.generate_embedding(b"dummy", bbox)
    emb2 = await model.generate_embedding(b"dummy", bbox)
    
    assert emb1.shape == (256,)
    assert emb1.dtype == np.float32
    assert np.allclose(emb1, emb2) # Deterministic

@pytest.mark.asyncio
async def test_generate_embedding_l2_normalized():
    config = EmbeddingModelConfig(embedding_dimension=128)
    model = BiometricEmbeddingModel(config=config)
    
    model._preprocess = lambda image, bbox: np.random.rand(224, 224, 3).astype(np.float32)
    bbox = {"x": 0, "y": 0, "w": 100, "h": 100}
    
    emb = await model.generate_embedding(b"dummy", bbox)
    
    # Check L2 norm is exactly 1.0
    norm = np.linalg.norm(emb)
    assert np.isclose(norm, 1.0)
    
@pytest.mark.asyncio
async def test_generate_embedding_not_loaded():
    model = BiometricEmbeddingModel()
    model.is_loaded = False
    with pytest.raises(DomainException) as exc:
        await model.generate_embedding(b"dummy", {})
    assert exc.value.error_code == "MODEL_NOT_LOADED"
