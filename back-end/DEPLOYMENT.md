# 📦 Deployment Guide

## Opção 1: Deploy com Docker Compose (Recomendado)

### 1. Preparar variáveis de ambiente

```bash
cp .env.prod.example .env.prod
# Edite .env.prod com seus valores reais
nano .env.prod
```

### 2. Gerar SECRET_KEY segura

```bash
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

### 3. Fazer build e subir containers

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### 4. Verificar status

```bash
docker-compose -f docker-compose.prod.yml ps
docker-compose -f docker-compose.prod.yml logs web -f
```

### 5. Inicializar banco de dados

```bash
docker-compose -f docker-compose.prod.yml exec web python3 -c \
  "from app.db import Base, engine; Base.metadata.create_all(engine)"
```

---

## Opção 2: Deploy em Servidor Linux (sem Docker)

### 1. Preparar servidor

```bash
sudo apt-get update
sudo apt-get install -y python3.12 python3.12-venv postgresql postgresql-contrib nginx
```

### 2. Clonar repositório

```bash
git clone seu-repositorio /var/www/chatbot-api
cd /var/www/chatbot-api/back-end
```

### 3. Criar ambiente virtual

```bash
python3.12 -m venv env
source env/bin/activate
pip install -r requirements.txt
```

### 4. Configurar variáveis

```bash
cp .env.prod.example .env.prod
# Edite com dados reais
nano .env.prod
```

### 5. Inicializar banco PostgreSQL

```bash
sudo -u postgres createdb chatbot_db
sudo -u postgres createuser chatbot_user
# Configure a senha
```

### 6. Criar as tabelas

```bash
python3 -c "from app.db import Base, engine; Base.metadata.create_all(engine)"
```

### 7. Configurar Systemd para auto-start

Crie `/etc/systemd/system/chatbot-api.service`:

```ini
[Unit]
Description=Chatbot API
After=network.target

[Service]
Type=notify
User=www-data
WorkingDirectory=/var/www/chatbot-api/back-end
ExecStart=/var/www/chatbot-api/back-end/env/bin/python3 -m uvicorn main:app --host 127.0.0.1 --port 8000
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

Ativar serviço:

```bash
sudo systemctl daemon-reload
sudo systemctl enable chatbot-api
sudo systemctl start chatbot-api
```

### 8. Configurar Nginx como reverse proxy

Crie `/etc/nginx/sites-available/chatbot-api`:

```nginx
upstream uvicorn {
    server 127.0.0.1:8000;
}

server {
    listen 80;
    server_name seu.dominio.com;

    location / {
        proxy_pass http://uvicorn;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Ativar site:

```bash
sudo ln -s /etc/nginx/sites-available/chatbot-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 9. SSL com Let's Encrypt

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d seu.dominio.com
```

---

## Monitoramento

### Ver logs (Docker)

```bash
docker-compose -f docker-compose.prod.yml logs web -f
```

### Ver logs (Systemd)

```bash
sudo journalctl -u chatbot-api -f
```

### Health check

```bash
curl https://seu.dominio.com/health
```

---

## Backup

### Backup do banco de dados

```bash
# Docker
docker-compose -f docker-compose.prod.yml exec db pg_dump -U postgres chatbot_db > backup.sql

# Systemd
pg_dump -U chatbot_user chatbot_db > backup.sql
```

### Restore

```bash
# Docker
docker-compose -f docker-compose.prod.yml exec -T db psql -U postgres chatbot_db < backup.sql

# Systemd
psql -U chatbot_user chatbot_db < backup.sql
```

---

## Troubleshooting

**Erro de conexão no banco:**
- Verifique `DATABASE_URL` em `.env.prod`
- Confirme que PostgreSQL está rodando
- Teste conexão: `psql $DATABASE_URL`

**API retorna 500:**
- Veja logs: `docker-compose logs web` ou `journalctl -u chatbot-api`
- Confirme que todas as env vars estão configuradas

**CORS erro no frontend:**
- Atualize `CORS_ORIGINS` com seu domínio real
- Reinicie a API

**Out of memory:**
- Aumente recursos do container Docker
- Considere usar less chunks no RAG (reduzir `k` em routes.py)

---

## Próximos passos

1. ✅ Configurar HTTPS/SSL
2. ✅ Configurar backups automáticos
3. ✅ Configurar monitoramento (Prometheus, Grafana)
4. ✅ Configurar CI/CD (GitHub Actions, GitLab CI)
5. ✅ Rate limiting
6. ✅ Logging centralizado (ELK, Loki)
