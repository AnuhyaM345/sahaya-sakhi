from pydantic import BaseModel, EmailStr
from typing import List, Dict, Union, Optional

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: Optional[str] = "user"

class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None
