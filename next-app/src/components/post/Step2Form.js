"use client";
import React, { useEffect, useState } from "react";
import AuthUser from "../Authentication/AuthUser";
import MyLoader from "../LoadingSpinner/MyLoader";

const Step2Form = ({ formData, setFormData, nextStep, prevStep }) => {
    const { callApi } = AuthUser();
    const [propertyTypeData, setPropertyTypeData] = useState([]);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    // Fetch property type data on mount
    useEffect(() => {
        fetchPropertyTypeData();
    }, []);

    // Ensure default value for total_flats
    useEffect(() => {
        if (!formData.total_flats || isNaN(formData.total_flats) || formData.total_flats < 1) {
            setFormData((prev) => ({ ...prev, total_flats: 1 }));
        }
    }, [formData.total_flats]);

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
                    setFormData({ ...formData, property_type: response.data[0].category_id });
                }
            }
        } catch (error) {
            console.error("Failed to fetch property types", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleIncrement = () => {
        const totalFlats = isNaN(formData.total_flats) ? 1 : formData.total_flats;
        setFormData({ ...formData, total_flats: totalFlats + 1 });
    };

    const handleDecrement = () => {
        const totalFlats = isNaN(formData.total_flats) ? 1 : formData.total_flats;
        if (totalFlats > 1) {
            setFormData({ ...formData, total_flats: totalFlats - 1 });
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: name === "property_type" ? parseInt(value) : value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: "" });
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

        if (!formData.total_flats || formData.total_flats < 1) {
            newErrors.total_flats = "Total flats must be at least 1.";
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
                        className={`btn-group btn-group-light d-flex mb-3 ${errors.post_for ? "validation-error" : ""}`}
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
                            name="post_for"
                            id="btnradio2"
                            checked={formData.post_for === "sale"}
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
                            name="post_for"
                            id="btnradio3"
                            checked={formData.post_for === "pg"}
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
                    {errors.post_for && <div className="error-text">{errors.post_for}</div>}

                    <label className="form-label">Property Type</label>
                    <div
                        className={`btn-group btn-group-light d-flex mb-3 ${errors.property_type ? "validation-error" : ""}`}
                        role="group"
                    >
                        {propertyTypeData.map((category) => (
                            <React.Fragment key={category.category_id}>
                                <input
                                    type="radio"
                                    className="btn-check"
                                    name="property_type"
                                    id={`property_${category.category_id}`}
                                    checked={formData.property_type === category.category_id}
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
                    {errors.property_type && <div className="error-text">{errors.property_type}</div>}

                    <label className="form-label">Total No. Of Flats In Your Society</label>
                    <div
                        className={`cart-plus-minus mb-4 ${errors.total_flats ? "validation-error" : ""}`}
                    >
                        <input
                            type="text"
                            className="form-control"
                            value={isNaN(formData.total_flats) || formData.total_flats < 1 ? 1 : formData.total_flats}
                            readOnly
                        />
                        <div className="minus qtybutton" onClick={handleDecrement}>
                            <i className="icon-line-awesome-minus"></i>
                        </div>
                        <div className="plus qtybutton" onClick={handleIncrement}>
                            <i className="icon-line-awesome-plus"></i>
                        </div>
                    </div>
                    {errors.total_flats && <div className="error-text">{errors.total_flats}</div>}

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
