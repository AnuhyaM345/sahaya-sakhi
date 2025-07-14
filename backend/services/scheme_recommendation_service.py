# backend/services/scheme_recommendation_service.py

import json
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from models import Scheme
from pydanticmodels.scheme_models import SchemeRequest

async def match_schemes(db: AsyncSession, user: SchemeRequest):
    result = await db.execute(select(Scheme))
    all_schemes = result.scalars().all()
    
    eligible_schemes = []

    for scheme in all_schemes:
        # Assuming scheme.eligibility_criteria is already a JSON object, if not, parse it
        criteria = scheme.eligibility_criteria if isinstance(scheme.eligibility_criteria, dict) else json.loads(scheme.eligibility_criteria)

        print(f"Checking scheme: {scheme.name} | Scheme state: {criteria.get('state')} | User state: {user.state}")

        # Matching criteria logic
        if criteria.get("min_age") is not None and user.age < criteria["min_age"]:
            continue
        if criteria.get("max_age") is not None and user.age > criteria["max_age"]:
            continue
        if criteria.get("max_income") is not None and user.income > criteria["max_income"]:
            continue
        if criteria.get("category") and user.category.lower() not in [c.lower() for c in criteria["category"]]:
            continue
        
        if criteria.get("state") and user.state.strip().lower() != criteria["state"].strip().lower():
            continue

        if criteria.get("disability_required") is not None and criteria["disability_required"] != user.disability:
            continue
        if criteria.get("marital_status") and user.marital_status.lower() != criteria["marital_status"].lower():
            continue


        eligible_schemes.append(scheme)
    
    print(f"[DEBUG] Eligible schemes: {[s.name for s in eligible_schemes]}")

    return eligible_schemes
