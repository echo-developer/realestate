import React, { useState, useEffect } from "react";
import { Doughnut, Bar, Line } from "react-chartjs-2";
import moment from "moment";
import useTranslation from "@/hooks/useTranslation";
import { Row, Col } from "react-bootstrap";

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

const ChartsRow = ({ dashboardList }) => {
  const doughnutOptions = {
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          usePointStyle: true,
          pointStyle: "circle", // ✅ circle bullets!
        },
      },
    },
  };
  const [doughnutData, setDoughnutData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [
          "#1365CF",
          "#E8527C",
          "#189634",
          "#A168DF",
          "#F3C58B",
          "#F39C12",
        ],
        hoverBackgroundColor: [
          "#164b8c",
          "#a1395c",
          "#13762c",
          "#7f3ab5",
          "#d9a264",
          "#d68910",
        ],
      },
    ],
  });
  const [barData, setBarData] = useState({
    labels: [],
    datasets: [
      {
        label: "Enquiries",
        data: [],
        backgroundColor: "rgba(19, 101, 207, 0.5)",
        borderColor: "rgb(19, 101, 207)",
        borderWidth: 1,
      },
    ],
  });
  const [viewbarData, setViewBarData] = useState({
    labels: [],
    datasets: [
      {
        label: "Views",
        data: [],
        backgroundColor: "rgba(19, 101, 207, 0.5)",
        borderColor: "rgb(19, 101, 207)",
        borderWidth: 1,
      },
    ],
  });

  const translation = useTranslation();
  useEffect(() => {
    if (dashboardList?.enqueryBargraph) {
      const sortedData = dashboardList?.enqueryBargraph.sort((a, b) =>
        moment(a.month).diff(moment(b.month))
      );

      const labels = sortedData.map((item) =>
        moment(item.month).format("MMMM YYYY")
      );
      const data = sortedData.map((item) => item.enquiry_count);

      setBarData((prev) => ({
        ...prev,
        labels,
        datasets: [{ ...prev.datasets[0], data }],
      }));
    }
  }, [dashboardList?.enqueryBargraph]);

  useEffect(() => {
    if (dashboardList?.viewBargraph) {
      const sortedData = dashboardList?.viewBargraph.sort((a, b) =>
        moment(a.month).diff(moment(b.month))
      );

      const labels = sortedData.map((item) =>
        moment(item.month).format("MMMM YYYY")
      );
      const data = sortedData.map((item) => item.total_views);

      setViewBarData((prev) => ({
        ...prev,
        labels,
        datasets: [{ ...prev.datasets[0], data }],
      }));
    }
  }, [dashboardList?.viewBargraph]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  useEffect(() => {
    if (dashboardList?.propPieChart) {
      const labels = dashboardList?.propPieChart
        .filter((item) => item.group) // Ignore items without "group"
        .map((item) => item.group);

      const data = dashboardList?.propPieChart
        .filter((item) => item.group)
        .map((item) => item.count);

      setDoughnutData((prev) => ({
        ...prev,
        labels,
        datasets: [{ ...prev.datasets[0], data }],
      }));
    }
  }, [dashboardList?.propPieChart]);


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

  const dropdownOptions = ["Weekly", "Monthly", "Yearly"];

  return (
    <>
      <Row>
        {/* Doughnut Chart */}
        <Col lg={6} xs={12}>
          <div className="card border-0 mb-4">
            <div className="card-body">
              <div
                // className="mx-auto"
                className={`mx-auto ${doughnutData?.labels?.length > 0 ? '' : 'd-flex flex-column justify-content-center align-items-center'}`}
                style={{ width: "320px", height: "320px" }}
              >
                {doughnutData?.labels?.length > 0 ? (<>
                  <Doughnut data={doughnutData} options={doughnutOptions} /></>) : (<><img
                    alt="Icon"
                    height="48"
                    width="48"
                    className="mb-2"
                    loading="lazy"
                    src="/assets/images/icons/9939447.png"
                  />
                    <p className="text-muted">No Record Found</p></>)}
              </div>
            </div>
          </div>
        </Col>

        {/* Bar Chart 1 */}
        <Col lg={6} xs={12}>
          <div className="card border-0 mb-4">
            <div className="card-body">
              <div
                className="mx-auto"
                style={{ width: "100%", height: "320px" }}
              >
                <Bar data={barData} options={chartOptions} />
              </div>
            </div>
          </div>
        </Col>

        {/* Bar Chart 2 */}
        <Col lg={6} xs={12}>
          <div className="card border-0 mb-4">
            <div className="card-body">
              <div
                className="mx-auto"
                style={{
                  width: "100%",
                  height: "320px",
                }}
              >
                <Bar data={viewbarData} options={chartOptions} />
              </div>
            </div>
          </div>
        </Col>
      </Row>

      <Row>
        {/* Sale Summary */}
        {/* <Col lg={6} xs={12}>
          <div className="card border-0 mb-4">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h4 className="text-primary">{translation?.sale_summary || 'Sale Summary'}
              </h4>
            </div>
            <div className="card-body">
              <Line data={lineData} options={chartOptions} />
            </div>
          </div>
        </Col> */}

        {/* Active Buyers */}
        {/* <Col lg={6} xs={12}>
          <div className="card border-0 mb-4">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h4 className="text-primary">{translation?.active_buyers || 'Active Buyers'}
              </h4>
            </div>
            <div className="card-body">
              <Line data={lineData} options={chartOptions} />
            </div>
          </div>
        </Col> */}
      </Row>
    </>
  );
};

export default ChartsRow;
