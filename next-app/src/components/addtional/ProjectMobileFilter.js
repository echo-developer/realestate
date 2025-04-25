"use client";
import React, { useState, useEffect } from "react";
import { ChevronLeft, Plus, X } from "lucide-react";
import AuthUser from "../Authentication/AuthUser";
import { useRouter, useSearchParams } from "next/navigation";
import { CiFilter } from "react-icons/ci";
import {
  Button,
  Offcanvas,
  Nav,
  Form,
  Dropdown,
  DropdownButton,
  ButtonGroup,
} from "react-bootstrap";

const towerOptions = [
  { value: 1, key: "1" },
  { value: 2, key: "2" },
  { value: 3, key: "3" },
  { value: 4, key: "4" },
  { value: 5, key: "5" },
  { value: 6, key: "6" },
  { value: 7, key: "7" },
  { value: 8, key: "8" },
  { value: 9, key: "9" },
  { value: 10, key: "10" },
  { value: 11, key: "11" },
  { value: 12, key: "12" },
  { value: 13, key: "13" },
  { value: 14, key: "14" },
  { value: 15, key: "15" },
];

const facingOptions = [
  { id: 1, key: "north", name: "North" },
  { id: 2, key: "south", name: "South" },
  { id: 3, key: "east", name: "East" },
  { id: 4, key: "west", name: "West" },
  { id: 5, key: "north_east", name: "North-East" },
  { id: 6, key: "north_west", name: "North-West" },
  { id: 7, key: "south_east", name: "South-East" },
  { id: 8, key: "south_west", name: "South-West" },
];

const parkingOptions = [
  { id: 1, key: "av", value: "Available" },
  { id: 2, key: "na", value: "Not Available" },
  { id: 3, key: "uc", value: "Under Construction" },
];

import { toast } from "react-toastify";

export function ProjectMobileFilters({
  showDrop,
  setShowDrop,
  selectedOption,
  handleSortSelection,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { callApi } = AuthUser();
  const [show, setShow] = useState(false);
  const [activeTab, setActiveTab] = useState("sale");
  const [dynamicData, setDynamicData] = useState({});
  const [selectedCity, setSelectedCity] = useState("Kolkata");
  const [budgetRange, setBudgetRange] = useState({
    min_price: 5,
    min_price: 40,
  });
  const [areaRange, setAreaRange] = useState({ min: 500, max: 5000 });
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState("");
  const [selectedPropertyForList, setSelectedPropertyForList] = useState([]);
  const [selectedPropertyFor, setSelectedPropertyFor] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({});
  const [propertyTypeData, setPropertyTypeData] = useState([]);
  const tabs = [
    { key: "sale", value: "Buy" },
    { key: "rent", value: "Rent" },
  ];
  const [showAll, setShowAll] = useState(false);

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
        toast.error(error?.message);
      }
    };
    fetchPropertyTypeData();
  }, []);

  useEffect(() => {
    if(selectedFilters?.project_type) {
      const getSubPropertyType = async () => {
        try {
          const res = await callApi({
            api: `/get_property_for/${selectedFilters?.project_type}`,
            method: "GET",
          });
          if (res && res?.status === 1) {
            setSelectedPropertyForList(res?.data || []);
          } 
        } catch (error) {
          toast.error(res?.message || "Error fetching property for options");
        }
      };

      getSubPropertyType();
    }
  }, [selectedFilters?.project_type]);

  const parseQueryParams = (params) => {
    const queryObject = {};
  
    params.forEach((value, key) => {
      try {
        // Check if the value is a stringified array
        if (value.startsWith("[") && value.endsWith("]")) {
          queryObject[key] = JSON.parse(value).map((item) => {
            if (typeof item === "string" && item.startsWith('"') && item.endsWith('"')) {
              item = item.slice(1, -1); // Remove extra quotes
            }
            return isNaN(item) ? item : Number(item); // Convert to number if possible
          });
        } else if (value.startsWith("{") && value.endsWith("}")) {
          queryObject[key] = JSON.parse(value);
        } else if (value.startsWith('"') && value.endsWith('"')) {
          const cleanedValue = value.slice(1, -1); // Remove extra quotes
          queryObject[key] = isNaN(cleanedValue) ? cleanedValue : Number(cleanedValue);
        } else {
          queryObject[key] = isNaN(value) ? value : Number(value);
        }
      } catch (error) {
        queryObject[key] = value; // Fallback in case JSON parsing fails
      }
    });
  
    return queryObject;
  };
  
  

  useEffect(() => {
    const queryObject =parseQueryParams(searchParams);
    setSelectedFilters(prev => {
      return {
        ...prev,
        ...queryObject
      }
    })


  }, [searchParams])

  useEffect(() => {
    const apiUrls = {
      furnishing: "/get_property_furnish",
      amenities: "/get_property_amnity",
      possession_status: "/get_property_status",
    };

    const fetchAllData = async () => {
      try {
        const apiCalls = Object.entries(apiUrls).map(([key, url]) =>
          callApi({ api: url, method: "GET" }).then((res) => ({
            key,
            data: res?.status === 1 ? res?.data : [],
          }))
        );

        const results = await Promise?.all(apiCalls);

        const formattedData = results?.reduce((acc, { key, data }) => {
          acc[key] = data;
          return acc;
        }, {});

        setDynamicData(formattedData);
      } catch (error) {
        console.error(error?.message || "Something went wrong");
      }
    };

    fetchAllData();
  }, []);

  const handleFilterChange = (filterKey, subfilterKey) => {
    setSelectedFilters((prev) => {
      if (filterKey === 'property_type' || filterKey === "property_for" || filterKey === "possession_status") {
        return {
          ...prev,
          [filterKey]: subfilterKey
        }
      }
      const current = prev[filterKey] || [];
      return {
        ...prev,
        [filterKey]: current?.includes(subfilterKey)
          ? current.filter((item) => item !== subfilterKey)
          : [...current, subfilterKey],
      };
    });

    if (filterKey === "property_type") {
      setSelectedPropertyTypes([subfilterKey])
    }
    if (filterKey === "property_for") {
      setSelectedPropertyFor([subfilterKey]);
    }
  };


  const handlePropertyTypeChange = (filterKey, value) => {
    setSelectedFilters(prev => {
      return {
        ...prev,
        [filterKey]: value
      }
    })
  }

  const amenitiesToShow = showAll
    ? dynamicData?.amenities
    : dynamicData?.amenities?.slice(0, 10);


    const handleViewProject = () => {
      const objectToQueryString = (obj) => {
        return Object.entries(obj)
          .filter(([_, value]) => 
            value !== "" && value !== null && value !== undefined && !(Array.isArray(value) && value.length === 0)
          )
          .map(([key, value]) => {
            if (typeof value === "object" && !Array.isArray(value)) {
              // If value is an object (like occupied_area), stringify without encoding
              return `${key}=${JSON.stringify(value)}`;
            }
      
            if (Array.isArray(value)) {
              // Convert arrays to proper format with double-quoted values
              const arr = JSON.stringify(value.map(String)); 
              return `${key}=${arr}`;
            }
      
            // Wrap string values with double quotes
            return `${key}=%22${value}%22`;
          })
          .join("&");
      };

      const searchData = {
        project_type: selectedFilters.project_type || "",
        possession_status: selectedFilters.possession_status || "",
        min_price: selectedFilters.min_price || "",
        max_price: selectedFilters.max_price || "",
        occupied_area: {
          min: areaRange.min,
          max: areaRange.max,
        },
        total_towers: selectedFilters.total_towers || [],
        project_facing: selectedFilters.project_facing || [],
        parking_availability: selectedFilters.parking_availability || [],
        project_amenity: selectedFilters.project_amenity || [],
        project_furnish: selectedFilters.project_furnish || [],
      };
    
      const urlString = objectToQueryString(searchData);
    
    
      router.push(`/project-listing?${urlString}`);
      setShow(false);
    };
    

    
    const handleResetClick = () => {
      setSelectedFilters({
        "occupied_area": null,  // Object → null
        "project_amenity": [],  // Array → []
        "project_furnish": [],  // Array → []
        "possession_status": "",  // String → ""
        "project_facing": [],  // Array → []
        "total_towers": [],  // Array → []
        "parking_availability": [],  // Array → []
        "property_type": "",  // String → ""
        "property_for": "",  // String → ""
        "min_price": "",  // String → ""
        "max_price": ""  // String → ""
      })
    }

  return (
    <div>
      <div className="d-flex justify-content-between p-3">
        <Button variant="outline-primary" onClick={() => setShow(true)}>
          Filters <CiFilter size={20} />
        </Button>
        <div className="sort-by">
          <DropdownButton
            align="end"
            title={selectedOption}
            id="dropdown-menu-align-end"
            onClick={() => setShowDrop(!showDrop)}
            aria-expanded={showDrop ? "true" : "false"}
          >
            {[
              "Recent",
              "Price - Low to High",
              "Price - High to Low",
              "Size - Low to High",
              "Size - High to Low",
            ].map((option) => (
              <Dropdown.Item
                eventKey="1"
                key={option}
                onClick={() => handleSortSelection(option)}
              >
                {option}
              </Dropdown.Item>
            ))}
          </DropdownButton>
        </div>
      </div>

      {/* Bootstrap Offcanvas */}
      <Offcanvas
        show={show}
        onHide={() => setShow(false)}
        placement="bottom"
        style={{ height: "932px", maxHeight: "932px" }}
      >
        <Offcanvas.Header className="d-block">
          <div className="d-flex justify-content-between mb-3">
            <Button
              variant="link"
              className="p-0 text-decoration-none"
              onClick={() => setShow(false)}
            >
              <ChevronLeft /> Back
            </Button>
            <Button
              variant="link"
              className="p-0 text-danger text-decoration-none"
              onClick={handleResetClick}
            >
              Reset
            </Button>
          </div>
          <div>
            <h6 className="mb-0">
              Filters Applied:{" "}
              {/* ({Object.values(selectedFilters).flat().length}) */}
            </h6>
            <div></div>
          </div>
        </Offcanvas.Header>

        {/* Tabs */}
        <Nav
          variant="pills p-3 justify-content-center"
          activeKey={activeTab}
          onSelect={(tab) => setActiveTab(tab)}
        >
          {tabs.map((tab) => (
            <Nav.Item key={tab.key}>
              <Nav.Link eventKey={tab.key}>{tab.value}</Nav.Link>
            </Nav.Item>
          ))}
        </Nav>

        <Offcanvas.Body>
          {/* Property Types */}
          <h6>Project Type</h6>
          <ButtonGroup className="btn-group-light d-flex gap-2 mb-3">
            {propertyTypeData?.map((type) => (
              <React.Fragment key={type.category_id}>
                <input
                  type="checkbox"
                  className="btn-check"
                  id={`property_${type.category_id}`}
                  // checked={selectedPropertyTypes.includes(type.category_id)}
                  checked={selectedFilters?.project_type == type.category_id}
                  onChange={() =>
                    handlePropertyTypeChange("project_type", type.category_id)
                  }
                />
                <label
                  className={`btn btn-sm ${selectedFilters?.project_type == type.category_id
                      ? "btn-outline-light"
                      : "btn-success"
                    }`}
                  htmlFor={`property_${type.category_id}`}
                >
                  {type.category_name}
                </label>
              </React.Fragment>
            ))}
          </ButtonGroup>

          {/* {selectedPropertyForList.length > 0 && <h6>Property For</h6>}
          <ButtonGroup className="btn-group-light d-flex gap-2 mb-3">
            {selectedPropertyForList?.map((type) => (
              <React.Fragment key={type.sub_category_id}>
                <input
                  type="checkbox"
                  className="btn-check"
                  id={`property_for_data_${type.sub_category_id}`}
                  checked={selectedPropertyFor?.includes(type.sub_category_id) || false}
                  onChange={() =>
                    handleFilterChange("property_for", type.sub_category_id)
                  }
                />
                <label
                  className={`btn btn-sm ${selectedPropertyFor.includes(type.sub_category_id)
                      ? "btn-outline-light"
                      : "btn-success"
                    }`}
                  htmlFor={`property_for_data_${type.sub_category_id}`}
                >
                  {type.sub_category_name}
                </label>
              </React.Fragment>
            ))}
          </ButtonGroup> */}
          {/* Budget */}
          <h6>Budget (in Lakhs)</h6>
          <Form className="d-flex gap-2 mb-3">
            <Form.Control
              type="number"
              placeholder="Min"
              value={selectedFilters?.min_price}
              onChange={(e) =>
                // setBudgetRange({ ...budgetRange, min: Number(e.target.value) })
                setSelectedFilters(prev => {
                  return {
                    ...prev,
                    min_price: Number(e.target.value)
                  }
                })
              }
            />
            <Form.Control
              type="number"
              placeholder="Max"
              value={selectedFilters?.max_price}
              onChange={(e) =>
                // setBudgetRange({ ...budgetRange, max: Number(e.target.value) })
                setSelectedFilters(prev => {
                  return {
                    ...prev,
                    max_price: Number(e.target.value)
                  }
                })
              }
            />
          </Form>

          {/* Area */}
          <h6>Area (in Sq. Ft.)</h6>
          <Form className="d-flex gap-2 mb-3">
            <Form.Control
              type="number"
              placeholder="Min"
              value={selectedFilters?.occupied_area?.min || ""}
              onChange={(e) =>
                // setAreaRange({ ...areaRange, min: Number(e.target.value) })
                setSelectedFilters(prev => {
                  return {
                    ...prev,
                    occupied_area: {
                      ...prev.occupied_area,
                      min: e.target.value
                    }
                  }
                })
              }
            />
            <Form.Control
              type="number"
              placeholder="Max"
              value={selectedFilters?.occupied_area?.max || ""}
              onChange={(e) =>
                // setAreaRange({ ...areaRange, max: Number(e.target.value) })
                setSelectedFilters(prev => {
                  return {
                    ...prev,
                    occupied_area: {
                      ...prev.occupied_area,
                      max: e.target.value
                    }
                  }
                })
              }
            />
          </Form>

          <h6>Amenities</h6>
          <>
            <ButtonGroup className="btn-group-light flex-wrap gap-2 mb-3 btn-group-amenity">
              {amenitiesToShow?.map((amenity) => (
                <React.Fragment key={`amenity_${amenity.amenity_id}`}>
                  <input
                    type="checkbox"
                    className="btn-check"
                    id={`amenity_${amenity.amenity_id}`}
                    onClick={() =>
                      handleFilterChange("project_amenity", amenity.amenity_id)
                    }
                    checked={selectedFilters?.project_amenity?.includes(amenity.amenity_id) || false}
                  />
                  <label
                    className="btn btn-outline-light btn-sm flex-column"
                    htmlFor={`amenity_${amenity.amenity_id}`}
                  >
                    <img
                      src={amenity.image || "/placeholder.svg"}
                      alt={amenity.amenity_name}
                      className="mb-1"
                      style={{
                        width: "24px",
                        height: "24px",
                        objectFit: "contain",
                      }}
                    />
                    {amenity.amenity_name}
                  </label>
                </React.Fragment>
              ))}
            </ButtonGroup>

            {dynamicData?.amenities?.length > 10 && (
              <Button
                variant="link"
                onClick={() => setShowAll((prev) => !prev)}
                className="p-0 text-primary mb-2"
              >
                {showAll ? "View Less" : "View More"}
              </Button>
            )}
          </>

          <h6>Furnishing</h6>
          <ButtonGroup className="btn-group-light d-flex gap-2 mb-3">
            {dynamicData?.furnishing?.map((furnish) => (
              <>
                <input
                  type="checkbox"
                  key={furnish.furnish_id}
                  className="btn-check"
                  id={`furnish_${furnish.furnish_id}`}
                  onClick={() =>
                    handleFilterChange("project_furnish", furnish.furnish_id)
                  }
                  checked={selectedFilters?.project_furnish?.includes(furnish.furnish_id) || false}
                />
                <label
                  className="btn btn-outline-light btn-sm"
                  htmlFor={`furnish_${furnish.furnish_id}`}
                >
                  {furnish.furnish_name}
                </label>
              </>
            ))}
          </ButtonGroup>

          <h6>Possession Status</h6>
          <ButtonGroup className="btn-group-light d-flex gap-2 mb-3">
            {dynamicData?.possession_status?.map((status) => (
              <>
                <input
                  type="radio"
                  key={status.status_id}
                  className="btn-check"
                  id={`status_${status.status_id}`}
                  name='possession_status'
                  checked={selectedFilters?.possession_status == status?.status_id}
                  onClick={() =>
                    handleFilterChange("possession_status", status.status_id)
                  }
                />
                <label
                  className="btn btn-outline-light btn-sm"
                  htmlFor={`status_${status.status_id}`}
                >
                  {status.status_name}
                </label>
              </>
            ))}
          </ButtonGroup>

          <h6>Facing</h6>
          <ButtonGroup className="btn-group-light d-flex gap-2 mb-3">
            {facingOptions.map((facing) => (
              <>
                <input
                  type="checkbox"
                  key={facing.id}
                  className="btn-check"
                  id={`facing_${facing.id}`}
                  onClick={() =>
                    handleFilterChange("project_facing", facing.key)
                  }
                  checked={selectedFilters?.project_facing?.includes(facing.key) || false}
                />
                <label
                  className="btn btn-outline-light btn-sm"
                  htmlFor={`facing_${facing.id}`}
                >
                  {facing.name}
                </label>
              </>
            ))}
          </ButtonGroup>

          <h6>No. of Towers</h6>
          <ButtonGroup className="btn-group-light d-flex gap-2 mb-3">
            {towerOptions.map((tower) => (
              <React.Fragment key={tower.key}>
                <input
                  type="checkbox"
                  key={tower.key}
                  className="btn-check"
                  id={`tower_Data_${tower.key}`}
                  onClick={() => handleFilterChange("total_towers", tower.value)}
                  checked={selectedFilters?.total_towers?.includes(tower.value) || false}
                />
                <label
                  className="btn btn-outline-light btn-sm"
                  htmlFor={`tower_Data_${tower.key}`}
                >
                  {tower.value}
                </label>
              </React.Fragment>
            ))}
          </ButtonGroup>

          <h6>Parking</h6>
          <ButtonGroup className="btn-group-light d-flex gap-2 mb-3">
            {parkingOptions.map((parking) => (
              <>
                <input
                  type="checkbox"
                  key={parking.id}
                  className="btn-check"
                  id={`parking_${parking.id}`}
                  onClick={() =>
                    handleFilterChange("parking_availability", parking.key)
                  }
                  checked={selectedFilters?.parking_availability?.includes(parking.key) || false}
                />
                <label
                  className="btn btn-outline-light btn-sm"
                  htmlFor={`parking_${parking.id}`}
                >
                  {parking.value}
                </label>
              </>
            ))}
          </ButtonGroup>
        </Offcanvas.Body>

        <div className="p-3 border-top">
          <Button
            className="w-100"
            variant="danger"
            onClick={handleViewProject}
          >
            View Projects
          </Button>
        </div>
      </Offcanvas>
    </div>
  );
}

export default ProjectMobileFilters;
