import React, { useEffect, useState } from "react";
import DraftTable from "./components/DraftTable";
import StatsBar from "./components/StatsBar";
import Papa from "papaparse";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filters, setFilters] = useState({
    year: "",
    round: "",
    pick: "",
    team: "",
    position: "",
    school: "",
    bat: "",
    throw: "",
    age: "",
    search: "",
  });

  const [rangeFilters, setRangeFilters] = useState({
    yearFrom: "",
    yearTo: "",
    roundFrom: "",
    roundTo: "",
    pickFrom: "",
    pickTo: "",
    ageFrom: "",
    ageTo: "",
  });

  useEffect(() => {
    fetch("/mlb_draft_all_cleaned.csv")
      .then((res) => res.text())
      .then((text) => {
        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            setData(results.data);
            setFiltered(results.data);
          },
        });
      });
  }, []);

  useEffect(() => {
    let filteredData = data;
    if (filters.year) filteredData = filteredData.filter((row) => row.Year === filters.year);
    if (rangeFilters.yearFrom) filteredData = filteredData.filter((row) => Number(row.Year) >= Number(rangeFilters.yearFrom));
    if (rangeFilters.yearTo) filteredData = filteredData.filter((row) => Number(row.Year) <= Number(rangeFilters.yearTo));
    if (filters.round) filteredData = filteredData.filter((row) => row.Round === filters.round);
    if (rangeFilters.roundFrom) filteredData = filteredData.filter((row) => Number(row.Round) >= Number(rangeFilters.roundFrom));
    if (rangeFilters.roundTo) filteredData = filteredData.filter((row) => Number(row.Round) <= Number(rangeFilters.roundTo));
    if (filters.pick) filteredData = filteredData.filter((row) => row.Pick === filters.pick);
    if (rangeFilters.pickFrom) filteredData = filteredData.filter((row) => Number(row.Pick) >= Number(rangeFilters.pickFrom));
    if (rangeFilters.pickTo) filteredData = filteredData.filter((row) => Number(row.Pick) <= Number(rangeFilters.pickTo));
    if (filters.team) filteredData = filteredData.filter((row) => row.TeamDrafted === filters.team);
    // Position filter with OF and P grouping
    if (filters.position) {
      if (filters.position === "OF") {
        filteredData = filteredData.filter((row) => ["OF", "CF", "RF", "LF"].includes(row.Position));
      } else if (filters.position === "P") {
        filteredData = filteredData.filter((row) => ["P", "SP", "SP1", "RP"].includes(row.Position));
      } else {
        filteredData = filteredData.filter((row) => row.Position === filters.position);
      }
    }
    // HS grouping logic for school filter
    if (filters.school) {
      if (filters.school === "HS") {
        filteredData = filteredData.filter((row) => row.School && row.School.includes("HS"));
      } else {
        filteredData = filteredData.filter((row) => row.School === filters.school);
      }
    }
    // Bat/Throw filtering using separate columns
    if (filters.bat) filteredData = filteredData.filter((row) => row.Bat === filters.bat);
    if (filters.throw) filteredData = filteredData.filter((row) => row.Throw === filters.throw);
    if (filters.age) filteredData = filteredData.filter(
      (row) => String(row.AgeAtDraft).trim() === String(filters.age).trim()
    );
    if (rangeFilters.ageFrom) filteredData = filteredData.filter((row) => Number(row.AgeAtDraft) >= Number(rangeFilters.ageFrom));
    if (rangeFilters.ageTo) filteredData = filteredData.filter((row) => Number(row.AgeAtDraft) <= Number(rangeFilters.ageTo));
    if (filters.search)
      filteredData = filteredData.filter((row) =>
        row.Name?.toLowerCase().includes(filters.search.toLowerCase())
      );
    setFiltered(filteredData);
  }, [filters, rangeFilters, data]);

  return (
    <div className="App" style={{ background: "#000", minHeight: "100vh", color: "#fff" }}>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "2rem 0",
          background: "transparent",
        }}
      >
        {/* Left image */}
        <img src="/website-1.jpg" alt="Website 1" style={{ width: 200, height: "auto" }} />

        {/* Center logo and titles */}
        <div style={{ textAlign: "center", flex: 1 }}>
          <img src="/website-logo.jpg" alt="Website Logo" style={{ width: 120, marginBottom: 16 }} />
          <h1>MLB Draft Database</h1>
          <h2 style={{ color: "#fff", fontWeight: "bold" }}>#GoDawgs</h2>
        </div>

        {/* Right image */}
        <img src="/website-2.jpg" alt="Website 2" style={{ width: 200, height: "auto" }} />
      </header>
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "1rem" }}>
        <StatsBar data={filtered} />
        <DraftTable
          data={data}
          filtered={filtered}
          setFilters={setFilters}
          filters={filters}
          rangeFilters={rangeFilters}
          setRangeFilters={setRangeFilters}
        />
      </main>
    </div>
  );
}

export default App;