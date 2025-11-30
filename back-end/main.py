from app.main import app

# Minimal entrypoint for uvicorn: exposes FastAPI appfrom app.main import app

# This file intentionally minimal so that uvicorn can import `main:app`.
import os
from dotenv import load_dotenv

# Carregar variáveis de ambiente do .env
load_dotenv()

import datetime
import hashlib
import hmac
import binascii
import secrets
from typing import Optional

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr

from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.orm import sessionmaker, declarative_base, Session

try:
	import jwt
except Exception as e:
	raise RuntimeError(
		"Missing dependency 'PyJWT'. Install with: pip install PyJWT"
	) from e

DATABASE_URL = os.getenv(
	"DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/postgres"
)

SECRET_KEY = os.getenv("SECRET_KEY", "change-me-in-production")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()


class User(Base):
	__tablename__ = "users"
	id = Column(Integer, primary_key=True, index=True)
	username = Column(String(128), unique=True, index=True, nullable=False)
	email = Column(String(256), unique=True, index=True, nullable=False)
	hashed_password = Column(String(512), nullable=False)
	created_at = Column(DateTime, default=datetime.datetime.utcnow)


Base.metadata.create_all(bind=engine)

app = FastAPI(title="Chatbot API with Auth")

# Allow requests from the frontend (adjust in production)
app.add_middleware(
	CORSMiddleware,
	allow_origins=["*"],
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/token")


def get_db():
	db: Session = SessionLocal()
	try:
		yield db
	finally:
		db.close()


def get_password_hash(password: str) -> str:
	"""Return a salted PBKDF2-HMAC-SHA256 hash in the form salt$hexhash."""
	salt = secrets.token_hex(16)
	dk = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), 100_000)
	return f"{salt}${binascii.hexlify(dk).decode()}"


def verify_password(plain_password: str, hashed: str) -> bool:
	try:
		salt, hash_hex = hashed.split("$", 1)
	except ValueError:
		return False
	dk = hashlib.pbkdf2_hmac("sha256", plain_password.encode(), salt.encode(), 100_000)
	return hmac.compare_digest(binascii.hexlify(dk).decode(), hash_hex)


def create_access_token(data: dict, expires_delta: Optional[datetime.timedelta] = None) -> str:
	to_encode = data.copy()
	if expires_delta:
		expire = datetime.datetime.utcnow() + expires_delta
	else:
		expire = datetime.datetime.utcnow() + datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
	to_encode.update({"exp": expire})
	token = jwt.encode(to_encode, SECRET_KEY, algorithm="HS256")
	return token


def decode_access_token(token: str) -> dict:
	try:
		payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
		return payload
	except jwt.ExpiredSignatureError:
		raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired")
	except jwt.PyJWTError:
		raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials")


class UserCreate(BaseModel):
	username: str
	email: EmailStr
	password: str


class UserOut(BaseModel):
	id: int
	username: str
	email: EmailStr

	class Config:
		from_attributes = True


class Token(BaseModel):
	access_token: str
	token_type: str


class ChatRequest(BaseModel):
	message: str


class ChatResponse(BaseModel):
	reply: str


def get_user_by_username(db: Session, username: str) -> Optional[User]:
	return db.query(User).filter(User.username == username).first()


def get_user_by_email(db: Session, email: str) -> Optional[User]:
	return db.query(User).filter(User.email == email).first()


def authenticate_user(db: Session, username: str, password: str) -> Optional[User]:
	user = get_user_by_username(db, username)
	if not user:
		return None
	if not verify_password(password, user.hashed_password):
		return None
	return user


async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
	payload = decode_access_token(token)
	username: str = payload.get("sub")
	if username is None:
		raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")
	user = get_user_by_username(db, username)
	if user is None:
		raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
	return user


@app.post("/register", response_model=UserOut)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
	if get_user_by_username(db, user_in.username):
		raise HTTPException(status_code=400, detail="Username already registered")
	if get_user_by_email(db, user_in.email):
		raise HTTPException(status_code=400, detail="Email already registered")
	hashed = get_password_hash(user_in.password)
	user = User(username=user_in.username, email=user_in.email, hashed_password=hashed)
	db.add(user)
	db.commit()
	db.refresh(user)
	return user


@app.post("/token", response_model=Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
	user = authenticate_user(db, form_data.username, form_data.password)
	if not user:
		raise HTTPException(status_code=401, detail="Incorrect username or password")
	access_token_expires = datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
	access_token = create_access_token(data={"sub": user.username}, expires_delta=access_token_expires)
	return {"access_token": access_token, "token_type": "bearer"}


@app.get("/me", response_model=UserOut)
def read_me(current_user: User = Depends(get_current_user)):
	return current_user


@app.post("/chat", response_model=ChatResponse)
def chat_endpoint(req: ChatRequest, current_user: User = Depends(get_current_user)):
	import requests
	
	groq_api_key = os.getenv("GROQ_API_KEY")
	if not groq_api_key:
		raise HTTPException(status_code=500, detail="Groq API key not configured")
	
	try:
		response = requests.post(
			"https://api.groq.com/openai/v1/chat/completions",
			headers={
				"Authorization": f"Bearer {groq_api_key}",
				"Content-Type": "application/json",
			},
			json={
				"model": "llama-3.1-8b-instant",
				"messages": [{"role": "user", "content": req.message}],
				"max_tokens": 512,
				"temperature": 0.7,
			},
			timeout=30
		)
		
		if not response.ok:
			error_detail = response.text
			try:
				error_data = response.json()
				error_detail = error_data.get("error", {}).get("message", error_detail)
			except:
				pass
			print(f"Groq API Error: {response.status_code} - {error_detail}")
			raise HTTPException(status_code=400, detail=f"Groq API error: {error_detail}")
		
		data = response.json()
		reply = data.get("choices", [{}])[0].get("message", {}).get("content", "")
		
		if not reply:
			raise HTTPException(status_code=500, detail="Empty response from Groq API")
		
		return ChatResponse(reply=reply)
	
	except requests.RequestException as e:
		print(f"Request Error: {str(e)}")
		raise HTTPException(status_code=500, detail=f"Failed to connect to Groq API: {str(e)}")
	except Exception as e:
		print(f"Unexpected Error: {str(e)}")
		raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")


@app.get("/health")
def health():
	return {"status": "ok"}


