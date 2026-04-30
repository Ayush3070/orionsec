from pymongo import MongoClient
from app.core.database import db
from datetime import datetime

# Threat model for storing threat intelligence and detection results
class ThreatModel:
    def __init__(self):
        self.collection = db["threats"]
    
    def create_indexes(self):
        """Create indexes for efficient querying"""
        # Compound index for fast lookups
        self.collection.create_index([("indicator", 1), ("type", 1)], unique=True)
        # Index for time-based queries
        self.collection.create_index([("last_seen", -1)])
        # Index for severity-based queries
        self.collection.create_index([("severity", 1)])
    
    def save_threat(self, threat_data):
        """
        Save or update threat information
        Args:
            threat_data: dict with indicator, type, issue, severity, confidence, source
        Returns:
            dict: The saved threat document
        """
        indicator = threat_data.get("indicator")
        threat_type = threat_data.get("type")
        
        if not indicator or not threat_type:
            raise ValueError("Indicator and type are required")
        
        now = datetime.utcnow()
        
        # Prepare update document
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
        
        # Upsert the threat
        result = self.collection.update_one(
            {"indicator": indicator, "type": threat_type},
            update_doc,
            upsert=True
        )
        
        # Return the updated document
        return self.collection.find_one({"indicator": indicator, "type": threat_type})
    
    def get_threat(self, indicator, threat_type):
        """Get a specific threat by indicator and type"""
        return self.collection.find_one({"indicator": indicator, "type": threat_type})
    
    def get_threats(self, filters=None, limit=100, skip=0):
        """
        Get threats with optional filtering
        Args:
            filters: dict with filter criteria (severity, type, etc.)
            limit: maximum number of results
            skip: number of results to skip
        Returns:
            list: Matching threat documents
        """
        query = filters or {}
        cursor = self.collection.find(query).sort("last_seen", -1).skip(skip).limit(limit)
        return list(cursor)
    
    def get_threat_history(self, indicator, threat_type):
        """Get historical data for a specific threat"""
        # For now, we just return the current threat with its first/last seen times
        # In a more advanced implementation, we might have a separate history collection
        threat = self.get_threat(indicator, threat_type)
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
    
    def delete_old_threats(self, days=30):
        """Delete threats older than specified days"""
        from datetime import datetime, timedelta
        cutoff_date = datetime.utcnow() - timedelta(days=days)
        result = self.collection.delete_many({"last_seen": {"$lt": cutoff_date}})
        return result.deleted_count

# Create a singleton instance
threat_model = ThreatModel()