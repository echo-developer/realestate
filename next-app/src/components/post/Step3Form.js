"use client";
import React, { useState, useEffect } from "react";
import AuthUser from "../Authentication/AuthUser";
import dynamic from "next/dynamic";
import TextEditor from "../editor/TextEditor";
import useTranslation from "@/hooks/useTranslation";

const MapComponent = dynamic(() => import("../MapData/Map"), { ssr: false });

const Step3Form = ({ formData, setFormData, nextStep, prevStep }) => {
  const { callApi } = AuthUser();
  const [errors, setErrors] = useState({
    city: "",
    locality: "",
    project_name: "",
    address: "",
    description: "",
  });
  const translation = useTranslation();

  const [cityData, setCityData] = useState([]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetchCityData();
  }, []);

  const fetchCityData = async () => {
    try {
      const response = await callApi({
        api: "/get_property_cities",
        method: "GET",
      });
      if (response && response.status === 1) {
        setCityData(response.data);
      }
    } catch (error) {
      console.error("Error fetching city data:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.city) {
      newErrors.city = "Please select a city.";
    }
    if (!formData.locality || formData.locality.trim() === "") {
      newErrors.locality = "Please enter a locality.";
    }
    if (!formData.project_name || formData.project_name.trim() === "") {
      newErrors.project_name = "Please enter a project name or locality.";
    }
    if (!formData.address || formData.address.trim() === "") {
      newErrors.address = "Please enter an address.";
    }
    if (!formData.description || formData.description.trim() === "") {
      newErrors.description = "Please enter a property description.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      nextStep();
    }
  };

  return (
    <div id="step-3">
      <div className="row gx-3">
        {/* City Dropdown */}
        <div className="col-lg-6 col-12">
          <div className="form-field">
            <label className="form-label" htmlFor="city">
            {translation?.city || "City"} 
            </label>
            <select
              id="city"
              name="city"
              value={formData.city || ""}
              onChange={handleChange}
              className={`form-control ${errors.city ? "is-invalid" : ""}`}
            >
              <option value="" disabled>
              {translation?.choose_city || "Choose City"}
              </option>
              {cityData.map((city) => (
                <option key={city.city_id} value={city.city_id}>
                  {city.name}
                </option>
              ))}
            </select>
            {errors.city && (
              <div className="invalid-feedback">{errors.city}</div>
            )}
          </div>
        </div>
        <MapComponent
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          setErrors={setErrors}
        />
        {/* Project Name Input */}
        <div className="form-field ">
          <label className="form-label" htmlFor="project_name">
          {translation?.project_building_name || "Name of Project/Building"}  
          </label>
          <input
            type="text"
            id="project_name"
            name="project_name"
            value={formData.project_name || ""}
            onChange={handleChange}
            className={`form-control ${
              errors.project_name ? "is-invalid" : ""
            }`}
            placeholder= {translation?.placeholder_enter_project_building_name || "Enter Project/Building Name"} 
            disabled={formData?.project_property_type ==="under_project" ? true : false}
          />
          {errors.project_name && (
            <div className="invalid-feedback">{errors.project_name}</div>
          )}
        </div>

        {/* Address Input */}
        <div className="form-field">
          <label className="form-label" htmlFor="address">
          {translation?.address || "Address"}  
          </label>
          <textarea
            id="address"
            name="address"
            value={formData.address || ""}
            onChange={handleChange}
            rows={3}
            className={`form-control ${errors.address ? "is-invalid" : ""}`}
            placeholder={translation?.placeholder_enter_your_address || "Enter Your Address"} 
          />
          {errors.address && (
            <div className="invalid-feedback">{errors.address}</div>
          )}
        </div>

        {/* Property Description Input */}
        <div className="form-field">
          <label className="form-label" htmlFor="description">
          {translation?.property_description || "Property Description"}  
          </label>
          <TextEditor formData={formData} setFormData={setFormData} />
          {errors.description && (
            <div className="invalid-feedback">{errors.description}</div>
          )}
        </div>

        {/* <CustomEditor/> */}

        {/* Navigation Buttons */}
        <div className="d-grid columns-2">
          <button
            type="button"
            className="btn btn-secondary btn-back-3"
            onClick={prevStep}
          >
            <i className="bi bi-arrow-left"></i>{translation?.back || "Back"}
          </button>
          <button
            type="button"
            className="btn btn-primary btn-next-3"
            onClick={handleNext}
          >
           {translation?.next || "Next"} <i className="bi bi-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step3Form;
