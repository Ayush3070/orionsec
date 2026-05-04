import React from "react";
import { AlertTriangle, Shield, AlertCircle, Activity, Crosshair } from "lucide-react";

export default function SummaryCards({ threats, theme }) {
  const counts = { high: 0, medium: 0, low: 0, total: threats.length };

  threats.forEach((t) => {
    const sev = (t.severity || "low").toLowerCase();
    if (counts[sev] !== undefined) counts[sev]++;
  });

  const cards = [
    { label: "Total Threats", value: counts.total, icon: Shield, color: "electric", desc: "Analyzed" },
    { label: "Critical", value: counts.high, icon: AlertTriangle, color: "red", desc: "Requires Action" },
    { label: "Warning", value: counts.medium, icon: AlertCircle, color: "yellow", desc: "Monitor" },
    { label: "Info", value: counts.low, icon: Activity, color: "neon", desc: "Low Risk" },
  ];

  const colorStyles = {
    electric: { icon: "text-electric", bg: "bg-electric/10", border: "border-electric/20", glow: "shadow-[0_0_20px_rgba(0,195,255,0.15)]" },
    red: { icon: "text-cyber-red", bg: "bg-cyber-red/10", border: "border-cyber-red/20", glow: "shadow-[0_0_20px_rgba(255,77,79,0.2)]" },
    yellow: { icon: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/20", glow: "shadow-[0_0_20px_rgba(234,179,8,0.15)]" },
    neon: { icon: "text-neon", bg: "bg-neon/10", border: "border-neon/20", glow: "shadow-[0_0_20px_rgba(0,255,159,0.15)]" },
  };

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map((c) => {
        const style = colorStyles[c.color];
        return (
          <div 
            key={c.label} 
            className={`group relative overflow-hidden rounded-3xl border p-4 transition-all duration-300 hover:scale-[1.02] ${theme === "dark" ? `border-white/10 bg-[#0c0c0c]/80 ${style.glow}` : "border-gray-200 bg-white"}`}
          >
            <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-${c.color}/30 to-transparent opacity-50`} />
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className={`text-3xl font-bold tracking-tight ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                  {c.value}
                </div>
                <div className={`text-xs font-medium ${theme === "dark" ? "text-white/50" : "text-gray-500"}`}>
                  {c.label}
                </div>
                <div className={`text-[10px] ${theme === "dark" ? "text-white/30" : "text-gray-400"}`}>
                  {c.desc}
                </div>
              </div>
              <div className={`rounded-xl p-2.5 ${style.bg} backdrop-blur-sm`}>
                <c.icon className={`h-5 w-5 ${style.icon}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}