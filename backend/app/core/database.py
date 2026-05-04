from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

client = None
db = None

async def init_db():
    global client, db
    try:
        client = AsyncIOMotorClient(settings.MONGO_URL)
        db = client[settings.MONGO_DB]
        await client.admin.command('ping')
        print(f"Connected to MongoDB: {settings.MONGO_DB}")
        
        await create_indexes()
    except Exception as e:
        print(f"Failed to connect to MongoDB: {e}")
        raise

async def create_indexes():
    threats_col = db.threats
    await threats_col.create_index([("indicator", 1), ("type", 1)], unique=True)
    await threats_col.create_index([("last_seen", -1)])
    await threats_col.create_index([("severity", 1)])
    
    intel_cache_col = db.intel_cache
    await intel_cache_col.create_index([("expiresAt", 1)], expireAfterSeconds=0)

def get_db():
    return db
