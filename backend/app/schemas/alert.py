from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.schemas.sighting import SightingResponse


class AlertCreate(BaseModel):
    pet_id: str
    last_seen_address: str
    description: str

class AlertResponse(BaseModel):
    id: str
    pet_id: str
    status: str
    last_seen_address: str | None = None
    description: str | None = None
    created_at: datetime
    sightings: list[SightingResponse] = []
    pet_name: str = "Unknown"
    breed: str = "Unknown"
    photo_url: str = ""
    
    model_config = ConfigDict(from_attributes=True)
