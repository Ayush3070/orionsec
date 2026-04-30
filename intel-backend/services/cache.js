import { getDb } from "../db.js";

const memoryCache = new Map();

function nowMs() {
  return Date.now();
}

function cacheKey(type, indicator) {
  return `${type}:${indicator}`;
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
  const key = cacheKey(type, indicator);
  const expiresAtMs = nowMs() + ttlSeconds * 1000;
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

