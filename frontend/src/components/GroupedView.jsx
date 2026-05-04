import React, { useState } from "react";
import { ChevronDown, ChevronRight, AlertTriangle, AlertCircle, Info, Terminal } from "lucide-react";

export default function GroupedView({ threats, theme }) {
  const grouped = {};
  threats.forEach((t) => {
    // Group by severity + issue + file (for code vulnerabilities)
    const key = `${t.severity}-${t.issue}-${t.file || 'general'}`;
    if (!grouped[key]) grouped[key] = { ...t, count: 0, lines: new Set(), files: new Set() };
    grouped[key].count++;
    if (t.line) grouped[key].lines.add(t.line);
    if (t.file) grouped[key].files.add(t.file);
  });

  const sevIcon = (sev) => {
    const s = (sev || "").toLowerCase();
    if (s === "high") return <AlertTriangle className="h-4 w-4 text-red-400" />;
    if (s === "medium") return <AlertCircle className="h-4 w-4 text-yellow-400" />;
    return <Info className="h-4 w-4 text-green-400" />;
  };

  const isCodeVuln = (t) => {
    return t.type === 'code' || (t.file && (t.file.endsWith('.js') || t.file.endsWith('.jsx') || t.file.endsWith('.py') || t.file.endsWith('.ts')));
  };

  return (
    <div className={`rounded-2xl border shadow-lg ${theme === "dark" ? "border-white/10 bg-[#131520]" : "border-gray-200 bg-white"}`}>
      {Object.values(grouped).map((g, i) => (
        <details key={i} className={`border-b ${theme === "dark" ? "border-white/5" : "border-gray-100"}`}>
          <summary className={`flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors hover:${theme === "dark" ? "bg-white/5" : "bg-gray-50"}`}>
            {sevIcon(g.severity)}
            {isCodeVuln(g) && (
              <span className="rounded bg-red-500/20 px-1.5 py-0.5 text-xs text-red-300 border border-red-500/30">
                [Code Vulnerability]
              </span>
            )}
            <span className={`flex-1 text-sm ${theme === "dark" ? "text-white/80" : "text-gray-700"}`}>{g.issue}</span>
            <span className={`rounded-full px-2 py-0.5 text-xs ${theme === "dark" ? "bg-white/10 text-white/60" : "bg-gray-100 text-gray-600"}`}>{g.count} occurrence(s)</span>
          </summary>
          <div className={`px-4 py-3 ${theme === "dark" ? "bg-black/20" : "bg-gray-50"}`}>
            {g.files.size > 0 && (
              <div className={`text-xs ${theme === "dark" ? "text-white/50" : "text-gray-500"}`}>
                <strong>Files affected:</strong> {Array.from(g.files).join(", ")}
              </div>
            )}
            <div className={`text-xs ${theme === "dark" ? "text-white/50" : "text-gray-500"}`}>
              <strong>Lines affected:</strong> {Array.from(g.lines).join(", ") || "N/A"}
            </div>
            <div className={`mt-1 text-xs ${theme === "dark" ? "text-white/50" : "text-gray-500"}`}>
              Weight: {g.weight} | Severity: {g.severity}
              {g.ruleId && <span> | Rule: {g.ruleId}</span>}
            </div>
          </div>
        </details>
      ))}
    </div>
  );
}