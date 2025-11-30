# API do Projeto de Chatbot com Autenticação

Este documento descreve a API RESTful do projeto, implementada com FastAPI no backend e React no frontend. Atualmente, o projeto possui um sistema de autenticação completo e seguro, com endpoints protegidos e tokens JWT.

## Estado Atual do Projeto

### Implementado ✅
- Sistema completo de autenticação com JWT
- Hash seguro de senhas com PBKDF2
- Endpoints protegidos com OAuth2
- Documentação interativa (Swagger/OpenAPI)

### Em Desenvolvimento 🚧
- Sistema de conversas e mensagens (em breve)
- Implementação do RAG (próximas iterações)
- Integração com base de conhecimento (próximas iterações)

---

## 1. Autenticação (`/auth`)

Endpoints públicos para registro e login de usuários. O login retorna um token JWT para autenticar as requisições subsequentes.

### `POST /auth/register`

-   **Descrição**: Cria um novo usuário no banco de dados.
-   **Proteção**: Nenhuma (Público).
-   **Corpo da Requisição**:
    ```json
    {
      "username": "user123",
      "email": "user@example.com",
      "password": "yourstrongpassword"
    }
    ```
-   **Resposta de Sucesso (`201 Created`)**:
    ```json
    {
      "id": "user_uuid_123",
      "username": "user123",
      "email": "user@example.com"
    }
    ```

### `POST /auth/login`

-   **Descrição**: Autentica um usuário e retorna um token de acesso (`access_token`).
-   **Proteção**: Nenhuma (Público).
-   **Corpo da Requisição** (usando `OAuth2PasswordRequestForm` do FastAPI):
    ```bash
    username=user123&password=yourstrongpassword
    ```
-   **Resposta de Sucesso (`200 OK`)**:
    ```json
    {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "token_type": "bearer"
    }
    ```

---

## 2. Endpoints Protegidos

Endpoints que requerem autenticação via token JWT.

### `GET /me`

-   **Descrição**: Retorna os detalhes do usuário atualmente autenticado.
-   **Proteção**: Requer Autenticação (Token `Bearer`).
-   **Corpo da Requisição**: Nenhum.
-   **Resposta de Sucesso (`200 OK`)**:
    ```json
    {
      "id": "user_uuid_123",
      "username": "user123",
      "email": "user@example.com"
    }
    ```

### `POST /chat`

-   **Descrição**: Endpoint básico de chat (versão temporária sem RAG).
-   **Proteção**: Requer Autenticação (Token `Bearer`).
-   **Corpo da Requisição**:
    ```json
    {
      "message": "Olá, tudo bem?"
    }
    ```
-   **Resposta de Sucesso (`200 OK`)**:
    ```json
    {
      "reply": "Echo (user123): Olá, tudo bem?"
    }
    ```

### `GET /health`

-   **Descrição**: Verifica o status da API.
-   **Proteção**: Nenhuma (Público).
-   **Resposta de Sucesso (`200 OK`)**:
    ```json
    {
      "status": "ok"
    }
    ```

---

## TODO List 📋

### Modelos e Banco de Dados
- [ ] **Conversation Model**
  ```python
  class Conversation:
      id: UUID
      user_id: UUID
      title: str
      created_at: datetime
  ```
- [ ] **Message Model**
  ```python
  class Message:
      id: UUID
      conversation_id: UUID
      role: str  # "user" ou "assistant"
      content: str
      created_at: datetime
  ```
- [ ] Adicionar migrations para novos modelos
- [ ] Integrar com configuração do banco de dados

### Endpoints de Conversas
- [ ] `POST /conversations`
  - Criar nova conversa
  - Validar dados de entrada
  - Vincular ao usuário atual
- [ ] `GET /conversations`
  - Listar conversas do usuário
  - Adicionar paginação
  - Ordenar por data
- [ ] `GET /conversations/{conversation_id}`
  - Validar propriedade da conversa
  - Incluir mensagens da conversa
- [ ] `DELETE /conversations/{conversation_id}`
  - Validar propriedade
  - Deletar mensagens em cascata

### Sistema de Chat
- [ ] Modificar endpoint `/chat` atual
  - Salvar mensagens no banco
  - Vincular à conversa atual
- [ ] Implementar `/chat/stream`
  - Resposta em tempo real
  - Tratamento de erros de streaming
- [ ] (Opcional) Implementar WebSocket

### Segurança e Autenticação
- [ ] Validação de senha
  - Mínimo 8 caracteres
  - Pelo menos 1 número
  - Pelo menos 1 caractere especial
- [ ] Implementar refresh tokens
- [ ] Rate limiting nos endpoints
- [ ] Sistema de recuperação de senha

### Documentação
- [ ] Adicionar docstrings para o Swagger
- [ ] Documentar códigos de erro
- [ ] Atualizar exemplos de requisição
- [ ] Documentar estrutura do banco

### Testes
- [ ] Testes unitários para models
- [ ] Testes de integração para endpoints
- [ ] Testes de autenticação
- [ ] Testes de validação de dados

### Próximas Iterações
- [ ] Implementação do RAG
  - Vetorização de documentos
  - Sistema de recuperação
  - Integração com LLM
- [ ] WebSocket para chat em tempo real
- [ ] Sistema de notificações

---

## Executando o Projeto

### Pré-requisitos
- Python 3.8+
- pip (gerenciador de pacotes Python)
- Ambiente virtual (recomendado)

### Instalação

1. Clone o repositório e acesse a pasta do backend:
```bash
cd back-end
```

2. Instale as dependências:
```bash
pip install -r requirements.txt
```

3. Inicie o servidor:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Testando a API

1. Registre um novo usuário:
```bash
curl -X POST "http://localhost:8000/auth/register" -H "Content-Type: application/json" -d '{
  "username": "testuser",
  "email": "test@example.com",
  "password": "testpass123"
}'
```

2. Faça login para obter o token:
```bash
curl -X POST "http://localhost:8000/auth/login" -d "username=testuser&password=testpass123" -H "Content-Type: application/x-www-form-urlencoded"
```

3. Use o token para acessar endpoints protegidos:
```bash
curl -X GET "http://localhost:8000/me" -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### Documentação Interativa

A documentação interativa da API (Swagger/OpenAPI) está disponível em:
http://localhost:8000/docs

Esta interface permite:
- Visualizar todos os endpoints disponíveis
- Testar as requisições diretamente no navegador
- Ver os modelos de dados e respostas
- Autenticar-se para testar endpoints protegidos

---

## Rodando o Projeto Completo (Backend + Frontend)

### 1. Configurando o Ambiente

#### Backend (Python + FastAPI)
1. Crie um ambiente virtual Python:
```bash
cd back-end
python -m venv env
```

2. Ative o ambiente virtual:
```bash
# No Windows:
.\env\Scripts\activate
# No Linux/Mac:
source env/bin/activate
```

3. Instale as dependências:
```bash
pip install -r requirements.txt
```

#### Frontend (React + Vite)
1. Instale as dependências do Node.js:
```bash
cd ../front-end
npm install
```

### 2. Iniciando os Serviços

1. Inicie o banco de dados PostgreSQL (requer Docker):
```bash
cd ../back-end
docker-compose up -d
```

2. Em um novo terminal, inicie o backend:
```bash
# Certifique-se de estar na pasta back-end com o ambiente virtual ativado
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

3. Em outro terminal, inicie o frontend:
```bash
cd ../front-end
npm run dev
```

### 3. Acessando o Projeto

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- Documentação API: http://localhost:8000/docs
- Banco de dados: localhost:5432 (PostgreSQL)

### 4. Credenciais Padrão

#### Banco de Dados (PostgreSQL)
- Host: localhost
- Porta: 5432
- Usuário: postgres
- Senha: 1234
- Banco: postgres
