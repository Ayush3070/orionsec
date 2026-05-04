import asyncio
from app.services.fetch_services import fetch_all_sources
from datetime import datetime
import time

async def scheduled_fetch():
    while True:
        try:
            print(f"[{datetime.utcnow()}] Starting scheduled threat fetch...")
            result = await fetch_all_sources()
            print(f"Fetch completed: {result}")
        except Exception as e:
            print(f"Error in scheduled fetch: {e}")
        
        await asyncio.sleep(600)

async def fetch_worker():
    print("Fetch worker started")
    await scheduled_fetch()

if __name__ == "__main__":
    asyncio.run(fetch_worker())
