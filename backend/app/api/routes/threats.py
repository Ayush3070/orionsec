from fastapi import APIRouter
from app.core.database import threat_collection
from app.services.fetch_services import fetch_and_store_threats


router = APIRouter()

@router.get("/")
def get_threats():
    data = list(threat_collection.find({}, {"_id": 0}))
    return data

@router.post("/fetch")
def fetch_threats():
    return fetch_and_store_threats()
