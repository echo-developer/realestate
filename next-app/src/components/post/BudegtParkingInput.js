import React from "react";

const BudgetParkingInput = ({ formData, setFormData, dropdownOptions }) => {
  return (
    <>
      <div className="col-lg-6 col-12">
        <label className="form-label">Budget</label>
        <div className="form-field">
          <select
            className="form-control"
            value={formData.budget || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                budget: e.target.value,
              })
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
            value={formData.parking_availability || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                parking_availability: e.target.value,
              })
            }
          >
            {dropdownOptions.parkingOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
};

export default BudgetParkingInput;
