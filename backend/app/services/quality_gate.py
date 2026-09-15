"""
Panel 2 — Quality Gate
=======================

P0 implementation: deterministic / classical baseline.

Performs two checks:
  1. Detection confidence threshold — if the upstream detector produced a
     confidence below MIN_DETECTION_CONFIDENCE the crop is not worth embedding.
  2. Blur (Laplacian variance) — measures image sharpness via the variance of
     the Laplacian operator applied to the grayscale nose crop.
     Low variance → blurry → reject.

This does NOT use any AI or LLM model as a quality or identity gate.
"""

from __future__ import annotations

import io
import logging
from typing import Optional

import numpy as np
from PIL import Image

from app.core.exceptions import LowQualityImageError
from app.services.ml_interfaces import QualityResult

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Tunable constants (not yet calibrated against a real dataset)
# ---------------------------------------------------------------------------
MIN_DETECTION_CONFIDENCE: float = 0.50   # Below this → LOW_CONFIDENCE rejection
MIN_BLUR_VARIANCE: float = 50.0          # Laplacian variance below this → BLUR rejection


class ClassicalQualityGate:
    """
    Deterministic, classical quality gate.

    No AI model is used. Quality is estimated from:
      - Detection confidence supplied in the bounding_box dict.
      - Laplacian variance of the cropped nose region (sharpness proxy).

    Ownership: Panel 2.
    """

    def __init__(
        self,
        min_confidence: float = MIN_DETECTION_CONFIDENCE,
        min_blur_variance: float = MIN_BLUR_VARIANCE,
    ) -> None:
        self.min_confidence = min_confidence
        self.min_blur_variance = min_blur_variance

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    @staticmethod
    def _crop_region(image: bytes, bounding_box: dict) -> Image.Image:
        """
        Crop the nose region from raw image bytes using the canonical bbox.

        Raises LowQualityImageError if the image bytes cannot be decoded or
        the crop region is degenerate.
        """
        try:
            img = Image.open(io.BytesIO(image)).convert("L")  # grayscale
        except Exception as exc:
            logger.warning("QualityGate: failed to decode image — %s", type(exc).__name__)
            raise LowQualityImageError(
                f"Image could not be decoded for quality assessment: {type(exc).__name__}"
            )

        w, h = img.size
        # Canonical bbox keys
        x_min = bounding_box.get("x_min", 0)
        y_min = bounding_box.get("y_min", 0)
        x_max = bounding_box.get("x_max", w)
        y_max = bounding_box.get("y_max", h)

        # Clamp to image bounds
        x_min_px = max(0, int(x_min))
        y_min_px = max(0, int(y_min))
        x_max_px = min(w, int(x_max))
        y_max_px = min(h, int(y_max))

        if x_max_px <= x_min_px or y_max_px <= y_min_px:
            raise LowQualityImageError(
                "Bounding box produces a zero-area crop — image rejected.",
            )

        crop = img.crop((x_min_px, y_min_px, x_max_px, y_max_px))
        return crop

    @staticmethod
    def _laplacian_variance(crop: Image.Image) -> float:
        """
        Compute Laplacian variance as a blur proxy.
        Higher value → sharper.  Uses a manual 3×3 Laplacian convolution.
        """
        arr = np.array(crop, dtype=np.float32)

        # 3×3 Laplacian kernel
        kernel = np.array([
            [0,  1, 0],
            [1, -4, 1],
            [0,  1, 0],
        ], dtype=np.float32)

        h, w = arr.shape
        if h < 3 or w < 3:
            # Too small to apply kernel — treat as degenerate
            return 0.0

        # Manual valid-only convolution (no scipy dependency)
        out = np.zeros((h - 2, w - 2), dtype=np.float32)
        for i in range(3):
            for j in range(3):
                out += kernel[i, j] * arr[i : h - 2 + i, j : w - 2 + j]

        return float(np.var(out))

    # ------------------------------------------------------------------
    # Public interface (implements QualityGate Protocol)
    # ------------------------------------------------------------------

    async def evaluate(self, image: bytes, bounding_box: dict) -> QualityResult:
        """
        Evaluate biometric quality of a nose crop.

        Returns QualityResult.
        Raises LowQualityImageError if the crop is irrecoverably broken
        (decode failure, degenerate bbox).

        The caller (BiometricPipelineService) is responsible for raising
        LowQualityImageError when QualityResult.accepted is False.
        """
        # --- Guard 1: detection confidence ---
        confidence = bounding_box.get("confidence", 1.0)
        if confidence < self.min_confidence:
            logger.info(
                "QualityGate: detection confidence %.3f below threshold %.3f — rejected",
                confidence,
                self.min_confidence,
            )
            return QualityResult(
                accepted=False,
                score=float(confidence),
                rejection_reason=QualityResult.REASON_LOW_CONFIDENCE,
            )

        # --- Guard 2: blur / sharpness ---
        crop = self._crop_region(image, bounding_box)
        blur_var = self._laplacian_variance(crop)
        # Normalise to [0,1] loosely: var=0 → score 0, var≥500 → ~1
        normalised_score = min(1.0, blur_var / 500.0)

        if blur_var < self.min_blur_variance:
            logger.info(
                "QualityGate: Laplacian variance %.2f below threshold %.2f — rejected (%s)",
                blur_var,
                self.min_blur_variance,
                QualityResult.REASON_BLUR,
            )
            return QualityResult(
                accepted=False,
                score=normalised_score,
                rejection_reason=QualityResult.REASON_BLUR,
            )

        logger.info(
            "QualityGate: accepted — confidence=%.3f blur_var=%.2f score=%.3f",
            confidence,
            blur_var,
            normalised_score,
        )
        return QualityResult(accepted=True, score=normalised_score)
