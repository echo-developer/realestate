"use client";
import React, { useEffect, useState } from "react";
import AuthUser from "../Authentication/AuthUser";
import MyLoader from "../LoadingSpinner/MyLoader";
// import { useAuth } from "@/context/AuthProvider";

const Step2Form = ({ formData, setFormData, nextStep, prevStep }) => {
    const { callApi } = AuthUser();
    // const {setPropertyFor}=useAuth();
    const [propertyTypeData, setPropertyTypeData] = useState([]);
    const [propertyForData, setPropertyForData] = useState([]);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchPropertyTypeData();
    }, []);


    useEffect(() => {
        if (formData.property_type) {
            fetchPropertyForData(formData.property_type);
        } else {
            setPropertyForData([]);
        }
    }, [formData.property_type]);

    const fetchPropertyTypeData = async () => {
        try {
            setIsLoading(true);
            const response = await callApi({
                api: `/get_property_type`,
                method: "GET",
            });
            if (response && response.status === 1) {
                setPropertyTypeData(response.data);
                if (!formData.property_type && response.data.length > 0) {
                    setFormData({
                        ...formData,
                        property_type: response.data[0].category_id,
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
            [name]:
                name === "property_type" || name === "property_for"
                    ? parseInt(value)
                    : value,
            ...(name === "property_type" && { property_for: "" }),
        }));

        if (errors[name]) {
            setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
        }
    };

    const handleSelectPropertyFor = (propFor) => {
        localStorage.setItem("propertyFor", propFor);
    };
    const handleSaveCategoryId = (value) => {
        console.log(value);
        localStorage.setItem("property_type", value);
    };

    const fetchPropertyForData = async (propertyTypeId) => {
        try {
            setIsLoading(true);
            const response = await callApi({
                api: `/get_property_for`,
                method: "GET",
                data: { id: propertyTypeId },
            });
            if (response && response.status === 1) {
                const subcategories = response.data[""] || [];
                setPropertyForData(subcategories);
                if (subcategories.length > 0) {
                    setFormData((prevData) => ({
                        ...prevData,
                        property_for: subcategories[0].sub_category_id,
                    }));
                }
            }
        } catch (error) {
            console.error("Failed to fetch property for data", error);
        } finally {
            setIsLoading(false);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.post_for) {
            newErrors.post_for = "Please select what you are here for.";
        }

        if (!formData.property_type) {
            newErrors.property_type = "Please select a property type.";
        }

        if (!formData.property_for) {
            newErrors.property_for = "Please select a property for.";
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
        <div id="step-2">
            {isLoading ? (
                <MyLoader />
            ) : (
                <>
                    <label className="form-label">You are here to</label>
                    <div
                        className={`btn-group btn-group-light d-flex mb-3 ${
                            errors.post_for ? "validation-error" : ""
                        }`}
                        role="group"
                    >
                        <input
                            type="radio"
                            className="btn-check"
                            name="post_for"
                            id="btnradio1"
                            checked={formData.post_for === "rent"}
                            onChange={handleChange}
                            value="rent"
                        />
                        <label
                            className="btn btn-outline-light"
                            htmlFor="btnradio1"
                        >
                            <img
                                src="/assets/images/icons/rent-3.png"
                                alt="Icon"
                                height="24"
                                width="24"
                            />{" "}
                            Rent
                        </label>
                        <input
                            type="radio"
                            className="btn-check"
                            name="post_for"
                            id="btnradio2"
                            checked={formData.post_for === "sale"}
                            onChange={handleChange}
                            value="sale"
                        />
                        <label
                            className="btn btn-outline-light"
                            htmlFor="btnradio2"
                        >
                            <img
                                src="/assets/images/icons/sale-2.png"
                                alt="Icon"
                                height="24"
                                width="24"
                            />{" "}
                            Sale
                        </label>
                        <input
                            type="radio"
                            className="btn-check"
                            name="post_for"
                            id="btnradio3"
                            checked={formData.post_for === "pg"}
                            onChange={handleChange}
                            value="pg"
                        />
                        <label
                            className="btn btn-outline-light"
                            htmlFor="btnradio3"
                        >
                            <img
                                src="/assets/images/icons/hostel.png"
                                alt="Icon"
                                height="24"
                                width="24"
                            />{" "}
                            PG/Hostel
                        </label>
                    </div>
                    {errors.post_for && (
                        <div className="error-text">{errors.post_for}</div>
                    )}

                    <label className="form-label">Property Type</label>
                    <div
                        className={`btn-group btn-group-light d-flex mb-3 ${
                            errors.property_type ? "validation-error" : ""
                        }`}
                        role="group"
                    >
                        {propertyTypeData.map((category) => (
                            <React.Fragment key={category.category_id}>
                                <input
                                    type="radio"
                                    className="btn-check"
                                    name="property_type"
                                    id={`property_${category.category_id}`}
                                    checked={
                                        formData.property_type ===
                                        category.category_id
                                    }
                                    onChange={handleChange}
                                    value={category.category_id}
                                    onClick={() =>
                                        handleSaveCategoryId(
                                            category.category_id
                                        )
                                    }
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
                    {errors.property_type && (
                        <div className="error-text">{errors.property_type}</div>
                    )}

                    {propertyForData.length > 0 && (
                        <>
                            <label className="form-label">Property For</label>
                            <div
                                className={`btn-group btn-group-light d-flex mb-3 ${
                                    errors.property_for
                                        ? "validation-error"
                                        : ""
                                }`}
                                role="group"
                            >
                                {propertyForData.map((subcategory) => (
                                    <React.Fragment
                                        key={subcategory.sub_category_id}
                                    >
                                        <input
                                            type="radio"
                                            className="btn-check"
                                            name="property_for"
                                            id={`property_for_${subcategory.sub_category_id}`}
                                            checked={
                                                formData.property_for ===
                                                subcategory.sub_category_id
                                            }
                                            onChange={handleChange}
                                            value={subcategory.sub_category_id}
                                            onClick={() =>
                                                handleSelectPropertyFor(
                                                    subcategory?.sub_category_key
                                                )
                                            }
                                        />
                                        <label
                                            className="btn btn-outline-light"
                                            htmlFor={`property_for_${subcategory.sub_category_id}`}
                                        >
                                            {subcategory.sub_category_name}
                                        </label>
                                    </React.Fragment>
                                ))}
                            </div>
                            {errors.property_for && (
                                <div className="error-text">
                                    {errors.property_for}
                                </div>
                            )}
                        </>
                    )}

                    <div className="d-grid columns-2">
                        <button
                            type="button"
                            className="btn btn-secondary btn-back-2"
                            onClick={prevStep}
                        >
                            <i className="bi bi-arrow-left"></i> Back
                        </button>
                        <button
                            type="button"
                            className="btn btn-primary btn-next-2"
                            onClick={handleNext}
                        >
                            Next <i className="bi bi-arrow-right"></i>
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Step2Form;
