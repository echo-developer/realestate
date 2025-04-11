import { useState } from "react";
import { Dropdown, Button, Form, Container, Row, Col } from "react-bootstrap";

const PropertyFilter = () => {
  const [selectedCategory, setSelectedCategory] = useState("Commercial");
  const [selectedType, setSelectedType] = useState("");
  const [location, setLocation] = useState("");
  const [selectedBudget, setSelectedBudget] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedBedrooms, setSelectedBedrooms] = useState("");
  const [selectedParking, setSelectedParking] = useState("");

  const propertyTypes = {
    Residential: ["Apartment", "Villa", "Townhouse"],
    Commercial: [
      "Office",
      "Shop",
      "Warehouse",
      "Commercial Villa",
      "Commercial Plot",
      "Commercial Building",
      "Industrial Land",
      "Showroom",
      "Labour Camp",
      "Bulk Unit",
      "Commercial Floor",
      "Factory",
      "Mixed Use Land",
      "Other Commercial",
    ],
  };

  const handleTypeSelection = (type) => {
    setSelectedType(type);
  };

  return (
    <div className="cf1ef6f4">
      <div className="_10628dba _8b01c418 FilterDesign2022">
        <div className="_948d9e0a d48a5292 e1c7c3d4">
          {/* Buy / Rent Toggle */}
          <div aria-label="Purpose filter">
            <div className="_4415c3d9">
              <button className={`aa693f28 _59bbd8c6 ${selectedCategory === "Buy" ? "_409cfca5" : ""}`} onClick={() => setSelectedCategory("Buy")}>
                Buy
              </button>
              <button className={`aa693f28 _59bbd8c6 ${selectedCategory === "Rent" ? "_409cfca5" : ""}`} onClick={() => setSelectedCategory("Rent")}>
                Rent
              </button>
            </div>
          </div>

          {/* Location Input */}
          <div className="_7571b11b ee51901f _3dbcaafa FilterDesign2022" aria-label="Location filter" name="location">
            <div className="_2f4179a8 FilterDesign2022">
              <label className="e971c3da FilterDesign2022">Location</label>
              <div className="b349eb12 a4d351d5 _2c4893ca">
                <input type="text" placeholder="Enter location" className="c5ccf0e1 FilterDesign2022 _89f3954d" value={location} onChange={(e) => setLocation(e.target.value)} />
              </div>
            </div>
          </div>

          {/* Property Type Dropdown */}
          <div className="_7571b11b d7f75fd0 FilterDesign2022" name="property type">
            <div className="c4c7bd5f FilterDesign2022 _6a9bbcff">
              <label className="e971c3da FilterDesign2022">Property Type</label>
              <Dropdown>
                <Dropdown.Toggle variant="outline-secondary" className="f3117e76 FilterDesign2022">
                  {selectedType || "Select Property Type"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {propertyTypes[selectedCategory].map((type) => (
                    <Dropdown.Item key={type} onClick={() => handleTypeSelection(type)}>
                      {type}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>

          {/* Area Dropdown */}
          <div className="_7571b11b d7f75fd0 FilterDesign2022" name="AREA (sqft)">
            <div className="c4c7bd5f FilterDesign2022 _6a9bbcff">
              <label className="e971c3da FilterDesign2022">Area (sqft)</label>
              <Dropdown>
                <Dropdown.Toggle variant="outline-secondary" className="f3117e76 FilterDesign2022">
                  {selectedSize || "Select Size"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {["500-1000", "1000-2000", "2000+"].map((size) => (
                    <Dropdown.Item key={size} onClick={() => setSelectedSize(size)}>
                      {size}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>

          {/* Price Dropdown */}
          <div className="_7571b11b d7f75fd0 FilterDesign2022" name="Price (AED)">
            <div className="c4c7bd5f FilterDesign2022 _6a9bbcff">
              <label className="e971c3da FilterDesign2022">Price (AED)</label>
              <Dropdown>
                <Dropdown.Toggle variant="outline-secondary" className="f3117e76 FilterDesign2022">
                  {selectedBudget || "Select Budget"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {["< 500K", "500K - 1M", "1M - 2M", "2M+"].map((budget) => (
                    <Dropdown.Item key={budget} onClick={() => setSelectedBudget(budget)}>
                      {budget}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>

          {/* Bedrooms Dropdown */}
          {selectedCategory !== "Commercial" && (
            <div className="_7571b11b d7f75fd0 FilterDesign2022">
              <div className="c4c7bd5f FilterDesign2022 _6a9bbcff">
                <label className="e971c3da FilterDesign2022">Bedrooms</label>
                <Dropdown>
                  <Dropdown.Toggle variant="outline-secondary" className="f3117e76 FilterDesign2022">
                    {selectedBedrooms || "Select Bedrooms"}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {[1, 2, 3, 4, "5+"].map((bedroom) => (
                      <Dropdown.Item key={bedroom} onClick={() => setSelectedBedrooms(bedroom)}>
                        {bedroom}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          )}

          {/* Parking Dropdown */}
          <div className="_7571b11b d7f75fd0 FilterDesign2022">
            <div className="c4c7bd5f FilterDesign2022 _6a9bbcff">
              <label className="e971c3da FilterDesign2022">Parking</label>
              <Dropdown>
                <Dropdown.Toggle variant="outline-secondary" className="f3117e76 FilterDesign2022">
                  {selectedParking || "Select Parking"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {["None", "1 Space", "2 Spaces", "3+ Spaces"].map((option) => (
                    <Dropdown.Item key={option} onClick={() => setSelectedParking(option)}>
                      {option}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>

          {/* Search Button */}
          <a href="#" className="_6219ce30 aaf1e20a FilterDesign2022" role="button" aria-label="Find button">
            Search
          </a>
        </div>
      </div>
    </div>
  );
};

export default PropertyFilter;
