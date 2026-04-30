from collections import Counter
from app.core.database import threat_collection
from app.services.rule_engine import scan_content_with_rules, ThreatFinding

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

def scan_file_content(filename: str, content: str):
    """Scan file content using rule-based engine"""
    threats = scan_content_with_rules(filename, content)
    
    # Convert ThreatFinding objects to dictionaries
    threat_dicts = []
    for threat in threats:
        threat_dicts.append({
            "file": threat.file,
            "issue": threat.issue,
            "severity": threat.severity,
            "line": threat.line,
            "weight": threat.weight
        })
    
    return threat_dicts