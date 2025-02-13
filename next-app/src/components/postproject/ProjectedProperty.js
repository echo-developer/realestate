"use client";
import Link from "next/link";
import React, { useState } from "react";
import ProjectEnquiryForm from "./ProjectEnquiryForm";
import { Modal } from "react-bootstrap";

const ProjectedProperty = ({ projectProperties }) => {
  const [activeTab, setActiveTab] = useState("buy");
  const [selectedBHK, setSelectedBHK] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [currentPropertyId, setCurrentPropertyId] = useState(null);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedBHK("All");
  };

  const handleBHKChange = (bhk) => {
    setSelectedBHK(bhk);
  };

  const filteredProperties =
  selectedBHK === "All"
    ? Object.values(projectProperties?.[activeTab] || {}).flat()
    : projectProperties?.[activeTab]?.[selectedBHK] || [];


  const handleShowForm = (propertyId) => {
    setCurrentPropertyId(propertyId);
    setShowForm(true);
  };

  const handleCloseModal = () => {
    setShowForm(false);
    setCurrentPropertyId(null);
  };

  return (
    <section id="properties">
      <h4 className="text-primary mb-3">Properties In Real Estate</h4>
      <nav>
        <div className="nav nav-pills" id="nav-tab" role="tablist">
          <button
            className={`nav-link ps-4 pe-4 ${
              activeTab === "buy" ? "active" : ""
            }`}
            onClick={() => handleTabChange("buy")}
            type="button"
            aria-selected={activeTab === "buy"}
          >
            Buy
          </button>
          <button
            className={`nav-link ps-4 pe-4 ${
              activeTab === "rent" ? "active" : ""
            }`}
            onClick={() => handleTabChange("rent")}
            type="button"
            aria-selected={activeTab === "rent"}
          >
            Rent
          </button>
        </div>
      </nav>

      {/* BHK Filter Section */}
      <div className="row align-items-center mb-3 mt-2">
        <div className="col-sm">
          <div
            className="btn-group btn-group-light mb-2"
            role="group"
            aria-label="Basic radio toggle button group"
          >
            {["All", "1BHK", "2BHK", "3BHK", "4BHK", "5BHK"].map(
              (bhk, index) => (
                <React.Fragment key={index}>
                  <input
                    type="radio"
                    className="btn-check"
                    name="flat_type"
                    id={`flat_${index}`}
                    autoComplete="off"
                    checked={selectedBHK === bhk}
                    onChange={() => handleBHKChange(bhk)}
                  />
                  <label
                    className="btn btn-outline-light"
                    htmlFor={`flat_${index}`}
                  >
                    {bhk}
                  </label>
                </React.Fragment>
              )
            )}
          </div>
        </div>
        <div className="col-sm-auto">
          <h5>
            <Link target="_blank" href="/property-listing">
              Show All Properties <i className="bi bi-arrow-right"></i>
            </Link>
          </h5>
        </div>
      </div>

      {/* Property Listing */}
      <div className="tab-content bg-white p-3 mb-4" id="nav-tabContent">
        <div className="row -mb-3">
          {filteredProperties.length > 0 ? (
            filteredProperties.map((property) => (
              <article key={property.id} className="col-lg-4 col-sm-6 col-12">
                <div className="card card-ads">
                  {property?.gallery?.length > 0 ? (
                    <div className="card-image">
                      <img
                        src={`"/assets/images/uploads/property-9.jpg"`}
                        alt={property.name}
                        className="card-img-top"
                      />
                      <span
                        className={`ads-type ${
                          activeTab === "buy" ? "sale" : "rent"
                        }`}
                      >
                        {activeTab === "buy" ? "For Sale" : "For Rent"}
                      </span>
                    </div>
                  ) : (
                    <div className="card-image">
                      <img
                        src="/assets/images/property/default-property-1.jpg"
                        alt={property.name}
                        className="card-img-top"
                      />
                      <span
                        className={`ads-type ${
                          activeTab === "buy" ? "sale" : "rent"
                        }`}
                      >
                        {activeTab === "buy" ? "For Sale" : "For Rent"}
                      </span>
                    </div>
                  )}

                  <div className="card-body">
                    <h4 className="text-muted"><Link target="_blank" href={`/property-details/${property?.slug}`}>{property.name}</Link></h4>
                    <div className="d-flex justify-content-between">
                      <h3>₹{property.expected_price}</h3>
                      <p>
                        <span className="text-muted">
                          {property.super_area} Sq. Ft.
                        </span>
                      </p>
                    </div>
                    <h4>
                      {property.bhk_type} Flat by (Real estate)
                    </h4>
                    <p className="mb-2">
                      <a href="">
                        <i className="icon-feather-map-pin"></i>{" "}
                        {property.property_address}
                      </a>
                    </p>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <p>No properties available for the selected criteria.</p>
          )}
        </div>
      </div>

      {/* Modal for Project Enquiry Form */}
      <Modal show={showForm} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Contact Agent for Property</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentPropertyId && (
            <ProjectEnquiryForm propertyId={currentPropertyId} />
          )}
        </Modal.Body>
      </Modal>
    </section>
  );
};

export default ProjectedProperty;
