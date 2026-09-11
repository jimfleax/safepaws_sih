import os
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

@pytest.mark.asyncio
async def test_initialization(vector_store):
    assert vector_store.dimension == 128
    assert vector_store.index is not None
    assert vector_store.index.ntotal == 0

@pytest.mark.asyncio
async def test_add_and_search_vector(vector_store):
    # Vector of 1s
    v1 = np.ones((1, 128), dtype=np.float32)
    await vector_store.add_vector("pet1", v1)
    
    assert vector_store.index.ntotal == 1
    
    # Search with same vector
    results = await vector_store.search(v1, top_k=1)
    assert len(results) == 1
    
    pet_id_hash, score = results[0]
    # Score should be very close to 1.0 (Cosine similarity of identical vectors)
    assert pytest.approx(score, 0.001) == 1.0
    
    # We used stringified hash inside FAISS store
    assert pet_id_hash == str(hash("pet1") % ((1 << 63) - 1))

@pytest.mark.asyncio
async def test_dimension_mismatch(vector_store):
    bad_vector = np.ones((1, 64), dtype=np.float32)
    with pytest.raises(VectorStoreError, match="Dimension mismatch"):
        await vector_store.add_vector("pet2", bad_vector)

@pytest.mark.asyncio
async def test_remove_vector(vector_store):
    v1 = np.ones((1, 128), dtype=np.float32)
    await vector_store.add_vector("pet1", v1)
    assert vector_store.index.ntotal == 1
    
    await vector_store.remove_vector("pet1")
    assert vector_store.index.ntotal == 0

@pytest.mark.asyncio
async def test_persistence(vector_store, temp_index_path):
    v1 = np.ones((1, 128), dtype=np.float32)
    await vector_store.add_vector("pet1", v1)
    
    await vector_store.save_local()
    assert os.path.exists(temp_index_path)
    
    # Create new instance and load
    new_store = FAISSVectorStore(dimension=128, index_path=temp_index_path)
    await new_store.load_local()
    
    assert new_store.index.ntotal == 1

@pytest.mark.asyncio
async def test_rebuild(vector_store):
    vectors = [
        ("pet1", np.ones((1, 128), dtype=np.float32)),
        ("pet2", np.zeros((1, 128), dtype=np.float32) + 0.5)
    ]
    
    await vector_store.rebuild(vectors)
    assert vector_store.index.ntotal == 2

@pytest.mark.asyncio
async def test_load_missing_file_raises_error(vector_store):
    with pytest.raises(VectorStoreError, match="Index file not found"):
        await vector_store.load_local()
