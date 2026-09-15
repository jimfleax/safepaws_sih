from typing import Protocol, List, Tuple
import numpy as np

class VectorStore(Protocol):
    async def add_vector(self, pet_id: str, vector: np.ndarray) -> bool:
        """
        Input: Pet ID and the generated biometric embedding.
        Output: True on success.
        Failure: Raises VectorStoreError.
        Ownership: Infrastructure / Backend (Panel 1/6)
        """
        pass

    async def search(self, vector: np.ndarray, top_k: int = 5) -> List[Tuple[str, float]]:
        """
        Input: Query vector and number of results.
        Output: List of tuples containing (pet_id, distance/confidence).
        Failure: Raises VectorStoreError.
        Ownership: Infrastructure / Backend (Panel 1/6)
        """
        pass

    async def remove_vector(self, pet_id: str) -> bool:
        """
        Input: Pet ID to remove.
        Output: True on success.
        Failure: Raises VectorStoreError.
        """
        pass

    async def rebuild(self, vectors: List[Tuple[str, np.ndarray]]) -> bool:
        """
        Input: List of (pet_id, vector) to rebuild the entire index.
        Output: True on success.
        Failure: Raises VectorStoreError.
        """
        pass
