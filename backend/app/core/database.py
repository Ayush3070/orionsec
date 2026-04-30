from pymongo import MongoClient

MONGO_URL = "mongodb://localhost:27017/"

client = MongoClient(MONGO_URL)

db = client["threat_db"]

# Keep the original collection for backward compatibility
threat_collection = db["ips"]

# Initialize the new threat model
from app.models.threat_model import threat_model