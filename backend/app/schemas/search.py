from typing import List, Optional
from pydantic import BaseModel

class SearchResultMatch(BaseModel):
    pet_id: str
    confidence: float

class SearchResponse(BaseModel):
    status: str # "MATCH", "AMBIGUOUS", "UNKNOWN"
    matches: List[SearchResultMatch] = []
    message: Optional[str] = None
