import React, { useState } from "react";

export default function FilterBar({ 
  onSearchChange, 
  onSeverityChange, 
  onSortChange,
  search,
  severity,
  sort
}) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Search */}
        <div>
          <label className="block text-xs font-medium text-white/50 mb-1">Search by Indicator</label>
          <div className="relative">
            <input
              type="text"
              value={search || ""}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Enter IP, domain, or hash..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/20 border border-white/10 text-white outline-none focus:border-cyan-400/50 focus:bg-black/30"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" dM21 21l-4.35-4.35M9.5 13a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Severity Filter */}
        <div>
          <label className="block text-xs font-medium text-white/50 mb-1">Filter by Severity</label>
          <select
            value={severity || ""}
            onChange={(e) => onSeverityChange(e.target.value)}
            className="w-full pl-3 pr-10 py-2 rounded-xl bg-black/20 border border-white/10 text-white outline-none focus:border-cyan-400/50 focus:bg-black/30 appearance-none"
          >
            <option value="">All Severities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none text-white/40">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" dM19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-xs font-medium text-white/50 mb-1">Sort By</label>
          <select
            value={sort || ""}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full pl-3 pr-10 py-2 rounded-xl bg-black/20 border border-white/10 text-white outline-none focus:border-cyan-400/50 focus:bg-black/30 appearance-none"
          >
            <option value="confidence">Confidence (High to Low)</option>
            <option value="severity">Severity (High > Medium > Low)</option>
            <option value="last_seen">Last Seen (Newest First)</option>
            <option value="first_seen">First Seen (Oldest First)</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none text-white/40">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" dM19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}