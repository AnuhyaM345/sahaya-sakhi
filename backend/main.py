# backend/main.py

from fastapi import FastAPI, Depends, HTTPException, Security
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from database import get_db, engine
from contextlib import asynccontextmanager
from sqlalchemy import text
from fastapi.middleware.cors import CORSMiddleware
from jose import JWTError, jwt
from typing import List, Dict, Union
from dotenv import load_dotenv
import os
from routers import talent  # Talent Recognition Import
from routers import chatbot
from routers import scheme_recommendation

# Local modules
import crud, models, schemas
from auth import authenticate_user, create_access_token, SECRET_KEY, ALGORITHM

# Load environment variables
load_dotenv()

# Confirm API keys loaded
print("🔑 ASSEMBLY_API_KEY:", os.getenv("ASSEMBLY_API_KEY"))
print("🔑 OPENROUTER_API_KEY:", os.getenv("OPENROUTER_API_KEY"))
print("🗣️  ELEVENLABS_API_KEY:", os.getenv("ELEVENLABS_API_KEY"))

# Required keys check
if not os.getenv("OPENROUTER_API_KEY"):
    raise RuntimeError("Missing OpenRouter API Key. Set OPENROUTER_API_KEY in your .env file.")

if not os.getenv("ASSEMBLY_API_KEY"):
    raise RuntimeError("Missing AssemblyAI API Key. Set ASSEMBLY_API_KEY in your .env file.")

# Database setup during lifespan
@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(models.Base.metadata.create_all)
    yield
    await engine.dispose()

# Initialize FastAPI app
app = FastAPI(lifespan=lifespan)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    #allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Auth setup
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# Get current user from JWT
async def get_current_user(token: str = Security(oauth2_scheme), db: AsyncSession = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        role: str = payload.get("role")

        if not email or not role:
            raise HTTPException(status_code=401, detail="Invalid authentication token")

        user = await crud.get_user_by_email(db, email)
        if not user:
            raise HTTPException(status_code=401, detail="User not found")

        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")

# Admin-only access dependency
async def get_admin_user(user: models.User = Depends(get_current_user)):
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    return user

# Root endpoint
@app.get("/")
async def root():
    return {"message": "Your One-Stop Destination to Empowerment and Growth!"}

# DB Test endpoint
@app.get("/test-db")
async def test_db(db: AsyncSession = Depends(get_db)):
    try:
        result = await db.execute(text("SELECT 1"))
        return {"status": "success", "result": result.scalar()}
    except Exception as e:
        return {"status": "error", "message": str(e)}

# User creation
@app.post("/users", response_model=schemas.UserResponse)
async def add_user(user: schemas.UserCreate, db: AsyncSession = Depends(get_db)):
    return await crud.create_user(db, user)

# Fetch user by ID
@app.get("/users/{user_id}", response_model=schemas.UserResponse)
async def fetch_user(user_id: int, db: AsyncSession = Depends(get_db)):
    user = await crud.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# Login and get JWT token
@app.post("/login", response_model=schemas.Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
):
    email = form_data.username
    user = await authenticate_user(db, email, form_data.password)
    if not user:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    access_token = create_access_token({"sub": user.email, "role": user.role, "id": user.id})
    return {"access_token": access_token, "token_type": "bearer"}

# Admin dashboard
@app.get("/admin", dependencies=[Depends(get_admin_user)])
async def admin_dashboard():
    return {"message": "Welcome, Admin! You have full access."}

# Auth status check
@app.get("/auth/verify")
async def verify_authentication(user: models.User = Depends(get_current_user)):
    return {"status": "Authenticated", "user": {"name": user.name, "role": user.role}}

# Include Chatbot Router
app.include_router(chatbot.router, prefix="/api", tags=["Chatbot"])

app.include_router(talent.router, prefix="/api", tags=["Talent Recognition"])

app.include_router(scheme_recommendation.router)