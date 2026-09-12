"""
Panel 2 — CV/ML Interface Contracts
=====================================

CANONICAL BOUNDING BOX SCHEMA
------------------------------
All detectors MUST return bounding boxes in this exact format:

    {
        "x_min": float,   # left edge, pixel coordinate in source image
        "y_min": float,   # top edge, pixel coordinate in source image
        "x_max": float,   # right edge, pixel coordinate in source image
        "y_max": float,   # bottom edge, pixel coordinate in source image
        "confidence": float  # detection confidence [0.0, 1.0]
    }

No alternate key names (x/y/w/h, cx/cy, etc.) are permitted in the canonical path.
Any downstream consumer (embedding, quality) MUST read x_min/y_min/x_max/y_max.

CANONICAL QUALITY RESULT SCHEMA
---------------------------------
QualityGate.evaluate() returns a QualityResult dataclass, not a bare float.
This gives downstream consumers a machine-readable structured rejection reason.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Protocol, List, Optional
import numpy as np


# ---------------------------------------------------------------------------
# Shared data types — all panels must use these
# ---------------------------------------------------------------------------

@dataclass(frozen=True)
class BoundingBox:
    """
    Canonical bounding box produced by a NoseDetector.
    Coordinates are pixel values in the original (uncropped) source image.
    """
    x_min: float
    y_min: float
    x_max: float
    y_max: float
    confidence: float

    def to_dict(self) -> dict:
        return {
            "x_min": self.x_min,
            "y_min": self.y_min,
            "x_max": self.x_max,
            "y_max": self.y_max,
            "confidence": self.confidence,
        }

    @classmethod
    def from_dict(cls, d: dict) -> "BoundingBox":
        """
        Construct from a plain dict using the canonical key names.
        Raises KeyError if any required key is absent.
        Raises ValueError for semantically invalid boxes.
        """
        bbox = cls(
            x_min=float(d["x_min"]),
            y_min=float(d["y_min"]),
            x_max=float(d["x_max"]),
            y_max=float(d["y_max"]),
            confidence=float(d["confidence"]),
        )
        if bbox.x_max <= bbox.x_min or bbox.y_max <= bbox.y_min:
            raise ValueError(
                f"Invalid BoundingBox: x_max must be > x_min and y_max must be > y_min. "
                f"Got x_min={bbox.x_min}, x_max={bbox.x_max}, y_min={bbox.y_min}, y_max={bbox.y_max}"
            )
        if not (0.0 <= bbox.confidence <= 1.0):
            raise ValueError(f"BoundingBox confidence must be in [0.0, 1.0], got {bbox.confidence}")
        return bbox


@dataclass(frozen=True)
class QualityResult:
    """
    Structured output of a QualityGate evaluation.
    Replaces bare float returns; gives a machine-readable rejection reason.
    """
    accepted: bool
    score: float                    # 0.0 (worst) to 1.0 (best)
    rejection_reason: Optional[str] = None  # None when accepted=True

    # Machine-readable reason codes — add new ones here as the gate matures
    REASON_BLUR = "BLUR_DETECTED"
    REASON_OCCLUSION = "NOSE_OCCLUDED"
    REASON_LOW_CONTRAST = "LOW_CONTRAST"
    REASON_LOW_CONFIDENCE = "DETECTION_CONFIDENCE_TOO_LOW"
    REASON_MALFORMED = "MALFORMED_IMAGE"

    def __post_init__(self):
        if self.accepted and self.rejection_reason is not None:
            raise ValueError("accepted=True but rejection_reason is set — inconsistent QualityResult")
        if not self.accepted and self.rejection_reason is None:
            raise ValueError("accepted=False but rejection_reason is None — must supply a reason")


# ---------------------------------------------------------------------------
# Protocol definitions
# ---------------------------------------------------------------------------

class NoseDetector(Protocol):
    """
    Detects dog nose(s) in an image.

    Contract
    --------
    - Input: raw image bytes (JPEG / PNG / WEBP).
    - Output: List[dict] where every dict satisfies the canonical BoundingBox schema.
      Use BoundingBox.from_dict() to validate.
    - Raises NoDogDetectedError (HTTP 422) when no nose is found.
    - Raises MultiDogDetectedError (HTTP 422) when > 1 dog is detected.
      NEVER silently select one dog from multiple detections.
    - MUST NOT log raw image bytes.
    - Ownership: Panel 2.
    """
    async def detect(self, image: bytes) -> List[dict]: ...


class QualityGate(Protocol):
    """
    Evaluates the biometric quality of a detected nose crop.

    Contract
    --------
    - Input: raw image bytes + canonical bounding_box dict.
    - Output: QualityResult (structured — NOT a bare float).
    - Raises LowQualityImageError (HTTP 422) when the crop fails the quality bar.
      The caller (BiometricPipelineService) is responsible for raising based on
      QualityResult.accepted, so the gate itself may choose to return OR raise.
    - MUST NOT use an AI/LLM model as the identity gate.
    - Ownership: Panel 2.
    """
    async def evaluate(self, image: bytes, bounding_box: dict) -> QualityResult: ...


class EmbeddingModel(Protocol):
    """
    Generates a biometric embedding vector from a nose crop.

    Contract
    --------
    - Input: raw image bytes + canonical bounding_box dict.
    - Bounding box keys: x_min, y_min, x_max, y_max (NOT x/y/w/h).
    - Output: L2-normalised float32 numpy array, shape (D,) where D = configured dimension.
    - Raises DomainException on preprocessing or inference failure.
    - Ownership: Panel 3 (embedding model internals); interface owned by Panel 2.
    """
    @property
    def is_scaffold_mode(self) -> bool:
        """Returns True if the model is running in a demonstrator/scaffold mode rather than real biometric inference."""
        ...

    async def generate_embedding(self, image: bytes, bounding_box: dict) -> np.ndarray: ...

