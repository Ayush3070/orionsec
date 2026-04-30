import { clampScore, severityFromConfidence } from "../normalization.js";

export async function fetchAbuseIPDB({ indicator, type }) {
  if (type !== "ip") return null;

  const apiKey = process.env.ABUSEIPDB_API_KEY;
  if (!apiKey) throw new Error("ABUSEIPDB_API_KEY is required");

  const url = new URL("https://api.abuseipdb.com/api/v2/check");
  url.searchParams.set("ipAddress", indicator);
  url.searchParams.set("maxAgeInDays", "90");
  url.searchParams.set("verbose", "true");

  const res = await fetch(url, {
    headers: {
      Key: apiKey,
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    const msg = body || `AbuseIPDB request failed (${res.status})`;
    throw new Error(msg);
  }

  const json = await res.json();
  const data = json?.data;
  const confidence = clampScore(data?.abuseConfidenceScore ?? 0);

  return {
    name: "AbuseIPDB",
    confidence,
    severity: severityFromConfidence(confidence),
    details: data?.totalReports
      ? `Reported ${data.totalReports} time(s) in last ${data.numDistinctUsers ?? "?"} user(s).`
      : "No recent reports found.",
    raw: {
      isPublic: data?.isPublic,
      countryCode: data?.countryCode,
      isp: data?.isp,
      usageType: data?.usageType,
      domain: data?.domain,
      lastReportedAt: data?.lastReportedAt,
    },
  };
}

