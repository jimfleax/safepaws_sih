from typing import Protocol, List
from fastapi import UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
from app.services.ml_interfaces import NoseDetector, QualityGate, EmbeddingModel
from app.vector_store.interfaces import VectorStore
from app.storage.interfaces import ImageStorage
from app.core.config import settings
from app.schemas.search import SearchResponse, SearchResultMatch

class BiometricPipelineService:
    def __init__(
        self,
        detector: NoseDetector,
        quality_gate: QualityGate,
        embedder: EmbeddingModel,
        vector_store: VectorStore
    ):
        self.detector = detector
        self.quality_gate = quality_gate
        self.embedder = embedder
        self.vector_store = vector_store

    async def _process_image(self, file_bytes: bytes) -> tuple[bytes, dict, float, any]:
        """Runs the detection and quality pipeline, returning the embedding."""
        # 1. Detect
        bboxes = await self.detector.detect(file_bytes)
        
        # 2. Quality
        score = await self.quality_gate.evaluate(file_bytes, bboxes[0])
        
        # 3. Embed
        embedding = await self.embedder.generate_embedding(file_bytes, bboxes[0])
        return embedding

    async def identify(self, file_bytes: bytes) -> SearchResponse:
        embedding = await self._process_image(file_bytes)
        
        results = await self.vector_store.search(embedding, top_k=5)
        
        if not results:
            return SearchResponse(status="UNKNOWN", matches=[], message="No similar pets found.")
        
        top_match_id, top_score = results[0]
        
        matches = [SearchResultMatch(pet_id=pid, confidence=score) for pid, score in results]

        if top_score >= settings.MATCH_THRESHOLD:
            return SearchResponse(status="MATCH", matches=matches, message="High confidence match found.")
        elif top_score >= settings.AMBIGUOUS_THRESHOLD:
            return SearchResponse(status="AMBIGUOUS", matches=matches, message="Possible matches found, manual review required.")
        else:
            return SearchResponse(status="UNKNOWN", matches=matches, message="Matches are below confidence threshold.")

    async def verify(self, pet_id: str, file_bytes: bytes) -> SearchResponse:
        embedding = await self._process_image(file_bytes)
        
        # In a real verification scenario, we might retrieve the specific pet's embedding and compare directly.
        # Since VectorStore provides top_k search, we can search and check if the top match is the requested pet_id.
        results = await self.vector_store.search(embedding, top_k=5)
        
        # Look for the specific pet in the results
        for pid, score in results:
            if pid == pet_id:
                if score >= settings.MATCH_THRESHOLD:
                    return SearchResponse(status="MATCH", matches=[SearchResultMatch(pet_id=pid, confidence=score)], message="Identity verified.")
                elif score >= settings.AMBIGUOUS_THRESHOLD:
                    return SearchResponse(status="AMBIGUOUS", matches=[SearchResultMatch(pet_id=pid, confidence=score)], message="Verification ambiguous.")
        
        return SearchResponse(status="UNKNOWN", matches=[], message="Identity not verified.")
