from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from app.schemas.search import SearchResponse
from app.services.biometric_service import BiometricPipelineService
from app.api.dependencies import get_biometric_service

router = APIRouter()

ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"]
MAX_FILE_SIZE = 5 * 1024 * 1024 # 5MB

def validate_image(file: UploadFile):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=415, detail="Unsupported file type")
    
    file.file.seek(0, 2)
    size = file.file.tell()
    file.file.seek(0)
    
    if size > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File too large")

from app.api.dependencies import get_biometric_service, get_db
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.models import Pet

from sqlalchemy.orm import selectinload

@router.post("/identify", response_model=SearchResponse)
async def identify_pet(
    file: UploadFile = File(...),
    service: BiometricPipelineService = Depends(get_biometric_service),
    db: AsyncSession = Depends(get_db)
):
    """
    Identify a pet from an image using the biometric pipeline.
    """
    validate_image(file)
    file_bytes = await file.read()
    response = await service.identify(file_bytes)
    
    # Populate pet details for each match
    for match in response.matches:
        # We also need the photo url from the pet's photos
        # Let's just fetch the Pet object
        stmt = select(Pet).options(selectinload(Pet.photos)).where(Pet.id == match.pet_id)
        result = await db.execute(stmt)
        pet = result.scalar_one_or_none()
        if pet:
            match.qr_tag_id = pet.qr_tag_id
            match.name = pet.name
            match.breed = pet.breed
            match.photo_url = pet.photo_url
    
    return response

@router.post("/verify", response_model=SearchResponse)
async def verify_pet(
    pet_id: str,
    file: UploadFile = File(...),
    service: BiometricPipelineService = Depends(get_biometric_service)
):
    """
    Verify if an image matches a specific pet ID.
    """
    validate_image(file)
    file_bytes = await file.read()
    return await service.verify(pet_id, file_bytes)
