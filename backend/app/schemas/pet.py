from typing import Optional, List
from pydantic import BaseModel, ConfigDict, Field

class PetBase(BaseModel):
    name: str
    species: str
    breed: str
    color: str
    age: str
    owner_name: str
    owner_phone: str
    neighborhood: str
    
    weight: Optional[str] = None
    microchip_id: Optional[str] = None
    owner_email: Optional[str] = None
    medical_notes: Optional[str] = None
    diet_notes: Optional[str] = None
    reward: Optional[str] = None
    distinctive_features: List[str] = []
    
    consent_given: bool = Field(default=False, description="User must explicitly give consent to store biometric data")

class PetCreate(PetBase):
    pass

class PetResponse(PetBase):
    id: str
    photo_url: str
    status: str
    qr_tag_id: str
    
    model_config = ConfigDict(from_attributes=True)
