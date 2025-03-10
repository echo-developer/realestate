import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import AuthUser from "../Authentication/AuthUser";
import Select from "react-select";
import Locality from "../project/Locality";
import useTranslation from "@/hooks/useTranslation";
import {
  Form,
  Row,
  Col,
  ListGroup,
  Nav,
  ProgressBar,
  FloatingLabel,
  Button
} from "react-bootstrap";
import { ProjectResidentialFilterOption, ProjectCommercialFilterOption, projectSubFilters, filterOptions, } from "../post/PropertyData";

const ProjectFilterPage = ({ selectedLocation, setSelectedLocation, setPerPage }) => {
  const { callApi } = AuthUser();
  const router = useRouter();
  const subFilterRef = useRef({});

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
  const [selectedAdvanceFilter, setSelectedAdvanceFilter] = useState("")
  const [advanceSubFilterOptions, setAdvanceSubFilterOptions] = useState(projectSubFilters);
  const [dynamicFieldLoading, setDynamicFieldLoading] = useState(true);



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
        city_id?.split(",")?.forEach(item => {
          const obj = locationData?.find(data => data?.value == item);
          if (obj) {
            locationArr.push(obj);
          }
        })
      }
      if (locationArr?.length > 0) {
        setSelectedLocation(locationArr);
      }
    }
  }, [router?.query, locationData])

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
    if(router?.isReady) {
      const queryStringToObject = (query) => {
        return Object.entries(query).reduce((acc, [key, value]) => {
            try {
                // Parse the value using JSON.parse, which can handle arrays and strings
                const parsedValue = JSON.parse(value);
    
                // Avoid adding empty strings or empty arrays to the object
                if (parsedValue !== "" && !(Array.isArray(parsedValue) && parsedValue.length === 0)) {
                    acc[key] = parsedValue;
                }
            } catch (e) {
                // If JSON.parse fails, keep the raw value (usually for non-stringified strings)
                if (value !== "") {
                    acc[key] = value;
                }
            }
            return acc;
        }, {});
    };
    const stateObject = queryStringToObject(router?.query);
    setFilters(prev => {
      return {
        ...prev,
        ...stateObject
      }
    })
    }

  }, [router?.query])




  const handleSubmit = (event) => {
    event.preventDefault();

    const objectToQueryString = (obj) => {
      return Object.entries(obj)
          .filter(([_, value]) => {
              return value !== "" && value !== null && value !== undefined && !(Array.isArray(value) && value.length === 0);
          })
          .map(([key, value]) => {
              // Stringify each value
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
    setFilters(prev => {
      return {
        ...prev,
        address: place
      }
    })
  }

  const handleSelecteAdvanceFilter = (key) => {
    setAdvanceFilter(key);
    subFilterRef.current[key]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest", 
      inline: "start",
    });
  }

  const advanceFilterOption = filters?.project_type == 1 ? ProjectResidentialFilterOption : ProjectCommercialFilterOption;


  const handleAdvanceFilterDataChange = (e, type) => {
    const { name, value } = e?.target;

    if (type === "checkbox") {
        const state = filters[name] || [];
        const updatedState = state.includes(value)
            ? state.filter((item) => item !== value) // Remove value if it exists
            : [...state, value]; // Add value if it doesn't exist

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
            // Exclude empty strings, null, undefined, and empty arrays
            return value !== "" && value !== null && value !== undefined && !(Array.isArray(value) && value.length === 0);
        })
        .map(([key, value]) => {
            // Stringify each value
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

}

  const advanceFilterMinMaxDataChange = (e, type) => {

    
    const { name, value } = e.target;
    const state = filters?.[name] || {min: 0, max: 0};

    if(type === "min") {
      state.min = value
    } else if(type === "max") {
      state.max = value;
    }

    setFilters(prev => {
      return {
        ...prev,
        [name]: {
          min: state?.min,
          max: state?.max,
        }
      }
    })
  }



  const renderSubOptions = (key) => {
    const filteredOption = advanceSubFilterOptions[key]
    const subFilterHeading = advanceFilterOption?.find(item => item.key === key)?.name;

    if ((key == "project_amenity") || (key == "project_furnish")) {
      if (key == "project_amenity") {
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
              {filteredOption?.options?.map((item, i) => {
                const stringifiedId = item?.amenity_id?.toString();
                return (
                  <div key={i}>
                    <input type="checkbox" name="project_amenity" value={item?.amenity_id} checked={filters?.[selectedAdvanceFilter]?.includes(stringifiedId)} onClick={(e) => handleAdvanceFilterDataChange(e, "checkbox")} />
                    <span>{item?.amenity_name || "Not available"}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )
      } else if (key == "project_furnish") {
        return (
          <div>
            <h4>Sub Filters for {subFilterHeading}</h4>
            <div>
              {filteredOption?.options?.map((item, i) => {
                const stringifiedId = item?.furnish_id?.toString();
                return (
                  <div key={i}>
                    <input type="checkbox" name="project_furnish" value={item?.furnish_id} checked={filters?.project_furnish?.includes(stringifiedId)} onClick={(e) => handleAdvanceFilterDataChange(e, "checkbox")} />
                    <span>{item?.furnish_name || "Not available"}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )
      }
    } else if (filteredOption?.type === "min_max") {
      return (
        <div>
          <h4>Sub Filters for {subFilterHeading} </h4>
          <div>
            <div
              aria-labelledby="budget-dropdown"
              className="p-3 shadow bg-white rounded dropdown-menu show"
              style={{
                position: "absolute",
                inset: "0px auto auto 0px",
                transform: "translate(8px, 40px)",
              }}
            >
              <div className="d-flex justify-content-between">
                <label>Minimum</label>
                <label>Maximum</label>
              </div>

              <div className="d-flex gap-2">
                <input className="form-control" placeholder="0" name={key} type="number" value={filters?.[key]?.min} onChange={(e) => advanceFilterMinMaxDataChange(e, "min")} />
                <input className="form-control" placeholder="Any" name={key} type="number" value={filters?.[key]?.max} onChange={(e) => advanceFilterMinMaxDataChange(e, "max")} />
              </div>
            </div>
          </div>

        </div>

      )
    }
     else {
      if (filteredOption?.type === "checkbox") {
        return (
          <div>
            <h4>Sub Filters for {subFilterHeading}</h4>
            <div>
              {filteredOption?.options?.map((item, i) => {
                return (
                  <div key={i}>
                    <input type="checkbox" name={key} value={item?.key} checked={filters?.[selectedAdvanceFilter]?.includes(item?.key.toString())} onClick={(e) => handleAdvanceFilterDataChange(e, "checkbox")} />
                    <span>{item?.value || "Not available"}</span>
                  </div>
                )
              })}
            </div>
          </div>

        )
      } 
    }
  }
  return (
    <div>
      <div className="filterHeader d-lg-none">
        <h4> {translation?.filters ||"Filters"}</h4>
        <a className="float-end" id="filter" title="Filter">
          <i className="icon-feather-filter f20"></i>
        </a>
      </div>
      <div className="filter">
        <div className="acc-panel">
          <form id="projectSearchFilter" onSubmit={handleSubmit}>
            <Row className="gx-3">
              <Col className="col-lg-3 col-sm-6 col-12">
                <Form.Group className="mb-3" controlId="city">
                  {/* <Form.Label>{translation?.city ||"City"}</Form.Label>   */}
                  <Select
                    isMulti
                    name="locations"
                    options={locationData}
                    value={selectedLocation}
                    onChange={handleLocationChange}
                    placeholder={translation?.choose_location || "Choose Location"}
                    styles={{
                      menu: (provided) => ({
                        ...provided,
                        zIndex: 9999, // increase z-index here
                      }),
                    }}
                  />
                </Form.Group>
              </Col>
              <Col className="col-lg-3 col-sm-6 col-12">
                <Locality locality={filters?.address} setLocality={setAddress} />
              </Col>
              <Col className="col-lg-3 col-sm-6 col-12">
                <FloatingLabel
                  controlId="address"
                  label={translation?.address || "Address"}
                  className="mb-3"
                >
                  <Form.Control
                    type="text"
                    name="project_name"
                    placeholder={translation?.project_name || "Project Name"}
                    value={filters.project_name}
                    onChange={handleInputChange}
                  />
                </FloatingLabel>
              </Col>

              <Col className="col-lg-3 col-sm-6 col-12">
                <FloatingLabel
                  controlId="project_name"
                  label={translation?.project_name || "Project Name"}
                  className="mb-3"
                >
                  <Form.Select
                    name="project_type"
                    value={filters.project_type}
                    onChange={handleInputChange}
                  >
                    <option value="">{translation?.select_property_type || "Select Property Type"}</option>
                    {propertyTypeData?.map((property, i) => (
                      <option value={property?.category_id} key={i}>
                        {property?.category_name || `${translation?.not_available || "Not available"}`}
                      </option>
                    ))}
                  </Form.Select>
                </FloatingLabel>
              </Col>

              <Col className="col-lg-3 col-sm-6 col-12">
                <FloatingLabel
                  controlId="project_name"
                  label="Property For"
                  className="mb-3"
                >
                  <Form.Select
                    name="project_for"
                    value={filters.project_for}
                    onChange={handleInputChange}
                  >
                    <option value="">{translation?.select_property_for || "Select Property For"}</option>
                    <option value="sale">{translation?.for_sale || "For Sale"}</option>
                    <option value="rent">{translation?.for_rent || "For Rent"}</option>
                  </Form.Select>
                </FloatingLabel>
              </Col>

              <Col className="col-lg-3 col-sm-6 col-12">
                <FloatingLabel
                  controlId="project_name"
                  label="Possession Status"
                  className="mb-3"
                >
                  <Form.Select
                    className={`${errors.possession_status ? "is-invalid" : ""
                      }`}
                    name="possession_status"
                    value={filters.possession_status}
                    onChange={handleInputChange}
                  >
                    <option value="">{translation?.select_possession_status || "Select Possession Status"}</option>
                    {possessionData.map((option) => (
                      <option key={option.status_id} value={option.status_id}>
                        {option.status_name}
                      </option>
                    ))}
                  </Form.Select>
                </FloatingLabel>
              </Col>

              <Col className="col-lg-3 col-sm-6 col-12">
                <FloatingLabel
                  controlId="project_name"
                  label="Possession Status"
                  className="mb-3"
                >
                  <Form.Select
                    name="min_price"
                    value={filters.min_price}
                    onChange={handleInputChange}
                  >
                    <option value="">{translation?.min_budget || "Min Budget"}</option>
                    <option value="500000">5 Lakh</option>
                    <option value="1000000">10 Lakh</option>
                    <option value="2000000">20 Lakh</option>
                    <option value="5000000">50 Lakh</option>
                  </Form.Select>
                </FloatingLabel>
              </Col>

              <Col className="col-lg-3 col-sm-6 col-12">
                <FloatingLabel
                  controlId="project_name"
                  label="Possession Status"
                  className="mb-3"
                >
                  <Form.Select
                    name="max_price"
                    value={filters.max_price}
                    onChange={handleInputChange}
                  >
                    <option value=""> {translation?.max_budget || "Max Budget"}</option>
                    <option value="1000000">10 Lakh</option>
                    <option value="2000000">20 Lakh</option>
                    <option value="5000000">50 Lakh</option>
                    <option value="10000000">1 Cr</option>
                  </Form.Select>
                </FloatingLabel>
              </Col>
              <Col className="col-lg-auto col-6 mb-3">
                <div className="d-grid">
                  <Button variant="primary" onClick={() => setAdvanceFilter(!advanceFilter)}>
                    Advanced
                  </Button>
                </div>
              </Col>

              <Col className="col-lg-3 col-sm-6 col-12">
                <div className="d-grid mb-3">
                  <button type="submit" className="form-control btn btn-primary">
                    {translation?.submit || "Submit"}
                  </button>
                </div>
              </Col>
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
                    zIndex: "2"
                  }}
                >
                  <div>
                    <ul className="list-group">
                      {advanceFilterOption?.map((option, i) => {
                        return (
                          <li className="list-group-item" key={i} style={{ cursor: "pointer", fontWeight: "bold" }} onClick={() => handleSelecteAdvanceFilter(option?.key)}>
                            {option?.name || ""}
                          </li>
                        )
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
                        <div key={option?.key} ref={(el) => subFilterRef.current[option?.key] = el}>
                          {renderSubOptions(option?.key)}
                        </div>
                      )
                    }
                    )}
                  </div>


                  <button
                    type="button"
                    className="btn btn-success"
                    style={{ height: "40px", position: "absolute", bottom: "20px", right: "20px" }}
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
