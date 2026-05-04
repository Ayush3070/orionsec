from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()

class LogScanRequest(BaseModel):
    logs: str

@router.post("/upload")
async def scan_uploaded_files(
    files: List[UploadFile] = File(...),
    enrich: bool = Form(True)
):
    if not files:
        raise HTTPException(status_code=400, detail="No files provided")
    
    results = []
    for file in files:
        content = await file.read()
        try:
            text_content = content.decode('utf-8', errors='ignore')
            from app.services.detection_service import scan_files
            threats = await scan_files(file.filename, text_content)
            results.append({
                "filename": file.filename,
                "threats": threats,
                "threat_count": len(threats)
            })
        except Exception as e:
            results.append({
                "filename": file.filename,
                "error": str(e),
                "threats": []
            })
    
    total_threats = sum(r.get('threat_count', 0) for r in results)
    return {
        "results": results,
        "summary": {
            "files_scanned": len(files),
            "total_threats": total_threats,
        }
    }

@router.post("/logs")
async def scan_logs_endpoint(request: LogScanRequest):
    if not request.logs or not request.logs.strip():
        raise HTTPException(status_code=400, detail="No logs provided")
    
    from app.services.detection_service import scan_logs
    threats = await scan_logs(request.logs)
    
    from app.utils.insights import generate_insights
    insights = generate_insights(threats)
    
    return {
        "threats": threats,
        "insights": insights,
        "summary": {
            "threat_count": len(threats),
        }
    }
