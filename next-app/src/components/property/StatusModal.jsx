import React, { useState, useEffect } from "react";
import AuthUser from "../Authentication/AuthUser";
import { toast } from "react-toastify";
import { months } from "../../components/post/PropertyData"

const StatusModal = ({ value, propertyData, onChange, list: possessionData }) => {
    const { callApi } = AuthUser();
    const [errors, setErrors] = useState()


    const [formData, setFormData] = useState({
        possession_status: propertyData?.possession_status || "Available",
        possesion_month: propertyData?.possesion_month || "",
        possesion_year: propertyData?.possesion_year || "",
        construct_year: propertyData?.construct_year || "",
    });


    console.log("status modal form data", formData);

    useEffect(() => {
        if (value) {
            setFormData((prevState) => ({
                ...prevState,
                ...value,
            }));
        }
    }, [value]);

    const handleChange = () => {
        const { name, value } = event.target;

        if (formData?.possession_status === 2) {
            setFormData({
                ...formData,
                [name]: value,
                construct_year: ""
            });
            onChange?.({
                ...formData,
                [name]: value,
                construct_year: ""
            });
        } else if(formData?.possession_status === 1) {
            setFormData({
                ...formData,
                [name]: value,
                possesion_month: "",
                possesion_year: ""
            });
            onChange?.({
                ...formData,
                [name]: value,
                possesion_month: "",
                possesion_year: ""
            });
        } else if(formData?.possession_status === 3) {
            setFormData({
                ...formData,
                possesion_month: "",
                possesion_year: "",
                construct_year: ""
            });
            onChange?.({
                ...formData,
                possesion_month: "",
                possesion_year: "",
                construct_year: ""
            });
        }
    };

    const handlePossessionStatusChange = (name, value) => {
        if(value === 3) {
            setFormData({
                ...formData,
                [name]: value,
                construct_year: "",
                possesion_month: "",
            });
            onChange?.({
                ...formData,
                [name]: value,
                construct_year: "",
                possesion_year: "",
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
            onChange?.({
                ...formData,
                [name]: value,
            });
        }
    };

    const updateData = async () => {
        try {
            // Create a new object excluding the "0" property
            const sanitizedData = { ...formData };
            delete sanitizedData["0"];
    
            const res = await callApi({
                api: `/update_property`,
                method: "POST",
                data: JSON.stringify(sanitizedData),
            });
    
            if (res && res.status === 1) {
                toast.success("Data updated successfully!");
            } else {
                toast.error("Failed to update data");
            }
        } catch (error) {
            toast.error("Error while updating data");
        }
    };
    

    const handleSubmit = (event) => {
        event.preventDefault();
        // updateData();
        console.log("submit form data", formData)
    };


    return (
        <form onSubmit={handleSubmit}>
            {/* Possession Status */}
            <div className="mb-3">
                <label className="form-label">Possession Status:</label>
                {possessionData.map((option) => {
                    return (
                        <div
                        className="form-check form-check-inline"
                        key={option.status_id}
                    >
                        <input
                            className={`form-check-input ${errors?.possession_status ? "is-invalid" : ""
                                }`}
                            type="radio"
                            name="possession_status"
                            id={`status-${option.status_id}`}
                            value={option.status_name}
                            checked={
                                formData.possession_status == option.status_id
                            }
                            onChange={(e) => handlePossessionStatusChange(e?.target?.name, option?.status_id)}
                        />
                        <label
                            className="form-check-label"
                            htmlFor={`status-${option.status_id}`}
                        >
                            {option.status_name}
                        </label>
                    </div>
                    )
                })}
                {errors?.possession_status && (
                    <div className="invalid-feedback">
                        {errors?.possession_status}
                    </div>
                )}
            </div>

            {/* Conditional Month and Year Input for Under Construction */}
            {formData.possession_status == 2 && (
                <div className="row gx-3">
                    <div className="col-lg-6 col-12">
                        <label className="form-label">
                            Expected Month of Possession
                        </label>
                        <select
                            className={`form-control ${errors?.possesion_month ? "is-invalid" : ""
                                }`}
                            name="possesion_month"
                            value={formData.possesion_month || ""}
                            onChange={handleChange}
                        >
                            <option value="">Select Month</option>
                            {months.map((month) => {
                                return (
                                    <option key={month?.id} value={month?.id}>
                                        {month?.name}
                                    </option>
                                )
                            })}
                        </select>
                    </div>
                    <div className="col-lg-6 col-12">
                        <label className="form-label">
                            Expected Year of Possession
                        </label>
                        <select
                            className={`form-control ${errors?.possesion_year ? "is-invalid" : ""
                                }`}
                            name="possesion_year"
                            value={formData.possesion_year || ""}
                            onChange={handleChange}
                        >
                            <option value="">Select Year</option>
                            {Array.from({ length: 21 }, (_, i) => {
                                const year = new Date().getFullYear() + i;
                                return (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                </div>
            )}

            {/* Age of Construction for Other Possession Status */}
            {formData.possession_status == 1 && (
                <div className="mb-3">
                    <label className="form-label">Age of Construction</label>
                    <select
                        className={`form-control ${errors?.construct_year ? "is-invalid" : ""
                            }`}
                        name="construct_year"
                        value={formData.construct_year || ""}
                        onChange={handleChange}
                    >
                        <option value="">Select Age</option>
                        {[
                            { name: "New Construction", key: "new" },
                            { name: "Less than 5 years", key: "less_than_5_years" },
                            { name: "5 to 10 years", key: "5_10_years" },
                            { name: "10 to 15 years", key: "10_15_years" },
                            { name: "15 to 20 years", key: "15_20_years" },
                            { name: "Above 20 years", key: "above_20_years" },
                        ].map((age) => (
                            <option key={age?.key} value={age?.key}>
                                {age?.name}
                            </option>
                        ))}
                    </select>
                    {errors?.construct_year && (
                        <div className="invalid-feedback">
                            {errors?.construct_year}
                        </div>
                    )}
                </div>
            )}
        </form>
    );
};

export default StatusModal;
