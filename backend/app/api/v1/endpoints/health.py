from fastapi import APIRouter, Depends
from app.api.dependencies import get_embedder
from app.services.ml_interfaces import EmbeddingModel

router = APIRouter()

@router.get("/")
def health_check(embedder: EmbeddingModel = Depends(get_embedder)):
    mode = getattr(embedder, "is_scaffold_mode", False)
    return {
        "status": "ok", 
        "version": "0.1.0",
        "pipeline_mode": "DEMONSTRATOR" if mode else "PRODUCTION"
    }
