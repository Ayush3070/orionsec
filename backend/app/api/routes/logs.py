from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

router = APIRouter()

class LogEntry(BaseModel):
    timestamp: Optional[str] = None
    level: str
    message: str
    source: Optional[str] = None

class LogAnalysisRequest(BaseModel):
    logs: List[LogEntry]
    detect_bruteforce: bool = True

class ThreatFinding(BaseModel):
    issue: str
    severity: str
    line: Optional[int] = None
    weight: int
    indicator: Optional[str] = None

@router.post("/analyze")
async def analyze_logs(request: LogAnalysisRequest):
    from app.services.detection_service import analyze_logs
    from collections import Counter
    
    results = await analyze_logs(request.logs)
    
    brute_force_ips = []
    if request.detect_bruteforce:
        failed_logs = [log for log in request.logs if 'failed' in log.level.lower() or 'error' in log.message.lower()]
        ip_pattern = r'\b(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b'
        
        for log in failed_logs:
            import re
            ips = re.findall(ip_pattern, log.message)
            brute_force_ips.extend(ips)
        
        ip_counts = Counter(brute_force_ips)
        for ip, count in ip_counts.items():
            if count >= 5:
                results.append({
                    "issue": f"Possible brute force: {count} failed attempts from {ip}",
                    "severity": "high",
                    "weight": count * 2,
                    "indicator": ip,
                    "line": None
                })
    
    severity_counts = {"high": 0, "medium": 0, "low": 0}
    for r in results:
        sev = r.get("severity", "low").lower()
        if sev in severity_counts:
            severity_counts[sev] += 1
    
    return {
        "threats": results,
        "summary": {
            "total_threats": len(results),
            "severity_counts": severity_counts,
            "logs_analyzed": len(request.logs)
        }
    }
