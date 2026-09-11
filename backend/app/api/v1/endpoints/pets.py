from fastapi import APIRouter, HTTPException, status, UploadFile, File, Depends
from app.schemas.pet import PetCreate, PetResponse
from typing import Dict, Any

from app.services.registration_service import RegistrationService
from app.api.dependencies import get_registration_service

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

@router.post("/register", response_model=PetResponse, status_code=status.HTTP_201_CREATED)
async def register_pet(
    pet_in: PetCreate,
    service: RegistrationService = Depends(get_registration_service)
):
    """
    Register a new pet profile.
    """
    if not hasattr(pet_in, 'consent_given') or not getattr(pet_in, 'consent_given', True):
        raise HTTPException(status_code=403, detail="Consent is required for registration")
        
    return await service.register_pet(pet_in)

@router.post("/{pet_id}/enroll-image", status_code=status.HTTP_200_OK)
async def enroll_image(
    pet_id: str,
    file: UploadFile = File(...),
    service: RegistrationService = Depends(get_registration_service)
):
    """
    Enroll an image for an existing pet for biometric registration.
    """
    validate_image(file)
    file_bytes = await file.read()
    return await service.enroll_image(
        pet_id=pet_id,
        file_name=file.filename,
        file_bytes=file_bytes,
        content_type=file.content_type
    )

@router.get("/{pet_id}", response_model=PetResponse)
async def get_pet(pet_id: str):
    """
    Get a pet profile by ID. (Scaffolded)
    """
    if pet_id == "not-found":
        raise HTTPException(status_code=404, detail="Pet not found")
        
    return PetResponse(
        id=pet_id,
        name="Mock Pet",
        species="dog",
        breed="Unknown",
        color="Brown",
        age="2",
        owner_name="John Doe",
        owner_phone="1234567890",
        neighborhood="Downtown",
        photo_url="https://mock-image.url",
        status="safe",
        qr_tag_id=f"qr-{pet_id}",
        consent_given=True
    )
