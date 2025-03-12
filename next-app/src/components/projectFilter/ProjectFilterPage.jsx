import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import AuthUser from "../Authentication/AuthUser";
import Select from "react-select";
import Locality from "../project/Locality";
import useTranslation from "@/hooks/useTranslation";
import LocalityOption from "@/components/MapData/LocalitySelector";
import {
  Form,
  Row,
  Col,
  Dropdown,
  Nav,
  ProgressBar,
  FloatingLabel,
  Button,
} from "react-bootstrap";
import {
  ProjectResidentialFilterOption,
  ProjectCommercialFilterOption,
  projectSubFilters,
  filterOptions,
} from "../post/PropertyData";

const ProjectFilterPage = ({
  selectedLocation,
  setSelectedLocation,
  setPerPage,
}) => {
  const { callApi } = AuthUser();
  const router = useRouter();
  const subFilterRef = useRef({});
  const [localityData, setLocalityData] = useState(null);
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
    setSubBudget1Dropdown(false)
  };
  const handleMaxChange = (e) => {
    const value = e.target.value;
    setMaxBudget(value);
    if (minBudget && Number(value) < Number(minBudget)) {
      setError("Max budget cannot be less than min budget.");
    } else {
      setError("");
    }
    setSubBudget2Dropdown(false)
  };
  const resetBudget = () => {
    setMinBudget("");
    setMaxBudget("");
    setError("");
    setBudgetDropdown(false); // Close dropdown
  };
  const applyBudget = () => {
    if (!error) {
      setBudgetDropdown(false); // Close dropdown
    }
  };
  const budgetOptions = [50000, 100000, 200000, 300000, 500000];
  const toggleBudgetDropdown = () => setBudgetDropdown((prev) => !prev);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  useEffect(() => {
    FetchPossessionData();
  }, []);

  const getDisplayText = () => {
    if (minBudget && maxBudget) return `$${minBudget} - $${maxBudget}`;
    if (minBudget) return `Min: $${minBudget}`;
    if (maxBudget) return `Max: $${maxBudget}`;
    return "Select Budget";
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

  const handleLocationChange = (selectedOptions) => {
    setSelectedLocation(selectedOptions);
    const selectedCities = selectedOptions.map((option) => option.value);
    setFilters((prevFilters) => ({
      ...prevFilters,
      city_id: selectedCities.join(","),
    }));
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

  // useEffect(() => {
  //   if (router?.isReady) {
  //     setFilters((prev) => ({
  //       ...prev,
  //       ...router?.query,
  //     }));

  //   }
  // }, [router?.query]);

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
        } else {
          toast.error(response?.message);
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
    if (queryString) {
      router.push(`/project-listing?${queryString}`);
    }
  };

  const setAddress = (place) => {
    setFilters((prev) => {
      return {
        ...prev,
        address: place,
      };
    });
  };

  const handleSelecteAdvanceFilter = (key) => {
    setAdvanceFilter(key);
    subFilterRef.current[key]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
  };

  const advanceFilterOption =
    filters?.project_type == 1
      ? ProjectResidentialFilterOption
      : ProjectCommercialFilterOption;

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
  };

  const advanceFilterMinMaxDataChange = (e, type) => {
    const { name, value } = e.target;
    const state = filters?.[name] || { min: 0, max: 0 };

    if (type === "min") {
      state.min = value;
    } else if (type === "max") {
      state.max = value;
    }

    setFilters((prev) => {
      return {
        ...prev,
        [name]: {
          min: state?.min,
          max: state?.max,
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
          <div>
            <h4>Sub Filters for {subFilterHeading}</h4>
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
                  <div key={i}>
                    <input
                      type="checkbox"
                      name="project_amenity"
                      value={item?.amenity_id}
                      checked={filters?.project_amenity?.includes(
                        stringifiedId
                      )}
                      onChange={(e) =>
                        handleAdvanceFilterDataChange(e, "checkbox")
                      }
                    />
                    <span>{item?.amenity_name || "Not available"}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      } else if (key === "project_furnish") {
        return (
          <div>
            <h4>Sub Filters for {subFilterHeading}</h4>
            <div>
              {filteredOption?.options?.map((item, i) => {
                const stringifiedId = item?.furnish_id?.toString();
                return (
                  <div key={i}>
                    <input
                      type="checkbox"
                      name="project_furnish"
                      value={item?.furnish_id}
                      checked={filters?.project_furnish?.includes(
                        stringifiedId
                      )}
                      onChange={(e) =>
                        handleAdvanceFilterDataChange(e, "checkbox")
                      }
                    />
                    <span>{item?.furnish_name || "Not available"}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }
    } else if (filteredOption?.type === "min_max") {
      return (
        <div>
          <h4>Sub Filters for {subFilterHeading}</h4>
          <div>
            <div className="d-flex justify-content-between">
              <label htmlFor={`${key}-min`}>Minimum</label>
              <label htmlFor={`${key}-max`}>Maximum</label>
            </div>

            <div className="d-flex gap-2">
              <input
                id={`${key}-min`}
                className="form-control"
                placeholder="Minimum"
                name={`${key}-min`}
                type="number"
                min="0"
                value={filters?.[key]?.min || ""}
                onChange={(e) => advanceFilterMinMaxDataChange(e, "min")}
              />
              <input
                id={`${key}-max`}
                className="form-control"
                placeholder="Maximum"
                name={`${key}-max`}
                type="number"
                min="0"
                value={filters?.[key]?.max || ""}
                onChange={(e) => advanceFilterMinMaxDataChange(e, "max")}
              />
            </div>
          </div>
        </div>
      );
    } else if (filteredOption?.type === "checkbox") {
      return (
        <div>
          <h4>Sub Filters for {subFilterHeading}</h4>
          <div>
            {filteredOption?.options?.map((item, i) => (
              <div key={i}>
                <input
                  type="checkbox"
                  name={key}
                  value={item?.key}
                  checked={filters?.[key]?.includes(item?.key.toString())}
                  onChange={(e) => handleAdvanceFilterDataChange(e, "checkbox")}
                />
                <span>{item?.value || "Not available"}</span>
              </div>
            ))}
          </div>
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
              <Col className="col-lg-auto col-sm-2 col-auto">
                <Dropdown className="d-grid select-dropdown">
                  <Dropdown.Toggle variant="light" className="btn-form-control">
                    Rent
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item
                      onClick={() => handlePostForTabChange("sell")}
                    >
                      {translation?.buy || "Sell"}
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => handlePostForTabChange("rent")}
                    >
                      {translation?.rent || "Rent"}
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
              {/* <Col className="col-lg-3 col-sm-6 col-12">
                <Locality
                  locality={filters?.address}
                  setLocality={setAddress}
                />
              </Col> */}
              <Col className="col-lg-3 col-sm-6 col-12">
                <LocalityOption setLocationData={setLocalityData} />
              </Col>
              <Col className="col-lg-2 col-sm-6 col-12">
                <Form.Select
                  name="project_type"
                  value={filters.project_type}
                  onChange={handleInputChange}
                >
                  <option value="">
                    {translation?.select_property_type ||
                      "Select Property Type"}
                  </option>
                  {propertyTypeData?.map((property, i) => (
                    <option value={property?.category_id} key={i}>
                      {property?.category_name ||
                        `${translation?.not_available || "Not available"}`}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col className="col-lg-2 col-sm-6 col-12">
                <Form.Select
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
                </Form.Select>
              </Col>
              <Col className="col-lg-2 col-sm-6 col-12">
                <Dropdown
                  className="select-dropdown d-grid mb-3"
                  show={BudgetDropdown}
                  onToggle={toggleBudgetDropdown}
                >
                  <Dropdown.Toggle
                    className="btn-form-control"
                    id="budget-dropdown"
                    onClick={() => setBudgetDropdown((prev) => !prev)}
                  >
                    {getDisplayText()}
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="p-3 shadow bg-white rounded">
                    <Row className="gx-2">
                      <Col className="col-6">
                        <Form.Group className="dropdown minMax">
                          <Form.Label>Minimum</Form.Label>
                          <input
                            type="number"
                            className="form-control"
                            placeholder="00"
                            value={minBudget}
                            onChange={handleMinChange}
                            onClick={() => setSubBudget1Dropdown(true)} 
                          />
                          {subBudget1Dropdown && (
                            <Dropdown.Menu
                              style={{ display: "block", marginTop: "32px" }}
                            >
                              {budgetOptions.map((amount) => (
                                <Dropdown.Item
                                  key={amount}
                                  onClick={() => handleBud1InputClick(amount)}
                                >
                                  ${amount}
                                </Dropdown.Item>
                              ))}
                            </Dropdown.Menu>
                          )}
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
                            onClick={() => setSubBudget2Dropdown(true)}
                          />
                          {subBudget2Dropdown && (
                            <Dropdown.Menu
                              style={{ display: "block", marginTop: "32px" }}
                            >
                              {budgetOptions.map((amount) => (
                                <Dropdown.Item
                                  key={amount}
                                  onClick={() => handleBud2InputClick(amount)}
                                >
                                  ${amount}
                                </Dropdown.Item>
                              ))}
                            </Dropdown.Menu>
                          )}
                        </Form.Group>
                      </Col>
                    </Row>

                    {/* Validation Message */}
                    {error && <div className="text-danger mt-2">{error}</div>}

                    {/* Buttons */}
                    <div className="d-flex justify-content-between mt-3">
                      <Button variant="outline-secondary" onClick={resetBudget}>
                        Reset
                      </Button>
                      <Button
                        variant="primary"
                        onClick={() => {
                          applyBudget();
                        }}
                        disabled={!!error}
                      >
                        Done
                      </Button>
                    </div>
                  </Dropdown.Menu>
                </Dropdown>
              </Col>

              <Col className="col-lg-auto col-6 mb-3">
                <div className="d-grid">
                  <Button variant="primary" type="submit">
                    Search
                  </Button>
                </div>
              </Col>

              <Col className="col-lg-auto col-6 mb-3">
                <div className="d-grid">
                  <Button
                    variant="primary"
                    onClick={() => setAdvanceFilter(!advanceFilter)}
                  >
                    Advanced
                  </Button>
                </div>
              </Col>

              {/* <Col className="col-lg-auto col-6 mb-3">
                <div className="d-grid">
                  <Button variant="primary">Clear</Button>
                </div>
              </Col> */}
            </Row>

            {advanceFilter && (
              <>
                <div
                  style={{
                    display: "inline-flex",
                    background: "white",
                    padding: "1rem",
                    marginTop: "2px",
                    position: "absolute",
                    right: "0px",
                    width: "700px",
                    border: "1px solid #ddd",
                    columnGap: "1rem",
                    zIndex: "2",
                  }}
                >
                  <div>
                    <ul className="list-group">
                      {advanceFilterOption?.map((option, i) => {
                        return (
                          <li
                            className="list-group-item"
                            key={i}
                            style={{ cursor: "pointer", fontWeight: "bold" }}
                            onClick={() =>
                              handleSelecteAdvanceFilter(option?.key)
                            }
                          >
                            {option?.name || ""}
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  <div
                    style={{
                      width: "100%",
                      height: "300px",
                      overflowY: "auto",
                    }}
                  >
                    {advanceFilterOption?.map((option, i) => {
                      return (
                        <div
                          key={option?.key}
                          ref={(el) => (subFilterRef.current[option?.key] = el)}
                        >
                          {renderSubOptions(option?.key)}
                        </div>
                      );
                    })}
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
                    onClick={handleViewProperty}
                  >
                    View Property
                  </button>
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
