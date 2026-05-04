import React, { useMemo, useState } from "react";
import { Shield, Sun, Moon, Menu, X, Upload, FileText, RefreshCw, Scan, AlertTriangle, CheckCircle, Layers, BarChart3 } from "lucide-react";
import UploadBox from "./components/UploadBox.jsx";
import SummaryCards from "./components/SummaryCards.jsx";
import ThreatTable from "./components/ThreatTable.jsx";
import InsightsPanel from "./components/InsightsPanel.jsx";
import GroupedView from "./components/GroupedView.jsx";
import Charts from "./components/Charts.jsx";
import Loader from "./components/Loader.jsx";
import { scanInputs } from "./services/api.js";
import { deriveInsights } from "./utils/insights.js";
import { useTheme } from "./contexts/ThemeContext.jsx";

function severitySortValue(sev) {
  const s = String(sev || "").toLowerCase();
  if (s === "high") return 0;
  if (s === "medium") return 1;
  if (s === "low") return 2;
  return 99;
}

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [logs, setLogs] = useState("");
  const [codeFiles, setCodeFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [threats, setThreats] = useState([]);
  const [backendInsights, setBackendInsights] = useState([]);
  const [activeTab, setActiveTab] = useState("table");
  const [filters, setFilters] = useState({});
  const [scanMode, setScanMode] = useState("logs");

  const insights = useMemo(() => {
    const derived = deriveInsights(threats);
    const merged = [...(backendInsights || []), ...derived];
    return Array.from(new Set(merged));
  }, [threats, backendInsights]);

  const sortedThreats = useMemo(() => {
    return [...threats]
      .filter(t => {
        if (filters.severity && t.severity?.toLowerCase() !== filters.severity) return false;
        if (filters.type && t.type !== filters.type) return false;
        return true;
      })
      .sort((a, b) => {
        const sev = severitySortValue(a.severity) - severitySortValue(b.severity);
        if (sev !== 0) return sev;
        const f = String(a.file || "").localeCompare(String(b.file || ""));
        if (f !== 0) return f;
        return (Number(a.line) || 0) - (Number(b.line) || 0);
      });
  }, [threats, filters]);

  const canScan = (scanMode === "logs" && (files.length > 0 || logs.trim().length > 0)) ||
                   (scanMode === "code" && codeFiles.length > 0);

  const onScan = async () => {
    setError("");
    setLoading(true);
    try {
      let result;
      if (scanMode === "code" && codeFiles.length > 0) {
        const { scanCode } = await import("./services/api.js");
        result = await scanCode({ files: codeFiles });
      } else {
        result = await scanInputs({ uploadedFiles: files, pastedLogs: logs });
      }
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

  const handleReset = () => {
    setFiles([]);
    setLogs("");
    setCodeFiles([]);
    setThreats([]);
    setBackendInsights([]);
    setError("");
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === "dark" ? "bg-dark" : "bg-light"}`}>
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed left-0 top-0 h-full w-64 transform border-r transition-transform duration-300 lg:translate-x-0 lg:z-30 z-50 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} ${theme === "dark" ? "border-white/10 bg-sidebar-dark" : "border-gray-200 bg-sidebar-light"}`}>
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-6 py-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-emerald-400">
                <Shield className="h-6 w-6 text-black" />
              </div>
              <div>
                <div className={`text-lg font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>OrionSec</div>
                <div className={`text-xs ${theme === "dark" ? "text-white/50" : "text-gray-500"}`}>Security</div>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className={`lg:hidden ${theme === "dark" ? "text-white/60" : "text-gray-600"}`}>
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-4">
            <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all bg-gradient-to-r from-cyan-400/20 to-emerald-400/20 text-cyan-300">
              <Upload className="h-5 w-5" />
              Scan
            </button>
          </nav>

          <div className={`border-t p-4 ${theme === "dark" ? "border-white/10" : "border-gray-200"}`}>
            <button onClick={toggleTheme} className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all ${theme === "dark" ? "bg-white/5 text-white/80 hover:bg-white/10" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
              <span className="flex items-center gap-3">
                {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                {theme === "dark" ? "Dark Mode" : "Light Mode"}
              </span>
              <div className={`h-5 w-9 rounded-full transition-colors ${theme === "dark" ? "bg-cyan-400/30" : "bg-cyan-500"} relative`}>
                <div className={`absolute top-0.5 h-4 w-4 rounded-full transition-transform ${theme === "dark" ? "right-0.5 bg-cyan-400" : "left-0.5 bg-white"}`} />
              </div>
            </button>
          </div>
        </div>
      </aside>

      <div className="lg:ml-64">
        <header className={`sticky top-0 z-20 border-b backdrop-blur-xl ${theme === "dark" ? "border-white/10 bg-dark/80" : "border-gray-200 bg-light/80"}`}>
          <div className="flex items-center gap-4 px-4 py-4">
            <button onClick={() => setSidebarOpen(true)} className={`lg:hidden ${theme === "dark" ? "text-white/60" : "text-gray-600"}`}>
              <Menu className="h-6 w-6" />
            </button>
            <div>
              <h1 className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Threat Detection</h1>
              <p className={`text-xs ${theme === "dark" ? "text-white/50" : "text-gray-500"}`}>Analyze files and logs for security threats</p>
            </div>
            <div className={`ml-auto hidden items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium sm:flex ${theme === "dark" ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30" : "bg-emerald-500/10 text-emerald-700 border border-emerald-500/20"}`}>
              <CheckCircle className="h-3.5 w-3.5" />
              System Ready
            </div>
          </div>
        </header>

        <main className="px-4 py-6">
          <div className="grid gap-6 lg:grid-cols-12">
            <section className="lg:col-span-5">
              <div className="space-y-4">
                {/* Mode Toggle */}
                <div className={`rounded-xl border p-1 ${theme === "dark" ? "bg-white/5" : "bg-gray-100"}`}>
                  <button
                    onClick={() => setScanMode("logs")}
                    className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all ${scanMode === "logs" ? theme === "dark" ? "bg-white/10 text-white" : "bg-white text-gray-900 shadow-sm" : theme === "dark" ? "text-white/50 hover:text-white" : "text-gray-500 hover:text-gray-700"}`}>
                    <FileText className="inline h-4 w-4 mr-1" /> Logs
                  </button>
                  <button
                    onClick={() => setScanMode("code")}
                    className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all ${scanMode === "code" ? theme === "dark" ? "bg-white/10 text-white" : "bg-white text-gray-900 shadow-sm" : theme === "dark" ? "text-white/50 hover:text-white" : "text-gray-500 hover:text-gray-700"}`}>
                    <Scan className="inline h-4 w-4 mr-1" /> Code
                  </button>
                </div>

                {scanMode === "logs" ? (
                  <>
                    <UploadBox files={files} setFiles={setFiles} theme={theme} />
                    <div className={`rounded-2xl border p-5 shadow-lg transition-all ${theme === "dark" ? "border-white/10 bg-[#131520]" : "border-gray-200 bg-white"}`}>
                      <div className="flex items-center gap-2">
                        <FileText className={`h-5 w-5 ${theme === "dark" ? "text-cyan-400" : "text-cyan-600"}`} />
                        <div>
                          <div className={`text-sm font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Paste Logs</div>
                          <div className={`text-xs ${theme === "dark" ? "text-white/50" : "text-gray-500"}`}>Paste raw logs or text to scan</div>
                        </div>
                      </div>
                      <textarea
                        value={logs}
                        onChange={(e) => setLogs(e.target.value)}
                        placeholder='Example: "failed login attempt from 192.168.1.100"...'
                        className={`orion-scrollbar mt-4 h-40 w-full resize-none rounded-xl border px-4 py-3 text-sm outline-none transition-all ${theme === "dark" ? "border-white/10 bg-black/20 text-white/90 placeholder:text-white/30 focus:border-cyan-400/50" : "border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:border-cyan-500/50"}`}
                      />
                    </div>
                  </>
                ) : (
                  <div className={`rounded-2xl border p-5 shadow-lg transition-all ${theme === "dark" ? "border-white/10 bg-[#131520]" : "border-gray-200 bg-white"}`}>
                    <div className="flex items-center gap-2 mb-4">
                      <Scan className={`h-5 w-5 ${theme === "dark" ? "text-cyan-400" : "text-cyan-600"}`} />
                      <div>
                        <div className={`text-sm font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Scan Codebase</div>
                        <div className={`text-xs ${theme === "dark" ? "text-white/50" : "text-gray-500"}`}>Upload code files to detect vulnerabilities</div>
                      </div>
                    </div>
                    <UploadBox files={codeFiles} setFiles={setCodeFiles} theme={theme} />
                    <div className={`mt-4 p-3 rounded-xl ${theme === "dark" ? "bg-black/20" : "bg-gray-50"}`}>
                      <div className={`text-xs ${theme === "dark" ? "text-white/50" : "text-gray-500"}`}>
                        Detects: eval(), hardcoded secrets, SQL injection, XSS, weak crypto, command execution
                      </div>
                    </div>
                  </div>
                )}

                <div className={`rounded-2xl border p-5 shadow-lg transition-all ${theme === "dark" ? "border-white/10 bg-[#131520]" : "border-gray-200 bg-white"}`}>
                  <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <button
                      type="button"
                      disabled={!canScan || loading}
                      onClick={onScan}
                      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold tracking-wide shadow-lg transition-all ${!canScan || loading ? "cursor-not-allowed opacity-50" : "hover:scale-105 hover:shadow-xl"} bg-gradient-to-r from-cyan-400 to-emerald-400 text-black`}
                    >
                      <Scan className="h-4 w-4" />
                      {loading ? "Analyzing..." : "Scan Now"}
                    </button>
                    <button
                      type="button"
                      onClick={handleReset}
                      className={`inline-flex items-center justify-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-semibold transition-all hover:scale-105 ${theme === "dark" ? "border-white/10 bg-white/5 text-white/80 hover:bg-white/10" : "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"}`}
                    >
                      <RefreshCw className="h-4 w-4" />
                      Reset
                    </button>
                  </div>
                  {error && (
                    <div className={`mt-4 rounded-xl border px-4 py-3 text-sm ${theme === "dark" ? "border-red-500/30 bg-red-500/10 text-red-100" : "border-red-500/20 bg-red-50 text-red-800"}`}>
                      <div className="font-semibold">{error}</div>
                    </div>
                  )}
                  {loading && <div className="mt-4"><Loader theme={theme} label="Analyzing..." /></div>}
                </div>
              </div>
            </section>

            <section className="lg:col-span-7">
              <div className="space-y-4">
                <SummaryCards threats={sortedThreats} theme={theme} />
                {sortedThreats.length > 0 && (
                  <>
                    <Charts threats={sortedThreats} theme={theme} />
                    <div className={`flex gap-2 rounded-xl p-1 ${theme === "dark" ? "bg-white/5" : "bg-gray-100"}`}>
                      <button onClick={() => setActiveTab("table")} className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all ${activeTab === "table" ? theme === "dark" ? "bg-white/10 text-white" : "bg-white text-gray-900 shadow-sm" : theme === "dark" ? "text-white/50 hover:text-white" : "text-gray-500 hover:text-gray-700"}`}>Table View</button>
                      <button onClick={() => setActiveTab("grouped")} className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all ${activeTab === "grouped" ? theme === "dark" ? "bg-white/10 text-white" : "bg-white text-gray-900 shadow-sm" : theme === "dark" ? "text-white/50 hover:text-white" : "text-gray-500 hover:text-gray-700"}`}>Grouped View</button>
                    </div>
                  </>
                )}
                {activeTab === "table" ? <ThreatTable threats={sortedThreats} theme={theme} /> : <GroupedView threats={sortedThreats} theme={theme} />}
                <InsightsPanel insights={insights} theme={theme} />
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
