from fastapi import APIRouter, HTTPException, status, UploadFile, File, Depends
from app.schemas.pet import PetCreate, PetResponse
from typing import Dict, Any

from app.services.registration_service import RegistrationService
from app.api.dependencies import get_registration_service

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
    # Pydantic-level check — consent_given is a required field in PetCreate.
    # Reject at the API layer before the service is called.
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
    Runs the full detector → quality → embedding → FAISS insertion pipeline.
    DB and FAISS are not atomic; compensation (rollback) is applied on failure.
    """
    validate_image(file)
    file_bytes = await file.read()
    return await service.enroll_image(
        pet_id=pet_id,
        file_name=file.filename or f"{pet_id}_image",
        file_bytes=file_bytes,
        content_type=file.content_type,
    )


@router.get("/{pet_id}", response_model=PetResponse)
async def get_pet(pet_id: str):
    """
    Get a public-safe pet profile by ID.

    SCAFFOLD: Real DB query via Panel 5 session not yet wired.
    Returns 404 for all IDs until Panel 5 DB integration is active.
    Panel 1 must wire the DB session dependency here to enable real lookups.
    """
    # Temporary: return 404 until real DB session + Pet model query is integrated.
    # This avoids returning fabricated PII or stale mock data in test/staging.
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=(
            f"Pet '{pet_id}' not found. "
            "Note: GET /pets/{pet_id} requires Panel 5 DB integration — not yet active."
        )
    )
