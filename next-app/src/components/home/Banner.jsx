"use client";
import React, { useEffect, useState, useRef } from "react";
import AuthUser from "../Authentication/AuthUser";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import LocalityOption from "../MapData/LocalitySelector";

import "./home.css";

import {
  Form,
  Row,
  Col,
  Nav,
  Dropdown,
  ButtonGroup,
  Button,
} from "react-bootstrap";
import { useAuth } from "@/context/AuthProvider";


const Banner = ({ translation }) => {
  const { callApi } = AuthUser();
  const router = useRouter();
  const { currency } = useAuth();
  const [locationData, setLocationData] = useState(null);
  const [PropertyTypeData, setPropertyTypeData] = useState([]);
  const [PropertyForData, setPropertyForData] = useState([]);
  const [selectedTab, setSelectedTab] = useState("sale");
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
  const [selectedKitchens, setSelectedKitchens] = useState([]);
  const [showSizeDropdown, setShowSizeDropdown] = useState(false);
  const [minSize, setMinSize] = useState("");
  const [maxSize, setMaxSize] = useState("");
  const [subBudget1Dropdown, setSubBudget1Dropdown] = useState(false);
  const [subBudget2Dropdown, setSubBudget2Dropdown] = useState(false);
  const [bedroom, setBedroom] = useState([]);
  const [bathroom, setBathroom] = useState([]);
  const [kitchens, setKitchens] = useState([]);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [dropdownState, setDropdownState] = useState({});

  const toggleDropdown = (key) => {
    setDropdownState(prevState => {
      const newState = { ...prevState };
      if (!newState[key]) {
        newState[key] = true;
        setIsOverlayVisible(true); // Show overlay when dropdown is open
      } else {
        newState[key] = false;
        setIsOverlayVisible(false); // Hide overlay when dropdown is closed
      }

      // Close other dropdowns when one is opened
      Object.keys(newState).forEach(k => {
        if (k !== key) newState[k] = false;
      });

      return newState;
    });
  };

  const handleClickOutside = (e) => {
      setDropdownState({});
      setIsOverlayVisible(false);
  };

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
    } else if (type === "bathroom") {
      setSelectedBathrooms((prev) =>
        prev.includes(value)
          ? prev.filter((item) => item !== value)
          : [...prev, value]
      );
    } else if (type === "kitchen") {
      setSelectedKitchens((prev) =>
        prev.includes(value)
          ? prev.filter((item) => item !== value)
          : [...prev, value]
      );
    }
  };


  const resetSelection = () => {
    setSelectedBedrooms([]);
    setSelectedBathrooms([]);
    setSelectedKitchens([]);
    setBedDropdown(false);
    setBedroom([]);
    setBathroom([]);
    setKitchens([]);
  };

  const applySelection = () => {
    setBedDropdown(false);
  };

  const displayPropertyTyep = () => {
    let str = "";
  if (selectedPropertyType) {
    const category = PropertyTypeData.find(
      (item) => item.category_id === Number(selectedPropertyType)
    );
    if (category) {
      str = category.category_name;
    }
  }
  if (selectedPropertyFor) {
    const subCategory = PropertyForData?.find(
      (item) => item?.sub_category_id === Number(selectedPropertyFor)
    );
    if (subCategory) {
      str += str ? ` - ${subCategory.sub_category_name}` : subCategory.sub_category_name;
    }
  }
  return str || "Residential";
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

  const handleBedRoomChange = (value) => {
    setBedroom((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const handleBathChange = (value) => {
    setBathroom((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };
  const handleKitchenChange = (value) => {
    setKitchens((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
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
    if (minBudget && maxBudget) return `${currency}${minBudget} - ${currency}${maxBudget}`;
    if (minBudget) return `Min: ${currency}${minBudget}`;
    if (maxBudget) return `Max: ${currency}${maxBudget}`;
    return translation?.select_budget || "Select Budget";
  };

  const getDisplayAreaText = () => {
    if (minSize && maxSize) return `${minSize} - ${maxSize}`;
    if (minSize) return `Min: ${minSize}`;
    if (maxSize) return `Max: ${maxSize}`;
    return translation?.area_sqft || "Area (sqft)";
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
    setShowDropdown(false);
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
    if (minBudget) params.min_budget = minBudget;
    if (maxBudget) params.max_budget = maxBudget;
    if (bedroom && bedroom.length > 0)
      params.bedrooms = JSON.stringify(bedroom);
    if (bathroom && bathroom.length > 0)
      params.bathroom = JSON.stringify(bathroom);
    if (kitchens && kitchens.length > 0)
      params.kitchens = JSON.stringify(kitchens);

    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value)
    );

    const queryString = new URLSearchParams(filteredParams).toString();

    // Initialize searchData as an empty object
    let searchData = {};

    if (minSize && maxSize) {
      searchData = {
        ...searchData,
        min_carpet: minSize,
        max_carpet: maxSize,
      };
    }

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

  const bedrooms = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const displayBedsBathKitchen = () => {
    const beds = bedroom || [];
    const baths = bathroom || [];
    const kits = kitchens || [];

    // Convert arrays to a comma-separated string if they have values
    const bedsText = beds.length > 0 ? `${beds.join(", ")} Beds` : "";
    const bathsText = baths.length > 0 ? `${baths.join(", ")} Baths` : "";
    const kitchensText = kits.length > 0 ? `${kits.join(", ")} Kits` : "";

    // Combine all values with a separator
    const selections = [bedsText, bathsText, kitchensText]
      .filter(Boolean)
      .join(" / ");

    return (
      selections ||
      `${translation?.beds_baths_kitchens || "Select Beds, Baths & Kitchens"}`
    );
  };

  return (
    <React.Fragment>
      {isOverlayVisible && (
        <div
          className="page-overlay"
          style={{zIndex: 1}}
          onClick={handleClickOutside}
        ></div>
      )}
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
                            selectedTab === "sale" ? "active" : ""
                          }`}
                          onClick={() => handleTabChange("sale")}
                          type="button"
                          role="tab"
                        >
                          {translation?.buy || "Buy"}
                        </button>
                      </li>
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
                            selectedTab === "projects" ? "active" : ""
                          }`}
                          onClick={() => handleTabChange("projects")}
                          type="button"
                          role="tab"
                        >
                          {translation?.projects || "Projects"}
                        </button>
                      </li>
                    </ul>

                    <div className="tab-content" id="pills-tabContent">
                      {selectedTab === "sale" && (
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
                                translation={translation}
                              />
                            </div>

                            {/* Property Type List */}
                            <Col
                              className="col-lg-6 col-12"
                              data-id="parent"
                              // onClick={handlePropertyTypeDropDown}
                              onClick={() => toggleDropdown('property_type')}
                            >
                              <Dropdown
                                className="select-dropdown d-grid mb-3"
                                // show={showDropdown}
                                show={dropdownState?.property_type}
                              >
                                <Dropdown.Toggle
                                  className="btn-form-control"
                                  id="dropdown-basic"
                                >
                                  {displayPropertyTyep()}
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
                                                className="btn btn-outline-light btn-sm"
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
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleReset();
                                      }}
                                    >
                                      {translation?.reset || "Reset"}
                                    </Button>
                                    <Button
                                      variant="primary"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleClickOutside();
                                      }}
                                    >
                                      {translation?.done || "Done"}
                                    </Button>
                                  </div>
                                </Dropdown.Menu>
                              </Dropdown>
                            </Col>

                            {/* Budget Dropdown */}
                            <Col
                              className="col-lg-4 col-sm-6 col-12"
                              data-id="parent"
                              // onClick={handleBudgetDropDown}
                              onClick={() => toggleDropdown('budget')}
                            >
                              <Dropdown
                                className="select-dropdown d-grid mb-3"
                                // show={BudgetDropdown}
                                show={dropdownState?.budget}
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
                                        <Form.Label>
                                          {translation?.min || "Min"}
                                        </Form.Label>
                                        <input
                                          type="number"
                                          className="form-control"
                                          placeholder="00"
                                          value={minBudget}
                                          onChange={handleMinChange}
                                          onClick={(e) => {
                                            e.stopPropagation(); // Prevent the dropdown from closing
                                            setSubBudget1Dropdown(true);
                                          }}
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
                                              onClick={(e) =>{
                                                e.preventDefault();
                                                e.stopPropagation()
                                                handleBud1InputClick(amount)
                                              }
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
                                        <Form.Label>
                                          {translation?.max || "Max"}
                                        </Form.Label>
                                        <input
                                          type="number"
                                          className="form-control"
                                          placeholder="00"
                                          value={maxBudget}
                                          onChange={handleMaxChange}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault()
                                            setSubBudget2Dropdown(true);
                                          }}
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
                                              onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation()
                                                handleBud2InputClick(amount)
                                              }
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
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        resetBudget();
                                      }}
                                    >
                                      {translation?.reset || "Reset"}
                                    </Button>
                                    <Button
                                      variant="primary"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        applyBudget();
                                        // setBudgetDropdown(false); // Close the main dropdown when clicking Done
                                        handleClickOutside();
                                      }}
                                      disabled={!!error}
                                    >
                                      {translation?.done || "Done"}
                                    </Button>
                                  </div>
                                </Dropdown.Menu>
                              </Dropdown>
                            </Col>

                            {/* Size Dropdown */}
                            <Col className="col-lg-4 col-sm-6 col-12" onClick={() => toggleDropdown('area_size')}>
                              <Dropdown
                                // show={showSizeDropdown}
                                show={dropdownState?.area_size}
                                onToggle={toggleSizeDropdown}
                                className="select-dropdown d-grid mb-3"
                              >
                                <Dropdown.Toggle className="btn-form-control">
                                  {getDisplayAreaText()}
                                </Dropdown.Toggle>

                                <Dropdown.Menu className="p-3 shadow bg-white rounded">
                                  {/* Min & Max Input Fields */}
                                  <Row className="gx-2">
                                    <Col>
                                      <Form.Label>
                                        {translation?.min || "Min"}
                                      </Form.Label>
                                      <input
                                        type="number"
                                        className="form-control"
                                        placeholder={translation?.min || "Min"}
                                        value={minSize}
                                        onChange={(e) =>
                                          setMinSize(e.target.value)
                                        }
                                      />
                                    </Col>
                                    <Col>
                                      <Form.Label>
                                        {translation?.max || "Max"}
                                      </Form.Label>
                                      <input
                                        type="number"
                                        className="form-control"
                                        placeholder={translation?.max || "Max"}
                                        value={maxSize}
                                        onChange={(e) =>
                                          setMaxSize(e.target.value)
                                        }
                                      />
                                    </Col>
                                  </Row>

                                  {/* Reset & Done Buttons */}
                                  <div className="d-flex justify-content-between mt-3">
                                    <Button
                                      variant="outline-secondary"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        resetSizes();
                                      }}
                                    >
                                      {translation?.reset || "Reset"}
                                    </Button>
                                    <Button
                                      variant="primary"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleClickOutside();
                                        applySizes();
                                      }}
                                    >
                                      {translation?.done || "Done"}
                                    </Button>
                                  </div>
                                </Dropdown.Menu>
                              </Dropdown>
                            </Col>

                            {/* Bedrooms Dropdown */}
                            <Col className="col-lg-4 col-sm-6 col-12" onClick={() => toggleDropdown('bed_bath')}>
                              {selectedPropertyType !== "2" && (
                                <Dropdown
                                  className="select-dropdown d-grid mb-3"
                                  // show={BedDropdown}
                                  show={dropdownState?.bed_bath}
                                  onToggle={() => setBedDropdown(!BedDropdown)}
                                >
                                  <Dropdown.Toggle className="btn-form-control">
                                    {displayBedsBathKitchen()}
                                  </Dropdown.Toggle>

                                  <Dropdown.Menu className="p-3 shadow bg-white rounded">
                                    {/* Bedrooms Selection */}
                                    <div>
                                      <label className="fw-bold mb-2">
                                        {translation?.beds || "Beds"}
                                      </label>
                                      <ButtonGroup className="btn-group-light d-flex gap-2">
                                        {bedrooms.map((bedroomItem, index) => (
                                          <React.Fragment
                                            key={`bedroom-${index}`}
                                          >
                                            <input
                                              type="checkbox"
                                              id={`bedroom-${index}`}
                                              className="btn-check"
                                              value={bedroomItem}
                                              onChange={() =>
                                                handleBedRoomChange(bedroomItem)
                                              }
                                              checked={bedroom.includes(
                                                bedroomItem
                                              )}
                                            />
                                            <label
                                              className="btn btn-outline-light btn-sm"
                                              htmlFor={`bedroom-${index}`}
                                            >
                                              {bedroomItem}
                                            </label>
                                          </React.Fragment>
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
                                            <div key={`bathroom-${index}`}>
                                              <input
                                                type="checkbox"
                                                id={`bathroom-${index}`}
                                                className="btn-check"
                                                value={bath}
                                                onChange={() =>
                                                  handleBathChange(bath)
                                                }
                                                checked={bathroom?.includes(
                                                  bath
                                                )}
                                              />
                                              <label
                                                className="btn btn-outline-light btn-sm"
                                                htmlFor={`bathroom-${index}`}
                                              >
                                                {bath}
                                              </label>
                                            </div>
                                          )
                                        )}
                                      </ButtonGroup>
                                    </div>

                                    {/* Kitchen Selection */}
                                    <div className="mt-3">
                                      <label className="fw-bold mb-2">
                                        {translation?.kitchens || "Kitchens"}
                                      </label>
                                      <ButtonGroup className="btn-group-light d-flex gap-2">
                                        {[1, 2, 3, 4, 5].map(
                                          (kitchen, index) => (
                                            <div key={`kitchen-${index}`}>
                                              <input
                                                type="checkbox"
                                                id={`kitchen-${index}`}
                                                className="btn-check"
                                                value={kitchen}
                                                onChange={() =>
                                                  handleKitchenChange(kitchen)
                                                }
                                                checked={kitchens?.includes(
                                                  kitchen
                                                )}
                                              />
                                              <label
                                                className="btn btn-outline-light btn-sm"
                                                htmlFor={`kitchen-${index}`}
                                              >
                                                {kitchen}
                                              </label>
                                            </div>
                                          )
                                        )}
                                      </ButtonGroup>
                                    </div>

                                    {/* Reset & Done Buttons */}
                                    <div className="d-flex justify-content-between mt-3">
                                      <Button
                                        variant="outline-secondary"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          resetSelection();
                                        }}
                                      >
                                        {translation?.reset || "Reset"}
                                      </Button>
                                      <Button
                                        variant="primary"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          applySelection();
                                          handleClickOutside();
                                        }}
                                      >
                                        {translation?.done || "Done"}
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
                                translation={translation}
                              />
                            </div>

                            {/* Property Type List */}
                            <Col
                              className="col-lg-6 col-12"
                              data-id="parent"
                              // onClick={handlePropertyTypeDropDown}
                              onClick={() => toggleDropdown('property_type')}
                            >
                              <Dropdown
                                className="select-dropdown d-grid mb-3"
                                // show={showDropdown}
                                show={dropdownState?.property_type}
                              >
                                <Dropdown.Toggle
                                  className="btn-form-control"
                                  id="dropdown-basic"
                                >
                                  {displayPropertyTyep()}
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
                                                className="btn btn-outline-light btn-sm"
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
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleReset();
                                      }}
                                    >
                                      {translation?.reset || "Reset"}
                                    </Button>
                                    <Button
                                      variant="primary"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleClickOutside();
                                      }}
                                    >
                                      {translation?.done || "Done"}
                                    </Button>
                                  </div>
                                </Dropdown.Menu>
                              </Dropdown>
                            </Col>

                            {/* Budget Dropdown */}
                            <Col
                              className="col-lg-4 col-sm-6 col-12"
                              data-id="parent"
                              // onClick={handleBudgetDropDown}
                              onClick={() => toggleDropdown('budget')}
                            >
                              <Dropdown
                                className="select-dropdown d-grid mb-3"
                                // show={BudgetDropdown}
                                show={dropdownState?.budget}
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
                                        <Form.Label>
                                          {translation?.min || "Min"}
                                        </Form.Label>
                                        <input
                                          type="number"
                                          className="form-control"
                                          placeholder="00"
                                          value={minBudget}
                                          onChange={handleMinChange}
                                          onClick={(e) => {
                                            e.stopPropagation(); // Prevent the dropdown from closing
                                            setSubBudget1Dropdown(true);
                                          }}
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
                                        <Form.Label>
                                          {translation?.max || "Max"}
                                        </Form.Label>
                                        <input
                                          type="number"
                                          className="form-control"
                                          placeholder="00"
                                          value={maxBudget}
                                          onChange={handleMaxChange}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setSubBudget2Dropdown(true);
                                          }}
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
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        resetBudget();
                                      }}
                                    >
                                      {translation?.reset || "Reset"}
                                    </Button>
                                    <Button
                                      variant="primary"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleClickOutside();
                                        // applyBudget();
                                        // setBudgetDropdown(false);
                                      }}
                                      disabled={!!error}
                                    >
                                      {translation?.done || "Done"}
                                    </Button>
                                  </div>
                                </Dropdown.Menu>
                              </Dropdown>
                            </Col>

                            {/* Size Dropdown */}
                            <Col className="col-lg-4 col-sm-6 col-12" onClick={() => toggleDropdown('area')}>
                              <Dropdown
                                // show={showSizeDropdown}
                                show={dropdownState?.area}
                                onToggle={toggleSizeDropdown}
                                className="select-dropdown d-grid mb-3"
                              >
                                <Dropdown.Toggle className="btn-form-control">
                                  {getDisplayAreaText()}
                                </Dropdown.Toggle>

                                <Dropdown.Menu className="p-3 shadow bg-white rounded">
                                  <div className="d-flex justify-content-between">
                                    <label>
                                      {translation?.min || "Min sqft"}
                                    </label>
                                    <label>
                                      {translation?.max || "Max sqft"}
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
                                      onClick={(e) => e.stopPropagation()}
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
                                      onClick={(e) => e.stopPropagation()}
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
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        resetSizes();
                                      }}
                                    >
                                      {translation?.reset || "Reset"}
                                    </Button>
                                    <Button
                                      variant="primary"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleClickOutside();
                                      }}
                                    >
                                      {translation?.done || "Done"}
                                    </Button>
                                  </div>
                                </Dropdown.Menu>
                              </Dropdown>
                            </Col>

                            {/* Bedrooms Dropdown */}
                            <Col className="col-lg-4 col-sm-6 col-12" onClick={(e) => toggleDropdown('beds_bath')}>
                              {selectedPropertyType !== "2" && (
                                <Dropdown
                                  className="select-dropdown d-grid mb-3"
                                  show={dropdownState?.beds_bath}
                                  onToggle={() => setBedDropdown(!BedDropdown)}
                                >
                                  <Dropdown.Toggle className="btn-form-control">
                                    {displayBedsBathKitchen()}
                                  </Dropdown.Toggle>

                                  <Dropdown.Menu className="p-3 shadow bg-white rounded">
                                    {/* Bedrooms Selection */}
                                    <div>
                                      <label className="fw-bold mb-2">
                                        {translation?.beds || "Beds"}
                                      </label>
                                      <ButtonGroup className="btn-group-light d-flex gap-2">
                                        {bedrooms.map((bedroomItem, index) => (
                                          <React.Fragment
                                            key={`bedroom-${index}`}
                                          >
                                            <input
                                              type="checkbox"
                                              id={`bedroom-${index}`}
                                              className="btn-check"
                                              value={bedroomItem}
                                              onChange={() =>
                                                handleBedRoomChange(bedroomItem)
                                              }
                                              checked={bedroom.includes(
                                                bedroomItem
                                              )}
                                            />
                                            <label
                                              className="btn btn-outline-light btn-sm"
                                              htmlFor={`bedroom-${index}`}
                                            >
                                              {bedroomItem}
                                            </label>
                                          </React.Fragment>
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
                                            <div key={`bathroom-${index}`}>
                                              <input
                                                type="checkbox"
                                                id={`bathroom-${index}`}
                                                className="btn-check"
                                                value={bath}
                                                onChange={() =>
                                                  handleBathChange(bath)
                                                }
                                                checked={bathroom?.includes(
                                                  bath
                                                )}
                                              />
                                              <label
                                                className="btn btn-outline-light btn-sm"
                                                htmlFor={`bathroom-${index}`}
                                              >
                                                {bath}
                                              </label>
                                            </div>
                                          )
                                        )}
                                      </ButtonGroup>
                                    </div>
                                    {/* Kitchen Selection */}
                                    <div className="mt-3">
                                      <label className="fw-bold mb-2">
                                        {translation?.kitchens || "Kitchens"}
                                      </label>
                                      <ButtonGroup className="btn-group-light d-flex gap-2">
                                        {[1, 2, 3, 4, 5].map(
                                          (kitchen, index) => (
                                            <div key={`kitchen-${index}`}>
                                              <input
                                                type="checkbox"
                                                id={`kitchen-${index}`}
                                                className="btn-check"
                                                value={kitchen}
                                                onChange={() =>
                                                  handleKitchenChange(kitchen)
                                                }
                                                checked={kitchens?.includes(
                                                  kitchen
                                                )}
                                              />
                                              <label
                                                className="btn btn-outline-light btn-sm"
                                                htmlFor={`kitchen-${index}`}
                                              >
                                                {kitchen}
                                              </label>
                                            </div>
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
                                        {translation?.reset || "Reset"}
                                      </Button>
                                      <Button
                                        variant="primary"
                                        onClick={applySelection}
                                      >
                                        {translation?.done || "Done"}
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
