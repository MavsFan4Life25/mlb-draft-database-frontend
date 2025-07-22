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

// OF and P groups
const OF_GROUP = ["OF", "CF", "RF", "LF"];
const P_GROUP = ["P", "SP", "SP1", "RP"];

function DraftTable({ data, filtered, setFilters, filters, rangeFilters, setRangeFilters }) {
  const schoolOptions = [
    ...new Set(
      data
        .map((row) => (row.School && row.School.includes("HS") ? "HS" : row.School))
        .filter((v) => v && v !== "")
    ),
  ].sort((a, b) => a.localeCompare(b));

  const positionOptions = [
    "OF",
    "P",
    ...getUnique(data, "Position").filter(
      v => v && !OF_GROUP.includes(v) && !P_GROUP.includes(v)
    ),
  ];

  return (
    <div>
      {/* Filters */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
        <select value={filters.year} onChange={(e) => setFilters((f) => ({ ...f, year: e.target.value }))}>
          <option value="">Year</option>
          {getUnique(data, "Year").map((v) => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
        {/* Year Range */}
        <input
          type="number"
          placeholder="Year From"
          value={rangeFilters.yearFrom}
          onChange={e => setRangeFilters(f => ({ ...f, yearFrom: e.target.value }))}
          style={{ width: 90 }}
        />
        <input
          type="number"
          placeholder="Year To"
          value={rangeFilters.yearTo}
          onChange={e => setRangeFilters(f => ({ ...f, yearTo: e.target.value }))}
          style={{ width: 90 }}
        />
        <select value={filters.round} onChange={(e) => setFilters((f) => ({ ...f, round: e.target.value }))}>
          <option value="">Round</option>
          {getUnique(data, "Round").map((v) => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
        {/* Round Range */}
        <input
          type="number"
          placeholder="Round From"
          value={rangeFilters.roundFrom}
          onChange={e => setRangeFilters(f => ({ ...f, roundFrom: e.target.value }))}
          style={{ width: 90 }}
        />
        <input
          type="number"
          placeholder="Round To"
          value={rangeFilters.roundTo}
          onChange={e => setRangeFilters(f => ({ ...f, roundTo: e.target.value }))}
          style={{ width: 90 }}
        />
        <select value={filters.pick} onChange={(e) => setFilters((f) => ({ ...f, pick: e.target.value }))}>
          <option value="">Pick</option>
          {getUnique(data, "Pick").map((v) => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
        {/* Pick Range */}
        <input
          type="number"
          placeholder="Pick From"
          value={rangeFilters.pickFrom}
          onChange={e => setRangeFilters(f => ({ ...f, pickFrom: e.target.value }))}
          style={{ width: 90 }}
        />
        <input
          type="number"
          placeholder="Pick To"
          value={rangeFilters.pickTo}
          onChange={e => setRangeFilters(f => ({ ...f, pickTo: e.target.value }))}
          style={{ width: 90 }}
        />
        <select value={filters.team} onChange={(e) => setFilters((f) => ({ ...f, team: e.target.value }))}>
          <option value="">Team</option>
          {getUnique(data, "TeamDrafted").map((v) => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
        {/* Position Dropdown with OF and P grouping */}
        <select value={filters.position} onChange={(e) => setFilters((f) => ({ ...f, position: e.target.value }))}>
          <option value="">Position</option>
          {positionOptions.map((v) => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
        {/* Pre-Draft Team dropdown with HS grouping, sorted */}
        <select value={filters.school} onChange={(e) => setFilters((f) => ({ ...f, school: e.target.value }))}>
          <option value="">Pre-Draft Team</option>
          {schoolOptions.map((v) => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
        <select value={filters.age} onChange={(e) => setFilters((f) => ({ ...f, age: e.target.value }))}>
          <option value="">Age</option>
          {getUnique(data, "AgeAtDraft")
            .filter((v) => v && !isNaN(Number(v)) && Number(v) > 0)
            .sort((a, b) => Number(a) - Number(b))
            .map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
        </select>
        {/* Age Range */}
        <input
          type="number"
          placeholder="Age From"
          value={rangeFilters.ageFrom}
          onChange={e => setRangeFilters(f => ({ ...f, ageFrom: e.target.value }))}
          style={{ width: 90 }}
        />
        <input
          type="number"
          placeholder="Age To"
          value={rangeFilters.ageTo}
          onChange={e => setRangeFilters(f => ({ ...f, ageTo: e.target.value }))}
          style={{ width: 90 }}
        />
        {/* Bat Dropdown */}
        <select value={filters.bat} onChange={(e) => setFilters((f) => ({ ...f, bat: e.target.value }))}>
          <option value="">Bat</option>
          <option value="L">L</option>
          <option value="R">R</option>
          <option value="S">S</option>
        </select>
        {/* Throw Dropdown */}
        <select value={filters.throw} onChange={(e) => setFilters((f) => ({ ...f, throw: e.target.value }))}>
          <option value="">Throw</option>
          <option value="L">L</option>
          <option value="R">R</option>
        </select>
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
              <th>Bat</th>
              <th>Throw</th>
              <th>Pre-Draft Team</th>
              <th>Slotted Bonus</th>
              <th>Signed Bonus</th>
              <th>+/- Diff</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, i) => {
              let bat = "";
              let throwVal = "";
              if (row.BatThrow && row.BatThrow.includes("/")) {
                const parts = row.BatThrow.split("/");
                bat = parts[0].trim();
                throwVal = parts[1].trim();
              }
              return (
                <tr key={i}>
                  <td>{row.Year}</td>
                  <td>{row.Round}</td>
                  <td>{row.Pick}</td>
                  <td>{row.RoundPick}</td>
                  <td>{row.Name}</td>
                  <td>{row.TeamDrafted}</td>
                  <td>{row.Position}</td>
                  <td>{row.AgeAtDraft}</td>
                  <td>{bat}</td>
                  <td>{throwVal}</td>
                  <td>{row.School && row.School.includes("HS") ? "HS" : row.School}</td>
                  <td>{row.SlottedBonus}</td>
                  <td style={{ color: row.SignedBonus === "(unsigned)" ? "#fff" : "#fff" }}>{row.SignedBonus}</td>
                  <td style={{ color: getDiffColor(row.Diff), fontWeight: "bold" }}>{row.Diff}</td>
                </tr>
              );
            })}
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