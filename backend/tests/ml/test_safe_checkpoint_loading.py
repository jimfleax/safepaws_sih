import os
import tempfile
import pytest
import torch
import numpy as np

from app.core.exceptions import DomainException
from app.ml.embedding.config import EmbeddingModelConfig
from app.ml.embedding.inference import BiometricEmbeddingModel


def test_valid_structured_checkpoint_loading():
    """Verify that a valid structured checkpoint with weights_only loads safely without error."""
    config = EmbeddingModelConfig(
        model_weights_path="backend/model_weights/embedding_v1.pt",
        checkpoint_metadata_path="backend/model_weights/checkpoint.json",
        backbone_architecture="mobilenet_v2",
        embedding_dimension=1280
    )
    model = BiometricEmbeddingModel(config=config)
    assert model.is_loaded is True
    assert model.is_scaffold_mode is False


def test_checkpoint_dimension_and_dtype():
    """Verify that model extracts 1280-dimensional float32 vector with unit norm."""
    config = EmbeddingModelConfig(
        model_weights_path="backend/model_weights/embedding_v1.pt",
        checkpoint_metadata_path="backend/model_weights/checkpoint.json",
        backbone_architecture="mobilenet_v2",
        embedding_dimension=1280
    )
    model = BiometricEmbeddingModel(config=config)
    
    with open("docs/assets/real_dog.jpg", "rb") as f:
        img_bytes = f.read()
    
    bbox = {"x_min": 230, "y_min": 193, "x_max": 332, "y_max": 311}
    import asyncio
    emb = asyncio.run(model.generate_embedding(img_bytes, bbox))
    
    assert emb.shape == (1280,)
    assert emb.dtype == np.float32
    norm = float(np.linalg.norm(emb))
    assert pytest.approx(norm, rel=1e-4) == 1.0


def test_architecture_mismatch_fails_closed():
    """Verify that an architecture mismatch between config and checkpoint fails with 503."""
    config = EmbeddingModelConfig(
        model_weights_path="backend/model_weights/embedding_v1.pt",
        checkpoint_metadata_path="backend/model_weights/checkpoint.json",
        backbone_architecture="resnet50",  # Mismatch!
        embedding_dimension=1280
    )
    with pytest.raises(DomainException) as exc_info:
        BiometricEmbeddingModel(config=config)
    assert exc_info.value.status_code == 503
    assert exc_info.value.error_code in ["CHECKPOINT_ARCH_MISMATCH", "CHECKPOINT_BACKBONE_MISMATCH", "CHECKPOINT_METADATA_CORRUPT"]


def test_corrupted_checkpoint_fails_closed():
    """Verify that a corrupt checkpoint file fails closed with MODEL_LOAD_FAILURE."""
    with tempfile.NamedTemporaryFile(suffix=".pt", delete=False) as tmp:
        tmp.write(b"NOT_A_VALID_TORCH_FILE")
        tmp_path = tmp.name

    try:
        config = EmbeddingModelConfig(
            model_weights_path=tmp_path,
            checkpoint_metadata_path="backend/model_weights/checkpoint.json",
            backbone_architecture="mobilenet_v2",
            embedding_dimension=1280
        )
        with pytest.raises(DomainException) as exc_info:
            BiometricEmbeddingModel(config=config)
        assert exc_info.value.status_code == 503
        assert exc_info.value.error_code == "MODEL_LOAD_FAILURE"
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)


def test_missing_checkpoint_fails_closed():
    """Verify that a missing checkpoint file fails closed with CHECKPOINT_MISSING."""
    config = EmbeddingModelConfig(
        model_weights_path="nonexistent_checkpoint_file.pt",
        checkpoint_metadata_path="backend/model_weights/checkpoint.json",
        backbone_architecture="mobilenet_v2",
        embedding_dimension=1280
    )
    with pytest.raises(DomainException) as exc_info:
        BiometricEmbeddingModel(config=config)
    assert exc_info.value.status_code == 503
    assert exc_info.value.error_code == "CHECKPOINT_MISSING"
