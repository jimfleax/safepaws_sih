from fastapi import APIRouter, HTTPException, status, UploadFile, File, Depends
from app.schemas.pet import PetCreate, PetResponse, PetUpdate
from typing import Dict, Any

from app.services.registration_service import RegistrationService
from app.api.dependencies import get_registration_service, get_db, get_current_owner
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
    current_owner: Owner = Depends(get_current_owner),
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

    return await service.register_pet(pet_in, current_owner=current_owner)


@router.post("/{pet_id}/enroll-image", status_code=status.HTTP_200_OK)
async def enroll_image(
    pet_id: str,
    file: UploadFile = File(...),
    service: RegistrationService = Depends(get_registration_service),
    db: AsyncSession = Depends(get_db),
    current_owner: Owner = Depends(get_current_owner),
):
    """
    Enroll a biometric image for an existing pet profile.
    Requires the authenticated user to be the pet's owner.
    """
    stmt = select(Pet).where(Pet.id == pet_id)
    result = await db.execute(stmt)
    pet = result.scalars().first()
    if not pet:
        raise HTTPException(status_code=404, detail="Pet not found")
    if pet.owner_id != current_owner.id:
        raise HTTPException(status_code=403, detail="Not authorized to enroll images for this pet")

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

@router.get("/", response_model=list[PetResponse])
async def list_pets(
    db: AsyncSession = Depends(get_db),
    current_owner: Owner = Depends(get_current_owner)
):
    """
    Get all pets belonging to the current owner.
    """
    stmt = select(Pet).where(Pet.owner_id == current_owner.id)
    result = await db.execute(stmt)
    pets = result.scalars().all()
    
    return [
        PetResponse(
            id=pet.id,
            name=pet.name,
            species=pet.species,
            breed=pet.breed or "",
            color=pet.color or "",
            age=pet.age or "",
            owner_name=current_owner.name,
            owner_phone=current_owner.phone,
            neighborhood=current_owner.neighborhood,
            weight=pet.weight,
            microchip_id=pet.microchip_id,
            owner_email=current_owner.email,
            medical_notes=pet.medical_notes,
            diet_notes=pet.diet_notes,
            reward=pet.reward,
            distinctive_features=pet.distinctive_features or [],
            consent_given=True,
            photo_url=pet.photo_url or "",
            status=pet.status,
            qr_tag_id=pet.qr_tag_id or ""
        ) for pet in pets
    ]

@router.delete("/{pet_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_pet(
    pet_id: str,
    db: AsyncSession = Depends(get_db),
    current_owner: Owner = Depends(get_current_owner)
):
    """
    Delete a pet record. Only the owning user may delete their pet.
    """
    stmt = select(Pet).where(Pet.id == pet_id)
    result = await db.execute(stmt)
    pet = result.scalars().first()

    if not pet:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pet not found")

    if pet.owner_id != current_owner.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to delete this pet")

    await db.delete(pet)
    await db.commit()

@router.put("/{pet_id}", response_model=PetResponse)
async def update_pet(
    pet_id: str,
    update_data: PetUpdate,
    db: AsyncSession = Depends(get_db),
    current_owner: Owner = Depends(get_current_owner)
):
    """
    Update a pet's details. Only the owning user may update their pet.
    """
    stmt = select(Pet).where(Pet.id == pet_id)
    result = await db.execute(stmt)
    pet = result.scalars().first()

    if not pet:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pet not found")

    if pet.owner_id != current_owner.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to update this pet")

    update_dict = update_data.model_dump(exclude_unset=True)
    for key, value in update_dict.items():
        setattr(pet, key, value)
        
    await db.commit()
    await db.refresh(pet)
    
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
        photo_url=pet.photo_url or "",
        status=pet.status,
        qr_tag_id=pet.qr_tag_id or ""
    )
