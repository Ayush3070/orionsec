import json
import re
import os
from typing import List, Dict, Any
from dataclasses import dataclass
from app.core.database import threat_collection

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
            # Default to the rules file in the same directory
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
                rule = Rule(
                    id=rule_data['id'],
                    pattern=rule_data['pattern'],
                    issue=rule_data['issue'],
                    severity=rule_data['severity'],
                    weight=rule_data['weight'],
                    description=rule_data['description']
                )
                rules.append(rule)
            return rules
        except Exception as e:
            print(f"Error loading rules: {e}")
            return []
    
    def _load_thresholds(self, rules_file: str) -> Dict[str, int]:
        try:
            with open(rules_file, 'r') as f:
                data = json.load(f)
            return data.get('thresholds', {'high': 25, 'medium': 10, 'low': 0})
        except Exception as e:
            print(f"Error loading thresholds: {e}")
            return {'high': 25, 'medium': 10, 'low': 0}
    
    def _load_bruteforce_threshold(self, rules_file: str) -> int:
        try:
            with open(rules_file, 'r') as f:
                data = json.load(f)
            return data.get('bruteforce_threshold', 5)
        except Exception as e:
            print(f"Error loading bruteforce threshold: {e}")
            return 5
    
    def scan_content(self, filename: str, content: str) -> List[ThreatFinding]:
        """Scan content using rule-based engine"""
        threats = []
        lines = content.splitlines()
        
        # Apply each rule to each line
        for line_num, line in enumerate(lines, start=1):
            for rule in self.rules:
                try:
                    if re.search(rule.pattern, line):
                        threat = ThreatFinding(
                            file=filename,
                            issue=rule.issue,
                            severity=rule.severity,
                            line=line_num,
                            weight=rule.weight
                        )
                        threats.append(threat)
                except Exception as e:
                    print(f"Error applying rule {rule.id}: {e}")
        
        # Add brute force detection
        brute_force_threats = self._detect_brute_force(lines, filename)
        threats.extend(brute_force_threats)
        
        return threats
    
    def _detect_brute_force(self, lines: List[str], filename: str) -> List[ThreatFinding]:
        """Detect brute force attacks based on failed login attempts"""
        from collections import Counter
        
        failed_ips = []
        ip_pattern = r'\b(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b'
        
        for line in lines:
            if re.search(r'(?i)failed.*login', line):
                # Extract IP addresses from the line
                ips = re.findall(ip_pattern, line)
                failed_ips.extend(ips)
        
        ip_counts = Counter(failed_ips)
        threats = []
        
        for ip, count in ip_counts.items():
            if count >= self.bruteforce_threshold:
                threat = ThreatFinding(
                    file=filename,
                    issue=f"Possible brute force attack: {count} failed login attempts from {ip}",
                    severity="high",
                    line=0,  # Line number not applicable for aggregated threat
                    weight=count * 2  # Weight based on attempt count
                )
                threats.append(threat)
        
        return threats
    
    def calculate_severity(self, total_weight: int) -> str:
        """Calculate severity based on total weight and thresholds"""
        if total_weight >= self.thresholds['high']:
            return "high"
        elif total_weight >= self.thresholds['medium']:
            return "medium"
        else:
            return "low"
    
    def process_file(self, file_path: str) -> Dict[str, Any]:
        """Process a file and return threat analysis"""
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            
            threats = self.scan_content(file_path, content)
            
            # Group threats by issue type for reporting
            grouped_threats = {}
            total_weight = 0
            
            for threat in threats:
                key = (threat.file, threat.issue, threat.severity)
                if key not in grouped_threats:
                    grouped_threats[key] = {
                        'count': 0,
                        'lines': [],
                        'weight': 0
                    }
                
                grouped_threats[key]['count'] += 1
                grouped_threats[key]['lines'].append(threat.line)
                grouped_threats[key]['weight'] += threat.weight
                total_weight += threat.weight
            
            # Convert to list format
            findings = []
            for (file, issue, severity), data in grouped_threats.items():
                findings.append({
                    'file': file,
                    'issue': issue,
                    'severity': severity,
                    'count': data['count'],
                    'lines': sorted(list(set(data['lines']))),
                    'total_weight': data['weight']
                })
            
            # Determine overall severity
            overall_severity = self.calculate_severity(total_weight)
            
            return {
                'file': file_path,
                'threats': findings,
                'total_weight': total_weight,
                'overall_severity': overall_severity,
                'threat_count': len(findings)
            }
            
        except Exception as e:
            return {
                'error': f"Failed to process file {file_path}: {str(e)}",
                'threats': [],
                'total_weight': 0,
                'overall_severity': 'low',
                'threat_count': 0
            }

# Global instance for reuse
rule_engine = RuleEngine()

def scan_file_with_rules(file_path: str) -> Dict[str, Any]:
    """Convenience function to scan a file using the rule engine"""
    return rule_engine.process_file(file_path)

def scan_content_with_rules(filename: str, content: str) -> List[ThreatFinding]:
    """Convenience function to scan content using the rule engine"""
    return rule_engine.scan_content(filename, content)