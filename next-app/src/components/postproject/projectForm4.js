"use client";
import React, { useEffect, useState } from "react";
import AuthUser from "../Authentication/AuthUser";
import { toast } from "react-toastify";
import {
  parkingOptions,
  facingOptions,
  minBudgetOptions,
  maxBudgetOptions,
} from "../post/PropertyData";

const ProjectForm4 = ({ formData, setFormData, nextStep, prevStep }) => {
  const [errors, setErrors] = useState({});
  const { callApi } = AuthUser();
  const [BudgetData, setBudgetData] = useState([]);
  const [AmenityData, setAmenityData] = useState([]);
  const [FurnishData, setFurnishData] = useState([]);

  let propertyFor = localStorage.getItem("propertyFor");
  const [error, setError] = useState("");

  const handleMinBudgetChange = (e) => {
    const minBudget = e.target.value;
    setFormData({
      ...formData,
      min_budget: minBudget,
      max_budget: "",
    });
    if (
      formData.max_budget &&
      Number(minBudget) > Number(formData.max_budget)
    ) {
      setError("Max budget should be greater than or equal to min budget");
    } else {
      setError("");
    }
  };
  const handleMaxBudgetChange = (e) => {
    const maxBudget = e.target.value;
    setFormData({
      ...formData,
      max_budget: maxBudget,
    });

    if (
      formData.min_budget &&
      Number(maxBudget) < Number(formData.min_budget)
    ) {
      setError("Max budget should be greater than or equal to min budget");
    } else {
      setError("");
    }
  };
  const filteredMaxBudgetOptions = maxBudgetOptions.filter(
    (option) => option.value >= formData.min_budget
  );

  useEffect(() => {
    FetchBudgetData();
    fetchAmenityData();
    fetchFurnishData();
  }, [propertyFor]);

  const handleInputChange = (e, field) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const FetchBudgetData = async () => {
    try {
      const response = await callApi({
        api: `/get_property_budget`,
        method: "GET",
      });
      if (response && response.status === 1) {
        setBudgetData(response.data);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to fetch budget data.");
    }
  };

  const handlePropertyStatusChange = (status) => {
    setFormData((prev) => ({
      ...prev,
      project_furnish: status,
    }));
  };

  const handleFloorChange = (key, selectedFloor) => {
    setFormData({
      ...formData,
      [key]: selectedFloor,
    });
  };

  const handleMainRoadChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      main_road_facing: value,
    }));
  };

  useEffect(() => {
    if (!formData.project_furnish) {
      setFormData((prev) => ({
        ...prev,
        project_furnish: FurnishData[0]?.furnish_id || "",
      }));
    }
  }, [formData, setFormData]);

  // Validation for Carpet Area, Super Area, and Budget
  const validateAreaFields = () => {
    const newErrors = {};

    // Validate Carpet Area
    if (!formData.carpet_area || isNaN(Number(formData.carpet_area)) || Number(formData.carpet_area) <= 0) {
      newErrors.carpet_area = "Please enter a valid carpet area greater than 0.";
    }

    // Validate Super Area
    if (!formData.super_area || isNaN(Number(formData.super_area)) || Number(formData.super_area) <= 0) {
      newErrors.super_area = "Please enter a valid super area greater than 0.";
    }

    // Merge with existing errors
    setErrors((prevErrors) => ({
      ...prevErrors,
      ...newErrors,
    }));

    return Object.keys(newErrors).length === 0;
  };

  const validateBudget = () => {
    const newErrors = {};
    if (!formData.min_budget) {
      newErrors.min_budget = "Please select a Min Budget.";
    }
    if (!formData.max_budget) {
      newErrors.max_budget = "Please select a Max Budget.";
    }
    if (
      formData.min_budget &&
      formData.max_budget &&
      Number(formData.max_budget) < Number(formData.min_budget)
    ) {
      newErrors.max_budget = "Max budget should be greater than or equal to min budget";
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      ...newErrors,
    }));

    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateBudget()) {
      if (validateAreaFields()) {
        nextStep();
      }
    }
  };

  const fetchAmenityData = async () => {
    try {
      const response = await callApi({
        api: `/get_property_amnity`,
        method: "GET",
      });
      if (response && response.status === 1) {
        setAmenityData(response.data);
      }
    } catch (error) {
      toast.error("Failed to fetch amenity data.");
    }
  };

  const fetchFurnishData = async () => {
    try {
      const response = await callApi({
        api: `/get_property_furnish`,
        method: "GET",
      });
      if (response && response.status === 1) {
        setFurnishData(response.data);
      }
    } catch (error) {
      toast.error("Failed to fetch furnish data.");
    }
  };

  return (
    <div id="step-4">
      <React.Fragment>
        {/* Carpet and Plot Area Inputs */}
        <div className="row gx-3">
          {[
            { label: "Carpet Area", key: "carpet_area" },
            { label: "Super Area", key: "super_area" },
          ].map(({ label, key }, i) => (
            <div className="col-lg-6 col-12" key={`item_3_${i}_${key}`}>
              <div className="form-field">
                <label className="form-label">{label}</label>
                <div className="input-group">
                  <input
                    type="text"
                    className={`form-control ${
                      errors[key] ? "is-invalid" : ""
                    }`}
                    placeholder={`Type ${label}`}
                    value={formData[key]}
                    onChange={(e) => handleInputChange(e, key)}
                  />
                  <span className="input-group-text">sqft</span>
                </div>
                {errors[key] && (
                  <div className="invalid-feedback">{errors[key]}</div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Tower Selection */}
        <div className="form-group">
          <label className="form-label">No. of Total Towers</label>
          <div
            className="btn-group btn-group-light d-flex mb-3"
            role="group"
            aria-label="Floors"
          >
            {[...Array(10)].map((_, i) => (
              <React.Fragment key={`item_4_${i + 1}`}>
                <input
                  type="radio"
                  className="btn-check"
                  name="floors"
                  id={`floors_${i + 1}`}
                  autoComplete="off"
                  checked={formData.floor === `${i + 1}`}
                  onChange={() => handleFloorChange("floor", `${i + 1}`)}
                />
                <label
                  className="btn btn-outline-light"
                  htmlFor={`floors_${i + 1}`}
                >
                  {i + 1}
                </label>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Total Units Selection */}
        {propertyFor !== "residential-land-plot" && (
          <div className="form-group">
            <label className="form-label">Total Units</label>
            <div
              className="btn-group btn-group-light d-flex mb-3"
              role="group"
              aria-label="Total Units"
            >
              {[...Array(12)].map((_, i) => (
                <React.Fragment key={`item_5_${i + 1}`}>
                  <input
                    type="radio"
                    className="btn-check"
                    name="total_units"
                    id={`total_units_${i + 1}`}
                    autoComplete="off"
                    checked={formData.total_units === `${i + 1}`}
                    onChange={() =>
                      handleFloorChange("total_units", `${i + 1}`)
                    }
                  />
                  <label
                    className="btn btn-outline-light"
                    htmlFor={`total_units_${i + 1}`}
                  >
                    {i + 1}
                  </label>
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {/* Budget and Parking */}
        <div className="row gx-3">
          <div className="col-lg-6 col-12">
            <label className="form-label">Facing</label>
            <div className="form-field">
              <select
                className="form-control"
                value={formData.project_facing || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    project_facing: e.target.value,
                  })
                }
              >
                <option value="">Select Budget</option>
                {facingOptions.map((facing, i) => (
                  <option key={`dataidf_${i}_${facing.key}`} value={facing.key}>
                    {facing?.value}
                  </option>
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
                <option value="">Select Parking Option</option>
                {parkingOptions.map((option, i) => (
                  <option
                    key={`parkingid${i}_${option.key}`}
                    value={option.key}
                  >
                    {option.value}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="row gx-3">
          <div className="col-lg-6 col-12">
            <label className="form-label">Min Budget</label>
            <div className="form-field">
              <select
                className="form-control"
                value={formData.min_budget || ""}
                onChange={handleMinBudgetChange}
              >
                <option value="">Select Min Budget</option>
                {minBudgetOptions.map((budget, i) => (
                  <option key={`minBudget_${i}`} value={budget.value}>
                    {budget.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="col-lg-6 col-12">
            <label className="form-label">Max Budget</label>
            <div className="form-field">
              <select
                className="form-control"
                value={formData.max_budget || ""}
                onChange={handleMaxBudgetChange}
              >
                <option value="">Select Max Budget</option>
                {filteredMaxBudgetOptions.map((budget, i) => (
                  <option key={`maxBudget_${i}`} value={budget.value}>
                    {budget.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Display error message if validation fails */}
          {error && <div className="text-danger">{error}</div>}
        </div>

        {/* Main Road Facing */}
        <div className="mb-3">
          <label className="form-label">Is Main Road Facing:</label>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="main_road_facing"
              id="main_road_facing_1"
              value="Yes"
              checked={formData.main_road_facing === "Yes"}
              onChange={() => handleMainRoadChange("Yes")}
            />
            <label className="form-check-label" htmlFor="main_road_facing_1">
              Yes
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="main_road_facing"
              id="main_road_facing_2"
              value="No"
              checked={formData.main_road_facing === "No"}
              onChange={() => handleMainRoadChange("No")}
            />
            <label className="form-check-label" htmlFor="main_road_facing_2">
              No
            </label>
          </div>
        </div>

        {/* Features */}
        <div className="form-group">
          <label className="form-label">Amenity Features:</label>
          {AmenityData.map((feature, i) => (
            <div
              key={`item_6_${i}_${feature.id}`}
              className="form-check form-check-inline"
            >
              <input
                className="form-check-input"
                type="checkbox"
                id={`feature-${feature.amenity_id}`}
                checked={
                  formData.project_amenity?.includes(feature.amenity_id) ||
                  false
                }
                onChange={(e) => {
                  const updatedAmenities = [
                    ...(formData.project_amenity || []),
                  ];
                  if (e.target.checked) {
                    updatedAmenities.push(feature.amenity_id);
                  } else {
                    const index = updatedAmenities.indexOf(feature.amenity_id);
                    if (index !== -1) updatedAmenities.splice(index, 1);
                  }
                  setFormData({
                    ...formData,
                    project_amenity: updatedAmenities,
                  });
                }}
              />
              <label
                className="form-check-label"
                htmlFor={`feature-${feature.amenity_id}`}
              >
                {feature.amenity_name}
              </label>
            </div>
          ))}
        </div>
      </React.Fragment>

      {/* Furnishing Status */}
      <div
        className="btn-group btn-group-light d-flex mb-3 mt-3"
        role="group"
        aria-label="Property Status"
      >
        {FurnishData.map((option, i) => (
          <React.Fragment key={`furnishid_${i}_${option.furnish_id}`}>
            <input
              type="radio"
              className="btn-check"
              name="project_furnish"
              id={`project_furnish${option.furnish_id}`}
              autoComplete="off"
              checked={formData.project_furnish === option.furnish_id}
              onChange={() => handlePropertyStatusChange(option.furnish_id)}
            />
            <label
              className="btn btn-outline-light"
              htmlFor={`project_furnish${option.furnish_id}`}
            >
              {option.furnish_name}
            </label>
          </React.Fragment>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="d-grid columns-2">
        <button type="button" className="btn btn-secondary" onClick={prevStep}>
          <i className="bi bi-arrow-left"></i> Back
        </button>
        <button type="button" className="btn btn-primary" onClick={handleNext}>
          Next <i className="bi bi-arrow-right"></i>
        </button>
      </div>
    </div>
  );
};

export default ProjectForm4;
