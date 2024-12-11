"use client";
import React, { useState, useEffect } from "react";
import AuthUser from "../Authentication/AuthUser";

const cities = [
    { id: 1, name: "Abu Dhabi", localities: ["Locality 1", "Locality 2"] },
    { id: 2, name: "Ajman", localities: ["Locality 1", "Locality 2"] },
    { id: 3, name: "Dubai", localities: ["Locality 1", "Locality 2"] },
    { id: 4, name: "Fujairah", localities: ["Locality 1", "Locality 2"] },
    { id: 5, name: "Ras Al Khaimah", localities: ["Locality 1", "Locality 2"] },
    { id: 6, name: "Sharjah", localities: ["Locality 1", "Locality 2"] },
    { id: 7, name: "Umm Al-Quwain", localities: ["Locality 1", "Locality 2"] },
];

const Step3Form = ({ formData, setFormData, nextStep, prevStep }) => {
    const { callApi } = AuthUser();
    const [errors, setErrors] = useState({
        city: "",
        locality: "",
        projectName: "",
        address: "",
    });
    const [localities, setLocalities] = useState([]);

    useEffect(() => {
        if (formData.city) {
            // Update localities when city is selected
            const selectedCity = cities.find(
                (city) => city.id === parseInt(formData.city)
            );
            if (selectedCity) {
                setLocalities(selectedCity.localities);
            }
        }
    }, [formData.city]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Update formData with id and value for the city/locality
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        // Validate the field
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: validateField(name, value) ? "" : prevErrors[name],
        }));
    };

    const validateField = (name, value) => {
        switch (name) {
            case "city":
                return value !== "";
            case "locality":
                return value !== "";
            case "projectName":
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
        if (!formData.projectName || formData.projectName.trim() === "") {
            newErrors.projectName = "Please enter a project name or locality.";
        }
        if (!formData.address || formData.address.trim() === "") {
            newErrors.address = "Please enter an address.";
        } else if (formData.address.length > 300) {
            newErrors.address = "Address must be less than 300 words.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validate()) {
            nextStep();
        }
    };

    const getCityNameById = (cityId) => {
        const city = cities.find((city) => city.id === parseInt(cityId));
        return city ? city.name : "";
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
                            className={`form-control ${
                                errors.city ? "is-invalid" : ""
                            }`}
                        >
                            <option value="" disabled>
                                {errors.city || "Choose City"}
                            </option>
                            {cities.map((city) => (
                                <option key={city.id} value={city.id}>
                                    {city.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Show locality dropdown only when a city is selected */}

                <div className="col-lg-6 col-12">
                    <div className="form-field">
                        <label htmlFor="locality">Locality</label>
                        <select
                            id="locality"
                            name="locality"
                            value={formData.locality || ""}
                            onChange={handleChange}
                            className={`form-control ${
                                errors.locality ? "is-invalid" : ""
                            }`}
                        >
                            {/* Render options only if a city is selected */}
                            {formData.city ? (
                                <>
                                    <option value="" disabled>
                                        {errors.locality || "Choose Locality"}
                                    </option>
                                    {localities.map((locality, index) => (
                                        <option key={index} value={locality}>
                                            {locality}
                                        </option>
                                    ))}
                                </>
                            ) : (
                                <option value="" disabled>
                                    Please select a city first
                                </option>
                            )}
                        </select>
                    </div>
                </div>

                <div className="form-field mt-3">
                    <label htmlFor="projectName">
                        Name of Project Or Locality
                    </label>
                    <input
                        type="text"
                        id="projectName"
                        name="projectName"
                        value={formData.projectName || ""}
                        onChange={handleChange}
                        className={`form-control ${
                            errors.projectName ? "is-invalid" : ""
                        }`}
                        placeholder={
                            errors.projectName ||
                            "Enter Project Name Or Locality"
                        }
                    />
                </div>

                <div className="form-field mt-3">
                    <label htmlFor="address">Address</label>
                    <textarea
                        id="address"
                        name="address"
                        value={formData.address || ""}
                        onChange={handleChange}
                        rows={3}
                        className={`form-control ${
                            errors.address ? "is-invalid" : ""
                        }`}
                        placeholder={errors.address || "Enter Your Address"}
                    />
                    <p className="text-end text-help">
                        Maximum 300 words are allowed
                    </p>
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
