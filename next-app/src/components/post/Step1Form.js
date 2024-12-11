"use client";
import React, { useState } from "react";

const Step1Form = ({ formData, setFormData, nextStep }) => {
  // Local state for form values
  const [formValues, setFormValues] = useState({
    postAs: formData.postAs || "O",
    name: formData.name || "",
    countryCode: formData.countryCode || "IND +91",
    whatsappNumber: formData.whatsappNumber || "",
    email: formData.email || "",
  });

  // Local state for errors
  const [errors, setErrors] = useState({
    postAs: "",
    name: "",
    countryCode: "",
    whatsappNumber: "",
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let errorMessage = "";


    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));
  };

  const validate = () => {
    const newErrors = {};

    // Validate all fields
    Object.keys(formValues).forEach((field) => {
      validateField(field, formValues[field]);
    });

    // Check if there are any errors
    return Object.values(errors).every((error) => error === "");
  };

  const handleSubmit = () => {
    if (validate()) {
      nextStep();
    }
  };

  return (
    <div id="step-1">
      <label className="d-block mb-2">I'm a</label>
      <div className="btn-group btn-group-light d-flex mb-3" role="group">
        <input
          type="radio"
          className="btn-check"
          name="postAs"
          id="owner"
          value="O"
          checked={formValues.postAs === "O"}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <label
          className={`btn btn-outline-light ${errors.postAs ? "border-danger" : ""}`}
          htmlFor="owner"
        >
          <img src="/assets/images/icons/owner.png" alt="Icon" height="24" width="24" /> Owner
        </label>
        <input
          type="radio"
          className="btn-check"
          name="postAs"
          id="agent"
          value="A"
          checked={formValues.postAs === "A"}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <label
          className={`btn btn-outline-light ${errors.postAs ? "border-danger" : ""}`}
          htmlFor="agent"
        >
          <img src="/assets/images/icons/agent.png" alt="Icon" height="24" width="24" /> Agent
        </label>
        <input
          type="radio"
          className="btn-check"
          name="postAs"
          id="builder"
          value="B"
          checked={formValues.postAs === "B"}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <label
          className={`btn btn-outline-light ${errors.postAs ? "border-danger" : ""}`}
          htmlFor="builder"
        >
          <img src="/assets/images/icons/builder.png" alt="Icon" height="24" width="24" /> Builder
        </label>
      </div>

      {/* Name Field */}
      <div className="form-field mb-3">
        <label htmlFor="name" className="form-label">
          Name
        </label>
        <input
          type="text"
          className={`form-control ${errors.name ? "border-danger" : ""}`}
          name="name"
          placeholder="Enter Your Name"
          value={formValues.name}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </div>

      {/* WhatsApp Number Field */}
      <div className="input-group mb-3">
        <select
          className={`btn-group bootstrap-select input-group-btn fit-width ${errors.countryCode ? "border-danger" : ""}`}
          name="countryCode"
          value={formValues.countryCode}
          onChange={handleChange}
          onBlur={handleBlur}
        >
          <option value="IND +91">IND +91</option>
          <option value="+81">+81</option>
          <option value="+71">+71</option>
          <option value="+61">+61</option>
          <option value="+51">+51</option>
        </select>
        <input
          type="text"
          className={`form-control ${errors.whatsappNumber ? "border-danger" : ""}`}
          name="whatsappNumber"
          placeholder="WhatsApp No."
          value={formValues.whatsappNumber}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </div>

      <div className="alert alert-success d-flex align-items-center">
        <img
          src="/assets/images/whatsapp.png"
          alt="whatsapp"
          height="48"
          width="48"
        />
        <p className="ps-3">
          Enter your{" "}
          <span className="text-green">WhatsApp Number</span> to get enquiries
          from buyer/tenant
        </p>
      </div>

      {/* Email Field */}
      <div className="form-field mb-3">
        <label htmlFor="email" className="form-label">
          Email
        </label>
        <input
          type="email"
          name="email"
          className={`form-control ${errors.email ? "border-danger" : ""}`}
          placeholder="Enter Your Email I’d"
          value={formValues.email}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </div>

      {/* Next Button */}
      <div className="d-grid">
        <button
          type="button"
          className="btn btn-primary btn-next-2 btn-next-1"
          onClick={handleSubmit}
        >
          Next <i className="bi bi-arrow-right"></i>
        </button>
      </div>
    </div>
  );
};

export default Step1Form;
