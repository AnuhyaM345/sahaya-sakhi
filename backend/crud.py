from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from passlib.context import CryptContext
from sqlalchemy import insert, func
import models, schemas
from typing import Dict, List
from collections import defaultdict

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

async def create_user(db: AsyncSession, user: schemas.UserCreate):
    db_user = models.User(
        name=user.name,
        email=user.email,
        password=hash_password(user.password),
        role=user.role or "user"
    )
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user

async def get_user(db: AsyncSession, user_id: int):
    result = await db.execute(select(models.User).filter(models.User.id == user_id))
    return result.scalars().first()

async def get_user_by_email(db: AsyncSession, email: str):
    result = await db.execute(select(models.User).filter(models.User.email == email))
    return result.scalars().first()
