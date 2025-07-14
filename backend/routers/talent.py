# backend/routers/talent.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from models import Question, UserAnswer, CareerPath, UserCareerRecommendation
from pydanticmodels.talent_models import QuestionnaireSubmission, CareerRecommendation, QuestionOut
from database import get_db, get_async_db
from services.talent_logic import calculate_similarity
from sqlalchemy.orm import selectinload

from sqlalchemy.exc import SQLAlchemyError

router = APIRouter(prefix="/talent", tags=["Talent System"])


# Endpoint to submit the answers from the questionnaire
@router.post("/submit")
async def submit_questionnaire(
    data: QuestionnaireSubmission,
    db: AsyncSession = Depends(get_async_db)
):
    try:
        # Ensure the answers are processed correctly
        for answer in data.answers:
            try:
                answer_value = float(answer.answer_value)  # Ensure the value is a float
            except ValueError:
                raise HTTPException(status_code=400, detail=f"Invalid answer value: {answer.answer_value}")

            # Add the answer to the database
            db.add(UserAnswer(
                user_id=data.user_id,
                question_id=answer.question_id,
                answer_value=answer_value
            ))

        # Commit changes to the database
        await db.commit()
        return {"message": "Answers submitted successfully"}
    
    except SQLAlchemyError as e:
        await db.rollback()  # Rollback in case of any error during database operations
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"An error occurred: {str(e)}")


# Endpoint to get career recommendations based on answers
@router.get("/recommend/{user_id}", response_model=List[CareerRecommendation])
async def get_recommendations(user_id: int, db: AsyncSession = Depends(get_async_db)):
    try:
        # Fetch the answers submitted by the user
        result = await db.execute(select(UserAnswer).filter(UserAnswer.user_id == user_id))
        answers = result.scalars().all()

        if not answers:
            raise HTTPException(status_code=404, detail="No answers found for this user.")
        
        # Build talent profile (categorize based on question categories)
        scores = {}
        counts = {}
        question_ids = [ans.question_id for ans in answers]
        
        # Fetch all related questions in a single query
        result = await db.execute(select(Question).filter(Question.id.in_(question_ids)))
        questions = result.scalars().all()
        
        question_dict = {q.id: q for q in questions}
        
        for ans in answers:
            question = question_dict.get(ans.question_id)
            if question and question.category not in scores:
                scores[question.category] = 0
                counts[question.category] = 0
            if question:
                scores[question.category] += ans.answer_value
                counts[question.category] += 1
        
        # Normalize the scores for each category
        user_vector = {cat: scores[cat] / counts[cat] for cat in scores}

        # Get all career paths and compare with user profile
        result = await db.execute(
            select(CareerPath).options(selectinload(CareerPath.courses))
        )
        careers = result.scalars().all()

        recommendations = []
        for career in careers:
            score = calculate_similarity(user_vector, career.required_skills)
            recommendations.append({
                "career_id": career.id,
                "title": career.name,
                "match_score": round(score * 100, 2),
                "courses": [
                    {
                        "title": course.title,
                        "description": course.description,
                        "link": course.link
                    }
                    for course in career.courses
                ]
            })

            if score > 0:
                db.add(UserCareerRecommendation(
                    user_id=user_id,
                    career_id=career.id,
                    score=score
                ))
        
        # Commit the career recommendations to the database
        await db.commit()  # Ensure commit is awaited

        sorted_recs = sorted(recommendations, key=lambda x: x["match_score"], reverse=True)[:5]
        return sorted_recs

    
    except SQLAlchemyError as e:
        await db.rollback()  # Rollback in case of any error during database operations
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    
    except Exception as e:
        print("⚠️ Recommendation error:", e)
        raise HTTPException(status_code=400, detail=f"An error occurred: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")



# Endpoint to get all available questions
@router.get("/questions", response_model=List[QuestionOut])
async def get_questions(db: AsyncSession = Depends(get_async_db)):
    try:
        result = await db.execute(select(Question))
        questions = result.scalars().all()
        
        return questions
    
    except SQLAlchemyError as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"An error occurred: {str(e)}")
