"use client";
import React, { useEffect, useState } from "react";
import AuthUser from "../Authentication/AuthUser";
import { toast } from "react-toastify";

const Step4Form = ({ formData, setFormData, nextStep, prevStep }) => {
    const [errors, setErrors] = useState({});
    const { callApi } = AuthUser();
    const [PropertyTypeData, setPropertyTypeData] = useState([]);
    const [PropertyForData, setPropertyForData] = useState([]);
    const [AmenityData, setAmenityData] = useState([]);

    const handleRoomCountChange = (key, value) => {
        const roomCount = parseInt(value, 10) || 0;
        const roomsArray = Array.from({ length: roomCount }, () => ({
            height: "",
            width: "",
            heightUnit: "m",
            widthUnit: "m",
        }));

        useEffect(() => {
            FetchPropertyTypeData();
            fetchAmenityData();
        }, []);

        useEffect(() => {
            if (formData.propertyType) {
                FetchPropertyForData(formData.propertyType);
            }
        }, [formData.propertyType]);

        const FetchPropertyTypeData = async () => {
            try {
                const res = await callApi({
                    api: `/get_property_type`,
                    method: "GET",
                });
                if (res && res.status === 1) {
                    setPropertyTypeData(res.data);
                } else {
                    toast.error("Data not found");
                }
            } catch (error) {
                toast.error("Data not found by API");
            }
        };

        const FetchPropertyForData = async (cityId) => {
            try {
                const response = await callApi({
                    api: `/get_property_for`,
                    method: "GET",
                    data: {
                        id: cityId,
                    },
                });

                if (response && response.status === 1) {
                    const propertyForData = response.data[""];
                    setPropertyForData(
                        Array.isArray(propertyForData) ? propertyForData : []
                    );
                }
            } catch (error) {
                console.error("Error fetching property data:", error);
            }
        };

        setFormData({
            ...formData,
            [key]: JSON.stringify(roomsArray),
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: validateField(name, value) ? "" : prevErrors[name],
        }));
    };

    const increment = (key) => {
        const newValue = (formData[key] || []).length + 1;
        setFormData({
            ...formData,
            [key]: Array.from({ length: newValue }, (_, index) => ({
                height: formData[key]?.[index]?.height || "",
                width: formData[key]?.[index]?.width || "",
                heightUnit: formData[key]?.[index]?.heightUnit || "m",
                widthUnit: formData[key]?.[index]?.widthUnit || "m",
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

    const handleFloorChange = (floor) => {
        setFormData((prev) => ({
            ...prev,
            floor,
        }));
    };

    const handlePlotChange = (value) => {
        setFormData((prev) => ({
            ...prev,
            corner_plot: value,
        }));
    };

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

    const handleUnitChange = (key, index, unitType, value) => {
        const updatedRooms = [...formData[key]];
        updatedRooms[index][unitType] = value;
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

    console.log(AmenityData);

    return (
        <div id="step-4">
            {/* Bedroom, Bathroom, and Kitchen Inputs */}
            <div className="row gx-3">
                {["bedrooms", "bathrooms", "kitchens"].map((key) => (
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

                            {/* Conditionally render height and width inputs based on the room count */}
                            {console.log(typeof formData[key])}
                            {(formData[key] || []).map((room, index) => (
                                <div
                                    key={`${key}-${index}`}
                                    className="form-group"
                                >
                                    <label className="form-label">Height</label>
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter Height"
                                            value={room.height}
                                            onChange={(e) =>
                                                handleFieldChange(
                                                    key,
                                                    index,
                                                    "height",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        {errors[key] &&
                                            errors[key][index]?.height && (
                                                <div className="error-text">
                                                    {errors[key][index]?.height}
                                                </div>
                                            )}
                                        <select
                                            className="form-control"
                                            value={room.heightUnit}
                                            onChange={(e) =>
                                                handleUnitChange(
                                                    key,
                                                    index,
                                                    "heightUnit",
                                                    e.target.value
                                                )
                                            }
                                        >
                                            {dropdownOptions.lengthUnits.map(
                                                (unit) => (
                                                    <option
                                                        key={unit}
                                                        value={unit}
                                                    >
                                                        {unit}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </div>
                                    <label className="form-label">Width</label>
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter Width"
                                            value={room.width}
                                            onChange={(e) =>
                                                handleFieldChange(
                                                    key,
                                                    index,
                                                    "width",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        {errors[key] &&
                                            errors[key][index]?.width && (
                                                <div className="error-text">
                                                    {errors[key][index]?.width}
                                                </div>
                                            )}
                                        <select
                                            className="form-control"
                                            value={room.widthUnit}
                                            onChange={(e) =>
                                                handleUnitChange(
                                                    key,
                                                    index,
                                                    "widthUnit",
                                                    e.target.value
                                                )
                                            }
                                        >
                                            {dropdownOptions.lengthUnits.map(
                                                (unit) => (
                                                    <option
                                                        key={unit}
                                                        value={unit}
                                                    >
                                                        {unit}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Carpet and Plot Area Inputs */}
            <div className="row gx-3">
                {["Carpet Area", "Plot Area"].map((label) => (
                    <div className="col-lg-6 col-12" key={label}>
                        <div className="form-field">
                            <label className="form-label">{label}</label>
                            <div className="input-group">
                                <select className="form-control">
                                    {dropdownOptions.areaUnits.map((unit) => (
                                        <option key={unit}>{unit}</option>
                                    ))}
                                </select>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder={`Type ${label}`}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Property Type and Property For */}
            <div className="row gx-3">
                <div className="col-lg-6 col-12">
                    <div className="form-field">
                        <label htmlFor="PropertyType">Property Type</label>
                        <select
                            id="PropertyType"
                            name="PropertyType"
                            value={formData.PropertyType || ""}
                            onChange={handleChange}
                            className={`form-control ${
                                errors.PropertyType ? "is-invalid" : ""
                            }`}
                        >
                            <option value="" disabled>
                                {errors.PropertyType || "Choose PropertyType"}
                            </option>
                            {PropertyTypeData.map((city) => (
                                <option key={city.city_id} value={city.city_id}>
                                    {city.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="col-lg-6 col-12">
                    <div className="form-field">
                        <label htmlFor="propertyFor">Property For</label>
                        <select
                            id="propertyFor"
                            name="propertyFor"
                            value={formData.propertyFor || ""}
                            onChange={handleChange}
                            className={`form-control ${
                                errors.propertyFor ? "is-invalid" : ""
                            }`}
                        >
                            {formData.PropertyType ? (
                                <>
                                    <option value="" disabled>
                                        {errors.propertyFor ||
                                            "Choose Property For"}
                                    </option>
                                    {PropertyForData.length > 0 ? (
                                        PropertyForData.map((locality) => (
                                            <option
                                                key={locality.sub_category_id}
                                                value={locality.sub_category_id}
                                            >
                                                {locality.sub_category_name}
                                            </option>
                                        ))
                                    ) : (
                                        <option value="" disabled>
                                            No Property For Data Available
                                        </option>
                                    )}
                                </>
                            ) : (
                                <option value="" disabled>
                                    Select Property Type first
                                </option>
                            )}
                        </select>
                    </div>
                </div>
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
                                name="floors"
                                id={floor.id}
                                autoComplete="off"
                                checked={formData.floor === floor.label}
                                onChange={() => handleFloorChange(floor.label)}
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
