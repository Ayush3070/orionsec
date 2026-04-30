import { clampScore } from "./normalization.js";
import { fetchAbuseIPDB } from "./intel_sources/abuseipdb.js";
import { fetchOTX } from "./intel_sources/otx.js";
import { getCachedIntel, setCachedIntel } from "./cache.js";

function overallFromSources(sources) {
  const weights = {
    AbuseIPDB: 0.6,
    OTX: 0.4,
  };

  let total = 0;
  let weightSum = 0;
  for (const s of sources) {
    const w = weights[s.name] ?? 0.3;
    const c = clampScore(s.confidence ?? 0);
    total += c * w;
    weightSum += w;
  }
  if (weightSum === 0) return 0;
  return clampScore(total / weightSum);
}

export async function enrichIndicator({ indicator, type }) {
  const ttlSeconds = Number(process.env.CACHE_TTL_SECONDS || 900);

  const cached = await getCachedIntel({ indicator, type });
  if (cached) return { ...cached, cached: true };

  const sources = [];
  const errors = [];

  const calls = [
    fetchAbuseIPDB({ indicator, type }),
    fetchOTX({ indicator, type }),
  ];

  const results = await Promise.allSettled(calls);
  for (const r of results) {
    if (r.status === "fulfilled" && r.value) sources.push(r.value);
    if (r.status === "rejected") errors.push(r.reason?.message || "Source request failed");
  }

  // Deduplicate by source name (defensive).
  const deduped = [];
  const seen = new Set();
  for (const s of sources) {
    if (!s?.name || seen.has(s.name)) continue;
    seen.add(s.name);
    deduped.push(s);
  }

  const overall_score = overallFromSources(deduped);

  const value = {
    indicator,
    type,
    sources: deduped.map((s) => {
      const base = {
        name: s.name,
        confidence: clampScore(s.confidence ?? 0),
        severity: s.severity,
        details: s.details,
      };
      if (s.name === "OTX") return { ...base, pulses: s.pulses ?? 0 };
      return base;
    }),
    overall_score,
    errors,
  };

  await setCachedIntel({ indicator, type, value, ttlSeconds });
  return { ...value, cached: false };
}

