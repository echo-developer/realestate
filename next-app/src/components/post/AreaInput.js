import React from "react";

const AreaInput = ({ label, formData, setFormData, dropdownOptions }) => {
  return (
    <div className="col-lg-6 col-12">
      <div className="form-field">
        <label className="form-label">{label}</label>
        <div className="input-group">
          <select
            className="form-control"
            value={formData[label.toLowerCase().replace(" ", "_")] || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                [label.toLowerCase().replace(" ", "_")]: e.target.value,
              })
            }
          >
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
  );
};

export default AreaInput;
