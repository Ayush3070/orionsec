import re
from typing import List, Dict, Optional


def parse_log_line(line: str) -> Optional[Dict]:
    ip_pattern = r'\b(?:\d{1,3}\.){3}\d{1,3}\b'
    timestamp_patterns = [
        r'\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}'
        r'(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})?',
        r'\w{3}\s+\d{1,2}\s+\d{2}:\d{2}:\d{2}',
    ]

    timestamp = None
    for pattern in timestamp_patterns:
        match = re.search(pattern, line)
        if match:
            timestamp = match.group(0)
            break

    ip_matches = re.findall(ip_pattern, line)

    level = "INFO"
    if re.search(r'error|fail|exception|critical', line, re.IGNORECASE):
        level = "ERROR"
    elif re.search(r'warn', line, re.IGNORECASE):
        level = "WARN"

    return {
        "timestamp": timestamp,
        "level": level,
        "message": line.strip(),
        "ips": ip_matches
    }


def parse_log_file(content: str) -> List[Dict]:
    lines = content.splitlines()
    parsed = []
    for line in lines:
        if line.strip():
            entry = parse_log_line(line)
            if entry:
                parsed.append(entry)
    return parsed


def extract_ips(text: str) -> List[str]:
    ip_pattern = r'\b(?:\d{1,3}\.){3}\d{1,3}\b'
    return re.findall(ip_pattern, text)


def extract_domains(text: str) -> List[str]:
    domain_pattern = r'\b(?:[a-zA-Z0-9-]{1,63}\.)+[a-zA-Z]{2,63}\b'
    return re.findall(domain_pattern, text)
