"use client";
import React, { useEffect, useState } from "react";
import AuthUser from "../Authentication/AuthUser";
import RoomInput from "./RoomInput";
import { toast } from "react-toastify";

const Step4Form = ({ formData, setFormData, nextStep, prevStep }) => {
    const [errors, setErrors] = useState({});
    const { callApi } = AuthUser();
    const [BudgetData, setBudgetData] = useState([]);
    const [AmenityData, setAmenityData] = useState([]);
    const [FurnishData, setFurnishData] = useState([]);

    let propertyFor = localStorage.getItem("propertyFor");
    let propertyType = localStorage.getItem("property_type");

    console.log(formData)

    useEffect(() => {
        FetchBudgetData();
        fetchAmenityData();
        fetchFurnishData();
    }, [propertyFor ,propertyType]);

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

    const FetchBudgetData = async () => {
        let response;
        try {
            response = await callApi({
                api: `/get_property_budget`,
                method: "GET",
            });
            if (response && response.status === 1) {
                setBudgetData(response.data);
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error(response.message);
        }
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

    const handlePropertyStatusChange = (status) => {
        setFormData((prev) => ({
            ...prev,
            property_furnish: status,
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

    const handleAllowedConstructionChange = (value) => {
        setFormData((prev) => ({
            ...prev,
            allowed_construction: value,
        }));
    };

    const handleConstructionDoneChange = (value) => {
        setFormData((prev) => ({
            ...prev,
            construction_done: value,
        }));
    };

    const handleBoundaryWallChange = (value) => {
        setFormData((prev) => ({
            ...prev,
            boundary_wall: value,
        }));
    };

    const handleGatedColonyChange = (value) => {
        setFormData((prev) => ({
            ...prev,
            is_gated_colony: value,
        }));
    };
    const handleWashroomChange = (value) => {
        setFormData((prev) => ({
            ...prev,
            personal_washroom: value,
        }));
    };
    const handleCafeteriaChange = (value) => {
        setFormData((prev) => ({
            ...prev,
            cafeteria: value,
        }));
    };
    const handleCornerShopChange = (value) => {
        setFormData((prev) => ({
            ...prev,
            corner_shop: value,
        }));
    };
    const handleMainRoadChange = (value) => {
        setFormData((prev) => ({
            ...prev,
            main_road_facing: value,
        }));
    };

    useEffect(() => {
        if (!formData.property_furnish) {
            setFormData((prev) => ({
                ...prev,
                property_furnish: "Furnished",
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
                    if (!room.height || isNaN(Number(room.height))) {
                        if (!newErrors[key]) newErrors[key] = [];
                        if (!newErrors[key][index]) newErrors[key][index] = {};
                        newErrors[key][index].height = `Height for ${room.key} must be a valid number.`;
                    }
    
                    if (!room.width || isNaN(Number(room.width))) {
                        if (!newErrors[key]) newErrors[key] = [];
                        if (!newErrors[key][index]) newErrors[key][index] = {};
                        newErrors[key][index].width = `Width for ${room.key} must be a valid number.`;
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
                api: `/get_property_amnity`,
                method: "GET",
            });
            if (response && response.status === 1) {
                setAmenityData(response.data);
            }
        } catch (error) {}
    };

    const fetchFurnishData = async () => {
        try {
            const response = await callApi({
                api: `/get_property_furnish`,
                method: "GET",
            });
            if (response && response.status === 1) {
                setFurnishData(response.data);
            }
        } catch (error) {}
    };

    const roomTypes = (() => {
        switch (propertyFor) {
            case "apartments--flats":
            case "builder-floor-apartment":
            case "residential-house":
            case "villas":
            case "penthouse":
                return ["bedroom", "balcony", "bathroom"];
            case "studio-apartment":
                return ["balcony", "bathroom"];
            case "commercial-office-space":
                return ["washroom"];

            default:
                return null;
        }
    })();

    return (
        <div id="step-4">
            <React.Fragment>
                {/* Bedroom, Bathroom, and Kitchen Inputs */}
                <div className="row gx-3">
                    {roomTypes?.map((key, i) => (
                        <div
                            className="col-lg-3 col-12"
                            key={`item_${i}_${key}`}
                        >
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
                    ].map(({ label, key }, i) => (
                        <div
                            className="col-lg-6 col-12"
                            key={`item_3_${i}_${key}`}
                        >
                            <div className="form-field">
                                <label className="form-label">{label}</label>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder={`Type ${label}`}
                                        value={formData[key]}
                                        onChange={(e) =>
                                            handleInputChange(e, key)
                                        }
                                    />
                                    <span className="input-group-text">
                                        sqft
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Floor Selection */}
                {(propertyFor === "villas" ||
                    (propertyFor !== "residential-house" &&
                        propertyFor !== "commercial-land" &&
                        propertyFor !== "residential-land-plot")) && (
                    <div className="form-group">
                        <label className="form-label">Floor No.</label>
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
                            ].map((floor, i) => (
                                <React.Fragment key={`item_4_${i}_${floor.id}`}>
                                    <input
                                        type="radio"
                                        className="btn-check"
                                        name="floors"
                                        id={floor.id}
                                        autoComplete="off"
                                        checked={formData.floor === floor.label}
                                        onChange={() =>
                                            handleFloorChange(
                                                "floor",
                                                floor.label
                                            )
                                        } // Fixed here
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
                )}

                {/* Total Floor Selection */}
                {propertyFor !== "residential-land-plot" && (
                    <div className="form-group">
                        <label className="form-label">Total Floors</label>
                        <div
                            className="btn-group btn-group-light d-flex mb-3"
                            role="group"
                            aria-label="Total Floors"
                        >
                            {[
                                ...Array.from({ length: 12 }, (_, i) => ({
                                    id: `total_floor_${i + 1}`,
                                    label: `${i + 1}`,
                                })),
                                {
                                    id: "floors_6_plus",
                                    label: <i className="bi bi-plus-lg"></i>,
                                },
                            ].map((floor, i) => (
                                <React.Fragment key={`item_5_${i}_${floor.id}`}>
                                    <input
                                        type="radio"
                                        className="btn-check"
                                        name="total_floors"
                                        id={floor.id}
                                        autoComplete="off"
                                        checked={
                                            formData.total_floor === floor.label
                                        }
                                        onChange={() =>
                                            handleFloorChange(
                                                "total_floor",
                                                floor.label
                                            )
                                        }
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
                )}

                {propertyType == 1 &&
                    propertyFor !== "residential-land-plot" && (
                        <React.Fragment>
                            {/* Budget and Parking */}
                            <div className="row gx-3">
                                <div className="col-lg-6 col-12">
                                    <label className="form-label">Budget</label>
                                    <div className="form-field">
                                        <select
                                            className="form-control"
                                            value={
                                                formData.project_budget || ""
                                            }
                                            onChange={(e) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    project_budget:
                                                        e.target.value,
                                                }))
                                            }
                                        >
                                            <option value="">
                                                Select Budget
                                            </option>{" "}
                                            {/* Optional default option */}
                                            {BudgetData.map((budget, i) => (
                                                <option
                                                    key={`dataidf_${i}_${budget.budget_id}`}
                                                    value={budget.budget_id}
                                                >
                                                    {budget.min_budget} -{" "}
                                                    {budget.max_budget}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-12">
                                    <label className="form-label">
                                        Parking
                                    </label>
                                    <div className="form-field">
                                        <select
                                            className="form-control"
                                            value={
                                                formData.parking_availability ||
                                                ""
                                            }
                                            onChange={(e) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    parking_availability:
                                                        e.target.value,
                                                }))
                                            }
                                        >
                                            <option value="">
                                                Select Parking Option
                                            </option>{" "}
                                            {/* Optional default option */}
                                            {dropdownOptions.parkingOptions.map(
                                                (option, i) => (
                                                    <option
                                                        key={`parkingid${i}_${option}`}
                                                        value={option}
                                                    >
                                                        {option}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Features */}
                            <div className="form-group">
                                <label className="form-label">
                                    Amenity Features :{" "}
                                </label>
                                {AmenityData.map((feature, i) => (
                                    <div
                                        key={`item_6_${i}_${feature.id}`}
                                        className="form-check form-check-inline"
                                    >
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id={`feature-${feature.amenity_id}`}
                                            checked={
                                                formData.property_amenity?.includes(
                                                    feature.amenity_id
                                                ) || false
                                            }
                                            onChange={(e) =>
                                                setFormData((prev) => {
                                                    const newFeatures = [
                                                        ...(prev.property_amenity ||
                                                            []),
                                                    ];
                                                    if (e.target.checked) {
                                                        newFeatures.push(
                                                            feature.amenity_id
                                                        );
                                                    } else {
                                                        const index =
                                                            newFeatures.indexOf(
                                                                feature.amenity_id
                                                            );
                                                        if (index > -1) {
                                                            newFeatures.splice(
                                                                index,
                                                                1
                                                            );
                                                        }
                                                    }
                                                    return {
                                                        ...prev,
                                                        property_amenity:
                                                            newFeatures,
                                                    };
                                                })
                                            }
                                        />
                                        <label
                                            className="form-check-label"
                                            htmlFor={`feature-${feature.amenity_id}`}
                                        >
                                            {feature.amenity_name}{" "}
                                        </label>
                                    </div>
                                ))}
                            </div>
                            {/* Plot positions */}
                            <div className="mb-3">
                                <label className="form-label">
                                    Is This A Corner Plot:
                                </label>
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
                                    <label
                                        className="form-check-label"
                                        htmlFor="corner_plot_1"
                                    >
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
                                    <label
                                        className="form-check-label"
                                        htmlFor="corner_plot_2"
                                    >
                                        No
                                    </label>
                                </div>
                            </div>

                            {/* Is Allowed for Floor Construction */}
                            <div className="mb-3">
                                <label className="form-label">
                                    Is Allowed for Floor Construction:
                                </label>
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="allowed_construction"
                                        id="allowed_construction_1"
                                        value="Yes"
                                        checked={
                                            formData.allowed_construction ===
                                            "Yes"
                                        }
                                        onChange={() =>
                                            handleAllowedConstructionChange(
                                                "Yes"
                                            )
                                        }
                                    />
                                    <label
                                        className="form-check-label"
                                        htmlFor="allowed_construction_1"
                                    >
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
                                        checked={
                                            formData.allowed_construction ===
                                            "No"
                                        }
                                        onChange={() =>
                                            handleAllowedConstructionChange(
                                                "No"
                                            )
                                        }
                                    />
                                    <label
                                        className="form-check-label"
                                        htmlFor="allowed_construction_2"
                                    >
                                        No
                                    </label>
                                </div>
                            </div>
                        </React.Fragment>
                    )}
                {propertyType == 2 && propertyFor !== "commercial-land" && (
                    <React.Fragment>
                        {/* Corner Shop */}
                        {(propertyFor === "commercial-shop" ||
                            propertyFor === "commercial-showroom") && (
                            <div className="mb-3">
                                <label className="form-label">
                                    Corner Shop:
                                </label>
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="corner_shop"
                                        id="corner_shop_1"
                                        value="Yes"
                                        checked={formData.corner_shop === "Yes"}
                                        onChange={() =>
                                            handleCornerShopChange("Yes")
                                        }
                                    />
                                    <label
                                        className="form-check-label"
                                        htmlFor="corner_shop_1"
                                    >
                                        Yes
                                    </label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="corner_shop"
                                        id="corner_shop_2"
                                        value="No"
                                        checked={formData.corner_shop === "No"}
                                        onChange={() =>
                                            handleCornerShopChange("No")
                                        }
                                    />
                                    <label
                                        className="form-check-label"
                                        htmlFor="corner_shop_2"
                                    >
                                        No
                                    </label>
                                </div>
                            </div>
                        )}

                        {/* Main Road Facing */}
                        {(propertyFor === "commercial-shop" ||
                            propertyFor === "commercial-showroom") && (
                            <div className="mb-3">
                                <label className="form-label">
                                    Is Main Road Facing:
                                </label>
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="main_road_facing"
                                        id="main_road_facing_1"
                                        value="Yes"
                                        checked={
                                            formData.main_road_facing === "Yes"
                                        }
                                        onChange={() =>
                                            handleMainRoadChange("Yes")
                                        }
                                    />
                                    <label
                                        className="form-check-label"
                                        htmlFor="main_road_facing_1"
                                    >
                                        Yes
                                    </label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="main_road_facing"
                                        id="main_road_facing_2"
                                        value="No"
                                        checked={
                                            formData.main_road_facing === "No"
                                        }
                                        onChange={() =>
                                            handleMainRoadChange("No")
                                        }
                                    />
                                    <label
                                        className="form-check-label"
                                        htmlFor="main_road_facing_2"
                                    >
                                        No
                                    </label>
                                </div>
                            </div>
                        )}

                        {/* Personal Washroom */}
                        <div className="mb-3">
                            <label className="form-label">
                                Personal Washroom:
                            </label>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="personal_washroom"
                                    id="personal_washroom_1"
                                    value="Yes"
                                    checked={
                                        formData.personal_washroom === "Yes"
                                    }
                                    onChange={() => handleWashroomChange("Yes")}
                                />
                                <label
                                    className="form-check-label"
                                    htmlFor="personal_washroom_1"
                                >
                                    Yes
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="personal_washroom"
                                    id="personal_washroom_2"
                                    value="No"
                                    checked={
                                        formData.personal_washroom === "No"
                                    }
                                    onChange={() => handleWashroomChange("No")}
                                />
                                <label
                                    className="form-check-label"
                                    htmlFor="personal_washroom_2"
                                >
                                    No
                                </label>
                            </div>
                        </div>

                        {/* Cafeteria */}
                        <div className="mb-3">
                            <label className="form-label">
                                Pantry/Cafeteria:
                            </label>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="cafeteria"
                                    id="cafeteria_1"
                                    value="Dry"
                                    checked={formData.cafeteria === "Dry"}
                                    onChange={() =>
                                        handleCafeteriaChange("Dry")
                                    }
                                />
                                <label
                                    className="form-check-label"
                                    htmlFor="cafeteria_1"
                                >
                                    Dry
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="cafeteria"
                                    id="cafeteria_2"
                                    value="Wet"
                                    checked={formData.cafeteria === "Wet"}
                                    onChange={() =>
                                        handleCafeteriaChange("Wet")
                                    }
                                />
                                <label
                                    className="form-check-label"
                                    htmlFor="cafeteria_2"
                                >
                                    Wet
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="cafeteria"
                                    id="cafeteria_3" // Fixed duplicate ID
                                    value="Not Available"
                                    checked={
                                        formData.cafeteria === "Not Available"
                                    }
                                    onChange={() =>
                                        handleCafeteriaChange("Not Available")
                                    }
                                />
                                <label
                                    className="form-check-label"
                                    htmlFor="cafeteria_3"
                                >
                                    Not Available
                                </label>
                            </div>
                        </div>
                    </React.Fragment>
                )}
            </React.Fragment>

            {propertyFor === "commercial-land" ||
                (propertyFor === "residential-land-plot" && (
                    <React.Fragment>
                        {/* no of open sides */}
                        <div className="form-group mb-3">
                            <label className="form-label">
                                No. of Open Sides
                            </label>
                            <div
                                className="btn-group btn-group-light d-flex mb-3"
                                role="group"
                                aria-label=""
                            >
                                {[
                                    ...Array.from({ length: 5 }, (_, i) => ({
                                        id: `open_side_${i + 1}`,
                                        label: `${i + 1}`,
                                    })),
                                ].map((side, i) => (
                                    <React.Fragment
                                        key={`item_1_${i}_${side.id}`}
                                    >
                                        <input
                                            type="radio"
                                            className="btn-check"
                                            name="total_open_sides"
                                            id={side.id}
                                            autoComplete="off"
                                            checked={
                                                formData.total_open_sides ===
                                                side.label
                                            }
                                            onChange={() =>
                                                handleFloorChange(
                                                    "total_open_sides",
                                                    side.label
                                                )
                                            }
                                        />
                                        <label
                                            className="btn btn-outline-light"
                                            htmlFor={side.id}
                                        >
                                            {side.label}
                                        </label>
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                        {/* width of road facing the plot  */}
                        <div className="form-group">
                            <label className="form-label">
                                Width of Road Facing the Plot
                            </label>
                            <div className="input-group">
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Enter width in feet/meters"
                                    value={formData.road_width || ""}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            road_width: e.target.value,
                                        })
                                    }
                                />
                                <span className="input-group-text">Meters</span>
                            </div>
                        </div>
                        {/* construction_done */}
                        <div className="mb-3">
                            <label className="form-label">
                                Any Construction done:
                            </label>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="construction_done"
                                    id="construction_done_1"
                                    value="Yes"
                                    checked={
                                        formData.construction_done === "Yes"
                                    }
                                    onChange={() =>
                                        handleConstructionDoneChange("Yes")
                                    }
                                />
                                <label
                                    className="form-check-label"
                                    htmlFor="construction_done_1"
                                >
                                    Yes
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="construction_done"
                                    id="construction_done_2"
                                    value="No"
                                    checked={
                                        formData.construction_done === "No"
                                    }
                                    onChange={() =>
                                        handleConstructionDoneChange("No")
                                    }
                                />
                                <label
                                    className="form-check-label"
                                    htmlFor="construction_done_2"
                                >
                                    No
                                </label>
                            </div>
                        </div>

                        {/* Boundary wall made */}
                        <div className="mb-3">
                            <label className="form-label">
                                Boundary wall made:
                            </label>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="boundary_wall"
                                    id="boundary_wall_1"
                                    value="Yes"
                                    checked={formData.boundary_wall === "Yes"}
                                    onChange={() =>
                                        handleBoundaryWallChange("Yes")
                                    }
                                />
                                <label
                                    className="form-check-label"
                                    htmlFor="boundary_wall_1"
                                >
                                    Yes
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="boundary_wall"
                                    id="boundary_wall_2"
                                    value="No"
                                    checked={formData.boundary_wall === "No"}
                                    onChange={() =>
                                        handleBoundaryWallChange("No")
                                    }
                                />
                                <label
                                    className="form-check-label"
                                    htmlFor="boundary_wall_2"
                                >
                                    No
                                </label>
                            </div>
                        </div>
                        {/* Is in a gated colony */}
                        <div className="mb-3">
                            <label className="form-label">
                                Is in a gated colony:
                            </label>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="is_gated_colony"
                                    id="is_gated_colony_1"
                                    value="Yes"
                                    checked={formData.is_gated_colony === "Yes"}
                                    onChange={() =>
                                        handleGatedColonyChange("Yes")
                                    }
                                />
                                <label
                                    className="form-check-label"
                                    htmlFor="is_gated_colony_1"
                                >
                                    Yes
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="is_gated_colony"
                                    id="is_gated_colony_2"
                                    value="No"
                                    checked={formData.is_gated_colony === "No"}
                                    onChange={() =>
                                        handleGatedColonyChange("No")
                                    }
                                />
                                <label
                                    className="form-check-label"
                                    htmlFor="is_gated_colony_2"
                                >
                                    No
                                </label>
                            </div>
                        </div>
                    </React.Fragment>
                ))}

            {/* funrishing status */}
            <div
                className="btn-group btn-group-light d-flex mb-3"
                role="group"
                aria-label="Property Status"
            >
                {FurnishData.map((option, i) => (
                    <React.Fragment key={`furnishid_${i}_${option.furnish_id}`}>
                        <input
                            type="radio"
                            className="btn-check"
                            name="property_furnish"
                            id={`property_furnish_${option.furnish_id}`}
                            autoComplete="off"
                            checked={
                                formData.property_furnish ===
                                option.furnish_name
                            }
                            onChange={() =>
                                handlePropertyStatusChange(option.furnish_name)
                            }
                        />
                        <label
                            className="btn btn-outline-light"
                            htmlFor={`property_furnish_${option.furnish_id}`}
                        >
                            {option.furnish_name}
                        </label>
                    </React.Fragment>
                ))}
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
