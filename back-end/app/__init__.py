"""App package initializer."""

# Carrega variáveis de ambiente do .env
from dotenv import load_dotenv
import os
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

from .main import app  # re-export for convenience
