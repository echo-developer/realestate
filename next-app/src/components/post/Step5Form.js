"use client";
import React, { useEffect, useState } from "react";
import AuthUser from "../Authentication/AuthUser";
import { toast } from "react-toastify";
import { months, ageOptions } from "../post/PropertyData";
import { ShimmerText } from "react-shimmer-effects";
import useTranslation from "@/hooks/useTranslation";

const Step5Form = ({ formData, setFormData, nextStep, prevStep }) => {
  const [errors, setErrors] = useState({});
  const { callApi } = AuthUser();
  const [possessionData, setPossessionData] = useState([]);
  const [showConstructionDate, setShowConstructionDate] = useState(false);
  const [loading, setLoading] = useState(false);
  const translation = useTranslation();

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
        construction_month: "",
        construction_year: "",
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
        newErrors.construction_month =
          translation?.select_a_month || "Please select a month.";
      }
      if (!formData.construction_year) {
        newErrors.construction_year =
          translation?.select_a_year || "Please select a year.";
      }
    }

    if (formData.possession_status === "1" && !formData.construct_age) {
      newErrors.construct_age =
        translation?.select_age_of_construction ||
        "Please select the age of construction.";
    }

    if (!formData.expected_price || isNaN(formData.expected_price)) {
      newErrors.expected_price =
        translation?.enter_valid_expected_price ||
        "Please enter a valid expected price.";
    }

    if (!formData.currency) {
      newErrors.currency = translation?.select_currency || "Please select a currency.";
    }

    if (formData.token_amount && isNaN(formData.token_amount)) {
      newErrors.token_amount =
        translation?.enter_valid_token_amount ||
        "Please enter a valid token amount.";
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
      <div className="mb-3">
        <label className="form-label d-block">
          {translation?.possession_status || "Possession Status:"}{" "}
          <span className="text-danger">*</span>
        </label>
        {possessionData.map((option) => (
          <div className="form-check form-check-inline" key={option.status_id}>
            <input
              className={`form-check-input ${errors.possession_status ? "is-invalid" : ""}`}
              type="radio"
              name="possession_status"
              id={`status-${option.status_id}`}
              value={option.status_id}
              checked={formData.possession_status == option.status_id}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor={`status-${option.status_id}`}>
              {option.status_name}
            </label>
          </div>
        ))}
        {errors.possession_status && (
          <div className="invalid-feedback">{errors.possession_status}</div>
        )}
      </div>

      {formData.possession_status === "1" && (
        <div>
          <label className="form-label">
            {translation?.age_of_construction || "Age Of Construction:"}{" "}
            <span className="text-danger">*</span>
          </label>
          <div className={`btn-group btn-group-light d-flex flex-wrap mb-3 ${errors.construct_age ? "was-validated" : ""}`} role="group">
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
                <label className={`btn btn-outline-light mb-2 ${errors.construct_age ? "border border-danger" : ""}`} htmlFor={option.id}>
                  {option.value}
                </label>
              </React.Fragment>
            ))}
          </div>
          {errors.construct_age && <div className="text-danger mt-1">{errors.construct_age}</div>}
        </div>
      )}

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

export default Step5Form;
