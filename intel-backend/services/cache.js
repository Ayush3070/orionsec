import { getDb } from "../db.js";
import { severityFromConfidence } from "./normalization.js";

const memoryCache = new Map();

function nowMs() {
  return Date.now();
}

function cacheKey(type, indicator) {
  return `${type}:${indicator}`;
}

/**
 * Calculate TTL based on severity
 * High severity threats get shorter TTL (more frequent updates)
 * Low severity threats get longer TTL (less frequent updates)
 */
function calculateTTLBySeverity(confidence) {
  const baseTTL = Number(process.env.CACHE_TTL_SECONDS || 900); // 15 minutes default
  
  // Higher confidence = shorter TTL
  if (confidence >= 80) {
    return Math.max(60, baseTTL * 0.25); // 15 min * 0.25 = ~4 minutes minimum
  } else if (confidence >= 50) {
    return Math.max(60, baseTTL * 0.5); // 15 min * 0.5 = ~7.5 minutes minimum
  } else {
    return baseTTL; // Full TTL for low confidence
  }
}

export async function getCachedIntel({ indicator, type }) {
  const key = cacheKey(type, indicator);
  const entry = memoryCache.get(key);
  if (entry && entry.expiresAtMs > nowMs()) return entry.value;

  const db = await getDb();
  const doc = await db.collection("intel_cache").findOne(
    { indicator, type },
    { projection: { _id: 0, value: 1, expiresAt: 1 } }
  );
  if (!doc) return null;
  const expiresAtMs = new Date(doc.expiresAt).getTime();
  if (expiresAtMs <= nowMs()) return null;

  memoryCache.set(key, { value: doc.value, expiresAtMs });
  return doc.value;
}

export async function setCachedIntel({ indicator, type, value, ttlSeconds }) {
  // If ttlSeconds is not provided, calculate based on severity
  let finalTTL = ttlSeconds;
  if (!ttlSeconds && value && value.overall_score !== undefined) {
    finalTTL = calculateTTLBySeverity(value.overall_score);
  } else if (!ttlSeconds) {
    finalTTL = Number(process.env.CACHE_TTL_SECONDS || 900);
  }
  
  const key = cacheKey(type, indicator);
  const expiresAtMs = nowMs() + finalTTL * 1000;
  memoryCache.set(key, { value, expiresAtMs });

  const db = await getDb();
  const expiresAt = new Date(expiresAtMs);

  await db.collection("intel_cache").updateOne(
    { indicator, type },
    {
      $set: {
        indicator,
        type,
        value,
        expiresAt,
        updatedAt: new Date(),
      },
      $setOnInsert: { createdAt: new Date() },
    },
    { upsert: true }
  );

  // Ensure TTL index exists (idempotent).
  // MongoDB TTL requires a Date field and expireAfterSeconds=0.
  await db.collection("intel_cache").createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
}

