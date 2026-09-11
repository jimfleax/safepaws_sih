from typing import Protocol, List, Any
import numpy as np

class NoseDetector(Protocol):
    async def detect(self, image: bytes) -> List[dict]:
        """
        Input: Raw image bytes
        Output: List of bounding boxes for detected dog noses.
        Failure: Raises NoDogDetectedError if no nose is found.
        Ownership: ML Pipeline (Panel 2/4)
        """
        pass

class QualityGate(Protocol):
    async def evaluate(self, image: bytes, bounding_box: dict) -> float:
        """
        Input: Raw image bytes and cropped nose bounding box.
        Output: Quality score (0.0 to 1.0).
        Failure: Raises LowQualityImageError if score < threshold.
        Ownership: ML Pipeline (Panel 2/4)
        """
        pass

class EmbeddingModel(Protocol):
    async def generate_embedding(self, image: bytes, bounding_box: dict) -> np.ndarray:
        """
        Input: Raw image bytes and verified bounding box.
        Output: Biometric embedding vector (e.g. 128D numpy array).
        Failure: Raises DomainException on extraction failure.
        Ownership: ML Pipeline (Panel 2/4)
        """
        pass
