# backend/database.py

import os
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from fastapi import FastAPI, Depends

# Load environment variables
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

# Create an async engine
engine = create_async_engine(DATABASE_URL, echo=True, future=True)

# Create session factory
AsyncSessionLocal = sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)

# Base model for Alembic migrations
Base = declarative_base()

# Dependency to get database session
async def get_async_db():
    async with AsyncSessionLocal() as session:
        yield session

# Dependency to get sync database session
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

# FastAPI app and test route for DB connection
app = FastAPI()

@app.get("/test-db")
async def test_db(db: AsyncSession = Depends(get_async_db)):
    try:
        await db.execute("SELECT 1")  # Basic query to check DB connection
        return {"message": "Database connection successful!"}
    except Exception as e:
        return {"error": str(e)}
