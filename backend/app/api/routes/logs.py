from fastapi import APIRouter
from pydantic import BaseModel
from app.services.detection_service import detect_threats_from_logs

router = APIRouter()

class LogInput(BaseModel):
    ips: list[str]

@router.post("/analyze")
def analyze_logs(log: LogInput):
    alerts = detect_threats_from_logs(log.ips)
    return {"alerts": alerts}
