

import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [table, setTable] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" }); // State for sorting
  const [filterColumn, setFilterColumn] = useState(""); // Column to filter (Low or High)
  const [filterRange, setFilterRange] = useState({ min: "", max: "" }); // Filter range (min and max)

  useEffect(() => {
    axios.get('http://localhost:5000/getData')
      .then((response) => {
        setTable(response.data);
      })
      .catch(err => console.log(err));
  }, []);

  const filteredTable = table
    .filter((item) => {
      const matchesSearch = (
        item.date?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.low?.toString().includes(searchTerm) ||
        item.high?.toString().includes(searchTerm) ||
        item.close?.toString().includes(searchTerm) ||
        item.sharesTraded?.toString().includes(searchTerm) ||
        item.turnover?.toString().includes(searchTerm)
      );

      const matchesFilter = filterColumn
        ? (filterColumn === "low" && item.low >= (filterRange.min || 0) && item.low <= (filterRange.max || Infinity)) ||
          (filterColumn === "high" && item.high >= (filterRange.min || 0) && item.high <= (filterRange.max || Infinity)) ||
          (filterColumn === "close" && item.close >= (filterRange.min || 0) && item.close <= (filterRange.max || Infinity)) || 
          (filterColumn === "turnover" && item.turnover >= (filterRange.min || 0) && item.turnover <= (filterRange.max || Infinity)) 
        : true;

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortConfig.key) {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (sortConfig.direction === "asc") {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      }
      return 0; 
    });

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        // Toggle direction if the same column is clicked
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      } else {
        // Sort ascending by default for new column
        return { key, direction: "asc" };
      }
    });
  };

  return (
    <div className="w-100 vh-60 mt-1 d-flex justify-content-center align-items-center">
      <div className="w-75">
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Search for data..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Update search term
        />

        <div className="mb-3">
          <select
            className="form-select"
            value={filterColumn}
            onChange={(e) => setFilterColumn(e.target.value)}
          >
            <option value="">Select Column to Filter</option>
            <option value="low">Low</option>
            <option value="high">High</option>
            <option value="close">Close</option>
            <option value="turnover">Turnover</option>
          </select>
          <div className="d-flex mt-2">
            <input
              type="number"
              className="form-control me-2"
              placeholder="Min Value"
              value={filterRange.min}
              onChange={(e) => setFilterRange({ ...filterRange, min: e.target.value })}
            />
            <input
              type="number"
              className="form-control"
              placeholder="Max Value"
              value={filterRange.max}
              onChange={(e) => setFilterRange({ ...filterRange, max: e.target.value })}
            />
          </div>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th onClick={() => handleSort("low")} style={{ cursor: "pointer" }}>
                Low {sortConfig.key === "low" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
              </th>
              <th onClick={() => handleSort("high")} style={{ cursor: "pointer" }}>
                High {sortConfig.key === "high" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
              </th>
              <th onClick={() => handleSort("close")} style={{ cursor: "pointer" }}>
                Close {sortConfig.key === "close" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
              </th>
              <th>Shared Price</th>
              <th onClick={() => handleSort("turnover")} style={{ cursor: "pointer" }}>
              Turnover {sortConfig.key === "turnober" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredTable.map((item) => (
              <tr key={item._id}>
                <td>{item.date}</td>
                <td>{item.low}</td>
                <td>{item.high}</td>
                <td>{item.close}</td>
                <td>{item.sharesTraded}</td>
                <td>{item.turnover}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Message when no results are found */}
        {filteredTable.length === 0 && (
          <div className="text-center">No matching results found.</div>
        )}
      </div>
    </div>
  );
}

export default App;
