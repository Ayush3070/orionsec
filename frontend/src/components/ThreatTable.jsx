import React, { useMemo, useState } from "react";
import { Search, ShieldAlert } from "lucide-react";

function Badge({ severity, theme = "dark" }) {
  const s = String(severity || "").toLowerCase();
  const map = {
    high: { dark: "bg-red-500/15 text-red-200 border-red-500/30", light: "bg-red-50 text-red-700 border-red-500/20" },
    medium: { dark: "bg-yellow-500/15 text-yellow-100 border-yellow-500/30", light: "bg-yellow-50 text-yellow-700 border-yellow-500/20" },
    low: { dark: "bg-emerald-500/15 text-emerald-100 border-emerald-500/30", light: "bg-emerald-50 text-emerald-700 border-emerald-500/20" },
  };
  const cls = map[s]?.[theme] || (theme === "dark" ? "bg-white/5 text-white/70 border-white/10" : "bg-gray-50 text-gray-600 border-gray-200");
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${cls}`}>
      <ShieldAlert className="h-3 w-3" />
      {s || "unknown"}
    </span>
  );
}

export default function ThreatTable({ threats, theme = "dark" }) {
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
    <div className={`rounded-2xl border p-5 shadow-lg transition-all ${theme === "dark" ? "border-white/10 bg-panel-dark" : "border-gray-200 bg-white"}`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${theme === "dark" ? "bg-gradient-to-br from-red-500/20 to-orange-500/20" : "bg-gradient-to-br from-red-50 to-orange-50"}`}>
            <ShieldAlert className={`h-5 w-5 ${theme === "dark" ? "text-red-400" : "text-red-600"}`} />
          </div>
          <div>
            <div className={`text-sm font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Threat Table</div>
            <div className={`text-xs ${theme === "dark" ? "text-white/50" : "text-gray-500"}`}>{filtered.length} finding(s) detected</div>
          </div>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${theme === "dark" ? "text-white/40" : "text-gray-400"}`} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search findings..."
            className={`w-full rounded-xl border py-2.5 pl-10 pr-4 text-sm outline-none transition-all ${theme === "dark" ? "border-white/10 bg-black/20 text-white/90 placeholder:text-white/30 focus:border-cyan-400/50" : "border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:border-cyan-500/50"}`}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className={`mt-6 rounded-xl border px-6 py-8 text-center ${theme === "dark" ? "border-white/10 bg-white/5" : "border-gray-200 bg-gray-50"}`}>
          <ShieldAlert className={`mx-auto h-8 w-8 ${theme === "dark" ? "text-white/20" : "text-gray-300"}`} />
          <p className={`mt-3 text-sm ${theme === "dark" ? "text-white/50" : "text-gray-500"}`}>{query ? "No matching findings" : "No threats to display"}</p>
        </div>
      ) : (
        <div className="orion-scrollbar mt-4 overflow-auto">
          <table className="min-w-[720px] w-full border-separate border-spacing-y-2">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider">
                <th className={`px-4 py-3 font-semibold ${theme === "dark" ? "text-white/50" : "text-gray-500"}`}>File</th>
                <th className={`px-4 py-3 font-semibold ${theme === "dark" ? "text-white/50" : "text-gray-500"}`}>Issue</th>
                <th className={`px-4 py-3 font-semibold ${theme === "dark" ? "text-white/50" : "text-gray-500"}`}>Severity</th>
                <th className={`px-4 py-3 font-semibold ${theme === "dark" ? "text-white/50" : "text-gray-500"}`}>Line</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t, idx) => (
                <tr key={`${t.file ?? "?"}:${t.issue ?? "?"}:${t.line ?? "?"}:${idx}`} className={`transition-all ${theme === "dark" ? "hover:bg-white/5" : "hover:bg-gray-50"}`}>
                  <td className={`max-w-[280px] truncate rounded-l-xl px-4 py-3 text-sm font-semibold ${theme === "dark" ? "text-white/90" : "text-gray-700"}`}>{t.file || "—"}</td>
                  <td className={`px-4 py-3 text-sm ${theme === "dark" ? "text-white/80" : "text-gray-600"}`}>{t.issue || "—"}</td>
                  <td className="px-4 py-3"><Badge severity={t.severity} theme={theme} /></td>
                  <td className={`rounded-r-xl px-4 py-3 text-sm font-mono ${theme === "dark" ? "text-white/60" : "text-gray-500"}`}>{t.line ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
