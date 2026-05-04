import pathlib
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from app.core.config import settings
from app.api.routes import threats, logs, health, auth, scan
from app.core.database import init_db
import os

limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title="OrionSec API",
    description="Security Threat Detection and Intelligence Platform",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


@app.on_event("startup")
async def startup_event():
    await init_db()
    print("OrionSec Backend started successfully")


@app.on_event("shutdown")
async def shutdown_event():
    print("OrionSec Backend shutting down")

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(health.router, prefix="/api/health", tags=["Health"])
app.include_router(scan.router, prefix="/api/scan", tags=["Scan"])
app.include_router(threats.router, prefix="/api/threats", tags=["Threats"])
app.include_router(logs.router, prefix="/api/logs", tags=["Logs"])


@app.get("/")
async def root():
    return {
        "service": "OrionSec API",
        "version": "1.0.0",
        "status": "operational",
        "docs": "/api/docs"
    }

# Serve frontend in production
frontend_dist = str(
    pathlib.Path(__file__).resolve().parent.parent.parent /
    "frontend" /
    "dist")
if os.path.exists(frontend_dist):
    app.mount(
        "/",
        StaticFiles(
            directory=frontend_dist,
            html=True),
        name="frontend")

    @app.exception_handler(404)
    async def custom_404(request, exc):
        return FileResponse(os.path.join(frontend_dist, "index.html"))
