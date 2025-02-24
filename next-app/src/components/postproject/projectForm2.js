"use client";
import React, { useEffect, useState } from "react";
import AuthUser from "../Authentication/AuthUser";
import { ShimmerText } from "react-shimmer-effects";

const ProjectForm2 = ({ formData, setFormData, nextStep, prevStep }) => {
  const { callApi, isLogin } = AuthUser();
  const [propertyTypeData, setPropertyTypeData] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPropertyTypeData();
  }, []);

  useEffect(() => {
    if (!formData.post_for) {
      setFormData((prevData) => ({
        ...prevData,
        post_for: "rent",
      }));
    }
  }, [formData.post_for, setFormData]);

  const fetchPropertyTypeData = async () => {
    try {
      setIsLoading(true);
      const response = await callApi({
        api: `/get_property_type`,
        method: "GET",
      });
      if (response && response.status === 1) {
        setPropertyTypeData(response.data);
        if (!formData.project_type && response.data.length > 0) {
          setFormData({
            ...formData,
            project_type: response.data[0].category_id,
          });
        }
      }
    } catch (error) {
      console.error("Failed to fetch property types", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "project_type" ? parseInt(value) : value,
    }));

    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.project_type) {
      newErrors.project_type = "Please select a property type.";
    }

    if (!formData.developer_name) {
      newErrors.developer_name = "Please enter the developer's name.";
    }
    if (!formData.developer_experience) {
      newErrors.developer_experience =
        "Please enter the developer's experience.";
    }

    if (!formData.developer_details) {
      newErrors.developer_details = "Please provide developer details.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      nextStep();
    }
  };

  const NextButton = ({ onClick }) => (
    <button
      type="button"
      className="btn btn-primary btn-next-2 btn-next-1"
      onClick={onClick}
    >
      Next <i className="bi bi-arrow-right"></i>
    </button>
  );

  const BackNextButtons = ({ prevClick, nextClick }) => (
    <div className="d-grid columns-2">
      <button
        type="button"
        className="btn btn-secondary btn-back-2"
        onClick={prevClick}
      >
        <i className="bi bi-arrow-left"></i> Back
      </button>
      <button
        type="button"
        className="btn btn-primary btn-next-2"
        onClick={nextClick}
      >
        Next <i className="bi bi-arrow-right"></i>
      </button>
    </div>
  );

  return (
    <div id="step-2">
      {isLoading ? (
        <ShimmerText line={12} gap={10} />
      ) : (
        <>
          <label className="form-label">You are here to</label>
          <div
            className={`btn-group btn-group-light d-flex mb-3 ${
              errors.post_for ? "validation-error" : ""
            }`}
          >
            {["rent", "sale"].map((option) => (
              <React.Fragment key={option}>
                <input
                  type="radio"
                  className="btn-check"
                  name="post_for"
                  id={`btnradio_${option}`}
                  checked={formData.post_for === option}
                  onChange={handleChange}
                  value={option}
                />
                <label
                  className="btn btn-outline-light"
                  htmlFor={`btnradio_${option}`}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </label>
              </React.Fragment>
            ))}
          </div>
          {errors.post_for && (
            <div className="error-text">{errors.post_for}</div>
          )}

          <label className="form-label">Property Type</label>
          <div
            className={`btn-group btn-group-light d-flex mb-3 ${
              errors.project_type ? "validation-error" : ""
            }`}
            role="group"
          >
            {propertyTypeData.map((category) => (
              <React.Fragment key={category.category_id}>
                <input
                  type="radio"
                  className="btn-check"
                  name="project_type"
                  id={`property_${category.category_id}`}
                  checked={formData.project_type === category.category_id}
                  onChange={handleChange}
                  value={category.category_id}
                />
                <label
                  className="btn btn-outline-light"
                  htmlFor={`property_${category.category_id}`}
                >
                  {category.category_name}
                </label>
              </React.Fragment>
            ))}
          </div>
          {errors.project_type && (
            <div className="error-text">{errors.project_type}</div>
          )}

          <div className="row gx-3 align-items-end">
            <div className="col-md-6 col-lg-6">
              <label className="form-label">Developer Name</label>
              <input
                type="text"
                className={`form-control ${
                  errors.developer_name ? "is-invalid" : ""
                }`}
                name="developer_name"
                value={formData.developer_name || ""}
                onChange={handleChange}
              />
              {errors.developer_name && (
                <div className="error-text">{errors.developer_name}</div>
              )}
            </div>

            <div className="col-md-6 col-lg-6">
              <label className="form-label">Developer Experience</label>
              <div className="input-group">
                <input
                  type="number"
                  className={`form-control ${
                    errors.developer_experience ? "is-invalid" : ""
                  }`}
                  name="developer_experience"
                  value={formData.developer_experience || ""}
                  onChange={handleChange}
                />
                <span className="input-group-text">years</span>
              </div>
              {errors.developer_experience && (
                <div className="error-text">{errors.developer_experience}</div>
              )}
            </div>
          </div>

          <label className="form-label">Developer Details</label>
          <textarea
            className={`form-control ${
              errors.developer_details ? "is-invalid" : ""
            } mb-2`}
            name="developer_details"
            value={formData.developer_details || ""}
            onChange={handleChange}
          />
          {errors.developer_details && (
            <div className="error-text">{errors.developer_details}</div>
          )}

          {isLogin() ? (
            <div className="d-grid">
              <NextButton onClick={handleNext} />
            </div>
          ) : (
            <BackNextButtons prevClick={prevStep} nextClick={handleNext} />
          )}
        </>
      )}
    </div>
  );
};

export default ProjectForm2;
