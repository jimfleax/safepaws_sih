import os
import json
import asyncio
import numpy as np
import faiss
import logging
from typing import List, Tuple, Dict, Any

from app.vector_store.interfaces import VectorStore
from app.core.exceptions import VectorStoreError
from app.core.config import settings

logger = logging.getLogger(__name__)

class FAISSVectorStore(VectorStore):
    def __init__(self, dimension: int = settings.EMBEDDING_DIMENSION, index_path: str = settings.FAISS_INDEX_PATH):
        self.dimension = dimension
        self.index_path = index_path
        self.meta_path = f"{index_path}.meta.json"
        
        self._id_map: Dict[int, str] = {}
        self._uuid_to_id: Dict[str, int] = {}
        self._next_id: int = 0
        
        self._init_index()

    def _init_index(self):
        # We use IndexFlatIP + L2 normalization to simulate Cosine Similarity
        try:
            self.index = faiss.IndexIDMap(faiss.IndexFlatIP(self.dimension))
            self._id_map = {}
            self._uuid_to_id = {}
            self._next_id = 0
        except Exception as e:
            raise VectorStoreError(f"Failed to initialize FAISS index: {str(e)}")

    def _validate_vector(self, vector: Any) -> np.ndarray:
        if not isinstance(vector, np.ndarray):
            raise VectorStoreError("Vector must be a numpy ndarray")
            
        if vector.dtype != np.float32:
            raise VectorStoreError("Vector dtype must be float32")
            
        if not np.isfinite(vector).all():
            raise VectorStoreError("Vector contains NaN or Inf values")
            
        if vector.ndim == 1:
            vector = vector.reshape(1, -1)
        elif vector.ndim != 2 or vector.shape[0] != 1:
            raise VectorStoreError("Vector must be 1D or shape (1, D)")
            
        if vector.shape[1] != self.dimension:
            raise VectorStoreError(f"Dimension mismatch. Expected {self.dimension}, got {vector.shape[1]}")
            
        norm = np.linalg.norm(vector)
        if not np.isclose(norm, 1.0, rtol=1e-4, atol=1e-4):
            raise VectorStoreError("Vector is not L2 normalized")

        return vector

    def _get_or_create_internal_id(self, pet_id: str) -> int:
        if pet_id in self._uuid_to_id:
            return self._uuid_to_id[pet_id]
        internal_id = self._next_id
        self._next_id += 1
        self._id_map[internal_id] = pet_id
        self._uuid_to_id[pet_id] = internal_id
        return internal_id

    async def add_vector(self, pet_id: str, vector: np.ndarray) -> bool:
        try:
            validated_vec = self._validate_vector(vector)
            internal_id = self._get_or_create_internal_id(pet_id)
            
            # FAISS is synchronous and CPU bound
            def _add():
                self.index.add_with_ids(validated_vec, np.array([internal_id], dtype=np.int64))
            
            await asyncio.to_thread(_add)
            await self.save_local()
            return True
        except Exception as e:
            if isinstance(e, VectorStoreError):
                raise
            raise VectorStoreError(f"Failed to add vector: {str(e)}")

    async def search(self, vector: np.ndarray, top_k: int = 5) -> List[Tuple[str, float]]:
        if self.index.ntotal == 0:
            return [] # Empty gallery
            
        try:
            validated_vec = self._validate_vector(vector)
            
            def _search():
                distances, indices = self.index.search(validated_vec, top_k)
                return distances[0], indices[0]
                
            distances, indices = await asyncio.to_thread(_search)
            
            results = []
            for dist, idx in zip(distances, indices):
                if idx != -1:
                    pet_id = self._id_map.get(idx)
                    if pet_id is not None:
                        results.append((pet_id, float(dist)))
            return results
        except Exception as e:
            if isinstance(e, VectorStoreError):
                raise
            raise VectorStoreError(f"Search failed: {str(e)}")

    async def remove_vector(self, pet_id: str) -> bool:
        try:
            if pet_id not in self._uuid_to_id:
                return False
                
            internal_id = self._uuid_to_id[pet_id]
            
            def _remove():
                self.index.remove_ids(np.array([internal_id], dtype=np.int64))
            await asyncio.to_thread(_remove)
            
            # Clean up maps
            del self._uuid_to_id[pet_id]
            del self._id_map[internal_id]
            
            await self.save_local()
            return True
        except Exception as e:
            raise VectorStoreError(f"Failed to remove vector: {str(e)}")

    async def rebuild(self, vectors: List[Tuple[str, np.ndarray]]) -> bool:
        try:
            self._init_index()
            if not vectors:
                await self.save_local()
                return True
                
            internal_ids = []
            valid_vecs = []
            
            for pet_id, vec in vectors:
                v = self._validate_vector(vec)
                valid_vecs.append(v)
                internal_ids.append(self._get_or_create_internal_id(pet_id))
                
            ids_arr = np.array(internal_ids, dtype=np.int64)
            vecs_arr = np.vstack(valid_vecs)
            
            def _rebuild():
                self.index.add_with_ids(vecs_arr, ids_arr)
            await asyncio.to_thread(_rebuild)
            await self.save_local()
            return True
        except Exception as e:
            if isinstance(e, VectorStoreError):
                raise
            raise VectorStoreError(f"Rebuild failed: {str(e)}")
            
    async def save_local(self) -> bool:
        try:
            tmp_index = f"{self.index_path}.tmp"
            tmp_meta = f"{self.meta_path}.tmp"
            
            # 1. Write metadata
            meta_data = {
                "next_id": self._next_id,
                "id_map": {str(k): v for k, v in self._id_map.items()}
            }
            def _save():
                with open(tmp_meta, 'w') as f:
                    json.dump(meta_data, f)
                # 2. Write FAISS index
                faiss.write_index(self.index, tmp_index)
                
                # 3. Atomic rename
                os.replace(tmp_meta, self.meta_path)
                os.replace(tmp_index, self.index_path)
                
            await asyncio.to_thread(_save)
            return True
        except Exception as e:
            raise VectorStoreError(f"Failed to persist index: {str(e)}")
            
    async def load_local(self) -> bool:
        if not os.path.exists(self.index_path) or not os.path.exists(self.meta_path):
            raise VectorStoreError(f"Index or meta file not found at {self.index_path}")
            
        try:
            def _load():
                with open(self.meta_path, 'r') as f:
                    meta_data = json.load(f)
                
                self.index = faiss.read_index(self.index_path)
                return meta_data
                
            meta_data = await asyncio.to_thread(_load)
            
            if self.index.d != self.dimension:
                raise VectorStoreError("Loaded index dimension does not match configuration.")
                
            self._next_id = meta_data.get("next_id", 0)
            self._id_map = {int(k): v for k, v in meta_data.get("id_map", {}).items()}
            self._uuid_to_id = {v: k for k, v in self._id_map.items()}
            
            return True
        except Exception as e:
            if isinstance(e, VectorStoreError):
                raise
            raise VectorStoreError(f"Failed to load index: {str(e)}")
