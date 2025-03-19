"use client";
import React, { useState } from "react";
import { ChevronLeft, Plus, X } from "lucide-react";
import { Button, Offcanvas, Nav, Form, Dropdown, DropdownButton, ButtonGroup } from "react-bootstrap";
import { filterOptions, subfilterOptions } from "../post/PropertyData";

export function PropertyMobileFilters({ showDrop, setShowDrop, selectedOption, handleSortSelection }) {
  const [show, setShow] = useState(false);
  const [activeTab, setActiveTab] = useState("Rent");
  const [selectedCity, setSelectedCity] = useState("Kolkata");
  const [budgetRange, setBudgetRange] = useState({ min: 5, max: 40 });
  const [areaRange, setAreaRange] = useState({ min: 500, max: 5000 });
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState(["Flat", "House/Villa"]);
  const [selectedBHK, setSelectedBHK] = useState(["2 BHK", "3 BHK"]);
  const [selectedFilters, setSelectedFilters] = useState({});

  const tabs = ["Buy", "Rent", "New Projects"];

  const propertyTypes = subfilterOptions.property_types || [];
  const bhkOptions = subfilterOptions.bedrooms || [];
  const bathOptions = subfilterOptions.bathroom || [];
  const kitchenOptions = subfilterOptions.kitchen || [];
  const amenityOptions = subfilterOptions.amenities || [];

  const handleFilterChange = (filterKey, subfilterKey) => {
    setSelectedFilters((prev) => {
      const current = prev[filterKey] || [];
      return {
        ...prev,
        [filterKey]: current.includes(subfilterKey)
          ? current.filter((item) => item !== subfilterKey)
          : [...current, subfilterKey],
      };
    });
  };

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
      <Offcanvas show={show} onHide={() => setShow(false)} placement="bottom" style={{ height: '100vh' }}>
        <Offcanvas.Header className="d-block border-bottom">
          <div className="d-flex justify-content-between mb-3">
            <Button variant="link" className="p-0 text-decoration-none" onClick={() => setShow(false)}>
              <ChevronLeft /> Back
            </Button>
            <Button
              variant="link"
              className="p-0 text-danger text-decoration-none"
              onClick={() => {
                setSelectedPropertyTypes([]);
                setSelectedBHK([]);
                setBudgetRange({ min: 5, max: 40 });
                setAreaRange({ min: 500, max: 5000 });
                setSelectedFilters({});
              }}
            >
              Reset
            </Button>
          </div>
          <div>
            <h6 className="mb-0">Filters Applied: {/* ({Object.values(selectedFilters).flat().length}) */}</h6>
            <div>

            </div>
          </div>
        </Offcanvas.Header>

        {/* Tabs */}
        <Nav variant="pills p-3 justify-content-center" activeKey={activeTab} onSelect={(tab) => setActiveTab(tab)}>
          {tabs.map((tab) => (
            <Nav.Item key={tab}>
              <Nav.Link eventKey={tab}>{tab}</Nav.Link>
            </Nav.Item>
          ))}
        </Nav>

        <Offcanvas.Body>
          {/* Property For
          <div className="form-field mb-3">
            <h6>Property For</h6>
            <Form.Select value={activeTab} onChange={(e) => setActiveTab(e.target.value)}>
              {tabs.map((tab) => (
                <option key={tab} value={tab}>{tab}</option>
              ))}
            </Form.Select>
          </div>
          */}

          {/* Property Types */}
          <h6>Property Type</h6>
          <ButtonGroup className="btn-group-light d-flex gap-2 mb-3">
            {propertyTypes.map((type) => (
              <>
              <input
                type="checkbox"
                key={type.id}
                variant={selectedPropertyTypes.includes(type.name) ? "success" : "outline-secondary"}
                size="sm"
                className="btn-check"
                id={`property_${type.id}`}
                onClick={() => handleFilterChange("property_type", type.key)}
              />
              <label className="btn btn-outline-light btn-sm" htmlFor={`property_${type.id}`}>{type.name}</label>  
              </>
            ))}
          </ButtonGroup>

          {/* Budget */}
          <h6>Budget (in Lakhs)</h6>
          <Form className="d-flex gap-2 mb-3">
            <Form.Control
              type="number"
              placeholder="Min"
              value={budgetRange.min}
              onChange={(e) => setBudgetRange({ ...budgetRange, min: Number(e.target.value) })}
            />
            <Form.Control
              type="number"
              placeholder="Max"
              value={budgetRange.max}
              onChange={(e) => setBudgetRange({ ...budgetRange, max: Number(e.target.value) })}
            />
          </Form>

          {/* Area */}
          <h6>Area (in Sq. Ft.)</h6>
          <Form className="d-flex gap-2 mb-3">
            <Form.Control
              type="number"
              placeholder="Min"
              value={areaRange.min}
              onChange={(e) => setAreaRange({ ...areaRange, min: Number(e.target.value) })}
            />
            <Form.Control
              type="number"
              placeholder="Max"
              value={areaRange.max}
              onChange={(e) => setAreaRange({ ...areaRange, max: Number(e.target.value) })}
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
                  onClick={() => handleFilterChange("bhk", bhk.key)}
                />
                <label className="btn btn-outline-light btn-sm" htmlFor={`bed_${bhk.id}`}>{bhk.name}</label>
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
                  onClick={() => handleFilterChange("bhk", bhk.key)}
                />
                <label className="btn btn-outline-light btn-sm" htmlFor={`bath_${bhk.id}`}>{bhk.name}</label>
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
                  onClick={() => handleFilterChange("bhk", bhk.key)}
                />
                <label className="btn btn-outline-light btn-sm" htmlFor={`kitch_${bhk.id}`}>{bhk.name}</label>
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
                <label className="btn btn-outline-light btn-sm flex-column" htmlFor={`amenity_${bhk.id}`}>
                  <i className="icon-img-ac"></i>
                  {bhk.name}
                </label>
              </>
            ))}
          </ButtonGroup>

          {/* Filter Options */}
          {filterOptions.map((filter) => (
            <div key={filter.id} className="mb-3">
              <h6>{filter.name}</h6>
              <ButtonGroup className="btn-group-light d-flex gap-2">
                {subfilterOptions[filter.key]?.map((subfilter) => (
                  <>
                    <input
                      type="checkbox"
                      key={`data_${filter.key}_${subfilter.id}`} // Unique key based on filter.key and subfilter.id
                      variant={selectedFilters[filter.key]?.includes(subfilter.key) ? "success" : "outline-secondary"}
                      className="btn-check"
                      id={`filter_${filter.key}_subfilter_${subfilter.id}`} // Unique id based on filter.key and subfilter.id
                      label={`abcd_${subfilter.id}`}
                      onClick={() => handleFilterChange(filter.key, subfilter.key)}
                    />
                    <label className="btn btn-outline-light btn-sm" htmlFor={`filter_${filter.key}_subfilter_${subfilter.id}`}>
                      {subfilter.name}
                    </label>
                  </>
                ))}
              </ButtonGroup>
            </div>
          ))}

        </Offcanvas.Body>

        <div className="p-3 border-top">
          <Button className="w-100" variant="danger">
            View 7546 Properties
          </Button>
        </div>
      </Offcanvas>
    </>
  );
}

export default PropertyMobileFilters;
