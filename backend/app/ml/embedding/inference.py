"""
BiometricEmbeddingModel — Panel 3 ownership.

Responsibility boundary:
  - Receives image bytes + validated bounding box (x_min, y_min, x_max, y_max format).
  - Performs deterministic crop, resize, normalize.
  - Runs backbone + metric-learning head (or scaffold if explicitly configured).
  - Returns L2-normalized float32 numpy array of the configured dimension.

This class MUST NOT:
  - run detection
  - choose between multiple detections
  - access the database
  - query FAISS
  - make identity decisions

Bounding box contract (canonical, must match Panel 2 output):
  {"x_min": int, "y_min": int, "x_max": int, "y_max": int}
"""
import io
import json
import logging
import os
from typing import Optional

import numpy as np
from PIL import Image

from app.core.exceptions import DomainException
from app.ml.embedding.config import EmbeddingModelConfig, PreprocessingConfig

logger = logging.getLogger(__name__)


def _validate_bbox(bbox: dict, img_width: int, img_height: int) -> tuple[int, int, int, int]:
    """
    Validate and extract canonical bounding box.
    Canonical format: x_min, y_min, x_max, y_max (absolute pixel coordinates).

    Raises DomainException for any malformed, out-of-bounds, or zero-area box.
    """
    required_keys = {"x_min", "y_min", "x_max", "y_max"}
    if not required_keys.issubset(bbox.keys()):
        raise DomainException(
            message=f"Bounding box must contain keys {required_keys}. Got: {set(bbox.keys())}",
            error_code="INVALID_BBOX_FORMAT",
            status_code=422,
        )

    x_min = int(bbox["x_min"])
    y_min = int(bbox["y_min"])
    x_max = int(bbox["x_max"])
    y_max = int(bbox["y_max"])

    if x_min < 0 or y_min < 0 or x_max > img_width or y_max > img_height:
        raise DomainException(
            message=f"Bounding box {bbox} is out of image bounds ({img_width}x{img_height}).",
            error_code="BBOX_OUT_OF_BOUNDS",
            status_code=422,
        )

    if x_max <= x_min or y_max <= y_min:
        raise DomainException(
            message=f"Bounding box has zero or negative area: {bbox}.",
            error_code="BBOX_ZERO_AREA",
            status_code=422,
        )

    return x_min, y_min, x_max, y_max


def _preprocess_crop(
    image_bytes: bytes,
    bbox: dict,
    preprocessing_cfg: PreprocessingConfig,
) -> np.ndarray:
    """
    Deterministic preprocessing pipeline.
    Steps:
      1. Decode image bytes → PIL RGB
      2. Validate and apply bounding box crop
      3. Resize to input_size (antialias)
      4. Normalize per channel: (pixel/255 - mean) / std
      5. Return HWC float32 numpy array

    This function is pure — no side effects, no randomness.
    """
    try:
        img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    except Exception as exc:
        raise DomainException(
            message=f"Could not decode image bytes: {exc}",
            error_code="IMAGE_DECODE_FAILURE",
            status_code=400,
        ) from exc

    x_min, y_min, x_max, y_max = _validate_bbox(bbox, img.width, img.height)
    crop = img.crop((x_min, y_min, x_max, y_max))

    h, w = preprocessing_cfg.input_size
    resample = Image.LANCZOS if preprocessing_cfg.antialias else Image.BILINEAR
    crop = crop.resize((w, h), resample=resample)

    arr = np.array(crop, dtype=np.float32) / 255.0

    mean = np.array(preprocessing_cfg.mean, dtype=np.float32)
    std = np.array(preprocessing_cfg.std, dtype=np.float32)
    arr = (arr - mean) / std  # shape: (H, W, 3)

    return arr


def _l2_normalize(vector: np.ndarray) -> np.ndarray:
    """
    L2-normalize a 1D float32 vector.
    Raises DomainException if norm is zero (degenerate embedding).
    """
    norm = float(np.linalg.norm(vector))
    if norm < 1e-10:
        raise DomainException(
            message="Embedding vector has near-zero norm — degenerate embedding.",
            error_code="DEGENERATE_EMBEDDING",
            status_code=500,
        )
    return (vector / norm).astype(np.float32)


def _assert_output_valid(embedding: np.ndarray, expected_dim: int) -> None:
    """Post-inference validation gates before returning to caller."""
    if embedding.ndim != 1:
        raise DomainException("Embedding must be 1-D.", "EMBEDDING_SHAPE_ERROR", 500)
    if embedding.shape[0] != expected_dim:
        raise DomainException(
            f"Embedding dimension {embedding.shape[0]} != configured {expected_dim}.",
            "EMBEDDING_DIM_MISMATCH",
            500,
        )
    if embedding.dtype != np.float32:
        raise DomainException("Embedding must be float32.", "EMBEDDING_DTYPE_ERROR", 500)
    if not np.all(np.isfinite(embedding)):
        raise DomainException("Embedding contains non-finite values (NaN/Inf).", "EMBEDDING_NON_FINITE", 500)


class BiometricEmbeddingModel:
    """
    Production-ready embedding inference class (Panel 3 ownership).

    In scaffold_mode=True (tests/dev only):
      - No real model is loaded.
      - generate_embedding() produces a deterministic mock vector from image content.
      - This must NEVER be used to claim biometric accuracy.

    In scaffold_mode=False (production):
      - _load_model() must successfully load a real checkpoint.
      - Missing or incompatible checkpoints raise DomainException at startup — not silently.
    """

    def __init__(self, config: Optional[EmbeddingModelConfig] = None):
        self.config = config or EmbeddingModelConfig()
        self._model = None
        self.is_loaded = False
        self._checkpoint_metadata: dict = {}
        self._load_model()

    # ------------------------------------------------------------------
    # Model loading (once at startup)
    # ------------------------------------------------------------------

    def _load_model(self) -> None:
        """
        Load checkpoint. Validates metadata against current config.

        scaffold_mode=True: No real loading; sets is_loaded=True for tests.
        scaffold_mode=False: Real checkpoint required. Fails explicitly if missing/incompatible.
        """
        if self.config.scaffold_mode:
            logger.warning(
                "BiometricEmbeddingModel running in SCAFFOLD MODE. "
                "Outputs are deterministic mocks. Do NOT use for production biometric evaluation."
            )
            self.is_loaded = True
            return

        weights_path = self.config.model_weights_path
        metadata_path = self.config.checkpoint_metadata_path

        if not os.path.exists(weights_path):
            raise DomainException(
                message=(
                    f"Model checkpoint not found at '{weights_path}'. "
                    "Train a model or provide a valid checkpoint before starting the service."
                ),
                error_code="CHECKPOINT_MISSING",
                status_code=503,
            )

        if not os.path.exists(metadata_path):
            raise DomainException(
                message=f"Checkpoint metadata not found at '{metadata_path}'.",
                error_code="CHECKPOINT_METADATA_MISSING",
                status_code=503,
            )

        try:
            with open(metadata_path, "r") as f:
                self._checkpoint_metadata = json.load(f)
        except Exception as exc:
            raise DomainException(
                message=f"Failed to read checkpoint metadata: {exc}",
                error_code="CHECKPOINT_METADATA_CORRUPT",
                status_code=503,
            ) from exc

        self._validate_checkpoint_metadata()

        try:
            # Torch import deferred — optional until real model is available.
            # When a real model is ready, replace this block:
            #   import torch
            #   self._model = torch.load(weights_path, map_location="cpu")
            #   self._model.eval()
            raise NotImplementedError(
                "Real model loading not yet implemented. "
                "Panel 3 will implement once backbone is empirically selected and checkpoint trained."
            )
        except NotImplementedError:
            raise  # Re-raise explicitly; do NOT fall through to scaffold.
        except Exception as exc:
            raise DomainException(
                message=f"Failed to load model weights from '{weights_path}': {exc}",
                error_code="MODEL_LOAD_FAILURE",
                status_code=503,
            ) from exc

    def _validate_checkpoint_metadata(self) -> None:
        """
        Verify saved checkpoint metadata matches current config.
        Prevents accidental dimension or architecture mismatches at serving time.
        """
        saved_dim = self._checkpoint_metadata.get("embedding_dimension")
        saved_backbone = self._checkpoint_metadata.get("backbone_architecture")

        if saved_dim is not None and saved_dim != self.config.embedding_dimension:
            raise DomainException(
                message=(
                    f"Checkpoint embedding_dimension={saved_dim} "
                    f"does not match config embedding_dimension={self.config.embedding_dimension}."
                ),
                error_code="CHECKPOINT_DIM_MISMATCH",
                status_code=503,
            )

        if saved_backbone is not None and saved_backbone != self.config.backbone_architecture:
            raise DomainException(
                message=(
                    f"Checkpoint backbone='{saved_backbone}' "
                    f"does not match config backbone='{self.config.backbone_architecture}'."
                ),
                error_code="CHECKPOINT_BACKBONE_MISMATCH",
                status_code=503,
            )

    # ------------------------------------------------------------------
    # Preprocessing (public for test injection)
    # ------------------------------------------------------------------

    def preprocess(self, image_bytes: bytes, bounding_box: dict) -> np.ndarray:
        """
        Deterministic crop + resize + normalize.
        Canonical bbox: {"x_min": int, "y_min": int, "x_max": int, "y_max": int}
        """
        return _preprocess_crop(image_bytes, bounding_box, self.config.preprocessing)

    # ------------------------------------------------------------------
    # Inference
    # ------------------------------------------------------------------

    async def generate_embedding(self, image: bytes, bounding_box: dict) -> np.ndarray:
        """
        Implements the EmbeddingModel Protocol.

        Input:  Raw image bytes + canonical bounding box dict.
        Output: L2-normalized float32 numpy array of shape (embedding_dimension,).

        In scaffold_mode: returns a deterministic mock embedding.
        In production:    runs the loaded model.
        """
        if not self.is_loaded:
            raise DomainException("Model not loaded.", "MODEL_NOT_LOADED", 503)

        preprocessed = self.preprocess(image, bounding_box)

        if self.config.scaffold_mode:
            embedding = self._scaffold_embedding(preprocessed)
        else:
            embedding = self._real_inference(preprocessed)

        embedding = _l2_normalize(embedding)
        _assert_output_valid(embedding, self.config.embedding_dimension)
        return embedding

    def _scaffold_embedding(self, preprocessed: np.ndarray) -> np.ndarray:
        """
        SCAFFOLD/TEST ONLY.
        Produces a deterministic mock embedding from image pixel statistics.
        This is NOT biometric inference. Do not use to claim accuracy.
        """
        seed_value = int(np.mean(preprocessed) * 1e6) % (2**31)
        rng = np.random.default_rng(seed=seed_value)
        return rng.standard_normal(self.config.embedding_dimension).astype(np.float32)

    def _real_inference(self, preprocessed: np.ndarray) -> np.ndarray:
        """
        Production inference path.
        This will call self._model once a real backbone is loaded.
        Currently raises explicitly — never silently falls back to scaffold.
        """
        raise DomainException(
            message="Real model inference not yet implemented.",
            error_code="REAL_INFERENCE_NOT_IMPLEMENTED",
            status_code=503,
        )
