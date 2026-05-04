from typing import List

def generate_insights(threats: List[dict]) -> List[str]:
    insights = []
    
    if not threats:
        return insights
    
    high_sev = sum(1 for t in threats if t.get('severity') == 'high')
    medium_sev = sum(1 for t in threats if t.get('severity') == 'medium')
    
    if high_sev > 5:
        insights.append(f"Critical Alert: {high_sev} high-severity threats require immediate attention")
    elif high_sev > 0:
        insights.append(f"Warning: {high_sev} high-severity threat(s) detected")
    
    brute_force = [t for t in threats if 'brute' in t.get('issue', '').lower()]
    if brute_force:
        ips = set(t.get('indicator') for t in brute_force if t.get('indicator'))
        insights.append(f"Brute force attack detected from {len(ips)} unique IP(s)")
    
    sql_inj = [t for t in threats if 'sql' in t.get('issue', '').lower()]
    if sql_inj:
        insights.append(f"SQL injection attempts detected - {len(sql_inj)} occurrence(s)")
    
    api_keys = [t for t in threats if 'api' in t.get('issue', '').lower() or 'key' in t.get('issue', '').lower()]
    if api_keys:
        insights.append("Sensitive data exposure: API keys or secrets detected in logs")
    
    malware = [t for t in threats if 'malware' in t.get('issue', '').lower() or 'virus' in t.get('issue', '').lower()]
    if malware:
        insights.append(f"Malware activity detected - {len(malware)} indicator(s)")
    
    ddos = [t for t in threats if 'dos' in t.get('issue', '').lower() or 'flood' in t.get('issue', '').lower()]
    if ddos:
        insights.append("DDoS attack patterns detected - consider rate limiting")
    
    if medium_sev > 10:
        insights.append(f"High activity: {medium_sev} medium-severity events logged")
    
    unique_ips = set(t.get('indicator') for t in threats if t.get('indicator') and ':' not in str(t.get('indicator')))
    if len(unique_ips) > 5:
        insights.append(f"Multiple threat sources: {len(unique_ips)} unique IPs/domains flagged")
    
    return insights[:10]  # Limit to top 10 insights
