#!/bin/bash
# Script para inicializar a aplicação localmente

set -e

echo "🚀 Inicializando Chatbot API..."
echo ""

# Verificar Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 não encontrado!"
    exit 1
fi

echo "✅ Python encontrado: $(python3 --version)"
echo ""

# Criar venv se não existir
if [ ! -d "env" ]; then
    echo "📦 Criando ambiente virtual..."
    python3 -m venv env
fi

# Ativar venv
echo "🔄 Ativando ambiente virtual..."
source env/bin/activate

# Instalar dependências
echo "📥 Instalando dependências..."
pip install -q -r requirements.txt

# Verificar .env
if [ ! -f ".env" ]; then
    echo "⚠️  Arquivo .env não encontrado!"
    echo "   Copie .env.example para .env e preencha as variáveis"
    cp .env.example .env
    echo "   ✅ Arquivo .env criado (edite com seus valores)"
    exit 1
fi

echo "✅ .env encontrado"
echo ""

# Verificar Docker (opcional)
if command -v docker &> /dev/null; then
    echo "🐳 Docker encontrado"
    if ! docker ps -q --filter "name=web_db" 2>/dev/null | grep -q .; then
        echo "📦 Iniciando PostgreSQL com Docker..."
        docker-compose up -d
        sleep 3
        echo "✅ PostgreSQL iniciado"
    else
        echo "✅ PostgreSQL já está rodando"
    fi
else
    echo "⚠️  Docker não encontrado. Certifique-se que PostgreSQL está rodando."
fi

echo ""
echo "🔧 Inicializando banco de dados..."
python3 -c "from app.db import Base, engine; Base.metadata.create_all(engine)" && echo "✅ Banco inicializado" || echo "⚠️  Banco pode já estar inicializado"

echo ""
echo "✅ Tudo pronto!"
echo ""
echo "📍 Para iniciar o servidor, execute:"
echo "   python3 -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"
echo ""
echo "📖 Documentação: http://localhost:8000/docs"
echo "🧪 Health check: http://localhost:8000/health"
