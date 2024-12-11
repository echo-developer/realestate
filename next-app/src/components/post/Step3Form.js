"use client"
import React, { useState } from "react";

const cities = [
  "Abu Dhabi",
  "Ajman",
  "Dubai",
  "Fujairah",
  "Ras Al Khaimah",
  "Sharjah",
  "Umm Al-Quwain",
];

const Step3Form = ({ formData, setFormData, nextStep, prevStep }) => {
  const [errors, setErrors] = useState({
    city: "",
    locality: "",
    projectName: "",
    address: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Validation function
  const validate = () => {
    const newErrors = {};

    // Validate city selection
    if (!formData.city) {
      newErrors.city = "Please select a city.";
    }

    // Validate locality selection
    if (!formData.locality) {
      newErrors.locality = "Please select a locality.";
    }

    // Validate project name
    if (!formData.projectName || formData.projectName.trim() === "") {
      newErrors.projectName = "Please enter a project name or locality.";
    }

    // Validate address
    if (!formData.address || formData.address.trim() === "") {
      newErrors.address = "Please enter an address.";
    } else if (formData.address.length > 300) {
      newErrors.address = "Address must be less than 300 words.";
    }

    setErrors(newErrors);

    // Return true if no errors, else false
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
        <div className="col-lg-6 col-12">
          <div className="form-field">
            <label htmlFor="city">City</label>
            <select
              id="city"
              name="city"
              value={formData.city || ""}
              onChange={handleChange}
              className="form-control"
            >
              <option value="" disabled>
                Choose City
              </option>
              {cities.map((cityName, index) => (
                <option key={index} value={cityName}>
                  {cityName}
                </option>
              ))}
            </select>
            {errors.city && <div className="text-danger">{errors.city}</div>}
          </div>
        </div>
        <div className="col-lg-6 col-12">
          <div className="form-field">
            <label htmlFor="locality">Locality</label>
            <select
              id="locality"
              name="locality"
              value={formData.locality || ""}
              onChange={handleChange}
              className="form-control"
            >
              <option value="" disabled>
                Choose Locality
              </option>
              {cities.map((localityName, index) => (
                <option key={index} value={localityName}>
                  {localityName}
                </option>
              ))}
            </select>
            {errors.locality && <div className="text-danger">{errors.locality}</div>}
          </div>
        </div>

        <div className="form-field mt-3">
          <label htmlFor="projectName">Name of Project Or Locality</label>
          <input
            type="text"
            id="projectName"
            name="projectName"
            value={formData.projectName || ""}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter Project Name Or Locality"
          />
          {errors.projectName && (
            <div className="text-danger">{errors.projectName}</div>
          )}
        </div>

        <div className="form-field mt-3">
          <label htmlFor="address">Address</label>
          <textarea
            id="address"
            name="address"
            value={formData.address || ""}
            onChange={handleChange}
            rows={3}
            className="form-control"
            placeholder="Enter Your Address"
          />
          <p className="text-end text-help">Maximum 300 words are allowed</p>
          {errors.address && <div className="text-danger">{errors.address}</div>}
        </div>

        <div className="d-grid columns-2 mt-4">
          <button
            type="button"
            className="btn btn-secondary btn-back-3"
            onClick={prevStep}
          >
            <i className="bi bi-arrow-left"></i> Back
          </button>
          <button
            type="button"
            className="btn btn-primary btn-next-3"
            onClick={handleNext}
          >
            Next <i className="bi bi-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step3Form;
