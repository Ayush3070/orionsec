import React from "react";
import { Lightbulb, AlertTriangle, TrendingUp, Zap, Cpu } from "lucide-react";

export default function InsightsPanel({ insights, theme }) {
  if (!insights || insights.length === 0) {
    return (
      <div className={`rounded-3xl border shadow-2xl backdrop-blur-xl ${theme === "dark" ? "border-white/10 bg-[#0c0c0c]/60" : "border-gray-200 bg-white"}`}>
        <div className="flex items-center gap-3 px-5 py-4">
          <div className="rounded-lg bg-electric/10 p-1.5">
            <Cpu className="h-4 w-4 text-electric" />
          </div>
          <span className={`text-sm font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Intelligence</span>
        </div>
        <div className="px-5 py-8 text-center">
          <Lightbulb className={`mx-auto mb-3 h-10 w-10 ${theme === "dark" ? "text-white/20" : "text-gray-300"}`} />
          <p className={`text-sm ${theme === "dark" ? "text-white/50" : "text-gray-500"}`}>Ready for analysis</p>
          <p className={`mt-1 text-xs ${theme === "dark" ? "text-white/30" : "text-gray-400"}`}>Upload files or paste logs to generate insights</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-3xl border shadow-2xl backdrop-blur-xl ${theme === "dark" ? "border-white/10 bg-[#0c0c0c]/80" : "border-gray-200 bg-white"}`}>
      <div className={`flex items-center gap-3 border-b px-5 py-4 ${theme === "dark" ? "border-white/5 bg-white/5" : "border-gray-100 bg-gray-50"}`}>
        <div className="rounded-lg bg-electric/10 p-1.5">
          <Zap className="h-4 w-4 text-electric" />
        </div>
        <span className={`text-sm font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Intelligence & Analysis</span>
        <span className={`ml-auto rounded-full border px-2.5 py-0.5 text-xs font-medium ${theme === "dark" ? "bg-electric/10 border-electric/20 text-electric" : "bg-cyan-100 border-cyan-200 text-cyan-700"}`}>
          {insights.length} insights
        </span>
      </div>
      <div className="space-y-2 p-4">
        {insights.map((insight, i) => {
          const isCritical = insight.includes("Critical") || insight.includes("brute") || insight.includes("attack");
          const icon = isCritical ? AlertTriangle : TrendingUp;
          const iconColor = isCritical ? "text-cyber-red" : "text-yellow-400";
          const bgColor = isCritical ? "bg-cyber-red/10" : "bg-yellow-400/10";
          const borderColor = isCritical ? "border-cyber-red/20" : "border-yellow-400/20";
          
          return (
            <div 
              key={i} 
              className={`flex items-start gap-3 rounded-xl border p-4 transition-all duration-200 hover:scale-[1.01] ${theme === "dark" ? `${borderColor} bg-white/[0.02]` : "border-gray-200 bg-gray-50"}`}
            >
              <div className={`rounded-lg p-1.5 ${bgColor}`}>
                {React.createElement(icon, { className: `h-4 w-4 ${iconColor}` })}
              </div>
              <span className={`flex-1 text-sm leading-relaxed ${theme === "dark" ? "text-white/80" : "text-gray-700"}`}>{insight}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}