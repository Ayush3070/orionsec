import httpx
from app.core.config import settings
from datetime import datetime
import random


async def fetch_abuseipdb():
    if not settings.ABUSEIPDB_API_KEY:
        return {
            "source": "AbuseIPDB",
            "status": "skipped",
            "reason": "No API key"}

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                "https://api.abuseipdb.com/api/v2/blacklist",
                headers={
                    "Key": settings.ABUSEIPDB_API_KEY,
                    "Accept": "application/json"
                },
                params={"limit": 1000, "confidenceMinimum": 90}
            )
            if response.status_code == 200:
                data = response.json()
                return {
                    "source": "AbuseIPDB",
                    "status": "success",
                    "count": len(
                        data.get(
                            "data",
                            []))}
    except Exception as e:
        return {"source": "AbuseIPDB", "status": "error", "error": str(e)}

    return {
        "source": "AbuseIPDB",
        "status": "error",
        "error": "Request failed"}


async def fetch_otx():
    if not settings.OTX_API_KEY:
        return {"source": "OTX", "status": "skipped", "reason": "No API key"}

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                "https://otx.alienvault.com/api/v1/pulses/subscribed",
                headers={"X-OTX-API-KEY": settings.OTX_API_KEY}
            )
            if response.status_code == 200:
                data = response.json()
                return {
                    "source": "OTX",
                    "status": "success",
                    "count": len(
                        data.get(
                            "results",
                            []))}
    except Exception as e:
        return {"source": "OTX", "status": "error", "error": str(e)}

    return {"source": "OTX", "status": "error", "error": "Request failed"}


async def fetch_mock_threats():
    db = await get_db()
    mock_ips = [f"192.168.1.{i}" for i in range(100, 150)]

    count = 0
    for ip in mock_ips:
        score = random.randint(1, 100)
        sev = "high" if score > 80 else "medium" if score > 50 else "low"
        doc = {
            "indicator": ip,
            "type": "ip",
            "issue": f"Mock threat for {ip}",
            "severity": sev,
            "confidence": score,
            "source": "MockSource",
            "last_seen": datetime.utcnow()
        }
        await db.threats.update_one(
            {"indicator": ip, "type": "ip"},
            {"$set": doc},
            upsert=True
        )
        count += 1

    return {"source": "MockSource", "status": "success", "count": count}


async def fetch_all_sources():
    results = []
    results.append(await fetch_abuseipdb())
    results.append(await fetch_otx())
    results.append(await fetch_mock_threats())
    return {"results": results, "timestamp": datetime.utcnow().isoformat()}


async def get_db():
    from motor.motor_asyncio import AsyncIOMotorClient
    client = AsyncIOMotorClient(settings.MONGO_URL)
    return client[settings.MONGO_DB]
