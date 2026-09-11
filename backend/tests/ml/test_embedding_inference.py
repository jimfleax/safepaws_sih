"""
Panel 3 — Biometric Embedding Inference Tests

Coverage:
  - bbox validation (canonical x_min/y_min/x_max/y_max format)
  - preprocessing determinism
  - output dtype, shape, finite values, L2 norm
  - scaffold mode behavior
  - production mode: missing checkpoint, missing metadata, dim mismatch, backbone mismatch
  - degenerate embedding detection
"""
import io
import json
import os
import tempfile

import numpy as np
import pytest
from PIL import Image

from app.core.exceptions import DomainException
from app.ml.embedding.config import EmbeddingModelConfig, PreprocessingConfig
from app.ml.embedding.inference import (
    BiometricEmbeddingModel,
    _l2_normalize,
    _preprocess_crop,
    _validate_bbox,
)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _make_image_bytes(width: int = 200, height: int = 200, color=(128, 64, 32)) -> bytes:
    """Create a minimal valid RGB JPEG in memory."""
    img = Image.new("RGB", (width, height), color=color)
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


def _make_scaffold_model(dim: int = 128) -> BiometricEmbeddingModel:
    cfg = EmbeddingModelConfig(embedding_dimension=dim, scaffold_mode=True)
    return BiometricEmbeddingModel(config=cfg)


VALID_BBOX = {"x_min": 10, "y_min": 10, "x_max": 100, "y_max": 100}


# ---------------------------------------------------------------------------
# bbox validation
# ---------------------------------------------------------------------------

class TestBboxValidation:
    def test_valid_bbox_returns_coords(self):
        x_min, y_min, x_max, y_max = _validate_bbox(VALID_BBOX, img_width=200, img_height=200)
        assert (x_min, y_min, x_max, y_max) == (10, 10, 100, 100)

    def test_missing_key_raises(self):
        bad_bbox = {"x": 0, "y": 0, "w": 100, "h": 100}  # old format
        with pytest.raises(DomainException) as exc:
            _validate_bbox(bad_bbox, 200, 200)
        assert exc.value.error_code == "INVALID_BBOX_FORMAT"

    def test_out_of_bounds_raises(self):
        bbox = {"x_min": 0, "y_min": 0, "x_max": 300, "y_max": 300}
        with pytest.raises(DomainException) as exc:
            _validate_bbox(bbox, 200, 200)
        assert exc.value.error_code == "BBOX_OUT_OF_BOUNDS"

    def test_zero_area_raises(self):
        bbox = {"x_min": 50, "y_min": 50, "x_max": 50, "y_max": 100}
        with pytest.raises(DomainException) as exc:
            _validate_bbox(bbox, 200, 200)
        assert exc.value.error_code == "BBOX_ZERO_AREA"

    def test_negative_area_raises(self):
        bbox = {"x_min": 100, "y_min": 100, "x_max": 50, "y_max": 50}
        with pytest.raises(DomainException) as exc:
            _validate_bbox(bbox, 200, 200)
        assert exc.value.error_code == "BBOX_ZERO_AREA"

    def test_negative_coords_raises(self):
        bbox = {"x_min": -5, "y_min": 0, "x_max": 100, "y_max": 100}
        with pytest.raises(DomainException) as exc:
            _validate_bbox(bbox, 200, 200)
        assert exc.value.error_code == "BBOX_OUT_OF_BOUNDS"


# ---------------------------------------------------------------------------
# Preprocessing determinism
# ---------------------------------------------------------------------------

class TestPreprocessing:
    def test_preprocessing_is_deterministic(self):
        image_bytes = _make_image_bytes()
        cfg = PreprocessingConfig()
        arr1 = _preprocess_crop(image_bytes, VALID_BBOX, cfg)
        arr2 = _preprocess_crop(image_bytes, VALID_BBOX, cfg)
        assert np.allclose(arr1, arr2)

    def test_different_images_produce_different_output(self):
        img1 = _make_image_bytes(color=(255, 0, 0))
        img2 = _make_image_bytes(color=(0, 0, 255))
        cfg = PreprocessingConfig()
        arr1 = _preprocess_crop(img1, VALID_BBOX, cfg)
        arr2 = _preprocess_crop(img2, VALID_BBOX, cfg)
        assert not np.allclose(arr1, arr2)

    def test_output_shape_matches_input_size(self):
        cfg = PreprocessingConfig(input_size=(112, 112))
        arr = _preprocess_crop(_make_image_bytes(), VALID_BBOX, cfg)
        assert arr.shape == (112, 112, 3)

    def test_output_dtype_is_float32(self):
        cfg = PreprocessingConfig()
        arr = _preprocess_crop(_make_image_bytes(), VALID_BBOX, cfg)
        assert arr.dtype == np.float32

    def test_invalid_image_bytes_raises(self):
        cfg = PreprocessingConfig()
        with pytest.raises(DomainException) as exc:
            _preprocess_crop(b"not_an_image", VALID_BBOX, cfg)
        assert exc.value.error_code == "IMAGE_DECODE_FAILURE"


# ---------------------------------------------------------------------------
# L2 normalization
# ---------------------------------------------------------------------------

class TestL2Normalize:
    def test_unit_vector(self):
        v = np.array([3.0, 4.0], dtype=np.float32)
        normed = _l2_normalize(v)
        assert np.isclose(np.linalg.norm(normed), 1.0)

    def test_already_normalized_unchanged(self):
        v = np.array([1.0, 0.0, 0.0], dtype=np.float32)
        normed = _l2_normalize(v)
        assert np.allclose(normed, v)

    def test_zero_vector_raises(self):
        v = np.zeros(128, dtype=np.float32)
        with pytest.raises(DomainException) as exc:
            _l2_normalize(v)
        assert exc.value.error_code == "DEGENERATE_EMBEDDING"


# ---------------------------------------------------------------------------
# Scaffold mode inference
# ---------------------------------------------------------------------------

class TestScaffoldModeInference:
    def test_scaffold_model_loads_without_checkpoint(self):
        model = _make_scaffold_model(128)
        assert model.is_loaded is True

    @pytest.mark.asyncio
    async def test_output_dtype(self):
        model = _make_scaffold_model(128)
        emb = await model.generate_embedding(_make_image_bytes(), VALID_BBOX)
        assert emb.dtype == np.float32

    @pytest.mark.asyncio
    async def test_output_dimension(self):
        model = _make_scaffold_model(256)
        emb = await model.generate_embedding(_make_image_bytes(), VALID_BBOX)
        assert emb.shape == (256,)

    @pytest.mark.asyncio
    async def test_output_l2_normalized(self):
        model = _make_scaffold_model(128)
        emb = await model.generate_embedding(_make_image_bytes(), VALID_BBOX)
        assert np.isclose(np.linalg.norm(emb), 1.0, atol=1e-6)

    @pytest.mark.asyncio
    async def test_output_is_finite(self):
        model = _make_scaffold_model(128)
        emb = await model.generate_embedding(_make_image_bytes(), VALID_BBOX)
        assert np.all(np.isfinite(emb))

    @pytest.mark.asyncio
    async def test_same_image_same_bbox_deterministic(self):
        model = _make_scaffold_model(128)
        img = _make_image_bytes()
        emb1 = await model.generate_embedding(img, VALID_BBOX)
        emb2 = await model.generate_embedding(img, VALID_BBOX)
        assert np.allclose(emb1, emb2)

    @pytest.mark.asyncio
    async def test_different_images_produce_different_embeddings(self):
        """Scaffold is deterministic per image; different images should differ."""
        model = _make_scaffold_model(128)
        emb1 = await model.generate_embedding(_make_image_bytes(color=(255, 0, 0)), VALID_BBOX)
        emb2 = await model.generate_embedding(_make_image_bytes(color=(0, 255, 0)), VALID_BBOX)
        # They should not be identical (different pixel stats → different seed)
        assert not np.allclose(emb1, emb2)

    @pytest.mark.asyncio
    async def test_model_not_loaded_raises(self):
        model = _make_scaffold_model()
        model.is_loaded = False
        with pytest.raises(DomainException) as exc:
            await model.generate_embedding(_make_image_bytes(), VALID_BBOX)
        assert exc.value.error_code == "MODEL_NOT_LOADED"

    @pytest.mark.asyncio
    async def test_invalid_bbox_format_raises(self):
        model = _make_scaffold_model()
        bad_bbox = {"x": 0, "y": 0, "w": 100, "h": 100}
        with pytest.raises(DomainException) as exc:
            await model.generate_embedding(_make_image_bytes(), bad_bbox)
        assert exc.value.error_code == "INVALID_BBOX_FORMAT"


# ---------------------------------------------------------------------------
# Production mode: checkpoint failure cases
# ---------------------------------------------------------------------------

class TestProductionModeCheckpoints:
    def test_missing_checkpoint_raises(self):
        cfg = EmbeddingModelConfig(
            scaffold_mode=False,
            model_weights_path="/nonexistent/model.pt",
            checkpoint_metadata_path="/nonexistent/checkpoint.json",
        )
        with pytest.raises(DomainException) as exc:
            BiometricEmbeddingModel(config=cfg)
        assert exc.value.error_code == "CHECKPOINT_MISSING"

    def test_missing_metadata_raises(self, tmp_path):
        # Weights file exists but metadata does not
        weights = tmp_path / "model.pt"
        weights.write_bytes(b"fake_weights")
        cfg = EmbeddingModelConfig(
            scaffold_mode=False,
            model_weights_path=str(weights),
            checkpoint_metadata_path=str(tmp_path / "nonexistent.json"),
        )
        with pytest.raises(DomainException) as exc:
            BiometricEmbeddingModel(config=cfg)
        assert exc.value.error_code == "CHECKPOINT_METADATA_MISSING"

    def test_corrupt_metadata_raises(self, tmp_path):
        weights = tmp_path / "model.pt"
        weights.write_bytes(b"fake_weights")
        meta = tmp_path / "checkpoint.json"
        meta.write_bytes(b"NOT JSON {{{{")
        cfg = EmbeddingModelConfig(
            scaffold_mode=False,
            model_weights_path=str(weights),
            checkpoint_metadata_path=str(meta),
        )
        with pytest.raises(DomainException) as exc:
            BiometricEmbeddingModel(config=cfg)
        assert exc.value.error_code == "CHECKPOINT_METADATA_CORRUPT"

    def test_dimension_mismatch_raises(self, tmp_path):
        weights = tmp_path / "model.pt"
        weights.write_bytes(b"fake_weights")
        meta = tmp_path / "checkpoint.json"
        meta.write_text(json.dumps({"embedding_dimension": 512, "backbone_architecture": "resnet50"}))
        cfg = EmbeddingModelConfig(
            scaffold_mode=False,
            embedding_dimension=128,
            model_weights_path=str(weights),
            checkpoint_metadata_path=str(meta),
        )
        with pytest.raises(DomainException) as exc:
            BiometricEmbeddingModel(config=cfg)
        assert exc.value.error_code == "CHECKPOINT_DIM_MISMATCH"

    def test_backbone_mismatch_raises(self, tmp_path):
        weights = tmp_path / "model.pt"
        weights.write_bytes(b"fake_weights")
        meta = tmp_path / "checkpoint.json"
        meta.write_text(json.dumps({"embedding_dimension": 128, "backbone_architecture": "mobilenet_v3_small"}))
        cfg = EmbeddingModelConfig(
            scaffold_mode=False,
            backbone_architecture="resnet50",
            embedding_dimension=128,
            model_weights_path=str(weights),
            checkpoint_metadata_path=str(meta),
        )
        with pytest.raises(DomainException) as exc:
            BiometricEmbeddingModel(config=cfg)
        assert exc.value.error_code == "CHECKPOINT_BACKBONE_MISMATCH"

    def test_matching_metadata_proceeds_to_load_attempt(self, tmp_path):
        """With matching metadata, it should NOT raise checkpoint errors — only model load error."""
        weights = tmp_path / "model.pt"
        weights.write_bytes(b"fake_weights")
        meta = tmp_path / "checkpoint.json"
        meta.write_text(json.dumps({"embedding_dimension": 128, "backbone_architecture": "resnet50"}))
        cfg = EmbeddingModelConfig(
            scaffold_mode=False,
            backbone_architecture="resnet50",
            embedding_dimension=128,
            model_weights_path=str(weights),
            checkpoint_metadata_path=str(meta),
        )
        # Should get NotImplementedError (real loader not yet implemented), not a checkpoint error
        with pytest.raises(NotImplementedError):
            BiometricEmbeddingModel(config=cfg)
