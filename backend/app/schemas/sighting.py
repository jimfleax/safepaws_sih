from typing import Optional
from pydantic import BaseModel, ConfigDict
from datetime import datetime

class SightingBase(BaseModel):
    reporter_name: str
    location: str
    notes: Optional[str] = None

class SightingCreate(SightingBase):
    alert_id: Optional[str] = None

class SightingResponse(SightingBase):
    id: str
    alert_id: Optional[str] = None
    time: datetime
    confirmed: bool
    
    model_config = ConfigDict(from_attributes=True)
