"""
BiometricPipelineService — Panel 6 ownership.

Orchestrates:
  detector → quality gate → embedding → vector search → decision

Contracts:
  - All bbox keys: x_min, y_min, x_max, y_max (canonical, from ml_interfaces.py).
  - QualityGate.evaluate() returns QualityResult (not a bare float).
  - UNKNOWN = successful pipeline, no candidate met threshold.
  - Infrastructure failures (VectorStoreError, DomainException with 503) NEVER become UNKNOWN.
"""
from typing import List
from app.services.ml_interfaces import NoseDetector, QualityGate, EmbeddingModel, QualityResult
from app.vector_store.interfaces import VectorStore
from app.core.config import settings
from app.core.exceptions import LowQualityImageError, InfrastructureError, VectorStoreError
from app.schemas.search import SearchResponse, SearchResultMatch
import numpy as np


class BiometricPipelineService:
    def __init__(
        self,
        detector: NoseDetector,
        quality_gate: QualityGate,
        embedder: EmbeddingModel,
        vector_store: VectorStore,
    ):
        self.detector = detector
        self.quality_gate = quality_gate
        self.embedder = embedder
        self.vector_store = vector_store

    async def _process_image(self, file_bytes: bytes) -> np.ndarray:
        """
        Detection → quality gate → embedding.

        Raises:
          NoDogDetectedError       (422) - from detector
          MultiDogDetectedError    (422) - from detector
          LowQualityImageError     (422) - from quality gate
          DomainException (5xx)    (503) - infrastructure/model failure
        """
        # 1. Detect — raises NoDogDetectedError or MultiDogDetectedError on failure.
        bboxes = await self.detector.detect(file_bytes)

        # 2. Quality gate — now returns QualityResult (structured), not bare float.
        quality_result: QualityResult = await self.quality_gate.evaluate(file_bytes, bboxes[0])
        if not quality_result.accepted:
            raise LowQualityImageError(
                message=f"Image quality insufficient for biometric processing. "
                        f"Reason: {quality_result.rejection_reason}. "
                        f"Score: {quality_result.score:.3f}"
            )

        # 3. Embed — raises DomainException on preprocessing or model failure.
        embedding = await self.embedder.generate_embedding(file_bytes, bboxes[0])
        return embedding

    async def identify(self, file_bytes: bytes) -> SearchResponse:
        """
        Open-set identification.
        Returns MATCH, AMBIGUOUS, or UNKNOWN.
        Infrastructure failure raises 503 — never silently becomes UNKNOWN.
        """
        embedding = await self._process_image(file_bytes)

        # VectorStoreError propagates as 503 — never swallowed as UNKNOWN.
        results = await self.vector_store.search(embedding, top_k=5)

        if not results:
            return SearchResponse(status="UNKNOWN", matches=[], message="No candidates in gallery.")

        top_match_id, top_score = results[0]
        matches = [SearchResultMatch(pet_id=pid, confidence=score) for pid, score in results]

        if top_score >= settings.MATCH_THRESHOLD:
            return SearchResponse(status="MATCH", matches=matches, message="High confidence match found.")
        elif top_score >= settings.AMBIGUOUS_THRESHOLD:
            return SearchResponse(status="AMBIGUOUS", matches=matches, message="Possible matches found. Manual review required.")
        else:
            return SearchResponse(status="UNKNOWN", matches=[], message="No candidate met the acceptance threshold.")

    async def verify(self, pet_id: str, file_bytes: bytes) -> SearchResponse:
        """
        1:1 verification — check if uploaded image matches a specific claimed pet_id.
        Infrastructure failure propagates as 503.
        """
        embedding = await self._process_image(file_bytes)

        # VectorStoreError propagates as 503 — never swallowed as UNKNOWN.
        results = await self.vector_store.search(embedding, top_k=5)

        for pid, score in results:
            if pid == pet_id:
                if score >= settings.MATCH_THRESHOLD:
                    return SearchResponse(
                        status="MATCH",
                        matches=[SearchResultMatch(pet_id=pid, confidence=score)],
                        message="Identity verified."
                    )
                elif score >= settings.AMBIGUOUS_THRESHOLD:
                    return SearchResponse(
                        status="AMBIGUOUS",
                        matches=[SearchResultMatch(pet_id=pid, confidence=score)],
                        message="Verification inconclusive. Manual review required."
                    )

        # Pet not found in top-k, or score below threshold — genuine no-match
        return SearchResponse(status="UNKNOWN", matches=[], message="Identity not verified.")
