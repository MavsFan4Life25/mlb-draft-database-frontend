import React, { useEffect, useState } from "react";

export default function StatsBar({ filters, rangeFilters }) {
  const [stats, setStats] = useState({ count: 0, avgSignedBonus: "N/A" });

  useEffect(() => {
    // Only include non-empty filters/ranges in the query
    const params = new URLSearchParams();
    Object.entries({ ...filters, ...rangeFilters }).forEach(([key, value]) => {
      if (value !== "") params.append(key, value);
    });
    fetch(`http://localhost:8080/api/draft/stats?${params.toString()}`)
      .then((res) => res.json())
      .then(setStats);
  }, [filters, rangeFilters]);

  return (
    <div style={{ background: "#222", color: "#fff", padding: 16, borderRadius: 8, marginBottom: 20 }}>
      <b>Stats:</b> Count: {stats.count} | Average Signed Bonus: {stats.avgSignedBonus}
    </div>
  );
}