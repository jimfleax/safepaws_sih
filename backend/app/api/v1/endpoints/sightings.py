from fastapi import APIRouter, status, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.schemas.sighting import SightingCreate, SightingResponse
from app.db.models import Sighting
from app.api.dependencies import get_db
from datetime import datetime

router = APIRouter()

@router.post("/", response_model=SightingResponse, status_code=status.HTTP_201_CREATED)
async def report_sighting(
    sighting_in: SightingCreate,
    db: AsyncSession = Depends(get_db)
):
    """
    Report a new community sighting and persist to PostgreSQL.
    """
    new_sighting = Sighting(
        pet_id=sighting_in.pet_id,
        alert_id=sighting_in.alert_id,
        reporter_name=sighting_in.reporter_name,
        location=sighting_in.location,
        notes=sighting_in.notes,
        time=datetime.utcnow(),
        confirmed=False
    )
    db.add(new_sighting)
    await db.commit()
    await db.refresh(new_sighting)
    
    return SightingResponse(
        id=new_sighting.id,
        pet_id=new_sighting.pet_id,
        reporter_name=new_sighting.reporter_name,
        location=new_sighting.location,
        notes=new_sighting.notes,
        time=new_sighting.time.isoformat(),
        confirmed=new_sighting.confirmed,
        alert_id=new_sighting.alert_id
    )

@router.get("/{sighting_id}", response_model=SightingResponse)
async def get_sighting(sighting_id: str, db: AsyncSession = Depends(get_db)):
    """
    Retrieve a persisted sighting by ID.
    """
    result = await db.execute(select(Sighting).where(Sighting.id == sighting_id))
    sighting = result.scalars().first()
    if not sighting:
        raise HTTPException(status_code=404, detail="Sighting not found")
        
    return SightingResponse(
        id=sighting.id,
        pet_id=sighting.pet_id,
        reporter_name=sighting.reporter_name,
        location=sighting.location,
        notes=sighting.notes,
        time=sighting.time.isoformat(),
        confirmed=sighting.confirmed,
        alert_id=sighting.alert_id
    )
@router.get("/", response_model=list[SightingResponse])
async def get_all_sightings(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Sighting))
    sightings = result.scalars().all()
    return [
        SightingResponse(
            id=s.id,
            reporter_name=s.reporter_name,
            location=s.location,
            notes=s.notes,
            time=s.time.isoformat(),
            confirmed=s.confirmed,
            alert_id=s.alert_id
        ) for s in sightings
    ]
