"""
Identity-aware dataset for biometric metric learning.

CRITICAL DESIGN RULE:
  Splits are performed at the IDENTITY level (pet_id), not the image level.
  No image of a given identity may appear in more than one split.
  Violation of this rule invalidates open-set evaluation.

Expected CSV/record format:
  {
      "identity_id": str,   # Canonical pet identity (pet UUID from DB)
      "image_path": str,    # Absolute or dataset-root-relative path to image file
      "split": str          # "train" | "val" | "test" — pre-assigned by split_dataset()
  }

The split field must be computed by split_dataset() below, not by random per-image sampling.
"""
import logging
from pathlib import Path
from typing import Dict, List, Optional, Tuple

import numpy as np

logger = logging.getLogger(__name__)

try:
    from torch.utils.data import Dataset as TorchDataset
    from PIL import Image as PILImage
    _TORCH_AVAILABLE = True
except ImportError:
    TorchDataset = object  # Fallback base so class is importable without torch
    _TORCH_AVAILABLE = False


def split_dataset(
    records: List[Dict],
    train_ratio: float = 0.7,
    val_ratio: float = 0.1,
    seed: int = 42,
) -> List[Dict]:
    """
    Assign identity-disjoint splits to a list of records.

    Algorithm:
      1. Collect unique identity_ids.
      2. Shuffle deterministically with seed.
      3. Assign first train_ratio fraction → "train".
      4. Assign next val_ratio fraction → "val".
      5. Remainder → "test".
      6. Propagate split assignment to all images of each identity.

    This guarantees zero identity leakage between splits.

    Args:
        records:     List of dicts with at least "identity_id" and "image_path".
        train_ratio: Fraction of unique identities for training.
        val_ratio:   Fraction of unique identities for validation.
        seed:        RNG seed for reproducibility.

    Returns:
        Same list with "split" key added/overwritten on each record.
    """
    if train_ratio + val_ratio >= 1.0:
        raise ValueError(
            f"train_ratio ({train_ratio}) + val_ratio ({val_ratio}) must be < 1.0 "
            f"to leave room for test split."
        )

    unique_ids = sorted({r["identity_id"] for r in records})
    if not unique_ids:
        raise ValueError("No records provided to split_dataset.")

    rng = np.random.default_rng(seed=seed)
    shuffled = rng.permutation(unique_ids).tolist()

    n = len(shuffled)
    n_train = int(n * train_ratio)
    n_val = int(n * val_ratio)

    train_ids = set(shuffled[:n_train])
    val_ids = set(shuffled[n_train : n_train + n_val])
    test_ids = set(shuffled[n_train + n_val :])

    logger.info(
        "Identity-disjoint split: %d train / %d val / %d test identities (total %d).",
        len(train_ids), len(val_ids), len(test_ids), n,
    )

    split_map: Dict[str, str] = {}
    for uid in train_ids:
        split_map[uid] = "train"
    for uid in val_ids:
        split_map[uid] = "val"
    for uid in test_ids:
        split_map[uid] = "test"

    for record in records:
        record["split"] = split_map[record["identity_id"]]

    return records


def verify_no_identity_leakage(records: List[Dict]) -> None:
    """
    Assert that no identity_id appears in more than one split.
    Raises ValueError if leakage is detected.
    Call before training to protect evaluation validity.
    """
    from collections import defaultdict
    identity_splits: Dict[str, set] = defaultdict(set)
    for r in records:
        identity_splits[r["identity_id"]].add(r.get("split", "UNKNOWN"))

    leaking = {uid: splits for uid, splits in identity_splits.items() if len(splits) > 1}
    if leaking:
        raise ValueError(
            f"Identity leakage detected! {len(leaking)} identities appear in multiple splits: "
            f"{dict(list(leaking.items())[:5])} ..."
        )


class IdentityAwareDataset(TorchDataset):
    """
    PyTorch Dataset for biometric metric learning.

    Requires torch. Importing this class without torch installed will raise
    at __getitem__ time, not at import time.

    Args:
        records:      List of records (must contain "identity_id", "image_path", "split").
        split:        Which split to load ("train", "val", or "test").
        transform:    Optional torchvision transform pipeline (for augmentation in train).
        dataset_root: Optional root prefix prepended to relative image_path values.
    """

    def __init__(
        self,
        records: List[Dict],
        split: str,
        transform=None,
        dataset_root: Optional[str] = None,
    ):
        if split not in ("train", "val", "test"):
            raise ValueError(f"split must be 'train', 'val', or 'test'. Got: '{split}'")

        self.split = split
        self.transform = transform
        self.dataset_root = Path(dataset_root) if dataset_root else None

        # Filter to this split
        self.records = [r for r in records if r.get("split") == split]
        if not self.records:
            raise ValueError(f"No records found for split='{split}'. Run split_dataset() first.")

        # Build label encoder: identity_id → integer label
        unique_ids = sorted({r["identity_id"] for r in self.records})
        self._label_map: Dict[str, int] = {uid: i for i, uid in enumerate(unique_ids)}
        self.num_identities = len(unique_ids)

        logger.info(
            "IdentityAwareDataset [%s]: %d images, %d identities.",
            split, len(self.records), self.num_identities,
        )

    def __len__(self) -> int:
        return len(self.records)

    def __getitem__(self, idx: int) -> Tuple:
        """
        Returns (image_tensor, integer_label).

        image_tensor: torch.Tensor of shape (3, H, W), float32.
        label:        int — encoded identity_id index.
        """
        if not _TORCH_AVAILABLE:
            raise RuntimeError("torch is required for IdentityAwareDataset.__getitem__.")

        import torch
        record = self.records[idx]
        img_path = Path(record["image_path"])
        if self.dataset_root and not img_path.is_absolute():
            img_path = self.dataset_root / img_path

        try:
            img = PILImage.open(img_path).convert("RGB")
        except Exception as exc:
            raise RuntimeError(f"Failed to load image at {img_path}: {exc}") from exc

        if self.transform is not None:
            img = self.transform(img)
        else:
            import torchvision.transforms.functional as TF
            img = TF.to_tensor(img)  # → (3, H, W) float32 in [0,1]

        label = self._label_map[record["identity_id"]]
        return img, label
