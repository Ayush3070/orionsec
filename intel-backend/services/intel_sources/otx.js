import { clampScore } from "../normalization.js";

function severityFromPulses(pulses) {
  const p = Number(pulses) || 0;
  if (p >= 10) return "high";
  if (p >= 3) return "medium";
  return "low";
}

export async function fetchOTX({ indicator, type }) {
  const apiKey = process.env.OTX_API_KEY;
  if (!apiKey) throw new Error("OTX_API_KEY is required");

  const otxType = type === "ip" ? "IPv4" : "domain";
  const url = `https://otx.alienvault.com/api/v1/indicators/${otxType}/${encodeURIComponent(indicator)}/general`;

  const res = await fetch(url, {
    headers: {
      "X-OTX-API-KEY": apiKey,
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    const msg = body || `OTX request failed (${res.status})`;
    throw new Error(msg);
  }

  const json = await res.json();
  const pulses = Number(json?.pulse_info?.count || 0);
  const confidence = clampScore(Math.min(100, pulses * 10));

  return {
    name: "OTX",
    pulses,
    confidence,
    severity: severityFromPulses(pulses),
    details: pulses > 0 ? `Referenced by ${pulses} OTX pulse(s).` : "No pulses referencing this indicator.",
    raw: {
      reputation: json?.reputation,
      geo: json?.geo,
      asn: json?.asn,
    },
  };
}

