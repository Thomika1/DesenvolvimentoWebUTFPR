#!/usr/bin/env python3
"""
Script para testar registro de usuário
"""
import requests
import json
import random
import string

BASE_URL = "http://localhost:8000"

def generate_username():
    """Gera um username aleatório"""
    return f"user_{''.join(random.choices(string.ascii_lowercase, k=5))}"

def test_register(username=None, email=None, password="123456"):
    """Registra um novo usuário"""
    if not username:
        username = generate_username()
    if not email:
        email = f"{username}@test.com"
    
    print(f"Registrando usuário: {username}")
    print(f"Email: {email}")
    
    data = {
        "username": username,
        "email": email,
        "password": password
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/register", json=data, timeout=5)
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.ok:
            print("✅ Usuário registrado com sucesso!")
            return username, password
        else:
            print("❌ Erro ao registrar usuário")
            return None, None
    except Exception as e:
        print(f"❌ Erro: {e}")
        return None, None

def test_login(username, password):
    """Testa login com o usuário registrado"""
    print(f"\nFazendo login com {username}...")
    
    data = {
        "username": username,
        "password": password
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/token",
            data=data,
            headers={"Content-Type": "application/x-www-form-urlencoded"},
            timeout=5
        )
        print(f"Status: {response.status_code}")
        
        if response.ok:
            token_data = response.json()
            print(f"✅ Login bem-sucedido!")
            print(f"Token: {token_data.get('access_token', '')[:20]}...")
            return token_data.get('access_token')
        else:
            print(f"❌ Erro: {response.json()}")
            return None
    except Exception as e:
        print(f"❌ Erro: {e}")
        return None

def test_me(token):
    """Testa endpoint /me com token"""
    print(f"\nVerificando dados do usuário logado...")
    
    try:
        response = requests.get(
            f"{BASE_URL}/me",
            headers={"Authorization": f"Bearer {token}"},
            timeout=5
        )
        print(f"Status: {response.status_code}")
        
        if response.ok:
            user_data = response.json()
            print(f"✅ Dados do usuário:")
            print(json.dumps(user_data, indent=2))
            return user_data
        else:
            print(f"❌ Erro: {response.json()}")
            return None
    except Exception as e:
        print(f"❌ Erro: {e}")
        return None

if __name__ == "__main__":
    print("=" * 60)
    print("TESTE COMPLETO: REGISTRO + LOGIN + VERIFICAÇÃO")
    print("=" * 60)
    
    # Registrar usuário
    username, password = test_register()
    
    if username:
        # Fazer login
        token = test_login(username, password)
        
        # Se conseguiu token, verificar dados
        if token:
            test_me(token)
    
    print("\n" + "=" * 60)
