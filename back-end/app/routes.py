from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

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
def chat_endpoint(req: schemas.ChatRequest, current_user=Depends(get_current_user)):
    reply = f"Echo ({current_user.username}): {req.message}"
    return schemas.ChatResponse(reply=reply)


@router.get("/health")
def health():
    return {"status": "ok"}
