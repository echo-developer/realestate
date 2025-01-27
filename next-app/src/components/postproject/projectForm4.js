"use client";
import React, { useEffect, useState } from "react";
import AuthUser from "../Authentication/AuthUser";
import { toast } from "react-toastify";
import { parkingOptions, facingOptions } from "../post/PropertyData";

const scrollbar = {
  maxHeight: "150px",
  overflowY: "auto",
};

const ProjectForm4 = ({ formData, setFormData, nextStep, prevStep }) => {
  const [errors, setErrors] = useState({});
  const { callApi } = AuthUser();
  const [AmenityData, setAmenityData] = useState([]);
  const [FurnishData, setFurnishData] = useState([]);

  const propertyFor = localStorage.getItem("propertyFor");
  const [error, setError] = useState("");

  useEffect(() => {
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

  const validateAreaFields = () => {
    const newErrors = {};
    if (
      !formData.carpet_area ||
      isNaN(Number(formData.occupied_area)) ||
      Number(formData.occupied_area) <= 0
    ) {
      newErrors.occupied_area =
        "Please enter a valid occupied area greater than 0.";
    }
    if (
      !formData.total_area ||
      isNaN(Number(formData.total_area)) ||
      Number(formData.total_area) <= 0
    ) {
      newErrors.total_area = "Please enter a valid total area greater than 0.";
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      ...newErrors,
    }));

    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
      nextStep();
  };

  const fetchAmenityData = async () => {
    try {
      const response = await callApi({
        api: "/get_property_amnity",
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
        api: "/get_property_furnish",
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
          {[{ label: "Occupied Area", key: "occupied_area" }, { label: "Total Area", key: "total_area" }].map(
            ({ label, key }, i) => (
              <div className="col-lg-6 col-12" key={`item_3_${i}_${key}`}>
                <div className="form-field">
                  <label className="form-label">{label}</label>
                  <div className="input-group">
                    <input
                      type="text"
                      className={`form-control ${errors[key] ? "is-invalid" : ""}`}
                      placeholder={`Type ${label}`}
                      value={formData[key]}
                      onChange={(e) => handleInputChange(e, key)}
                    />
                    <span className="input-group-text">sqft</span>
                  </div>
                  {errors[key] && <div className="invalid-feedback">{errors[key]}</div>}
                </div>
              </div>
            )
          )}
        </div>

        <div className="form-group row align-items-center">
          {/* Total Towers Dropdown */}
          <div className="col-md-6">
            <label className="form-label">No. of Total Towers</label>
            <select
              className="form-select"
              style={scrollbar}
              value={formData.total_towers || ""}
              onChange={(e) => handleFloorChange("total_towers", e.target.value)}
            >
              <option value="">Select Total Towers</option>
              {[...Array(15)].map((_, i) => (
                <option key={`tower_${i + 1}`} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>

          {/* Total Units Text Input */}
          <div className="col-md-6">
            <label className="form-label">Total Units</label>
            <input
              type="number"
              className="form-control"
              placeholder="Enter total units"
              value={formData.total_units || ""}
              onChange={(e) => handleFloorChange("total_units", e.target.value)}
              min="1"
            />
          </div>
        </div>

        {/* Facing and Parking */}
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
                <option value="">Select Facing</option>
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
                  <option key={`parkingid${i}_${option.key}`} value={option.key}>
                    {option.value}
                  </option>
                ))}
              </select>
            </div>
          </div>
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
            <div key={`item_6_${i}_${feature.id}`} className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="checkbox"
                id={`feature-${feature.amenity_id}`}
                checked={formData.project_amenity?.includes(feature.amenity_id) || false}
                onChange={(e) => {
                  const updatedAmenities = [...(formData.project_amenity || [])];
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
              <label className="form-check-label" htmlFor={`feature-${feature.amenity_id}`}>
                {feature.amenity_name}
              </label>
            </div>
          ))}
        </div>
      </React.Fragment>

      {/* Furnishing Status */}
      <div className="btn-group btn-group-light d-flex mb-3 mt-3" role="group" aria-label="Property Status">
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
            <label className="btn btn-outline-light" htmlFor={`project_furnish${option.furnish_id}`}>
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
