from fastapi import APIRouter, HTTPException, Query
from app.core.database import get_db
from typing import Optional

router = APIRouter()


@router.get("/")
async def get_threats(
    severity: Optional[str] = Query(None, description="Filter by severity"),
    threat_type: Optional[str] = Query(None, description="Filter by type"),
    limit: int = Query(100, ge=1, le=1000),
    skip: int = Query(0, ge=0)
):
    db = get_db()
    filters = {}
    if severity:
        filters["severity"] = severity.lower()
    if threat_type:
        filters["type"] = threat_type.lower()

    cursor = db.threats.find(filters).sort(
        "last_seen", -1).skip(skip).limit(limit)
    threats = await cursor.to_list(length=limit)

    for t in threats:
        t.pop("_id", None)
    return threats


@router.get("/{indicator}")
async def get_threat(
    indicator: str,
    threat_type: str = Query(
        ..., description="Type of indicator")):
    db = get_db()
    query = {"indicator": indicator, "type": threat_type}
    threat = await db.threats.find_one(query)
    if not threat:
        raise HTTPException(status_code=404, detail="Threat not found")
    threat.pop("_id", None)
    return threat


@router.post("/fetch")
async def fetch_threats():
    from app.services.fetch_services import fetch_all_sources
    result = await fetch_all_sources()
    return {
        "status": "success",
        "message": "Threat data updated",
        "details": result}


@router.delete("/{indicator}")
async def delete_threat(indicator: str, threat_type: str = Query(...)):
    db = get_db()
    result = await db.threats.delete_one(
        {"indicator": indicator, "type": threat_type})
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=404, detail="Threat not found")
    return {"status": "deleted"}
