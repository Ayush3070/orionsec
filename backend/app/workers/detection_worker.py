import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from app.services.detection_service import scan_files, scan_logs
from app.core.config import settings
from datetime import datetime
import httpx

async def process_file_queue():
    client = AsyncIOMotorClient(settings.MONGO_URL)
    db = client[settings.MONGO_DB]
    
    while True:
        try:
            file_to_process = await db.file_queue.find_one_and_update(
                {"status": "pending"},
                {"$set": {"status": "processing", "started_at": datetime.utcnow()}}
            )
            
            if not file_to_process:
                await asyncio.sleep(5)
                continue
            
            filename = file_to_process.get("filename")
            content = file_to_process.get("content")
            
            threats = await scan_files(filename, content)
            
            await db.scan_results.insert_one({
                "file_id": file_to_process["_id"],
                "filename": filename,
                "threats": threats,
                "threat_count": len(threats),
                "scanned_at": datetime.utcnow()
            })
            
            await db.file_queue.update_one(
                {"_id": file_to_process["_id"]},
                {"$set": {"status": "completed", "completed_at": datetime.utcnow()}}
            )
            
        except Exception as e:
            print(f"Error processing file: {e}")
            if file_to_process:
                await db.file_queue.update_one(
                    {"_id": file_to_process["_id"]},
                    {"$set": {"status": "failed", "error": str(e)}}
                )
            await asyncio.sleep(5)

if __name__ == "__main__":
    asyncio.run(process_file_queue())
