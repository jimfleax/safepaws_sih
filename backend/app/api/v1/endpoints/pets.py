from fastapi import APIRouter, HTTPException, status, UploadFile, File
from app.schemas.pet import PetCreate, PetResponse
from typing import Dict, Any

router = APIRouter()

@router.post("/register", response_model=PetResponse, status_code=status.HTTP_201_CREATED)
async def register_pet(pet_in: PetCreate):
    """
    Register a new pet profile. (Scaffolded)
    """
    # M0 Scaffold: Return mock data matching interface
    return PetResponse(
        id="mock-pet-id-123",
        photo_url="",
        status="safe",
        qr_tag_id="qr-mock-123",
        **pet_in.model_dump()
    )

@router.post("/{pet_id}/enroll-image", status_code=status.HTTP_200_OK)
async def enroll_image(pet_id: str, file: UploadFile = File(...)):
    """
    Enroll an image for an existing pet for biometric registration. (Scaffolded)
    """
    # M0 Scaffold
    return {"status": "success", "message": f"Image enrolled for pet {pet_id}"}

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
        qr_tag_id=f"qr-{pet_id}"
    )
