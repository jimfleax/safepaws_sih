from fastapi import APIRouter, status
from app.schemas.sighting import SightingCreate, SightingResponse
from datetime import datetime
import uuid

router = APIRouter()


@router.post("/", response_model=SightingResponse, status_code=status.HTTP_201_CREATED)
async def report_sighting(sighting_in: SightingCreate):
    """
    Report a new community sighting.

    SCAFFOLD: Persistence via Panel 5 DB session not yet wired.
    Returns a generated sighting ID and timestamp but does NOT persist to PostgreSQL.
    Panel 1 must wire AsyncSession + Sighting ORM model to activate real persistence.
    """
    return SightingResponse(
        id=f"sighting-{uuid.uuid4().hex[:8]}",
        time=datetime.utcnow().isoformat(),
        confirmed=False,
        alert_id=None,
        **sighting_in.model_dump(),
    )
