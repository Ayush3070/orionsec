import { clampScore, severityFromConfidence } from "./normalization.js";
import { fetchAbuseIPDB } from "./intel_sources/abuseipdb.js";
import { fetchOTX } from "./intel_sources/otx.js";
import { fetchMockSource } from "./intel_sources/mock_source.js";
import { getCachedIntel, setCachedIntel } from "./cache.js";

function overallFromSources(sources) {
  // Define weights and reliability factors for each source
  const sourceConfig = {
    AbuseIPDB: { weight: 0.5, reliability: 0.9 },
    OTX: { weight: 0.3, reliability: 0.8 },
    MockSource: { weight: 0.2, reliability: 0.5 } // Lower reliability for mock source
  };

  let total = 0;
  let weightSum = 0;
  const sourceDetails = [];

  for (const s of sources) {
    const config = sourceConfig[s.name] || { weight: 0.2, reliability: 0.5 };
    const weightedConfidence = clampScore(s.confidence ?? 0) * config.reliability;
    total += weightedConfidence * config.weight;
    weightSum += config.weight;
    
    // Collect source details for explanation
    sourceDetails.push({
      name: s.name,
      confidence: clampScore(s.confidence ?? 0),
      weight: config.weight,
      reliability: config.reliability,
      weightedScore: weightedConfidence * config.weight
    });
  }
  
  if (weightSum === 0) return { score: 0, details: [] };
  
  const finalScore = clampScore(total / weightSum);
  return { score: finalScore, details: sourceDetails };
}

export async function enrichIndicator({ indicator, type }) {
  const ttlSeconds = Number(process.env.CACHE_TTL_SECONDS || 900);

  const cached = await getCachedIntel({ indicator, type });
  if (cached) return { ...cached, cached: true };

  const sources = [];
  const sourceErrors = [];

  const calls = [
    fetchAbuseIPDB({ indicator, type }).then(result => ({ result, source: 'AbuseIPDB' })).catch(error => ({ error, source: 'AbuseIPDB' })),
    fetchOTX({ indicator, type }).then(result => ({ result, source: 'OTX' })).catch(error => ({ error, source: 'OTX' })),
    fetchMockSource({ indicator, type }).then(result => ({ result, source: 'MockSource' })).catch(error => ({ error, source: 'MockSource' }))
  ];

  const results = await Promise.allSettled(calls);
  for (const result of results) {
    if (result.status === "fulfilled") {
      const { result: sourceResult, source } = result.value;
      if (sourceResult) {
        sources.push(sourceResult);
      }
    } else {
      // Handle rejected promises
      const { reason, source } = result.reason;
      sourceErrors.push({
        source,
        message: reason?.message || "Source request failed"
      });
    }
  }

  // Deduplicate by source name (defensive).
  const deduped = [];
  const seen = new Set();
  for (const s of sources) {
    if (!s?.name || seen.has(s.name)) continue;
    seen.add(s.name);
    deduped.push(s);
  }

  const { overall_score, sourceDetails } = overallFromSources(deduped);
  
  // Generate explanation
  const explanation = generateExplanation(deduped, sourceDetails, overall_score, sourceErrors);

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
      if (s.name === "MockSource") return { ...base, mock: true };
      return base;
    }),
    overall_score,
    errors: sourceErrors,
    explanation
  };

  await setCachedIntel({ indicator, type, value, ttlSeconds });
  return { ...value, cached: false };
}

function generateExplanation(sources, sourceDetails, overall_score, sourceErrors) {
  if (sources.length === 0 && sourceErrors.length === 0) {
    return "No intelligence sources available";
  }
  
  if (sources.length === 0) {
    return `All sources failed: ${sourceErrors.map(e => `${e.source}: ${e.message}`).join('; ')}`;
  }
  
  const severity = overall_score >= 80 ? 'high' : overall_score >= 50 ? 'medium' : 'low';
  
  let explanation = `Threat score ${overall_score} (${severity}) based on `;
  
  if (sources.length === 1) {
    explanation += `1 source (${sources[0].name})`;
  } else {
    explanation += `${sources.length} sources: ${sources.map(s => s.name).join(', ')}`;
  }
  
  if (sourceErrors.length > 0) {
    explanation += `; ${sourceErrors.length} source(s) failed`;
  }
  
  // Add weighting details if we have multiple sources
  if (sources.length > 1) {
    explanation += `. Weighted contributions: `;
    const contributions = sourceDetails
      .map(detail => `${detail.name}: ${detail.weightedScore.toFixed(1)} (weight=${detail.weight}, reliability=${detail.reliability})`)
      .join('; ');
    explanation += contributions;
  }
  
  return explanation;
}

