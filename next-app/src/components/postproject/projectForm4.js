"use client";
import React, { useEffect, useState } from "react";
import AuthUser from "../Authentication/AuthUser";
import { toast } from "react-toastify";
import { parkingOptions, facingOptions } from "../post/PropertyData";
import useTranslation from "@/hooks/useTranslation";


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

  const unitOptions = ["Acre", "sqft", "sqm"];
  const translation = useTranslation();

  useEffect(() => {
    fetchAmenityData();
    fetchFurnishData();
  }, [propertyFor]);

  const handleInputChange = (e, field) => {
    const { value } = e.target;
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: "",
    }));
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handlePropertyStatusChange = (status) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      project_furnish: "",
    }));
    setFormData((prev) => ({
      ...prev,
      project_furnish: status,
    }));
  };

  const handleFloorChange = (key, selectedFloor) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [key]: "",
    }));
    setFormData({
      ...formData,
      [key]: selectedFloor,
    });
  };

  const handleMainRoadChange = (value) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      main_road_facing: "",
    }));
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
      !formData.occupied_area ||
      isNaN(Number(formData.occupied_area)) ||
      Number(formData.occupied_area) <= 0
    ) {
      newErrors.occupied_area =
        `${translation?.please_enter_valid_occupied_area || "Please enter a valid occupied area greater than 0."}` 
    }
    if (
      !formData.total_area ||
      isNaN(Number(formData.total_area)) ||
      Number(formData.total_area) <= 0
    ) {
      newErrors.total_area = `${translation?.please_enter_valid_total_area || "Please enter a valid total area greater than 0."}` 
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      ...newErrors,
    }));

    return Object.keys(newErrors).length === 0;
  };

  const validateForm = () => {
    let errors = {};

    if (!formData.total_towers) {
      errors.total_towers = `${translation?.please_enter_valid_total_area || "Please select the total number of towers." }`
    }
    if (!formData.total_units || formData.total_units <= 0) {
      errors.total_units =  `${translation?.please_enter_valid_total_units || "Please enter a valid number of total units." }`
    }

    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateForm() && validateAreaFields()) {
      nextStep();
    }
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

  const handleUnitChange = (event) => {
    setFormData({ ...formData, unit_type: event.target.value });
  };

  return (
    <div id="step-4">
      <React.Fragment>
        <div className="mb-3">
          <label className="col-form-label">{translation?.select_units || "Select Unit(s)"}</label>
          <select
            className="form-select"
            value={formData.unit_type}
            onChange={handleUnitChange}
          >
            {unitOptions.map((unit, index) => (
              <option key={index} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </div>
        {/* Carpet and Plot Area Inputs */}
        <div className="row gx-3">
          {[
            { label: "Occupied Area", key: "occupied_area" },
            { label: "Total Area", key: "total_area" },
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
                  <span className="input-group-text">{formData?.unit_type || "N/A"}</span>
                </div>
                {errors[key] && (
                  <div className="invalid-feedback">{errors[key]}</div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="form-group row">
          {/* Total Towers Dropdown */}
          <div className="col-md-6 mb-3">
            <label className="form-label">{translation?.no_of_total_towers || "No. of Total Towers"}</label>
            <select
              className={`form-select ${
                errors.total_towers ? "is-invalid" : ""
              }`}
              style={scrollbar}
              value={formData.total_towers || ""}
              onChange={(e) =>
                handleFloorChange("total_towers", e.target.value)
              }
            >
              <option value="">{translation?.select_total_towers || "Select Total Towers"}</option>
              {[...Array(15)].map((_, i) => (
                <option key={`tower_${i + 1}`} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
            {errors.total_towers && (
              <div className="invalid-feedback">{errors.total_towers}</div>
            )}
          </div>

          {/* Total Units Text Input */}
          <div className="col-md-6 mb-3">
            <label className="form-label">{translation?.total_units || "Total Units"}</label>
            <input
              type="number"
              className={`form-control ${
                errors.total_units ? "is-invalid" : ""
              }`}
              placeholder="Enter total units"
              value={formData.total_units || ""}
              onChange={(e) => handleFloorChange("total_units", e.target.value)}
              min="1"
            />
            {errors.total_units && (
              <div className="invalid-feedback">{errors.total_units}</div>
            )}
          </div>
        </div>

        {/* Facing and Parking */}
        <div className="row gx-3">
          <div className="col-lg-6 col-12">
            <label className="form-label">{translation?.facing || "Facing"}</label>
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
                <option value="">{translation?.select_facing || "Select Facing"}</option>
                {facingOptions.map((facing, i) => (
                  <option key={`dataidf_${i}_${facing.key}`} value={facing.key}>
                    {facing?.value}
                  </option>
                ))}
              </select>
            </div>
            {errors.project_facing && (
              <div className="invalid-feedback">{errors.project_facing}</div>
            )}
          </div>
          <div className="col-lg-6 col-12">
            <label className="form-label">{translation?.parking || "Parking"}</label>
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
                <option value="">{translation?.select_parking_option || "Select Parking Option"}</option>
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
            {errors.parking_availability && (
              <div className="invalid-feedback">
                {errors.parking_availability}
              </div>
            )}
          </div>
        </div>

        {/* Main Road Facing */}
        <div className="mb-3">
          <label className="form-label d-block">{translation?.is_main_road_facing || "Is Main Road Facing"}</label>
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
            {translation?.yes || "Yes"}
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
            {translation?.no || "No"}
            </label>
          </div>
          {errors.main_road_facing && (
            <div className="invalid-feedback">{errors.main_road_facing}</div>
          )}
        </div>

        {/* Features */}
        <div className="form-group">
          <label className="form-label d-block">{translation?.amenity_features || "Amenity Features:"}</label>
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
          {errors.project_amenity && (
            <div className="invalid-feedback">{errors.project_amenity}</div>
          )}
        </div>
      </React.Fragment>

      {/* Furnishing Status */}
      <div
        className="btn-group btn-group-light btn-group-card d-flex flex-wrap mb-3 mt-3"
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
              <img
                src="/assets/images/icons/furnish.png"
                alt="Icon"
                height={48}
                width={48}
                className="mb-2"
              />{" "}
              {option.furnish_name}
            </label>
          </React.Fragment>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="d-grid columns-2">
        <button type="button" className="btn btn-secondary" onClick={prevStep}>
          <i className="bi bi-arrow-left"></i> {translation?.back || "Back"}
        </button>
        <button type="button" className="btn btn-primary" onClick={handleNext}>
        {translation?.next || "Next"} <i className="bi bi-arrow-right"></i>
        </button>
      </div>
    </div>
  );
};

export default ProjectForm4;
