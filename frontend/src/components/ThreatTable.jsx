import React from "react";
import { AlertTriangle, AlertCircle, Info, Shield, Server } from "lucide-react";

export default function ThreatTable({ threats, theme }) {
  const sevIcon = (sev) => {
    const s = (sev || "").toLowerCase();
    if (s === "high") return <AlertTriangle className="h-4 w-4 text-cyber-red" />;
    if (s === "medium") return <AlertCircle className="h-4 w-4 text-yellow-400" />;
    return <Info className="h-4 w-4 text-neon" />;
  };

  const sevBadge = (sev) => {
    const s = (sev || "low").toLowerCase();
    if (s === "high") return "bg-cyber-red/15 text-cyber-red border-cyber-red/30 shadow-[0_0_8px_rgba(255,77,79,0.2)]";
    if (s === "medium") return "bg-yellow-400/15 text-yellow-300 border-yellow-400/30";
    return "bg-neon/15 text-neon border-neon/30 shadow-[0_0_8px_rgba(0,255,159,0.2)]";
  };

  if (threats.length === 0) {
    return (
      <div className={`rounded-3xl border p-12 text-center backdrop-blur-xl ${theme === "dark" ? "border-white/10 bg-[#0c0c0c]/60" : "border-gray-200 bg-white"}`}>
        <Shield className={`mx-auto mb-3 h-14 w-14 ${theme === "dark" ? "text-white/20" : "text-gray-300"}`} />
        <p className={theme === "dark" ? "text-white/50" : "text-gray-500"}>No threats detected</p>
        <p className={`mt-1 text-xs ${theme === "dark" ? "text-white/30" : "text-gray-400"}`}>Upload files or paste logs to begin scanning</p>
      </div>
    );
  }

  return (
    <div className={`rounded-3xl border shadow-2xl overflow-hidden backdrop-blur-xl ${theme === "dark" ? "border-white/10 bg-[#0c0c0c]/80" : "border-gray-200 bg-white"}`}>
      <div className={`flex items-center gap-3 px-5 py-4 ${theme === "dark" ? "border-b border-white/5 bg-white/5" : "border-b border-gray-100 bg-gray-50"}`}>
        <Server className={`h-4 w-4 ${theme === "dark" ? "text-electric" : "text-cyan-600"}`} />
        <span className={`text-sm font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Threat Registry</span>
        <span className={`ml-auto rounded-full border px-2.5 py-0.5 text-xs font-medium ${theme === "dark" ? "bg-white/10 border-white/10 text-white/60" : "bg-gray-100 border-gray-200 text-gray-600"}`}>
          {threats.length} entries
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className={`border-b ${theme === "dark" ? "border-white/5 bg-black/20" : "border-gray-100 bg-gray-50"}`}>
              <th className={`px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider ${theme === "dark" ? "text-white/50" : "text-gray-500"}`}>Severity</th>
              <th className={`px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider ${theme === "dark" ? "text-white/50" : "text-gray-500"}`}>Issue</th>
              <th className={`px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider ${theme === "dark" ? "text-white/50" : "text-gray-500"}`}>Source</th>
              <th className={`px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider ${theme === "dark" ? "text-white/50" : "text-gray-500"}`}>Line</th>
              <th className={`px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider ${theme === "dark" ? "text-white/50" : "text-gray-500"}`}>Weight</th>
            </tr>
          </thead>
          <tbody>
            {threats.map((t, i) => (
              <tr 
                key={i} 
                className={`transition-all duration-150 hover:${theme === "dark" ? "bg-white/[0.04]" : "bg-gray-50"} ${theme === "dark" ? "border-white/5" : "border-gray-100"} border-b`}
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    {sevIcon(t.severity)}
                    <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${sevBadge(t.severity)}`}>
                      {t.severity}
                    </span>
                  </div>
                </td>
                <td className={`px-5 py-4 max-w-xs ${theme === "dark" ? "text-white/90" : "text-gray-700"}`}>
                  <span className="truncate block">{t.issue}</span>
                </td>
                <td className={`px-5 py-4 font-mono text-xs ${theme === "dark" ? "text-electric/80" : "text-cyan-600/80"}`}>{t.file || "-"}</td>
                <td className={`px-5 py-4 ${theme === "dark" ? "text-white/60" : "text-gray-500"}`}>{t.line || "-"}</td>
                <td className={`px-5 py-4 font-mono text-xs ${theme === "dark" ? "text-white/50" : "text-gray-400"}`}>{t.weight}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}