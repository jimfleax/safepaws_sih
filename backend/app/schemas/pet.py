
from pydantic import BaseModel, ConfigDict


class PetBase(BaseModel):
    name: str
    species: str
    breed: str | None = ""
    color: str | None = ""
    age: str | None = ""
    
    weight: str | None = None
    microchip_id: str | None = None
    medical_notes: str | None = None
    diet_notes: str | None = None
    reward: str | None = None
    distinctive_features: list[str] | None = []
    
    from pydantic import field_validator
    
    @field_validator("microchip_id", mode="before")
    @classmethod
    def empty_string_to_none(cls, v):
        if v == "":
            return None
        return v

class PetCreate(PetBase):
    consent_given: bool = False

class PetResponse(PetBase):
    id: str
    photo_url: str
    status: str
    qr_tag_id: str
    
    owner_name: str | None = ""
    owner_phone: str | None = ""
    neighborhood: str | None = ""
    owner_email: str | None = ""
    consent_given: bool = False
    
    model_config = ConfigDict(from_attributes=True)

class PetUpdate(BaseModel):
    name: str | None = None
    species: str | None = None
    breed: str | None = None
    color: str | None = None
    age: str | None = None
    weight: str | None = None
    microchip_id: str | None = None
    medical_notes: str | None = None
    diet_notes: str | None = None
    reward: str | None = None
    distinctive_features: list[str] | None = None
    status: str | None = None
