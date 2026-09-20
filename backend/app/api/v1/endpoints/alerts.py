from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from app.api.dependencies import get_db, get_current_owner
from app.db.models import Alert, Pet, Owner
from app.schemas.alert import AlertCreate, AlertResponse

router = APIRouter()

@router.post("/", response_model=AlertResponse, status_code=status.HTTP_201_CREATED)
async def create_alert(
    alert_in: AlertCreate, 
    db: AsyncSession = Depends(get_db),
    current_owner: Owner = Depends(get_current_owner)
):
    pet = (await db.execute(select(Pet).where(Pet.id == alert_in.pet_id))).scalars().first()
    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")
        
    if pet.owner_id != current_owner.id:
        raise HTTPException(status_code=403, detail="Not authorized to create alert for this pet")
        
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
    stmt = select(Alert).options(selectinload(Alert.sightings), selectinload(Alert.pet)).where(Alert.id == new_alert.id)
    return (await db.execute(stmt)).scalars().first()

@router.get("/{alert_id}", response_model=AlertResponse)
async def get_alert(alert_id: str, db: AsyncSession = Depends(get_db)):
    stmt = select(Alert).options(selectinload(Alert.sightings), selectinload(Alert.pet)).where(Alert.id == alert_id)
    alert = (await db.execute(stmt)).scalars().first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    return alert

@router.put("/{alert_id}/resolve", response_model=AlertResponse)
async def resolve_alert(
    alert_id: str, 
    db: AsyncSession = Depends(get_db),
    current_owner: Owner = Depends(get_current_owner)
):
    stmt = select(Alert).options(selectinload(Alert.sightings), selectinload(Alert.pet)).where(Alert.id == alert_id)
    alert = (await db.execute(stmt)).scalars().first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
        
    pet = (await db.execute(select(Pet).where(Pet.id == alert.pet_id))).scalars().first()
    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")

    if pet.owner_id != current_owner.id:
        raise HTTPException(status_code=403, detail="Not authorized to resolve this alert")
        
    alert.status = "resolved"
    pet.status = "safe"
        
    await db.commit()
    await db.refresh(alert)
    return alert
@router.get("/", response_model=list[AlertResponse])
async def get_all_alerts(db: AsyncSession = Depends(get_db)):
    stmt = select(Alert).options(selectinload(Alert.sightings), selectinload(Alert.pet))
    alerts = (await db.execute(stmt)).scalars().all()
    return alerts
