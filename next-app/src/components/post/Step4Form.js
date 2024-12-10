import React, { useEffect } from "react";

const Step4Form = ({ formData, setFormData, nextStep, prevStep }) => {
  const increment = (key) => {
    const newValue = (formData[key] || []).length + 1;
    setFormData({
      ...formData,
      [key]: Array.from({ length: newValue }, (_, index) => ({
        height: formData[key]?.[index]?.height || "",
        width: formData[key]?.[index]?.width || "",
        heightUnit: formData[key]?.[index]?.heightUnit || "m", // default to meters
        widthUnit: formData[key]?.[index]?.widthUnit || "m",  // default to meters
      })),
    });
  };

  const decrement = (key) => {
    const newValue = (formData[key] || []).length - 1;
    if (newValue >= 0) {
      setFormData({
        ...formData,
        [key]: formData[key].slice(0, newValue),
      });
    }
  };

  const dropdownOptions = {
    areaUnits: ["Acre", "Hectare", "sq ft", "sq m", "sq yd"],
    propertyTypes: ["Residential", "Commercial"],
    propertyFor: [
      {
        label: "Residential",
        options: ["Flats", "House/Villa", "Penthouse", "Bungalow"],
      },
      {
        label: "Commercial",
        options: ["Office Space", "Shop/Showroom", "Hotels"],
      },
    ],
    budgets: [
      "$99 - $199",
      "$200 - $300",
      "$301 - $499",
      "$500 - $999",
      "Above $1000",
    ],
    parkingOptions: ["Available", "Not Available"],
    lengthUnits: ["m", "cm", "ft"], // Units for length
  };

  const handleFieldChange = (key, index, field, value) => {
    const updatedRooms = [...formData[key]];
    updatedRooms[index][field] = value;
    setFormData({
      ...formData,
      [key]: updatedRooms,
    });
  };

  const handleUnitChange = (key, index, unitType, value) => {
    const updatedRooms = [...formData[key]];
    updatedRooms[index][unitType] = value;
    setFormData({
      ...formData,
      [key]: updatedRooms,
    });
  };


  return (
    <div id="step-4">
      {/* Bedroom, Bathroom, and Kitchen Inputs */}
      <div className="row gx-3">
        {["bedrooms", "bathrooms", "kitchens"].map((key) => (
          <div className="col-lg-3 col-12" key={key}>
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

              {/* Conditionally render height and width inputs based on the room count */}
              {(formData[key] || []).map((room, index) => (
                <div key={`${key}-${index}`} className="form-group">
                  <label className="form-label">Height</label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Height"
                      value={room.height}
                      onChange={(e) =>
                        handleFieldChange(key, index, "height", e.target.value)
                      }
                    />
                    <select
                      className="form-control"
                      value={room.heightUnit}
                      onChange={(e) =>
                        handleUnitChange(key, index, "heightUnit", e.target.value)
                      }
                    >
                      {dropdownOptions.lengthUnits.map((unit) => (
                        <option key={unit} value={unit}>
                          {unit}
                        </option>
                      ))}
                    </select>
                  </div>
                  <label className="form-label">Width</label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Width"
                      value={room.width}
                      onChange={(e) =>
                        handleFieldChange(key, index, "width", e.target.value)
                      }
                    />
                    <select
                      className="form-control"
                      value={room.widthUnit}
                      onChange={(e) =>
                        handleUnitChange(key, index, "widthUnit", e.target.value)
                      }
                    >
                      {dropdownOptions.lengthUnits.map((unit) => (
                        <option key={unit} value={unit}>
                          {unit}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Carpet and Plot Area Inputs */}
      <div className="row gx-3">
        {["Carpet Area", "Plot Area"].map((label) => (
          <div className="col-lg-6 col-12" key={label}>
            <div className="form-field">
              <label className="form-label">{label}</label>
              <div className="input-group">
                <select className="form-control">
                  {dropdownOptions.areaUnits.map((unit) => (
                    <option key={unit}>{unit}</option>
                  ))}
                </select>
                <input
                  type="text"
                  className="form-control"
                  placeholder={`Type ${label}`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Property Type and Property For */}
      <div className="row gx-3">
        {["Property Type", "Property For"].map((label, index) => (
          <div className="col-lg-6 col-12" key={label}>
            <div className="form-field">
              <label className="form-label">{label}</label>
              <select
                className="form-control"
                value={formData[label.toLowerCase().replace(" ", "")] || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    [label.toLowerCase().replace(" ", "")]: e.target.value,
                  }))
                }
              >
                {label === "Property Type"
                  ? dropdownOptions.propertyTypes.map((type) => (
                      <option key={type}>{type}</option>
                    ))
                  : dropdownOptions.propertyFor.map((group) => (
                      <optgroup label={group.label} key={group.label}>
                        {group.options.map((option) => (
                          <option key={option}>{option}</option>
                        ))}
                      </optgroup>
                    ))}
              </select>
            </div>
          </div>
        ))}
      </div>

      {/* Budget and Parking */}
      <div className="row gx-3">
        <div className="col-lg-6 col-12">
          <label className="form-label">Budget</label>
          <div className="form-field">
            <select
              className="form-control"
              value={formData.budget || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  budget: e.target.value,
                }))
              }
            >
              {dropdownOptions.budgets.map((budget) => (
                <option key={budget}>{budget}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="col-lg-6 col-12">
          <label className="form-label">Parking</label>
          <div className="form-field">
            <select
              className="form-control"
              value={formData.parking || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  parking: e.target.value,
                }))
              }
            >
              {dropdownOptions.parkingOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="d-grid columns-2">
        <button type="button" className="btn btn-secondary" onClick={prevStep}>
          <i className="bi bi-arrow-left"></i> Back
        </button>
        <button type="button" className="btn btn-primary" onClick={nextStep}>
          Next <i className="bi bi-arrow-right"></i>
        </button>
      </div>
    </div>
  );
};

export default Step4Form;
