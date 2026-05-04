from fastapi import APIRouter
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings
import time

router = APIRouter()


@router.get("/", include_in_schema=False)
@router.get("")
async def health_check():
    start = time.time()
    try:
        client = AsyncIOMotorClient(
            settings.MONGO_URL,
            serverSelectionTimeoutMS=2000)
        await client.admin.command('ping')
        db_latency = round((time.time() - start) * 1000, 2)
        return {
            "status": "healthy",
            "timestamp": time.time(),
            "services": {
                "database": "connected",
                "database_latency_ms": db_latency
            }
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "timestamp": time.time(),
            "error": str(e)
        }


@router.get("/ready")
async def readiness_check():
    try:
        client = AsyncIOMotorClient(
            settings.MONGO_URL,
            serverSelectionTimeoutMS=2000)
        await client.admin.command('ping')
        return {"status": "ready"}
    except Exception:
        return {"status": "not ready"}, 503
