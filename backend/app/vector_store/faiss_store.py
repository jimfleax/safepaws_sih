import os
import asyncio
import numpy as np
import faiss
import logging
from typing import List, Tuple

from app.vector_store.interfaces import VectorStore
from app.core.exceptions import VectorStoreError
from app.core.config import settings

logger = logging.getLogger(__name__)

class FAISSVectorStore(VectorStore):
    def __init__(self, dimension: int = settings.EMBEDDING_DIMENSION, index_path: str = settings.FAISS_INDEX_PATH):
        self.dimension = dimension
        self.index_path = index_path
        self._init_index()

    def _init_index(self):
        # We use IndexFlatIP + L2 normalization to simulate Cosine Similarity
        try:
            self.index = faiss.IndexIDMap(faiss.IndexFlatIP(self.dimension))
        except Exception as e:
            raise VectorStoreError(f"Failed to initialize FAISS index: {str(e)}")

    def _validate_and_normalize(self, vector: np.ndarray) -> np.ndarray:
        if not isinstance(vector, np.ndarray):
            vector = np.array(vector, dtype=np.float32)
        
        if vector.ndim == 1:
            vector = vector.reshape(1, -1)
            
        if vector.shape[1] != self.dimension:
            raise VectorStoreError(f"Dimension mismatch. Expected {self.dimension}, got {vector.shape[1]}")
        
        if vector.dtype != np.float32:
            vector = vector.astype(np.float32)

        # L2 normalization for Inner Product to equal Cosine Similarity
        faiss.normalize_L2(vector)
        return vector

    async def add_vector(self, pet_id: str, vector: np.ndarray) -> bool:
        try:
            # We assume pet_id is a valid integer string or hashable to a 64-bit int for IndexIDMap.
            # In a real system with string UUIDs, you'd maintain a mapping DB table (uuid <-> int64 id).
            # For this simplified abstraction, we hash it.
            int_id = hash(pet_id) % ((1 << 63) - 1) 
            
            normalized_vec = self._validate_and_normalize(vector)
            
            # FAISS is synchronous and CPU bound
            def _add():
                self.index.add_with_ids(normalized_vec, np.array([int_id], dtype=np.int64))
            
            await asyncio.to_thread(_add)
            return True
        except Exception as e:
            raise VectorStoreError(f"Failed to add vector: {str(e)}")

    async def search(self, vector: np.ndarray, top_k: int = 5) -> List[Tuple[str, float]]:
        if self.index.ntotal == 0:
            return [] # Empty gallery
            
        try:
            normalized_vec = self._validate_and_normalize(vector)
            
            def _search():
                distances, indices = self.index.search(normalized_vec, top_k)
                return distances[0], indices[0]
                
            distances, indices = await asyncio.to_thread(_search)
            
            results = []
            for dist, idx in zip(distances, indices):
                if idx != -1:
                    # Note: We return the stringified hash. In reality, you'd map back to UUID.
                    results.append((str(idx), float(dist)))
            return results
        except Exception as e:
            raise VectorStoreError(f"Search failed: {str(e)}")

    async def remove_vector(self, pet_id: str) -> bool:
        try:
            int_id = hash(pet_id) % ((1 << 63) - 1)
            def _remove():
                self.index.remove_ids(np.array([int_id], dtype=np.int64))
            await asyncio.to_thread(_remove)
            return True
        except Exception as e:
            raise VectorStoreError(f"Failed to remove vector: {str(e)}")

    async def rebuild(self, vectors: List[Tuple[str, np.ndarray]]) -> bool:
        try:
            self._init_index()
            if not vectors:
                return True
                
            # Batch process
            ids = np.array([hash(p[0]) % ((1 << 63) - 1) for p in vectors], dtype=np.int64)
            vecs = np.vstack([p[1] for p in vectors]).astype(np.float32)
            
            if vecs.shape[1] != self.dimension:
                raise VectorStoreError(f"Dimension mismatch during rebuild. Expected {self.dimension}")
                
            faiss.normalize_L2(vecs)
            
            def _rebuild():
                self.index.add_with_ids(vecs, ids)
            await asyncio.to_thread(_rebuild)
            return True
        except Exception as e:
            raise VectorStoreError(f"Rebuild failed: {str(e)}")
            
    async def save_local(self) -> bool:
        try:
            tmp_path = f"{self.index_path}.tmp"
            def _save():
                faiss.write_index(self.index, tmp_path)
                os.replace(tmp_path, self.index_path)
            await asyncio.to_thread(_save)
            return True
        except Exception as e:
            raise VectorStoreError(f"Failed to persist index: {str(e)}")
            
    async def load_local(self) -> bool:
        if not os.path.exists(self.index_path):
            raise VectorStoreError(f"Index file not found: {self.index_path}")
            
        try:
            def _load():
                self.index = faiss.read_index(self.index_path)
            await asyncio.to_thread(_load)
            
            if self.index.d != self.dimension:
                raise VectorStoreError("Loaded index dimension does not match configuration.")
            return True
        except Exception as e:
            raise VectorStoreError(f"Failed to load index: {str(e)}")
