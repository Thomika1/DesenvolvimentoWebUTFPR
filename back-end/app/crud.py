from sqlalchemy.orm import Session
from . import models
from .security import get_password_hash, verify_password


def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def create_user(db: Session, username: str, email: str, password: str):
    hashed = get_password_hash(password)
    user = models.User(username=username, email=email, hashed_password=hashed)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def authenticate_user(db: Session, username: str, password: str):
    user = get_user_by_username(db, username)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user


# ===== Chat Operations =====

def create_chat(db: Session, user_id: int, title: str = None):
    """Cria um novo chat para um usuário."""
    chat = models.Chat(user_id=user_id, title=title)
    db.add(chat)
    db.commit()
    db.refresh(chat)
    return chat


def get_chat(db: Session, chat_id: int, user_id: int):
    """Recupera um chat específico se pertencer ao usuário."""
    return db.query(models.Chat).filter(
        models.Chat.id == chat_id,
        models.Chat.user_id == user_id
    ).first()


def get_user_chats(db: Session, user_id: int):
    """Retorna todos os chats de um usuário."""
    return db.query(models.Chat).filter(
        models.Chat.user_id == user_id
    ).order_by(models.Chat.updated_at.desc()).all()


def add_message(db: Session, chat_id: int, role: str, content: str):
    """Adiciona uma mensagem a um chat."""
    message = models.Message(chat_id=chat_id, role=role, content=content)
    db.add(message)
    db.commit()
    db.refresh(message)
    return message


def get_chat_messages(db: Session, chat_id: int):
    """Retorna todas as mensagens de um chat."""
    return db.query(models.Message).filter(
        models.Message.chat_id == chat_id
    ).order_by(models.Message.created_at.asc()).all()
