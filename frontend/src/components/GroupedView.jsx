import React, { useMemo, useState } from "react";
import { ChevronDown, ChevronRight, FileText, ShieldAlert } from "lucide-react";

function Badge({ severity, theme = "dark" }) {
  const s = String(severity || "").toLowerCase();
  const map = {
    high: { dark: "bg-red-500/15 text-red-200 border-red-500/30", light: "bg-red-50 text-red-700 border-red-500/20" },
    medium: { dark: "bg-yellow-500/15 text-yellow-100 border-yellow-500/30", light: "bg-yellow-50 text-yellow-700 border-yellow-500/20" },
    low: { dark: "bg-emerald-500/15 text-emerald-100 border-emerald-500/30", light: "bg-emerald-50 text-emerald-700 border-emerald-500/20" },
  };
  const cls = map[s]?.[theme] || (theme === "dark" ? "bg-white/5 text-white/70 border-white/10" : "bg-gray-50 text-gray-600 border-gray-200");
  return <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${cls}`}>{s || "unknown"}</span>;
}

export default function GroupedView({ threats, theme = "dark" }) {
  const grouped = useMemo(() => {
    const map = new Map();
    for (const t of threats) {
      const key = t.file || "—";
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(t);
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [threats]);

  const [open, setOpen] = useState(() => new Set(grouped.map(([f]) => f)));
  const toggle = (file) => {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(file)) next.delete(file);
      else next.add(file);
      return next;
    });
  };

  const expandAll = () => setOpen(new Set(grouped.map(([f]) => f)));
  const collapseAll = () => setOpen(new Set());

  return (
    <div className={`rounded-2xl border p-5 shadow-lg transition-all ${theme === "dark" ? "border-white/10 bg-panel-dark" : "border-gray-200 bg-white"}`}>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${theme === "dark" ? "bg-gradient-to-br from-cyan-500/20 to-emerald-500/20" : "bg-gradient-to-br from-cyan-50 to-emerald-50"}`}>
            <FileText className={`h-5 w-5 ${theme === "dark" ? "text-cyan-400" : "text-cyan-600"}`} />
          </div>
          <div>
            <div className={`text-sm font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Grouped View</div>
            <div className={`text-xs ${theme === "dark" ? "text-white/50" : "text-gray-500"}`}>Findings grouped by file ({grouped.length} files)</div>
          </div>
        </div>
        {grouped.length > 0 && (
          <div className="flex gap-2">
            <button onClick={expandAll} className={`text-xs font-medium transition-colors ${theme === "dark" ? "text-white/50 hover:text-white" : "text-gray-500 hover:text-gray-700"}`}>Expand all</button>
            <span className={theme === "dark" ? "text-white/20" : "text-gray-300"}>|</span>
            <button onClick={collapseAll} className={`text-xs font-medium transition-colors ${theme === "dark" ? "text-white/50 hover:text-white" : "text-gray-500 hover:text-gray-700"}`}>Collapse all</button>
          </div>
        )}
      </div>

      {grouped.length === 0 ? (
        <div className={`rounded-xl border px-6 py-8 text-center ${theme === "dark" ? "border-white/10 bg-white/5" : "border-gray-200 bg-gray-50"}`}>
          <FileText className={`mx-auto h-8 w-8 ${theme === "dark" ? "text-white/20" : "text-gray-300"}`} />
          <p className={`mt-3 text-sm ${theme === "dark" ? "text-white/50" : "text-gray-500"}`}>No files to display</p>
        </div>
      ) : (
        <div className="space-y-2">
          {grouped.map(([file, items]) => {
            const isOpen = open.has(file);
            return (
              <div key={file} className={`overflow-hidden rounded-xl border transition-all ${theme === "dark" ? "border-white/10 bg-white/5" : "border-gray-200 bg-gray-50"}`}>
                <button type="button" onClick={() => toggle(file)} className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors ${theme === "dark" ? "hover:bg-white/10" : "hover:bg-gray-100"}`}>
                  <div className="flex min-w-0 items-center gap-3">
                    <div className={`shrink-0 ${theme === "dark" ? "text-white/60" : "text-gray-500"}`}>
                      {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </div>
                    <FileText className={`h-4 w-4 shrink-0 ${theme === "dark" ? "text-cyan-400" : "text-cyan-600"}`} />
                    <span className={`truncate text-sm font-semibold ${theme === "dark" ? "text-white/90" : "text-gray-700"}`}>{file}</span>
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${theme === "dark" ? "bg-white/10 text-white/60" : "bg-gray-200 text-gray-600"}`}>{items.length} finding(s)</span>
                </button>
                {isOpen && (
                  <div className={`border-t px-4 py-3 ${theme === "dark" ? "border-white/10" : "border-gray-200"}`}>
                    <ul className="space-y-2">
                      {items.map((t, idx) => (
                        <li key={`${t.issue ?? "?"}:${t.line ?? "?"}:${idx}`} className={`flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between ${theme === "dark" ? "border-white/10 bg-black/20" : "border-gray-200 bg-white"}`}>
                          <div className="flex items-start gap-3">
                            <ShieldAlert className={`mt-0.5 h-4 w-4 shrink-0 ${theme === "dark" ? "text-white/40" : "text-gray-400"}`} />
                            <span className={`text-sm ${theme === "dark" ? "text-white/85" : "text-gray-700"}`}>{t.issue || "—"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge severity={t.severity} theme={theme} />
                            <span className={`text-xs font-mono ${theme === "dark" ? "text-white/50" : "text-gray-500"}`}>line {t.line ?? "—"}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
