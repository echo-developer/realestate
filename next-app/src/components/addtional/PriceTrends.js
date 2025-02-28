"use client";

import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { ChevronDown } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import LocalityOption from "../MapData/LocalitySelector";

function RealEstateTrends() {
  const [selectedCity, setSelectedCity] = useState("Kolkata");
  const [viewType, setViewType] = useState("Localities");
  const [propertyType, setPropertyType] = useState("Flats");
  const [selectedLocalities, setSelectedLocalities] = useState([
    "Burdwan Road",
    "Alipore",
    "New Alipore",
    "Kona Expressway",
    "Shippur",
  ]);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const data = {
    months: [
      "May'24", "Jun'24", "Jul'24", "Aug'24", "Sep'24",
      "Oct'24", "Nov'24", "Dec'24", "Jan'25",
    ],
    priceData: {
      "Burdwan Road": [12500, 12300, 12500, 12700, 14000, 12500, 13200, 12700, 15000],
      "Alipore": [12800, 12500, 13000, 12700, 14200, 12600, 13300, 12800, 15100],
      "New Alipore": [7600, 7700, 7600, 7500, 7800, 8500, 8300, 8400, 9300],
      "Kona Expressway": [4500, 5500, 6000, 5500, 6000, 5800, 6200, 6700, 6900],
      "Shippur": [3000, 4000, 4200, 4500, 5500, 4000, 5200, 5300, 5400],
    },
    localities: [
      { name: "Burdwan Road", properties: 233 },
      { name: "Alipore", properties: 228 },
      { name: "New Alipore", properties: 606 },
      { name: "Kona Expressway", properties: 413 },
      { name: "Shippur", properties: 68 },
    ],
  };

  // Function to update chart based on selected localities
  const updateChart = () => {
    if (!chartRef.current) return;
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: data.months,
        datasets: selectedLocalities.map((locality, index) => ({
          label: locality,
          data: data.priceData[locality],
          borderColor: ["#E6B325", "#D9534F", "#93C54B", "#A991D4", "#2ECCC3"][index % 5],
          tension: 0.3,
        })),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: false, min: 2500, max: 17500 },
        },
      },
    });
  };

  useEffect(() => {
    updateChart();
  }, [selectedLocalities]); // Re-run when selectedLocalities change

  // Handle checkbox toggle
  const handleCheckboxChange = (locality) => {
    setSelectedLocalities((prev) =>
      prev.includes(locality)
        ? prev.filter((item) => item !== locality)
        : [...prev, locality]
    );
  };

  return (
    <div className="container mt-4 mb-4">
      <h1 className="mb-4 border-bottom pb-2">Rates and Trends</h1>

      <div className="input-group mb-3">
        <LocalityOption />
        <a className="btn btn-primary btn-post">SHOW TRENDS</a>
      </div>

      <div className="card p-3">
        <div className="d-flex align-items-center mb-3">
          <h2 className="h5 mb-0">Trends for {selectedCity}</h2>
          <ChevronDown className="ms-2" />
        </div>

        <div className="d-flex justify-content-between mb-3">
          <div>
            <span className="me-2">For</span>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="viewType"
                checked={viewType === "Localities"}
                onChange={() => setViewType("Localities")}
              />
              <label className="form-check-label">Localities</label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="viewType"
                checked={viewType === "Projects"}
                onChange={() => setViewType("Projects")}
              />
              <label className="form-check-label">Projects</label>
            </div>
          </div>

          <div>
            <span className="me-2">For</span>
            <select
              className="form-select d-inline w-auto"
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
            >
              <option>Flats</option>
              <option>Houses</option>
              <option>Plots</option>
            </select>
          </div>
        </div>

        <div className="row">
          {/* Graph Section */}
          <div className="col-md-8">
            <div className="bg-white p-3 border rounded" style={{ height: "400px" }}>
              <canvas ref={chartRef}></canvas>
            </div>
          </div>

          {/* Locality List Section */}
          <div className="col-md-4">
            <h3 className="h6">Top 5 Localities</h3>
            <ul className="list-group">
              {data.localities.map((locality, index) => (
                <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <input
                      type="checkbox"
                      className="form-check-input me-2"
                      checked={selectedLocalities.includes(locality.name)}
                      onChange={() => handleCheckboxChange(locality.name)}
                    />
                    {locality.name}
                  </div>
                  <span className="badge bg-secondary">{locality.properties} Properties</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-3 text-muted">
          {selectedLocalities.length > 0
            ? `Currently displaying trends for: ${selectedLocalities.join(", ")}`
            : "No localities selected. Please select at least one locality."}
        </p>
      </div>
    </div>
  );
}

export default RealEstateTrends;
