import React from "react";
import { Doughnut, Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement
);

const ChartsRow = () => {
  // Data for Doughnut Chart
  const doughnutData = {
    labels: ["Rent", "Sale", "Leads", "Apartment", "House/Villa"],
    datasets: [
      {
        data: [320, 230, 550, 150, 200],
        backgroundColor: ["#1365CF", "#E8527C", "#189634", "#A168DF", "#F3C58B"],
        hoverBackgroundColor: ["#164b8c", "#a1395c", "#13762c", "#7f3ab5", "#d9a264"],
      },
    ],
  };

  // Data for Bar and Line Charts
  const barData = {
    labels: ["January", "February", "March", "April", "May"],
    datasets: [
      {
        label: "Sales",
        data: [122, 129, 333, 522, 2222],
        backgroundColor: "rgba(19, 101, 207, 0.5)",
        borderColor: "rgb(19, 101, 207)",
        borderWidth: 1,
      },
    ],
  };

  const lineData = {
    labels: ["January", "February", "March", "April", "May"],
    datasets: [
      {
        label: "Active Buyers",
        data: [50, 80, 70, 90, 120],
        borderColor: "rgba(232, 82, 124, 0.8)",
        backgroundColor: "rgba(232, 82, 124, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  // Dropdown options
  const dropdownOptions = ["Weekly", "Monthly", "Yearly"];

  return (
    <>
      <div className="row">
        {/* Doughnut Chart */}
        <div className="col-lg-4">
          <div className="card border-0 mb-4">
            <div className="card-body">
              <div
                className="mx-auto"
                style={{
                  width: "250px",
                  height: "250px",
                }}
              >
                <Doughnut data={doughnutData} />
              </div>
            </div>
          </div>
        </div>

        {/* Bar Chart 1 */}
        <div className="col-lg-4">
          <div className="card border-0 mb-4">
            <div className="card-body">
              <div
                className="mx-auto"
                style={{
                  width: "100%",
                  height: "250px",
                }}
              >
                <Bar data={barData} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>

        {/* Bar Chart 2 */}
        <div className="col-lg-4">
          <div className="card border-0 mb-4">
            <div className="card-body">
              <div
                className="mx-auto"
                style={{
                  width: "100%",
                  height: "250px",
                }}
              >
                <Bar data={barData} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Sale Summary */}
        <aside className="col-lg-6">
          <div className="card border-0 mb-4">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h4 className="text-primary">Sale Summary</h4>
              <select className="form-select form-select-sm" style={{ width: "110px" }}>
                <option disabled selected>
                  Sort By
                </option>
                {dropdownOptions.map((option, index) => (
                  <option key={index}>{option}</option>
                ))}
              </select>
            </div>
            <div className="card-body">
              <Line data={lineData} options={chartOptions} />
            </div>
          </div>
        </aside>

        {/* Active Buyers */}
        <aside className="col-lg-6">
          <div className="card border-0 mb-4">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h4 className="text-primary">Active Buyers</h4>
              <select className="form-select form-select-sm" style={{ width: "110px" }}>
                <option disabled selected>
                  Sort By
                </option>
                {dropdownOptions.map((option, index) => (
                  <option key={index}>{option}</option>
                ))}
              </select>
            </div>
            <div className="card-body">
              <Line data={lineData} options={chartOptions} />
            </div>
          </div>
        </aside>
      </div>
    </>
  );
};

export default ChartsRow;
