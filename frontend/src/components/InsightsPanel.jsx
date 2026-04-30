import React from "react";

export default function InsightsPanel({ insights }) {
  return (
    <div className="rounded-2xl border border-stroke bg-panel p-4 shadow-glow">
      <div className="text-sm font-semibold text-white">Insights</div>
      <div className="mt-1 text-xs text-white/60">Lightweight intelligence derived from findings.</div>

      {insights.length === 0 ? (
        <div className="mt-3 rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-sm text-white/60">
          No notable insights yet.
        </div>
      ) : (
        <ul className="mt-3 space-y-2">
          {insights.map((msg, idx) => (
            <li key={`${msg}:${idx}`} className="rounded-xl border border-white/10 bg-black/20 px-3 py-3 text-sm text-white/85">
              {msg}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

