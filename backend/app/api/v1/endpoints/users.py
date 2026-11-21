from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_current_owner, get_db
from app.db.models import Owner
from app.schemas.user import OwnerResponse, OwnerUpdate

router = APIRouter()

@router.put("/profile", response_model=OwnerResponse)
async def update_profile(
    profile_data: OwnerUpdate,
    db: AsyncSession = Depends(get_db),
    current_owner: Owner = Depends(get_current_owner)
):
    current_owner.phone = profile_data.phone
    current_owner.neighborhood = profile_data.neighborhood
    
    await db.commit()
    await db.refresh(current_owner)
    
    return current_owner
