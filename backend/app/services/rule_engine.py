import json
import re
import os
from dataclasses import dataclass
from typing import List, Dict, Any

@dataclass
class Rule:
    id: str
    pattern: str
    issue: str
    severity: str
    weight: int
    description: str

@dataclass
class ThreatFinding:
    file: str
    issue: str
    severity: str
    line: int
    weight: int

class RuleEngine:
    def __init__(self, rules_file: str = None):
        if rules_file is None:
            rules_file = os.path.join(os.path.dirname(__file__), 'rules', 'detection_rules.json')
        self.rules = self._load_rules(rules_file)
        self.thresholds = self._load_thresholds(rules_file)
        self.bruteforce_threshold = self._load_bruteforce_threshold(rules_file)
    
    def _load_rules(self, rules_file: str) -> List[Rule]:
        try:
            with open(rules_file, 'r') as f:
                data = json.load(f)
            rules = []
            for rule_data in data.get('rules', []):
                rules.append(Rule(
                    id=rule_data['id'],
                    pattern=rule_data['pattern'],
                    issue=rule_data['issue'],
                    severity=rule_data['severity'],
                    weight=rule_data['weight'],
                    description=rule_data['description']
                ))
            return rules
        except Exception as e:
            print(f"Error loading rules: {e}")
            return []
    
    def _load_thresholds(self, rules_file: str) -> Dict[str, int]:
        try:
            with open(rules_file, 'r') as f:
                data = json.load(f)
            return data.get('thresholds', {'high': 25, 'medium': 10, 'low': 0})
        except:
            return {'high': 25, 'medium': 10, 'low': 0}
    
    def _load_bruteforce_threshold(self, rules_file: str) -> int:
        try:
            with open(rules_file, 'r') as f:
                data = json.load(f)
            return data.get('bruteforce_threshold', 5)
        except:
            return 5
    
    def scan_content(self, filename: str, content: str) -> List[ThreatFinding]:
        threats = []
        lines = content.splitlines()
        
        for line_num, line in enumerate(lines, start=1):
            for rule in self.rules:
                try:
                    if re.search(rule.pattern, line, re.IGNORECASE):
                        threats.append(ThreatFinding(
                            file=filename,
                            issue=rule.issue,
                            severity=rule.severity,
                            line=line_num,
                            weight=rule.weight
                        ))
                except:
                    pass
        
        brute_force_threats = self._detect_brute_force(lines, filename)
        threats.extend(brute_force_threats)
        
        return threats
    
    def _detect_brute_force(self, lines: List[str], filename: str) -> List[ThreatFinding]:
        from collections import Counter
        failed_ips = []
        ip_pattern = r'\b(?:\d{1,3}\.){3}\d{1,3}\b'
        
        for line in lines:
            if re.search(r'failed.*login|authentication.*failed', line, re.IGNORECASE):
                ips = re.findall(ip_pattern, line)
                failed_ips.extend(ips)
        
        ip_counts = Counter(failed_ips)
        threats = []
        
        for ip, count in ip_counts.items():
            if count >= self.bruteforce_threshold:
                threats.append(ThreatFinding(
                    file=filename,
                    issue=f"Possible brute force: {count} failed attempts from {ip}",
                    severity="high",
                    line=0,
                    weight=count * 2
                ))
        
        return threats

rule_engine = RuleEngine()

def scan_file_with_rules(file_path: str) -> Dict[str, Any]:
    return rule_engine.process_file(file_path)

def scan_content_with_rules(filename: str, content: str) -> List[ThreatFinding]:
    return rule_engine.scan_content(filename, content)
