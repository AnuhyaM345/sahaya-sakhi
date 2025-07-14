# backend/pydanticmodels/talent_models.py

from pydantic import BaseModel
from typing import List, Dict, Optional

# ----------------------
# 📥 Input Models
# ----------------------

class Answer(BaseModel):
    question_id: int
    answer_value: float 


class QuestionnaireSubmission(BaseModel):
    user_id: int
    answers: List[Answer]


class QuestionCreate(BaseModel):
    question_text: str
    category: Optional[str] = None
    options: Optional[Dict[str, str]] = None  # options as a dictionary


class QuestionUpdate(BaseModel):
    question_text: Optional[str] = None
    category: Optional[str] = None
    options: Optional[Dict[str, str]] = None  # options as a dictionary


# ----------------------
# 📤 Output / Response Models
# ----------------------

class QuestionOut(BaseModel):
    id: int
    question_text: str
    category: str
    options: List[str]

    class Config:
        from_attributes = True  

    @classmethod
    def from_orm(cls, orm_model):
        # Ensure 'options' is returned as a list
        return cls(
            id=orm_model.id,
            question_text=orm_model.question_text,
            category=orm_model.category,
            options=orm_model.options if isinstance(orm_model.options, list) else []
        )


class TalentProfile(BaseModel):
    user_id: int
    scores: Dict[str, float]


class CourseInfo(BaseModel):
    title: str
    description: str
    link: str


class CareerRecommendation(BaseModel):
    career_id: int
    title: str
    match_score: float
    courses: List[CourseInfo]

    class Config:
        from_attributes = True  
