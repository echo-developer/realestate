import React, { useState } from "react";
import Select from "react-select";
import Link from "next/link";

const locations = [
    { key: 1, value: "kolkata", label: "Kolkata" },
    { key: 2, value: "ajman", label: "Ajman" },
    { key: 3, value: "dubai", label: "Dubai" },
    { key: 4, value: "fujairah", label: "Fujairah" },
    { key: 5, value: "ras-al-khaimah", label: "Ras Al Khaimah" },
    { key: 6, value: "sharjah", label: "Sharjah" },
    { key: 7, value: "umm-al-quwain", label: "Umm Al-Quwain" },
    { key: 8, value: "abu-dhabi", label: "Abu Dhabi" },
];

const propertyTypes = [
    {
        category_id: 1,
        category_name: "Residential",
        category_key: "residential",
    },
    {
        category_id: 2,
        category_name: "Commercial",
        category_key: "commercial",
    },
    {
        category_id: 4,
        category_name: "Agricultural",
        category_key: "agricultural",
    },
];
const propertyFor = [
    {
        sub_category_id: 1,
        sub_category_name: "Apartments / Flats",
        sub_category_key: "apartments--flats",
    },
    {
        sub_category_id: 2,
        sub_category_name: "Villas",
        sub_category_key: "villas",
    },
    {
        sub_category_id: 6,
        sub_category_name: "Residential House",
        sub_category_key: "residential-house",
    },
    {
        sub_category_id: 7,
        sub_category_name: "Builder Floor Apartment",
        sub_category_key: "builder-floor-apartment",
    },
    {
        sub_category_id: 8,
        sub_category_name: "Residential Land/ Plot",
        sub_category_key: "residential-land-plot",
    },
    {
        sub_category_id: 9,
        sub_category_name: "Penthouse",
        sub_category_key: "penthouse",
    },
    {
        sub_category_id: 10,
        sub_category_name: "Studio Apartment",
        sub_category_key: "studio-apartment",
    },
];
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

    const handleTabChange = (tab) => setSelectedTab(tab);

    const availableLocations = locations.filter(
        (location) =>
            !selectedLocation.find(
                (selected) => selected.value === location.value
            )
    );

    const buildSearchUrl = () => {
        const params = {
            post_for: selectedTab,
            city_id: selectedLocation.map((loc) => loc.key).join(","),
            property_type: selectedPropertyType,
            property_for: selectedPropertyFor,
            property_budget: selectedBudget,
            property_size: selectedSize,
            bedrooms: selectedBedrooms,
            parking: selectedParking,
        };

        // Filter out empty or undefined parameters
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
                                                                    name="locations"
                                                                    options={
                                                                        availableLocations
                                                                    }
                                                                    value={
                                                                        selectedLocation
                                                                    }
                                                                    onChange={
                                                                        handleLocationChange
                                                                    }
                                                                    getOptionLabel={(
                                                                        e
                                                                    ) =>
                                                                        e.label
                                                                    }
                                                                    getOptionValue={(
                                                                        e
                                                                    ) =>
                                                                        e.value
                                                                    }
                                                                    placeholder="Choose Location"
                                                                    getOptionKey={(
                                                                        e
                                                                    ) => e.key}
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
                                                                    {propertyTypes.map(
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
                                                                    {propertyFor.map(
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
                                                                    name="locations"
                                                                    options={
                                                                        availableLocations
                                                                    }
                                                                    value={
                                                                        selectedLocation
                                                                    }
                                                                    onChange={
                                                                        handleLocationChange
                                                                    }
                                                                    getOptionLabel={(
                                                                        e
                                                                    ) =>
                                                                        e.label
                                                                    }
                                                                    getOptionValue={(
                                                                        e
                                                                    ) =>
                                                                        e.value
                                                                    }
                                                                    placeholder="Choose Location"
                                                                    getOptionKey={(
                                                                        e
                                                                    ) => e.key}
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
                                                                    {propertyTypes.map(
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
                                                                    {propertyFor.map(
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
                                                                    name="locations"
                                                                    options={
                                                                        availableLocations
                                                                    }
                                                                    value={
                                                                        selectedLocation
                                                                    }
                                                                    onChange={
                                                                        handleLocationChange
                                                                    }
                                                                    getOptionLabel={(
                                                                        e
                                                                    ) =>
                                                                        e.label
                                                                    }
                                                                    getOptionValue={(
                                                                        e
                                                                    ) =>
                                                                        e.value
                                                                    }
                                                                    placeholder="Choose Location"
                                                                    getOptionKey={(
                                                                        e
                                                                    ) => e.key}
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
                                                                    {propertyTypes.map(
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
                                                                    {propertyFor.map(
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
