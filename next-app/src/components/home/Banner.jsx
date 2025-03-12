"use client";
import React, { useEffect, useState, useRef } from "react";
import AuthUser from "../Authentication/AuthUser";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import LocalityOption from "../MapData/LocalitySelector";
import useTranslation from "../../hooks/useTranslation";

import {
  Form,
  Row,
  Col,
  Nav,
  Dropdown,
  ButtonGroup,
  Button,
} from "react-bootstrap";
import { Maximize } from "lucide-react";

const bedrooms = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

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
  const [gender, setGender] = useState("");
  const [showBedParking, setShowBedParking] = useState(true);
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
  const [subBudget1Dropdown, setSubBudget1Dropdown] = useState(false);
  const [subBudget2Dropdown, setSubBudget2Dropdown] = useState(false);

  const handleBud1InputClick = (amount) => {
    setMinBudget(amount);
    setSubBudget1Dropdown((prevState) => !prevState);
  };

  const handleBud2InputClick = (amount) => {
    setMaxBudget(amount);
    setSubBudget2Dropdown((prevState) => !prevState);
  };

  const toggleSizeDropdown = (isOpen) => setShowSizeDropdown(isOpen);

  const resetSizes = () => {
    setMinSize("");
    setMaxSize("");
  };

  const applySizes = () => {
    setShowSizeDropdown(false);
  };

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
    setBedDropdown(false);
  };

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
    setSubBudget1Dropdown(false);
  };

  const handleMaxChange = (e) => {
    const value = e.target.value;
    setMaxBudget(value);
    if (minBudget && Number(value) < Number(minBudget)) {
      setError("Max budget cannot be less than min budget.");
    } else {
      setError("");
    }
    setSubBudget2Dropdown(false);
  };

  const resetBudget = () => {
    setMinBudget("");
    setMaxBudget("");
    setError("");
    setBudgetDropdown(false);
  };

  const applyBudget = () => {
    if (!error) {
      setBudgetDropdown(false);
    }
  };

  const getDisplayText = () => {
    if (minBudget && maxBudget) return `$${minBudget} - $${maxBudget}`;
    if (minBudget) return `Min: $${minBudget}`;
    if (maxBudget) return `Max: $${maxBudget}`;
    return "Select Budget";
  };

  const getDisplayAreaText = () => {
    if (minSize && maxSize) return `$${minSize} - $${maxSize}`;
    if (minSize) return `Min: $${minSize}`;
    if (maxSize) return `Max: $${maxSize}`;
    return "Area (sqft)";
  };

  const handlePropertyTypeChange = (eventKey, e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedPropertyType(eventKey);

    // Force the dropdown to stay open
    setTimeout(() => {
      setPropertyTypeDropDown(true);
    }, 0);
  };

  const handleReset = () => {
    setSelectedPropertyType("");
    setSelectedPropertyFor("");
    setShowDropdown(false);
  };

  const handleDone = () => {
    setShowDropdown(false); // Close dropdown
  };

  const handlePropertyForChange = (selectedValue) => {
    setSelectedPropertyFor(selectedValue);
    setShowDropdown(!showDropdown);
  };

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
    if (gender) params.gender = gender;
    if (locationData) {
      params.location_data = JSON.stringify(locationData);
    }
    if (selectedPropertyType) params.property_type = selectedPropertyType;
    if (selectedPropertyFor) params.property_for = selectedPropertyFor;

    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value)
    );

    const queryString = new URLSearchParams(filteredParams).toString();

    // Initialize searchData as an empty object
    let searchData = {};

    if (minBudget && maxBudget) {
      searchData = {
        ...searchData,
        min_budget: minBudget,
        max_budget: maxBudget,
      };
    }

    if (minSize && maxSize) {
      searchData = {
        ...searchData,
        min_carpet: minSize,
        max_carpet: maxSize,
      };
    }

    if (selectedBedrooms.length > 0) {
      searchData = {
        ...searchData,
        bedrooms: selectedBedrooms,
      };
    }

    if (selectedBathrooms.length > 0) {
      searchData = {
        ...searchData,
        bathroom: selectedBathrooms,
      };
    }

    // Construct final URL with or without searchData
    return `/property-listing?${queryString}${
      Object.keys(searchData).length
        ? `&searchData=${JSON.stringify(searchData)}`
        : ""
    }`;
  };

  const handleSearch = () => {
    const url = buildSearchUrl();
    router.push(url);
  };

  const handlePropertyTypeDropDown = (e) => {
    if (e.currentTarget.getAttribute("data-id") === "parent") {
      setShowDropdown(!showDropdown);
    }
  };

  const handleBudgetDropDown = (e) => {
    if (e.currentTarget.getAttribute("data-id") === "parent") {
      setBudgetDropdown(!BudgetDropdown);
    }
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
                <div className="col-xl-9 col-lg-11 col-12">
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
                          id="pills-rent"
                          role="tabpanel"
                        >
                          <div className="row gx-3">
                            {/* Location Dropdown */}
                            <div className="col-lg-6 col-12">
                              <LocalityOption
                                setLocationData={setLocationData}
                              />
                            </div>

                            {/* Property Type List */}
                            <Col
                              className="col-lg-6 col-12"
                              data-id="parent"
                              onClick={handlePropertyTypeDropDown}
                            >
                              <Dropdown
                                className="select-dropdown d-grid mb-3"
                                show={showDropdown}
                              >
                                <Dropdown.Toggle
                                  className="btn-form-control"
                                  id="dropdown-basic"
                                >
                                  Residential
                                </Dropdown.Toggle>

                                <Dropdown.Menu className="p-3">
                                  {/* Property Type Selection as Tabs */}

                                  <div className="form-field">
                                    <Nav
                                      variant="underline"
                                      activeKey={selectedPropertyType}
                                      onSelect={handlePropertyTypeChange}
                                    >
                                      {PropertyTypeData.map((type) => (
                                        <Nav.Item key={type.category_id}>
                                          <Nav.Link
                                            role="button"
                                            eventKey={type.category_id}
                                          >
                                            {type.category_name}
                                          </Nav.Link>
                                        </Nav.Item>
                                      ))}
                                    </Nav>
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
                                                readOnly={false}
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
                            </Col>

                            {/* Budget Dropdown */}
                            <Col
                              className="col-lg-4 col-sm-6 col-12"
                              data-id="parent"
                              onClick={handleBudgetDropDown}
                            >
                              <Dropdown
                                className="select-dropdown d-grid mb-3"
                                show={BudgetDropdown}
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
                                  <Row className="gx-2">
                                    {/* Minimum Budget */}
                                    <Col className="col-6">
                                      <Form.Group className="dropdown minMax">
                                        <Form.Label>Minimum</Form.Label>
                                        <input
                                          type="number"
                                          className="form-control"
                                          placeholder="00"
                                          value={minBudget}
                                          onChange={handleMinChange}
                                          onClick={() =>
                                            setSubBudget1Dropdown(true)
                                          } // Show dropdown on click
                                        />
                                        <Dropdown.Menu
                                          style={{
                                            display: subBudget1Dropdown
                                              ? "block"
                                              : "none",
                                            marginTop: "32px",
                                          }}
                                        >
                                          {budgetOptions.map((amount) => (
                                            <Dropdown.Item
                                              key={amount}
                                              onClick={() =>
                                                handleBud1InputClick(amount)
                                              }
                                            >
                                              ${amount}
                                            </Dropdown.Item>
                                          ))}
                                        </Dropdown.Menu>
                                      </Form.Group>
                                    </Col>

                                    {/* Maximum Budget */}
                                    <Col className="col-6">
                                      <Form.Group className="dropdown minMax">
                                        <Form.Label>Maximum</Form.Label>
                                        <input
                                          type="number"
                                          className="form-control"
                                          placeholder="00"
                                          value={maxBudget}
                                          onChange={handleMaxChange}
                                          onClick={() =>
                                            setSubBudget2Dropdown(true)
                                          } // Show dropdown on click
                                        />
                                        <Dropdown.Menu
                                          style={{
                                            display: subBudget2Dropdown
                                              ? "block"
                                              : "none",
                                            marginTop: "32px",
                                          }}
                                        >
                                          {budgetOptions.map((amount) => (
                                            <Dropdown.Item
                                              key={amount}
                                              onClick={() =>
                                                handleBud2InputClick(amount)
                                              }
                                            >
                                              ${amount}
                                            </Dropdown.Item>
                                          ))}
                                        </Dropdown.Menu>
                                      </Form.Group>
                                    </Col>
                                  </Row>

                                  {/* Validation Message */}
                                  {error && (
                                    <div className="text-danger mt-2">
                                      {error}
                                    </div>
                                  )}

                                  {/* Buttons */}
                                  <div className="d-flex justify-content-between mt-3">
                                    <Button
                                      variant="outline-secondary"
                                      onClick={resetBudget}
                                    >
                                      Reset
                                    </Button>
                                    <Button
                                      variant="primary"
                                      onClick={() => {
                                        applyBudget();
                                        setBudgetDropdown(false); // Close the main dropdown when clicking Done
                                      }}
                                      disabled={!!error}
                                    >
                                      Done
                                    </Button>
                                  </div>
                                </Dropdown.Menu>
                              </Dropdown>
                            </Col>

                            {/* Size Dropdown */}
                            <Col className="col-lg-4 col-sm-6 col-12">
                              <Dropdown
                                show={showSizeDropdown}
                                onToggle={toggleSizeDropdown}
                                className="select-dropdown d-grid mb-3"
                              >
                                <Dropdown.Toggle className="btn-form-control">
                                  {getDisplayAreaText()}
                                </Dropdown.Toggle>

                                <Dropdown.Menu className="p-3 shadow bg-white rounded">
                                  <div className="d-flex justify-content-between">
                                    <label>
                                      {translation?.min || "Minimum"}
                                    </label>
                                    <label>
                                      {translation?.max || "Maximum"}
                                    </label>
                                  </div>

                                  {/* Min & Max Input Fields */}
                                  <div className="d-flex gap-2">
                                    <input
                                      type="number"
                                      className="form-control"
                                      placeholder={translation?.min || "Min"}
                                      value={minSize}
                                      onChange={(e) =>
                                        setMinSize(e.target.value)
                                      }
                                    />
                                    <input
                                      type="number"
                                      className="form-control"
                                      placeholder={translation?.max || "Max"}
                                      value={maxSize}
                                      onChange={(e) =>
                                        setMaxSize(e.target.value)
                                      }
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
                            </Col>

                            {/* Bedrooms Dropdown */}
                            <Col className="col-lg-4 col-sm-6 col-12">
                              {selectedPropertyType !== "2" && (
                                <Dropdown
                                  className="select-dropdown d-grid mb-3"
                                  show={BedDropdown}
                                  onToggle={() => setBedDropdown(!BedDropdown)}
                                >
                                  <Dropdown.Toggle className="btn-form-control">
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
                                      <ButtonGroup className="btn-group-light d-flex gap-2">
                                        {[...bedrooms].map((bedroom, index) => (
                                          <>
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
                                              readOnly={false}
                                            />
                                            <label
                                              className="btn btn-outline-light btn-sm"
                                              htmlFor={`bedroom-${index}`}
                                            >
                                              {bedroom}
                                            </label>
                                          </>
                                        ))}
                                      </ButtonGroup>
                                    </div>

                                    {/* Bathrooms Selection */}
                                    <div className="mt-3">
                                      <label className="fw-bold mb-2">
                                        {translation?.baths || "Baths"}
                                      </label>
                                      <ButtonGroup className="btn-group-light d-flex gap-2">
                                        {[1, 2, 3, 4, 5, 6, 7, "8+"].map(
                                          (bath, index) => (
                                            <>
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
                                                readOnly={false}
                                              />
                                              <label
                                                className="btn btn-outline-light btn-sm"
                                                htmlFor={`bathroom-${index}`}
                                              >
                                                {bath}
                                              </label>
                                            </>
                                          )
                                        )}
                                      </ButtonGroup>
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
                            </Col>
                            {/* {selectedPropertyType !== "2" && (
                            <Col className="col-lg-2 col-sm-6 col-12">
                                            <Form.Select
                                              // className={`${error.possession_status ? "is-invalid" : ""}`}
                                              name="possession_status"
                                              // value={filters.possession_status}
                                              onChange={'handleInputChange'}
                                            >
                                              <option value="">
                                                {translation?.select_possession_status ||
                                                  "Select Possession Status"}
                                              </option>
                                              {possessionData.map((option) => (
                                                <option key={option.status_id} value={option.status_id}>
                                                  {option.status_name}
                                                </option>
                                              ))}
                                            </Form.Select>
                                          </Col>
                                           )} */}
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

                      {selectedTab === "rent" && (
                        <div
                          className="tab-pane fade active show"
                          id="pills-rent"
                          role="tabpanel"
                        >
                          <div className="row gx-3">
                            {/* Location Dropdown */}
                            <div className="col-lg-6 col-12">
                              <LocalityOption
                                setLocationData={setLocationData}
                              />
                            </div>

                            {/* Property Type List */}
                            <Col
                              className="col-lg-6 col-12"
                              data-id="parent"
                              onClick={handlePropertyTypeDropDown}
                            >
                              <Dropdown
                                className="select-dropdown d-grid mb-3"
                                show={showDropdown}
                              >
                                <Dropdown.Toggle
                                  className="btn-form-control"
                                  id="dropdown-basic"
                                >
                                  Residential
                                </Dropdown.Toggle>

                                <Dropdown.Menu className="p-3">
                                  {/* Property Type Selection as Tabs */}

                                  <div className="form-field">
                                    <Nav
                                      variant="underline"
                                      activeKey={selectedPropertyType}
                                      onSelect={handlePropertyTypeChange}
                                    >
                                      {PropertyTypeData.map((type) => (
                                        <Nav.Item key={type.category_id}>
                                          <Nav.Link
                                            role="button"
                                            eventKey={type.category_id}
                                          >
                                            {type.category_name}
                                          </Nav.Link>
                                        </Nav.Item>
                                      ))}
                                    </Nav>
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
                                                readOnly={false}
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
                            </Col>

                            {/* Budget Dropdown */}
                            <Col className="col-lg-4 col-sm-6 col-12">
                              <Dropdown
                                className="select-dropdown d-grid mb-3"
                                show={BudgetDropdown}
                                onToggle={toggleBudgetDropdown}
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
                                  <Row className="gx-2">
                                    {/* Minimum Budget */}
                                    <Col className="col-6">
                                      <Form.Group className="dropdown minMax">
                                        <Form.Label>Minimum</Form.Label>
                                        <input
                                          type="number"
                                          className="form-control"
                                          placeholder="00"
                                          value={minBudget}
                                          onChange={handleMinChange}
                                          onClick={() =>
                                            setSubBudget1Dropdown(true)
                                          } // Show dropdown on click
                                        />
                                        <Dropdown.Menu
                                          style={{
                                            display: subBudget1Dropdown
                                              ? "block"
                                              : "none",
                                            marginTop: "32px",
                                          }}
                                        >
                                          {budgetOptions.map((amount) => (
                                            <Dropdown.Item
                                              key={amount}
                                              onClick={() =>
                                                handleBud1InputClick(amount)
                                              }
                                            >
                                              ${amount}
                                            </Dropdown.Item>
                                          ))}
                                        </Dropdown.Menu>
                                      </Form.Group>
                                    </Col>

                                    {/* Maximum Budget */}
                                    <Col className="col-6">
                                      <Form.Group className="dropdown minMax">
                                        <Form.Label>Maximum</Form.Label>
                                        <input
                                          type="number"
                                          className="form-control"
                                          placeholder="00"
                                          value={maxBudget}
                                          onChange={handleMaxChange}
                                          onClick={() =>
                                            setSubBudget2Dropdown(true)
                                          } // Show dropdown on click
                                        />
                                        <Dropdown.Menu
                                          style={{
                                            display: subBudget2Dropdown
                                              ? "block"
                                              : "none",
                                            marginTop: "32px",
                                          }}
                                        >
                                          {budgetOptions.map((amount) => (
                                            <Dropdown.Item
                                              key={amount}
                                              onClick={() =>
                                                handleBud2InputClick(amount)
                                              }
                                            >
                                              ${amount}
                                            </Dropdown.Item>
                                          ))}
                                        </Dropdown.Menu>
                                      </Form.Group>
                                    </Col>
                                  </Row>

                                  {/* Validation Message */}
                                  {error && (
                                    <div className="text-danger mt-2">
                                      {error}
                                    </div>
                                  )}

                                  {/* Buttons */}
                                  <div className="d-flex justify-content-between mt-3">
                                    <Button
                                      variant="outline-secondary"
                                      onClick={resetBudget}
                                    >
                                      Reset
                                    </Button>
                                    <Button
                                      variant="primary"
                                      onClick={() => {
                                        applyBudget();
                                        setBudgetDropdown(false); // Close the main dropdown when clicking Done
                                      }}
                                      disabled={!!error}
                                    >
                                      Done
                                    </Button>
                                  </div>
                                </Dropdown.Menu>
                              </Dropdown>
                            </Col>

                            {/* Size Dropdown */}
                            <Col className="col-lg-4 col-sm-6 col-12">
                              <Dropdown
                                show={showSizeDropdown}
                                onToggle={toggleSizeDropdown}
                                className="select-dropdown d-grid mb-3"
                              >
                                <Dropdown.Toggle className="btn-form-control">
                                  {getDisplayAreaText()}
                                </Dropdown.Toggle>

                                <Dropdown.Menu className="p-3 shadow bg-white rounded">
                                  <div className="d-flex justify-content-between">
                                    <label>
                                      {translation?.min || "Minimum sqft"}
                                    </label>
                                    <label>
                                      {translation?.max || "Maximum sqft"}
                                    </label>
                                  </div>

                                  {/* Min & Max Input Fields */}
                                  <div className="d-flex gap-2">
                                    <input
                                      type="number"
                                      className="form-control"
                                      placeholder={
                                        translation?.min || "Min sqft"
                                      }
                                      value={minSize}
                                      onChange={(e) =>
                                        setMinSize(e.target.value)
                                      }
                                    />
                                    <input
                                      type="number"
                                      className="form-control"
                                      placeholder={
                                        translation?.max || "Max sqft"
                                      }
                                      value={maxSize}
                                      onChange={(e) =>
                                        setMaxSize(e.target.value)
                                      }
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
                            </Col>

                            {/* Bedrooms Dropdown */}
                            <Col className="col-lg-4 col-sm-6 col-12">
                              {selectedPropertyType !== "2" && (
                                <Dropdown
                                  className="select-dropdown d-grid mb-3"
                                  show={BedDropdown}
                                  onToggle={() => setBedDropdown(!BedDropdown)}
                                >
                                  <Dropdown.Toggle className="btn-form-control">
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
                                      <ButtonGroup className="btn-group-light d-flex gap-2">
                                        {[...bedrooms].map((bedroom, index) => (
                                          <>
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
                                              readOnly={false}
                                            />
                                            <label
                                              className="btn btn-outline-light btn-sm"
                                              htmlFor={`bedroom-${index}`}
                                            >
                                              {bedroom}
                                            </label>
                                          </>
                                        ))}
                                      </ButtonGroup>
                                    </div>

                                    {/* Bathrooms Selection */}
                                    <div className="mt-3">
                                      <label className="fw-bold mb-2">
                                        {translation?.baths || "Baths"}
                                      </label>
                                      <ButtonGroup className="btn-group-light d-flex gap-2">
                                        {[1, 2, 3, 4, 5, 6, 7, "8+"].map(
                                          (bath, index) => (
                                            <>
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
                                                readOnly={false}
                                              />
                                              <label
                                                className="btn btn-outline-light btn-sm"
                                                htmlFor={`bathroom-${index}`}
                                              >
                                                {bath}
                                              </label>
                                            </>
                                          )
                                        )}
                                      </ButtonGroup>
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
                            </Col>
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
