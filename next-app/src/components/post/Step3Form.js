"use client";
import React, { useState, useEffect } from "react";
import AuthUser from "../Authentication/AuthUser";

const Step3Form = ({ formData, setFormData, nextStep, prevStep }) => {

    const { callApi } = AuthUser();
    const [errors, setErrors] = useState({
        city: "",
        locality: "",
        project_name: "",
        address: "",
    });
    const [localities, setLocalities] = useState([]);
    const [cityData, setCityData] = useState([]);

    useEffect(() => {
        fetchCityData();
    }, []);

    useEffect(() => {
        if (formData.city) {
            fetchLocalityData(formData.city);
        }
    }, [formData.city]);

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

    const fetchLocalityData = async (cityId) => {
        try {
            const response = await callApi({
                api: "/get_property_for",
                method: "GET",
                data: { id: cityId },
            });

            if (response && response.status === 1) {
                const localityData = response.data[""];
                setLocalities(Array.isArray(localityData) ? localityData : []);
            }
        } catch (error) {
            console.error("Error fetching locality data:", error);
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

    const validateField = (name, value) => {
        switch (name) {
            case "city":
            case "locality":
                return value !== "";
            case "project_name":
                return value.trim() !== "";
            case "address":
                return value.trim() !== "" && value.length <= 300;
            default:
                return true;
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.city) {
            newErrors.city = "Please select a city.";
        }
        if (!formData.locality) {
            newErrors.locality = "Please select a locality.";
        }
        if (!formData.project_name || formData.project_name.trim() === "") {
            newErrors.project_name = "Please enter a project name or locality.";
        }
        if (!formData.address || formData.address.trim() === "") {
            newErrors.address = "Please enter an address.";
        } else if (formData.address.length > 300) {
            newErrors.address = "Address must be less than 300 characters.";
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
                        <label htmlFor="city">City</label>
                        <select
                            id="city"
                            name="city"
                            value={formData.city || ""}
                            onChange={handleChange}
                            className={`form-control ${errors.city ? "is-invalid" : ""}`}
                        >
                            <option value="" disabled>
                                {errors.city || "Choose City"}
                            </option>
                            {cityData.map((city) => (
                                <option key={city.city_id} value={city.city_id}>
                                    {city.name}
                                </option>
                            ))}
                        </select>
                        {errors.city && <div className="invalid-feedback">{errors.city}</div>}
                    </div>
                </div>

                {/* Locality Dropdown */}
                <div className="col-lg-6 col-12">
                    <div className="form-field">
                        <label htmlFor="locality">Locality</label>
                        <select
                            id="locality"
                            name="locality"
                            value={formData.locality || ""}
                            onChange={handleChange}
                            className={`form-control ${errors.locality ? "is-invalid" : ""}`}
                        >
                            {formData.city ? (
                                <>
                                    <option value="" disabled>
                                        {errors.locality || "Choose Locality"}
                                    </option>
                                    {localities.length > 0 ? (
                                        localities.map((locality) => (
                                            <option
                                                key={locality.sub_category_id}
                                                value={locality.sub_category_id}
                                            >
                                                {locality.sub_category_name}
                                            </option>
                                        ))
                                    ) : (
                                        <option value="" disabled>
                                            No localities available
                                        </option>
                                    )}
                                </>
                            ) : (
                                <option value="" disabled>
                                    Please select a city first
                                </option>
                            )}
                        </select>
                        {errors.locality && <div className="invalid-feedback">{errors.locality}</div>}
                    </div>
                </div>

                {/* Project Name Input */}
                <div className="form-field mt-3">
                    <label htmlFor="project_name">Name of Project Or Locality</label>
                    <input
                        type="text"
                        id="project_name"
                        name="project_name"
                        value={formData.project_name || ""}
                        onChange={handleChange}
                        className={`form-control ${errors.project_name ? "is-invalid" : ""}`}
                        placeholder="Enter Project Name Or Locality"
                    />
                    {errors.project_name && <div className="invalid-feedback">{errors.project_name}</div>}
                </div>

                {/* Address Input */}
                <div className="form-field mt-3">
                    <label htmlFor="address">Address</label>
                    <textarea
                        id="address"
                        name="address"
                        value={formData.address || ""}
                        onChange={handleChange}
                        rows={3}
                        className={`form-control ${errors.address ? "is-invalid" : ""}`}
                        placeholder="Enter Your Address"
                    />
                    <p className="text-end text-help">Maximum 300 characters are allowed</p>
                    {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                </div>

                {/* Navigation Buttons */}
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
