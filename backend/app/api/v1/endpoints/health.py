import os
from pathlib import Path
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_db, get_detector, get_embedder, get_vector_store
from app.core.config import settings
from app.services.ml_interfaces import EmbeddingModel, NoseDetector
from app.vector_store.interfaces import VectorStore

router = APIRouter()

@router.get("/")
def health_check(embedder: EmbeddingModel = Depends(get_embedder)):
    mode = getattr(embedder, "is_scaffold_mode", False)
    return {
        "status": "ok", 
        "version": settings.VERSION,
        "pipeline_mode": "DEMONSTRATOR" if mode else "PRODUCTION"
    }

@router.get("/readiness")
async def health_readiness(
    db: AsyncSession = Depends(get_db),
    detector: NoseDetector = Depends(get_detector),
    embedder: EmbeddingModel = Depends(get_embedder),
    vector_store: VectorStore = Depends(get_vector_store),
):
    checks = {}
    is_ready = True
    is_prod = (os.getenv("ENVIRONMENT", "").lower() == "production") or (not settings.DEBUG)

    # 1. Database check
    try:
        await db.execute(text("SELECT 1"))
        checks["database"] = {"status": "ok"}
    except Exception as exc:
        checks["database"] = {"status": "error", "error": str(exc)}
        is_ready = False

    # 2. Detector check
    detector_name = type(detector).__name__
    if detector_name == "YoloNoseDetector":
        checks["detector"] = {"status": "ok", "type": "YoloNoseDetector"}
    else:
        checks["detector"] = {"status": "degraded", "type": detector_name}
        if is_prod:
            is_ready = False

    # 3. Embedder check
    embedder_scaffold = getattr(embedder, "is_scaffold_mode", True)
    embedder_name = type(embedder).__name__
    if not embedder_scaffold and embedder_name == "BiometricEmbeddingModel":
        checks["embedder"] = {"status": "ok", "mode": "production"}
    else:
        checks["embedder"] = {"status": "degraded", "mode": "scaffold" if embedder_scaffold else embedder_name}
        if is_prod:
            is_ready = False

    # 4. Model weights presence check
    backend_dir = Path(__file__).resolve().parent.parent.parent.parent
    yolo_weight = backend_dir / "model_weights" / "yolov8n.pt"
    embedding_weight = backend_dir / "model_weights" / "embedding_v1.pt"
    weights_ok = yolo_weight.exists() and embedding_weight.exists()
    checks["weights"] = {
        "status": "ok" if weights_ok else "missing",
        "yolov8n_present": yolo_weight.exists(),
        "embedding_v1_present": embedding_weight.exists()
    }
    if not weights_ok and is_prod:
        is_ready = False

    overall_status = "ready" if is_ready else "not_ready"
    status_code = 200 if is_ready else 503
    return JSONResponse(
        status_code=status_code,
        content={
            "status": overall_status,
            "version": settings.VERSION,
            "checks": checks
        }
    )
