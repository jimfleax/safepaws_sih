"""
Configurable model configuration for the SafePaws biometric embedding system.

Design intent:
- No architecture is permanently locked here.
- Backbone, dimension, and preprocessing are all empirically selectable.
- TrainingConfig captures a full experiment specification for reproducibility.
"""
from typing import Literal, Optional, Tuple
from pydantic import BaseModel, Field


class PreprocessingConfig(BaseModel):
    """Deterministic preprocessing parameters — must be saved alongside checkpoint."""
    input_size: Tuple[int, int] = Field(
        default=(224, 224),
        description="(height, width) fed to backbone. Must match checkpoint."
    )
    mean: Tuple[float, float, float] = Field(
        default=(0.485, 0.456, 0.406),
        description="Per-channel mean for normalization (ImageNet defaults; override after dataset analysis)."
    )
    std: Tuple[float, float, float] = Field(
        default=(0.229, 0.224, 0.225),
        description="Per-channel std for normalization (ImageNet defaults; override after dataset analysis)."
    )
    antialias: bool = Field(
        default=True,
        description="Use anti-aliased resize to avoid aliasing artifacts during crop resize."
    )


class EmbeddingModelConfig(BaseModel):
    """
    Runtime inference configuration.

    All fields here must be consistent with the saved checkpoint metadata.
    The loader validates these against checkpoint.json at startup.
    """
    backbone_architecture: str = Field(
        default="resnet50",
        description=(
            "Base CNN/ViT architecture. NOT permanently locked. "
            "Options include: resnet50, mobilenet_v3_small, efficientnet_b0, convnext_tiny. "
            "Final selection must be evidence-driven (EER, latency, parameter count)."
        )
    )
    embedding_dimension: int = Field(
        default=128,
        description=(
            "Output embedding dimension. NOT permanently locked. "
            "Provisional: 128. Panel 3 will select based on FAR/FRR calibration experiments. "
            "Must match FAISS index dimension."
        )
    )
    model_weights_path: str = Field(
        default="model_weights/embedding_v1.pt",
        description="Path to the trained model checkpoint (.pt) file."
    )
    checkpoint_metadata_path: str = Field(
        default="model_weights/checkpoint.json",
        description="Path to JSON file containing saved experiment metadata for validation."
    )
    preprocessing: PreprocessingConfig = Field(default_factory=PreprocessingConfig)

    # Scaffold mode: explicitly controls whether random-vector fallback is permitted.
    # MUST be False in any production/staging deployment.
    scaffold_mode: bool = Field(
        default=False,
        description=(
            "DEVELOPMENT/TEST USE ONLY. "
            "When True, generates deterministic mock embeddings without a loaded model. "
            "Must be explicitly set. Never silently falls back."
        )
    )


class TrainingConfig(BaseModel):
    """
    Full experiment specification. Every training run must be reproducible from this config.
    """
    # Experiment identity
    experiment_name: str = Field(default="safepaws_biometric_v1", description="Run name for tracking.")
    seed: int = Field(default=42, description="Global RNG seed for reproducibility.")

    # Architecture (must match inference EmbeddingModelConfig)
    backbone_architecture: str = Field(default="resnet50")
    embedding_dimension: int = Field(default=128)
    preprocessing: PreprocessingConfig = Field(default_factory=PreprocessingConfig)

    # Loss
    loss_type: Literal["triplet"] = Field(default="triplet", description="P0 loss objective.")
    margin: float = Field(default=0.3, description="Triplet loss margin. Tunable.")
    negative_mining_strategy: Literal["hard", "semi-hard", "random"] = Field(
        default="semi-hard",
        description=(
            "Negative mining strategy. "
            "'semi-hard' is the stable P0 default. "
            "'hard' may improve performance but risks training collapse."
        )
    )

    # Optimization
    learning_rate: float = Field(default=1e-4)
    weight_decay: float = Field(default=1e-4)
    epochs: int = Field(default=50)
    batch_size: int = Field(default=32, description="Images per batch (not triplets per batch).")

    # Dataset
    dataset_root: str = Field(default="data/nose_dataset", description="Root directory for training images.")
    train_split_ratio: float = Field(
        default=0.7,
        description="Fraction of unique identities for training. Remainder split between val/test."
    )
    val_split_ratio: float = Field(
        default=0.1,
        description="Fraction of unique identities for validation."
    )
    # test_split_ratio is implied: 1.0 - train - val

    # Checkpoint
    checkpoint_dir: str = Field(default="model_weights/", description="Where to save checkpoints.")
    save_every_n_epochs: int = Field(default=5)
