from fastapi import APIRouter, HTTPException, Query
from app.core.database import threat_collection
from app.services.fetch_services import fetch_and_store_threats
from app.models.threat_model import threat_model
from typing import Optional

router = APIRouter()

@router.get("/")
def get_threats(
    severity: Optional[str] = Query(None, description="Filter by severity (low, medium, high)"),
    threat_type: Optional[str] = Query(None, description="Filter by type (ip, domain)"),
    limit: int = Query(100, description="Maximum number of results"),
    skip: int = Query(0, description="Number of results to skip")
):
    """Get threats with optional filtering"""
    filters = {}
    if severity:
        filters["severity"] = severity.lower()
    if threat_type:
        filters["type"] = threat_type.lower()
    
    threats = threat_model.get_threats(filters=filters, limit=limit, skip=skip)
    # Remove MongoDB _id for cleaner JSON
    for threat in threats:
        threat.pop("_id", None)
    return threats

@router.get("/history/{indicator}")
def get_threat_history(indicator: str, threat_type: str = Query(..., description="Type of indicator (ip or domain)")):
    """Get historical data for a specific indicator"""
    threat = threat_model.get_threat_history(indicator, threat_type.lower())
    if not threat:
        raise HTTPException(status_code=404, detail="Threat not found")
    return threat

@router.post("/fetch")
def fetch_threats():
    return fetch_and_store_threats()
