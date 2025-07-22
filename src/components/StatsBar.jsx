import React from "react";

function StatsBar({ data }) {
  // Total players
  const totalPlayers = data.length;

  // Average signed bonus (ignoring N/A, (unsigned), and empty)
  const bonuses = data
    .map(row => Number(row.SignedBonus?.replace(/[^0-9.]/g, "")))
    .filter(bonus => !isNaN(bonus) && bonus > 0);

  const avgBonus = bonuses.length
    ? `$${(bonuses.reduce((a, b) => a + b, 0) / bonuses.length).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
    : "N/A";

  return (
    <div style={{
      background: "#222",
      color: "#fff",
      padding: "1rem",
      borderRadius: 8,
      marginBottom: 20,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
      <div><strong>Total Players:</strong> {totalPlayers}</div>
      <div><strong>Avg. Signed Bonus:</strong> {avgBonus}</div>
    </div>
  );
}

export default StatsBar;