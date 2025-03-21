"use client";
import Link from "next/link";
import React, { useState } from "react";
import ProjectEnquiryForm from "./ProjectEnquiryForm";
import { Modal } from "react-bootstrap";
import useTranslation from "@/hooks/useTranslation";

const ProjectedProperty = ({ projectProperties }) => {
  const [activeTab, setActiveTab] = useState("buy");
  const [selectedBHK, setSelectedBHK] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [currentPropertyId, setCurrentPropertyId] = useState(null);
const translation = useTranslation();
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
      <h4 className="text-primary mb-3">{translation?.properties_in_real_estate || " Properties In Real Estate"}</h4>
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
           {translation?.buy || "Buy"} 
          </button>
          <button
            className={`nav-link ps-4 pe-4 ${
              activeTab === "rent" ? "active" : ""
            }`}
            onClick={() => handleTabChange("rent")}
            type="button"
            aria-selected={activeTab === "rent"}
          >
            {translation?.rent || "Rent"}  
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
            {translation?.show_all_properties || "Show All Properties"}   <i className="bi bi-arrow-right"></i>
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
                    
                    <div className="d-flex justify-content-between">
                      <h5 className="text-primary">₹{property.expected_price}</h5>
                      <p>
                        <span className="text-muted">
                          {property.super_area} {translation?.sq_ft || "Sq. Ft"}
                        </span>
                      </p>
                    </div>
                    <h4><small><Link target="_blank" href={`/property-details/${property?.slug}`}>{property.name}</Link></small></h4>
                    <p>
                      {property.bhk_type} {translation?.flat_by_real_estate || "Flat by (Real estate)"}
                    </p>
                    <p>
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
            <article className="col-12 mb-3 text-center">
              <img alt="Icon" height="48" width="48" class="mb-2" src="/assets/images/icons/9939447.png" />
              <p className="text-muted">{translation?.no_properties_available || "No properties available for the selected criteria.)"}</p>
            </article>
          )}
        </div>
      </div>

      {/* Modal for Project Enquiry Form */}
      <Modal show={showForm} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{translation?.contact_agent_for_property || "Contact Agent for Property)"}</Modal.Title>
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
