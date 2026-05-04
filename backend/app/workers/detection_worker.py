from motor.motor_asyncio import AsyncIOMotorClient
from app.services.detection_service import scan_files
from app.core.config import settings
from datetime import datetime
import asyncio


async def process_file_queue():
    client = AsyncIOMotorClient(settings.MONGO_URL)
    db = client[settings.MONGO_DB]

    while True:
        try:
            update = {
                "$set": {
                    "status": "processing",
                    "started_at": datetime.utcnow(),
                }
            }
            file_to_process = await db.file_queue.find_one_and_update(
                {"status": "pending"}, update
            )

            if not file_to_process:
                await asyncio.sleep(5)
                continue

            filename = file_to_process.get("filename")
            content = file_to_process.get("content")

            threats = await scan_files(filename, content)

            result_doc = {
                "file_id": file_to_process["_id"],
                "filename": filename,
                "threats": threats,
                "threat_count": len(threats),
                "scanned_at": datetime.utcnow(),
            }
            await db.scan_results.insert_one(result_doc)

            update = {
                "$set": {
                    "status": "completed",
                    "completed_at": datetime.utcnow(),
                }
            }
            await db.file_queue.update_one(
                {"_id": file_to_process["_id"]}, update
            )

        except Exception as e:
            print(f"Error processing file: {e}")
            if file_to_process:
                update = {
                    "$set": {
                        "status": "failed",
                        "error": str(e),
                    }
                }
                await db.file_queue.update_one(
                    {"_id": file_to_process["_id"]}, update
                )
            await asyncio.sleep(5)

if __name__ == "__main__":
    asyncio.run(process_file_queue())
