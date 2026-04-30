export function deriveInsights(threats) {
  const insights = [];

  const failedLoginCount = threats.filter((t) => t.issue && String(t.issue).toLowerCase().includes("failed login")).length;
  if (failedLoginCount > 10) insights.push("Possible brute force attack detected");

  const apiKeyCount = threats.filter((t) => t.issue && String(t.issue).toLowerCase().includes("api key")).length;
  if (apiKeyCount > 1) insights.push("Sensitive data exposure risk");

  return insights;
}

