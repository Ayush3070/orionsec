import React, { useMemo, useState } from "react";
import UploadBox from "./components/UploadBox.jsx";
import SummaryCards from "./components/SummaryCards.jsx";
import ThreatTable from "./components/ThreatTable.jsx";
import InsightsPanel from "./components/InsightsPanel.jsx";
import GroupedView from "./components/GroupedView.jsx";
import Loader from "./components/Loader.jsx";
import { scanInputs } from "./services/api.js";
import { deriveInsights } from "./utils/insights.js";

function severitySortValue(sev) {
  const s = String(sev || "").toLowerCase();
  if (s === "high") return 0;
  if (s === "medium") return 1;
  if (s === "low") return 2;
  return 99;
}

export default function App() {
  const [files, setFiles] = useState([]);
  const [logs, setLogs] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [threats, setThreats] = useState([]);
  const [backendInsights, setBackendInsights] = useState([]);

  const insights = useMemo(() => {
    const derived = deriveInsights(threats);
    const merged = [...(backendInsights || []), ...derived];
    return Array.from(new Set(merged));
  }, [threats, backendInsights]);

  const sortedThreats = useMemo(() => {
    return [...threats].sort((a, b) => {
      const sev = severitySortValue(a.severity) - severitySortValue(b.severity);
      if (sev !== 0) return sev;
      const f = String(a.file || "").localeCompare(String(b.file || ""));
      if (f !== 0) return f;
      return (Number(a.line) || 0) - (Number(b.line) || 0);
    });
  }, [threats]);

  const canScan = files.length > 0 || logs.trim().length > 0;

  const onScan = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await scanInputs({ uploadedFiles: files, pastedLogs: logs });
      setThreats(result.threats || []);
      setBackendInsights(result.insights || []);
    } catch (e) {
      setThreats([]);
      setBackendInsights([]);
      setError(e?.message || "Scan failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-white">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-black/30 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-300 shadow-[0_0_0_6px_rgba(74,242,197,0.12)]" />
              <div className="truncate text-lg font-extrabold tracking-wide">OrionSec</div>
            </div>
            <div className="mt-1 text-xs text-white/60">Threat Detection Dashboard</div>
          </div>
          <div className="hidden text-xs text-white/50 sm:block">Dark-mode security dashboard • responsive • minimal</div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-4 px-4 py-6 lg:grid-cols-12">
        <section className="lg:col-span-5">
          <div className="space-y-4">
            <UploadBox files={files} setFiles={setFiles} />

            <div className="rounded-2xl border border-stroke bg-panel p-4 shadow-glow">
              <div className="text-sm font-semibold text-white">Paste logs</div>
              <div className="mt-1 text-xs text-white/60">Paste raw logs / text to scan.</div>
              <textarea
                value={logs}
                onChange={(e) => setLogs(e.target.value)}
                placeholder='Example: "failed login" ...'
                className="orion-scrollbar mt-3 h-40 w-full resize-none rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white/90 placeholder:text-white/35 outline-none focus:border-cyan-300/50"
              />
              <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  disabled={!canScan || loading}
                  onClick={onScan}
                  className={[
                    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-bold tracking-wide shadow-glow transition",
                    "bg-gradient-to-r from-cyan-400/90 to-emerald-300/90 text-black hover:from-cyan-300 hover:to-emerald-200",
                    (!canScan || loading) ? "cursor-not-allowed opacity-50" : "",
                  ].join(" ")}
                >
                  {loading ? "Analyzing..." : "Scan"}
                </button>
                <button
                  type="button"
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 hover:bg-white/10"
                  onClick={() => {
                    setFiles([]);
                    setLogs("");
                    setThreats([]);
                    setBackendInsights([]);
                    setError("");
                  }}
                >
                  Reset
                </button>
              </div>
              {error && (
                <div className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-3 text-sm text-red-100">
                  {error}
                  <div className="mt-1 text-xs text-red-100/70">
                    Tip: set <span className="font-mono">VITE_API_BASE_URL</span> and ensure the backend implements <span className="font-mono">POST /scan</span>.
                  </div>
                </div>
              )}
              {loading && <div className="mt-3"><Loader label="Analyzing..." /></div>}
            </div>
          </div>
        </section>

        <section className="lg:col-span-7">
          <div className="space-y-4">
            <SummaryCards threats={sortedThreats} />
            <InsightsPanel insights={insights} />
            <ThreatTable threats={sortedThreats} />
            <GroupedView threats={sortedThreats} />
          </div>
        </section>
      </main>
    </div>
  );
}

