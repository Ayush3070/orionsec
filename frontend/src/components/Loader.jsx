import React from "react";

export default function Loader({ label = "Analyzing...", theme = "dark" }) {
  return (
    <div className={`flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-lg ${theme === "dark" ? "border-white/10 bg-panel-dark" : "border-gray-200 bg-white"}`}>
      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-cyan-400" />
      <div className={`text-sm ${theme === "dark" ? "text-white/90" : "text-gray-700"}`}>{label}</div>
    </div>
  );
}
