# API Endpoints para Chatbot RAG com Autenticação

Este documento descreve a API RESTful para o projeto de chatbot RAG, com um backend em FastAPI e frontend em React. A API lida com autenticação de usuários, gerenciamento de conversas e a interação principal com o chatbot.

---

## 1. Autenticação (`/auth`)

Endpoints públicos para registro e login de usuários. O login retorna um token JWT para autenticar as requisições subsequentes.

### `POST /auth/register`

-   **Descrição**: Cria um novo usuário no banco de dados.
-   **Proteção**: Nenhuma (Público).
-   **Corpo da Requisição**:
    ```json
    {
      "email": "user@example.com",
      "password": "yourstrongpassword"
    }
    ```
-   **Resposta de Sucesso (`201 Created`)**:
    ```json
    {
      "id": "user_uuid_123",
      "email": "user@example.com",
      "message": "User created successfully"
    }
    ```

### `POST /auth/login`

-   **Descrição**: Autentica um usuário e retorna um token de acesso (`access_token`).
-   **Proteção**: Nenhuma (Público).
-   **Corpo da Requisição** (usando `OAuth2PasswordRequestForm` do FastAPI):
    ```bash
    username=user@example.com&password=yourstrongpassword
    ```
-   **Resposta de Sucesso (`200 OK`)**:
    ```json
    {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "token_type": "bearer"
    }
    ```

---

## 2. Usuários (`/users`)

Endpoints protegidos para gerenciar os dados do usuário logado.

### `GET /users/me`

-   **Descrição**: Retorna os detalhes do usuário atualmente autenticado.
-   **Proteção**: Requer Autenticação (Token `Bearer`).
-   **Corpo da Requisição**: Nenhum.
-   **Resposta de Sucesso (`200 OK`)**:
    ```json
    {
      "id": "user_uuid_123",
      "email": "user@example.com"
    }
    ```

---

## 3. Conversas (`/conversations`)

Endpoints para criar, listar e deletar as conversas de um usuário.

### `POST /conversations`

-   **Descrição**: Inicia uma nova conversa (chat) para o usuário logado.
-   **Proteção**: Requer Autenticação.
-   **Corpo da Requisição**:
    ```json
    {
      "title": "Minha Primeira Conversa"
    }
    ```
-   **Resposta de Sucesso (`201 Created`)**:
    ```json
    {
      "id": "conv_uuid_abc",
      "user_id": "user_uuid_123",
      "title": "Minha Primeira Conversa",
      "created_at": "2025-10-19T19:30:00Z"
    }
    ```

### `GET /conversations`

-   **Descrição**: Lista todas as conversas do usuário autenticado.
-   **Proteção**: Requer Autenticação.
-   **Corpo da Requisição**: Nenhum.
-   **Resposta de Sucesso (`200 OK`)**:
    ```json
    [
      {
        "id": "conv_uuid_abc",
        "title": "Minha Primeira Conversa",
        "created_at": "2025-10-19T19:30:00Z"
      },
      {
        "id": "conv_uuid_def",
        "title": "Dúvidas sobre Go",
        "created_at": "2025-10-18T15:00:00Z"
      }
    ]
    ```

### `GET /conversations/{conversation_id}`

-   **Descrição**: Recupera uma conversa específica e todo o seu histórico de mensagens.
-   **Proteção**: Requer Autenticação. O backend deve validar que a conversa pertence ao usuário que fez a requisição.
-   **Parâmetros de URL**:
    -   `conversation_id` (string): O ID da conversa.
-   **Resposta de Sucesso (`200 OK`)**:
    ```json
    {
      "id": "conv_uuid_abc",
      "title": "Minha Primeira Conversa",
      "messages": [
        { "id": "msg_1", "role": "user", "content": "Olá, tudo bem?" },
        { "id": "msg_2", "role": "assistant", "content": "Olá! Tudo ótimo. Como posso ajudar?" }
      ]
    }
    ```

### `DELETE /conversations/{conversation_id}`

-   **Descrição**: Apaga uma conversa e todo o seu histórico de mensagens.
-   **Proteção**: Requer Autenticação.
-   **Parâmetros de URL**:
    -   `conversation_id` (string): O ID da conversa a ser deletada.
-   **Resposta de Sucesso (`204 No Content`)**.

---

## 4. Interação com o Chat (`/chat`)

Endpoint principal para a funcionalidade do chatbot.

### `POST /chat/stream`

-   **Descrição**: Envia uma mensagem do usuário para uma conversa específica e recebe a resposta do modelo RAG em tempo real (streaming).
-   **Proteção**: Requer Autenticação.
-   **Corpo da Requisição**:
    ```json
    {
      "conversation_id": "conv_uuid_abc",
      "query": "Como funciona o RAG em chatbots?"
    }
    ```
-   **Resposta de Sucesso (`200 OK`)**:
    -   Um `StreamingResponse` com `Content-Type: text/event-stream`. O frontend em React consome esses eventos para renderizar a resposta de forma incremental.

---

## 5. (Opcional) Abordagem com WebSocket

Como alternativa ao streaming via HTTP, WebSockets oferecem uma comunicação bidirecional de baixa latência, ideal para aplicações de chat.

### `WS /chat/ws/{conversation_id}`

-   **Descrição**: Estabelece uma conexão WebSocket para uma conversa específica, permitindo a troca de mensagens em tempo real.
-   **Proteção**: A autenticação deve ser feita durante o handshake da conexão (por exemplo, enviando o token como um parâmetro de query).
-   **Fluxo de Comunicação**:
    1.  O cliente (React) se conecta a `ws://your-api.com/chat/ws/{conversation_id}?token=...`.
    2.  O cliente envia mensagens para o servidor no formato JSON: `{"query": "Minha pergunta..."}`.
    3.  O servidor processa a query com o pipeline RAG e envia a resposta (ou tokens de resposta) de volta pela mesma conexão.
