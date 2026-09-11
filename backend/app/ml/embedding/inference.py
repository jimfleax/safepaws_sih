import numpy as np
from PIL import Image
import io
from typing import Optional
from app.services.ml_interfaces import EmbeddingModel
from app.core.exceptions import DomainException
from app.ml.embedding.config import EmbeddingModelConfig

class BiometricEmbeddingModel(EmbeddingModel):
    def __init__(self, config: Optional[EmbeddingModelConfig] = None):
        """
        Model loading must occur once per application/model lifecycle, not per request.
        """
        self.config = config or EmbeddingModelConfig()
        self.is_loaded = False
        self._load_model()

    def _load_model(self) -> None:
        """
        Loads the backbone and metric-learning head from the configured path.
        (Scaffolded for M0)
        """
        try:
            # Scaffold: In a real implementation, we would load the PyTorch/ONNX model here
            # e.g., self.model = load_checkpoint(self.config.model_weights_path)
            self.is_loaded = True
        except Exception as e:
            raise DomainException(
                message=f"Failed to load embedding model: {str(e)}",
                error_code="MODEL_LOAD_FAILURE",
                status_code=500
            )

    def _preprocess(self, image: bytes, bounding_box: dict) -> np.ndarray:
        """
        Deterministic preprocessing: Crop, Resize, Normalize.
        """
        try:
            img = Image.open(io.BytesIO(image)).convert("RGB")
            
            # Extract crop based on bounding box (x, y, w, h)
            x, y, w, h = bounding_box.get('x', 0), bounding_box.get('y', 0), bounding_box.get('w', img.width), bounding_box.get('h', img.height)
            
            # Ensure valid bounds
            if w <= 0 or h <= 0 or x < 0 or y < 0 or x+w > img.width or y+h > img.height:
                raise ValueError("Invalid bounding box coordinates")
                
            crop = img.crop((x, y, x + w, y + h))
            
            # Resize to expected input size
            crop = crop.resize(self.config.input_size)
            
            # Normalize (0-1 range for simplicity in M0 scaffold)
            img_array = np.array(crop, dtype=np.float32) / 255.0
            
            return img_array
        except Exception as e:
            raise DomainException(
                message=f"Failed to preprocess image for embedding: {str(e)}",
                error_code="PREPROCESSING_FAILURE",
                status_code=400
            )

    async def generate_embedding(self, image: bytes, bounding_box: dict) -> np.ndarray:
        """
        Implements the EmbeddingModel Protocol.
        Input: Raw image bytes and verified bounding box.
        Output: L2-Normalized biometric embedding vector.
        
        DEVELOPMENT/TEST SCAFFOLD ONLY. 
        Not a trained biometric model; do not use to claim biometric accuracy.
        """
        if not self.is_loaded:
            raise DomainException("Model not loaded", "MODEL_NOT_LOADED", 500)
            
        preprocessed_img = self._preprocess(image, bounding_box)
        
        # Scaffold: Generate deterministic mock embedding based on input array mean
        # In reality, this would be: output = self.model(preprocessed_img)
        seed_value = int(np.mean(preprocessed_img) * 1000)
        np.random.seed(seed_value)
        
        raw_embedding = np.random.randn(self.config.embedding_dimension).astype(np.float32)
        
        # Explicit L2 Normalization (Crucial for FAISS cosine similarity)
        norm = np.linalg.norm(raw_embedding)
        if norm == 0:
            norm = 1e-10
        normalized_embedding = raw_embedding / norm
        
        return normalized_embedding
