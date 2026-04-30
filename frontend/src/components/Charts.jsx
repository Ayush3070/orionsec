import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = {
  high: "#ef4444",
  medium: "#f59e0b",
  low: "#10b981",
};

export default function Charts({ threats = [] }) {
  // Prepare data for line chart: threats over time (by first_seen)
  const timelineData = useMemo(() => {
    const map = {};
    threats.forEach((threat) => {
      const date = new Date(threat.first_seen).toISOString().split("T")[0];
      map[date] = (map[date] || 0) + 1;
    });
    return Object.keys(map)
      .sort()
      .map((date) => ({
        date,
        count: map[date],
      }));
  }, [threats]);

  // Prepare data for pie chart: severity distribution
  const severityData = useMemo(() => {
    const counts = { high: 0, medium: 0, low: 0 };
    threats.forEach((threat) => {
      const severity = String(threat.severity || "").toLowerCase();
      if (counts[severity] !== undefined) {
        counts[severity]++;
      }
    });
    return Object.keys(counts)
      .filter((key) => counts[key] > 0)
      .map((severity) => ({
        severity,
        count: counts[severity],
      }));
  }, [threats]);

  return (
    <div className="grid gap-6 mb-8 sm:grid-cols-2">
      {/* Line Chart: Threats Over Time */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <h3 className="mb-4 text-xs font-medium text-white/50 uppercase tracking-wider">
          Threats Over Time
        </div>
        {timelineData.length === 0 ? (
          <p className="text-white/50 text-center py-8">No threat data available</p>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity="0.2" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "text-white/50" }} />
              <YAxis tick={{ fontSize: 10, fill: "text-white/50" }} />
              <Tooltip
                formatter={(value) => `${value} threats`}
                containerStyle={{ backgroundColor: "rgba(0,0,0,0.7)" }}
                labelStyle={{ color: "#fff" }}
                itemStyle={{ color: "#fff" }}
              />
              <Legend verticalAlign="top" height={36} />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Pie Chart: Severity Distribution */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <h3 className="mb-4 text-xs font-medium text-white/50 uppercase tracking-wider">
          Severity Distribution
        </div>
        {severityData.length === 0 ? (
          <p className="text-white/50 text-center py-8">No threat data available</p>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={severityData}
                dataKey="count"
                nameKey="severity"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                labelLine={{ 
                  stroke: "#fff", 
                  strokeWidth: 1, 
                  fontSize: 12 
                }}
                label={{ 
                  position: "inside", 
                  fill: "#fff", 
                  fontSize: 12 
                }}
              >
                {severityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.severity]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}