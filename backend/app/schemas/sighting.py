from datetime import datetime

from pydantic import BaseModel, ConfigDict


class SightingBase(BaseModel):
    reporter_name: str
    location: str
    notes: str | None = None

class SightingCreate(SightingBase):
    alert_id: str | None = None

class SightingResponse(SightingBase):
    id: str
    alert_id: str | None = None
    time: datetime
    confirmed: bool
    
    model_config = ConfigDict(from_attributes=True)
