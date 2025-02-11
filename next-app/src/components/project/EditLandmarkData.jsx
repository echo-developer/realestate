import React, { useState, useEffect } from "react";

const LandmarkComponent = ({ value, onChange, projectData }) => {
  const allTabs = {
    education: [{ key: "education1", name: "Holy Conventional School", distance: "4" }],
    healthcare: [{ key: "healthcare1", name: "City Hospital", distance: "3" }],
    shopping: [{ key: "shopping1", name: "", distance: "" }],
    commercial: [{ key: "commercial1", name: "", distance: "" }],
    transport: [{ key: "transport1", name: "", distance: "" }],
  };

  const initialFormData = { ...allTabs, ...(value?.landmarks || projectData?.landmarks || {}) };
  const [formData, setFormData] = useState(initialFormData);
  const [activeTab, setActiveTab] = useState(Object.keys(initialFormData)[0]);

  const increment = (key) => {
    const updatedFormData = { ...formData };
    if (!updatedFormData[key]) updatedFormData[key] = [];
    const newKey = `${key}${updatedFormData[key].length + 1}`;
    updatedFormData[key].push({ key: newKey, name: "", distance: "" });
    setFormData(updatedFormData);
    onChange(updatedFormData);
  };

  const decrement = (key) => {
    const updatedFormData = { ...formData };
    if (updatedFormData[key]?.length > 0) {
      updatedFormData[key].pop();
      setFormData(updatedFormData);
      onChange(updatedFormData);
    }
  };

  const handleFieldChange = (key, index, field, value) => {
    const updatedFormData = { ...formData };
    updatedFormData[key][index][field] = value;
    setFormData(updatedFormData);
    onChange(updatedFormData);
  };

  useEffect(() => {
    if (value?.landmarks) {
      setFormData({ ...allTabs, ...value.landmarks });
    }
  }, [value]);

  return (
    <React.Fragment>
      <div className="row gx-3">
        <div className="col-12">
          <div className="d-flex justify-content-start mb-4">
            {Object.keys(initialFormData)?.map((key, i) => (
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
                {key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ")}
              </div>
            ))}
          </div>
        </div>

        {Object.keys(allTabs).map((key) => (
          <div
            key={key}
            className={`col-lg-6 col-12 ${activeTab === key ? "active" : ""}`}
            style={{ display: activeTab === key ? "block" : "none" }}
          >
            <div className="form-field">
              <label className="form-label">
                {key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ")}
              </label>
              <div className="cart-plus-minus mb-4">
                <div style={{ display: "flex", gap: "20px" }}>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      decrement(key);
                    }}
                    type="button"
                    className="btn btn-danger"
                  >
                    Remove
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      increment(key);
                    }}
                    type="button"
                    className="btn btn-primary"
                  >
                    Add
                  </button>
                </div>
              </div>

              {formData[activeTab]?.length > 0 &&
                formData[activeTab]?.map((item, i) => (
                  <div className="row mb-3" key={item?.key}>
                    <div className="col-sm-9">
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter Name"
                        value={item?.name}
                        onChange={(e) => handleFieldChange(key, i, "name", e.target.value)}
                      />
                    </div>
                    <div className="col-sm-3">
                      <label className="form-label">Distance</label>
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Distance"
                          value={item?.distance}
                          onChange={(e) => handleFieldChange(key, i, "distance", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </React.Fragment>
  );
};

export default LandmarkComponent;
