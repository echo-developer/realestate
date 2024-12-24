import React, { useState, useEffect } from "react";
import AuthUser from "../Authentication/AuthUser";
import { toast } from "react-toastify";

const StatusModal = ({ value, onChange, errors }) => {
    const { callApi } = AuthUser();

    const possessionData = [
        { status_id: 1, status_name: "Ready to Move" },
        { status_id: 2, status_name: "Under Construction" },
    ];

    const [formData, setFormData] = useState({
        possession_status: "Ready to Move",
        construction_month: "",
        construction_year: "",
        age_of_construction: "",
    });

    useEffect(() => {
        if (value) {
            setFormData((prevState) => ({
                ...prevState,
                ...value,
            }));
        }
    }, [value]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const updateData = async () => {
        try {
            const res = await callApi({
                api: `/update_property`,
                method: "POST",
                data: JSON.stringify(formData),
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

    const possessionStatus = formData?.possession_status || "Ready to Move";
    const constructionMonth = formData?.construction_month || "";
    const constructionYear = formData?.construction_year || "";
    const ageOfConstruction = formData?.age_of_construction || "";

    const handleSubmit = (event) => {
        event.preventDefault();
        updateData();
    };

    return (
        <React.Fragment>
            <form onSubmit={handleSubmit}>
                {/* Possession Status */}
                <div className="mb-3">
                    <label className="form-label">Possession Status:</label>
                    {possessionData.map((option) => (
                        <div
                            className="form-check form-check-inline"
                            key={option.status_id}
                        >
                            <input
                                className={`form-check-input ${
                                    errors?.possession_status
                                        ? "is-invalid"
                                        : ""
                                }`}
                                type="radio"
                                name="possession_status"
                                id={`status-${option.status_id}`}
                                value={option.status_name}
                                checked={
                                    possessionStatus === option.status_name
                                }
                                onChange={handleChange}
                            />
                            <label
                                className="form-check-label"
                                htmlFor={`status-${option.status_id}`}
                            >
                                {option.status_name}
                            </label>
                        </div>
                    ))}
                    {errors?.possession_status && (
                        <div className="invalid-feedback">
                            {errors?.possession_status}
                        </div>
                    )}
                </div>

                {/* Conditional Month and Year Input for Under Construction */}
                {possessionStatus === "Under Construction" && (
                    <div className="row gx-3">
                        <div className="col-lg-6 col-12">
                            <label className="form-label">
                                Expected Month of Possession
                            </label>
                            <select
                                className={`form-control ${
                                    errors?.construction_date
                                        ? "is-invalid"
                                        : ""
                                }`}
                                name="construction_month"
                                value={constructionMonth}
                                onChange={handleChange}
                            >
                                <option value="">Select Month</option>
                                {[
                                    "January",
                                    "February",
                                    "March",
                                    "April",
                                    "May",
                                    "June",
                                    "July",
                                    "August",
                                    "September",
                                    "October",
                                    "November",
                                    "December",
                                ].map((month) => (
                                    <option key={month} value={month}>
                                        {month}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-lg-6 col-12">
                            <label className="form-label">
                                Expected Year of Possession
                            </label>
                            <select
                                className={`form-control ${
                                    errors?.construction_date
                                        ? "is-invalid"
                                        : ""
                                }`}
                                name="construction_year"
                                value={constructionYear}
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

                {/* Single Dropdown for other Possession Status */}
                {possessionStatus !== "Under Construction" && (
                    <div className="mb-3">
                        <label className="form-label">
                            Age of Construction
                        </label>
                        <select
                            className={`form-control ${
                                errors?.age_of_construction ? "is-invalid" : ""
                            }`}
                            name="age_of_construction"
                            value={ageOfConstruction}
                            onChange={handleChange}
                        >
                            <option value="">Select Age</option>
                            {[
                                "New Construction",
                                "Less than 5 years",
                                "5 to 10 years",
                                "10 to 15 years",
                                "15 to 20 years",
                                "Above 20 years",
                            ].map((age) => (
                                <option key={age} value={age}>
                                    {age}
                                </option>
                            ))}
                        </select>
                        {errors?.age_of_construction && (
                            <div className="invalid-feedback">
                                {errors?.age_of_construction}
                            </div>
                        )}
                    </div>
                )}
                
            </form>
        </React.Fragment>
    );
};

export default StatusModal;
