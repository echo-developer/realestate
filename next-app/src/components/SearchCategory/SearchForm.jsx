"use client";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useRouter, useSearchParams } from "next/navigation";
import AuthUser from "../Authentication/AuthUser";
import { toast } from "react-toastify";
import { filterOptions, subfilterOptions } from "../post/PropertyData";

const SearchForm = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const cityIdString = searchParams.get("city_id");
    const cityIds = cityIdString ? cityIdString.split(",").map(Number) : [];

    const { callApi } = AuthUser();

    const initialPostFor = searchParams.get("post_for") || "buy";
    const initialPropertyType =
        parseInt(searchParams.get("property_type"), 10) || null;
    const initialPropertyFor =
        parseInt(searchParams.get("property_for"), 10) || null;

    const [locationData, setLocationData] = useState([]);
    const [propertyTypeData, setPropertyTypeData] = useState([]);
    const [propertyForData, setPropertyForData] = useState([]);
    const [advancedFeatureData, setAdvancedFeatureData] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState([]);
    const [selectedPropertyType, setSelectedPropertyType] = useState(null);
    const [selectedPropertyFor, setSelectedPropertyFor] = useState(null);
    const [selectedAdvancedFeature, setSelectedAdvancedFeature] =
        useState(null);
    const [selectedPostFor, setSelectedPostFor] = useState(initialPostFor);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [showSubcategory, setShowSubcategory] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState(null);
    const [selectedSubFilters, setSelectedSubFilters] = useState([]);

    const [isAdvancedFilterVisible, setAdvancedFilterVisible] = useState(false);

    useEffect(() => {
        const fetchLocationData = async () => {
            try {
                const response = await callApi({
                    api: "/get_property_cities",
                    method: "GET",
                });
                if (response?.status === 1) {
                    const formattedLocations = response.data.map(
                        (location) => ({
                            value: location.city_id,
                            label: location.name,
                        })
                    );
                    setLocationData(formattedLocations || []);
                    setSelectedLocation(
                        formattedLocations.filter((location) =>
                            cityIds.includes(location.value)
                        )
                    );
                } else {
                    toast.error(
                        response?.message || "Error fetching locations"
                    );
                }
            } catch (error) {
                toast.error(error?.message || "Error fetching locations");
            }
        };
        fetchLocationData();
    }, []);

    useEffect(() => {
        const fetchPropertyTypeData = async () => {
            try {
                const response = await callApi({
                    api: "/get_property_type",
                    method: "GET",
                });
                if (response?.status === 1) {
                    setPropertyTypeData(response.data || []);
                    const matchedType = response.data.find(
                        (type) => type.category_id === initialPropertyType
                    );
                    setSelectedPropertyType(matchedType || null);
                } else {
                    toast.error(
                        response?.message || "Error fetching property types"
                    );
                }
            } catch (error) {
                toast.error(error?.message || "Error fetching property types");
            }
        };
        fetchPropertyTypeData();
    }, [initialPropertyType]);

    useEffect(() => {
        if (selectedPropertyType) {
            const fetchPropertyForData = async () => {
                try {
                    const response = await callApi({
                        api: `/get_property_for/${selectedPropertyType.category_id}`,
                        method: "GET",
                    });
                    if (response && response?.status === 1) {
                        setPropertyForData(response.data || []);
                        const matchedFor = response.data.find(
                            (option) =>
                                option.sub_category_id === initialPropertyFor
                        );
                        setSelectedPropertyFor(matchedFor || null);
                    } else {
                        toast.error(
                            response?.message ||
                                "Error fetching property for options"
                        );
                    }
                } catch (error) {
                    toast.error(
                        error?.message || "Error fetching property for options"
                    );
                }
            };
            fetchPropertyForData();
        }

        const fetchAdvancedFeatureData = async () => {
           
        };
        fetchAdvancedFeatureData();
    }, [selectedPropertyType, initialPropertyFor]);

    const handleLocationChange = (selectedOptions) => {
        setSelectedLocation(selectedOptions || []);
    };

    const handlePropertyTypeChange = (e) => {
        const newSelectedPropertyType = propertyTypeData.find(
            (type) => type?.category_key === e.target.value
        );
        setSelectedPropertyType(newSelectedPropertyType);
        setSelectedPropertyFor(null);
    };

    const handlePropertyForChange = (e) => {
        const selectedOption = propertyForData.find(
            (option) => option.subcategory_key === e.target.value
        );
        setSelectedPropertyFor(selectedOption);
    };

    const handleAdvancedFeatureChange = (e) => {
        const selectedOption = advancedFeatureData.find(
            (option) => option.feature_key === e.target.value
        );
        setSelectedAdvancedFeature(selectedOption);
    };

    const handlePostForChange = (value) => {
        setSelectedPostFor(value);
    };

    const handleSearchClick = () => {
        const selectedCityIds = selectedLocation.map(
            (location) => location.value
        );
        router.push({
            pathname: "/property-listing",
            query: {
                city_id: selectedCityIds.join(","),
                property_type: selectedPropertyType?.category_id || null,
                property_for: selectedPropertyFor?.sub_category_id || null,
                post_for: selectedPostFor,
                advanced_feature: selectedAdvancedFeature?.feature_id || null, // Include selected advanced feature
            },
        });
    };

    const toggleAdvancedFilter = () => {
        setAdvancedFilterVisible(!isAdvancedFilterVisible);
    };
    const handleFilterSelection = (filterKey) => {
        setSelectedFilter(filterKey);
        setSelectedSubFilters([]);
    };

    const handleSubFilterSelection = (subFilterKey) => {
        setSelectedSubFilters((prev) => {
            if (prev.includes(subFilterKey)) {
                return prev.filter((key) => key !== subFilterKey);
            }
            return [...prev, subFilterKey];
        });
    };

    console.log(selectedFilter)
    console.log(selectedSubFilters)
    
    return (
        <div className="container-fluid mt-3">
            <div className="row">
                <div className="col-12">
                    <div className="search-form">
                        <ul className="nav nav-pills justify-content-center mb-3">
                            <li className="nav-item">
                                <a
                                    className={`nav-link ${
                                        selectedPostFor === "buy"
                                            ? "active"
                                            : ""
                                    }`}
                                    onClick={() => handlePostForChange("buy")}
                                >
                                    Buy
                                </a>
                            </li>
                            <li className="nav-item">
                                <a
                                    className={`nav-link ${
                                        selectedPostFor === "rent"
                                            ? "active"
                                            : ""
                                    }`}
                                    onClick={() => handlePostForChange("rent")}
                                >
                                    Rent
                                </a>
                            </li>
                            <li className="nav-item">
                                <a
                                    className={`nav-link ${
                                        selectedPostFor === "commercial"
                                            ? "active"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        handlePostForChange("commercial")
                                    }
                                >
                                    Commercial
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <form id="searchfilter">
                <div className="row gx-2">
                    {/* Location */}
                    <div className="col-lg col-12">
                        <Select
                            isMulti
                            name="locations"
                            options={locationData}
                            value={selectedLocation}
                            onChange={handleLocationChange}
                            placeholder="Choose Location"
                        />
                    </div>

                    {/* Property Type */}
                    <div className="col-lg-3 col-sm-6 col-12">
                        <select
                            className="form-control"
                            value={selectedPropertyType?.category_key || ""}
                            onChange={handlePropertyTypeChange}
                        >
                            <option value="" disabled>
                                Select Property Type
                            </option>
                            {propertyTypeData.map((type) => (
                                <option
                                    key={type.category_id}
                                    value={type.category_key}
                                >
                                    {type.category_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Property For */}
                    <div className="col-lg-3 col-sm-6 col-12">
                        <select
                            className="form-control"
                            value={selectedPropertyFor?.subcategory_key || ""}
                            onChange={handlePropertyForChange}
                            disabled={!propertyForData.length}
                        >
                            <option value="" disabled>
                                Select Property For
                            </option>
                            {propertyForData.map((option) => (
                                <option
                                    key={option.sub_category_id}
                                    value={option.subcategory_key}
                                >
                                    {option.sub_category_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Advanced Filter Button */}
                    <div className="col-lg-auto col-sm-6 col-12">
                        <button
                            type="button"
                            className="btn btn-light"
                            onClick={toggleAdvancedFilter}
                        >
                            {isAdvancedFilterVisible
                                ? "Hide Advanced"
                                : "Advanced"}
                        </button>
                    </div>

                    {/* Search Button */}
                    <div className="col-lg-auto col-sm-6 col-12">
                        <button
                            type="button"
                            className="btn btn-light"
                            onClick={handleSearchClick}
                        >
                            Search
                        </button>
                    </div>
                </div>

                {/* Advanced Filters (Hidden by default) */}
                {isAdvancedFilterVisible && (
                    <div
                        style={{
                            display: "inline-flex",
                            background: "white",
                            padding: "1rem",
                            marginTop: "2px",
                            position: "absolute",
                            right: "0px",
                            width: "700px",
                            border: "1px solid rgb(221, 221, 221)",
                            columnGap: "1rem",
                        }}
                    >
                        <div>
                            <ul className="list-group">
                                {filterOptions.map((area) => (
                                    <li
                                        className="list-group-item"
                                        key={area.key}
                                        onClick={() =>
                                            handleFilterSelection(area.key)
                                        }
                                        style={{
                                            cursor: "pointer",
                                            fontWeight:
                                                selectedFilter === area.key
                                                    ? "bold"
                                                    : "normal",
                                        }}
                                    >
                                        {area.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            {selectedFilter &&
                                subfilterOptions[selectedFilter] && (
                                    <div>
                                        <h4>
                                            Sub Filters for{" "}
                                            {
                                                filterOptions.find(
                                                    (f) =>
                                                        f.key === selectedFilter
                                                ).name
                                            }
                                        </h4>
                                        <div>
                                            {subfilterOptions[
                                                selectedFilter
                                            ].map((subFilter) => (
                                                <div
                                                    key={subFilter.key}
                                                    style={{
                                                        marginBottom: "8px",
                                                    }}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedSubFilters.includes(
                                                            subFilter.key
                                                        )}
                                                        onChange={() =>
                                                            handleSubFilterSelection(
                                                                subFilter.key
                                                            )
                                                        }
                                                    />
                                                    {subFilter.name}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
};

export default SearchForm;
