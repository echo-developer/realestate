import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import AuthUser from "../Authentication/AuthUser";
import useTranslation from "@/hooks/useTranslation";
import { Form, Row, Col, ListGroup, Dropdown, Button, ButtonGroup } from "react-bootstrap";
import {
  ProjectResidentialFilterOption,
  ProjectCommercialFilterOption,
  projectSubFilters,
  filterOptions,
} from "../post/PropertyData";
import { useAuth } from "@/context/AuthProvider";
import Locality from "../Locality/Locality";

const ProjectFilterPage = ({ setPerPage, toggleDropdown, handleClickOutside, dropdownState, setIsOverlayVisible, showMapView, setShowMapView }) => {
  const { currency, currencyCode } = useAuth();
  const { callApi } = AuthUser();
  const router = useRouter();
  const subFilterRef = useRef({});
  // const [localityData, setLocalityData] = useState(null);
  const [locality, setLocality] = useState(null);
  const [selectedOption, setSelectedOption] = useState("rent");
  const [filters, setFilters] = useState({
    city_id: "",
    address: "",
    project_name: "",
    project_type: "",
    project_for: "",
    possession_status: "",
    min_price: "",
    max_price: "",
  });
  const translation = useTranslation();
  const [errors, setErrors] = useState({});
  const [locationData, setLocationData] = useState([]);
  const [propertyTypeData, setPropertyTypeData] = useState([]);
  const [possessionData, setPossessionData] = useState([]);
  const [advanceFilter, setAdvanceFilter] = useState(false);
  const [selectedAdvanceFilter, setSelectedAdvanceFilter] = useState("");
  const [advanceSubFilterOptions, setAdvanceSubFilterOptions] =
    useState(projectSubFilters);
  const [error, setError] = useState("");
  const [dynamicFieldLoading, setDynamicFieldLoading] = useState(true);
  const [BudgetDropdown, setBudgetDropdown] = useState(false);
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [subBudget1Dropdown, setSubBudget1Dropdown] = useState(false);
  const [subBudget2Dropdown, setSubBudget2Dropdown] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState();





  const handlePostForTabChange = (value) => {
    setSelectedOption(value);
  };

  const handleBud1InputClick = (amount) => {
    setMinBudget(amount);
    setSubBudget1Dropdown((prevState) => !prevState);
  };
  const handleBud2InputClick = (amount) => {
    setMaxBudget(amount);
    setSubBudget2Dropdown((prevState) => !prevState);
  };
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
    // setBudgetDropdown(false);
  };
  const applyBudget = () => {
    if (!error) {
      setBudgetDropdown(false);
    }
  };

  const toggleBudgetDropdown = () => setBudgetDropdown((prev) => !prev);

  const handleInputChange = (name, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
    // toggleDropdown(null);
  };


  useEffect(() => {
    if (router.isReady) {
      let queryValue = router.query.project_for;

      if (queryValue) {
        // Remove unnecessary quotes (if present)
        queryValue = queryValue.replace(/^"|"$/g, "");
        setSelectedOption(queryValue === "sale" ? "sale" : "rent");
      }
    }
  }, [router.isReady, router.query.project_for]);

  const handleSelect = (option) => {
    setSelectedOption(option === "sale" ? "sale" : "rent");
    handlePostForTabChange(option);
  };

  useEffect(() => {
    FetchPossessionData();
  }, []);

  const getDisplayText = () => {
    if (minBudget && maxBudget) return `${currency}${minBudget} - ${currency}${maxBudget}`;
    if (minBudget) return `Min: ${currency}${minBudget}`;
    if (maxBudget) return `Max: ${currency}${maxBudget}`;
    return `${translation?.select_budget || "Select Budget"}`;
  };

  const FetchPossessionData = async () => {
    try {
      const response = await callApi({
        api: `/get_property_status`,
        method: "GET",
      });
      if (response && response.status === 1) {
        setPossessionData(response.data);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to fetch possession status data.");
    }
  };

  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const response = await callApi({
          api: "/get_property_cities",
          method: "GET",
        });
        if (response?.status === 1) {
          const formattedLocations = response.data.map((location) => ({
            value: location.city_id,
            label: location.name,
          }));
          setLocationData(formattedLocations);
        } else {
          toast.error(response?.message || "Error fetching locations");
        }
      } catch (error) {
        toast.error(error?.message || "Error fetching locations");
      }
    };
    fetchLocationData();
  }, []);

  useEffect(() => {
    if (router?.isReady) {
      const { city_id } = router?.query;
      let locationArr = [];
      if (city_id) {
        city_id?.split(",")?.forEach((item) => {
          const obj = locationData?.find((data) => data?.value == item);
          if (obj) {
            locationArr.push(obj);
          }
        });
      }
      if (locationArr?.length > 0) {
        setSelectedLocation(locationArr);
      }
    }
  }, [router?.query, locationData]);

  useEffect(() => {
    const fetchPropertyTypeData = async () => {
      try {
        const response = await callApi({
          api: "/get_property_type",
          method: "GET",
        });
        if (response?.status === 1) {
          setPropertyTypeData(response?.data);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };
    fetchPropertyTypeData();
  }, []);

  useEffect(() => {
    const fetchOptions = async (filterType, url) => {
      setDynamicFieldLoading(true);
      try {
        const args = {
          api: url,
          method: "GET",
        };

        const res = await callApi(args);
        if (res?.status === 1) {
          setAdvanceSubFilterOptions((prevState) => ({
            ...prevState,
            [filterType]: {
              ...prevState[filterType],
              options: res?.data,
            },
          }));
        }
      } catch (error) {
        console.log(error?.message || "Something went wrong");
      } finally {
        setDynamicFieldLoading(false);
      }
    };

    fetchOptions("project_furnish", "/get_property_furnish");
    fetchOptions("project_amenity", "/get_property_amnity");
  }, []);

  useEffect(() => {
    if (router?.isReady) {
      const queryStringToObject = (query) => {
        return Object.entries(query).reduce((acc, [key, value]) => {
          try {
            const parsedValue = JSON.parse(value);
            if (
              parsedValue !== "" &&
              !(Array.isArray(parsedValue) && parsedValue.length === 0)
            ) {
              acc[key] = parsedValue;
            }
          } catch (e) {
            if (value !== "") {
              acc[key] = value;
            }
          }
          return acc;
        }, {});
      };
      const stateObject = queryStringToObject(router?.query);
      let maxPrice, minPrice;
      if (router.query?.max_price) {
        maxPrice = JSON.parse(router.query?.max_price)
      }
      if (router.query?.min_price) {
        minPrice = JSON.parse(router.query?.min_price)
      }

      if (maxPrice) {
        setMaxBudget(maxPrice);
      }
      if (minPrice) {
        setMinBudget(minPrice);
      }

      setFilters((prev) => {
        return {
          ...prev,
          ...stateObject,
        };
      });
    }
  }, [router?.query]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const objectToQueryString = (obj) => {
      return Object.entries(obj)
        .map(
          ([key, value]) =>
            `${key}=${encodeURIComponent(JSON.stringify(value ?? ""))}`
        )
        .join("&");
    };

    let updatedFilters = { ...filters };

    // if (localityData?.locality) {
    //   updatedFilters.address = localityData.locality;
    // } else {
    //   delete updatedFilters.address;
    // }

    if (selectedOption) {
      updatedFilters.project_for = selectedOption;
    }
    if (locality) {
      updatedFilters.locality = locality;
    }

    updatedFilters.min_price = minBudget ?? "";
    updatedFilters.max_price = maxBudget ?? "";

    const queryString = objectToQueryString(updatedFilters);
    if (queryString) {
      router.push(`/project-listing?${queryString}`);
    }
  };

  const onSelectLocality = (locality) => {
    setLocality(locality)
  }

  const handleSelecteAdvanceFilter = (key) => {
    setAdvanceFilter(key);
    subFilterRef.current[key]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });

  };

  const displayProjectType = (category_id) => {
    if (propertyTypeData?.length > 0) {
      const project = propertyTypeData.find((project, i) => project.category_id == category_id);
      if (project) {
        return project.category_name || "Not Available"
      }
    }
    return 'Select a Project Type';
  }

  // const advanceFilterOption =
  //   filters?.project_type == 1
  //     ? ProjectResidentialFilterOption
  //     : ProjectCommercialFilterOption;

  const advanceFilterOption = ProjectResidentialFilterOption;

  const handleAdvanceFilterDataChange = (e, type) => {
    const { name, value } = e?.target;

    if (type === "checkbox") {
      const state = filters[name] || [];
      const updatedState = state.includes(value)
        ? state.filter((item) => item !== value)
        : [...state, value];

      setFilters((prevFilters) => ({
        ...prevFilters,
        [name]: updatedState,
      }));
    }
  };

  const handleViewProperty = () => {
    const objectToQueryString = (obj) => {
      return Object.entries(obj)
        .filter(([_, value]) => {
          return (
            value !== "" &&
            value !== null &&
            value !== undefined &&
            !(Array.isArray(value) && value.length === 0)
          );
        })
        .map(([key, value]) => {
          const stringifiedValue = JSON.stringify(value);
          return `${key}=${stringifiedValue}`;
        })
        .join("&");
    };
    const queryString = objectToQueryString(filters);
    setAdvanceFilter(false);
    if (queryString) {
      router.push(`/project-listing?${queryString}`);
    }
    handleClickOutside();
  };

  const advanceFilterMinMaxDataChange = (e, type) => {
    const { name, value } = e.target;
    const key = name.replace("-min", "").replace("-max", "");
    const state = filters?.[key] || { min: 0, max: 0 };

    if (type === "min") {
      state.min = value;
    } else if (type === "max") {
      state.max = value;
    }

    setFilters((prev) => {
      return {
        ...prev,
        [key]: {
          ...state,
        },
      };
    });
  };

  const renderSubOptions = (key) => {
    const filteredOption = advanceSubFilterOptions[key];
    const subFilterHeading = advanceFilterOption?.find(
      (item) => item.key === key
    )?.name;

    if (key === "project_amenity" || key === "project_furnish") {
      if (key === "project_amenity") {
        return (
          <div className="mb-3">
            <h5>
              {translation?.sub_filters_for || "Sub Filters for"}{" "}
              {subFilterHeading}
            </h5>

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
                           0% { transform: rotate(0deg); }
                           100% { transform: rotate(360deg); }
                       }
                     `}
                </style>
              </>
            )}
            {filteredOption?.options?.map((item, i) => {
              const stringifiedId = item?.amenity_id?.toString();
              return (
                <>
                  <Form.Check
                    key={i}
                    inline
                    type="checkbox"
                    label={item?.amenity_name || "Not available"}
                    name="project_amenity"
                    value={item?.amenity_id}
                    checked={filters?.project_amenity?.includes(stringifiedId)}
                    onChange={(e) =>
                      handleAdvanceFilterDataChange(e, "checkbox")
                    }
                  />
                </>
              );
            })}
          </div>
        );
      } else if (key === "project_furnish") {
        return (
          <div>
            <h5>
              {translation?.sub_filters_for || "Sub Filters for"}{" "}
              {subFilterHeading}
            </h5>
            <div className="mb-3">
              {filteredOption?.options?.map((item, i) => {
                const stringifiedId = item?.furnish_id?.toString();
                return (
                  <Form.Check
                    key={i}
                    inline
                    type="checkbox"
                    label={item?.furnish_name || "Not available"}
                    name="project_furnish"
                    id={`furnish${item?.furnish_id}`}
                    value={item?.furnish_id}
                    checked={filters?.project_furnish?.includes(stringifiedId)}
                    onChange={(e) =>
                      handleAdvanceFilterDataChange(e, "checkbox")
                    }
                  />
                );
              })}
            </div>
          </div>
        );
      }
    } else if (filteredOption?.type === "min_max") {
      return (
        <div>
          <h5>
            {translation?.minimum || "Minimum"} {subFilterHeading}
          </h5>
          <Row className="gx-3">
            <Col>
              <Form.Group className="mb-3">
                <Form.Label htmlFor={`${key}-min`}>
                  {translation?.minimum || "Minimum"}
                </Form.Label>
                <Form.Control
                  type="number"
                  id={`${key}-min`}
                  name={`${key}-min`}
                  min="0"
                  value={filters?.[key]?.min || ""}
                  onChange={(e) => advanceFilterMinMaxDataChange(e, "min")}
                  placeholder={translation?.minimum || "Minimum"}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label htmlFor={`${key}-max`}>
                  {translation?.maximum || "Maximum"}
                </Form.Label>
                <Form.Control
                  type="number"
                  id={`${key}-max`}
                  name={`${key}-max`}
                  min="0"
                  value={filters?.[key]?.max || ""}
                  onChange={(e) => advanceFilterMinMaxDataChange(e, "max")}
                  placeholder={translation?.maximum || "Maximum"}
                />
              </Form.Group>
            </Col>
          </Row>
        </div>
      );
    } else if (filteredOption?.type === "checkbox") {
      return (
        <div className="mb-3">
          <h5>
            {translation?.sub_filters_for || "Sub Filters for"}{" "}
            {subFilterHeading}
          </h5>
          {filteredOption?.options?.map((item, i) => (
            <>
              <Form.Check
                key={`data_${i}`}
                inline
                type="checkbox"
                label={item?.value || "Not available"}
                name={key}
                id={`data_${item?.key}`}
                value={item?.key}
                checked={filters?.[key]?.includes(item?.key.toString())}
                onChange={(e) => handleAdvanceFilterDataChange(e, "checkbox")}
              />
            </>
          ))}
        </div>
      );
    }
  };

  return (
    <div>
      <div className="filterHeader d-lg-none">
        <h4> {translation?.filters || "Filters"}</h4>
        <a className="float-end" id="filter" title="Filter">
          <i className="icon-feather-filter f20"></i>
        </a>
      </div>
      <div className="filter">
        <div className="acc-panel">
          <form id="projectSearchFilter" onSubmit={handleSubmit}>
            <Row className="gx-3">
              <Col lg='auto' sm={2} xs='auto' onClick={() => toggleDropdown('buy_sell')}>
                <Dropdown className="d-grid select-dropdown" show={dropdownState?.buy_sell}>
                  <Dropdown.Toggle variant="light" className="btn-form-control">
                    {selectedOption == 'rent' ? "Rent" : "Sale"}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item
                      onClick={() =>
                        handleSelect("sale")
                      }
                    >
                      {`${translation?.sale || "Sale"}`}
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() =>
                        handleSelect("rent")
                      }
                    >
                      {`${translation?.rent || "Rent"}`}
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Col>

              <Col lg sm={6} xs={12}>
                {/* <LocalityOption
                  locality={localityData}
                  setLocalityData={setLocalityData}
                /> */}
                <Locality onSelectLocality={onSelectLocality} />
              </Col>
              <Col lg sm={6} xs={12} onClick={() => toggleDropdown('project_type')}>
                <Dropdown className="select-dropdown mb-3 d-grid" show={dropdownState?.project_type}>
                  <Dropdown.Toggle className="btn-form-control">
                    {/* Select Project Type */}
                    {displayProjectType(filters.project_type)}
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="p-3">
                    <div className="mt-3">
                      <div className="form-filed">
                        <ButtonGroup className="btn-group-light d-flex flex-wrap">
                          {propertyTypeData?.map((project, i) => {
                            return (
                              <div className="me-2 mb-2">
                                <input type="radio"
                                  className="btn-check"
                                  name="projectyForGroup"
                                  id={`projectFor-${i}`}
                                  value={project.category_id}
                                  onChange={() => {
                                    handleInputChange('project_type', project.category_id)
                                  }}
                                  checked={
                                    filters.project_type == project.category_id
                                  }
                                />
                                <label className="btn btn-outline-light btn-sm" htmlFor={`projectFor-${i}`}>
                                  {project.category_name || "Not Available"}
                                </label>
                              </div>
                            )
                          })}

                        </ButtonGroup>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between mt-3">
                      <Button variant="outline-secondary" onClick={(e) => {
                        e.stopPropagation();
                        handleInputChange('project_type', "");
                      }}>
                        {translation?.reset || "Reset"}
                      </Button>
                      <Button variant="primary" onClick={(e) => {
                        e.stopPropagation();
                        handleClickOutside()
                      }}>
                        {translation?.done || "Done"}
                      </Button>
                    </div>

                  </Dropdown.Menu>
                </Dropdown>
              </Col>
              <Col lg sm={6} xs={12} onClick={() => toggleDropdown('possession_status')}>
                {/* <Form.Select
                  className={`${errors.possession_status ? "is-invalid" : ""}`}
                  name="possession_status"
                  value={filters.possession_status}
                  onChange={handleInputChange}
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
                </Form.Select> */}
                <Dropdown className="select-dropdown mb-3 d-grid" show={dropdownState?.possession_status}>
                  <Dropdown.Toggle className={`btn-form-control ${errors.possession_status ? "is-invalid" : ""}`}>
                    {filters.possession_status
                      ? possessionData.find(option => option.status_id == filters.possession_status)?.status_name
                      : (translation?.select_possession_status || "Select Possession Status")}
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="p-3">
                    <div className="mt-3">
                      <div className="form-field">
                        <ButtonGroup className="btn-group-light d-flex flex-wrap">
                          {possessionData.map((option, i) => (
                            <div key={option.status_id} className="me-2 mb-2">
                              <input
                                type="radio"
                                className="btn-check"
                                name="possessionStatusGroup"
                                id={`possessionStatus-${i}`}
                                value={option.status_id}
                                onChange={() => handleInputChange('possession_status', option.status_id)}
                                checked={filters.possession_status == option.status_id}
                              />
                              <label className="btn btn-outline-light btn-sm" htmlFor={`possessionStatus-${i}`}>
                                {option.status_name}
                              </label>
                            </div>
                          ))}
                        </ButtonGroup>
                      </div>
                    </div>

                    <div className="d-flex justify-content-between mt-3">
                      <Button
                        variant="outline-secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleInputChange('possession_status', ""); // Reset value
                        }}
                      >
                        {translation?.reset || "Reset"}
                      </Button>
                      <Button
                        variant="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClickOutside(); // Close dropdown
                        }}
                      >
                        {translation?.done || "Done"}
                      </Button>
                    </div>
                  </Dropdown.Menu>
                </Dropdown>

              </Col>
              <Col lg sm={6} xs={12} onClick={() => toggleDropdown("budget")}>
                <Dropdown
                  className="select-dropdown d-grid mb-3"
                  show={dropdownState?.budget}
                  onToggle={toggleBudgetDropdown}
                >
                  <Dropdown.Toggle
                    className="btn-form-control"
                    id="budget-dropdown"
                  // onClick={() => setBudgetDropdown((prev) => !prev)}
                  >
                    {getDisplayText()}
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="p-3 shadow bg-white rounded">
                    <Row className="gx-2">
                      <Col className="col-6">
                        <Form.Group className="dropdown minMax">
                          <Form.Label>
                            {translation?.minimum || "Minimum"}
                          </Form.Label>
                          <input
                            type="number"
                            className="form-control"
                            placeholder="00"
                            value={minBudget}
                            onChange={handleMinChange}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSubBudget1Dropdown(true);
                            }}
                          />
                        </Form.Group>
                      </Col>

                      {/* Maximum Budget */}
                      <Col className="col-6">
                        <Form.Group className="dropdown minMax">
                          <Form.Label>
                            {translation?.maximum || "Maximum"}
                          </Form.Label>
                          <input
                            type="number"
                            className="form-control"
                            placeholder="00"
                            value={maxBudget}
                            onChange={handleMaxChange}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSubBudget2Dropdown(true)
                            }}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    {/* Validation Message */}
                    {error && <div className="text-danger mt-2">{error}</div>}

                    {/* Buttons */}
                    <div className="d-flex justify-content-between mt-3">
                      <Button variant="outline-secondary" onClick={(e) => {
                        e.stopPropagation();
                        resetBudget();
                      }}>
                        {translation?.reset || "Reset"}
                      </Button>
                      <Button
                        variant="primary"
                        onClick={(e) => {
                          e.stopPropagation();
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
              {/* <Col lg='auto' sm={2} xs='auto'>
                <Button style={{ backgroundColor: '#fff', color: '#007bff', border: '1px solid #007bff' }} onClick={() => setShowMapView(!showMapView)}>
                  {showMapView ? (
                    <>
                      <i className="bi bi-list-ul"></i> List View
                    </>
                  ) : (
                    <>
                      <i className="bi bi-geo-alt"></i> Map View
                    </>
                  )}
                </Button>
              </Col> */}

              <Col lg='auto' xs={6} className="mb-3">
                <div className="d-grid columns-2">
                  <Button variant="primary" type="submit">
                    {translation?.search || "Search"}
                  </Button>
                
                  <Button
                    variant="primary"
                    onClick={() => {
                      setAdvanceFilter(!advanceFilter)
                      toggleDropdown('advance')
                    }}
                  >
                    {translation?.advanced || "Advanced"}
                  </Button>
                </div>
              </Col>
            </Row>

            {dropdownState?.advance && (
              <>
                <div className="more-filter-dropdown d-flex">
                  {/* Left Side: Filter List */}
                  <div style={{ minWidth: "200px" }}>
                    <ListGroup style={{ height: "350px", overflowY: "auto" }}>
                      {advanceFilterOption?.map((option, i) => (
                        <ListGroup.Item
                          role="button"
                          key={i}
                          className={selectedAdvanceFilter === option?.key ? "active" : ""}
                          onClick={() => handleSelecteAdvanceFilter(option?.key)}
                        >
                          {option?.name || ""}
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </div>

                  {/* Right Side: Sub Options */}
                  <div className="d-flex flex-column flex-grow-1">
                    {/* Scrollable Filters */}
                    <div className="flex-grow-1 overflow-auto p-3" style={{ maxHeight: "350px" }}>
                      {advanceFilterOption?.map((option, i) => (
                        <div
                          key={option?.key}
                          ref={(el) => (subFilterRef.current[option?.key] = el)}
                        >
                          {renderSubOptions(option?.key)}
                        </div>
                      ))}
                    </div>

                    {/* Button Container */}
                    <div className="p-3 border-top bg-white d-flex justify-content-end">
                      <Button variant="primary" onClick={handleViewProperty}>
                        {/* {translation?.view_property || "View Property"} */}
                        View Projects
                      </Button>
                    </div>
                  </div>
                </div>
              </>


            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProjectFilterPage;
