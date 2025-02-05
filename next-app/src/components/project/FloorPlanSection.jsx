import { useState } from "react";

const FloorPlanSection = () => {
  const [activeTab, setActiveTab] = useState("kitchen");

  const floorPlanData = {
    kitchen: [
      { item: "Kitchen sink", description: "Stainless steel sink" },
      { item: "Exhaust fan", description: "Exhaust fan" },
      { item: "Gas supply", description: "Piped gas facility" },
      { item: "Kitchen platform", description: "Granite platform" },
      { item: "Water purifier", description: "Provision for water purifier" },
    ],
    floor: [
      { item: "Wooden Flooring", description: "Elegant, durable wooden floors" },
      { item: "Ceramic Tiles", description: "Water-resistant, easy-to-clean surface" },
      { item: "Marble Flooring", description: "Luxurious and timeless flooring" },
      { item: "Vinyl Flooring", description: "Affordable, low-maintenance option" },
    ],
    electrical: [
      { item: "Power Points", description: "Electrical outlets for devices" },
      { item: "Circuit Breakers", description: "Safety mechanism to prevent electrical overload" },
      { item: "LED Lights", description: "Energy-efficient lighting" },
      { item: "Wiring System", description: "Safe and organized electrical wiring" },
    ],
    bathroom: [
      { item: "Shower Area", description: "Dedicated space for showers" },
      { item: "Toilet", description: "Standard bathroom commode" },
      { item: "Washbasin", description: "Sink for hand washing and grooming" },
      { item: "Mirror", description: "Reflective surface for bathroom use" },
    ],
    doors: [
      { item: "Main Entrance Door", description: "Primary entry door" },
      { item: "Bedroom Doors", description: "Doors for bedrooms" },
      { item: "Bathroom Doors", description: "Doors for the bathroom" },
      { item: "Sliding Glass Doors", description: "Space-saving, modern doors" },
    ],
    windows: [
      { item: "Casement Windows", description: "Hinged windows opening outward" },
      { item: "Sliding Windows", description: "Windows that slide horizontally" },
      { item: "Bay Windows", description: "Extend outward to provide panoramic views" },
      { item: "Frosted Glass", description: "Privacy-enhancing frosted windows" },
    ],
    paints: [
      { item: "Wall Paint", description: "Primary interior wall paint" },
      { item: "Waterproof Coating", description: "Protection against water damage" },
      { item: "Eco-friendly Paint", description: "Low-VOC, safe paints" },
      { item: "Glossy Finish", description: "High-shine, durable paint finish" },
    ],
    security: [
      { item: "CCTV Surveillance", description: "Monitors for security" },
      { item: "Alarm Systems", description: "Intruder detection systems" },
      { item: "Intercom Systems", description: "Communication at the entrance" },
      { item: "Smart Locks", description: "Keyless entry for enhanced security" },
    ],
    rcc: [
      { item: "Foundations", description: "Strong base for structure" },
      { item: "Columns", description: "Vertical supports for weight-bearing" },
      { item: "Beams", description: "Horizontal load-distributing elements" },
      { item: "Slabs", description: "Flat surfaces for floors/roofs" },
    ],
  };

  return (
    <section id="floor-plan" className="mb-4">
      <div className="card border-0 shadow-1 mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between">
            <h4 className="mb-3 text-primary">Real Estate Floor Plan &amp; Units</h4>
            <h5>
              <a href="#">
                View All Photos <i className="bi bi-arrow-right"></i>
              </a>
            </h5>
          </div>

          {/* Tabs for different sections */}
          <ul className="nav nav-underline nav-fill border-bottom mb-3" role="tablist">
            {Object.keys(floorPlanData).map((tab) => (
              <li className="nav-item" role="presentation" key={tab}>
                <a
                  className={`nav-link ${activeTab === tab ? "active" : ""}`}
                  id={`${tab}-tab`}
                  onClick={() => setActiveTab(tab)}
                  aria-selected={activeTab === tab}
                  role="tab"
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </a>
              </li>
            ))}
          </ul>

          <div className="tab-content" id="myTabContent">
            {Object.keys(floorPlanData).map((tab) => (
              <div
                key={tab}
                className={`tab-pane fade ${activeTab === tab ? "active show" : ""}`}
                id={`${tab}-tab-pane`}
                role="tabpanel"
                aria-labelledby={`${tab}-tab`}
              >
                <ul className="g-col-3">
                  {floorPlanData[tab].map((item, index) => (
                    <li key={index}>
                      {item.item}: <span className="text-muted">{item.description}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FloorPlanSection;
