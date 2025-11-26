# Chatbot RAG - Backend API

API FastAPI com autenticação JWT e sistema de Retrieval-Augmented Generation (RAG) para responder dúvidas sobre o vestibular da UTFPR.

## 🚀 Tecnologias

- **Framework**: FastAPI 0.120.0
- **Database**: PostgreSQL
- **Auth**: JWT + PBKDF2-HMAC-SHA256
- **RAG**: TF-IDF (scikit-learn)
- **LLM**: Groq API (llama-3.1-8b-instant)
- **ORM**: SQLAlchemy

## 📋 Pré-requisitos

- Python 3.12+
- PostgreSQL (Docker ou instalado localmente)
- Groq API Key

## 🔧 Setup Local

### 1. Clonar e preparar ambiente

```bash
cd back-end
python3 -m venv env
source env/bin/activate.fish  # ou activate no bash/zsh
pip install -r requirements.txt
```

### 2. Configurar PostgreSQL

Com Docker:
```bash
docker-compose up -d
```

Sem Docker: Configure `DATABASE_URL` no `.env`

### 3. Configurar variáveis de ambiente

Crie `.env` na raiz do `back-end/`:

```env
DATABASE_URL=postgresql://postgres:1234@localhost:5432/postgres
SECRET_KEY=sua-chave-secreta-muito-segura
GROQ_API_KEY=sua-groq-api-key
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

### 4. Inicializar banco de dados

```bash
python3 -c "from app.db import Base, engine; Base.metadata.create_all(engine)"
```

### 5. Rodar servidor

```bash
python3 -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## 📚 Endpoints Principais

### Autenticação
- `POST /auth/register` - Criar novo usuário
- `POST /auth/login` - Login (retorna JWT token)
- `GET /me` - Info do usuário autenticado

### Chat
- `POST /chat` - Enviar mensagem e receber resposta com RAG
- `GET /chats` - Listar todos os chats do usuário
- `GET /chats/{chat_id}` - Obter histórico de um chat

### Health
- `GET /health` - Verificar status da API

## 🗂️ Estrutura do Projeto

```
back-end/
├── app/
│   ├── __init__.py          # Inicialização, carrega .env
│   ├── main.py              # FastAPI app, startup
│   ├── routes.py            # Endpoints
│   ├── models.py            # SQLAlchemy models (User, Chat, Message)
│   ├── schemas.py           # Pydantic models
│   ├── crud.py              # Database operations
│   ├── db.py                # Database config
│   ├── security.py          # JWT, password hashing
│   ├── deps.py              # Dependency injection
│   └── rag_simples.py       # RAG system (TF-IDF)
├── main.py                  # Entry point (re-export FastAPI app)
├── requirements.txt         # Dependencies
├── docker-compose.yml       # PostgreSQL container
├── rag_index.json          # RAG index (cached)
├── utfpr_vestibular.txt    # RAG document source
└── .env                    # Variáveis de ambiente
```

## 🚀 Deployment

### Docker

```dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["python3", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Variáveis de Produção

```env
DATABASE_URL=postgresql://user:pass@prod-db:5432/dbname
SECRET_KEY=chave-segura-gerada-aleatorio
GROQ_API_KEY=chave-groq-producao
CORS_ORIGINS=https://seusite.com,https://www.seusite.com
```

## 🧪 Testando

```bash
# Login
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=test&password=test123"

# Chat (com token)
curl -X POST http://localhost:8000/chat \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message":"Qual é a data do vestibular?"}'

# Health
curl http://localhost:8000/health
```

## 📝 Notas Importantes

- O RAG index (`rag_index.json`) é carregado automaticamente na startup
- Chunks TF-IDF são criados com tamanho de ~1500 caracteres
- RAG busca os 5 chunks mais similares para cada query
- JWT tokens expiram em 60 minutos (configurável no `.env`)
- Todas as mensagens são persistidas no banco de dados

## 🔐 Segurança

- Senhas hash com PBKDF2-HMAC-SHA256 (100k iterations)
- JWT HS256 assinado
- SQL Injection prevenido com SQLAlchemy ORM
- CORS configurável por ambiente
- Validação com Pydantic

## 📧 Suporte

Para issues ou dúvidas, consulte o repositório GitHub.
