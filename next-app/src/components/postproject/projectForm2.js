"use client";
import React, { useEffect, useState } from "react";
import AuthUser from "../Authentication/AuthUser";
import { ShimmerText } from "react-shimmer-effects";
import useTranslation from "@/hooks/useTranslation";

const ProjectForm2 = ({ formData, setFormData, nextStep, prevStep }) => {
  const { callApi, isLogin } = AuthUser();
  const [propertyTypeData, setPropertyTypeData] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const translation = useTranslation();

  useEffect(() => {
    fetchPropertyTypeData();
    window.scrollTo({ top: 0, behavior: "smooth" });
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
      newErrors.project_type = `${
        translation?.please_select_project_type ||
        "Please select a project type."
      }`;
    }

    if (!formData.developer_name) {
      newErrors.developer_name = `${
        translation?.please_enter_developer_name ||
        "Please enter the developer's name."
      }`;
    }
    if (!formData.developer_experience) {
      newErrors.developer_experience = `${
        translation?.please_enter_developer_experience ||
        "Please enter the developer's experience."
      }`;
    }

    if (!formData.developer_details) {
      newErrors.developer_details = `${
        translation?.please_provide_developer_details ||
        "Please provide developer details."
      }`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      nextStep();
    }
  };

  const NextButton = ({ onClick, isDisabled }) => (
    <button
      type="button"
      className="btn btn-primary btn-next-2 btn-next-1"
      onClick={onClick}
      disabled={isDisabled} // Disabled when form is not valid
    >
      {translation?.next || "Next"} <i className="bi bi-arrow-right"></i>
    </button>
  );

  const BackNextButtons = ({ prevClick, nextClick, isDisabled }) => (
    <div className="d-grid columns-2">
      <button
        type="button"
        className="btn btn-secondary btn-back-2"
        onClick={prevClick}
      >
        <i className="bi bi-arrow-left"></i>
        {translation?.back || "Back"}
      </button>
      <button
        type="button"
        className="btn btn-primary btn-next-2"
        onClick={nextClick}
        disabled={isDisabled} // Disabled when form is not valid
      >
        {translation?.next || "Next"} <i className="bi bi-arrow-right"></i>
      </button>
    </div>
  );

  const options = [
    { key: "rent", value: "Rent", icon: "/assets/images/icons/rent1.png" },
    { key: "sale", value: "Sale", icon: "/assets/images/icons/sale1.png" },
  ];

  return (
    <div id="step-2">
      {isLoading ? (
        <ShimmerText line={12} gap={10} />
      ) : (
        <>
          <label className="form-label">
            {translation?.you_are_here_to || "You are here to"}
          </label>
          <div
            className={`btn-group btn-group-light btn-group-card d-flex mb-3 ${
              errors.post_for ? "validation-error" : ""
            }`}
          >
            {options.map(({ key, value, icon }) => (
              <React.Fragment key={key}>
                <input
                  type="radio"
                  className="btn-check"
                  name="post_for"
                  id={`btnradio_${key}`}
                  checked={formData.post_for === key}
                  onChange={handleChange}
                  value={key}
                />
                <label
                  className="btn btn-outline-light"
                  htmlFor={`btnradio_${key}`}
                >
                  <img
                    src={icon}
                    alt={`${value} icon`}
                    height={48}
                    width={48}
                    className="mb-2"
                  />
                  {value}
                </label>
              </React.Fragment>
            ))}
          </div>
          {errors.post_for && (
            <div className="error-text small text-danger">
              {errors.post_for}
            </div>
          )}

          <label className="form-label">
            {translation?.project_type || "Project Type"}
          </label>
          <div
            className={`btn-group btn-group-light btn-group-card d-flex mb-3 ${
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
                   <img
                    src={`${category.image ||"/assets/images/icons/home-2.png"}`}
                    alt="Icon"
                    height={48}
                    width={48}
                    className="mb-2"
                  />
                  {category.category_name}
                </label>
              </React.Fragment>
            ))}
          </div>
          {errors.project_type && (
            <div className="error-text small text-danger">
              {errors.project_type}
            </div>
          )}

          <div className="row gx-3">
            <div className="col-md-6 col-lg-6 mb-3">
              <label className="form-label">
                {translation?.developer_name || "Developer Name"}
              </label>{" "}
              <span className="text-danger">*</span>
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
                <div className="error-text small text-danger">
                  {errors.developer_name}
                </div>
              )}
            </div>

            <div className="col-md-6 col-lg-6 mb-3">
              <label className="form-label">
                {translation?.developer_experience || "Developer Experience"}
              </label>{" "}
              <span className="text-danger">*</span>
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
                <span className="input-group-text">
                  {translation?.year || "years"}
                </span>
              </div>
              {errors.developer_experience && (
                <div className="error-text small text-danger">
                  {errors.developer_experience}
                </div>
              )}
            </div>
          </div>
          <div className="form-field">
            <label className="form-label">
              {translation?.developer_details || "Developer Details"}
            </label>{" "}
            <span className="text-danger">*</span>
            <textarea
              className={`form-control ${
                errors.developer_details ? "is-invalid" : ""
              } mb-2`}
              name="developer_details"
              value={formData.developer_details || ""}
              onChange={handleChange}
            />
            {errors.developer_details && (
              <div className="error-text small text-danger">
                {errors.developer_details}
              </div>
            )}
          </div>

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
