from fastapi import APIRouter, UploadFile, File, HTTPException
from app.schemas.search import SearchResponse

router = APIRouter()

MAX_FILE_SIZE = 5 * 1024 * 1024 # 5 MB
ALLOWED_TYPES = ["image/jpeg", "image/png"]

def validate_image(file: UploadFile):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=415, detail="Unsupported file type")
    
    file.file.seek(0, 2)
    size = file.file.tell()
    file.file.seek(0)
    
    if size > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File too large")

@router.post("/identify", response_model=SearchResponse)
async def identify_pet(file: UploadFile = File(...)):
    """
    Identify a pet from an image using the biometric pipeline. (Scaffolded)
    """
    validate_image(file)
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
    validate_image(file)
    # M0 Scaffold
    return SearchResponse(
        status="UNKNOWN",
        matches=[],
        message="Verification strictly scaffolded in M0"
    )
