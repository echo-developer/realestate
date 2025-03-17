"use client";
import React, { useEffect, useState } from "react";
import AuthUser from "../Authentication/AuthUser";
import RoomInput from "./RoomInput";
import { toast } from "react-toastify";
import { parkingOptions, CafeteriaOption, facingOptions } from "./PropertyData";
import useTranslation from "@/hooks/useTranslation";

const Step4Form = ({ formData, setFormData, nextStep, prevStep }) => {
  const [errors, setErrors] = useState({});
  const { callApi } = AuthUser();
  const [BudgetData, setBudgetData] = useState([]);
  const [AmenityData, setAmenityData] = useState([]);
  const [FurnishData, setFurnishData] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showFloorDropdown, setShowFloorDropdown] = useState(false);
  const translation = useTranslation();

  const unitOptions = [`${translation?.acre ||"Acre"}`, `${translation?.sqft ||"sqft"}`,  `${translation?.sqm ||"sqm"}`];

  let propertyFor = localStorage.getItem("property_for_key");
  let propertyType = localStorage.getItem("property_type");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    FetchBudgetData();
    fetchAmenityData();
    fetchFurnishData();
  }, [propertyFor, propertyType]);

  const handleRoomCountChange = (key, value) => {
    const roomCount = parseInt(value, 10) || 0;
    const roomsArray = Array.from({ length: roomCount }, (_, index) => ({
      key: `${key}${index + 1}`,
      height: "",
      width: "",
      height_unit: `${translation?.sqft ||"sqft"}`,
      width_unit: `${translation?.sqft ||"sqft"}`,

    }));
    setFormData({
      ...formData,
      [key]: JSON.stringify(roomsArray),
    });
  };

  const handleInputChange = (e, key) => {
    let value = e.target.value;

    // Allow only numbers (including decimals)
    if (!/^\d*\.?\d*$/.test(value)) return;

    setFormData((prevData) => ({ ...prevData, [key]: value }));

    // Validate dynamically while typing
    let errorMessage = "";
    if (!value) {
      errorMessage = `${
        key === "carpet_area" ? "Carpet" : "Super"
      } area is required.`;
    } else if (isNaN(value) || Number(value) <= 0) {
      errorMessage = "Please enter a valid positive number.";
    }

    setErrors((prevErrors) => ({ ...prevErrors, [key]: errorMessage }));
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
        height_unit: formData[key]?.[index]?.height_unit || `${translation?.sqft ||"sqft"}`,
        width_unit: formData[key]?.[index]?.width_unit || `${translation?.sqft ||"sqft"}`,
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
    setShowDropdown(false);
  };
  const handleTotalFloorChange = (key, selectedFloor) => {
    setFormData({
      ...formData,
      [key]: selectedFloor,
    });
    setShowFloorDropdown(false);
    setErrors((prevErrors) => ({ ...prevErrors, [key]: "" }));
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
        property_furnish: FurnishData[0]?.furnish_id || "",
      }));
    }
  }, [formData, setFormData]);

  useEffect(() => {
    if (!formData.floor) {
      setFormData((prev) => ({
        ...prev,
        floor: "lower_basement",
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
            newErrors[key][
              index
            ].height = `Height for ${room.key} must be a valid number.`;
          }

          if (!room.width || isNaN(Number(room.width))) {
            if (!newErrors[key]) newErrors[key] = [];
            if (!newErrors[key][index]) newErrors[key][index] = {};
            newErrors[key][
              index
            ].width = `Width for ${room.key} must be a valid number.`;
          }
        });
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForm = () => {
    let errors = {};

    if (!formData.carpet_area) {
      errors.carpet_area = `${
        translation?.please_enter_carpet_area || "Please enter the carpet area."
      }`;
    } else if (
      isNaN(formData.carpet_area) ||
      Number(formData.carpet_area) <= 0
    ) {
      errors.carpet_area = `${
        translation?.carpet_area_must_be_positive ||
        "Carpet area must be a positive number."
      }`;
    }

    if (!formData.super_area) {
      errors.super_area = `${
        translation?.please_enter_super_area || "Please enter the super area."
      }`;
    } else if (isNaN(formData.super_area) || Number(formData.super_area) <= 0) {
      errors.super_area = `${
        translation?.super_area_must_be_positive ||
        "Super area must be a positive number."
      }`;
    }

    // Total Floors Validation
    if (!formData.total_floor) {
      errors.total_floor = `${
        translation?.please_select_total_floors ||
        "Please select the total number of floors"
      }`;
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (propertyFor === "residential-land-plot") {
      nextStep();
    } else {
      if (validateForm() && validateRoomDimensions()) {
        nextStep();
      }
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

  const visibleFloors = [
    { id: "lower_basement", label: `${translation?.lower_basement ||"Lower Basement"}` },
    { id: "upper_basement", label: `${translation?.upper_basement ||"Upper Basement"}`},
    { id: "ground", label: `${translation?.ground ||"Ground"}`},
    ...Array.from({ length: 5 }, (_, i) => ({
      id: `floor_${i + 1}`,
      label: `${i + 1}`,
    })),
  ];

  const dropdownFloors = Array.from({ length: 10 }, (_, i) => ({
    id: `floor_${i + 6}`,
    label: `${i + 6}`,
  }));

  const roomTypes = (() => {
    switch (propertyFor) {
      case "apartments--flats" || 1:
      case "builder-floor-apartment" || 7:
      case "residential-house" || 6:
      case "villas" || 2:
      case "penthouse" || 9:
        return ["bedroom", "balcony", "bathroom"];
      case "studio-apartment" || 10:
        return ["balcony", "bathroom"];
      case "commercial-office-space" || 11:
      case "office-in-it-park-sez":
      case "commercial-shop":
      case "offices" || 12:
        return ["washroom"];

      default:
        return null;
    }
  })();

  const handleUnitChange = (event) => {
    setFormData({ ...formData, unit_type: event.target.value });
  };

  return (
    <div id="step-4">
      <React.Fragment>
        {/* Bedroom, Bathroom, and Kitchen Inputs */}
        <div className="mb-3">
          <label className="col-form-label">
            {translation?.select_units || "Select Unit(s)"}
          </label>
          <select
            className="form-select"
            value={formData.unit_type}
            onChange={handleUnitChange}
          >
            {unitOptions.map((unit, index) => (
              <option key={index} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </div>
        <div className="row gx-3">
          {roomTypes?.map((key, i) => (
            <div className="col-12" key={`item_${i}_${key}`}>
              <div className="form-field">
                <div className="d-flex flex-column justify-content-center align-items-center">
                  <h5 className="text-primary fw-bold">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </h5>
                  <div className="cart-plus-minus mb-2">
                    <input
                      type="text"
                      className="form-control"
                      value={(formData[key] || []).length}
                      onChange={(e) =>
                        handleRoomCountChange(key, e.target.value)
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
                </div>

                {/* Conditionally render room input fields */}
                <fieldset className="">
                  <legend>{`${key.charAt(0).toUpperCase() + key.slice(1)} (${
                    formData?.unit_type || "Not Available"
                  })`}</legend>

                  <div className="row gx-3 -mb-3">
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
                </fieldset>
              </div>
            </div>
          ))}
        </div>

        {/* Carpet and Plot Area Inputs */}
        <div className="row gx-3">
          {[
            { label: `${translation?.carpet_area ||"Carpet Area"}`, key: "carpet_area" }, 
            { label: `${translation?.super_area ||"Super Area"}`, key: "super_area" },
          ].map(({ label, key }, i) => (
            <div className="col-lg-6 col-12" key={`item_3_${i}_${key}`}>
              <div className="form-field">
                <label className="form-label">{label}  <span className="text-danger">*</span></label>
                <div className="input-group">
                  <input
                    type="text"
                    className={`form-control ${
                      errors[key] ? "is-invalid" : ""
                    }`}
                    placeholder={`Type ${label} in Numeric`}
                    value={formData[key]}
                    onChange={(e) => handleInputChange(e, key)}
                  />
                  <span className="input-group-text">
                    {formData?.unit_type || "Not Available"}
                  </span>
                </div>
                {errors[key] && (
                  <div className="invalid-feedback">{errors[key]}</div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Floor Selection */}
        {(propertyFor === "villas" ||
          propertyFor !== "residential-house" ||
          propertyFor !== "commercial-land" ||
          propertyFor !== "residential-land-plot") && (
          <div className="form-group">
            <label className="form-label">
              {translation?.floor_no || "Floor No"}
            </label>
            <div
              className="btn-group btn-group-light d-flex flex-wrap mb-3"
              role="group"
              aria-label="Floors"
            >
              {/* Render floors 1-5 + basement options */}
              {visibleFloors.map((floor) => (
                <React.Fragment key={`floor${floor.id}`}>
                  <input
                    type="radio"
                    className="btn-check"
                    name="floors"
                    id={floor.id}
                    autoComplete="off"
                    checked={formData.floor === floor.id} // Ensure correct comparison
                    onChange={() => handleFloorChange("floor", floor.id)} // Store ID
                  />
                  <label
                    className={`btn btn-outline-light mb-2 ${
                      formData.floor === floor.id ? "active" : ""
                    }`}
                    htmlFor={floor.id}
                  >
                    {floor.label}
                  </label>
                </React.Fragment>
              ))}

              {/* Dropdown for floors 6-15 */}
              <div className="dropdown">
                <button
                  className={`btn btn-outline-light dropdown-toggle ${
                    dropdownFloors.some((f) => f.id === formData.floor)
                      ? "active"
                      : ""
                  }`}
                  type="button"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  {dropdownFloors.some((f) => f.id === formData.floor) ? (
                    dropdownFloors.find((f) => f.id === formData.floor)?.label // Show selected dropdown value
                  ) : (
                    <i className="bi bi-plus-lg"></i>
                  )}
                </button>
                <ul
                  className={`dropdown-menu dropdown-menu-end ${
                    showDropdown ? "show" : ""
                  }`}
                >
                  {dropdownFloors.map((floor) => (
                    <li key={`floor${floor.id}`}>
                      <a
                        role="button"
                        className={`dropdown-item ${
                          formData.floor === floor.id ? "active" : ""
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleFloorChange("floor", floor.id); // Store ID
                          setShowDropdown(false); // Close dropdown
                        }}
                      >
                        {floor.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Total Floor Selection */}
        {propertyFor !== "residential-land-plot" && (
          <div className="form-group">
            <label className="form-label">
              {translation?.total_floors || "Total Floors"}  <span className="text-danger">*</span>
            </label>
            <div
              className="btn-group btn-group-light d-flex flex-wrap mb-3"
              role="group"
              aria-label="Total Floors"
            >
              {/* Radio buttons for floors 1-12 */}
              {Array.from({ length: 12 }, (_, i) => ({
                id: `${i + 1}`,
                label: `${i + 1}`,
              })).map((floor) => (
                <React.Fragment key={`total_floor${floor.id}`}>
                  <input
                    type="radio"
                    className="btn-check"
                    name="total_floors"
                    id={floor.id}
                    autoComplete="off"
                    checked={formData.total_floor === floor.id}
                    onChange={() =>
                      handleTotalFloorChange("total_floor", floor.id)
                    }
                  />
                  <label
                    className={`btn btn-outline-light mb-2 ${
                      formData.total_floor === floor.id ? "active" : ""
                    }`}
                    htmlFor={floor.id}
                  >
                    {floor.label}
                  </label>
                </React.Fragment>
              ))}

              {/* Dropdown for floors 13-20 */}
              <div className="dropdown">
                <button
                  className="btn btn-outline-light dropdown-toggle"
                  type="button"
                  onClick={() => setShowFloorDropdown(!showFloorDropdown)}
                >
                  {
                    // Show the selected floor if it's 13-20, otherwise show "+"
                    parseInt(formData.total_floor) >= 13 ? (
                      formData.total_floor
                    ) : (
                      <i className="bi bi-plus-lg"></i>
                    )
                  }
                </button>
                <ul
                  className={`dropdown-menu dropdown-menu-end ${
                    showFloorDropdown ? "show" : ""
                  }`}
                >
                  {Array.from({ length: 8 }, (_, i) => ({
                    id: `${i + 13}`,
                    label: `${i + 13}`,
                  })).map((floor) => (
                    <li key={`total_floor${floor.id}`}>
                      <a
                        role="button"
                        className={`dropdown-item ${
                          formData.total_floor === floor.id ? "active" : ""
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleTotalFloorChange("total_floor", floor.id); // Store ID
                          setShowFloorDropdown(false);
                        }}
                      >
                        {floor.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {errors.total_floor && (
              <div className="text-danger small">{errors.total_floor}</div>
            )}
          </div>
        )}

        {propertyFor !== "residential-land-plot" && (
          <React.Fragment>
            {/* Facing and Parking */}
            <div className="row gx-3">
              <div className="col-lg-6 col-12">
                <label className="form-label">
                  {translation?.facing || "Facing"}
                </label>
                <div className="form-field">
                  <select
                    className="form-control"
                    value={formData.property_facing || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        property_facing: e.target.value,
                      })
                    }
                  >
                    <option value="">
                      {translation?.select_facing || "Select Facing"}
                    </option>
                    {facingOptions.map((facing, i) => (
                      <option
                        key={`dataidf_${i}_${facing.key}`}
                        value={facing.key}
                      >
                        {facing?.value}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-lg-6 col-12">
                <label className="form-label">
                  {translation?.parking || "Parking"}
                </label>
                <div className="form-field">
                  <select
                    className="form-control"
                    value={formData.parking_availability || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        parking_availability: e.target.value,
                      })
                    }
                  >
                    <option value="">
                      {translation?.select_parking_option ||
                        "Select Parking Option"}
                    </option>
                    {parkingOptions.map((option, i) => (
                      <option
                        key={`parkingid${i}_${option.key}`}
                        value={option.key}
                      >
                        {option.value}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="form-group">
              <label className="form-label">
                {translation?.amenity_features || "Amenity Features"}{" "}
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
                      formData.property_amenity?.includes(feature.amenity_id) ||
                      false
                    }
                    onChange={(e) =>
                      setFormData((prev) => {
                        const newFeatures = [...(prev.property_amenity || [])];
                        if (e.target.checked) {
                          newFeatures.push(feature.amenity_id);
                        } else {
                          const index = newFeatures.indexOf(feature.amenity_id);
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
                {translation?.is_corner_plot || "Is This A Corner Plot:"}
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
                <label className="form-check-label" htmlFor="corner_plot_1">
                  {translation?.yes || "Yes"}
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
                  {translation?.no || "No"}
                </label>
              </div>
            </div>

            {/* Is Allowed for Floor Construction */}
            <div className="mb-3">
              <label className="form-label">
                {translation?.is_allowed_floor_construction ||
                  "Is Allowed for Floor Construction"}
              </label>
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
                <label
                  className="form-check-label"
                  htmlFor="allowed_construction_1"
                >
                  {translation?.yes || "Yes"}
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
                <label
                  className="form-check-label"
                  htmlFor="allowed_construction_2"
                >
                  {translation?.no || "No"}
                </label>
              </div>
            </div>
            {propertyFor !== "industrial-land" && (
              <div
                className="btn-group btn-group-light btn-group-card d-flex flex-wrap mb-3"
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
                      checked={formData.property_furnish === option.furnish_id}
                      onChange={() =>
                        handlePropertyStatusChange(option.furnish_id)
                      }
                    />
                    <label
                      className="btn btn-outline-light"
                      htmlFor={`property_furnish_${option.furnish_id}`}
                    >
                      <img
                        src="/assets/images/icons/furnish.png"
                        alt="Icon"
                        height={48}
                        width={48}
                        className="mb-2"
                      />
                      {option.furnish_name}
                    </label>
                  </React.Fragment>
                ))}
              </div>
            )}
            {/* funrishing status */}
          </React.Fragment>
        )}
        {propertyType == 2 && propertyFor !== "commercial-land" && (
          <React.Fragment>
            {/* Corner Shop */}
            {(propertyFor === "commercial-shop" ||
              propertyFor === "commercial-showroom") && (
              <div className="mb-3">
                <label className="form-label">
                  {translation?.corner_shop || "Corner Shop"}
                </label>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="corner_shop"
                    id="corner_shop_1"
                    value="Yes"
                    checked={formData.corner_shop === "Yes"}
                    onChange={() => handleCornerShopChange("Yes")}
                  />
                  <label className="form-check-label" htmlFor="corner_shop_1">
                    {translation?.yes || "Yes"}
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
                    onChange={() => handleCornerShopChange("No")}
                  />
                  <label className="form-check-label" htmlFor="corner_shop_2">
                    {translation?.no || "No"}
                  </label>
                </div>
              </div>
            )}

            {/* Main Road Facing */}
            {(propertyFor === "commercial-shop" ||
              propertyFor === "commercial-showroom") && (
              <div className="mb-3">
                <label className="form-label">
                  {translation?.is_main_road_facing || "Is Main Road Facing:"}
                </label>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="main_road_facing"
                    id="main_road_facing_1"
                    value="Yes"
                    checked={formData.main_road_facing === "Yes"}
                    onChange={() => handleMainRoadChange("Yes")}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="main_road_facing_1"
                  >
                    {translation?.yes || "Yes"}
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="main_road_facing"
                    id="main_road_facing_2"
                    value="No"
                    checked={formData.main_road_facing === "No"}
                    onChange={() => handleMainRoadChange("No")}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="main_road_facing_2"
                  >
                    {translation?.no || "No"}
                  </label>
                </div>
              </div>
            )}

            {/* Personal Washroom */}
            <div className="mb-3">
              <label className="form-label">
                {translation?.personal_washroom || "personal_washroom"}
              </label>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="personal_washroom"
                  id="personal_washroom_1"
                  value="Yes"
                  checked={formData.personal_washroom === "Yes"}
                  onChange={() => handleWashroomChange("Yes")}
                />
                <label
                  className="form-check-label"
                  htmlFor="personal_washroom_1"
                >
                  {translation?.yes || "Yes"}
                </label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="personal_washroom"
                  id="personal_washroom_2"
                  value="No"
                  checked={formData.personal_washroom === "No"}
                  onChange={() => handleWashroomChange("No")}
                />
                <label
                  className="form-check-label"
                  htmlFor="personal_washroom_2"
                >
                  {translation?.no || "No"}
                </label>
              </div>
            </div>

            {/* Cafeteria */}
            <div className="mb-3">
              <label className="form-label">
                {translation?.pantry_cafeteria || "Pantry/Cafeteria:"}
              </label>
              {CafeteriaOption.map((option) => (
                <div key={option.key} className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="cafeteria"
                    id={`cafeteria_${option.key}`}
                    value={option.key}
                    checked={formData.cafeteria === option.key}
                    onChange={() => handleCafeteriaChange(option.key)}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`cafeteria_${option.key}`}
                  >
                    {option.value}
                  </label>
                </div>
              ))}
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
                {translation?.no_of_open_sides || "No. of Open Sides"}
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
                  <React.Fragment key={`item_1_${i}_${side.id}`}>
                    <input
                      type="radio"
                      className="btn-check"
                      name="total_open_sides"
                      id={side.id}
                      autoComplete="off"
                      checked={formData.total_open_sides === side.label}
                      onChange={() =>
                        handleFloorChange("total_open_sides", side.label)
                      }
                    />
                    <label className="btn btn-outline-light" htmlFor={side.id}>
                      {side.label}
                    </label>
                  </React.Fragment>
                ))}
              </div>
            </div>
            {/* width of road facing the plot  */}
            <div className="form-field">
              <label className="form-label">
                {translation?.road_width || "Width of Road Facing the Plot"}
              </label>
              <div className="input-group">
                <input
                  type="number"
                  className="form-control"
                  placeholder={translation?.enter_width ||"Enter width in feet/meters"}
                  value={formData.road_width || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      road_width: e.target.value,
                    })
                  }
                />
                <span className="input-group-text">
                  {" "}
                  {translation?.meters || "Meters"}
                </span>
              </div>
            </div>
            <div className="row">
              {/* construction_done */}
              <div className="col-lg-4 mb-3">
                <label className="form-label d-block">
                  {translation?.any_construction_done ||
                    "Any Construction done:"}
                </label>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="construction_done"
                    id="construction_done_1"
                    value="Yes"
                    checked={formData.construction_done === "Yes"}
                    onChange={() => handleConstructionDoneChange("Yes")}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="construction_done_1"
                  >
                    {translation?.yes || "Yes"}
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="construction_done"
                    id="construction_done_2"
                    value="No"
                    checked={formData.construction_done === "No"}
                    onChange={() => handleConstructionDoneChange("No")}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="construction_done_2"
                  >
                    {translation?.no || "No"}
                  </label>
                </div>
              </div>

              {/* Boundary wall made */}
              <div className="col-lg-4 mb-3">
                <label className="form-label d-block">
                  {translation?.boundary_wall_made || " Boundary wall made:"}
                </label>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="boundary_wall"
                    id="boundary_wall_1"
                    value="Yes"
                    checked={formData.boundary_wall === "Yes"}
                    onChange={() => handleBoundaryWallChange("Yes")}
                  />
                  <label className="form-check-label" htmlFor="boundary_wall_1">
                    {translation?.yes || "Yes"}
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
                    onChange={() => handleBoundaryWallChange("No")}
                  />
                  <label className="form-check-label" htmlFor="boundary_wall_2">
                    {translation?.no || "No"}
                  </label>
                </div>
              </div>
              {/* Is in a gated colony */}
              <div className="col-lg-4 mb-3">
                <label className="form-label d-block">
                  {translation?.is_in_gated_colony || "Is in a gated colony:"}
                </label>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="is_gated_colony"
                    id="is_gated_colony_1"
                    value="Yes"
                    checked={formData.is_gated_colony === "Yes"}
                    onChange={() => handleGatedColonyChange("Yes")}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="is_gated_colony_1"
                  >
                    {translation?.yes || "Yes"}
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
                    onChange={() => handleGatedColonyChange("No")}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="is_gated_colony_2"
                  >
                    {translation?.no || "No"}
                  </label>
                </div>
              </div>
            </div>
          </React.Fragment>
        ))}

      {/* Navigation Buttons */}
      <div className="d-grid columns-2">
        <button type="button" className="btn btn-secondary" onClick={prevStep}>
          <i className="bi bi-arrow-left"></i> {translation?.back || "Back"}
        </button>
        <button type="button" className="btn btn-primary" onClick={handleNext}>
          {translation?.next || "Next"} <i className="bi bi-arrow-right"></i>
        </button>
      </div>
    </div>
  );
};

export default Step4Form;
