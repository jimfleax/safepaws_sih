from fastapi import APIRouter, status
from app.schemas.sighting import SightingCreate, SightingResponse
from datetime import datetime

router = APIRouter()

@router.post("/", response_model=SightingResponse, status_code=status.HTTP_201_CREATED)
async def report_sighting(sighting_in: SightingCreate):
    """
    Report a new community sighting. (Scaffolded)
    """
    # M0 Scaffold
    return SightingResponse(
        id="sighting-mock-123",
        time=datetime.now().isoformat(),
        confirmed=False,
        **sighting_in.model_dump()
    )
