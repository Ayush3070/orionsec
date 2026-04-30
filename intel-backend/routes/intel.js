import express from "express";
import { normalizeIndicator } from "../services/normalization.js";
import { enrichIndicator } from "../services/aggregator.js";

export const intelRouter = express.Router();

// Input validation functions
function validateIndicator(indicator) {
  if (!indicator || typeof indicator !== 'string') {
    return { valid: false, error: 'Indicator is required and must be a string' };
  }
  
  const trimmed = indicator.trim();
  if (!trimmed) {
    return { valid: false, error: 'Indicator cannot be empty or just whitespace' };
  }
  
  // Basic length validation
  if (trimmed.length > 255) {
    return { valid: false, error: 'Indicator is too long (max 255 characters)' };
  }
  
  return { valid: true, indicator: trimmed };
}

// Minimal in-memory rate limiting (per IP).
const windowMs = 60_000;
const maxPerWindow = 30;
const buckets = new Map();

function rateLimit(req, res, next) {
  const ip = req.ip || req.headers["x-forwarded-for"] || "unknown";
  const now = Date.now();
  const bucket = buckets.get(ip) || { resetAt: now + windowMs, count: 0 };
  if (now > bucket.resetAt) {
    bucket.resetAt = now + windowMs;
    bucket.count = 0;
  }
  bucket.count += 1;
  buckets.set(ip, bucket);

  if (bucket.count > maxPerWindow) {
    return res.status(429).json({ error: "rate_limited", message: "Too many requests. Try again shortly." });
  }
  return next();
}

// Simple CORS (optional).
intelRouter.use((req, res, next) => {
  const allowed = (process.env.CORS_ORIGIN || "").split(",").map((s) => s.trim()).filter(Boolean);
  const origin = req.headers.origin;
  if (origin && (allowed.length === 0 || allowed.includes(origin))) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  }
  if (req.method === "OPTIONS") return res.status(204).end();
  return next();
});

intelRouter.post("/scan", rateLimit, async (req, res) => {
  // Input validation
  const { indicator } = req.body || {};
  const validation = validateIndicator(indicator);
  if (!validation.valid) {
    return res.status(400).json({ error: "bad_request", message: validation.error });
  }
  
  const parsed = normalizeIndicator(validation.indicator);
  if (!parsed.ok) return res.status(400).json({ error: "bad_request", message: parsed.error });

  try {
    const enriched = await enrichIndicator({ indicator: parsed.indicator, type: parsed.type });
    return res.json(enriched);
  } catch (err) {
    return res.status(502).json({ error: "upstream_failed", message: err?.message || "Intel scan failed" });
  }
});

