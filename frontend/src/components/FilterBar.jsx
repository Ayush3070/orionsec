import React from "react";
import { Filter } from "lucide-react";

export default function FilterBar({ filters, setFilters, theme }) {
  return (
    <div className={`flex flex-wrap gap-2 rounded-xl border p-3 ${theme === "dark" ? "border-white/10 bg-[#131520]" : "border-gray-200 bg-white"}`}>
      <Filter className={`h-4 w-4 ${theme === "dark" ? "text-white/50" : "text-gray-500"}`} />
      <select
        value={filters.severity || ""}
        onChange={(e) => setFilters(f => ({ ...f, severity: e.target.value }))}
        className={`rounded-lg border px-3 py-1.5 text-xs ${theme === "dark" ? "border-white/10 bg-black/20 text-white/80" : "border-gray-200 bg-gray-50 text-gray-700"}`}
      >
        <option value="">All Severities</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
      <select
        value={filters.type || ""}
        onChange={(e) => setFilters(f => ({ ...f, type: e.target.value }))}
        className={`rounded-lg border px-3 py-1.5 text-xs ${theme === "dark" ? "border-white/10 bg-black/20 text-white/80" : "border-gray-200 bg-gray-50 text-gray-700"}`}
      >
        <option value="">All Types</option>
        <option value="ip">IP</option>
        <option value="domain">Domain</option>
      </select>
    </div>
  );
}
