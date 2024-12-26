"use client";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import Link from "next/link";
import AuthUser from "../Authentication/AuthUser";
import { toast } from "react-toastify";

const budgets = [
    { key: 1, name: "$99 - $199" },
    { key: 2, name: "$200 - $300" },
    { key: 3, name: "$301 - $499" },
    { key: 4, name: "$500 - $999" },
    { key: 5, name: "Above $1000" },
];

const sizes = [
    { key: 1, name: "0 - 250 sq ft" },
    { key: 2, name: "251 sq ft - 350 sq ft" },
    { key: 3, name: "351 sq ft - 500 sq ft" },
    { key: 4, name: "501 sq ft - 1000 sq ft" },
    { key: 5, name: "Above 1000 sq ft" },
];

const bedrooms = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const parkingOptions = [
    { slug: "available", name: "Available" },
    { slug: "not-available", name: "Not Available" },
];

const Banner = () => {
    const { callApi } = AuthUser();
    const [locationData, setLocationData] = useState([]);
    const [PropertyTypeData, setPropertyTypeData] = useState([]);
    const [PropertyForData, setPropertyForData] = useState([]);
    const [selectedTab, setSelectedTab] = useState("buy");
    const [selectedLocation, setSelectedLocation] = useState([]);
    const [selectedPropertyType, setSelectedPropertyType] = useState("");
    const [selectedPropertyFor, setSelectedPropertyFor] = useState("");
    const [selectedBudget, setSelectedBudget] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedBedrooms, setSelectedBedrooms] = useState("");
    const [selectedParking, setSelectedParking] = useState("");

    const handleLocationChange = (selected) => setSelectedLocation(selected);
    const handlePropertyTypeChange = (event) =>
        setSelectedPropertyType(event.target.value);
    const handlePropertyForChange = (event) =>
        setSelectedPropertyFor(event.target.value);
    const handleBudgetChange = (event) => setSelectedBudget(event.target.value);
    const handleSizeChange = (event) => setSelectedSize(event.target.value);
    const handleBedroomsChange = (event) =>
        setSelectedBedrooms(event.target.value);
    const handleParkingChange = (event) =>
        setSelectedParking(event.target.value);

    useEffect(() => {
        FetchLocationData();
        FetchPropertyTypeData();
    }, []);

    useEffect(() => {
      if (selectedPropertyType) {
          FetchPropertyForData();
      }
  }, [selectedPropertyType]);

    const FetchLocationData = async () => {
        let response;
        try {
            response = await callApi({
                api: `/get_property_cities`,
                method: "GET",
            });
            if (response && response.data) {
              setLocationData(response.data);
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error(response.message);
        }
    };

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

    console.log(PropertyForData)

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

    const handleTabChange = (tab) => setSelectedTab(tab);

    const availablelocationData = locationData.filter(
        (location) =>
            !selectedLocation.find(
                (selected) => selected.city_id === location.city_id
            )
    );

    const buildSearchUrl = () => {
        const params = {
            post_for: selectedTab,
            city_id: selectedLocation.map((loc) => loc.city_id).join(","),
            property_type: selectedPropertyType,
            property_for: selectedPropertyFor,
            property_budget: selectedBudget,
            property_size: selectedSize,
            bedrooms: selectedBedrooms,
            parking: selectedParking,
        };

        const filteredParams = Object.entries(params).filter(
            ([key, value]) => value
        );
        const queryString = new URLSearchParams(filteredParams).toString();

        return `/property-listing?${queryString}`;
    };

    return (
        <React.Fragment>
            <div className="clearfix"></div>
            <section
                className="banner"
                style={{ backgroundImage: "url('assets/images/banner-1.jpg')" }}
            >
                <div className="banner-layer">
                    <div
                        className="transparent-header-spacer"
                        style={{ height: "50px" }}
                    ></div>
                    <div className="container">
                        <div className="banner-form">
                            <div className="row justify-content-center align-items-center">
                                <div className="col-lg-8 col-12">
                                    <div className="headline">
                                        <h1>Search A Home Which You’ll Love</h1>
                                    </div>
                                    <div className="search-form">
                                        <ul
                                            className="nav nav-pills nav-justified"
                                            id="pills-tab"
                                            role="tablist"
                                        >
                                            <li
                                                className="nav-item"
                                                role="presentation"
                                            >
                                                <button
                                                    className={`nav-link ${
                                                        selectedTab === "buy"
                                                            ? "active"
                                                            : ""
                                                    }`}
                                                    onClick={() =>
                                                        handleTabChange("buy")
                                                    }
                                                    type="button"
                                                    role="tab"
                                                >
                                                    Buy
                                                </button>
                                            </li>
                                            <li
                                                className="nav-item"
                                                role="presentation"
                                            >
                                                <button
                                                    className={`nav-link ${
                                                        selectedTab === "rent"
                                                            ? "active"
                                                            : ""
                                                    }`}
                                                    onClick={() =>
                                                        handleTabChange("rent")
                                                    }
                                                    type="button"
                                                    role="tab"
                                                >
                                                    Rent
                                                </button>
                                            </li>
                                            {/* <li
                                                className="nav-item"
                                                role="presentation"
                                            >
                                                <button
                                                    className={`nav-link ${
                                                        selectedTab === "land"
                                                            ? "active"
                                                            : ""
                                                    }`}
                                                    onClick={() =>
                                                        handleTabChange("land")
                                                    }
                                                    type="button"
                                                    role="tab"
                                                >
                                                    Land
                                                </button>
                                            </li> */}
                                            <li
                                                className="nav-item"
                                                role="presentation"
                                            >
                                                <button
                                                    className={`nav-link ${
                                                        selectedTab ===
                                                        "commercial"
                                                            ? "active"
                                                            : ""
                                                    }`}
                                                    onClick={() =>
                                                        handleTabChange(
                                                            "commercial"
                                                        )
                                                    }
                                                    type="button"
                                                    role="tab"
                                                >
                                                    Commercial
                                                </button>
                                            </li>
                                        </ul>

                                        <div
                                            className="tab-content"
                                            id="pills-tabContent"
                                        >
                                            {selectedTab === "buy" && (
                                                <div
                                                    className="tab-pane fade active show"
                                                    id="pills-buy"
                                                    role="tabpanel"
                                                >
                                                    <div className="row gx-3">
                                                        {/* Location Dropdown */}
                                                        <div className="col-lg-6 col-12">
                                                            <div className="form-field with-search1">
                                                                <Select
                                                                    isMulti
                                                                    name="locationData"
                                                                    options={availablelocationData.map(
                                                                        (
                                                                            location
                                                                        ) => ({
                                                                            value: location.city_id,
                                                                            label: location.name,
                                                                        })
                                                                    )}
                                                                    value={selectedLocation.map(
                                                                        (
                                                                            selected
                                                                        ) => ({
                                                                            value: selected.city_id,
                                                                            label: selected.name,
                                                                        })
                                                                    )}
                                                                    onChange={(
                                                                        selectedOptions
                                                                    ) =>
                                                                        setSelectedLocation(
                                                                            selectedOptions.map(
                                                                                (
                                                                                    option
                                                                                ) => ({
                                                                                    city_id:
                                                                                        option.value,
                                                                                    name: option.label,
                                                                                })
                                                                            )
                                                                        )
                                                                    }
                                                                    placeholder="Choose Location"
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* Property Type Dropdown */}
                                                        <div className="col-lg-3 col-sm-6 col-12">
                                                            <div className="form-field">
                                                                <select
                                                                    className="form-select"
                                                                    value={
                                                                        selectedPropertyType
                                                                    }
                                                                    onChange={
                                                                        handlePropertyTypeChange
                                                                    }
                                                                >
                                                                    <option
                                                                        value=""
                                                                        disabled
                                                                    >
                                                                        Property
                                                                        Type
                                                                    </option>
                                                                    {PropertyTypeData.map(
                                                                        (
                                                                            type
                                                                        ) => (
                                                                            <option
                                                                                key={
                                                                                    type.category_id
                                                                                }
                                                                                value={
                                                                                    type.category_id
                                                                                }
                                                                            >
                                                                                {
                                                                                    type.category_name
                                                                                }
                                                                            </option>
                                                                        )
                                                                    )}
                                                                </select>
                                                            </div>
                                                        </div>

                                                        {/* Property For Dropdown */}
                                                        <div className="col-lg-3 col-sm-6 col-12">
                                                            <div className="form-field">
                                                                <select
                                                                    className="form-select"
                                                                    value={
                                                                        selectedPropertyFor
                                                                    }
                                                                    onChange={
                                                                        handlePropertyForChange
                                                                    }
                                                                    // disabled={
                                                                    //     selectedPropertyType
                                                                    // }
                                                                >
                                                                    <option
                                                                        value=""
                                                                        disabled
                                                                    >
                                                                        Property
                                                                        For
                                                                    </option>
                                                                    {PropertyForData.map(
                                                                        (
                                                                            property
                                                                        ) => (
                                                                            <option
                                                                                key={
                                                                                    property.sub_category_id
                                                                                }
                                                                                value={
                                                                                    property.sub_category_id
                                                                                }
                                                                            >
                                                                                {
                                                                                    property.sub_category_name
                                                                                }
                                                                            </option>
                                                                        )
                                                                    )}
                                                                </select>
                                                            </div>
                                                        </div>

                                                        {/* Budget Dropdown */}
                                                        <div className="col-lg-3 col-sm-6 col-12">
                                                            <div className="form-field">
                                                                <select
                                                                    className="form-select"
                                                                    value={
                                                                        selectedBudget
                                                                    }
                                                                    onChange={
                                                                        handleBudgetChange
                                                                    }
                                                                >
                                                                    <option
                                                                        value=""
                                                                        disabled
                                                                    >
                                                                        Budget
                                                                    </option>
                                                                    {budgets.map(
                                                                        (
                                                                            budget
                                                                        ) => (
                                                                            <option
                                                                                key={
                                                                                    budget.key
                                                                                }
                                                                                value={
                                                                                    budget.key
                                                                                }
                                                                            >
                                                                                {
                                                                                    budget.name
                                                                                }
                                                                            </option>
                                                                        )
                                                                    )}
                                                                </select>
                                                            </div>
                                                        </div>

                                                        {/* Size Dropdown */}
                                                        <div className="col-lg-3 col-sm-6 col-12">
                                                            <div className="form-field">
                                                                <select
                                                                    className="form-select"
                                                                    value={
                                                                        selectedSize
                                                                    }
                                                                    onChange={
                                                                        handleSizeChange
                                                                    }
                                                                >
                                                                    <option
                                                                        value=""
                                                                        disabled
                                                                    >
                                                                        Size
                                                                    </option>
                                                                    {sizes.map(
                                                                        (
                                                                            size
                                                                        ) => (
                                                                            <option
                                                                                key={
                                                                                    size.key
                                                                                }
                                                                                value={
                                                                                    size.key
                                                                                }
                                                                            >
                                                                                {
                                                                                    size.name
                                                                                }
                                                                            </option>
                                                                        )
                                                                    )}
                                                                </select>
                                                            </div>
                                                        </div>

                                                        {/* Bedrooms Dropdown */}
                                                        <div className="col-lg-3 col-sm-6 col-12">
                                                            <div className="form-field">
                                                                <select
                                                                    className="form-select"
                                                                    value={
                                                                        selectedBedrooms
                                                                    }
                                                                    onChange={
                                                                        handleBedroomsChange
                                                                    }
                                                                >
                                                                    <option
                                                                        value=""
                                                                        disabled
                                                                    >
                                                                        Bedrooms
                                                                    </option>
                                                                    {bedrooms.map(
                                                                        (
                                                                            bedroom,
                                                                            index
                                                                        ) => (
                                                                            <option
                                                                                key={
                                                                                    index
                                                                                }
                                                                                value={
                                                                                    bedroom
                                                                                }
                                                                            >
                                                                                {
                                                                                    bedroom
                                                                                }
                                                                            </option>
                                                                        )
                                                                    )}
                                                                </select>
                                                            </div>
                                                        </div>

                                                        {/* Parking Dropdown */}
                                                        <div className="col-lg-3 col-sm-6 col-12">
                                                            <div className="form-field">
                                                                <select
                                                                    className="form-select"
                                                                    value={
                                                                        selectedParking
                                                                    }
                                                                    onChange={
                                                                        handleParkingChange
                                                                    }
                                                                >
                                                                    <option
                                                                        value=""
                                                                        disabled
                                                                    >
                                                                        Parking
                                                                    </option>
                                                                    {parkingOptions.map(
                                                                        (
                                                                            option
                                                                        ) => (
                                                                            <option
                                                                                key={
                                                                                    option.slug
                                                                                }
                                                                                value={
                                                                                    option.slug
                                                                                }
                                                                            >
                                                                                {
                                                                                    option.name
                                                                                }
                                                                            </option>
                                                                        )
                                                                    )}
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="text-center">
                                                        <Link
                                                            href={buildSearchUrl()}
                                                        >
                                                            <button
                                                                type="button"
                                                                className="btn btn-primary"
                                                            >
                                                                Search
                                                            </button>
                                                        </Link>
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
                                                            <div className="form-field with-search1">
                                                                <Select
                                                                    isMulti
                                                                    name="locationData"
                                                                    options={availablelocationData.map(
                                                                        (
                                                                            location
                                                                        ) => ({
                                                                            value: location.city_id,
                                                                            label: location.name,
                                                                        })
                                                                    )}
                                                                    value={selectedLocation.map(
                                                                        (
                                                                            selected
                                                                        ) => ({
                                                                            value: selected.city_id,
                                                                            label: selected.name,
                                                                        })
                                                                    )}
                                                                    onChange={(
                                                                        selectedOptions
                                                                    ) =>
                                                                        setSelectedLocation(
                                                                            selectedOptions.map(
                                                                                (
                                                                                    option
                                                                                ) => ({
                                                                                    city_id:
                                                                                        option.value,
                                                                                    name: option.label,
                                                                                })
                                                                            )
                                                                        )
                                                                    }
                                                                    placeholder="Choose Location"
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* Property Type Dropdown */}
                                                        <div className="col-lg-3 col-sm-6 col-12">
                                                            <div className="form-field">
                                                                <select
                                                                    className="form-select"
                                                                    value={
                                                                        selectedPropertyType
                                                                    }
                                                                    onChange={
                                                                        handlePropertyTypeChange
                                                                    }
                                                                >
                                                                    <option
                                                                        value=""
                                                                        disabled
                                                                    >
                                                                        Property
                                                                        Type
                                                                    </option>
                                                                    {PropertyTypeData.map(
                                                                        (
                                                                            type
                                                                        ) => (
                                                                            <option
                                                                                key={
                                                                                    type.category_id
                                                                                }
                                                                                value={
                                                                                    type.category_id
                                                                                }
                                                                            >
                                                                                {
                                                                                    type.category_name
                                                                                }
                                                                            </option>
                                                                        )
                                                                    )}
                                                                </select>
                                                            </div>
                                                        </div>

                                                        {/* Property For Dropdown */}
                                                        <div className="col-lg-3 col-sm-6 col-12">
                                                            <div className="form-field">
                                                                <select
                                                                    className="form-select"
                                                                    value={
                                                                        selectedPropertyFor
                                                                    }
                                                                    onChange={
                                                                        handlePropertyForChange
                                                                    }
                                                                    // disabled={
                                                                    //     selectedPropertyType
                                                                    // }
                                                                >
                                                                    <option
                                                                        value=""
                                                                        // disabled
                                                                    >
                                                                        Property
                                                                        For
                                                                    </option>
                                                                    {PropertyForData.map(
                                                                        (
                                                                            property
                                                                        ) => (
                                                                            <option
                                                                                key={
                                                                                    property.sub_category_id
                                                                                }
                                                                                value={
                                                                                    property.sub_category_id
                                                                                }
                                                                            >
                                                                                {
                                                                                    property.sub_category_name
                                                                                }
                                                                            </option>
                                                                        )
                                                                    )}
                                                                </select>
                                                            </div>
                                                        </div>

                                                        {/* Budget Dropdown */}
                                                        <div className="col-lg-3 col-sm-6 col-12">
                                                            <div className="form-field">
                                                                <select
                                                                    className="form-select"
                                                                    value={
                                                                        selectedBudget
                                                                    }
                                                                    onChange={
                                                                        handleBudgetChange
                                                                    }
                                                                >
                                                                    <option
                                                                        value=""
                                                                        disabled
                                                                    >
                                                                        Budget
                                                                    </option>
                                                                    {budgets.map(
                                                                        (
                                                                            budget
                                                                        ) => (
                                                                            <option
                                                                                key={
                                                                                    budget.key
                                                                                }
                                                                                value={
                                                                                    budget.key
                                                                                }
                                                                            >
                                                                                {
                                                                                    budget.name
                                                                                }
                                                                            </option>
                                                                        )
                                                                    )}
                                                                </select>
                                                            </div>
                                                        </div>

                                                        {/* Size Dropdown */}
                                                        <div className="col-lg-3 col-sm-6 col-12">
                                                            <div className="form-field">
                                                                <select
                                                                    className="form-select"
                                                                    value={
                                                                        selectedSize
                                                                    }
                                                                    onChange={
                                                                        handleSizeChange
                                                                    }
                                                                >
                                                                    <option
                                                                        value=""
                                                                        disabled
                                                                    >
                                                                        Size
                                                                    </option>
                                                                    {sizes.map(
                                                                        (
                                                                            size
                                                                        ) => (
                                                                            <option
                                                                                key={
                                                                                    size.key
                                                                                }
                                                                                value={
                                                                                    size.key
                                                                                }
                                                                            >
                                                                                {
                                                                                    size.name
                                                                                }
                                                                            </option>
                                                                        )
                                                                    )}
                                                                </select>
                                                            </div>
                                                        </div>

                                                        {/* Bedrooms Dropdown */}
                                                        <div className="col-lg-3 col-sm-6 col-12">
                                                            <div className="form-field">
                                                                <select
                                                                    className="form-select"
                                                                    value={
                                                                        selectedBedrooms
                                                                    }
                                                                    onChange={
                                                                        handleBedroomsChange
                                                                    }
                                                                >
                                                                    <option
                                                                        value=""
                                                                        disabled
                                                                    >
                                                                        Bedrooms
                                                                    </option>
                                                                    {bedrooms.map(
                                                                        (
                                                                            bedroom,
                                                                            index
                                                                        ) => (
                                                                            <option
                                                                                key={
                                                                                    index
                                                                                }
                                                                                value={
                                                                                    bedroom
                                                                                }
                                                                            >
                                                                                {
                                                                                    bedroom
                                                                                }
                                                                            </option>
                                                                        )
                                                                    )}
                                                                </select>
                                                            </div>
                                                        </div>

                                                        {/* Parking Dropdown */}
                                                        <div className="col-lg-3 col-sm-6 col-12">
                                                            <div className="form-field">
                                                                <select
                                                                    className="form-select"
                                                                    value={
                                                                        selectedParking
                                                                    }
                                                                    onChange={
                                                                        handleParkingChange
                                                                    }
                                                                >
                                                                    <option
                                                                        value=""
                                                                        disabled
                                                                    >
                                                                        Parking
                                                                    </option>
                                                                    {parkingOptions.map(
                                                                        (
                                                                            option
                                                                        ) => (
                                                                            <option
                                                                                key={
                                                                                    option.slug
                                                                                }
                                                                                value={
                                                                                    option.slug
                                                                                }
                                                                            >
                                                                                {
                                                                                    option.name
                                                                                }
                                                                            </option>
                                                                        )
                                                                    )}
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="text-center">
                                                        <Link
                                                            href={buildSearchUrl()}
                                                        >
                                                            <button
                                                                type="button"
                                                                className="btn btn-primary"
                                                            >
                                                                Search
                                                            </button>
                                                        </Link>
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
                                                    <div>Land Form</div>
                                                </div>
                                            )}

                                            {selectedTab === "commercial" && (
                                                <div
                                                    className="tab-pane fade active show"
                                                    id="pills-commercial"
                                                    role="tabpanel"
                                                >
                                                    <div className="row gx-3">
                                                        {/* Location Dropdown */}
                                                        <div className="col-lg-6 col-12">
                                                            <div className="form-field with-search1">
                                                                <Select
                                                                    isMulti
                                                                    name="locationData"
                                                                    options={availablelocationData.map(
                                                                        (
                                                                            location
                                                                        ) => ({
                                                                            value: location.city_id,
                                                                            label: location.name,
                                                                        })
                                                                    )}
                                                                    value={selectedLocation.map(
                                                                        (
                                                                            selected
                                                                        ) => ({
                                                                            value: selected.city_id,
                                                                            label: selected.name,
                                                                        })
                                                                    )}
                                                                    onChange={(
                                                                        selectedOptions
                                                                    ) =>
                                                                        setSelectedLocation(
                                                                            selectedOptions.map(
                                                                                (
                                                                                    option
                                                                                ) => ({
                                                                                    city_id:
                                                                                        option.value,
                                                                                    name: option.label,
                                                                                })
                                                                            )
                                                                        )
                                                                    }
                                                                    placeholder="Choose Location"
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* Property Type Dropdown */}
                                                        <div className="col-lg-3 col-sm-6 col-12">
                                                            <div className="form-field">
                                                                <select
                                                                    className="form-select"
                                                                    value={
                                                                        selectedPropertyType
                                                                    }
                                                                    onChange={
                                                                        handlePropertyTypeChange
                                                                    }
                                                                >
                                                                    <option
                                                                        value=""
                                                                        disabled
                                                                    >
                                                                        Property
                                                                        Type
                                                                    </option>
                                                                    {PropertyTypeData.map(
                                                                        (
                                                                            type
                                                                        ) => (
                                                                            <option
                                                                                key={
                                                                                    type.category_id
                                                                                }
                                                                                value={
                                                                                    type.category_id
                                                                                }
                                                                            >
                                                                                {
                                                                                    type.category_name
                                                                                }
                                                                            </option>
                                                                        )
                                                                    )}
                                                                </select>
                                                            </div>
                                                        </div>

                                                        {/* Property For Dropdown */}
                                                        <div className="col-lg-3 col-sm-6 col-12">
                                                            <div className="form-field">
                                                                <select
                                                                    className="form-select"
                                                                    value={
                                                                        selectedPropertyFor
                                                                    }
                                                                    onChange={
                                                                        handlePropertyForChange
                                                                    }
                                                                    // disabled={
                                                                    //     selectedPropertyType
                                                                    // }
                                                                >
                                                                    <option
                                                                        value=""
                                                                        // disabled
                                                                    >
                                                                        Property
                                                                        For
                                                                    </option>
                                                                    {PropertyForData.map(
                                                                        (
                                                                            property
                                                                        ) => (
                                                                            <option
                                                                                key={
                                                                                    property.sub_category_id
                                                                                }
                                                                                value={
                                                                                    property.sub_category_id
                                                                                }
                                                                            >
                                                                                {
                                                                                    property.sub_category_name
                                                                                }
                                                                            </option>
                                                                        )
                                                                    )}
                                                                </select>
                                                            </div>
                                                        </div>

                                                        {/* Budget Dropdown */}
                                                        <div className="col-lg-3 col-sm-6 col-12">
                                                            <div className="form-field">
                                                                <select
                                                                    className="form-select"
                                                                    value={
                                                                        selectedBudget
                                                                    }
                                                                    onChange={
                                                                        handleBudgetChange
                                                                    }
                                                                >
                                                                    <option
                                                                        value=""
                                                                        disabled
                                                                    >
                                                                        Budget
                                                                    </option>
                                                                    {budgets.map(
                                                                        (
                                                                            budget
                                                                        ) => (
                                                                            <option
                                                                                key={
                                                                                    budget.key
                                                                                }
                                                                                value={
                                                                                    budget.key
                                                                                }
                                                                            >
                                                                                {
                                                                                    budget.name
                                                                                }
                                                                            </option>
                                                                        )
                                                                    )}
                                                                </select>
                                                            </div>
                                                        </div>

                                                        {/* Size Dropdown */}
                                                        <div className="col-lg-3 col-sm-6 col-12">
                                                            <div className="form-field">
                                                                <select
                                                                    className="form-select"
                                                                    value={
                                                                        selectedSize
                                                                    }
                                                                    onChange={
                                                                        handleSizeChange
                                                                    }
                                                                >
                                                                    <option
                                                                        value=""
                                                                        disabled
                                                                    >
                                                                        Size
                                                                    </option>
                                                                    {sizes.map(
                                                                        (
                                                                            size
                                                                        ) => (
                                                                            <option
                                                                                key={
                                                                                    size.key
                                                                                }
                                                                                value={
                                                                                    size.key
                                                                                }
                                                                            >
                                                                                {
                                                                                    size.name
                                                                                }
                                                                            </option>
                                                                        )
                                                                    )}
                                                                </select>
                                                            </div>
                                                        </div>

                                                        {/* Bedrooms Dropdown */}
                                                        <div className="col-lg-3 col-sm-6 col-12">
                                                            <div className="form-field">
                                                                <select
                                                                    className="form-select"
                                                                    value={
                                                                        selectedBedrooms
                                                                    }
                                                                    onChange={
                                                                        handleBedroomsChange
                                                                    }
                                                                >
                                                                    <option
                                                                        value=""
                                                                        disabled
                                                                    >
                                                                        Bedrooms
                                                                    </option>
                                                                    {bedrooms.map(
                                                                        (
                                                                            bedroom,
                                                                            index
                                                                        ) => (
                                                                            <option
                                                                                key={
                                                                                    index
                                                                                }
                                                                                value={
                                                                                    bedroom
                                                                                }
                                                                            >
                                                                                {
                                                                                    bedroom
                                                                                }
                                                                            </option>
                                                                        )
                                                                    )}
                                                                </select>
                                                            </div>
                                                        </div>

                                                        {/* Parking Dropdown */}
                                                        <div className="col-lg-3 col-sm-6 col-12">
                                                            <div className="form-field">
                                                                <select
                                                                    className="form-select"
                                                                    value={
                                                                        selectedParking
                                                                    }
                                                                    onChange={
                                                                        handleParkingChange
                                                                    }
                                                                >
                                                                    <option
                                                                        value=""
                                                                        disabled
                                                                    >
                                                                        Parking
                                                                    </option>
                                                                    {parkingOptions.map(
                                                                        (
                                                                            option
                                                                        ) => (
                                                                            <option
                                                                                key={
                                                                                    option.slug
                                                                                }
                                                                                value={
                                                                                    option.slug
                                                                                }
                                                                            >
                                                                                {
                                                                                    option.name
                                                                                }
                                                                            </option>
                                                                        )
                                                                    )}
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="text-center">
                                                        <Link
                                                            href={buildSearchUrl()}
                                                        >
                                                            <button
                                                                type="button"
                                                                className="btn btn-primary"
                                                            >
                                                                Search
                                                            </button>
                                                        </Link>
                                                    </div>
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
