"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthUser from "../Authentication/AuthUser";
import { toast } from "react-toastify";
import useTranslation from "@/hooks/useTranslation";
import {
    filterOptions,
    subfilterOptions,
    CommercialFilterOptions,
} from "../post/PropertyData";
import LocalitySearchedData from "../MapData/CitySelector";
import {
    Form,
    Row,
    Col,
    ListGroup,
    Dropdown,
    Nav,
    Button,
    FloatingLabel,
} from "react-bootstrap";
import LocalityOption from "../MapData/LocalitySelector";

const budgets = [
    { key: 1, name: "$99 - $199" },
    { key: 2, name: "$200 - $300" },
    { key: 3, name: "$301 - $499" },
    { key: 4, name: "$500 - $999" },
    { key: 5, name: "Above $1000" },
  ];

const SearchForm = ({ setIsAdvanceSearch, setAdvanceSearchData, loadMore, recent_page, setTotalPages, setCurrentPages, postFor, memberId, localities ,setLocalityData }) => {
    const router = useRouter();
     const translation = useTranslation();
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState("");
    const [searchGender, setSearchGender] = useState("");
    const [searchBudget, setSearchBudget] = useState("")

    const cityIdString = searchParams.get("city_id");
    const cityIds = cityIdString ? cityIdString.split(",").map(Number) : [];

    const { callApi } = AuthUser();

    const initialPostFor = searchParams.get("post_for") || "sell";
    const initialPropertyType =
        parseInt(searchParams.get("property_type"), 10) || null;
    const initialPropertyFor =
        parseInt(searchParams.get("property_for"), 10) || null;
    const budget = searchParams.get("property_budget");
    const gender = searchParams.get("gender")


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


    // useEffect(() => {
    //     if(localities) {
    //         setLocationData(localities)
    //     }
    // }, [localities])


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
        setActiveTab(value);
    };
    const handleSearchClick = () => {
        const selectedCityIds = selectedLocation.map(
            (location) => location.value
        );
        let data = {};
        const budget = searchParams.get("property_budget");
        const gender = searchParams.get("gender")
        if(locationData) {
            data.location_data = encodeURIComponent(JSON.stringify(locationData));
        }

        if(searchBudget) {
            data.property_budget = searchBudget;
        } else if(budget) {
            data.property_budget = budget;
        }

        if(searchGender) {
            data.gender = searchGender; 
        } else if(gender) {
            data.gender = gender;
        }
        let query = {};
        if (selectedCityIds.length) query.city_id = selectedCityIds.join(",");
        if (selectedPropertyType?.category_id) query.property_type = selectedPropertyType.category_id;
        if (selectedPropertyFor?.sub_category_id) query.property_for = selectedPropertyFor.sub_category_id;
        if (selectedPostFor) query.post_for = selectedPostFor;

        router.push({
            pathname: "/property-listing",
            query: {
                ...query,
                ...data
            },
        });
    };
    const toggleAdvancedFilter = () => {
        if (selectedPropertyType) {
            setAdvancedFilterVisible(!isAdvancedFilterVisible);
        }
    };
    const handleViewProperty = (loadMore, recent_page) => {
        // console.log("advance search location data", locationData);
        // return;
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
        if(locationData) {
            existingParams.set("location_data", encodeURIComponent(JSON.stringify(locationData)))
        }
        if(!loadMore) {
            router.push(`/property-listing?${existingParams.toString()}`);
        }
        const searchPayload = Object.fromEntries(existingParams.entries());
        // console.log("advance search search payload", searchPayload);
        if(locationData) {
            searchPayload.locality = locationData
        }
        callApi({
            api: `/advance_search_result?recent_page=${recent_page || 1}&user_id=${memberId}`,
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

                    setTotalPages(response?.data?.pagination?.total_pages || 0);
                    setCurrentPages(response?.data?.pagination?.current_page || 0)
                    
                } else {
                    setAdvanceSearchData(response);
                    toast.error(
                        response?.message || "Error fetching properties"
                    );
                    setTotalPages(response?.data?.pagination?.total_pages || 0);
                    setCurrentPages(response?.data?.pagination?.current_page || 0)
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


    useEffect(() => {
        if(filtersToUse?.length > 0) {
            const firstValue = filtersToUse[0];
            if(!selectedFilter) {
                setSelectedFilter(firstValue?.key)
            }
        }
    }, [filtersToUse])


    useEffect(() => {
        if(postFor) {
            setActiveTab(postFor);
        }
    }, [postFor])

    useEffect(() => {
        if(gender) {
            setSearchGender(gender);
        }
        if(budget) {
            setSearchBudget(budget);
        }
    }, [gender, budget]);

    return (
        <div className="short-banner pt-4">
        <div className="container-fluid">
          {/* <h1>{translation?.property_list || "Property List"}</h1> */}
          <div className="search-form">
            {/* SEARCH FORM  */}
            <form id="searchfilter">
              <div className="row gx-3">
                <Col className="col-lg-auto col-sm-2 col-auto">
                  <Dropdown className="d-grid select-dropdown">
                    <Dropdown.Toggle
                      variant="light"
                      className="btn-form-control"
                    >
                      {postFor === "sell"
                        ? translation?.buy || "Buy"
                        : translation?.rent || "Rent"}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item
                        onClick={() => handlePostForTabChange("sell")}
                      >
                        {translation?.buy || "Buy"}
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => handlePostForTabChange("rent")}
                      >
                        {translation?.rent || "Rent"}
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>

                <Col className="col-lg col-sm-10">
                  <LocalityOption setLocalityData={setLocalityData} />
                </Col>
                {postFor === "buy" || postFor === "rent" && (
                  <>
                    <div className="col-lg col-sm-4 col-12">
                      <Dropdown className="select-dropdown d-grid">
                        <Dropdown.Toggle className="btn-form-control">
                          Residential
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="p-3">
                          <Nav variant="underline" className="mb-3">
                            <Nav.Item>
                              <Nav.Link role="button" className="active">
                                Residential
                              </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                              <Nav.Link role="button">Commercial</Nav.Link>
                            </Nav.Item>
                          </Nav>
                          {["radio"].map((type) => (
                            <ButtonGroup className="btn-group-light d-flex gap-2 column-2">
                              <input
                                type="radio"
                                className="btn-check"
                                name="residential"
                                id={`inline-residential-1`}
                              />
                              <label
                                className="btn btn-outline-light"
                                htmlFor={`inline-residential-1`}
                              >
                                Apartment
                              </label>
                              <input
                                type="radio"
                                className="btn-check"
                                name="residential"
                                id={`inline-residential-2`}
                              />
                              <label
                                className="btn btn-outline-light"
                                htmlFor={`inline-residential-2`}
                              >
                                Flat
                              </label>
                              <input
                                type="radio"
                                className="btn-check"
                                name="residential"
                                id={`inline-residential-3`}
                              />
                              <label
                                className="btn btn-outline-light"
                                htmlFor={`inline-residential-3`}
                              >
                                Villa
                              </label>
                              <input
                                type="radio"
                                className="btn-check"
                                name="residential"
                                id={`inline-residential-4`}
                              />
                              <label
                                className="btn btn-outline-light"
                                htmlFor={`inline-residential-4`}
                              >
                                Penthouse
                              </label>
                              <input
                                type="radio"
                                className="btn-check"
                                name="residential"
                                id={`inline-residential-5`}
                              />
                              <label
                                className="btn btn-outline-light"
                                htmlFor={`inline-residential-5`}
                              >
                                Plot
                              </label>
                              <input
                                type="radio"
                                className="btn-check"
                                name="residential"
                                id={`inline-residential-6`}
                              />
                              <label
                                className="btn btn-outline-light"
                                htmlFor={`inline-residential-6`}
                              >
                                Townhouse
                              </label>
                            </ButtonGroup>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                    <div className="col-lg col-sm-4 col-12">
                      <Dropdown className="select-dropdown d-grid">
                        <Dropdown.Toggle className="btn-form-control">
                          Bed & Bath
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="p-3">
                          <Nav variant="underline" className="mb-3">
                            <Nav.Item>
                              <Nav.Link role="button" className="active">
                                Beds
                              </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                              <Nav.Link role="button">Baths</Nav.Link>
                            </Nav.Item>
                          </Nav>
                          {["radio"].map((type) => (
                            <ButtonGroup className="btn-group-light d-flex gap-2">
                              <input
                                type="checkbox"
                                className="btn-check"
                                name="beds"
                                id={`inline-bed-1`}
                              />
                              <label
                                className="btn btn-outline-light"
                                htmlFor={`inline-bed-1`}
                              >
                                Studio
                              </label>
                              <input
                                type="checkbox"
                                className="btn-check"
                                name="beds"
                                id={`inline-bed-2`}
                              />
                              <label
                                className="btn btn-outline-light"
                                htmlFor={`inline-bed-2`}
                              >
                                1
                              </label>
                              <input
                                type="checkbox"
                                className="btn-check"
                                name="beds"
                                id={`inline-bed-3`}
                              />
                              <label
                                className="btn btn-outline-light"
                                htmlFor={`inline-bed-3`}
                              >
                                2
                              </label>
                              <input
                                type="checkbox"
                                className="btn-check"
                                name="beds"
                                id={`inline-bed-4`}
                              />
                              <label
                                className="btn btn-outline-light"
                                htmlFor={`inline-bed-4`}
                              >
                                3
                              </label>
                              <input
                                type="checkbox"
                                className="btn-check"
                                name="beds"
                                id={`inline-bed-5`}
                              />
                              <label
                                className="btn btn-outline-light"
                                htmlFor={`inline-bed-5`}
                              >
                                4
                              </label>
                              <input
                                type="checkbox"
                                className="btn-check"
                                name="beds"
                                id={`inline-bed-6`}
                              />
                              <label
                                className="btn btn-outline-light"
                                htmlFor={`inline-bed-6`}
                              >
                                5
                              </label>
                            </ButtonGroup>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                    <div className="col-lg col-sm-4 col-12">
                      <Dropdown className="select-dropdown d-grid">
                        <Dropdown.Toggle className="btn-form-control">
                          Bed & Bath
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="p-3">
                          <Nav variant="underline" className="mb-3">
                            <Nav.Item>
                              <Nav.Link role="button" className="active">
                                Beds
                              </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                              <Nav.Link role="button">Baths</Nav.Link>
                            </Nav.Item>
                          </Nav>
                          {["radio"].map((type) => (
                            <ButtonGroup className="btn-group-light d-flex gap-2">
                              <input
                                type="checkbox"
                                className="btn-check"
                                name="beds"
                                id={`inline-bed-1`}
                              />
                              <label
                                className="btn btn-outline-light"
                                htmlFor={`inline-bed-1`}
                              >
                                Studio
                              </label>
                              <input
                                type="checkbox"
                                className="btn-check"
                                name="beds"
                                id={`inline-bed-2`}
                              />
                              <label
                                className="btn btn-outline-light"
                                htmlFor={`inline-bed-2`}
                              >
                                1
                              </label>
                              <input
                                type="checkbox"
                                className="btn-check"
                                name="beds"
                                id={`inline-bed-3`}
                              />
                              <label
                                className="btn btn-outline-light"
                                htmlFor={`inline-bed-3`}
                              >
                                2
                              </label>
                              <input
                                type="checkbox"
                                className="btn-check"
                                name="beds"
                                id={`inline-bed-4`}
                              />
                              <label
                                className="btn btn-outline-light"
                                htmlFor={`inline-bed-4`}
                              >
                                3
                              </label>
                              <input
                                type="checkbox"
                                className="btn-check"
                                name="beds"
                                id={`inline-bed-5`}
                              />
                              <label
                                className="btn btn-outline-light"
                                htmlFor={`inline-bed-5`}
                              >
                                4
                              </label>
                              <input
                                type="checkbox"
                                className="btn-check"
                                name="beds"
                                id={`inline-bed-6`}
                              />
                              <label
                                className="btn btn-outline-light"
                                htmlFor={`inline-bed-6`}
                              >
                                5
                              </label>
                            </ButtonGroup>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </>
                )}
                <div className="col-lg-auto col-6 mb-3">
                  <div className="d-grid">
                    <Button variant="primary" onClick={handleSearchClick}>
                      {translation?.search || "Search"}
                    </Button>
                  </div>
                </div>
                <div className="col-lg-auto col-6 mb-3">
                  <div className="d-grid">
                    <Button
                      variant="primary"
                      onClick={() => setAdvanceFilter((prev) => !prev)}
                      disabled={selectedPropertyType ? false : true}
                    >
                      {advanceFilter
                        ? translation?.hide_advanced || "Less Filter"
                        : translation?.advanced || "More Filter"}
                    </Button>
                  </div>
                </div>
              </div>

              {/* ADVANCE FILTER  */}
              {selectedPropertyType &&
                postFor !== "pg_hostel" &&
                advanceFilter && (
                  <div
                    className="more-filter-dropdown"
                    style={{
                      display: "flex",
                    }}
                  >
                    <div>
                      <ListGroup>
                        {advanceFilters?.map((item, i) => {
                          return (
                            <ListGroup.Item
                              role="button"
                              className={
                                selectedAdvanceFilter === item?.key
                                  ? "active"
                                  : ""
                              }
                              onClick={() => {
                                setSelectedAdvanceFilter(item?.key);
                                setSelectedSubFilters([]);
                              }}
                            >
                              {item?.name ||
                                `${
                                  translation?.not_available || "Not available"
                                }`}
                            </ListGroup.Item>
                          );
                        })}
                      </ListGroup>
                    </div>
                    <div className="flex-grow-1 p-3">
                      {selectedAdvanceFilter &&
                      (selectedAdvanceFilter === "furnishing" ||
                        selectedAdvanceFilter === "amenities" ||
                        selectedAdvanceFilter === "possession_status") ? (
                        <div>
                          <h5>
                            {translation?.sub_filters_for || "Sub Filters for"}{" "}
                            {
                              filterOptions.find(
                                (f) => f.key === selectedAdvanceFilter
                              ).name
                            }
                          </h5>
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
                                    marginTop: "100px",
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
                            {!dynamicFieldLoading &&
                              dynamicList?.map((item, i) => {
                                if (selectedAdvanceFilter === "furnishing") {
                                  return (
                                    <div key={item?.furnish_id || i}>
                                      <Form.Check
                                        type="checkbox"
                                        label={item?.furnish_name}
                                        id={item?.furnish_id}
                                        onChange={() =>
                                          handleDynamicValueChange(
                                            selectedAdvanceFilter,
                                            item?.furnish_id
                                          )
                                        }
                                        checked={SearchData[
                                          selectedAdvanceFilter
                                        ]?.includes(item?.furnish_id)}
                                      />
                                    </div>
                                  );
                                } else if (
                                  selectedAdvanceFilter === "amenities"
                                ) {
                                  return (
                                    <div key={item?.amenity_id || i}>
                                      <Form.Check
                                        type="checkbox"
                                        label={item?.amenity_name}
                                        id={item?.amenity_id}
                                        onChange={() =>
                                          handleDynamicValueChange(
                                            selectedAdvanceFilter,
                                            item?.amenity_id
                                          )
                                        }
                                        checked={SearchData[
                                          selectedAdvanceFilter
                                        ]?.includes(item?.amenity_id)}
                                      />
                                    </div>
                                  );
                                } else if (
                                  selectedAdvanceFilter === "possession_status"
                                ) {
                                  return (
                                    <div key={item?.status_id || i}>
                                      <Form.Check
                                        type="checkbox"
                                        label={item?.status_name}
                                        id={item?.status_id}
                                        onChange={() =>
                                          handleDynamicValueChange(
                                            selectedAdvanceFilter,
                                            item?.status_id
                                          )
                                        }
                                        checked={SearchData[
                                          selectedAdvanceFilter
                                        ]?.includes(item?.status_id)}
                                      />
                                    </div>
                                  );
                                }
                              })}
                          </div>
                        </div>
                      ) : selectedAdvanceFilter === "carpet_area" ? (
                        <>
                          <div style={{}}>
                            <h5>
                              {" "}
                              {translation?.sub_filters_for_carpet_area ||
                                "sub filters for Carpet Area"}
                            </h5>
                            <div>
                              {subfilterOptions[selectedAdvanceFilter]?.map(
                                (item, i) => {
                                  return (
                                    <div style={{ marginBottom: "8px" }}>
                                      <Form.Check
                                        type="radio"
                                        name="carpet_area"
                                        label={item?.name}
                                        value={item?.id}
                                        checked={
                                          item?.id == SearchData?.carpet_area
                                        }
                                        onChange={handleCarpetAreaChange}
                                      />{" "}
                                    </div>
                                  );
                                }
                              )}
                            </div>
                            <div
                              className="rangeSliderParent"
                              style={{
                                marginTop: "20px",
                                marginBottom: "20px",
                              }}
                            >
                              <RangeSlider
                                value={[0, 1000]}
                                min={0}
                                max={1000}
                                step={1}
                              />
                            </div>
                            <Row>
                              <Col>
                                <Form.Label>
                                  {translation?.min || "Min"}
                                </Form.Label>
                                <Form.Control
                                  type="number"
                                  placeholder="00"
                                  value="0"
                                />
                              </Col>
                              <Col>
                                <Form.Label>
                                  {translation?.max || "Max"}
                                </Form.Label>
                                <Form.Control
                                  type="number"
                                  placeholder="00"
                                  value="1000"
                                />
                              </Col>
                            </Row>
                          </div>
                        </>
                      ) : subfilterOptions[selectedAdvanceFilter] ? (
                        <div>
                          <h5>
                            {translation?.sub_filters_for || "sub filters for"}{" "}
                            {
                              advanceFilters?.find(
                                (item) => item?.key === selectedAdvanceFilter
                              )?.name
                            }
                          </h5>
                          <div>
                            {subfilterOptions[selectedAdvanceFilter]?.map(
                              (subFilter, i) => {
                                return (
                                  <div
                                    key={subFilter.key}
                                    style={{
                                      marginBottom: "8px",
                                    }}
                                  >
                                    <Form.Check
                                      type="checkbox"
                                      label={
                                        ` ${subFilter.name}` ||
                                        `${
                                          translation?.not_available ||
                                          "Not available"
                                        }`
                                      }
                                      id={subFilter.key}
                                      onChange={() =>
                                        handleSubFilterSelection(
                                          selectedAdvanceFilter,
                                          subFilter.key
                                        )
                                      }
                                      checked={SearchData[
                                        selectedAdvanceFilter
                                      ]?.includes(subFilter?.key)}
                                    />
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </div>
                      ) : (
                        selectedAdvanceFilter === "price_range" && (
                          <>
                            <h5>{translation?.price || "Price"}</h5>
                            <div
                              className="rangeSliderParent"
                              style={{
                                marginTop: "20px",
                                marginBottom: "20px",
                              }}
                            >
                              <RangeSlider
                                value={[
                                  SearchData?.min_budget || 0,
                                  SearchData?.max_budget || 1000000,
                                ]}
                                min={0}
                                max={1000000}
                                step={1}
                                onInput={handleMinMaxBudgetChange}
                              />
                            </div>
                            <Row>
                              <Col>
                                <Form.Label>
                                  {translation?.min || "Min"}
                                </Form.Label>
                                <Form.Control
                                  type="number"
                                  placeholder="00"
                                  value={SearchData?.min_budget}
                                  onChange={(e) =>
                                    setSearchData((prev) => ({
                                      ...prev,
                                      min_budget: e?.target?.value,
                                    }))
                                  }
                                />
                              </Col>
                              <Col>
                                <Form.Label>
                                  {translation?.max || "Max"}
                                </Form.Label>
                                <Form.Control
                                  type="number"
                                  placeholder="00"
                                  value={SearchData?.max_budget}
                                  onChange={(e) =>
                                    setSearchData((prev) => ({
                                      ...prev,
                                      max_budget: e?.target?.value,
                                    }))
                                  }
                                />
                              </Col>
                            </Row>
                          </>
                        )
                      )}
                    </div>
                    <button
                      type="button"
                      className="btn btn-success"
                      style={{
                        height: "40px",
                        position: "absolute",
                        bottom: "20px",
                        right: "20px",
                      }}
                      onClick={() => handleViewProperty()}
                    >
                      {translation?.view_property || "View Property"}
                    </button>
                  </div>
                )}
            </form>
          </div>
        </div>
      </div>
    );
};

export default SearchForm;
