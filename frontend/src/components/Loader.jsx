import React from "react";

export default function Loader({ label = "Analyzing..." }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-stroke bg-panel px-4 py-3 shadow-glow">
      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-cyan-300" />
      <div className="text-sm text-white/90">{label}</div>
    </div>
  );
}

