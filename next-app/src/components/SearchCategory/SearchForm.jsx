"use client";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useRouter, useSearchParams } from "next/navigation";
import AuthUser from "../Authentication/AuthUser";
import { toast } from "react-toastify";
import {
    filterOptions,
    subfilterOptions,
    CommercialFilterOptions,
} from "../post/PropertyData";

const SearchForm = ({ setIsAdvanceSearch, setAdvanceSearchData, loadMore, recent_page }) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const cityIdString = searchParams.get("city_id");
    const cityIds = cityIdString ? cityIdString.split(",").map(Number) : [];

    const { callApi } = AuthUser();

    const initialPostFor = searchParams.get("post_for") || "sell";
    const initialPropertyType =
        parseInt(searchParams.get("property_type"), 10) || null;
    const initialPropertyFor =
        parseInt(searchParams.get("property_for"), 10) || null;

    const [locationData, setLocationData] = useState([]);
    const [propertyTypeData, setPropertyTypeData] = useState([]);
    const [propertyForData, setPropertyForData] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState([]);
    const [selectedPropertyType, setSelectedPropertyType] = useState(null);
    const [selectedPropertyFor, setSelectedPropertyFor] = useState(null);
    const [selectedPostFor, setSelectedPostFor] = useState(initialPostFor);
    const [selectedFilter, setSelectedFilter] = useState(null);
    const [selectedSubFilters, setSelectedSubFilters] = useState([]);
    const [SearchData, setSearchData] = useState({
        carpet_area: [],
        possession_status: [],
        sale_type: [],
        posted_by: [],
        ownership: [],
        furnishing: [],
        amenities: [],
        verify_properties: [],
        facing: [],
        floor: [],
        bathroom: [],
        mb_exclusive_properties: [],
        posted_by_certified_agents: [],
        rera_registered_properties: [],
        rera_registered_agents: [],
    });

    const [isAdvancedFilterVisible, setAdvancedFilterVisible] = useState(false);
    const [dynamicList, setDynamicList] = useState([])
    const [activeDynamicKey, setActiveDynamicKey] = useState("")
    const [dynamicFieldLoading, setDynamicFieldLoading] = useState(true);



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

        const fetchAdvancedFeatureData = async () => {};
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
            },
        });
    };
    const toggleAdvancedFilter = () => {
        if (selectedPropertyType) {
            setAdvancedFilterVisible(!isAdvancedFilterVisible);
        }
    };
    const handleViewProperty = (loadMore, recent_page) => {

        setIsAdvanceSearch(true);
        const existingParams = new URLSearchParams();

        if (selectedLocation.length > 0) {
            selectedLocation.forEach((location) =>
                existingParams.append("city_id", location.value)
            );
        }
        if (selectedPropertyType?.category_id) {
            existingParams.set(
                "property_type",
                selectedPropertyType.category_id
            );
        }
        if (selectedPropertyFor?.sub_category_id) {
            existingParams.set(
                "property_for",
                selectedPropertyFor.sub_category_id
            );
        }
        if (selectedPostFor) {
            existingParams.set("post_for", selectedPostFor);
        }
        if(!loadMore) {
            router.push(`/property-listing?${existingParams.toString()}`);
        }
        const searchPayload = Object.fromEntries(existingParams.entries());

        callApi({
            api: `/advance_search_result?recent_page=${recent_page || 1}`,
            method: "POST",
            data: {
                SearchData: JSON.stringify(SearchData),
                searchPayload: JSON.stringify(searchPayload),
            }
            
        })
        
            .then((response) => {
                if (response?.status === 1) {
                    if(loadMore) {
                        setAdvanceSearchData(response, true);
                    } else {
                        setAdvanceSearchData(response);
                        toast.success("Properties fetched successfully!");
                    }
                    
                } else {
                    setAdvanceSearchData(response);
                    toast.error(
                        response?.message || "Error fetching properties"
                    );
                }
            })
            .catch((error) => {
                toast.error(error?.message || "Error fetching properties");
            }).finally(() => {
                setAdvancedFilterVisible(false);
            });
    };
    const handleFilterSelection = (filterKey) => {
        setSelectedFilter(filterKey);
        setSelectedSubFilters([]);
        setSearchData((prevState) => ({
            ...prevState,
            [filterKey]: "",
        }));
    };
    const handleSubFilterSelection = (categoryKey, subFilterKey) => {
        setSelectedSubFilters((prev) => {
            const newSelectedFilters = prev.includes(subFilterKey)
                ? prev.filter((key) => key !== subFilterKey)
                : [...prev, subFilterKey];

            setSearchData((prevState) => {
                return {
                    ...prevState,
                    [categoryKey]: newSelectedFilters,
                };
            });

            return newSelectedFilters;
        });
    };


    const filtersToUse =
        selectedPropertyType?.category_key === "residential"
            ? filterOptions
            : CommercialFilterOptions;


    useEffect(() => {
        if(selectedFilter) {
            let url;
            switch (selectedFilter) {
                case "furnishing":
                    url = "/get_property_furnish";
                    break;
                case "amenities":
                    url = "/get_property_amnity";
                    break;
                case "possession_status":
                    url = "/get_property_status";
                    break;
                default:
                    url = null; // Optional: Set url to null if no cases match
            }
            if(url) {
                setActiveDynamicKey(selectedFilter);
                const getList = async () => {
                    setDynamicFieldLoading(true);
                    try {
                        const args = {
                            api: url,
                            method: "GET"
                        }
                    
                        const res = await callApi(args);
                        if(res && res?.status === 1) {
                            setDynamicList(res?.data);
                        }
                    } catch (error) {
                        console.log(error?.message || "Something went wrong")
                    } finally {
                        setDynamicFieldLoading(false);
                    }
                }
                getList();
            }
        }
    }, [selectedFilter])

    const handleDynamicValueChange = (name, value) => {
        setSearchData((prevState) => {
            // Get the current value for the given name
            const currentValues = prevState[name] || [];
    
            // Check if the value exists in the array
            if (Array.isArray(currentValues)) {
                if (currentValues.includes(value)) {
                    // If the value exists, remove it
                    return {
                        ...prevState,
                        [name]: currentValues.filter((item) => item !== value),
                    };
                } else {
                    // If the value does not exist, add it
                    return {
                        ...prevState,
                        [name]: [...currentValues, value],
                    };
                }
            } else {
                // If the current value is not an array, initialize it as an array with the new value
                return {
                    ...prevState,
                    [name]: [value],
                };
            }
        });
    }

    useEffect(() => {
        if(loadMore) {
            handleViewProperty(loadMore, recent_page);
        }
    }, [recent_page])


    return (
        <div className="container-fluid mt-3">
            <div className="row">
                <div className="col-12">
                    <div className="search-form">
                        <ul className="nav nav-pills justify-content-center mb-3">
                            <li className="nav-item">
                                <a
                                    className={`nav-link ${
                                        selectedPostFor === "sell"
                                            ? "active"
                                            : ""
                                    }`}
                                    onClick={() => handlePostForChange("sell")}
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
                                        selectedPostFor === "pg_hostel"
                                            ? "active"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        handlePostForChange("pg_hostel")
                                    }
                                >
                                    PG/Hostel
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
                        <React.Fragment>
                            <div>
                                <ul className="list-group">
                                    {filtersToUse.map((area) => {
                                        return (
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
                                        )
                                    })}
                                </ul>
                            </div>
                            <div>
                                {selectedFilter &&
                                    selectedFilter === "furnishing" || selectedFilter === "amenities" || selectedFilter === "possession_status" ? 
                                    <div>
                                        <h4>
                                            Sub Filters for{" "}
                                                {
                                                    filterOptions.find(
                                                        (f) =>
                                                            f.key ===
                                                            selectedFilter
                                                    ).name
                                                }
                                        </h4>
                                        <div>
                                            {dynamicFieldLoading && (
                                                <>
                                                    <div
                                                style={{
                                                    width: "40px", 
                                                    height: "40px",
                                                    border: "4px solid #3498db", 
                                                    borderTop: "4px solid transparent", 
                                                    borderRadius: "50%",
                                                    animation: "spin 1s linear infinite",
                                                    marginLeft: "150px",
                                                    marginTop: "100px"
                                                }}
                                            ></div>
                                            
                                            <style>
                                                {`
                                                    @keyframes spin {
                                                        0% {
                                                            transform: rotate(0deg);
                                                        }
                                                        100% {
                                                            transform: rotate(360deg);
                                                        }
                                                    }
                                                `}
                                            </style>
                                                </>
                                            )}
                                            {!dynamicFieldLoading && dynamicList?.map((item, i) => {
                                                if (selectedFilter === "furnishing") {
                                                    return (
                                                        <div key={item?.furnish_id || i}>
                                                            <input type="checkbox" 
                                                            onChange={() =>
                                                                handleDynamicValueChange(
                                                                    selectedFilter,
                                                                    item?.furnish_id
                                                                )}
                                                                checked={SearchData[selectedFilter]?.includes(item?.furnish_id)} />
                                                            {item?.furnish_name}
                                                            
                                                        </div>
                                                    );
                                                } else if (selectedFilter === "amenities") {
                                                    return (
                                                        <div key={item?.amenity_id || i}>
                                                            <input type="checkbox" 
                                                            onChange={() =>
                                                                handleDynamicValueChange(
                                                                    selectedFilter,
                                                                    item?.amenity_id
                                                                )}
                                                                checked={SearchData[selectedFilter]?.includes(item?.amenity_id)} />
                                                            {item?.amenity_name}
                                                        </div>
                                                    );
                                                } else if (selectedFilter === "possession_status") {
                                                    return (
                                                        <div key={item?.status_id || i}>
                                                            <input type="checkbox" 
                                                            onChange={() =>
                                                                handleDynamicValueChange(
                                                                    selectedFilter,
                                                                    item?.status_id
                                                                )}
                                                                checked={SearchData[selectedFilter]?.includes(item?.status_id)} />
                                                            {item?.status_name}
                                                        </div>
                                                    );
                                                }
                                            })}
                                        </div>
                                    </div> 
                                    :
                                    subfilterOptions[selectedFilter] && (
                                        <div>
                                            <h4>
                                                Sub Filters for{" "}
                                                {
                                                    filterOptions.find(
                                                        (f) =>
                                                            f.key ===
                                                            selectedFilter
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
                                                                    selectedFilter,
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
                        </React.Fragment>
                        <button
                            type="button"
                            className="btn btn-success"
                            style={{ height: "40px" }}
                            onClick={() => handleViewProperty()}
                        >
                            View Property
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default SearchForm;
