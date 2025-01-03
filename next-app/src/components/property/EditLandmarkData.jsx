import React, { useState, useEffect } from "react";
import { Landmark_tab } from "../post/PropertyData";

const LandmarkComponent = ({ value, onChange, propertyData }) => {
  // Set the initial form data based on the provided `landmark` data
  const initialFormData = value?.landmark || propertyData?.landmark || {
    "education": [{ key: "education1", name: "Holy Conventional School", distance: "4 km" }],
    "healthcare": [{ key: "healthcare1", name: "City Hospital", distance: "3 km" }],
    "shopping center": [{ key: "", name: "", distance: "" }],
    "commercial hub": [{ key: "", name: "", distance: "" }],
    "transpotation hub": [{ key: "", name: "", distance: "" }],
  };

  const [formData, setFormData] = useState(initialFormData);
  const [activeTab, setActiveTab] = useState(Object.keys(initialFormData)[0]);

  // Add a new item to the active tab
  const increment = (key) => {
    const updatedFormData = { ...formData };
    if (!updatedFormData[key]) {
      updatedFormData[key] = [];
    }
    const newKey = `${key}${updatedFormData[key].length + 1}`;
    updatedFormData[key].push({ key: newKey, name: "", distance: "" });
    setFormData(updatedFormData);
    onChange(updatedFormData);
  };

  // Remove the last item from the active tab
  const decrement = (key) => {
    const updatedFormData = { ...formData };
    if (updatedFormData[key]?.length > 0) {
      updatedFormData[key].pop();
      setFormData(updatedFormData);
      onChange(updatedFormData);
    }
  };

  // Update field data for a specific item
  const handleFieldChange = (key, index, field, value) => {
    const updatedFormData = { ...formData };
    updatedFormData[key][index][field] = value;
    setFormData(updatedFormData);
    onChange(updatedFormData);
  };

  // Update formData if `value` changes
  useEffect(() => {
    if (value?.landmark) {
      setFormData(value.landmark);
    }
  }, [value]);

  return (
    <React.Fragment>
      <div className="row gx-3">
        {/* Render landmark tabs dynamically */}
        <div className="col-12">
          <div className="d-flex justify-content-start mb-4">
            {Object.keys(formData).map((key, i) => (
              <div
                key={`landmark_tab_${i}`}
                className={`tab-item ${activeTab === key ? "active" : ""}`}
                style={{
                  marginRight: "20px",
                  padding: "10px",
                  cursor: "pointer",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  backgroundColor: activeTab === key ? "#007bff" : "#f5f5f5",
                  color: activeTab === key ? "white" : "black",
                }}
                onClick={() => setActiveTab(key)}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </div>
            ))}
          </div>
        </div>

        {/* Render input fields for the active tab */}
        {activeTab && (
          <div className="col-lg-6 col-12">
            <div className="form-field">
              <label className="form-label">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </label>
              <div className="cart-plus-minus mb-4">
                <input
                  type="text"
                  className="form-control"
                  value={(formData[activeTab] || []).length}
                  readOnly
                />
                <div className="minus qtybutton" onClick={() => decrement(activeTab)}>
                  <i className="icon-line-awesome-minus"></i>
                </div>
                <div className="plus qtybutton" onClick={() => increment(activeTab)}>
                  <i className="icon-line-awesome-plus"></i>
                </div>
              </div>

              {/* Render the fields for each item in the active tab */}
              {(formData[activeTab] || []).map((item, index) => (
                <div key={`${activeTab}_${index}`} className="row mb-3">
                  <div className="col-12">
                    <strong>{`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} ${
                      index + 1
                    }`}</strong>
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Name"
                      value={item.name}
                      onChange={(e) =>
                        handleFieldChange(activeTab, index, "name", e.target.value)
                      }
                    />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">Distance</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Distance"
                      value={item.distance}
                      onChange={(e) =>
                        handleFieldChange(activeTab, index, "distance", e.target.value)
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default LandmarkComponent;
