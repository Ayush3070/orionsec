/**
 * Lightweight client-side code vulnerability detector
 * Scans code strings for common security issues
 */

const CODE_RULES = [
  {
    id: 'CODE-001',
    pattern: /eval\s*\(/g,
    issue: 'Use of eval() - potential code injection',
    severity: 'high',
    weight: 15
  },
  {
    id: 'CODE-002',
    pattern: /(API_KEY|SECRET_KEY|ACCESS_TOKEN|CLIENT_SECRET)\s*=\s*["\']?[\w\-]+["\']?/gi,
    issue: 'Hardcoded API key or secret detected',
    severity: 'high',
    weight: 20
  },
  {
    id: 'CODE-003',
    pattern: /password\s*=\s*["\']?[^"\')\s]{3,}["\']?/gi,
    issue: 'Hardcoded password detected',
    severity: 'high',
    weight: 18
  },
  {
    id: 'CODE-004',
    pattern: /exec\s*\(|spawn\s*\(|fork\s*\(/g,
    issue: 'Potential command execution - exec/spawn/fork',
    severity: 'high',
    weight: 15
  },
  {
    id: 'CODE-005',
    pattern: /require\s*\(\s*['\"]child_process['\"]\s*\)/g,
    issue: 'Child process module imported - potential RCE',
    severity: 'high',
    weight: 12
  },
  {
    id: 'CODE-006',
    pattern: /SQL\s*(SELECT|INSERT|UPDATE|DELETE)\s.*\+.*\$\w+/gi,
    issue: 'Possible SQL injection - string concatenation',
    severity: 'high',
    weight: 15
  },
  {
    id: 'CODE-007',
    pattern: /(innerHTML|outerHTML)\s*=\s*.*\+/g,
    issue: 'Potential XSS - innerHTML/outerHTML with concatenation',
    severity: 'medium',
    weight: 10
  },
  {
    id: 'CODE-008',
    pattern: /localStorage\.setItem\s*\([^,]+,\s*.*password/i,
    issue: 'Sensitive data stored in localStorage',
    severity: 'medium',
    weight: 8
  },
  {
    id: 'CODE-009',
    pattern: /(md5|sha1|des)\s*\(/gi,
    issue: 'Weak cryptographic algorithm detected',
    severity: 'medium',
    weight: 8
  },
  {
    id: 'CODE-010',
    pattern: /(INSERT|UPDATE|DELETE)\s+INTO|FROM\s+.*WHERE\s+.*=.*\{/gi,
    issue: 'ORM/Query injection vulnerability',
    severity: 'high',
    weight: 15
  }
];

export function detectCodeVulnerabilities(codeString, filename = 'code') {
  const threats = [];
  const lines = codeString.split('\n');
  
  lines.forEach((line, index) => {
    CODE_RULES.forEach(rule => {
      const regex = new RegExp(rule.pattern.source, rule.pattern.flags);
      if (regex.test(line)) {
        threats.push({
          file: filename,
          issue: rule.issue,
          severity: rule.severity,
          line: index + 1,
          weight: rule.weight,
          type: 'code',
          ruleId: rule.id
        });
      }
    });
  });
  
  return threats;
}

export function scanCodebase(files) {
  const allThreats = [];
  
  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      const threats = detectCodeVulnerabilities(content, file.name);
      allThreats.push(...threats);
    };
    reader.readAsText(file);
  });
  
  return allThreats;
}
