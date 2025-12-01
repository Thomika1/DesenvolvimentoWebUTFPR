#!/usr/bin/env python3
"""
Script para testar autenticação
"""
import requests
import json

BASE_URL = "http://localhost:8000"

def test_register():
    """Registra um novo usuário"""
    print("=" * 50)
    print("TESTANDO REGISTRO")
    print("=" * 50)
    
    data = {
        "username": "teste",
        "email": "teste@test.com",
        "password": "123456"
    }
    
    response = requests.post(f"{BASE_URL}/auth/register", json=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    return response.json() if response.ok else None


def test_login():
    """Testa login"""
    print("\n" + "=" * 50)
    print("TESTANDO LOGIN")
    print("=" * 50)
    
    data = {
        "username": "teste",
        "password": "123456"
    }
    
    # Usando form data como o frontend faz
    response = requests.post(
        f"{BASE_URL}/token",
        data=data,
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    return response.json() if response.ok else None


def test_me(token):
    """Testa endpoint /me com token"""
    print("\n" + "=" * 50)
    print("TESTANDO /ME")
    print("=" * 50)
    
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/me", headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")


def test_health():
    """Testa health check"""
    print("\n" + "=" * 50)
    print("TESTANDO HEALTH CHECK")
    print("=" * 50)
    
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")


if __name__ == "__main__":
    try:
        # Testar health check
        test_health()
        
        # Tentar registrar (pode falhar se já existe)
        user = test_register()
        
        # Testar login
        auth = test_login()
        
        # Se login funcionou, testar /me
        if auth and "access_token" in auth:
            test_me(auth["access_token"])
        
    except Exception as e:
        print(f"\n❌ Erro: {e}")
