"""
Minimal entrypoint for uvicorn.
This file should only import and expose the app from app.main
"""
from app.main import app

__all__ = ["app"]


