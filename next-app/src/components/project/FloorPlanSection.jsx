import { useState } from "react";

const FloorPlanSection = () => {
  const [activeTab, setActiveTab] = useState("kitchen");

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
          {/* <div className="owl-carousel owl-theme photos-carousel owl-loaded owl-drag">
            <div className="owl-stage-outer">
              <div className="owl-stage" style={{ transform: "translate3d(-159px, 0px, 0px)", transition: "all", width: "1275px" }}>
                <div className="owl-item" style={{ width: "139.375px", marginRight: "20px" }}>
                  <article className="item mb-3">
                    <img src="/assets/images/uploads/property-1.jpg" alt="Property" className="img-fluid rounded-3" />
                  </article>
                </div>
              </div>
            </div>
            <div className="owl-nav">
              <button type="button" role="presentation" className="owl-prev">
                <span aria-label="Previous" className="icon-line-awesome-angle-left"></span>
              </button>
              <button type="button" role="presentation" className="owl-next">
                <span aria-label="Next" className="icon-line-awesome-angle-right"></span>
              </button>
            </div>
            <div className="owl-dots">
              <button role="button" className="owl-dot active">
                <span></span>
              </button>
              <button role="button" className="owl-dot">
                <span></span>
              </button>
            </div>
          </div> */}

          {/* Tabs for different sections */}
          <ul className="nav nav-underline nav-fill border-bottom mb-3" role="tablist">
            {["kitchen", "floor", "electrical", "bathroom", "doors", "windows", "paints", "security", "rcc"].map((tab) => (
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
            {/* Kitchen Tab */}
            <div className={`tab-pane fade ${activeTab === "kitchen" ? "active show" : ""}`} id="kitchen-tab-pane" role="tabpanel" aria-labelledby="kitchen-tab">
              <ul className="g-col-3">
                <li>
                  Kitchen sink: <span className="text-muted">Stainless steel sink</span>
                </li>
                <li>
                  Exhaust fan: <span className="text-muted">Exhaust fan</span>
                </li>
                <li>
                  Gas supply: <span className="text-muted">Piped gas facility</span>
                </li>
                <li>
                  Kitchen platform: <span className="text-muted">Granite platform</span>
                </li>
                <li>
                  Water purifier: <span className="text-muted">Provision for water purifier</span>
                </li>
              </ul>
            </div>

            {/* Flooring Tab */}
            <div className={`tab-pane fade ${activeTab === "floor" ? "active show" : ""}`} id="floor-tab-pane" role="tabpanel" aria-labelledby="floor-tab">
              <ul className="g-col-3">
                <li>
                  Wooden Flooring: <span className="text-muted">Elegant, durable wooden floors</span>
                </li>
                <li>
                  Ceramic Tiles: <span className="text-muted">Water-resistant, easy-to-clean surface</span>
                </li>
                <li>
                  Marble Flooring: <span className="text-muted">Luxurious and timeless flooring</span>
                </li>
                <li>
                  Vinyl Flooring: <span className="text-muted">Affordable, low-maintenance option</span>
                </li>
              </ul>
            </div>

            {/* Electrical Tab */}
            <div className={`tab-pane fade ${activeTab === "electrical" ? "active show" : ""}`} id="electrical-tab-pane" role="tabpanel" aria-labelledby="electrical-tab">
              <ul className="g-col-3">
                <li>
                  Power Points: <span className="text-muted">Electrical outlets for devices</span>
                </li>
                <li>
                  Circuit Breakers: <span className="text-muted">Safety mechanism to prevent electrical overload</span>
                </li>
                <li>
                  LED Lights: <span className="text-muted">Energy-efficient lighting</span>
                </li>
                <li>
                  Wiring System: <span className="text-muted">Safe and organized electrical wiring</span>
                </li>
              </ul>
            </div>

            {/* Bathroom Tab */}
            <div className={`tab-pane fade ${activeTab === "bathroom" ? "active show" : ""}`} id="bathroom-tab-pane" role="tabpanel" aria-labelledby="bathroom-tab">
              <ul className="g-col-3">
                <li>
                  Shower Area: <span className="text-muted">Dedicated space for showers</span>
                </li>
                <li>
                  Toilet: <span className="text-muted">Standard bathroom commode</span>
                </li>
                <li>
                  Washbasin: <span className="text-muted">Sink for hand washing and grooming</span>
                </li>
                <li>
                  Mirror: <span className="text-muted">Reflective surface for bathroom use</span>
                </li>
              </ul>
            </div>

            {/* Doors Tab */}
            <div className={`tab-pane fade ${activeTab === "doors" ? "active show" : ""}`} id="doors-tab-pane" role="tabpanel" aria-labelledby="doors-tab">
              <ul className="g-col-3">
                <li>
                  Main Entrance Door: <span className="text-muted">Primary entry door</span>
                </li>
                <li>
                  Bedroom Doors: <span className="text-muted">Doors for bedrooms</span>
                </li>
                <li>
                  Bathroom Doors: <span className="text-muted">Doors for the bathroom</span>
                </li>
                <li>
                  Sliding Glass Doors: <span className="text-muted">Space-saving, modern doors</span>
                </li>
              </ul>
            </div>

            {/* Windows Tab */}
            <div className={`tab-pane fade ${activeTab === "windows" ? "active show" : ""}`} id="windows-tab-pane" role="tabpanel" aria-labelledby="windows-tab">
              <ul className="g-col-3">
                <li>
                  Casement Windows: <span className="text-muted">Hinged windows opening outward</span>
                </li>
                <li>
                  Sliding Windows: <span className="text-muted">Windows that slide horizontally</span>
                </li>
                <li>
                  Bay Windows: <span className="text-muted">Extend outward to provide panoramic views</span>
                </li>
                <li>
                  Frosted Glass: <span className="text-muted">Privacy-enhancing frosted windows</span>
                </li>
              </ul>
            </div>

            {/* Paints Tab */}
            <div className={`tab-pane fade ${activeTab === "paints" ? "active show" : ""}`} id="paints-tab-pane" role="tabpanel" aria-labelledby="paints-tab">
              <ul className="g-col-3">
                <li>
                  Wall Paint: <span className="text-muted">Primary interior wall paint</span>
                </li>
                <li>
                  Waterproof Coating: <span className="text-muted">Protection against water damage</span>
                </li>
                <li>
                  Eco-friendly Paint: <span className="text-muted">Low-VOC, safe paints</span>
                </li>
                <li>
                  Glossy Finish: <span className="text-muted">High-shine, durable paint finish</span>
                </li>
              </ul>
            </div>

            {/* Security Tab */}
            <div className={`tab-pane fade ${activeTab === "security" ? "active show" : ""}`} id="security-tab-pane" role="tabpanel" aria-labelledby="security-tab">
              <ul className="g-col-3">
                <li>
                  CCTV Surveillance: <span className="text-muted">Monitors for security</span>
                </li>
                <li>
                  Alarm Systems: <span className="text-muted">Intruder detection systems</span>
                </li>
                <li>
                  Intercom Systems: <span className="text-muted">Communication at the entrance</span>
                </li>
                <li>
                  Smart Locks: <span className="text-muted">Keyless entry for enhanced security</span>
                </li>
              </ul>
            </div>

            {/* RCC Tab */}
            <div className={`tab-pane fade ${activeTab === "rcc" ? "active show" : ""}`} id="rcc-tab-pane" role="tabpanel" aria-labelledby="rcc-tab">
              <ul className="g-col-3">
                <li>
                  Foundations: <span className="text-muted">Strong base for structure</span>
                </li>
                <li>
                  Columns: <span className="text-muted">Vertical supports for weight-bearing</span>
                </li>
                <li>
                  Beams: <span className="text-muted">Horizontal load-distributing elements</span>
                </li>
                <li>
                  Slabs: <span className="text-muted">Flat surfaces for floors/roofs</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FloorPlanSection;
