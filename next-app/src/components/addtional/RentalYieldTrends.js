"use client";

import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import "bootstrap/dist/css/bootstrap.min.css";
import useTranslation from "@/hooks/useTranslation";

function RentalYieldTrends() {
  const [selectedPropertyType, setSelectedPropertyType] = useState("Flats");
  const [selectedLocalities, setSelectedLocalities] = useState([
    "Kankurgachi",
    "Behala Chowrasta",
  ]);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
const translation = useTranslation();
  const data = {
    months: [
      "May'24",
      "Jun'24",
      "Jul'24",
      "Aug'24",
      "Sep'24",
      "Oct'24",
      "Nov'24",
      "Dec'24",
      "Jan'25",
    ],
    rentalYieldData: {
      Kankurgachi: [3.8, 3.4, 3.5, 3.5, 3.4, 3.4, 3.5, 3.6, 3.3],
      "Behala Chowrasta": [4.6, 4.3, 4.3, 4.2, 4.1, 4.0, 4.1, 4.2, 4.3],
    },
    localities: [
      { name: "Kankurgachi", properties: 293 },
      { name: "Behala Chowrasta", properties: 176 },
    ],
  };

  useEffect(() => {
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
          data: data.rentalYieldData[locality],
          borderColor: ["#E6B325", "#D9534F"][index],
          tension: 0.3,
        })),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: false, min: 3, max: 5 },
        },
      },
    });
  }, [selectedLocalities]);

  const toggleLocality = (locality) => {
    setSelectedLocalities((prev) =>
      prev.includes(locality)
        ? prev.filter((item) => item !== locality)
        : [...prev, locality]
    );
  };

  return (
    <div className="container mt-4 mb-4">
      <h1 className="mb-4 border-bottom pb-2">Locality Rental Yield</h1>
      <div className="d-flex justify-content-between mb-3">
        <span>For</span>
        <select
          className="form-select d-inline w-auto"
          value={selectedPropertyType}
          onChange={(e) => setSelectedPropertyType(e.target.value)}
        >
          <option>Flats</option>
          <option>Houses</option>
          <option>Plots</option>
        </select>
      </div>

      <div className="card p-3">
        <div className="row">
          <div className="col-md-8">
            <div
              className="bg-white p-3 border rounded"
              style={{ height: "400px" }}
            >
              <canvas ref={chartRef}></canvas>
            </div>
          </div>

          <div className="col-md-4">
            <h3 className="h6">Top 2 Localities</h3>
            <ul className="list-group">
              {data.localities.map((locality, index) => (
                <li
                  key={index}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    <input
                      type="checkbox"
                      className="form-check-input me-2"
                      checked={selectedLocalities.includes(locality.name)}
                      onChange={() => toggleLocality(locality.name)}
                    />
                    {locality.name}
                  </div>
                  <span className="badge bg-secondary">
                    {locality.properties} Properties
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-3 text-muted">
          *Rental Yield represents annual return from renting your house in that locality.
        </p>
      </div>
    </div>
  );
}

export default RentalYieldTrends;