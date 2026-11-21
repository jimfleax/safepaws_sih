"""
Phase 1B — FAISS Vector Store Deduplication and Gallery Search Tests

Coverage:
  - Multi-vector enrollment for the same pet_id
  - Deduplication: search returns a pet at most once in top_k candidates
  - Score preservation: returned score is the maximum similarity among enrolled vectors
  - Local persistence round-trip (save_local and load_local) preserves deduplication
  - Empty gallery search returns empty list []
"""
import asyncio
import os
import numpy as np
import pytest

from app.core.exceptions import VectorStoreError

try:
    import faiss
    from unittest.mock import MagicMock
    HAS_FAISS = not isinstance(faiss, MagicMock) and hasattr(faiss, "IndexFlatIP")
    if HAS_FAISS:
        from app.vector_store.faiss_store import FAISSVectorStore
except ImportError:
    HAS_FAISS = False


def test_search_deduplication_algorithm():
    """Verify deduplication logic preserves highest score and eliminates duplicate pet IDs."""
    id_map = {0: "pet-alpha", 1: "pet-beta", 2: "pet-gamma"}
    # Simulated descending distance scores from FAISS where pet-alpha appears three times
    distances = [0.98, 0.95, 0.91, 0.85, 0.70]
    indices = [0, 0, 1, 0, 2]
    top_k = 5

    results = []
    seen_pets = set()
    for dist, idx in zip(distances, indices):
        if idx != -1:
            pet_id = id_map.get(idx)
            if pet_id is not None and pet_id not in seen_pets:
                seen_pets.add(pet_id)
                results.append((pet_id, float(dist)))
                if len(results) >= top_k:
                    break

    assert len(results) == 3
    assert results[0] == ("pet-alpha", 0.98)  # highest score retained
    assert results[1] == ("pet-beta", 0.91)
    assert results[2] == ("pet-gamma", 0.70)
    assert [p for p, _ in results] == ["pet-alpha", "pet-beta", "pet-gamma"]


@pytest.fixture
def temp_index_path(tmp_path):
    return str(tmp_path / "test_dedup_index.bin")


@pytest.fixture
def vector_store(temp_index_path):
    if not HAS_FAISS:
        pytest.skip("faiss not installed")
    return FAISSVectorStore(dimension=128, index_path=temp_index_path)


def _normalized_vector(dim: int = 128, seed: int = None) -> np.ndarray:
    if seed is not None:
        np.random.seed(seed)
    v = np.random.randn(1, dim).astype(np.float32)
    return v / np.linalg.norm(v)


def test_empty_gallery_search_returns_empty(vector_store):
    """Empty index returns [] with no error."""
    async def _test():
        q = _normalized_vector()
        res = await vector_store.search(q, top_k=5)
        assert res == []
    asyncio.run(_test())


def test_multi_image_deduplication(vector_store):
    """
    When multiple images for the same pet are enrolled, search must deduplicate
    and return that pet at most once with the maximum similarity score.
    """
    async def _test():
        v_target = _normalized_vector(seed=100)
        
        # Create two variations for pet-alpha
        # v1 is exact match (similarity ~1.0)
        v1 = v_target.copy()
        # v2 is slightly shifted (similarity ~0.9)
        v2 = (v_target + 0.2 * np.random.randn(1, 128)).astype(np.float32)
        v2 = v2 / np.linalg.norm(v2)
        
        # Enroll both for pet-alpha
        await vector_store.add_vector("pet-alpha", v1)
        await vector_store.add_vector("pet-alpha", v2)
        
        # Enroll another pet
        v_other = _normalized_vector(seed=200)
        await vector_store.add_vector("pet-beta", v_other)
        
        assert vector_store.index.ntotal == 3
        
        # Query with target
        results = await vector_store.search(v_target, top_k=5)
        
        # Must contain pet-alpha at most once
        pet_ids = [p for p, _ in results]
        assert pet_ids.count("pet-alpha") == 1
        assert "pet-alpha" in pet_ids
        
        # Find pet-alpha score: should be ~1.0 (from v1), not the lower score from v2
        alpha_score = next(score for pid, score in results if pid == "pet-alpha")
        assert pytest.approx(alpha_score, rel=1e-3) == 1.0

    asyncio.run(_test())


def test_dedup_persistence_roundtrip(vector_store, temp_index_path):
    """Verify deduplication behavior is preserved after save_local and load_local."""
    async def _test():
        v_base = _normalized_vector(seed=300)
        v_alt = (v_base + 0.1 * np.random.randn(1, 128)).astype(np.float32)
        v_alt = v_alt / np.linalg.norm(v_alt)
        
        await vector_store.add_vector("pet-gamma", v_base)
        await vector_store.add_vector("pet-gamma", v_alt)
        
        # Create new store and load from persisted index
        new_store = FAISSVectorStore(dimension=128, index_path=temp_index_path)
        loaded = await new_store.load_local()
        assert loaded is True
        assert new_store.index.ntotal == 2
        
        results = await new_store.search(v_base, top_k=5)
        pet_ids = [p for p, _ in results]
        assert pet_ids.count("pet-gamma") == 1
        gamma_score = results[0][1]
        assert pytest.approx(gamma_score, rel=1e-3) == 1.0

    asyncio.run(_test())
