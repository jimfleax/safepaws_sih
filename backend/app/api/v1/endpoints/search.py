from fastapi import APIRouter, UploadFile, File
from app.schemas.search import SearchResponse

router = APIRouter()

@router.post("/identify", response_model=SearchResponse)
async def identify_pet(file: UploadFile = File(...)):
    """
    Identify a pet from an image using the biometric pipeline. (Scaffolded)
    """
    # M0 Scaffold
    return SearchResponse(
        status="UNKNOWN",
        matches=[],
        message="Identification strictly scaffolded in M0"
    )

@router.post("/verify", response_model=SearchResponse)
async def verify_pet(pet_id: str, file: UploadFile = File(...)):
    """
    Verify if an image matches a specific pet ID. (Scaffolded)
    """
    # M0 Scaffold
    return SearchResponse(
        status="UNKNOWN",
        matches=[],
        message="Verification strictly scaffolded in M0"
    )
