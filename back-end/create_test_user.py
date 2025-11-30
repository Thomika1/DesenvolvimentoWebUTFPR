#!/usr/bin/env python
"""
Script para adicionar um usuário de teste ao banco de dados.
Execute: python create_test_user.py
"""
import os
import sys
import hashlib
import hmac
import binascii
import secrets

# Adicionar o diretório ao path
sys.path.insert(0, os.path.dirname(__file__))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/postgres")

# Importar a classe User do main.py
import importlib.util
spec = importlib.util.spec_from_file_location("main", os.path.join(os.path.dirname(__file__), "main.py"))
main_module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(main_module)

User = main_module.User
engine = main_module.engine
SessionLocal = main_module.SessionLocal

def get_password_hash(password: str) -> str:
    """Return a salted PBKDF2-HMAC-SHA256 hash"""
    salt = secrets.token_hex(16)
    dk = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), 100_000)
    return f"{salt}${binascii.hexlify(dk).decode()}"

def create_test_user():
    db = SessionLocal()
    try:
        # Verificar se usuário já existe
        existing = db.query(User).filter(User.username == "teste").first()
        if existing:
            print("✓ Usuário 'teste' já existe no banco")
            return
        
        # Criar novo usuário
        hashed_password = get_password_hash("123456")
        user = User(
            username="teste",
            email="teste@utfpr.edu.br",
            hashed_password=hashed_password
        )
        db.add(user)
        db.commit()
        print("✓ Usuário 'teste' criado com sucesso!")
        print("  Username: teste")
        print("  Password: 123456")
        print("  Email: teste@utfpr.edu.br")
    except Exception as e:
        print(f"✗ Erro ao criar usuário: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_test_user()
