import requests
import random
from app.core.database import threat_collection
from app.models.threat_model import threat_model

API_KEY = "b445b56ce0e7cdcb1e14a02cc034d3349054746aa0ac763b327b08154b5dc9b6d932596a863378c2"

URL = "https://api.abuseipdb.com/api/v2/blacklist"

HEADERS = {
    "Key": API_KEY,
    "Accept": "application/json"
}

def fetch_and_store_threats():
    response = requests.get(URL, headers=HEADERS)
    data = response.json()

    for ip in data["data"]:
        threat_collection.update_one(
            {"ip": ip["ipAddress"]},
            {
                "$set": {
                    "ip": ip["ipAddress"],
                    "score": ip["abuseConfidenceScore"]
                }
            },
            upsert=True
        )

    return {"status": "Threat data updated"}

    
def fetch_otx():
    import requests
    from app.core.database import threat_collection

    OTX_API_KEY = ""
    headers = {
        "X-OTX-API-KEY": OTX_API_KEY
    }

    url = "https://otx.alienvault.com/api/v1/pulses/subscribed"

    response = requests.get(url, headers=headers)
    data = response.json()

    for pulse in data.get("results", []):
        for indicator in pulse.get("indicators", []):
            if indicator.get("type") == "IPv4":
                ip = indicator.get("indicator")

                threat_collection.update_one(
                    {"ip": ip},
                    {
                        "$addToSet": {"sources": "otx"},
                        "$setOnInsert": {"score": 50}
                    },
                    upsert=True
                )


def fetch_mock_threats():
    """Mock threat fetching function for demonstration"""
    # Generate some mock IPs for demonstration
    mock_ips = [
        "192.168.1.100",
        "10.0.0.50", 
        "172.16.0.25",
        "203.0.113.9",
        "198.51.100.23"
    ]
    
    for ip in mock_ips:
        # Generate random threat score between 1-100
        score = random.randint(1, 100)
        
        # Store in both collections for compatibility
        threat_collection.update_one(
            {"ip": ip},
            {
                "$set": {
                    "ip": ip,
                    "score": score
                }
            },
            upsert=True
        )
        
        # Also store in the new threat model
        threat_model.save_threat({
            "indicator": ip,
            "type": "ip",
            "issue": f"Mock threat detected for IP {ip}",
            "severity": "high" if score > 80 else "medium" if score > 50 else "low",
            "confidence": score,
            "source": "MockSource"
        })
    
    return {"status": "Mock threat data updated"}

def fetch_and_store_all_threats():
    """Fetch threats from all sources"""
    fetch_and_store_threats()
    fetch_otx()
    fetch_mock_threats()
    
    return {"status": "All threat sources updated successfully"}