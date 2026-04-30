import React, { useMemo } from "react";

export default function SummaryCards({ threats = [] }) {
  const counts = useMemo(() => {
    const initial = { high: 0, medium: 0, low: 0, total: threats.length };
    threats.forEach(t => {
      const severity = String(t.severity || '').toLowerCase();
      if (initial[severity] !== undefined) {
        initial[severity]++;
      }
    });
    return initial;
  }, [threats]);

  return (
    <div className="grid gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-4">
      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-medium text-white/50 uppercase tracking-wider">Total Threats</h3>
          <div className="text-2xl font-bold text-white">{counts.total}</div>
        </div>
        <div className="h-0.5 bg-white/10"></div>
        <div className="mt-2 text-sm text-white/50">
          All detected threats
        </div>
      </div>
      
      <div className="bg-white/5 border border-red-500/20 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-medium text-red-400/50 uppercase tracking-wider">High Severity</h3>
          <div className="text-2xl font-bold text-red-400">{counts.high}</div>
        </div>
        <div className="h-0.5 bg-red-500/10"></div>
        <div className="mt-2 text-sm text-red-400/50">
          Requires immediate attention
        </div>
      </div>
      
      <div className="bg-white/5 border border-yellow-500/20 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-medium text-yellow-400/50 uppercase tracking-wider">Medium Severity</h3>
          <div className="text-2xl font-bold text-yellow-400">{counts.medium}</div>
        </div>
        <div className="h-0.5 bg-yellow-500/10"></div>
        <div className="mt-2 text-sm text-yellow-400/50">
          Requires investigation
        </div>
      </div>
      
      <div className="bg-white/5 border border-emerald-500/20 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-medium text-emerald-400/50 uppercase tracking-wider">Low Severity</h3>
          <div className="text-2xl font-bold text-emerald-400">{counts.low}</div>
        </div>
        <div className="h-0.5 bg-emerald-500/10"></div>
        <div className="mt-2 text-sm text-emerald-400/50">
          Informational
        </div>
      </div>
    </div>
  );
}