from pydantic import BaseModel, Field

class EmbeddingModelConfig(BaseModel):
    backbone_architecture: str = Field(
        default="resnet50", 
        description="The base CNN architecture (e.g., resnet50, mobilenet_v3, efficientnet_b0)"
    )
    embedding_dimension: int = Field(
        default=128, 
        description="Dimensionality of the output embedding vector (configurable/provisional and pending empirical selection)"
    )
    input_size: tuple[int, int] = Field(
        default=(224, 224), 
        description="Expected input resolution (height, width)"
    )
    model_weights_path: str = Field(
        default="model_weights/embedding_v1.pt",
        description="Path to the trained model checkpoint"
    )

class TrainingConfig(BaseModel):
    batch_size: int = 32
    learning_rate: float = 1e-4
    margin: float = 0.5
    epochs: int = 50
    negative_mining_strategy: str = "semi-hard"
