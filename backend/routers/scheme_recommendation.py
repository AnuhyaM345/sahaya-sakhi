# backend/routers/scheme_recommendation.py

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession  # ✅ Add this
from database import get_db
from services.scheme_recommendation_service import match_schemes
from pydanticmodels.scheme_models import SchemeRequest, SchemeResponse

router = APIRouter(prefix="/api/schemes", tags=["Schemes"])

@router.post("/recommend", response_model=dict)
async def recommend_schemes(payload: SchemeRequest, db: AsyncSession = Depends(get_db)):
    matched = await match_schemes(db, payload)
    result = [
        SchemeResponse(
            id=scheme.id,
            name=scheme.name,
            description=scheme.description,
            type=scheme.type,
            benefits=scheme.benefits,
            links=scheme.links
        )
        for scheme in matched
    ]
    return {"schemes": result}
