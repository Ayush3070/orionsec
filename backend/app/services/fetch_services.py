import requests
from app.core.database import threat_collection

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