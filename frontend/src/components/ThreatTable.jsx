import React, { useMemo, useState } from "react";

function Badge({ severity }) {
  const s = String(severity || "").toLowerCase();
  const map = {
    high: "bg-red-500/15 text-red-200 border-red-500/30",
    medium: "bg-yellow-500/15 text-yellow-100 border-yellow-500/30",
    low: "bg-emerald-500/15 text-emerald-100 border-emerald-500/30",
  };
  const cls = map[s] || "bg-white/5 text-white/70 border-white/10";
  return <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${cls}`}>{s || "unknown"}</span>;
}

export default function ThreatTable({ threats }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return threats;
    return threats.filter((t) => {
      const hay = `${t.file ?? ""} ${t.issue ?? ""} ${t.severity ?? ""} ${t.line ?? ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [threats, query]);

  return (
    <div className="rounded-2xl border border-stroke bg-panel p-4 shadow-glow">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-sm font-semibold text-white">Threat Table</div>
          <div className="text-xs text-white/60">{filtered.length} finding(s)</div>
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search findings…"
          className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white/90 placeholder:text-white/40 outline-none focus:border-cyan-300/50 sm:w-72"
        />
      </div>

      <div className="orion-scrollbar mt-3 overflow-auto">
        <table className="min-w-[720px] w-full border-separate border-spacing-y-2">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wider text-white/50">
              <th className="px-3 py-2">File</th>
              <th className="px-3 py-2">Issue</th>
              <th className="px-3 py-2">Severity</th>
              <th className="px-3 py-2">Line</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t, idx) => (
              <tr key={`${t.file ?? "?"}:${t.issue ?? "?"}:${t.line ?? "?"}:${idx}`} className="rounded-xl bg-black/20">
                <td className="max-w-[280px] truncate px-3 py-2 text-sm font-semibold text-white/90">{t.file || "—"}</td>
                <td className="px-3 py-2 text-sm text-white/80">{t.issue || "—"}</td>
                <td className="px-3 py-2">
                  <Badge severity={t.severity} />
                </td>
                <td className="px-3 py-2 text-sm text-white/70">{t.line ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

