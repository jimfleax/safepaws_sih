
from pydantic import BaseModel, Field


class SearchResultMatch(BaseModel):
    pet_id: str
    qr_tag_id: str | None = None
    name: str | None = None
    breed: str | None = None
    photo_url: str | None = None
    confidence: float

class SearchResponse(BaseModel):
    status: str # "MATCH", "AMBIGUOUS", "UNKNOWN"
    matches: list[SearchResultMatch] = []
    message: str | None = None
    pipeline_mode: str = Field(
        default="PRODUCTION",
        description="Indicates whether the response is from a real biometric model ('PRODUCTION') or a 'DEMONSTRATOR' mock pipeline."
    )
