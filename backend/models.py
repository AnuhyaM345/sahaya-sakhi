#backend/models.py

from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, ForeignKey, Float, JSON, Table, Text
)
from sqlalchemy.orm import relationship, declarative_base
from sqlalchemy.dialects.postgresql import JSONB
from database import Base  # Ensure this path matches your project structure

Base = declarative_base()

# Association table for many-to-many User ↔ TalentCategory
user_talent_association = Table(
    'user_talent_association',
    Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id')),
    Column('talent_category_id', Integer, ForeignKey('talent_categories.id'))
)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(String, default="user")

    # Relationships
    responses = relationship("UserAnswer", back_populates="user")
    talents = relationship("TalentCategory", secondary=user_talent_association, back_populates="users")

# -----------------------
# Talent Assessment Tables
# -----------------------

class Question(Base):
    __tablename__ = "questions"
    id = Column(Integer, primary_key=True)
    question_text = Column(String, nullable=False)  # e.g., "How comfortable are you speaking in public?"
    category = Column(String, nullable=False)       # e.g., "communication", "creativity"
    options = Column(JSON, nullable=True)           # Optional - for multiple choice format (if needed)

class UserAnswer(Base):
    __tablename__ = "user_answers"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    question_id = Column(Integer, ForeignKey("questions.id"), nullable=False)
    answer_value = Column(Float, nullable=False)  # Answer on a scale (e.g., 1-5)

    # Relationships
    user = relationship("User", back_populates="responses")
    question = relationship("Question")

# -----------------------
# Talent Categories & Associations
# -----------------------

class TalentCategory(Base):
    __tablename__ = "talent_categories"
    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True, index=True, nullable=False)
    description = Column(String, nullable=False)

    # Relationships to Courses and Career Paths
    career_paths = relationship("CareerPath", back_populates="talent_category")
    users = relationship("User", secondary=user_talent_association, back_populates="talents")

# -----------------------
# Development Resources: Courses
# -----------------------

class Course(Base):
    __tablename__ = "courses"
    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    link = Column(String, nullable=False)
    career_path_id = Column(Integer, ForeignKey("career_paths.id"), nullable=True)

    career_path = relationship("CareerPath", back_populates="courses")


# -----------------------
# Career Guidance: Paths and User Recommendations
# -----------------------

class CareerPath(Base):
    __tablename__ = "career_paths"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=False)
    talent_category_id = Column(Integer, ForeignKey("talent_categories.id"), nullable=False)

    required_skills = Column(JSONB, nullable=False, default={})  # 🆕 ADD THIS

    talent_category = relationship("TalentCategory", back_populates="career_paths")

    courses = relationship("Course", back_populates="career_path")

# Recommended career paths for users based on talents
class UserCareerRecommendation(Base):
    __tablename__ = "user_career_recommendations"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    career_id = Column(Integer, ForeignKey("career_paths.id"), nullable=False)
    score = Column(Float, nullable=False)  # Match score based on user's talents

#---------------------------------------------------
#schemes
#---------------------------------------------------

class Scheme(Base):
    __tablename__ = "schemes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(Text, nullable=False)
    description = Column(Text)
    type = Column(String, nullable=False)
    eligibility_criteria = Column(JSON, nullable=False)
    benefits = Column(Text)
    links = Column(String, nullable=True)  # ✅ New field for external URL

