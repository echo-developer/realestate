"use client";
import React, { useEffect, useState } from "react";
import AuthUser from "../Authentication/AuthUser";
import { toast } from "react-toastify";
import { months, ageOptions } from "../post/PropertyData";
import { ShimmerText } from "react-shimmer-effects";

const Step5From = ({ formData, setFormData, nextStep, prevStep }) => {
  const [errors, setErrors] = useState({});
  const { callApi } = AuthUser();
  const [possessionData, setPossessionData] = useState([]);
  const [showConstructionDate, setShowConstructionDate] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    FetchPossessionData();
  }, []);

  const FetchPossessionData = async () => {
    setLoading(true);
    try {
      const response = await callApi({
        api: `/get_property_status`,
        method: "GET",
      });
      if (response && response.status === 1) {
        setPossessionData(response.data);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to fetch possession status data.");
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "possession_status") {
      const isUnderConstruction = parseInt(value) === 2;
      setShowConstructionDate(isUnderConstruction);
      setFormData((prevData) => ({
        ...prevData,
        construct_age: "",
      }));
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

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

    if (formData.possession_status === "1" && !formData.construct_age) {
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

  if (loading) {
    return <ShimmerText line={10} gap={10} />;
  }

  return (
    <div id="step-5">
      {/* Possession Status */}
      <div className="mb-3">
        <label className="form-label d-block">Possession Status:</label>
        {possessionData.map((option) => (
          <div className="form-check form-check-inline" key={option.status_id}>
            <input
              className={`form-check-input ${
                errors.possession_status ? "is-invalid" : ""
              }`}
              type="radio"
              name="possession_status"
              id={`status-${option.status_id}`}
              value={option.status_id}
              checked={formData.possession_status == option.status_id}
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

      {/* Conditional Rendering for "Age of Construction" */}
      {formData.possession_status === "1" && (
        <div>
          <label className="form-label">Age Of Construction:</label>
          <div
            className={`btn-group btn-group-light d-flex flex-wrap mb-3 ${
              errors.construct_age ? "was-validated" : ""
            }`}
            role="group"
            aria-label="Age"
          >
            {ageOptions.map((option) => (
              <React.Fragment key={option.id}>
                <input
                  type="radio"
                  className="btn-check"
                  name="construct_age"
                  id={option.id}
                  autoComplete="off"
                  value={option.key}
                  checked={formData.construct_age === option.key}
                  onChange={handleChange}
                />
                <label
                  className={`btn btn-outline-light mb-2 ${
                    errors.construct_age ? "border border-danger" : ""
                  }`}
                  htmlFor={option.id}
                >
                  {option.value}
                </label>
              </React.Fragment>
            ))}
          </div>
          {errors.construct_age && (
            <div className="text-danger mt-1">{errors.construct_age}</div>
          )}
        </div>
      )}

      {/* Conditional Month and Year Input */}
      {showConstructionDate && (
        <div className="row gx-3">
          <div className="col-lg-6 col-12 mb-3">
            <label className="form-label">Expected Month of Possession</label>
            <select
              className={`form-control ${
                errors.construction_month ? "is-invalid" : ""
              }`}
              name="construction_month"
              value={formData.construction_month || ""}
              onChange={handleChange}
            >
              <option value="">Select Month</option>
              {months.map((month) => (
                <option key={month.id} value={month.id}>
                  {month.name}
                </option>
              ))}
            </select>
            {errors.construction_month && (
              <div className="invalid-feedback">
                {errors.construction_month}
              </div>
            )}
          </div>
          <div className="col-lg-6 col-12 mb-3">
            <label className="form-label">Expected Year of Possession</label>
            <select
              className={`form-control ${
                errors.construction_year ? "is-invalid" : ""
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
            {errors.construction_year && (
              <div className="invalid-feedback">{errors.construction_year}</div>
            )}
          </div>
        </div>
      )}

      {/* Expected Price */}
      <div className="row gx-3">
        <div className="col-lg-6 col-12">
          <label className="form-label">Expected Price</label>
          <div className="input-group mb-3">
            <select
              className={`selectpicker form-control ${
                errors.currency ? "is-invalid" : ""
              }`}
              value={formData.currency}
              onChange={handleChange}
              name="currency"
              data-width="fit"
              title="Currency"
              style={{ maxWidth: '115px' }}
            >
              <option value="">Currency</option>
              <option value="AED">AED</option>
              <option value="EURO">EURO</option>
              <option value="POND">POND</option>
              <option value="USD">USD</option>
            </select>
            <input
              type="text"
              className={`form-control ${
                errors.expected_price ? "is-invalid" : ""
              }`}
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
            <label className="form-label">
              Booking/Token Amount (optional)
            </label>
            <input
              type="text"
              className={`form-control ${
                errors.token_amount ? "is-invalid" : ""
              }`}
              placeholder="Enter Token Amount"
              value={formData.token_amount}
              onChange={handleChange}
              name="token_amount"
            />
          </div>
          {errors.token_amount && (
            <div className="invalid-feedback">{errors.token_amount}</div>
          )}
        </div>
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

export default Step5From;
