# backend/pydanticmodels/scheme_models.py

from pydantic import BaseModel
from typing import Optional

class SchemeRequest(BaseModel):
    age: int
    income: float
    occupation: str
    state: str
    marital_status: str
    category: str
    disability: bool

class SchemeResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    type: str
    benefits: Optional[str]
    links: Optional[str]
