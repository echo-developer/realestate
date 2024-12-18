"use client";
import React, { useEffect, useState } from "react";
import AuthUser from "../Authentication/AuthUser";
import RoomInput from "./RoomInput";

const Step4Form = ({ formData, setFormData, nextStep, prevStep }) => {
    const [errors, setErrors] = useState({});
    const { callApi } = AuthUser();
    const [AmenityData, setAmenityData] = useState([]);

    const handleRoomCountChange = (key, value) => {
        const roomCount = parseInt(value, 10) || 0;
        const roomsArray = Array.from({ length: roomCount }, (_, index) => ({
            key: `${key}${index + 1}`,
            height: "",
            width: "",
            height_unit: "sqft",
            width_unit: "sqft",
        }));

        setFormData({
            ...formData,
            [key]: JSON.stringify(roomsArray),
        });
    };

    const handleInputChange = (e, field) => {
        const { value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };

    const increment = (key) => {
        const newValue = (formData[key] || []).length + 1;
        setFormData({
            ...formData,
            [key]: Array.from({ length: newValue }, (_, index) => ({
                key: `${key}${index + 1}`,
                height: formData[key]?.[index]?.height || "",
                width: formData[key]?.[index]?.width || "",
                height_unit: formData[key]?.[index]?.height_unit || "sqft",
                width_unit: formData[key]?.[index]?.width_unit || "sqft",
            })),
        });
    };

    const decrement = (key) => {
        const newValue = (formData[key] || []).length - 1;
        if (newValue >= 0) {
            setFormData({
                ...formData,
                [key]: formData[key].slice(0, newValue),
            });
        }
    };

    const dropdownOptions = {
        areaUnits: ["Acre", "Hectare", "sq ft", "sq m", "sq yd"],
        propertyTypes: ["Residential", "Commercial"],
        propertyFor: [
            {
                label: "Residential",
                options: ["Flats", "House/Villa", "Penthouse", "Bungalow"],
            },
            {
                label: "Commercial",
                options: ["Office Space", "Shop/Showroom", "Hotels"],
            },
        ],
        budgets: [
            "$99 - $199",
            "$200 - $300",
            "$301 - $499",
            "$500 - $999",
            "Above $1000",
        ],
        parkingOptions: ["Available", "Not Available"],
        lengthUnits: ["m", "cm", "ft"],
    };

    const features = [
        { id: 1, name: "Air Conditioner" },
        { id: 2, name: "Window Coverings" },
    ];

    const handlePropertyStatusChange = (status) => {
        setFormData((prev) => ({
            ...prev,
            property_status: status,
        }));
    };

    const handleFloorChange = (key, selectedFloor) => {
        setFormData({
            ...formData,
            [key]: selectedFloor,
        });
    };

    const handlePlotChange = (value) => {
        setFormData((prev) => ({
            ...prev,
            corner_plot: value,
        }));
    };
    const handleAllowedConstructionChange=(value)=>{
        setFormData((prev) => ({
            ...prev,
            allowed_construction: value,
        }));
    }

    useEffect(() => {
        if (!formData.property_status) {
            setFormData((prev) => ({
                ...prev,
                property_status: "Furnished",
            }));
        }
    }, [formData, setFormData]);

    useEffect(() => {
        if (!formData.floor) {
            setFormData((prev) => ({
                ...prev,
                floor: "Lower Basement",
            }));
        }
    }, [formData, setFormData]);

    const handleFieldChange = (key, index, field, value) => {
        const updatedRooms = [...formData[key]];

        updatedRooms[index][field] = value;
        setFormData({
            ...formData,
            [key]: updatedRooms,
        });
    };

    const validateRoomDimensions = () => {
        const newErrors = {};

        ["bedrooms", "bathrooms", "kitchens"].forEach((key) => {
            if (formData[key]) {
                formData[key].forEach((room, index) => {
                    if (!room.height || isNaN(room.height)) {
                        if (!newErrors[key]) newErrors[key] = [];
                        newErrors[key][index] = {
                            ...newErrors[key][index],
                            height: "Height must be a valid number.",
                        };
                    }

                    if (!room.width || isNaN(room.width)) {
                        if (!newErrors[key]) newErrors[key] = [];
                        newErrors[key][index] = {
                            ...newErrors[key][index],
                            width: "Width must be a valid number.",
                        };
                    }
                });
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateRoomDimensions()) {
            nextStep();
        }
    };

    const fetchAmenityData = async () => {
        try {
            const response = await callApi({
                api: `/get_property_budget`,
                method: "GET",
            });
            if (response && response.status === 1) {
                setAmenityData(response.data);
            }
        } catch (error) {}
    };

    return (
        <div id="step-4">
            {/* Bedroom, Bathroom, and Kitchen Inputs */}
            <div className="row gx-3">
                {["bedroom", "bathroom", "kitchen"].map((key) => (
                    <div className="col-lg-3 col-12" key={key}>
                        <div className="form-field">
                            <label className="form-label">
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                            </label>
                            <div className="cart-plus-minus mb-4">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={(formData[key] || []).length}
                                    onChange={(e) =>
                                        handleRoomCountChange(
                                            key,
                                            e.target.value
                                        )
                                    }
                                />
                                <div
                                    className="minus qtybutton"
                                    onClick={() => decrement(key)}
                                >
                                    <i className="icon-line-awesome-minus"></i>
                                </div>
                                <div
                                    className="plus qtybutton"
                                    onClick={() => increment(key)}
                                >
                                    <i className="icon-line-awesome-plus"></i>
                                </div>
                            </div>

                            {/* Conditionally render room input fields */}
                            {(formData[key] || []).map((room, index) => (
                                <RoomInput
                                    key={`${key}-${index}`}
                                    keyName={key}
                                    room={room}
                                    index={index}
                                    errors={errors}
                                    handleFieldChange={handleFieldChange}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Carpet and Plot Area Inputs */}
            <div className="row gx-3">
                {[
                    { label: "Carpet Area", key: "carpet_area" },
                    { label: "Super Area", key: "super_area" },
                ].map(({ label, key }) => (
                    <div className="col-lg-6 col-12" key={key}>
                        <div className="form-field">
                            <label className="form-label">{label}</label>
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder={`Type ${label}`}
                                    value={formData[key]}
                                    onChange={(e) => handleInputChange(e, key)}
                                />
                                <span className="input-group-text">sqft</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Budget and Parking */}
            <div className="row gx-3">
                <div className="col-lg-6 col-12">
                    <label className="form-label">Budget</label>
                    <div className="form-field">
                        <select
                            className="form-control"
                            value={formData.budget || ""}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    budget: e.target.value,
                                }))
                            }
                        >
                            {dropdownOptions.budgets.map((budget) => (
                                <option key={budget}>{budget}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="col-lg-6 col-12">
                    <label className="form-label">Parking</label>
                    <div className="form-field">
                        <select
                            className="form-control"
                            value={formData.parking_availability || ""}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    parking_availability: e.target.value,
                                }))
                            }
                        >
                            {dropdownOptions.parkingOptions.map((option) => (
                                <option key={option}>{option}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Features */}
            <div className="form-group">
                <label className="form-label">Amenity Features : </label>
                {features.map((feature) => (
                    <div
                        key={feature.id}
                        className="form-check form-check-inline"
                    >
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id={`feature-${feature.id}`}
                            checked={
                                formData.property_amenity?.includes(
                                    feature.id
                                ) || false
                            }
                            onChange={(e) =>
                                setFormData((prev) => {
                                    const newFeatures = [
                                        ...(prev.property_amenity || []),
                                    ];
                                    if (e.target.checked) {
                                        newFeatures.push(feature.id);
                                    } else {
                                        const index = newFeatures.indexOf(
                                            feature.id
                                        );
                                        if (index > -1) {
                                            newFeatures.splice(index, 1);
                                        }
                                    }
                                    return {
                                        ...prev,
                                        property_amenity: newFeatures,
                                    };
                                })
                            }
                        />
                        <label
                            className="form-check-label"
                            htmlFor={`feature-${feature.id}`}
                        >
                            {feature.name}{" "}
                        </label>
                    </div>
                ))}
            </div>

            {/* Floor Selection */}
            <div className="form-group">
                <label className="form-label">Floors</label>
                <div
                    className="btn-group btn-group-light d-flex mb-3"
                    role="group"
                    aria-label="Floors"
                >
                    {[
                        { id: "floors_1", label: "Lower Basement" },
                        { id: "floors_2", label: "Upper Basement" },
                        { id: "floors_3", label: "Ground" },
                        ...Array.from({ length: 5 }, (_, i) => ({
                            id: `floors_${i + 4}`,
                            label: `${i + 1}`,
                        })),
                        {
                            id: "floors_6_plus",
                            label: <i className="bi bi-plus-lg"></i>,
                        },
                    ].map((floor) => (
                        <React.Fragment key={floor.id}>
                            <input
                                type="radio"
                                className="btn-check"
                                name="floors" // Unique name for floor selection
                                id={floor.id}
                                autoComplete="off"
                                checked={formData.floor === floor.label} // Update based on selected floor
                                onChange={() =>
                                    handleFloorChange("floor", floor.label)
                                } // Update floor state
                            />
                            <label
                                className="btn btn-outline-light"
                                htmlFor={floor.id}
                            >
                                {floor.label}
                            </label>
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Total Floor Selection */}
            <div className="form-group">
                <label className="form-label">Total Floors</label>
                <div
                    className="btn-group btn-group-light d-flex mb-3"
                    role="group"
                    aria-label="Total Floors"
                >
                    {[
                        { id: "total_floor_1", label: "Lower Basement" },
                        { id: "total_floor_2", label: "Upper Basement" },
                        { id: "total_floor_3", label: "Ground" },
                        ...Array.from({ length: 6 }, (_, i) => ({
                            id: `total_floor_${i + 4}`,
                            label: `${i + 1}`,
                        })),
                        {
                            id: "floors_6_plus",
                            label: <i className="bi bi-plus-lg"></i>,
                        },
                    ].map((floor) => (
                        <React.Fragment key={floor.id}>
                            <input
                                type="radio"
                                className="btn-check"
                                name="total_floors" // Unique name for total floor selection
                                id={floor.id}
                                autoComplete="off"
                                checked={formData.total_floor === floor.label} // Update based on selected total floor
                                onChange={() =>
                                    handleFloorChange(
                                        "total_floor",
                                        floor.label
                                    )
                                } // Update total floor state
                            />
                            <label
                                className="btn btn-outline-light"
                                htmlFor={floor.id}
                            >
                                {floor.label}
                            </label>
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* funrishing status */}
            <div
                className="btn-group btn-group-light d-flex mb-3"
                role="group"
                aria-label="Property Status"
            >
                <input
                    type="radio"
                    className="btn-check"
                    name="property_status"
                    id="property_status_1"
                    autoComplete="off"
                    checked={formData.property_status === "Furnished"}
                    onChange={() => handlePropertyStatusChange("Furnished")}
                />
                <label
                    className="btn btn-outline-light"
                    htmlFor="property_status_1"
                >
                    Furnished
                </label>

                <input
                    type="radio"
                    className="btn-check"
                    name="property_status"
                    id="property_status_2"
                    autoComplete="off"
                    checked={formData.property_status === "Semi-Furnished"}
                    onChange={() =>
                        handlePropertyStatusChange("Semi-Furnished")
                    }
                />
                <label
                    className="btn btn-outline-light"
                    htmlFor="property_status_2"
                >
                    Semi-Furnished
                </label>

                <input
                    type="radio"
                    className="btn-check"
                    name="property_status"
                    id="property_status_3"
                    autoComplete="off"
                    checked={formData.property_status === "Unfurnished"}
                    onChange={() => handlePropertyStatusChange("Unfurnished")}
                />
                <label
                    className="btn btn-outline-light"
                    htmlFor="property_status_3"
                >
                    Unfurnished
                </label>
            </div>

            {/* Plot positions */}
            <div className="mb-3">
                <label className="form-label">Is This A Corner Plot:</label>
                <div className="form-check form-check-inline">
                    <input
                        className="form-check-input"
                        type="radio"
                        name="corner_plot"
                        id="corner_plot_1"
                        value="Yes"
                        checked={formData.corner_plot === "Yes"}
                        onChange={() => handlePlotChange("Yes")}
                    />
                    <label className="form-check-label" htmlFor="corner_plot_1">
                        Yes
                    </label>
                </div>
                <div className="form-check form-check-inline">
                    <input
                        className="form-check-input"
                        type="radio"
                        name="corner_plot"
                        id="corner_plot_2"
                        value="No"
                        checked={formData.corner_plot === "No"}
                        onChange={() => handlePlotChange("No")}
                    />
                    <label className="form-check-label" htmlFor="corner_plot_2">
                        No
                    </label>
                </div>
            </div>
             {/* Is Allowed for Floor Construction */}
             <div className="mb-3">
                <label className="form-label">Is Allowed for Floor Construction:</label>
                <div className="form-check form-check-inline">
                    <input
                        className="form-check-input"
                        type="radio"
                        name="allowed_construction"
                        id="allowed_construction_1"
                        value="Yes"
                        checked={formData.allowed_construction === "Yes"}
                        onChange={() => handleAllowedConstructionChange("Yes")}
                    />
                    <label className="form-check-label" htmlFor="allowed_construction_1">
                        Yes
                    </label>
                </div>
                <div className="form-check form-check-inline">
                    <input
                        className="form-check-input"
                        type="radio"
                        name="allowed_construction"
                        id="allowed_construction_2"
                        value="No"
                        checked={formData.allowed_construction === "No"}
                        onChange={() => handleAllowedConstructionChange("No")}
                    />
                    <label className="form-check-label" htmlFor="allowed_construction_2">
                        No
                    </label>
                </div>
            </div>

            {/* Navigation Buttons */}
            <div className="d-grid columns-2">
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={prevStep}
                >
                    <i className="bi bi-arrow-left"></i> Back
                </button>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleNext}
                >
                    Next <i className="bi bi-arrow-right"></i>
                </button>
            </div>
        </div>
    );
};

export default Step4Form;
