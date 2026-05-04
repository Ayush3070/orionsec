export function deriveInsights(threats) {
  const insights = [];

  const failedLoginCount = threats.filter((t) => t.issue && String(t.issue).toLowerCase().includes("failed login")).length;
  if (failedLoginCount > 10) insights.push("Possible brute force attack detected");

  const apiKeyCount = threats.filter((t) => t.issue && String(t.issue).toLowerCase().includes("api key")).length;
  if (apiKeyCount > 1) insights.push("Sensitive data exposure risk");

  const highSev = threats.filter(t => t.severity === "high").length;
  if (highSev > 5) insights.push(`Critical: ${highSev} high-severity threats require immediate attention`);

  const malwareCount = threats.filter(t => t.issue && String(t.issue).toLowerCase().includes("malware")).length;
  if (malwareCount > 0) insights.push(`Malware reference detected: ${malwareCount} occurrence(s)`);

  return insights;
}
