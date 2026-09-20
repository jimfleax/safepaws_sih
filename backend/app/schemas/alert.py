from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime
from app.schemas.sighting import SightingResponse

class AlertCreate(BaseModel):
    pet_id: str
    last_seen_address: str
    description: str

class AlertResponse(BaseModel):
    id: str
    pet_id: str
    status: str
    last_seen_address: Optional[str] = None
    description: Optional[str] = None
    created_at: datetime
    sightings: List[SightingResponse] = []
    pet_name: str = "Unknown"
    breed: str = "Unknown"
    photo_url: str = ""
    
    model_config = ConfigDict(from_attributes=True)
