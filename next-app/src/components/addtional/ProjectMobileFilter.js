"use client";
import React, { useState } from "react";
import { ChevronLeft, Plus, X } from "lucide-react";
import { Button, Offcanvas, Nav, Form } from "react-bootstrap";
import { filterOptions, subfilterOptions } from "../post/PropertyData";

export function ProjectMobileFilters() {
  const [show, setShow] = useState(false);
  const [activeTab, setActiveTab] = useState("Rent");
  const [selectedCity, setSelectedCity] = useState("Kolkata");
  const [budgetRange, setBudgetRange] = useState({ min: 5, max: 40 });
  const [areaRange, setAreaRange] = useState({ min: 500, max: 5000 });
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState(["Flat", "House/Villa"]);
  const [selectedBHK, setSelectedBHK] = useState(["2 BHK", "3 BHK"]);
  const [selectedFilters, setSelectedFilters] = useState({});

  const tabs = ["Buy", "Rent", "New Projects", "Plot", "Commercial"];

  const propertyTypes = subfilterOptions.property_types || [];
  const bhkOptions = subfilterOptions.bedrooms || [];

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
    <div>
      {/* Filter Button */}
      <Button variant="outline-primary" onClick={() => setShow(true)}>
        Filters ({Object.values(selectedFilters).flat().length})
      </Button>

      {/* Bootstrap Offcanvas */}
      <Offcanvas show={show} onHide={() => setShow(false)} placement="bottom" style={{ height: "932px", maxHeight: "932px" }}>
        <Offcanvas.Header closeButton>
          <Button variant="link" onClick={() => setShow(false)}>
            <ChevronLeft /> Back
          </Button>
          <h5>Filters ({Object.values(selectedFilters).flat().length})</h5>
          <Button
            variant="link"
            className="text-danger"
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
        </Offcanvas.Header>

        {/* Tabs */}
        <Nav variant="tabs" activeKey={activeTab} onSelect={(tab) => setActiveTab(tab)}>
          {tabs.map((tab) => (
            <Nav.Item key={tab}>
              <Nav.Link eventKey={tab}>{tab}</Nav.Link>
            </Nav.Item>
          ))}
        </Nav>

        <Offcanvas.Body>
          {/* Property For */}
          <h6>Property For</h6>
          <Form.Select value={activeTab} onChange={(e) => setActiveTab(e.target.value)}>
            {tabs.map((tab) => (
              <option key={tab} value={tab}>{tab}</option>
            ))}
          </Form.Select>

          {/* Property Types */}
          <h6>Property Type</h6>
          <div className="d-flex flex-wrap">
            {propertyTypes.map((type) => (
              <Button
                key={type.id}
                variant={selectedPropertyTypes.includes(type.name) ? "success" : "outline-secondary"}
                size="sm"
                className="m-1"
                onClick={() => handleFilterChange("property_type", type.key)}
              >
                {type.name}
              </Button>
            ))}
          </div>

          {/* Budget */}
          <h6>Budget (in Lakhs)</h6>
          <Form className="d-flex gap-2">
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
          <Form className="d-flex gap-2">
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
          <h6>BHK</h6>
          <div className="d-flex flex-wrap">
            {bhkOptions.map((bhk) => (
              <Button
                key={bhk.id}
                variant={selectedBHK.includes(bhk.name) ? "success" : "outline-secondary"}
                size="sm"
                className="m-1"
                onClick={() => handleFilterChange("bhk", bhk.key)}
              >
                {bhk.name}
              </Button>
            ))}
          </div>

          {/* Filter Options */}
          {filterOptions.map((filter) => (
            <div key={filter.id} className="mb-3">
              <h6>{filter.name}</h6>
              <div className="d-flex flex-wrap">
                {subfilterOptions[filter.key]?.map((subfilter) => (
                  <Button
                    key={subfilter.id}
                    variant={selectedFilters[filter.key]?.includes(subfilter.key) ? "success" : "outline-secondary"}
                    size="sm"
                    className="m-1"
                    onClick={() => handleFilterChange(filter.key, subfilter.key)}
                  >
                    {subfilter.name}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </Offcanvas.Body>

        <div className="p-3 border-top">
          <Button className="w-100" variant="danger">
            View 7546 Properties
          </Button>
        </div>
      </Offcanvas>
    </div>
  );
}

export default ProjectMobileFilters;
