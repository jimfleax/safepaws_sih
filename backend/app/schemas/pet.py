from typing import Optional, List
from pydantic import BaseModel, ConfigDict, Field

class PetBase(BaseModel):
    name: str
    species: str
    breed: Optional[str] = ""
    color: Optional[str] = ""
    age: Optional[str] = ""
    
    weight: Optional[str] = None
    microchip_id: Optional[str] = None
    medical_notes: Optional[str] = None
    diet_notes: Optional[str] = None
    reward: Optional[str] = None
    distinctive_features: Optional[List[str]] = []
    
    from pydantic import field_validator
    
    @field_validator("microchip_id", mode="before")
    @classmethod
    def empty_string_to_none(cls, v):
        if v == "":
            return None
        return v

class PetCreate(PetBase):
    pass

class PetResponse(PetBase):
    id: str
    photo_url: str
    status: str
    qr_tag_id: str
    
    owner_name: Optional[str] = ""
    owner_phone: Optional[str] = ""
    neighborhood: Optional[str] = ""
    owner_email: Optional[str] = ""
    consent_given: bool = False
    
    model_config = ConfigDict(from_attributes=True)

class PetUpdate(BaseModel):
    name: Optional[str] = None
    species: Optional[str] = None
    breed: Optional[str] = None
    color: Optional[str] = None
    age: Optional[str] = None
    weight: Optional[str] = None
    microchip_id: Optional[str] = None
    medical_notes: Optional[str] = None
    diet_notes: Optional[str] = None
    reward: Optional[str] = None
    distinctive_features: Optional[List[str]] = None
    status: Optional[str] = None
