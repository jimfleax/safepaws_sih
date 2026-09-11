import pytest
from app.ml.embedding.training.dataset import IdentityAwareDataset

def test_identity_aware_split():
    mock_data = [
        {"pet_id": "pet_1", "image_path": "a.jpg"},
        {"pet_id": "pet_2", "image_path": "b.jpg"},
        {"pet_id": "pet_3", "image_path": "c.jpg"},
        {"pet_id": "pet_4", "image_path": "d.jpg"},
        {"pet_id": "pet_5", "image_path": "e.jpg"},
    ]
    
    train_ds = IdentityAwareDataset(mock_data, split="train")
    val_ds = IdentityAwareDataset(mock_data, split="val")
    
    train_ids = {r["pet_id"] for r in train_ds.data_records}
    val_ids = {r["pet_id"] for r in val_ds.data_records}
    
    # Ensure no identity leakage
    intersection = train_ids.intersection(val_ids)
    assert len(intersection) == 0
    
    # Ensure all data is covered
    assert len(train_ids) + len(val_ids) == len(mock_data)
