import React from "react";

export default function Loader({ theme, label = "Loading..." }) {
  return (
    <div className="flex items-center justify-center gap-3 py-8">
      <div className={`h-8 w-8 animate-spin rounded-full border-4 border-t-transparent ${theme === "dark" ? "border-cyan-400" : "border-cyan-600"}`} />
      <span className={theme === "dark" ? "text-white/60" : "text-gray-500"}>{label}</span>
    </div>
  );
}
