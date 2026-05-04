import React from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Activity } from "lucide-react";

const SEVERITY_COLORS = { 
  high: "#ff4d4f", 
  medium: "#eab308", 
  low: "#00ff9f" 
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-white/10 bg-black/90 px-3 py-2 shadow-xl backdrop-blur-xl">
        <p className="text-xs font-medium text-white">{payload[0].name}</p>
        <p className="text-sm font-bold text-white/80">{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export default function Charts({ threats, theme }) {
  const counts = { high: 0, medium: 0, low: 0 };
  threats.forEach(t => {
    const s = (t.severity || "low").toLowerCase();
    if (counts[s] !== undefined) counts[s]++;
  });

  const pie = Object.entries(counts).filter(([, v]) => v > 0).map(([k, v]) => ({ name: k, value: v }));
  const bar = Object.entries(counts).map(([k, v]) => ({ severity: k, count: v }));

  if (threats.length === 0) return null;

  return (
    <div className={`rounded-3xl border shadow-2xl backdrop-blur-xl ${theme === "dark" ? "border-white/10 bg-[#0c0c0c]/80" : "border-gray-200 bg-white"}`}>
      <div className={`flex items-center gap-3 border-b px-5 py-4 ${theme === "dark" ? "border-white/5 bg-white/5" : "border-gray-100 bg-gray-50"}`}>
        <Activity className={`h-4 w-4 ${theme === "dark" ? "text-electric" : "text-cyan-600"}`} />
        <span className={`text-sm font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Threat Distribution</span>
      </div>
      <div className="grid gap-6 p-5 md:grid-cols-2">
        <div>
          <div className={`mb-3 text-xs font-medium uppercase tracking-wider ${theme === "dark" ? "text-white/40" : "text-gray-400"}`}>By Severity</div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie 
                data={pie} 
                dataKey="value" 
                nameKey="name" 
                cx="50%" 
                cy="50%" 
                innerRadius={50}
                outerRadius={70}
                paddingAngle={4}
              >
                {pie.map((entry, i) => (
                  <Cell 
                    key={i} 
                    fill={SEVERITY_COLORS[entry.name] || "#888"} 
                    stroke="transparent"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div>
          <div className={`mb-3 text-xs font-medium uppercase tracking-wider ${theme === "dark" ? "text-white/40" : "text-gray-400"}`}>Count Breakdown</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={bar} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              <XAxis 
                dataKey="severity" 
                tick={{ fontSize: 11, fill: theme === "dark" ? "#fff" : "#64748b" }} 
                axisLine={{ stroke: theme === "dark" ? "rgba(255,255,255,0.1)" : "#e2e8f0" }}
                tickLine={false}
              />
              <YAxis 
                allowDecimals={false} 
                tick={{ fontSize: 11, fill: theme === "dark" ? "#fff" : "#64748b" }} 
                axisLine={{ stroke: theme === "dark" ? "rgba(255,255,255,0.1)" : "#e2e8f0" }}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="count" 
                fill="#00c3ff" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}