from typing import List, Optional
from pydantic import BaseModel, Field

class SearchResultMatch(BaseModel):
    pet_id: str
    qr_tag_id: Optional[str] = None
    confidence: float

class SearchResponse(BaseModel):
    status: str # "MATCH", "AMBIGUOUS", "UNKNOWN"
    matches: List[SearchResultMatch] = []
    message: Optional[str] = None
    pipeline_mode: str = Field(
        default="PRODUCTION",
        description="Indicates whether the response is from a real biometric model ('PRODUCTION') or a 'DEMONSTRATOR' mock pipeline."
    )
