from pydantic import BaseModel
from typing import Optional

class OwnerUpdate(BaseModel):
    phone: str
    neighborhood: str

class OwnerResponse(BaseModel):
    id: str
    name: str
    email: Optional[str] = None
    phone: str
    neighborhood: Optional[str] = None

class GoogleLoginRequest(BaseModel):
    token: str
