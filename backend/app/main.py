from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, dashboard, relief, public
from app.core.config import settings

app = FastAPI(title=settings.PROJECT_NAME)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Admin only routes for allocation
admin_router = APIRouter(prefix="/admin", tags=["admin"])

@app.get("/")
async def root():
    return {"message": "NDRRMA Disaster Budget Transparency API is running"}

# Include routers
app.include_router(auth.router)
app.include_router(dashboard.router)
app.include_router(relief.router)
app.include_router(public.router)
