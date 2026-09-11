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

@router.post("/identify", response_model=SearchResponse)
async def identify_pet(
    file: UploadFile = File(...),
    service: BiometricPipelineService = Depends(get_biometric_service)
):
    """
    Identify a pet from an image using the biometric pipeline.
    """
    validate_image(file)
    file_bytes = await file.read()
    return await service.identify(file_bytes)

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
