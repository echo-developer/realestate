"use client";
import React, { useEffect, useState } from "react";
import AuthUser from "../Authentication/AuthUser";
import { ShimmerText } from "react-shimmer-effects";
import useTranslation from "@/hooks/useTranslation";

const Step2Form = ({ formData, setFormData, nextStep, prevStep }) => {
  const { callApi, isLogin, GetMemberId } = AuthUser();
  const [propertyTypeData, setPropertyTypeData] = useState([]);
  const [propertyForData, setPropertyForData] = useState([]);
  const [projectData, setProjectData] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const translation = useTranslation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (!formData.post_for) {
      setFormData((prevData) => ({
        ...prevData,
        post_for: "rent",
      }));
    }
  }, [formData.post_for, setFormData]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      const [propertyTypeRes, projectListRes] = await Promise.all([
        callApi({ api: `/get_property_type`, method: "GET" }),
        callApi({ api: `/projects-list`, method: "GET" }),
      ]);

      if (propertyTypeRes?.status === 1) {
        setPropertyTypeData(propertyTypeRes.data);
        if (!formData.property_type && propertyTypeRes.data.length > 0) {
          setFormData((prevData) => ({
            ...prevData,
            property_type: propertyTypeRes.data[0].category_id,
          }));
          localStorage.setItem(`property_type`,propertyTypeRes.data[0].category_id);
        }
      }

      if (projectListRes?.status === 1) {
        setProjectData(projectListRes.data);
      }
    } catch (error) {
      console.error("Error fetching initial data:", error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };

  useEffect(() => {
    if (formData.property_type) {
      fetchPropertyForData(formData.property_type);
    } else {
      setPropertyForData([]);
    }
  }, [formData.property_type]);

  const fetchPropertyForData = async (propertyTypeId) => {
    try {
      setIsLoading(true);
      const response = await callApi({
        api: `/get_property_for`,
        method: "GET",
        data: { id: propertyTypeId },
      });

      if (response?.status === 1) {
        setPropertyForData(response.data);

        // Only set property_for if it is NOT already selected
        if (!formData.property_for && response.data.length > 0) {
          setFormData((prevData) => ({
            ...prevData,
            property_for: response.data[0].sub_category_id,
          }));
        }
      }
    } catch (error) {
      console.error("Failed to fetch property for data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    localStorage.setItem(`${name}`, value || formData.property_type);
    setFormData((prevData) => ({
      ...prevData,
      [name]:
        name === "property_type" || name === "property_for"
          ? parseInt(value)
          : value,
      ...(name === "property_type" && { property_for: "" }),
    }));

    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }

    if (name === "project_name") {
      setFilteredProjects(
        projectData.filter((project) =>
          project.project_name.toLowerCase().includes(value.toLowerCase())
        )
      );
    }

    if (name === "property_for") {
      const selectedProperty = propertyForData.find(
        (property) => property.sub_category_id === parseInt(value)
      );
      if (selectedProperty) {
        localStorage.setItem(
          "property_for_key",
          selectedProperty.subcategory_key
        );
      }
    }
  };
  const handleProjectSelection = (projectName) => {
    setFormData((prevData) => ({
      ...prevData,
      project_name: projectName,
    }));
    setFilteredProjects([]);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.post_for)
      newErrors.post_for = "Please select what you are here for.";
    if (!formData.property_type)
      newErrors.property_type = "Please select a property type.";
    if (!formData.property_for)
      newErrors.property_for = "Please select a property for.";
    if (
      formData.project_property_type === "under_project" &&
      !formData.project_name
    ) {
      newErrors.project_name = "Please select or enter a valid project name.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      const selectedProperty = propertyForData.find(
        (property) => property.sub_category_id === formData.property_for
      );

      if (selectedProperty) {
        localStorage.setItem(
          "property_for_key",
          selectedProperty.subcategory_key
        );
      }

      nextStep();
    }
  };

  return (
    <div id="step-2">
      {isLoading ? (
        <ShimmerText line={15} gap={10} />
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
            {["rent", "sale", "pg"].map((option) => (
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
                  <img
                    src="/assets/images/icons/rent-3.png"
                    alt="Icon"
                    height={48}
                    width={48}
                    className="mb-2"
                  />

                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </label>
              </React.Fragment>
            ))}
          </div>
          {errors.post_for && (
            <div className="error-text text-danger small">
              {errors.post_for}
            </div>
          )}

          <label className="form-label">
            {translation?.property_type || "Property Type"}
          </label>
          <div
            className="btn-group btn-group-light btn-group-card d-flex mb-3"
            role="group"
          >
            {propertyTypeData.map((property) => (
              <React.Fragment key={property.category_id}>
                <input
                  className="btn-check"
                  id={`property_${property.category_id}`}
                  type="radio"
                  name="property_type"
                  value={property.category_id}
                  checked={formData.property_type === property.category_id}
                  onChange={handleChange}
                />
                <label
                  className={`btn btn-outline-light ${
                    formData.property_type === property.category_id
                      ? "active"
                      : ""
                  }`}
                  htmlFor={`property_${property.category_id}`}
                >
                  <img
                    src="/assets/images/icons/home-2.png"
                    alt="Icon"
                    height={48}
                    width={48}
                    className="mb-2"
                  />

                  {property.category_name}
                </label>
              </React.Fragment>
            ))}
          </div>
          {errors.property_type && (
            <div className="text-danger small">{errors.property_type}</div>
          )}

          <label className="form-label">
            {translation?.property_for || "Property For"}
          </label>

          <div
            className="btn-group btn-group-light d-flex btn-group-card flex-wrap mb-3"
            role="group"
          >
            {propertyForData.map((property) => (
              <React.Fragment key={property.sub_category_id}>
                <input
                  className="btn-check"
                  id={`property_for_${property.sub_category_id}`}
                  type="radio"
                  name="property_for"
                  value={property.sub_category_id}
                  checked={formData.property_for === property.sub_category_id}
                  onChange={handleChange}
                />
                <label
                  className="btn btn-outline-light"
                  htmlFor={`property_for_${property.sub_category_id}`}
                >
                  <img
                    src="/assets/images/icons/shopping.png"
                    alt="Icon"
                    height={48}
                    width={48}
                    className="mb-2"
                  />
                  {property.sub_category_name}
                </label>
              </React.Fragment>
            ))}
          </div>
          {errors.property_for && (
            <div className="text-danger small">{errors.property_for}</div>
          )}

          <label className="form-label">
            {translation?.property_type_for_project ||
              "Property Type For Project:"}
          </label>
          <div
            className="btn-group btn-group-light btn-group-card d-flex mb-3"
            role="group"
          >
            <input
              className="btn-check"
              id="individual_property"
              type="radio"
              name="project_property_type"
              value="individual"
              checked={formData.project_property_type === "individual"}
              onChange={handleChange}
            />
            <label
              className={`btn btn-outline-light ${
                formData.project_property_type === "individual" ? "active" : ""
              }`}
              htmlFor="individual_property"
            >
              <img
                src="/assets/images/icons/owner.png"
                alt="Icon"
                height={48}
                width={48}
                className="mb-2"
              />
              {translation?.individual_property || "Individual Property:"}
            </label>

            <input
              className="btn-check"
              id="under_project"
              type="radio"
              name="project_property_type"
              value="under_project"
              checked={formData.project_property_type === "under_project"}
              onChange={handleChange}
            />
            <label
              className={`btn btn-outline-light ${
                formData.project_property_type === "under_project"
                  ? "active"
                  : ""
              }`}
              htmlFor="under_project"
            >
              <img
                src="/assets/images/icons/tower.png"
                alt="Icon"
                height={48}
                width={48}
                className="mb-2"
              />
              {translation?.available_under_a_project ||
                "Available Under a Project:"}
            </label>
          </div>
          {errors.project_property_type && (
            <div className="text-danger small">
              {errors.project_property_type}
            </div>
          )}

          {formData.project_property_type === "under_project" && (
            <div className="mt-3 mb-3">
              <label className="form-label">
                {translation?.project_name || "Project Name"}
              </label>
              <input
                type="text"
                className={`form-control ${
                  errors.project_name ? "is-invalid" : ""
                }`}
                name="project_name"
                value={formData.project_name || ""}
                onChange={handleChange}
              />
              {errors.project_name && (
                <div className="invalid-feedback">{errors.project_name}</div>
              )}
              {filteredProjects.length > 0 && (
                <ul className="list-group mt-2 mb-3">
                  {filteredProjects.map((project) => (
                    <li
                      key={project.project_id}
                      className="list-group-item list-group-item-action"
                      onClick={() =>
                        handleProjectSelection(project.project_name)
                      }
                    >
                      {project.project_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
          {isLogin() ? (
            <div className="d-grid">
              <button
                type="button"
                className="btn btn-primary btn-next-2 btn-next-1"
                onClick={handleNext}
              >
                {translation?.next || "Next"}{" "}
                <i className="bi bi-arrow-right"></i>
              </button>
            </div>
          ) : (
            <div className="d-grid columns-2 mt-4">
              <button
                type="button"
                className="btn btn-secondary btn-back-cta"
                onClick={prevStep}
                disabled={isLogin()}
              >
                {translation?.back || "Back"}
              </button>
              <button
                type="button"
                className="btn btn-primary btn-next-cta"
                onClick={handleNext}
              >
                {translation?.next || "Next"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Step2Form;
