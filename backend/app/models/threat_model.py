from app.core.database import db
from datetime import datetime, timedelta


class ThreatModel:
    def __init__(self):
        self.collection = db.threats

    async def create_indexes(self):
        idx = [("indicator", 1), ("type", 1)]
        await self.collection.create_index(idx, unique=True)
        await self.collection.create_index([("last_seen", -1)])
        await self.collection.create_index([("severity", 1)])

    async def save_threat(self, threat_data):
        indicator = threat_data.get("indicator")
        threat_type = threat_data.get("type")

        if not indicator or not threat_type:
            raise ValueError("Indicator and type are required")

        now = datetime.utcnow()

        update_doc = {
            "$set": {
                "issue": threat_data.get("issue", ""),
                "severity": threat_data.get("severity", "low"),
                "confidence": threat_data.get("confidence", 0),
                "source": threat_data.get("source", ""),
                "last_seen": now,
                "updated_at": now
            },
            "$setOnInsert": {
                "first_seen": now,
                "created_at": now
            },
            "$inc": {
                "detection_count": 1
            }
        }

        await self.collection.update_one(
            {"indicator": indicator, "type": threat_type},
            update_doc,
            upsert=True
        )

        return await self.collection.find_one(
            {"indicator": indicator, "type": threat_type})

    async def get_threat(self, indicator, threat_type):
        return await self.collection.find_one(
            {"indicator": indicator, "type": threat_type})

    async def get_threats(self, filters=None, limit=100, skip=0):
        query = filters or {}
        cursor = self.collection.find(query).sort(
            "last_seen", -1)
        cursor = cursor.skip(skip).limit(limit)
        return await cursor.to_list(length=limit)

    async def get_threat_history(self, indicator, threat_type):
        threat = await self.get_threat(indicator, threat_type)
        if threat:
            return {
                "indicator": threat["indicator"],
                "type": threat["type"],
                "issue": threat["issue"],
                "severity": threat["severity"],
                "confidence": threat["confidence"],
                "source": threat["source"],
                "first_seen": threat.get("first_seen"),
                "last_seen": threat.get("last_seen"),
                "detection_count": threat.get("detection_count", 0)
            }
        return None

    async def delete_old_threats(self, days=30):
        cutoff_date = datetime.utcnow() - timedelta(days=days)
        query = {"last_seen": {"$lt": cutoff_date}}
        result = await self.collection.delete_many(query)
        return result.deleted_count


threat_model = ThreatModel()
