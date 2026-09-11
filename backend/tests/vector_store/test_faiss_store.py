import os
import json
import pytest
import numpy as np
from app.vector_store.faiss_store import FAISSVectorStore
from app.core.exceptions import VectorStoreError

# M0 Tests for VectorStore implementation

@pytest.fixture
def temp_index_path(tmp_path):
    return str(tmp_path / "test_index.bin")

@pytest.fixture
def vector_store(temp_index_path):
    return FAISSVectorStore(dimension=128, index_path=temp_index_path)

def create_normalized_vector(dim=128, seed=None):
    if seed is not None:
        np.random.seed(seed)
    v = np.random.randn(1, dim).astype(np.float32)
    norm = np.linalg.norm(v)
    return v / norm

@pytest.mark.asyncio
async def test_initialization(vector_store):
    assert vector_store.dimension == 128
    assert vector_store.index is not None
    assert vector_store.index.ntotal == 0
    assert vector_store._next_id == 0

@pytest.mark.asyncio
async def test_add_and_search_vector(vector_store):
    v1 = create_normalized_vector()
    uuid = "pet-uuid-1234-5678"
    
    await vector_store.add_vector(uuid, v1)
    assert vector_store.index.ntotal == 1
    
    results = await vector_store.search(v1, top_k=1)
    assert len(results) == 1
    
    pet_id, score = results[0]
    assert pytest.approx(score, 0.001) == 1.0
    assert pet_id == uuid  # ID Round-trip success

@pytest.mark.asyncio
async def test_multiple_pets_and_similarity_ordering(vector_store):
    v_base = create_normalized_vector(seed=42)
    v_far = -v_base  # completely opposite
    
    # Create something close to v_base
    v_close = (v_base + 0.1 * np.random.randn(1, 128)).astype(np.float32)
    v_close = v_close / np.linalg.norm(v_close)
    
    await vector_store.add_vector("pet-far", v_far)
    await vector_store.add_vector("pet-base", v_base)
    await vector_store.add_vector("pet-close", v_close)
    
    results = await vector_store.search(v_base, top_k=3)
    assert len(results) == 3
    
    # 1st should be pet-base (score ~ 1.0)
    assert results[0][0] == "pet-base"
    # 2nd should be pet-close
    assert results[1][0] == "pet-close"
    # 3rd should be pet-far (score ~ -1.0)
    assert results[2][0] == "pet-far"

@pytest.mark.asyncio
async def test_validation_wrong_dimension(vector_store):
    bad_vector = create_normalized_vector(dim=64)
    with pytest.raises(VectorStoreError, match="Dimension mismatch"):
        await vector_store.add_vector("pet", bad_vector)

@pytest.mark.asyncio
async def test_validation_not_float32(vector_store):
    v = create_normalized_vector().astype(np.float64)
    with pytest.raises(VectorStoreError, match="Vector dtype must be float32"):
        await vector_store.add_vector("pet", v)

@pytest.mark.asyncio
async def test_validation_nan_inf(vector_store):
    v = create_normalized_vector()
    v[0, 0] = np.nan
    with pytest.raises(VectorStoreError, match="Vector contains NaN or Inf"):
        await vector_store.add_vector("pet", v)

@pytest.mark.asyncio
async def test_validation_not_normalized(vector_store):
    v = create_normalized_vector() * 2.0  # Norm is 2.0 now
    with pytest.raises(VectorStoreError, match="Vector is not L2 normalized"):
        await vector_store.add_vector("pet", v)

@pytest.mark.asyncio
async def test_remove_vector(vector_store):
    v1 = create_normalized_vector()
    await vector_store.add_vector("pet1", v1)
    assert vector_store.index.ntotal == 1
    
    success = await vector_store.remove_vector("pet1")
    assert success is True
    assert vector_store.index.ntotal == 0
    
    # Removing non-existent
    success = await vector_store.remove_vector("pet1")
    assert success is False

@pytest.mark.asyncio
async def test_persistence_process_restart_simulation(vector_store, temp_index_path):
    uuid = "persistent-pet-uuid-9999"
    v1 = create_normalized_vector()
    
    # 1. Add
    await vector_store.add_vector(uuid, v1)
    
    # 2. Save
    await vector_store.save_local()
    assert os.path.exists(temp_index_path)
    assert os.path.exists(f"{temp_index_path}.meta.json")
    
    # 3. Process restart simulation (new instance)
    new_store = FAISSVectorStore(dimension=128, index_path=temp_index_path)
    
    # 4. Load
    await new_store.load_local()
    assert new_store.index.ntotal == 1
    
    # 5. Search
    results = await new_store.search(v1, top_k=1)
    
    # 6. SAME pet UUID
    assert len(results) == 1
    assert results[0][0] == uuid

@pytest.mark.asyncio
async def test_rebuild(vector_store):
    vectors = [
        ("pet1", create_normalized_vector(seed=1)),
        ("pet2", create_normalized_vector(seed=2))
    ]
    
    await vector_store.rebuild(vectors)
    assert vector_store.index.ntotal == 2
    
    # Verify ID map rebuilt correctly
    res = await vector_store.search(vectors[0][1], top_k=1)
    assert res[0][0] == "pet1"

@pytest.mark.asyncio
async def test_empty_index_semantics(vector_store):
    v = create_normalized_vector()
    # Search on empty should just return []
    results = await vector_store.search(v)
    assert results == []

@pytest.mark.asyncio
async def test_load_missing_file_raises_error(vector_store):
    with pytest.raises(VectorStoreError, match="Index or meta file not found"):
        await vector_store.load_local()

@pytest.mark.asyncio
async def test_corrupt_index_raises_error(vector_store, temp_index_path):
    # Create bad files
    with open(temp_index_path, 'wb') as f:
        f.write(b"not a real faiss index")
    with open(f"{temp_index_path}.meta.json", 'w') as f:
        f.write("{}")
        
    with pytest.raises(VectorStoreError, match="Failed to load index"):
        await vector_store.load_local()
