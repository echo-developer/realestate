"use client";

import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { ChevronDown } from "lucide-react";
import LocalityOption from "../MapData/LocalitySelector";
import useTranslation from "@/hooks/useTranslation";
import { Accordion } from "react-bootstrap";
import AuthUser from "../Authentication/AuthUser";
import { useAuth } from "@/context/AuthProvider";

function RealEstateTrends() {
  const { callApi } = AuthUser();
  const { defaultCity } = useAuth();
  const [selectedCity, setSelectedCity] = useState("Kolkata");
  const [viewType, setViewType] = useState("Localities");
  const [propertyType, setPropertyType] = useState("Flats");
  const [selectedLocalities, setSelectedLocalities] = useState([]);
  const [data, setData] = useState(null);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const translation = useTranslation();
  const [showDropdown, setShowDropdown] = useState(false);
  // const cities = ["Kolkata", "Mumbai", "Delhi", "Bangalore"]; 
  const [city, setCity] = useState([]);

  const handleSelectCity = (city) => {
    setSelectedCity(city);
    setShowDropdown(false);
  };

  const fetchTrendingPropertyRates = async () => {
    try {
      const res = await callApi({
        api: `/property_trending_rates`,
        method: "GET",
        data: {
          city_id: defaultCity?.city_id,
        },
      });
      if (res && res?.status === 1) {
        setData(res?.data);
        const keys = Object.keys(res?.data?.priceDataforLocalities) || [];
        setSelectedLocalities(keys);
      }
    } catch (error) {
      console.error(error.message || "Something went wrong");
    }
  };

  useEffect(() => {
    if (defaultCity?.city_id) {
      fetchTrendingPropertyRates();
    }
  }, [defaultCity.city_id]);

  useEffect(() => {
    if (!data) return;

    const defaultKeys =
      viewType === "Localities"
        ? Object.keys(data.priceDataforLocalities || {})
        : Object.keys(data.priceDataforProjects || {});

    setSelectedLocalities(defaultKeys);
  }, [viewType, data]);

  const updateChart = () => {
    if (!chartRef.current || !data) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    const priceData =
      viewType === "Localities"
        ? data.priceDataforLocalities
        : data.priceDataforProjects;

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: data.months,
        datasets: selectedLocalities.map((name, index) => ({
          label: name,
          data: priceData[name] || [],
          borderColor: ["#E6B325", "#D9534F", "#93C54B", "#A991D4", "#2ECCC3"][
            index % 5
          ],
          tension: 0.3,
        })),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: false,
          },
        },
      },
    });
  };

  useEffect(() => {
    updateChart();
  }, [selectedLocalities, viewType, data]);

  const handleCheckboxChange = (name) => {
    setSelectedLocalities((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name]
    );
  };

  const listItems =
    viewType === "Localities" ? data?.localities : data?.projects;

  return (
    <div className="container mt-4 mb-4 ">
      <h1 className="mb-4 border-bottom pb-2">
        {translation?.rates_and_trends || "Rates and Trends"}
      </h1>

      {/* <div className="input-group mb-3 text-center">
        <LocalityOption />
        <a className="btn btn-primary btn-post" style={{ height: "38px" }}>
          {translation?.show_trends || "SHOW TRENDS"}
        </a>
      </div> */}

      <div className="card p-3">
        <div className="position-relative d-inline-block mb-3">
          <div
            className="d-flex align-items-center cursor-pointer"
            style={{ userSelect: "none" }}
          >
            <h2 className="h5 mb-0">
              {translation?.trends_for || "Trends for"} {defaultCity?.name || ""}
            </h2>
            {/* <ChevronDown className="ms-2" /> */}
          </div>

        </div>

        <div className="d-flex justify-content-between mb-3">
          <div>
            <span className="me-2">{translation?.for || "For"} </span>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="viewType"
                checked={viewType === "Localities"}
                onChange={() => {
                  setSelectedLocalities([]);
                  setViewType("Localities");
                }}
              />
              <label className="form-check-label">
                {translation?.localities || "Localities"}
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="viewType"
                checked={viewType === "Projects"}
                onChange={() => {
                  setSelectedLocalities([]);
                  setViewType("Projects");
                }}
              />
              <label className="form-check-label">
                {translation?.projects || "Projects"}
              </label>
            </div>
          </div>

          {/* <div>
            <span className="me-2">{translation?.for || "For"}</span>
            <select
              className="form-select d-inline w-auto"
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
            >
              <option>{translation?.flats || "Flats"}</option>
              <option>{translation?.houses || "Houses"}</option>
              <option>{translation?.plots || "Plots"}</option>
            </select>
          </div> */}
        </div>

        <div className="row">
          {/* Graph Section */}
          <div className="col-md-8">
            <div
              className="bg-white p-3 border rounded"
              style={{ height: "400px" }}
            >
              <canvas ref={chartRef}></canvas>
            </div>
          </div>

          {/* Locality/Project List Section */}
          <div className="col-md-4">
            <h3 className="h6">
              {viewType === "Localities"
                ? translation?.top_5_localities || "Top 5 Localities"
                : translation?.top_5_projects || "Top 5 Projects"}
            </h3>
            <ul className="list-group">
              {listItems?.map((item, index) => {
                const name = item?.name || item?.projectName;
                return (
                  <li
                    key={index}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <input
                        type="checkbox"
                        className="form-check-input me-2"
                        checked={selectedLocalities.includes(name)}
                        onChange={() => handleCheckboxChange(name)}
                      />
                      {name}
                    </div>
                    <span className="badge bg-secondary">
                      {item?.total_properties || 0}{" "}
                      {translation?.properties || "Properties"}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <p className="mt-3 text-muted">
          {selectedLocalities.length > 0
            ? `Currently displaying trends for: ${selectedLocalities.join(", ")}`
            : "No selections made. Please choose from the list to see trends."}
        </p>
        <Accordion defaultActiveKey="0" className="mt-5">
          <h2 className="h5 mb-3">
            {translation?.faq || "Frequently Asked Questions"}
          </h2>

          {[
            {
              question: `${translation?.what_effect_real || "What affects real estate price trends?"}`,
              answer:
                `${translation?.what_effect_real || "What affects real estate price trends?"}`

            },
            {
              question: `${translation?.price_trend_update_freq || "How often are the price trends updated?"}
`,
              answer:
                `${translation?.price_trend_update_answer || "Price trends are updated monthly based on market data, builder inputs, and verified property listings."}`,
            },
            {
              question: `${translation?.compare_price_trends || "Can I compare price trends of different localities?"}
`,
              answer:
                `${translation?.compare_price_trends_answer || "Yes, select multiple localities from the list to compare their price trends over time in the chart above."}
`,
            },
            {
              question: `${translation?.sudden_price_spike_reason || "Why do some areas show sudden price spikes?"}
`,
              answer:
                `${translation?.sudden_price_spike_answer || "Sudden spikes can be due to infrastructure development, new project launches, or increased buyer interest."}
`,
            },
            {
              question: `${translation?.avg_appreciation_rate || "What is the average price appreciation rate?"}
`,
              answer:
                `${translation?.avg_appreciation_rate_answer || "On average, real estate in prime localities appreciates 5–10% annually, but it varies by region."}
`,
            },
            {
              question: `${translation?.can_trends_predict || "Can price trends predict future property value?"}
`,
              answer:
                `${translation?.can_trends_predict_answer || "They provide insight, but future values depend on multiple factors like economy, development, and policies."}
`,
            },
            {
              question: `${translation?.commercial_trends || "Do commercial properties follow similar trends?"}
`,
              answer:
                `${translation?.commercial_trends_answer || "Commercial properties have their own trends, often tied to business activity and infrastructure."}
`,
            },
            {
              question: `${translation?.good_time_to_buy || "Is it a good time to buy property based on trends?"}
`,
              answer:
                `${translation?.good_time_to_buy_answer || "It depends on your financial readiness, interest rates, and the locality’s performance. Trends help inform the decision."}
`,
            },
            {
              question: `${translation?.trend_based_on_transactions || "Are trend values based on actual transactions?"}
`,
              answer:
                `${translation?.trend_based_on_transactions_answer || "Yes, trend data is aggregated from actual sales, listings, and verified market sources."}
`,
            },
            {
              question: `${translation?.trend_accuracy || "How accurate are these trend values?"}
`,
              answer:
                `${translation?.trend_accuracy_answer || "We strive for high accuracy by using multiple data sources, but they should be used as guidance, not exact figures."}
`,
            },
          ].map((faq, idx) => (
            <Accordion.Item eventKey={idx.toString()} key={idx}>
              <Accordion.Header>{faq.question}</Accordion.Header>
              <Accordion.Body>{faq.answer}</Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>

      </div>
    </div>
  );
}

export default RealEstateTrends;






