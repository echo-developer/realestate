"use client";
import React, { useEffect, useState } from "react";
import AuthUser from "../Authentication/AuthUser";
import MyLoader from "../LoadingSpinner/MyLoader";

const Step2Form = ({ formData, setFormData, nextStep, prevStep }) => {
    const { callApi } = AuthUser();
    const [propertyTypeData, setPropertyTypeData] = useState([]);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(true); 

    useEffect(() => {
        FetchPropertyTypeData();
    }, []);

    const FetchPropertyTypeData = async () => {
        try {
            setIsLoading(true);
            const response = await callApi({
                api: `/get_property_type`,
                method: "GET",
            });
            if (response && response.status === 1) {
                setPropertyTypeData(response.data);
                if (!formData.propertyType && response.data.length > 0) {
                    setFormData({ ...formData, propertyType: response.data[0].category_id });
                }
            }
        } catch (error) {
            console.error("Failed to fetch property types", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleIncrement = () => {
        setFormData({ ...formData, totalFlats: formData.totalFlats + 1 });
    };

    const handleDecrement = () => {
        if (formData.totalFlats > 1) {
            setFormData({ ...formData, totalFlats: formData.totalFlats - 1 });
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: name === "propertyType" ? parseInt(value) : value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: "" });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.postFor) {
            newErrors.postFor = "Please select what you are here for.";
        }

        if (!formData.propertyType) {
            newErrors.propertyType = "Please select a property type.";
        }

        if (!formData.totalFlats || formData.totalFlats < 1) {
            newErrors.totalFlats = "Total flats must be at least 1.";
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
                        className={`btn-group btn-group-light d-flex mb-3 ${errors.postFor ? "validation-error" : ""}`}
                        role="group"
                    >
                        <input
                            type="radio"
                            className="btn-check"
                            name="postFor"
                            id="btnradio1"
                            checked={formData.postFor === "rent"}
                            onChange={handleChange}
                            value="rent"
                        />
                        <label className="btn btn-outline-light" htmlFor="btnradio1">
                            <img
                                src="/assets/images/icons/rent-3.png"
                                alt="Icon"
                                height="24"
                                width="24"
                            /> Rent
                        </label>
                        <input
                            type="radio"
                            className="btn-check"
                            name="postFor"
                            id="btnradio2"
                            checked={formData.postFor === "sale"}
                            onChange={handleChange}
                            value="sale"
                        />
                        <label className="btn btn-outline-light" htmlFor="btnradio2">
                            <img
                                src="/assets/images/icons/sale-2.png"
                                alt="Icon"
                                height="24"
                                width="24"
                            /> Sale
                        </label>
                        <input
                            type="radio"
                            className="btn-check"
                            name="postFor"
                            id="btnradio3"
                            checked={formData.postFor === "pg"}
                            onChange={handleChange}
                            value="pg"
                        />
                        <label className="btn btn-outline-light" htmlFor="btnradio3">
                            <img
                                src="/assets/images/icons/hostel.png"
                                alt="Icon"
                                height="24"
                                width="24"
                            /> PG/Hostel
                        </label>
                    </div>
                    {errors.postFor && <div className="error-text">{errors.postFor}</div>}

                    <label className="form-label">Property Type</label>
                    <div
                        className={`btn-group btn-group-light d-flex mb-3 ${errors.propertyType ? "validation-error" : ""}`}
                        role="group"
                    >
                        {propertyTypeData.map((category) => (
                            <React.Fragment key={category.category_id}>
                                <input
                                    type="radio"
                                    className="btn-check"
                                    name="propertyType"
                                    id={`property_${category.category_id}`}
                                    checked={formData.propertyType === category.category_id}
                                    onChange={handleChange}
                                    value={category.category_id}
                                />
                                <label
                                    className="btn btn-outline-light"
                                    htmlFor={`property_${category.category_id}`}
                                >
                                    {category.name}
                                </label>
                            </React.Fragment>
                        ))}
                    </div>
                    {errors.propertyType && <div className="error-text">{errors.propertyType}</div>}

                    <label className="form-label">Total No. Of Flats In Your Society</label>
                    <div
                        className={`cart-plus-minus mb-4 ${errors.totalFlats ? "validation-error" : ""}`}
                    >
                        <input
                            type="text"
                            className="form-control"
                            value={formData.totalFlats}
                            readOnly
                        />
                        <div className="minus qtybutton" onClick={handleDecrement}>
                            <i className="icon-line-awesome-minus"></i>
                        </div>
                        <div className="plus qtybutton" onClick={handleIncrement}>
                            <i className="icon-line-awesome-plus"></i>
                        </div>
                    </div>
                    {errors.totalFlats && <div className="error-text">{errors.totalFlats}</div>}

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
