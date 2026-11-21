
from pydantic import BaseModel


class OwnerUpdate(BaseModel):
    phone: str
    neighborhood: str

class OwnerResponse(BaseModel):
    id: str
    name: str
    email: str | None = None
    phone: str
    neighborhood: str | None = None

class GoogleLoginRequest(BaseModel):
    token: str
