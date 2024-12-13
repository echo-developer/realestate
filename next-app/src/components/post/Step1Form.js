"use client";

import React, { useState } from "react";

const Step1Form = ({ formData, setFormData, nextStep }) => {

  const [formValues, setFormValues] = useState({
    user_type: formData.user_type || "O",
    user_name: formData.user_name || "",
    country_code: formData.country_code || "IND +91",
    w_no: formData.w_no || "",
    user_email: formData.user_email || "",
  });
  const [errors, setErrors] = useState({
    user_type: "",
    user_name: "",
    country_code: "",
    w_no: "",
    user_email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));

    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let errorMessage = "";

    switch (name) {
      case "user_name":
        if (!value.trim()) {
          errorMessage = "Name is required.";
        }
        break;

      case "w_no":
        if (!value.trim()) {
          errorMessage = "WhatsApp number is required.";
        } else if (!/^\d+$/.test(value)) {
          errorMessage = "WhatsApp number must be numeric.";
        }
        break;

      case "user_email":
        if (!value.trim()) {
          errorMessage = "Email is required.";
        } else if (
          !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/.test(value)
        ) {
          errorMessage = "Invalid email address.";
        }
        break;

      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));
  };

  const validate = () => {
    const newErrors = {};

    Object.keys(formValues).forEach((field) => {
      validateField(field, formValues[field]);
      // if (!formValues[field]) {
      //   newErrors[field] = `${field.replace(/_/g, " ")} is required.`;
      // }
    });

    setErrors(newErrors);

    return Object.values(newErrors).every((error) => error === "");
  };

  const handleSubmit = () => {
    if (validate()) {
      setFormData(formValues);
      nextStep();
    }
  };

  return (
    <div id="step-1">
      <label className="d-block mb-2">I'm a</label>
      <div className="btn-group btn-group-light d-flex mb-3" role="group">
        {["O", "A", "B"].map((type) => (
          <React.Fragment key={type}>
            <input
              type="radio"
              className="btn-check"
              name="user_type"
              id={type}
              value={type}
              checked={formValues.user_type === type}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <label
              className={`btn btn-outline-light ${
                errors.user_type ? "border-danger" : ""
              }`}
              htmlFor={type}
            >
              <img
                src={`/assets/images/icons/${
                  type === "O" ? "owner" : type === "A" ? "agent" : "builder"
                }.png`}
                alt="Icon"
                height="24"
                width="24"
              />
              {type === "O" ? "Owner" : type === "A" ? "Agent" : "Builder"}
            </label>
          </React.Fragment>
        ))}
      </div>

      {/* Name Field */}
      <div className="form-field mb-3">
        <label htmlFor="name" className="form-label">
          Name
        </label>
        <input
          type="text"
          className={`form-control ${errors.user_name ? "border-danger" : ""}`}
          name="user_name"
          placeholder="Enter Your Name"
          value={formValues.user_name}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {errors.user_name && (
          <small className="text-danger">{errors.user_name}</small>
        )}
      </div>

      {/* WhatsApp Number Field */}
      <div className="input-group mb-3">
        <select
          className={`btn-group bootstrap-select input-group-btn fit-width ${
            errors.country_code ? "border-danger" : ""
          }`}
          name="country_code"
          value={formValues.country_code}
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
          className={`form-control ${errors.w_no ? "border-danger" : ""}`}
          name="w_no"
          placeholder="WhatsApp No."
          value={formValues.w_no}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {errors.w_no && <small className="text-danger">{errors.w_no}</small>}
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
        <label htmlFor="user_email" className="form-label">
          Email
        </label>
        <input
          type="email"
          name="user_email"
          className={`form-control ${
            errors.user_email ? "border-danger" : ""
          }`}
          placeholder="Enter Your Email I’d"
          value={formValues.user_email}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {errors.user_email && (
          <small className="text-danger">{errors.user_email}</small>
        )}
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
