"""
Panel 3 — Training Infrastructure Tests

Coverage:
  - identity-disjoint split correctness
  - identity leakage detection
  - edge cases: empty records, single identity
  - training config completeness
  - trainer setup / NotImplementedError safety
"""
import pytest
import numpy as np

from app.ml.embedding.config import TrainingConfig
from app.ml.embedding.training.dataset import (
    IdentityAwareDataset,
    split_dataset,
    verify_no_identity_leakage,
)
from app.ml.embedding.training.trainer import BiometricTrainer


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _make_records(num_identities: int, images_per_identity: int = 5) -> list:
    records = []
    for i in range(num_identities):
        identity_id = f"pet-{i:04d}"
        for j in range(images_per_identity):
            records.append({
                "identity_id": identity_id,
                "image_path": f"data/{identity_id}/img_{j}.jpg",
            })
    return records


# ---------------------------------------------------------------------------
# split_dataset: identity-disjoint correctness
# ---------------------------------------------------------------------------

class TestSplitDataset:
    def test_all_records_get_a_split(self):
        records = _make_records(20)
        split_records = split_dataset(records, seed=42)
        assert all("split" in r for r in split_records)

    def test_splits_are_identity_disjoint(self):
        records = _make_records(30)
        split_records = split_dataset(records, seed=42)
        # For each identity, check it appears in only one split
        identity_splits: dict = {}
        for r in split_records:
            uid = r["identity_id"]
            identity_splits.setdefault(uid, set()).add(r["split"])
        leaking = {uid: splits for uid, splits in identity_splits.items() if len(splits) > 1}
        assert not leaking, f"Identity leakage in split: {leaking}"

    def test_split_counts_are_roughly_correct(self):
        records = _make_records(100)
        split_records = split_dataset(records, train_ratio=0.7, val_ratio=0.1, seed=42)
        # Count unique identities per split
        split_ids: dict = {"train": set(), "val": set(), "test": set()}
        for r in split_records:
            split_ids[r["split"]].add(r["identity_id"])
        assert 60 <= len(split_ids["train"]) <= 80
        assert 5 <= len(split_ids["val"]) <= 20
        assert 5 <= len(split_ids["test"]) <= 30

    def test_deterministic_with_same_seed(self):
        records1 = _make_records(50)
        records2 = _make_records(50)
        split_dataset(records1, seed=99)
        split_dataset(records2, seed=99)
        for r1, r2 in zip(records1, records2):
            assert r1["split"] == r2["split"]

    def test_different_seeds_may_differ(self):
        records1 = _make_records(50)
        records2 = _make_records(50)
        split_dataset(records1, seed=1)
        split_dataset(records2, seed=2)
        # Not guaranteed to differ, but with 50 identities very likely
        splits1 = [r["split"] for r in records1]
        splits2 = [r["split"] for r in records2]
        assert splits1 != splits2

    def test_invalid_ratio_raises(self):
        records = _make_records(20)
        with pytest.raises(ValueError, match="must be < 1.0"):
            split_dataset(records, train_ratio=0.9, val_ratio=0.2)

    def test_empty_records_raises(self):
        with pytest.raises(ValueError, match="No records"):
            split_dataset([])


# ---------------------------------------------------------------------------
# verify_no_identity_leakage
# ---------------------------------------------------------------------------

class TestIdentityLeakageDetection:
    def test_clean_split_passes(self):
        records = _make_records(20)
        split_dataset(records, seed=42)
        # Should not raise
        verify_no_identity_leakage(records)

    def test_leaking_split_raises(self):
        # Manually create leakage
        records = [
            {"identity_id": "pet-001", "image_path": "a.jpg", "split": "train"},
            {"identity_id": "pet-001", "image_path": "b.jpg", "split": "val"},  # same id, different split
        ]
        with pytest.raises(ValueError, match="leakage"):
            verify_no_identity_leakage(records)


# ---------------------------------------------------------------------------
# IdentityAwareDataset
# ---------------------------------------------------------------------------

class TestIdentityAwareDataset:
    def test_dataset_filters_to_correct_split(self):
        records = _make_records(20)
        split_dataset(records, seed=42)
        train_ds = IdentityAwareDataset(records, split="train")
        val_ds = IdentityAwareDataset(records, split="val")
        # All identities in train should not be in val
        train_ids = {r["identity_id"] for r in train_ds.records}
        val_ids = {r["identity_id"] for r in val_ds.records}
        assert not train_ids.intersection(val_ids), "Train and val share identities!"

    def test_invalid_split_raises(self):
        records = _make_records(10)
        split_dataset(records, seed=42)
        with pytest.raises(ValueError, match="split must be"):
            IdentityAwareDataset(records, split="unknown")

    def test_empty_split_raises(self):
        # All records assigned to train, none to val
        records = [{"identity_id": "pet-001", "image_path": "a.jpg", "split": "train"}]
        with pytest.raises(ValueError, match="No records found for split='val'"):
            IdentityAwareDataset(records, split="val")

    def test_len(self):
        records = _make_records(10, images_per_identity=5)
        split_dataset(records, seed=42)
        train_ds = IdentityAwareDataset(records, split="train")
        assert len(train_ds) > 0

    def test_num_identities(self):
        records = _make_records(20)
        split_dataset(records, seed=42)
        ds = IdentityAwareDataset(records, split="train")
        assert ds.num_identities > 0
        assert ds.num_identities < 20  # Not all identities go to train


# ---------------------------------------------------------------------------
# TrainingConfig
# ---------------------------------------------------------------------------

class TestTrainingConfig:
    def test_default_config_is_valid(self):
        cfg = TrainingConfig()
        assert cfg.seed >= 0
        assert 0 < cfg.train_split_ratio < 1
        assert 0 < cfg.val_split_ratio < 1
        assert cfg.train_split_ratio + cfg.val_split_ratio < 1.0
        assert cfg.margin > 0
        assert cfg.negative_mining_strategy in ("hard", "semi-hard", "random")

    def test_config_is_json_serializable(self):
        import json
        cfg = TrainingConfig()
        dumped = json.dumps(cfg.model_dump())
        reloaded = json.loads(dumped)
        assert reloaded["seed"] == cfg.seed


# ---------------------------------------------------------------------------
# BiometricTrainer — safety guards
# ---------------------------------------------------------------------------

class TestBiometricTrainer:
    def test_train_without_setup_raises(self):
        cfg = TrainingConfig()
        trainer = BiometricTrainer(cfg)
        with pytest.raises(RuntimeError, match="setup"):
            trainer.train()

    def test_train_after_setup_raises_not_implemented(self):
        records = _make_records(20)
        cfg = TrainingConfig()
        trainer = BiometricTrainer(cfg)
        trainer.setup(records)
        with pytest.raises(NotImplementedError):
            trainer.train()

    def test_setup_detects_leakage(self):
        """Manually inject leaky records after split to verify trainer guards it."""
        records = _make_records(20)
        split_dataset(records, seed=42)
        # Corrupt: give one identity two different splits
        records[0]["split"] = "train"
        records[1]["identity_id"] = records[0]["identity_id"]
        records[1]["split"] = "val"
        cfg = TrainingConfig()
        trainer = BiometricTrainer(cfg)
        # setup will call verify_no_identity_leakage; should detect the corruption
        with pytest.raises(ValueError, match="leakage"):
            trainer.setup(records)

    def test_save_checkpoint_writes_metadata(self, tmp_path):
        records = _make_records(20)
        cfg = TrainingConfig(checkpoint_dir=str(tmp_path))
        trainer = BiometricTrainer(cfg)
        trainer.setup(records)
        checkpoint_path = str(tmp_path / "model.pt")
        trainer.save_checkpoint(checkpoint_path)
        meta_path = tmp_path / "model.json"
        assert meta_path.exists()
        import json
        meta = json.loads(meta_path.read_text())
        assert meta["embedding_dimension"] == cfg.embedding_dimension
        assert meta["backbone_architecture"] == cfg.backbone_architecture
        assert meta["seed"] == cfg.seed
