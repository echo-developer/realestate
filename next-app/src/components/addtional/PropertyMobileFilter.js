"use client";
import React, { useState, useEffect } from "react";
import { ChevronLeft, Plus, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { FaFilter } from "react-icons/fa6";
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
import AuthUser from "../Authentication/AuthUser";
import { MobilefilterOptions, subfilterOptions } from "../post/PropertyData";
import { constructNow } from "date-fns";

export function PropertyMobileFilters({
  showDrop,
  setShowDrop,
  selectedOption,
  handleSortSelection,
  propertyTypeList,
  // localityList,
  // localityData,
  // handleLocalityDataChange
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { callApi } = AuthUser();
  const [show, setShow] = useState(false);
  const [activeTab, setActiveTab] = useState("sale");
  const [budgetRange, setBudgetRange] = useState({
    min_budget: null,
    max_budget: null,
  });
  const [areaRange, setAreaRange] = useState({
    min_carpet: "",
    max_carpet: "",
  });
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState("");
  const [selectedPropertyForList, setSelectedPropertyForList] = useState([]);
  const [selectedPropertyFor, setSelectedPropertyFor] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({});
  const [dynamicData, setDynamicData] = useState({});
  const [showAll, setShowAll] = useState(false);
  const bhkOptions = subfilterOptions.bedrooms || [];
  const bathOptions = subfilterOptions.bathroom || [];
  const kitchenOptions = subfilterOptions.kitchen || [];


  const tabs = [
    { key: "sale", value: "Buy" },
    { key: "rent", value: "Rent" },
  ];


  useEffect(() => {
    const propertyType = searchParams.get("property_type") || "";
    const propertyFor = searchParams.get("property_for") || "";
    const postFor = searchParams.get("post_for") || "sale";
    const bedrooms = searchParams.get('bedrooms');
    const bathroom = searchParams.get('bathroom');
    const kitchens = searchParams.get('kitchens');
    const minBudget = searchParams.get('min_budget');
    const maxBudget = searchParams.get('max_budget');
    const searchData = searchParams.get("searchData")
      ? JSON.parse(decodeURIComponent(searchParams.get("searchData")))
      : {};
    setActiveTab(postFor);
    setSelectedPropertyTypes(propertyType);

    let filterObject = {
      ...propertyFor,
    };
    if (propertyType) {
      filterObject.property_type = propertyType;
    };
    if (propertyFor) {
      filterObject.property_for = propertyFor;
    };
    if (bedrooms) {
      filterObject.bedrooms = JSON.parse(bedrooms)
    }
    if (bathroom) {
      filterObject.bathroom = JSON.parse(bathroom);
    }
    if (kitchens) {
      filterObject.kitchens = JSON.parse(kitchens);
    }
    if (minBudget || maxBudget) {
      setBudgetRange({
        min_budget: minBudget || null,
        max_budget: maxBudget || null,
      })
    }

    setSelectedPropertyFor(propertyFor);

    filterObject = {
      ...filterObject,
      ...searchData
    }

    if (filterObject.hasOwnProperty(0)) {
      delete filterObject[0];
    }
    setSelectedFilters(filterObject);
    // setBudgetRange({
    //   min_budget: searchData?.min_budget,
    //   max_budget: searchData?.max_budget,
    // });
    setAreaRange({
      min_carpet: searchData?.min_carpet,
      max_carpet: searchData?.max_carpet,
    });
  }, [searchParams]);




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

        const results = await Promise.all(apiCalls);

        const formattedData = results.reduce((acc, { key, data }) => {
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

  useEffect(() => {
    if (Array.isArray(selectedPropertyTypes) ? selectedPropertyTypes.length > 0 : selectedPropertyTypes) {
      const getSubPropertyType = async () => {
        try {
          const res = await callApi({
            api: `/get_property_for/${selectedPropertyTypes}`,
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
      // bathroom: selectedFilters.bathroom || [],
      // bedrooms: selectedFilters.bedrooms || [],
      // kitchens: selectedFilters.kitchens || [],
      mb_exclusive_properties: selectedFilters.mb_exclusive_properties || [],
      posted_by_certified_agents:
        selectedFilters.posted_by_certified_agents || [],
      rera_registered_properties:
        selectedFilters.rera_registered_properties || [],
      rera_registered_agents: selectedFilters.rera_registered_agents || [],
      // min_budget: budgetRange.min_budget,
      // max_budget: budgetRange.max_budget,
      min_carpet: areaRange.min_carpet,
      max_carpet: areaRange.max_carpet,
      posted_since: selectedFilters.posted_since || [],
    };

    // Construct the URL
    const queryParams = new URLSearchParams();
    queryParams.append("property_type", selectedFilters.property_type || "");
    queryParams.append("post_for", activeTab.toLowerCase());
    queryParams.append("property_for", selectedFilters.property_for || "");
    if (selectedFilters?.bedrooms) {
      queryParams.append("bedrooms", JSON.stringify(selectedFilters?.bedrooms));
    }
    if (selectedFilters?.bathroom) {
      queryParams.append("bathroom", JSON.stringify(selectedFilters?.bathroom));
    }
    if (selectedFilters?.kitchens) {
      queryParams.append("kitchens", JSON.stringify(selectedFilters?.kitchens))
    }
    if (budgetRange.min_budget) {
      queryParams.append("min_budget", budgetRange?.min_budget)
    }
    if (budgetRange.max_budget) {
      queryParams.append("max_budget", budgetRange?.max_budget);
    }
    if(localityData) {
      queryParams.append('locality', localityData);
    }
    queryParams.append("searchData", JSON.stringify(searchData));
    // console.log("params url", queryParams.toString())
    // return;

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
    if (filterKey === "property_type") {
      setSelectedPropertyTypes([subfilterKey]);
    }
    if (filterKey === "property_for") {
      setSelectedPropertyFor([subfilterKey]);
    }
  };

  const amenitiesToShow = showAll
    ? dynamicData?.amenities
    : dynamicData?.amenities?.slice(0, 10);


  return (
    <>
      <div className="d-flex justify-content-between p-3">
        {/* Filter Button */}
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
                console.log("handle reset ran")
                setSelectedPropertyTypes([]);
                setSelectedPropertyFor([])
                setBudgetRange({ min_budget: null, max_budget: null });
                setAreaRange({ min_carpet: null, max_carpet: null });
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
            <Nav.Item key={tab.key}>
              <Nav.Link eventKey={tab.key}>{tab.value}</Nav.Link>
            </Nav.Item>
          ))}
        </Nav>

        <Offcanvas.Body>
          {/* <h6>Locality</h6>
          <ButtonGroup className="btn-group-light d-flex gap-2 mb-3">
            <div className="col-lg-6 col-12">
              <select className="form-select" id="exampleSelect" value={localityData} onChange={(e) => handleLocalityDataChange(e.target.value)}>
                <option value="">Select...</option>
                {localityList?.length > 0 && localityList?.map((locality, i) => {
                  return (
                    <option key={i} value={locality?.locality_id}>{locality?.locality_name}</option>
                  )
                })}
              </select>
            </div>

          </ButtonGroup> */}
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
                  className={`btn btn-sm ${selectedPropertyTypes.includes(type.category_id)
                      ? "btn-outline-light"
                      : "btn-success"
                    }`}
                  // btn-outline-light
                  htmlFor={`property_${type.category_id}`}
                >
                  {type.category_name}
                </label>
              </React.Fragment>
            ))}
          </ButtonGroup>
          {selectedPropertyForList.length > 0 && <h6>Property For</h6>}

          <ButtonGroup className="btn-group-light d-flex gap-2 mb-3">
            {selectedPropertyForList?.map((type) => (
              <React.Fragment key={type.sub_category_id}>
                <input
                  type="checkbox"
                  className="btn-check"
                  id={`property_for_data_${type.sub_category_id}`}
                  checked={selectedPropertyFor?.includes(type.sub_category_id)}
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
          </ButtonGroup>

          {/* Budget */}
          <h6>Budget (in Lakhs)</h6>
          <Form className="d-flex gap-2 mb-3">
            <Form.Control
              type="number"
              placeholder="Min"
              value={budgetRange.min_budget || ""}
              onChange={(e) =>
                setBudgetRange({
                  ...budgetRange,
                  min_budget: Number(e.target.value),
                })
              }
            />
            <Form.Control
              type="number"
              placeholder="Max"
              value={budgetRange.max_budget || ""}
              onChange={(e) =>
                setBudgetRange({
                  ...budgetRange,
                  max_budget: Number(e.target.value),
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
              value={areaRange.min_carpet || ""}
              onChange={(e) =>
                setAreaRange({ ...areaRange, min_carpet: e.target.value })
              }
            />
            <Form.Control
              type="number"
              placeholder="Max"
              value={areaRange.max_carpet || ""}
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
                  checked={selectedFilters?.bedrooms?.includes(bhk.key) || false}
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
                  checked={selectedFilters?.bathroom?.includes(bhk.key) || false}
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
                  checked={selectedFilters?.kitchens?.includes(bhk.key) || false}
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
          <>
            <ButtonGroup className="btn-group-light flex-wrap gap-2 mb-3 btn-group-amenity">
              {amenitiesToShow?.map((amenity) => (
                <React.Fragment key={`amenity_${amenity.amenity_id}`}>
                  <input
                    type="checkbox"
                    className="btn-check"
                    id={`amenity_${amenity.amenity_id}`}
                    onClick={() =>
                      handleFilterChange("amenities", amenity.amenity_id)
                    }
                    checked={selectedFilters?.amenities?.includes(amenity.amenity_id) || false}
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
                    handleFilterChange("furnishing", furnish.furnish_id)
                  }
                  checked={selectedFilters?.furnishing?.includes(furnish.furnish_id) || false}
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
                  type="checkbox"
                  key={status.status_id}
                  className="btn-check"
                  id={`status_${status.status_id}`}
                  onClick={() =>
                    handleFilterChange("possession_status", status.status_id)
                  }
                  checked={selectedFilters?.possession_status?.includes(status.status_id) || false}
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

          {/* Filter Options */}
          {MobilefilterOptions.map((filter) => (
            <div key={filter.id} className="mb-3">
              <h6>{filter.name}</h6>
              <ButtonGroup
                className={`btn-group-light d-flex gap-2 ${filter.key === "carpet_area" ? "d-none d-md-flex" : ""
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
                      checked={selectedFilters?.[filter.key]?.includes(subfilter.key) || false}
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
