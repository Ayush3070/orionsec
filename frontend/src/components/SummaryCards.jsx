import React, { useMemo } from "react";

function severityCounts(threats) {
  const counts = { high: 0, medium: 0, low: 0 };
  for (const t of threats) {
    const s = String(t.severity || "").toLowerCase();
    if (s === "high" || s === "medium" || s === "low") counts[s] += 1;
  }
  return counts;
}

function Card({ label, value, tone }) {
  const toneMap = {
    high: "border-red-500/30 bg-red-500/10 text-red-200",
    medium: "border-yellow-500/30 bg-yellow-500/10 text-yellow-100",
    low: "border-emerald-500/30 bg-emerald-500/10 text-emerald-100",
  };

  return (
    <div className={`rounded-2xl border px-4 py-3 shadow-glow ${toneMap[tone]}`}>
      <div className="text-xs font-semibold uppercase tracking-wider text-white/70">{label}</div>
      <div className="mt-2 text-3xl font-bold text-white">{value}</div>
    </div>
  );
}

export default function SummaryCards({ threats }) {
  const counts = useMemo(() => severityCounts(threats), [threats]);
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <Card label="High" value={counts.high} tone="high" />
      <Card label="Medium" value={counts.medium} tone="medium" />
      <Card label="Low" value={counts.low} tone="low" />
    </div>
  );
}

