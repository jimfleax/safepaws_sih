from fastapi import APIRouter, HTTPException, status, UploadFile, File, Depends
from app.schemas.pet import PetCreate, PetResponse
from typing import Dict, Any

from app.services.registration_service import RegistrationService
from app.api.dependencies import get_registration_service, get_db
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.models import Pet, Owner

router = APIRouter()

ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"]
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB


def validate_image(file: UploadFile):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=415, detail="Unsupported file type. Use JPEG, PNG, or WEBP.")

    file.file.seek(0, 2)
    size = file.file.tell()
    file.file.seek(0)

    if size > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File too large. Maximum is 5 MB.")


@router.post("/register", response_model=PetResponse, status_code=status.HTTP_201_CREATED)
async def register_pet(
    pet_in: PetCreate,
    service: RegistrationService = Depends(get_registration_service),
):
    """
    Register a new pet profile.
    Requires explicit owner consent (consent_given=true) before any data is stored.
    """
    if not pet_in.consent_given:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Owner consent (consent_given=true) is required to register a pet profile."
        )

    return await service.register_pet(pet_in)


@router.post("/{pet_id}/enroll-image", status_code=status.HTTP_200_OK)
async def enroll_image(
    pet_id: str,
    file: UploadFile = File(...),
    service: RegistrationService = Depends(get_registration_service),
):
    """
    Enroll a biometric image for an existing pet profile.
    """
    validate_image(file)
    file_bytes = await file.read()
    return await service.enroll_image(
        pet_id=pet_id,
        file_name=file.filename or f"{pet_id}_image",
        file_bytes=file_bytes,
        content_type=file.content_type,
    )


@router.get("/tag/{qr_tag_id}", response_model=PetResponse)
async def get_pet_by_tag(
    qr_tag_id: str,
    db: AsyncSession = Depends(get_db)
):
    """
    Get a public-safe pet profile by QR tag ID.
    """
    from sqlalchemy.orm import selectinload
    stmt = select(Pet).options(selectinload(Pet.owner), selectinload(Pet.photos)).where(Pet.qr_tag_id == qr_tag_id)
    result = await db.execute(stmt)
    pet = result.scalars().first()
    
    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")
        
    return PetResponse(
        id=pet.id,
        name=pet.name,
        species=pet.species,
        breed=pet.breed,
        color=pet.color,
        age=pet.age,
        weight=pet.weight,
        owner_name=pet.owner_name,
        owner_phone=pet.owner_phone,
        neighborhood=pet.neighborhood,
        medical_notes=pet.medical_notes,
        distinctive_features=pet.distinctive_features,
        microchip_id=pet.microchip_id,
        consent_given=True,
        photo_url=pet.photo_url,
        status=pet.status,
        qr_tag_id=pet.qr_tag_id or ""
    )

@router.get("/{pet_id}", response_model=PetResponse)
async def get_pet(
    pet_id: str,
    db: AsyncSession = Depends(get_db)
):
    """
    Get a public-safe pet profile by ID from the database.
    """
    stmt = select(Pet).where(Pet.id == pet_id)
    result = await db.execute(stmt)
    pet = result.scalars().first()
    
    if not pet:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Pet '{pet_id}' not found."
        )
        
    owner_stmt = select(Owner).where(Owner.id == pet.owner_id)
    owner_result = await db.execute(owner_stmt)
    owner = owner_result.scalars().first()
    
    return PetResponse(
        id=pet.id,
        name=pet.name,
        species=pet.species,
        breed=pet.breed or "",
        color=pet.color or "",
        age=pet.age or "",
        owner_name=owner.name if owner else "",
        owner_phone=owner.phone if owner else "",
        neighborhood=owner.neighborhood if owner else "",
        weight=pet.weight,
        microchip_id=pet.microchip_id,
        owner_email=owner.email if owner else None,
        medical_notes=pet.medical_notes,
        diet_notes=pet.diet_notes,
        reward=pet.reward,
        distinctive_features=pet.distinctive_features or [],
        consent_given=True,
        photo_url="",
        status=pet.status,
        qr_tag_id=pet.qr_tag_id or ""
    )
