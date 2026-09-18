from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from app.api.dependencies import get_db
from app.db.models import Alert, Pet
from app.schemas.alert import AlertCreate, AlertResponse

router = APIRouter()

@router.post("/", response_model=AlertResponse, status_code=status.HTTP_201_CREATED)
async def create_alert(alert_in: AlertCreate, db: AsyncSession = Depends(get_db)):
    pet = (await db.execute(select(Pet).where(Pet.id == alert_in.pet_id))).scalars().first()
    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")
        
    pet.status = "lost"
    
    new_alert = Alert(
        pet_id=alert_in.pet_id,
        last_seen_address=alert_in.last_seen_address,
        description=alert_in.description,
        status="active"
    )
    db.add(new_alert)
    await db.commit()
    await db.refresh(new_alert)
    
    # Reload with sightings (should be empty but ensures schema validation passes)
    stmt = select(Alert).options(selectinload(Alert.sightings)).where(Alert.id == new_alert.id)
    return (await db.execute(stmt)).scalars().first()

@router.get("/{alert_id}", response_model=AlertResponse)
async def get_alert(alert_id: str, db: AsyncSession = Depends(get_db)):
    stmt = select(Alert).options(selectinload(Alert.sightings)).where(Alert.id == alert_id)
    alert = (await db.execute(stmt)).scalars().first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    return alert

@router.put("/{alert_id}/resolve", response_model=AlertResponse)
async def resolve_alert(alert_id: str, db: AsyncSession = Depends(get_db)):
    stmt = select(Alert).options(selectinload(Alert.sightings)).where(Alert.id == alert_id)
    alert = (await db.execute(stmt)).scalars().first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
        
    alert.status = "resolved"
    
    pet = (await db.execute(select(Pet).where(Pet.id == alert.pet_id))).scalars().first()
    if pet:
        pet.status = "safe"
        
    await db.commit()
    await db.refresh(alert)
    return alert
@router.get("/", response_model=list[AlertResponse])
async def get_all_alerts(db: AsyncSession = Depends(get_db)):
    stmt = select(Alert).options(selectinload(Alert.sightings))
    alerts = (await db.execute(stmt)).scalars().all()
    return alerts
