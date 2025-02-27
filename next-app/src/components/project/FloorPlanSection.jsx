import { useState } from "react";
import useTranslation from "@/hooks/useTranslation";

const FloorPlanSection = ({ detailsData }) => {
  const [activeTab, setActiveTab] = useState("kitchen");
const translation = useTranslation();
  // Map floor plans from the provided detailsData
  const floorPlanData = detailsData?.floor_plans?.reduce((acc, plan) => {
    acc[plan.slug] = plan.items.map((item) => ({
      item: item.item,
      description: item.description,
    }));
    return acc;
  }, {});

  return (
    <section id="floor-plan" className="mb-4">
      <div className="card border-0 shadow-1 mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between">
            <h4 className="mb-3 text-primary">
            {translation?.real_estate_floor_plan_units || " Real Estate Floor Plan &; Units"}
            </h4>
          </div>

          {/* Tabs for different sections */}
          <ul
            className="nav nav-underline nav-fill border-bottom mb-3"
            role="tablist"
          >
            {floorPlanData &&
              Object?.keys(floorPlanData)?.map((tab) => (
                <li className="nav-item" role="presentation" key={tab}>
                  <a
                    role="button"
                    className={`nav-link ${activeTab === tab ? "active" : ""}`}
                    id={`${tab}-tab`}
                    onClick={() => setActiveTab(tab)}
                    aria-selected={activeTab === tab}
                  >
                    {tab?.charAt(0)?.toUpperCase() + tab.slice(1)}
                  </a>
                </li>
              ))}
          </ul>

          <div className="tab-content" id="myTabContent">
            {floorPlanData &&
              Object?.keys(floorPlanData)?.map((tab) => (
                <div
                  key={tab}
                  className={`tab-pane fade ${
                    activeTab === tab ? "active show" : ""
                  }`}
                  id={`${tab}-tab-pane`}
                  role="tabpanel"
                  aria-labelledby={`${tab}-tab`}
                >
                  {floorPlanData[tab]?.length > 0 ? (
                    <ul className="g-col-3">
                      {floorPlanData[tab]?.map((item, index) => (
                        <li key={index}>
                          {item.item}:{" "}
                          <span className="text-muted">{item.description}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted">{translation?.no_items_available || "No items available."}</p>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FloorPlanSection;
