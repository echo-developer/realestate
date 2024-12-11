"use client";
import React, { useState, useEffect } from "react";
import AuthUser from "../Authentication/AuthUser";

const Step3Form = ({ formData, setFormData, nextStep, prevStep }) => {
    const { callApi } = AuthUser();
    const [errors, setErrors] = useState({
        city: "",
        locality: "",
        projectName: "",
        address: "",
    });
    const [localities, setLocalities] = useState([]);
    const [cityData, setCityData] = useState([]);

    useEffect(() => {
        // Fetch the city data
        FetchCityData();
    }, []);

    useEffect(() => {
        if (formData.city) {
            // Fetch the locality data when a city is selected
            FetchLocalityData(formData.city);
        }
    }, [formData.city]);

    const FetchCityData = async () => {
        try {
            const response = await callApi({
                api: `/get_property_cities`,
                method: "GET",
            });
            if (response && response.status === 1) {
                setCityData(response.data);
            }
        } catch (error) {
            console.error("Error fetching city data:", error);
        }
    };

    const FetchLocalityData = async (cityId) => {
        try {
            const response = await callApi({
                api: `/get_property_for`,
                method: "GET",
                data: {
                    id: cityId,  // Pass selected cityId
                },
            });

            if (response && response.status === 1) {
                const localityData = response.data[""]; // Access data from the key ""
                // Ensure localityData is an array before setting the localities
                setLocalities(Array.isArray(localityData) ? localityData : []);
            }
        } catch (error) {
            console.error("Error fetching locality data:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Update formData with the changed field
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
                    </div>
                </div>

                {/* Project Name Input */}
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
                        className={`form-control ${errors.projectName ? "is-invalid" : ""}`}
                        placeholder={errors.projectName || "Enter Project Name Or Locality"}
                    />
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
                        placeholder={errors.address || "Enter Your Address"}
                    />
                    <p className="text-end text-help">
                        Maximum 300 words are allowed
                    </p>
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
