"use client";
import React, { useState ,useEffect } from "react";
import { ChevronLeft, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Button,
  Offcanvas,
  Nav,
  Form,
  Dropdown,
  DropdownButton,
  ButtonGroup,
} from "react-bootstrap";
import AuthUser from "../Authentication/AuthUser";
import { MobilefilterOptions, subfilterOptions } from "../post/PropertyData";

export function PropertyMobileFilters({
  showDrop,
  setShowDrop,
  selectedOption,
  handleSortSelection,
  propertyTypeList,
  subPropertyList,
}) {
  const router = useRouter();
  const {callApi}=AuthUser();
  const [show, setShow] = useState(false);
  const [activeTab, setActiveTab] = useState("Rent");
  const [selectedCity, setSelectedCity] = useState("Kolkata");
  const [budgetRange, setBudgetRange] = useState({
    min_budget: 5,
    max_budget: 40,
  });
  const [areaRange, setAreaRange] = useState({
    min_carpet: 500,
    max_carpet: 5000,
  });
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState("");
  const [selectedPropertyForList, setSelectedPropertyForList] = useState([]);
  const [selectedPropertyFor, setSelectedPropertyFor] = useState("");
  const [selectedBHK, setSelectedBHK] = useState(["2 BHK", "3 BHK"]);
  const [selectedFilters, setSelectedFilters] = useState({});
  const tabs = ["Buy", "Rent", "Projects"];

  const propertyTypes = subfilterOptions.property_types || [];
  const bhkOptions = subfilterOptions.bedrooms || [];
  const bathOptions = subfilterOptions.bathroom || [];
  const kitchenOptions = subfilterOptions.kitchen || [];
  const amenityOptions = subfilterOptions.amenities || [];

  const handleDynamicValueChange = (name, value) => {
    setSearchData((prevState) => {
      const currentValues = prevState[name] || [];

      if (Array.isArray(currentValues)) {
        if (currentValues.includes(value)) {
          return {
            ...prevState,
            [name]: currentValues.filter((item) => item !== value),
          };
        } else {
          return {
            ...prevState,
            [name]: [...currentValues, value],
          };
        }
      } else {
        return {
          ...prevState,
          [name]: [value],
        };
      }
    });
  };

  useEffect(() => {
    if (selectedPropertyTypes) {
      const getSubPropertyType = async () => {
        try {
          const res = await callApi({
            api: `/get_property_for/${selectedPropertyTypes}`,
            method: "GET",
          });
          if (res && res?.status === 1) {
            setSelectedPropertyForList(res?.data || []);
          } else {
            toast.error(res?.message || "Error fetching property for options");
          }
        } catch (error) {
          toast.error(res?.message || "Error fetching property for options");
        }
      };

      getSubPropertyType();
    }
  }, [selectedPropertyTypes]);

  const clearURL = () => {
    router.replace("/property-listing");
  };

  const handleViewProperties = () => {
    const searchData = {
      carpet_area: "",
      possession_status: selectedFilters.possession_status || [],
      sale_type: selectedFilters.sale_type || [],
      posted_by: selectedFilters.posted_by || [],
      ownership: selectedFilters.ownership || [],
      furnishing: selectedFilters.furnishing || [],
      amenities: selectedFilters.amenities || [],
      verify_properties: selectedFilters.verify_properties || [],
      facing: selectedFilters.facing || [],
      floor: selectedFilters.floor || [],
      bathroom: selectedFilters.bathroom || [],
      bedrooms: selectedFilters.bedrooms || [],
      kitchens: selectedFilters.kitchens || [],
      mb_exclusive_properties: selectedFilters.mb_exclusive_properties || [],
      posted_by_certified_agents:
        selectedFilters.posted_by_certified_agents || [],
      rera_registered_properties:
        selectedFilters.rera_registered_properties || [],
      rera_registered_agents: selectedFilters.rera_registered_agents || [],
      min_budget: budgetRange.min_budget,
      max_budget: budgetRange.max_budget,
      min_carpet: areaRange.min_carpet,
      max_carpet: areaRange.max_carpet,
      posted_since: selectedFilters.posted_since || [],
    };

    // Construct the URL
    const queryParams = new URLSearchParams();
    queryParams.append("property_type", selectedFilters.property_type || "");
    queryParams.append("post_for", activeTab.toLowerCase());
    queryParams.append("searchData", JSON.stringify(searchData));

    // Navigate to the property listing page
    router.push(`/property-listing?${queryParams.toString()}`);
    setShow(false);
  };

  const handleFilterChange = (filterKey, subfilterKey) => {
    setSelectedFilters((prev) => {
      if (filterKey === "property_type" || filterKey === "property_for") {
        return {
          ...prev,
          [filterKey]: subfilterKey,
        };
      }
      const current = prev[filterKey] || [];
      return {
        ...prev,
        [filterKey]: current.includes(subfilterKey)
          ? current.filter((item) => item !== subfilterKey)
          : [...current, subfilterKey],
      };
    });

    // Update selectedPropertyTypes for UI reflection
    setSelectedPropertyTypes([subfilterKey]);
  };

  console.log(selectedFilters, budgetRange, areaRange);

  return (
    <>
      <div className="d-flex justify-content-between p-3">
        {/* Filter Button */}
        <Button variant="outline-primary" onClick={() => setShow(true)}>
          Filters ({Object.values(selectedFilters).flat().length})
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
        style={{ height: "100vh" }}
      >
        <Offcanvas.Header className="d-block border-bottom">
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
              onClick={() => {
                setSelectedPropertyTypes([]);
                setSelectedBHK([]);
                setBudgetRange({ min_budget: 5, max_budget: 40 });
                setAreaRange({ min_carpet: 500, max_carpet: 5000 });
                setSelectedFilters({});
              }}
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
            <Nav.Item key={tab}>
              <Nav.Link eventKey={tab}>{tab}</Nav.Link>
            </Nav.Item>
          ))}
        </Nav>

        <Offcanvas.Body>
          {/* Property Types */}
          <h6>Property Type</h6>
          <ButtonGroup className="btn-group-light d-flex gap-2 mb-3">
            {propertyTypeList?.map((type) => (
              <React.Fragment key={type.category_id}>
                <input
                  type="checkbox"
                  className="btn-check"
                  id={`property_${type.category_id}`}
                  checked={selectedPropertyTypes.includes(type.category_id)}
                  onChange={() =>
                    handleFilterChange("property_type", type.category_id)
                  }
                />
                <label
                  className={`btn btn-sm ${
                    selectedPropertyTypes.includes(type.category_id)
                      ? "btn-success"
                      : "btn-outline-light"
                  }`}
                  htmlFor={`property_${type.category_id}`}
                >
                  {type.category_name}
                </label>
              </React.Fragment>
            ))}
          </ButtonGroup>
          {selectedPropertyForList.length > 0 && (
            <h6>Property For</h6>
          )}
          
          <ButtonGroup className="btn-group-light d-flex gap-2 mb-3">
            {selectedPropertyForList?.map((type) => (
              <React.Fragment key={type.sub_category_id}>
                <input
                  type="checkbox"
                  className="btn-check"
                  id={`property_for${type.sub_category_id}`}
                  checked={selectedPropertyFor?.includes(type.sub_category_id)}
                  onChange={() =>
                    handleFilterChange("property_for", type.sub_category_id)
                  }
                />
                <label
                  className={`btn btn-sm ${
                    selectedPropertyFor.includes(type.sub_category_id)
                      ? "btn-success"
                      : "btn-outline-light"
                  }`}
                  htmlFor={`property_for${type.sub_category_id}`}
                >
                  {type.sub_category_name}
                </label>
              </React.Fragment>
            ))}
          </ButtonGroup>

          {/* Budget */}
          <h6>Budget (in Lakhs)</h6>
          <Form className="d-flex gap-2 mb-3">
            <Form.Control
              type="number"
              placeholder="Min"
              value={budgetRange.min_budget}
              onChange={(e) =>
                setBudgetRange({ ...budgetRange, min_budget: e.target.value })
              }
            />
            <Form.Control
              type="number"
              placeholder="Max"
              value={budgetRange.max_budget}
              onChange={(e) =>
                setBudgetRange({ ...budgetRange, max_budget: e.target.value })
              }
            />
          </Form>

          {/* Area */}
          <h6>Area (in Sq. Ft.)</h6>
          <Form className="d-flex gap-2 mb-3">
            <Form.Control
              type="number"
              placeholder="Min"
              value={areaRange.min_carpet}
              onChange={(e) =>
                setAreaRange({ ...areaRange, min_carpet: e.target.value })
              }
            />
            <Form.Control
              type="number"
              placeholder="Max"
              value={areaRange.max_carpet}
              onChange={(e) =>
                setAreaRange({ ...areaRange, max_carpet: e.target.value })
              }
            />
          </Form>

          {/* BHK Options */}
          <h6>Bedroom</h6>
          <ButtonGroup className="btn-group-light d-flex gap-2 mb-3">
            {bhkOptions.map((bhk) => (
              <>
                <input
                  type="checkbox"
                  key={bhk.id}
                  className="btn-check"
                  id={`bed_${bhk.id}`}
                  onClick={() => handleFilterChange("bedrooms", bhk.key)}
                />
                <label
                  className="btn btn-outline-light btn-sm"
                  htmlFor={`bed_${bhk.id}`}
                >
                  {bhk.name}
                </label>
              </>
            ))}
          </ButtonGroup>

          <h6>Bathroom</h6>
          <ButtonGroup className="btn-group-light d-flex gap-2 mb-3">
            {bathOptions.map((bhk) => (
              <>
                <input
                  type="checkbox"
                  key={bhk.id}
                  className="btn-check"
                  id={`bath_${bhk.id}`}
                  onClick={() => handleFilterChange("bathroom", bhk.key)}
                />
                <label
                  className="btn btn-outline-light btn-sm"
                  htmlFor={`bath_${bhk.id}`}
                >
                  {bhk.name}
                </label>
              </>
            ))}
          </ButtonGroup>

          <h6>Kitchens</h6>
          <ButtonGroup className="btn-group-light d-flex gap-2 mb-3">
            {kitchenOptions.map((bhk) => (
              <>
                <input
                  type="checkbox"
                  key={bhk.id}
                  className="btn-check"
                  id={`kitch_${bhk.id}`}
                  onClick={() => handleFilterChange("kitchens", bhk.key)}
                />
                <label
                  className="btn btn-outline-light btn-sm"
                  htmlFor={`kitch_${bhk.id}`}
                >
                  {bhk.name}
                </label>
              </>
            ))}
          </ButtonGroup>

          <h6>Amenities</h6>
          <ButtonGroup className="btn-group-light flex-wrap gap-2 mb-3 btn-group-amenity">
            {amenityOptions.map((bhk) => (
              <>
                <input
                  type="checkbox"
                  key={`amenity_${bhk.id}`}
                  className="btn-check"
                  id={`amenity_${bhk.id}`}
                  onClick={() => handleFilterChange("bhk", bhk.key)}
                />
                <label
                  className="btn btn-outline-light btn-sm flex-column"
                  htmlFor={`amenity_${bhk.id}`}
                >
                  <i className="icon-img-ac"></i>
                  {bhk.name}
                </label>
              </>
            ))}
          </ButtonGroup>

          {/* Filter Options */}
          {MobilefilterOptions.map((filter) => (
            <div key={filter.id} className="mb-3">
              <h6>{filter.name}</h6>
              <ButtonGroup
                className={`btn-group-light d-flex gap-2 ${
                  filter.key === "carpet_area" ? "d-none d-md-flex" : ""
                }`}
              >
                {subfilterOptions[filter.key]?.map((subfilter) => (
                  <React.Fragment key={`data_${filter.key}_${subfilter.id}`}>
                    <input
                      type="checkbox"
                      className="btn-check"
                      id={`filter_${filter.key}_subfilter_${subfilter.id}`}
                      onClick={() =>
                        handleFilterChange(filter.key, subfilter.key)
                      }
                    />
                    <label
                      className="btn btn-outline-light btn-sm"
                      htmlFor={`filter_${filter.key}_subfilter_${subfilter.id}`}
                    >
                      {subfilter.name}
                    </label>
                  </React.Fragment>
                ))}
              </ButtonGroup>
            </div>
          ))}
        </Offcanvas.Body>

        <div className="p-3 border-top">
          <Button
            className="w-100"
            variant="danger"
            onClick={handleViewProperties}
          >
            View Properties
          </Button>
        </div>
      </Offcanvas>
    </>
  );
}

export default PropertyMobileFilters;
