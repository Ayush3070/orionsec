from collections import Counter
from app.core.database import threat_collection

def detect_threats_from_logs(log_ips):
    alerts = []

    for ip in log_ips:
        result = threat_collection.find_one({"ip": ip})

        if result:
            score = result["score"]
            if score > 80:
                level = "HIGH"
            elif score > 50:
                level = "MEDIUM"
            else:
                level = "LOW"
        
            alerts.append({
                "ip": ip,
                "score": score,
                "level": level
            })

    return alerts

def detect_bruteforce(log_ips):
    counts = Counter(log_ips)

    suspicious = [
        {"ip": ip, "attempts": count}
        for ip, count in counts.items()
        if count> 5

    ]
    return suspicious