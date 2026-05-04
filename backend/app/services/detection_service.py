import re
from typing import List, Dict, Any
from app.services.rule_engine import RuleEngine
from app.core.database import get_db

rule_engine = RuleEngine()

async def scan_files(filename: str, content: str) -> List[Dict[str, Any]]:
    threats = rule_engine.scan_content(filename, content)
    results = []
    for t in threats:
        results.append({
            "file": t.file,
            "issue": t.issue,
            "severity": t.severity,
            "line": t.line,
            "weight": t.weight
        })
    return results

async def scan_logs(logs: str) -> List[Dict[str, Any]]:
    threats = rule_engine.scan_content("logs", logs)
    results = []
    for t in threats:
        results.append({
            "issue": t.issue,
            "severity": t.severity,
            "weight": t.weight,
            "indicator": extract_indicator(t.issue)
        })
    return results

async def analyze_logs(log_entries: List[Dict]) -> List[Dict[str, Any]]:
    results = []
    for entry in log_entries:
        message = entry.get("message", "")
        threats = rule_engine.scan_content("log", message)
        for t in threats:
            results.append({
                "issue": t.issue,
                "severity": t.severity,
                "weight": t.weight,
                "indicator": extract_indicator(t.issue),
                "timestamp": entry.get("timestamp")
            })
    return results

def extract_indicator(text: str) -> str:
    ip_pattern = r'\b(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b'
    match = re.search(ip_pattern, text)
    if match:
        return match.group(0)
    return ""
