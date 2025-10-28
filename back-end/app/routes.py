
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
import os
import httpx

from . import schemas, crud
from .db import get_db, init_db
from .security import create_access_token
from .deps import get_current_user

router = APIRouter()


@router.on_event("startup")
def startup_event():
    # Ensure DB tables exist
    init_db()


@router.post("/auth/register", response_model=schemas.UserOut)
def register(user_in: schemas.UserCreate, db: Session = Depends(get_db)):
    if crud.get_user_by_username(db, user_in.username):
        raise HTTPException(status_code=400, detail="Username already registered")
    if crud.get_user_by_email(db, user_in.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    user = crud.create_user(db, user_in.username, user_in.email, user_in.password)
    return user


@router.post("/auth/login", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    access_token_expires = __import__("datetime").timedelta(minutes=60)
    access_token = create_access_token(data={"sub": user.username}, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=schemas.UserOut)
def read_me(current_user=Depends(get_current_user)):
    return current_user


@router.post("/chat", response_model=schemas.ChatResponse)
async def chat_endpoint(req: schemas.ChatRequest, current_user=Depends(get_current_user)):
    # Prepare Groq API call
    GROQ_API_URL = os.getenv("GROQ_API_URL", "https://api.groq.com/openai/v1/chat/completions")
    GROQ_API_KEY = os.getenv("GROQ_API_KEY")
    if not GROQ_API_KEY:
        raise HTTPException(status_code=500, detail="Groq API key not configured")

    # Format messages for Groq (user message only)
    messages = [
        {"role": "user", "content": req.message}
    ]
    body = {
        "model": "llama-3-8b-instant",  # You can change to another Groq-supported model
        "messages": messages,
        "max_tokens": 512,
        "temperature": 0.7,
    }
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {GROQ_API_KEY}",
    }
    async with httpx.AsyncClient() as client:
        groq_resp = await client.post(GROQ_API_URL, json=body, headers=headers)
    if groq_resp.status_code != 200:
        raise HTTPException(status_code=502, detail=f"Groq API error: {groq_resp.text}")
    groq_data = groq_resp.json()
    # Extract reply from Groq response
    try:
        reply = groq_data["choices"][0]["message"]["content"]
    except Exception:
        reply = "[Error: Unexpected Groq response format]"
    return schemas.ChatResponse(reply=reply)


@router.get("/health")
def health():
    return {"status": "ok"}
