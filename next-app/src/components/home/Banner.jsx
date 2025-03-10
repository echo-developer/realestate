"use client";
import React, { useEffect, useState, useRef } from "react";
import Select from "react-select";
import Link from "next/link";
import AuthUser from "../Authentication/AuthUser";
import { toast } from "react-toastify";
import Router from "next/router";
import { useRouter } from "next/navigation";
import LocalityOption from "../MapData/LocalitySelector";
import useTranslation from "../../hooks/useTranslation";
import {
  Form,
  Row,
  Col,
  ListGroup,
  Nav,
  ProgressBar,
  FloatingLabel,
  Dropdown,
  DropdownButton,
  Modal,
  ButtonGroup,
  Button,
} from "react-bootstrap";

const budgets = [
  { key: 1, name: "$99 - $199" },
  { key: 2, name: "$200 - $300" },
  { key: 3, name: "$301 - $499" },
  { key: 4, name: "$500 - $999" },
  { key: 5, name: "Above $1000" },
];

const sizes = [
  {
    id: 1,
    key: JSON.stringify({ min_carpet: 0, max_carpet: 250 }),
    name: "0 - 250 sq ft",
  },
  {
    id: 2,
    key: JSON.stringify({ min_carpet: 251, max_carpet: 350 }),
    name: "251 sq ft - 350 sq ft",
  },
  {
    id: 3,
    key: JSON.stringify({ min_carpet: 351, max_carpet: 500 }),
    name: "351 sq ft - 500 sq ft",
  },
  {
    id: 4,
    key: JSON.stringify({ min_carpet: 501, max_carpet: 1000 }),
    name: "501 sq ft - 1000 sq ft",
  },
  {
    id: 5,
    key: JSON.stringify({ min_carpet: 1000 }),
    name: "Above 1000 sq ft",
  },
];

const bedrooms = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const parkingOptions = [
  { slug: "available", name: "Available" },
  { slug: "not-available", name: "Not available" },
];

const Banner = () => {
  const { callApi } = AuthUser();
  const router = useRouter();
  const translation = useTranslation();
  const [locationData, setLocationData] = useState(null);
  const [PropertyTypeData, setPropertyTypeData] = useState([]);
  const [PropertyForData, setPropertyForData] = useState([]);
  const [selectedTab, setSelectedTab] = useState("rent");
  const [selectedLocation, setSelectedLocation] = useState([]);
  const [selectedPropertyType, setSelectedPropertyType] = useState("1");
  const [selectedPropertyFor, setSelectedPropertyFor] = useState("1");
  const [selectedBudget, setSelectedBudget] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedParking, setSelectedParking] = useState("");
  const [gender, setGender] = useState("");
  const [showBedParking, setShowBedParking] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenSS, setIsOpenSS] = useState(false);
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [error, setError] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [BudgetDropdown, setBudgetDropdown] = useState(false);
  const [BedDropdown, setBedDropdown] = useState(false);
  const [selectedBedrooms, setSelectedBedrooms] = useState([]);
  const [selectedBathrooms, setSelectedBathrooms] = useState([]);
  const [showSizeDropdown, setShowSizeDropdown] = useState(false);
  const [minSize, setMinSize] = useState("");
  const [maxSize, setMaxSize] = useState("");

  const toggleSizeDropdown = (isOpen) => setShowSizeDropdown(isOpen);

  const resetSizes = () => {
    setMinSize("");
    setMaxSize("");
  };

  const applySizes = () => {
    setShowDropdown(false);
    console.log("Applied Min Size:", minSize, "Max Size:", maxSize);
  };

  const onApply = () => {};

  const toggleSelection = (value, type) => {
    if (type === "bedroom") {
      setSelectedBedrooms((prev) =>
        prev.includes(value)
          ? prev.filter((item) => item !== value)
          : [...prev, value]
      );
    } else {
      setSelectedBathrooms((prev) =>
        prev.includes(value)
          ? prev.filter((item) => item !== value)
          : [...prev, value]
      );
    }
  };

  const resetSelection = () => {
    setSelectedBedrooms([]);
    setSelectedBathrooms([]);
    setBedDropdown(false);
  };

  const applySelection = () => {
    onApply({ bedrooms: selectedBedrooms, bathrooms: selectedBathrooms });
    setBedDropdown(false);
  };

  // Predefined budget ranges (dropdown)
  const budgetOptions = [50000, 100000, 200000, 300000, 500000];

  const toggleBudgetDropdown = () => setBudgetDropdown((prev) => !prev);

  const handleMinChange = (e) => {
    const value = e.target.value;
    setMinBudget(value);
    if (maxBudget && Number(value) > Number(maxBudget)) {
      setError("Min budget cannot be greater than max budget.");
    } else {
      setError("");
    }
  };

  const handleMaxChange = (e) => {
    const value = e.target.value;
    setMaxBudget(value);
    if (minBudget && Number(value) < Number(minBudget)) {
      setError("Max budget cannot be less than min budget.");
    } else {
      setError("");
    }
  };

  const resetBudget = () => {
    setMinBudget("");
    setMaxBudget("");
    setError("");
    setShowDropdown(false); // Close dropdown
  };

  const applyBudget = () => {
    if (!error) {
      setShowDropdown(false); // Close dropdown
    }
  };

  const getDisplayText = () => {
    if (minBudget && maxBudget) return `$${minBudget} - $${maxBudget}`;
    if (minBudget) return `Min: $${minBudget}`;
    if (maxBudget) return `Max: $${maxBudget}`;
    return "Select Budget";
  };

  const handlePropertyTypeChange = (eventKey) => {
    setSelectedPropertyType(eventKey);
  };

  const handleReset = () => {
    setSelectedPropertyType("");
    setSelectedPropertyFor("");
    setShowDropdown(false); // Close dropdown
  };

  const handleDone = () => {
    setShowDropdown(false); // Close dropdown
  };

  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdownType = () => {
    setIsOpenSS(!isOpenSS);
  };

  const handlePropertyForChange = (selectedValue) => {
    setSelectedPropertyFor(selectedValue);
    setShowDropdown(!showDropdown);
  };

  const handleSizeChange = (event) => setSelectedSize(event.target.value);
  const handleBedroomsChange = (event) =>
    setSelectedBedrooms(event.target.value);

  useEffect(() => {
    FetchPropertyTypeData();
  }, []);

  useEffect(() => {
    if (selectedPropertyType) {
      FetchPropertyForData();
    }
  }, [selectedPropertyType]);

  useEffect(() => {
    if (selectedPropertyType == 2) {
      setShowBedParking(false);
      setSelectedBedrooms("");
    } else {
      setShowBedParking(true);
    }
  }, [selectedPropertyType]);

  const FetchPropertyTypeData = async () => {
    let response;
    try {
      response = await callApi({
        api: `/get_property_type`,
        method: "GET",
      });
      if (response && response.data) {
        setPropertyTypeData(response.data);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(response.message);
    }
  };

  const FetchPropertyForData = async () => {
    let response;
    try {
      response = await callApi({
        api: `/get_property_for/${selectedPropertyType}`,
        method: "GET",
      });
      if (response && response.data) {
        setPropertyForData(response.data);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleTabChange = (tab) => {
    if (tab === "projects") {
      router.push("/project-listing");
    } else {
      setSelectedTab(tab);
    }
  };
  const buildSearchUrl = () => {
    const params = {};
    if (selectedTab) params.post_for = selectedTab;
    if (selectedLocation.length) params.city_id = setLocationData;
    if (selectedTab !== "pg_hostel") {
      if (selectedPropertyType) params.property_type = selectedPropertyType;
      if (selectedPropertyFor) params.property_for = selectedPropertyFor;
    }
    if (selectedBudget) params.property_budget = selectedBudget;
    if (gender) params.gender = gender;
    if (locationData) {
      params.location_data = JSON.stringify(locationData);
    }

    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value)
    );

    const queryString = new URLSearchParams(filteredParams).toString();

    let searchData = {};
    if (selectedBudget) {
      searchData = {
        min_budget: minBudget,
        max_budget: maxBudget,
      };
    }
    if (selectedParking === "available") {
      searchData = {
        ...searchData,
        amenities: [1],
      };
    }
    if (selectedBedrooms) {
      searchData = {
        ...searchData,
        bedrooms: [Number(selectedBedrooms)],
      };
    }
    if (selectedSize) {
      searchData = {
        ...searchData,
        carpet_area: selectedSize,
      };
    }

    if (selectedBudget || selectedParking || selectedBedrooms || selectedSize) {
      return `/property-listing?${queryString}&searchData=${JSON.stringify(
        searchData
      )}`;
    } else {
      return `/property-listing?${queryString}`;
    }
  };

  const handleSearch = () => {
    const url = buildSearchUrl();
    router.push(url);
  };

  return (
    <React.Fragment>
      <div className="clearfix"></div>
      <section
        className="banner"
        style={{ backgroundImage: "url('/assets/images/banner-1.jpg')" }}
      >
        <div className="banner-layer">
          <div
            className="transparent-header-spacer"
            style={{ height: "50px" }}
          ></div>
          <div className="container-lg">
            <div className="banner-form">
              <div className="row justify-content-center align-items-center">
                <div className="col-xl-8 col-lg-9 col-12">
                  <div className="headline">
                    <h1>
                      {translation?.search_home_you_love ||
                        "Search A Home Which You’ll Love"}
                    </h1>
                  </div>
                  <div className="search-form">
                    <ul
                      className="nav nav-pills nav-justified"
                      id="pills-tab"
                      role="tablist"
                    >
                      <li className="nav-item" role="presentation">
                        <button
                          className={`nav-link ${
                            selectedTab === "rent" ? "active" : ""
                          }`}
                          onClick={() => handleTabChange("rent")}
                          type="button"
                          role="tab"
                        >
                          {translation?.rent || "Rent"}
                        </button>
                      </li>
                      <li className="nav-item" role="presentation">
                        <button
                          className={`nav-link ${
                            selectedTab === "sell" ? "active" : ""
                          }`}
                          onClick={() => handleTabChange("sell")}
                          type="button"
                          role="tab"
                        >
                          {translation?.buy || "Buy"}
                        </button>
                      </li>
                      <li className="nav-item" role="presentation">
                        <button
                          className={`nav-link ${
                            selectedTab === "projects" ? "active" : ""
                          }`}
                          onClick={() => handleTabChange("projects")}
                          type="button"
                          role="tab"
                        >
                          {translation?.new_projects || "New Projects"}
                        </button>
                      </li>
                    </ul>

                    <div className="tab-content" id="pills-tabContent">
                      {selectedTab === "sell" && (
                        <div
                          className="tab-pane fade active show"
                          id="pills-buy"
                          role="tabpanel"
                        >
                          <div className="row gx-3">
                            {/* Location Dropdown */}
                            <LocalityOption setLocationData={setLocationData} />

                            {/* Property Type Dropdown */}
                            <Dropdown
                              className="select-dropdown d-grid col-lg-6 col-12 mb-3"
                              show={showDropdown}
                              onToggle={(isOpen) => setShowDropdown(isOpen)}
                            >
                              <Dropdown.Toggle
                                className="btn-form-control"
                                id="dropdown-basic"
                              >
                                Residential
                              </Dropdown.Toggle>

                              <Dropdown.Menu className="p-3">
                                {/* Property Type Selection as Tabs */}
                                <div className="">
                                  <div className="form-field">
                                    <Nav
                                      variant="underline"
                                      activeKey={selectedPropertyType}
                                      onSelect={handlePropertyTypeChange}
                                    >
                                      {PropertyTypeData.map((type) => (
                                        <Nav.Item key={type.category_id}>
                                          <Nav eventKey={type.category_id}>
                                            {type.category_name}
                                          </Nav>
                                        </Nav.Item>
                                      ))}
                                    </Nav>
                                  </div>
                                </div>

                                {/* Property For Selection as Radio Buttons */}
                                <div className=" mt-3">
                                  <div className="form-field">
                                    <ButtonGroup className="btn-group-light d-flex flex-wrap">
                                      {PropertyForData.map(
                                        (property, index) => (
                                          <div
                                            key={property.sub_category_id}
                                            className="me-2 mb-2"
                                          >
                                            <input
                                              type="radio"
                                              className="btn-check"
                                              name="propertyForGroup"
                                              id={`propertyFor-${index}`}
                                              value={property.sub_category_id}
                                              checked={
                                                selectedPropertyFor ===
                                                property.sub_category_id
                                              }
                                              onChange={() =>
                                                handlePropertyForChange(
                                                  property.sub_category_id
                                                )
                                              }
                                            />
                                            <label
                                              className="btn btn-outline-light"
                                              htmlFor={`propertyFor-${index}`}
                                            >
                                              {property.sub_category_name}
                                            </label>
                                          </div>
                                        )
                                      )}
                                    </ButtonGroup>
                                  </div>
                                </div>

                                {/* Reset & Done Buttons */}
                                <div className="d-flex justify-content-between mt-3">
                                  <Button
                                    variant="outline-secondary"
                                    onClick={handleReset}
                                  >
                                    Reset
                                  </Button>
                                  <Button
                                    variant="primary"
                                    onClick={handleDone}
                                  >
                                    Done
                                  </Button>
                                </div>
                              </Dropdown.Menu>
                            </Dropdown>

                            {/* Budget Dropdown */}
                            <Dropdown
                              className="col-lg-4 col-6"
                              show={showDropdown}
                              onToggle={setShowDropdown}
                            >
                              {/* Dropdown Button */}
                              <Dropdown.Toggle
                                className="form-select w-100 text-start"
                                id="budget-dropdown"
                              >
                                {getDisplayText()}
                              </Dropdown.Toggle>

                              {/* Dropdown Menu */}
                              <Dropdown.Menu className="p-3 shadow bg-white rounded">
                                <div className="d-flex justify-content-between">
                                  <label>Minimum</label>
                                  <label>Maximum</label>
                                </div>

                                {/* Budget Selection (Dropdown) */}
                                <div className="d-flex gap-2">
                                  <select
                                    className="form-select"
                                    value={minBudget}
                                    onChange={handleMinChange}
                                  >
                                    <option value="">Min</option>
                                    {budgetOptions.map((amount) => (
                                      <option key={amount} value={amount}>
                                        ${amount}
                                      </option>
                                    ))}
                                  </select>

                                  <select
                                    className="form-select"
                                    value={maxBudget}
                                    onChange={handleMaxChange}
                                  >
                                    <option value="">Max</option>
                                    {budgetOptions.map((amount) => (
                                      <option key={amount} value={amount}>
                                        ${amount}
                                      </option>
                                    ))}
                                  </select>
                                </div>

                                <div className="d-flex justify-content-between mt-3">
                                  <label>Or enter manually</label>
                                </div>

                                {/* Manual Input for Min/Max Budget */}
                                <div className="d-flex gap-2">
                                  <input
                                    type="number"
                                    className="form-control"
                                    placeholder="0"
                                    value={minBudget}
                                    onChange={handleMinChange}
                                  />
                                  <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Any"
                                    value={maxBudget}
                                    onChange={handleMaxChange}
                                  />
                                </div>

                                {/* Validation Message */}
                                {error && (
                                  <div className="text-danger mt-2">
                                    {error}
                                  </div>
                                )}

                                <div className="d-flex justify-content-between mt-3">
                                  <Button
                                    variant="outline-secondary"
                                    onClick={resetBudget}
                                  >
                                    Reset
                                  </Button>
                                  <Button
                                    variant="primary"
                                    onClick={applyBudget}
                                    disabled={!!error}
                                  >
                                    Done
                                  </Button>
                                </div>
                              </Dropdown.Menu>
                            </Dropdown>

                            {/* Size Dropdown */}
                            <div className="col-lg-4 col-6">
                              <div className="form-field">
                                <select
                                  className="form-select"
                                  value={selectedSize}
                                  onChange={handleSizeChange}
                                >
                                  <option value="">
                                    {translation?.select_size || "Select Size"}
                                  </option>
                                  {sizes.map((size) => (
                                    <option key={size.key} value={size.id}>
                                      {size.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                            {/* Bedrooms Dropdown */}
                            {selectedPropertyType !== "2" && (
                              <Dropdown
                                className="select-dropdown d-grid col-lg-4 col-6"
                                show={BedDropdown}
                                onToggle={(isOpen) => setBedDropdown(isOpen)}
                              >
                                <Dropdown.Toggle className="btn w-100 text-start">
                                  {selectedBedrooms.length > 0
                                    ? selectedBedrooms.join(", ")
                                    : translation?.select_bedrooms ||
                                      "Select Beds"}
                                  /
                                  {selectedBathrooms.length > 0
                                    ? selectedBathrooms.join(", ")
                                    : translation?.select_bathrooms ||
                                      "Select Baths"}
                                </Dropdown.Toggle>

                                <Dropdown.Menu className="p-3 shadow bg-white rounded">
                                  {/* Bedrooms Selection */}
                                  <div>
                                    <label className="fw-bold mb-2">
                                      {translation?.beds || "Beds"}
                                    </label>
                                    <div className="d-flex flex-wrap gap-2">
                                      {["Studio", ...bedrooms].map(
                                        (bedroom, index) => (
                                          <Button
                                            key={index}
                                            variant={
                                              selectedBedrooms.includes(bedroom)
                                                ? "success"
                                                : "outline-secondary"
                                            }
                                            className="btn-sm"
                                            onClick={() =>
                                              toggleSelection(
                                                bedroom,
                                                "bedroom"
                                              )
                                            }
                                          >
                                            {bedroom}
                                          </Button>
                                        )
                                      )}
                                    </div>
                                  </div>

                                  {/* Bathrooms Selection */}
                                  <div className="mt-3">
                                    <label className="fw-bold mb-2">
                                      {translation?.baths || "Baths"}
                                    </label>
                                    <div className="d-flex flex-wrap gap-2">
                                      {[1, 2, 3, 4, 5, "6+"].map(
                                        (bath, index) => (
                                          <Button
                                            key={index}
                                            variant={
                                              selectedBathrooms.includes(bath)
                                                ? "success"
                                                : "outline-secondary"
                                            }
                                            className="btn-sm"
                                            onClick={() =>
                                              toggleSelection(bath, "bathroom")
                                            }
                                          >
                                            {bath}
                                          </Button>
                                        )
                                      )}
                                    </div>
                                  </div>

                                  {/* Reset & Done Buttons */}
                                  <div className="d-flex justify-content-between mt-3">
                                    <Button
                                      variant="outline-secondary"
                                      onClick={resetSelection}
                                    >
                                      Reset
                                    </Button>
                                    <Button
                                      variant="primary"
                                      onClick={applySelection}
                                    >
                                      Done
                                    </Button>
                                  </div>
                                </Dropdown.Menu>
                              </Dropdown>
                            )}
                          </div>

                          <div className="d-grid d-sm-block text-center">
                            <button
                              type="button"
                              onClick={() => handleSearch()}
                              className="btn btn-primary"
                            >
                              {translation?.search || "Search"}
                            </button>
                          </div>
                        </div>
                      )}

                      {selectedTab === "rent" && (
                        <div
                          className="tab-pane fade active show"
                          id="pills-rent"
                          role="tabpanel"
                        >
                          <div className="row gx-3">
                            {/* Location Dropdown */}
                            <LocalityOption setLocationData={setLocationData} />

                            {/* Property Type List */}
                            <Dropdown
                              className="select-dropdown d-grid col-lg-6 col-12 mb-3"
                              show={showDropdown}
                              onToggle={(isOpen) => setShowDropdown(isOpen)}
                            >
                              <Dropdown.Toggle
                                className="btn-form-control"
                                id="dropdown-basic"
                              >
                                Residential
                              </Dropdown.Toggle>

                              <Dropdown.Menu className="p-3">
                                {/* Property Type Selection as Tabs */}
                                <div className="">
                                  <div className="form-field">
                                    <Nav
                                      variant="underline"
                                      activeKey={selectedPropertyType}
                                      onSelect={handlePropertyTypeChange}
                                    >
                                      {PropertyTypeData.map((type) => (
                                        <Nav.Item key={type.category_id}>
                                          <Nav.Link role="button" eventKey={type.category_id}>
                                            {type.category_name}
                                          </Nav.Link>
                                        </Nav.Item>
                                      ))}
                                    </Nav>
                                  </div>
                                </div>

                                {/* Property For Selection as Radio Buttons */}
                                <div className=" mt-3">
                                  <div className="form-field">
                                    <ButtonGroup className="btn-group-light d-flex flex-wrap">
                                      {PropertyForData.map(
                                        (property, index) => (
                                          <div
                                            key={property.sub_category_id}
                                            className="me-2 mb-2"
                                          >
                                            <input
                                              type="radio"
                                              className="btn-check"
                                              name="propertyForGroup"
                                              id={`propertyFor-${index}`}
                                              value={property.sub_category_id}
                                              checked={
                                                selectedPropertyFor ===
                                                property.sub_category_id
                                              }
                                              onChange={() =>
                                                handlePropertyForChange(
                                                  property.sub_category_id
                                                )
                                              }
                                            />
                                            <label
                                              className="btn btn-outline-light"
                                              htmlFor={`propertyFor-${index}`}
                                            >
                                              {property.sub_category_name}
                                            </label>
                                          </div>
                                        )
                                      )}
                                    </ButtonGroup>
                                  </div>
                                </div>

                                {/* Reset & Done Buttons */}
                                <div className="d-flex justify-content-between mt-3">
                                  <Button
                                    variant="outline-secondary"
                                    onClick={handleReset}
                                  >
                                    Reset
                                  </Button>
                                  <Button
                                    variant="primary"
                                    onClick={handleDone}
                                  >
                                    Done
                                  </Button>
                                </div>
                              </Dropdown.Menu>
                            </Dropdown>

                            {/* Budget Dropdown */}
                            <Dropdown
                              className="select-dropdown d-grid col-lg-4 col-12 mb-3"
                              show={BudgetDropdown}
                              onToggle={setBudgetDropdown}
                            >
                              {/* Dropdown Button */}
                              <Dropdown.Toggle
                                className="btn-form-control"
                                id="budget-dropdown"
                              >
                                {getDisplayText()}
                              </Dropdown.Toggle>

                              {/* Dropdown Menu */}
                              <Dropdown.Menu className="p-3 shadow bg-white rounded">
                                <div className="d-flex justify-content-between">
                                  <label>Minimum</label>
                                  <label>Maximum</label>
                                </div>
                                <div className="d-flex gap-2">
                                  <input
                                    type="number"
                                    className="form-control"
                                    placeholder="0"
                                    value={minBudget}
                                    onChange={handleMinChange}
                                  />
                                  <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Any"
                                    value={maxBudget}
                                    onChange={handleMaxChange}
                                  />
                                </div>

                                {/* Validation Message */}
                                {error && (
                                  <div className="text-danger mt-2">
                                    {error}
                                  </div>
                                )}

                                <div className="d-flex justify-content-between mt-3">
                                  <Button
                                    variant="outline-secondary"
                                    onClick={resetBudget}
                                  >
                                    Reset
                                  </Button>
                                  <Button
                                    variant="primary"
                                    onClick={applyBudget}
                                    disabled={!!error}
                                  >
                                    Done
                                  </Button>
                                </div>
                              </Dropdown.Menu>
                            </Dropdown>

                            {/* Size Dropdown */}
                            <Dropdown
                              show={showSizeDropdown}
                              onToggle={toggleSizeDropdown}
                              className="select-dropdown d-grid col-lg-4 col-12 mb-3"
                            >
                              <Dropdown.Toggle className="btn-form-control w-100 text-start">
                                {minSize || "Min"} - {maxSize || "Max"}
                              </Dropdown.Toggle>

                              <Dropdown.Menu className="p-3 shadow bg-white rounded">
                                <div className="d-flex justify-content-between">
                                  <label>{translation?.min || "Minimum"}</label>
                                  <label>{translation?.max || "Maximum"}</label>
                                </div>

                                {/* Min & Max Input Fields */}
                                <div className="d-flex gap-2">
                                  <input
                                    type="number"
                                    className="form-control"
                                    placeholder={translation?.min || "Min"}
                                    value={minSize}
                                    onChange={(e) => setMinSize(e.target.value)}
                                  />
                                  <input
                                    type="number"
                                    className="form-control"
                                    placeholder={translation?.max || "Max"}
                                    value={maxSize}
                                    onChange={(e) => setMaxSize(e.target.value)}
                                  />
                                </div>

                                {/* Reset & Done Buttons */}
                                <div className="d-flex justify-content-between mt-3">
                                  <Button
                                    variant="outline-secondary"
                                    onClick={resetSizes}
                                  >
                                    Reset
                                  </Button>
                                  <Button
                                    variant="primary"
                                    onClick={applySizes}
                                  >
                                    Done
                                  </Button>
                                </div>
                              </Dropdown.Menu>
                            </Dropdown>

                            {/* Bedrooms Dropdown */}
                            {selectedPropertyType !== "2" && (
                              <Dropdown className="select-dropdown d-grid col-lg-4 col-12 mb-3">
                                <Dropdown.Toggle className="btn-form-control w-100 text-start">
                                  {selectedBedrooms.length > 0
                                    ? selectedBedrooms.join(", ")
                                    : translation?.select_bedrooms ||
                                      "Select Beds"}
                                  {selectedBedrooms.length > 0 && " Beds"}/
                                  {selectedBathrooms.length > 0
                                    ? selectedBathrooms.join(", ")
                                    : translation?.selectedBathrooms ||
                                      "Select Baths"}
                                  {selectedBathrooms.length > 0 && " Baths"}
                                </Dropdown.Toggle>

                                <Dropdown.Menu className="p-3 shadow bg-white rounded">
                                  {/* Bedrooms Selection */}
                                  <div>
                                    <label className="fw-bold mb-2">
                                      {translation?.beds || "Beds"}
                                    </label>
                                    <div className="d-flex flex-wrap gap-1">
                                      {["Studio", ...bedrooms].map(
                                        (bedroom, index) => (
                                          <div
                                            key={index}
                                            className="form-check"
                                          >
                                            <input
                                              type="checkbox"
                                              id={`bedroom-${index}`}
                                              className="btn-check"
                                              checked={selectedBedrooms.includes(
                                                bedroom
                                              )}
                                              onChange={() =>
                                                toggleSelection(
                                                  bedroom,
                                                  "bedroom"
                                                )
                                              }
                                            />
                                            <label
                                              className="btn btn-outline-secondary"
                                              htmlFor={`bedroom-${index}`}
                                            >
                                              {bedroom}
                                            </label>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </div>

                                  {/* Bathrooms Selection */}
                                  <div className="mt-3">
                                    <label className="fw-bold mb-2">
                                      {translation?.baths || "Baths"}
                                    </label>
                                    <div className="d-flex flex-wrap gap-2">
                                      {[1, 2, 3, 4, 5,6,7, "8+"].map(
                                        (bath, index) => (
                                          <div
                                            key={index}
                                            className="form-check"
                                          >
                                            <input
                                              type="checkbox"
                                              id={`bathroom-${index}`}
                                              className="btn-check"
                                              checked={selectedBathrooms.includes(
                                                bath
                                              )}
                                              onChange={() =>
                                                toggleSelection(
                                                  bath,
                                                  "bathroom"
                                                )
                                              }
                                            />
                                            <label
                                              className="btn btn-outline-secondary"
                                              htmlFor={`bathroom-${index}`}
                                            >
                                              {bath}
                                            </label>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </div>

                                  {/* Reset & Done Buttons */}
                                  <div className="d-flex justify-content-between mt-3">
                                    <Button
                                      variant="outline-secondary"
                                      onClick={resetSelection}
                                    >
                                      Reset
                                    </Button>
                                    <Button
                                      variant="primary"
                                      onClick={applySelection}
                                    >
                                      Done
                                    </Button>
                                  </div>
                                </Dropdown.Menu>
                              </Dropdown>
                            )}
                          </div>

                          <div className="d-grid d-sm-block text-center">
                            <button
                              type="button"
                              className="btn btn-primary"
                              onClick={() => handleSearch()}
                            >
                              {translation?.search || "Search"}
                            </button>
                          </div>
                        </div>
                      )}

                      {selectedTab === "land" && (
                        <div
                          className="tab-pane fade active show"
                          id="pills-land"
                          role="tabpanel"
                        >
                          {/* Land Form */}
                          <div>{translation?.land_form || "Land Form"}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
};

export default Banner;
