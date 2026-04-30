export function severityFromConfidence(confidence) {
  const c = Number(confidence) || 0;
  if (c >= 80) return "high";
  if (c >= 50) return "medium";
  return "low";
}

export function clampScore(score) {
  const s = Number(score);
  if (Number.isNaN(s)) return 0;
  return Math.max(0, Math.min(100, Math.round(s)));
}

export function normalizeIndicator(raw) {
  const indicator = String(raw || "").trim();
  if (!indicator) return { ok: false, error: "indicator is required" };

  const ipV4 =
    /^(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|1?\d?\d)$/;
  const domain =
    /^(?=.{1,253}$)(?!-)(?:[a-zA-Z0-9-]{1,63}\.)+[a-zA-Z]{2,63}$/;

  if (ipV4.test(indicator)) return { ok: true, indicator, type: "ip" };
  if (domain.test(indicator)) return { ok: true, indicator, type: "domain" };

  return { ok: false, error: "Unsupported indicator type (expected IPv4 or domain)" };
}

