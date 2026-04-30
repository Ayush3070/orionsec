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

export default function GroupedView({ threats }) {
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

  return (
    <div className="rounded-2xl border border-stroke bg-panel p-4 shadow-glow">
      <div className="text-sm font-semibold text-white">Grouped View</div>
      <div className="mt-1 text-xs text-white/60">Findings grouped by file (collapsible).</div>

      <div className="mt-3 space-y-2">
        {grouped.map(([file, items]) => {
          const isOpen = open.has(file);
          return (
            <div key={file} className="rounded-xl border border-white/10 bg-black/20">
              <button
                type="button"
                className="flex w-full items-center justify-between gap-3 px-3 py-3 text-left"
                onClick={() => toggle(file)}
              >
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-white/90">{file}</div>
                  <div className="text-[11px] text-white/60">{items.length} finding(s)</div>
                </div>
                <div className="text-xs text-white/60">{isOpen ? "Hide" : "Show"}</div>
              </button>
              {isOpen && (
                <div className="border-t border-white/10 px-3 py-3">
                  <ul className="space-y-2">
                    {items.map((t, idx) => (
                      <li key={`${t.issue ?? "?"}:${t.line ?? "?"}:${idx}`} className="flex flex-col gap-1 rounded-lg bg-white/5 px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-sm text-white/85">{t.issue || "—"}</div>
                        <div className="flex items-center gap-2">
                          <Badge severity={t.severity} />
                          <span className="text-xs text-white/60">line {t.line ?? "—"}</span>
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
    </div>
  );
}

