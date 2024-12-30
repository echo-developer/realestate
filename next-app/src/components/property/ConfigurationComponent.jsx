import React, { useState } from "react";

const ConfigurationComponent = ({ propertyType, onChange }) => {
  const [formData, setFormData] = useState({
    bedroom: [{ key: "bedroom1", height: "", width: "" }],
    bathroom: [{ key: "bathroom1", height: "", width: "" }],
  });
  const [activeTab, setActiveTab] = useState("bedroom");
  const [errors, setErrors] = useState({});
  const roomTypes = propertyType === "Apartment" ? ["bedroom", "bathroom", "kitchen"] : ["washroom"];

  const increment = (key) => {
    const updatedFormData = { ...formData };
    const newKey = `${key}${updatedFormData[key]?.length + 1}`;
    updatedFormData[key].push({ key: newKey, height: "", width: "" });
    setFormData(updatedFormData);
    onChange(updatedFormData);
  };

  const decrement = (key) => {
    const updatedFormData = { ...formData };
    if (updatedFormData[key] && updatedFormData[key].length > 0) {
      updatedFormData[key].pop();
      setFormData(updatedFormData);
      onChange(updatedFormData);
    }
  };

  const handleFieldChange = (keyName, index, field, value) => {
    const updatedFormData = { ...formData };
    updatedFormData[keyName][index][field] = value;
    setFormData(updatedFormData);
    onChange(updatedFormData);
  };

  return (
    <React.Fragment>
      <div className="row gx-3">
        {/* Room types tabs in a row */}
        <div className="col-12">
          <div className="d-flex justify-content-start mb-4">
            {roomTypes.map((key, i) => (
              <div
                key={`room_${key}_${i}`}
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
                onClick={() => setActiveTab(key)} // Set active tab on click
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </div>
            ))}
          </div>
        </div>

        {/* Render room types inputs based on active tab */}
        {roomTypes.map((key) => (
          activeTab === key && (
            <div className="col-lg-6 col-12" key={`room_${key}`}>
              <div className="form-field">
                <label className="form-label">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </label>
                <div className="cart-plus-minus mb-4">
                  <input
                    type="text"
                    className="form-control"
                    value={(formData[key] || []).length}
                    readOnly
                  />
                  <div className="minus qtybutton" onClick={() => decrement(key)}>
                    <i className="icon-line-awesome-minus"></i>
                  </div>
                  <div className="plus qtybutton" onClick={() => increment(key)}>
                    <i className="icon-line-awesome-plus"></i>
                  </div>
                </div>

                {/* Render height and width inputs for each room */}
                {(formData[key] || []).map((room, index) => (
                  <div key={`${key}_${index}`} className="row mb-3">
                    <div className="col-12">
                      <strong>{`${key.charAt(0).toUpperCase() + key.slice(1)} ${index + 1}`}</strong>
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label">Height</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Height"
                        value={room.height}
                        onChange={(e) =>
                          handleFieldChange(key, index, "height", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label">Width</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Width"
                        value={room.width}
                        onChange={(e) =>
                          handleFieldChange(key, index, "width", e.target.value)
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        ))}
      </div>
    </React.Fragment>
  );
};

export default ConfigurationComponent;
