import sys
import os
import uvicorn
import webbrowser
import threading
from contextlib import asynccontextmanager

# Make `app.*` imports work when running as `python3 app/main.py` from backend/
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, dashboard, relief, public, records, predictions, predictions_neon, government, sos, blockchain
from app.core.config import settings
from app.db.neon import init_neon_pool, close_neon_pool


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan handler.
    - Startup:  initialise the asyncpg connection pool so the first request
                does not pay the cold-connection penalty.
    - Shutdown: gracefully drain and close the pool.
    """
    await init_neon_pool()
    yield
    await close_neon_pool()


app = FastAPI(title=settings.PROJECT_NAME, lifespan=lifespan)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

admin_router = APIRouter(prefix="/admin", tags=["admin"])

@app.get("/")
async def root():
    return {"message": "NDRRMA API is running", "docs": "/docs"}

@app.get("/health")
async def health():
    return {"status": "ok", "message": "NDRRMA API is running"}

# Routers
app.include_router(auth.router)
app.include_router(dashboard.router)
app.include_router(relief.router)
app.include_router(public.router)
app.include_router(records.router)
app.include_router(predictions.router)
app.include_router(predictions_neon.router)  # Neon database for wildfire predictions
app.include_router(government.router)  # Government & province dashboards
app.include_router(sos.router)  # SOS emergency requests
app.include_router(blockchain.router)  # Solana blockchain verification

if __name__ == "__main__":
    def open_browser():
        import time
        time.sleep(1.2)
        webbrowser.open("http://127.0.0.1:8005")

    threading.Thread(target=open_browser, daemon=True).start()

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8005,
        reload=True,
        reload_dirs=[os.path.dirname(os.path.dirname(os.path.abspath(__file__)))],
    )
