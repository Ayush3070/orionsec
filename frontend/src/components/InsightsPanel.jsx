import React from "react";
import { Lightbulb, Info } from "lucide-react";

export default function InsightsPanel({ insights, theme = "dark" }) {
  return (
    <div className={`rounded-2xl border p-5 shadow-lg transition-all ${theme === "dark" ? "border-white/10 bg-panel-dark" : "border-gray-200 bg-white"}`}>
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${theme === "dark" ? "bg-gradient-to-br from-yellow-500/20 to-orange-500/20" : "bg-gradient-to-br from-yellow-50 to-orange-50"}`}>
          <Lightbulb className={`h-5 w-5 ${theme === "dark" ? "text-yellow-400" : "text-yellow-600"}`} />
        </div>
        <div>
          <div className={`text-sm font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Insights</div>
          <div className={`text-xs ${theme === "dark" ? "text-white/50" : "text-gray-500"}`}>Intelligence derived from findings</div>
        </div>
      </div>

      {insights.length === 0 ? (
        <div className={`mt-4 flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${theme === "dark" ? "border-white/10 bg-white/5 text-white/60" : "border-gray-200 bg-gray-50 text-gray-600"}`}>
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <p>No notable insights yet. Run a scan to get intelligent analysis.</p>
        </div>
      ) : (
        <ul className="mt-4 space-y-2">
          {insights.map((msg, idx) => (
            <li key={`${msg}:${idx}`} className={`group flex items-start gap-3 rounded-xl border p-4 transition-all hover:scale-[1.02] ${theme === "dark" ? "border-white/10 bg-gradient-to-r from-white/5 to-transparent" : "border-gray-200 bg-gradient-to-r from-gray-50 to-transparent"}`}>
              <div className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${theme === "dark" ? "bg-gradient-to-br from-cyan-400 to-emerald-400" : "bg-gradient-to-br from-cyan-500 to-emerald-500"}`} />
              <span className={`text-sm ${theme === "dark" ? "text-white/85" : "text-gray-700"}`}>{msg}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
