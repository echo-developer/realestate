"use client";
import React, { useEffect, useState } from "react";
import AuthUser from "../Authentication/AuthUser";
import { toast } from "react-toastify";

const Step5Form = ({ formData, setFormData, nextStep, prevStep }) => {
  const [errors, setErrors] = useState({});
  const { callApi } = AuthUser();
  const [possessionData, setPossessionData] = useState([]);
  const [showConstructionDate, setShowConstructionDate] = useState(false);

  useEffect(() => {
    FetchPossessionData();
  }, []);

  console.log(formData)

  const FetchPossessionData = async () => {
    let response;
    try {
      response = await callApi({
        api: `/get_property_status`,
        method: "GET",
      });
      if (response && response.status === 1) {
        setPossessionData(response.data);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const ageOptions = [
    { id: "age_1", label: "New", value: "New" },
    { id: "age_2", label: "Less Than 5 Years", value: "Less Than 5 Years" },
    { id: "age_3", label: "5-10 Years", value: "5-10 Years" },
    { id: "age_4", label: "10-15 Years", value: "10-15 Years" },
    { id: "age_5", label: "15-20 Years", value: "15-20 Years" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "possession_status" && value === "Under Construction") {
      setShowConstructionDate(true);
    } else if (name === "possession_status") {
      setShowConstructionDate(false);
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };
  
  const validateForm = () => {
    const newErrors = {};

    if (!formData.possession_status) {
      newErrors.possession_status = "Please select possession status.";
    }
    if (showConstructionDate) {
      if (!formData.construction_month) {
        newErrors.construction_month = "Please select a month.";
      }
      if (!formData.construction_year) {
        newErrors.construction_year = "Please select a year.";
      }
    }
    if (!formData.construct_age) {
      newErrors.construct_age = "Please select the age of construction.";
    }
    if (!formData.expected_price || isNaN(formData.expected_price)) {
      newErrors.expected_price = "Please enter a valid expected price.";
    }
    if (!formData.currency) {
      newErrors.currency = "Please select a currency.";
    }
    if (formData.token_amount && isNaN(formData.token_amount)) {
      newErrors.token_amount = "Please enter a valid token amount.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      nextStep();
    }
  };

  return (
    <div id="step-5">
      {/* Possession Status */}
      <div className="mb-3">
        <label className="form-label">Possession Status:</label>
        {possessionData.map((option) => (
          <div className="form-check form-check-inline" key={option.status_id}>
            <input
              className={`form-check-input ${
                errors.possession_status ? "is-invalid" : ""
              }`}
              type="radio"
              name="possession_status"
              id={`status-${option.status_id}`}
              value={option.status_name}
              checked={formData.possession_status === option.status_name}
              onChange={handleChange}
            />
            <label
              className="form-check-label"
              htmlFor={`status-${option.status_id}`}
            >
              {option.status_name}
            </label>
          </div>
        ))}
        {errors.possession_status && (
          <div className="invalid-feedback">{errors.possession_status}</div>
        )}
      </div>

      {/* Conditional Month and Year Input */}
      {showConstructionDate && (
        <div className="row gx-3">
          <div className="col-lg-6 col-12">
            <label className="form-label">Expected Month of Possession</label>
            <select
              className={`form-control ${
                errors.construction_date ? "is-invalid" : ""
              }`}
              name="construction_month"
              value={formData.construction_month || ""}
              onChange={handleChange}
            >
              <option value="">Select Month</option>
              {[
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ].map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>
          <div className="col-lg-6 col-12">
            <label className="form-label">Expected Year of Possession</label>
            <select
              className={`form-control ${
                errors.construction_date ? "is-invalid" : ""
              }`}
              name="construction_year"
              value={formData.construction_year || ""}
              onChange={handleChange}
            >
              <option value="">Select Year</option>
              {Array.from({ length: 21 }, (_, i) => {
                const year = new Date().getFullYear() + i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      )}
      {errors.construction_date && (
        <div className="invalid-feedback">{errors.construction_date}</div>
      )}


      {/* Age Of Construction */}
      <label className="form-label">Age Of Construction:</label>
      <div className="btn-group btn-group-light d-flex mb-3" role="group" aria-label="Age">
        {ageOptions.map((option) => (
          <React.Fragment key={option.id}>
            <input
              type="radio"
              className={`btn-check ${errors.construct_age ? "is-invalid" : ""}`}
              name="construct_age"
              id={option.id}
              autoComplete="off"
              value={option.value}
              checked={formData.construct_age === option.value}
              onChange={handleChange}
            />
            <label className="btn btn-outline-light" htmlFor={option.id}>
              {option.label}
            </label>
          </React.Fragment>
        ))}
      </div>
      {errors.construct_age && <div className="invalid-feedback">{errors.construct_age}</div>}

      {/* Expected Price */}
      <div className="row gx-3">
        <div className="col-lg-6 col-12">
          <label className="form-label">Expected Price</label>
          <div className="input-group mb-3">
            <select
              className={`selectpicker form-control ${errors.currency ? "is-invalid" : ""}`}
              value={formData.currency}
              onChange={handleChange}
              name="currency"
              data-width="fit"
              title="Currency"
            >
              <option value="">Currency</option>
              <option value="AED">AED</option>
              <option value="EURO">EURO</option>
              <option value="POND">POND</option>
              <option value="USD">USD</option>
            </select>
            <input
              type="text"
              className={`form-control ${errors.expected_price ? "is-invalid" : ""}`}
              placeholder="Enter Amount"
              value={formData.expected_price}
              onChange={handleChange}
              name="expected_price"
            />
          </div>
          {errors.expected_price && (
            <div className="invalid-feedback">{errors.expected_price}</div>
          )}
        </div>

        {/* Booking/Token Amount */}
        <div className="col-lg-6 col-12">
          <div className="form-field">
            <label className="form-label">Booking/Token Amount (optional)</label>
            <input
              type="text"
              className={`form-control ${errors.token_amount ? "is-invalid" : ""}`}
              placeholder="Enter Token Amount"
              value={formData.token_amount}
              onChange={handleChange}
              name="token_amount"
            />
            {errors.token_amount && (
              <div className="invalid-feedback">{errors.token_amount}</div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="d-grid columns-2">
        <button
          type="button"
          className="btn btn-secondary btn-back-5"
          onClick={prevStep}
        >
          <i className="bi bi-arrow-left"></i> Back
        </button>
        <button
          type="button"
          className="btn btn-primary btn-next-5"
          onClick={handleNext}
        >
          Next <i className="bi bi-arrow-right"></i>
        </button>
      </div>
    </div>
  );
};

export default Step5Form;
