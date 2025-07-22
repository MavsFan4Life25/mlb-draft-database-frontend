import React from "react";

// Helper for color-coding the Diff column
function getDiffColor(diff) {
  if (!diff || diff === "-" || diff === "(unsigned)") return "#fff";
  if (diff.trim().startsWith("+")) return "green";
  if (diff.trim().startsWith("-")) return "red";
  if (diff.trim() === "0" || diff.trim() === "+0" || diff.trim() === "-0") return "blue";
  return "#fff";
}

// Helper to get unique values for dropdowns
function getUnique(data, key) {
  return Array.from(new Set(data.map((row) => row[key]).filter((v) => v && v !== ""))).sort(
    (a, b) => (isNaN(a) ? a.localeCompare(b) : a - b)
  );
}

function DraftTable({ data, filtered, setFilters, filters, rangeFilters, setRangeFilters }) {
  // School dropdown: group all high schools as 'HS', others as themselves, then sort alphabetically
  const schoolOptions = [
    ...new Set(
      data
        .map((row) => (row.School && row.School.includes("HS") ? "HS" : row.School))
        .filter((v) => v && v !== "")
    ),
  ].sort((a, b) => a.localeCompare(b));

  return (
    <div>
      {/* Filters */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
        {/* ... all your filter code unchanged ... */}
        <select value={filters.year} onChange={(e) => setFilters((f) => ({ ...f, year: e.target.value }))}>
          <option value="">Year</option>
          {getUnique(data, "Year").map((v) => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
        {/* ... rest of your filters ... */}
        <input
          type="text"
          placeholder="Search Player"
          value={filters.search}
          onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
          style={{ flex: 1, minWidth: 180 }}
        />
      </div>
      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", background: "#111", color: "#fff", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Year</th>
              <th>Round</th>
              <th>Pick</th>
              <th>Round/Pick</th>
              <th>Name</th>
              <th>Team</th>
              <th>Position</th>
              <th>Age</th>
              <th>Bat/Throw</th>
              <th>Pre-Draft Team</th>
              <th>Slotted Bonus</th>
              <th>Signed Bonus</th>
              <th>+/- Diff</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, i) => (
              <tr key={i}>
                <td>{row.Year}</td>
                <td>{row.Round}</td>
                <td>{row.Pick}</td>
                <td>{row.RoundPick}</td>
                <td>{row.Name}</td>
                <td>{row.TeamDrafted}</td>
                <td>{row.Position}</td>
                <td>{row.AgeAtDraft}</td>
                <td>
                  {typeof row.BatThrow === "string" && row.BatThrow.trim() && row.BatThrow.trim() !== "/"
                    ? row.BatThrow.replace(/\s+/g, "")
                    : ""}
                </td>
                <td>{row.School && row.School.includes("HS") ? "HS" : row.School}</td>
                <td>{row.SlottedBonus}</td>
                <td style={{ color: row.SignedBonus === "(unsigned)" ? "#fff" : "#fff" }}>{row.SignedBonus}</td>
                <td style={{ color: getDiffColor(row.Diff), fontWeight: "bold" }}>{row.Diff}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ color: "#fff", textAlign: "center", marginTop: 40 }}>No results found.</div>
        )}
      </div>
    </div>
  );
}

export default DraftTable;