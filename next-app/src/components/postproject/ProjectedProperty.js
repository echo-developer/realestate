"use client";
import Link from "next/link";
import React, { useState } from "react";
import ProjectEnquiryForm from "./ProjectEnquiryForm";
import { Modal } from "react-bootstrap";
import useTranslation from "@/hooks/useTranslation";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css"; 
import { useAuth } from "@/context/AuthProvider";

const ProjectedProperty = ({ projectProperties, title }) => {
  const { formatPrice } = useAuth();
  const [activeTab, setActiveTab] = useState("sale");
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

  // Multi-Carousel Responsive Settings
  const responsive = {
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 3 },
    tablet: { breakpoint: { max: 1024, min: 464 }, items: 2 },
    mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
  };

  return (
    <section id="properties">
      <h4 className="text-primary mb-3">
        {/* {translation?.properties_in_real_estate || "Properties In Real Estate"} */}
        Properties In {title || 'Real Estate'} 
      </h4>
      <nav>
        <div className="nav nav-pills">
          <button
            className={`nav-link ps-4 pe-4 ${activeTab === "sale" ? "active" : ""}`}
            onClick={() => handleTabChange("sale")}
          >
            {translation?.buy || "Buy"}
          </button>
          <button
            className={`nav-link ps-4 pe-4 ${activeTab === "rent" ? "active" : ""}`}
            onClick={() => handleTabChange("rent")}
          >
            {translation?.rent || "Rent"}
          </button>
        </div>
      </nav>

      {/* BHK Filter Section */}
      <div className="row align-items-center mb-3 mt-2">
        <div className="col-sm">
          <div className="btn-group btn-group-light hide-tick mb-2">
            {["All", "1BHK", "2BHK", "3BHK", "4BHK", "5BHK"].map((bhk, index) => (
              <React.Fragment key={index}>
                <input
                  type="radio"
                  className="btn-check"
                  name="flat_type"
                  id={`flat_${index}`}
                  checked={selectedBHK === bhk}
                  onChange={() => handleBHKChange(bhk)}
                />
                <label className="btn btn-outline-light" htmlFor={`flat_${index}`}>
                  {bhk}
                </label>
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="col-sm-auto">
          <h5>
            <Link target="_blank" href="/property-listing">
              {translation?.show_all_properties || "Show All Properties"}{" "}
              <i className="bi bi-arrow-right"></i>
            </Link>
          </h5>
        </div>
      </div>

      {/* Property Carousel */}
      <div className="tab-content bg-white p-3 mb-4">
        {filteredProperties.length > 0 ? (
          <Carousel responsive={responsive} autoPlay={false} infinite={true}>
            {filteredProperties.map((property) => (
              <article key={property.id} className="p-2">
                <div className="card card-ads">
                  <div className="card-image">
                    <img
                      src={
                        property?.gallery?.length > 0 && property?.gallery[0]?.images?.length > 0
                          ? property?.gallery[0]?.images[0]?.file
                          : "/assets/images/property/default-property-1.jpg"
                      }
                      alt={property?.name || "Property Image"}
                      className="card-img-top"
                    />
                    <span className={`ads-type ${activeTab === "buy" ? "sale" : "rent"}`}>
                      {activeTab === "buy" ? "For Sale" : "For Rent"}
                    </span>
                  </div>
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <h5 className="text-primary">{formatPrice(property.expected_price) || ""}</h5>
                      <p>
                        <span className="text-muted">
                          {property.super_area} {translation?.sq_ft || "Sq. Ft"}
                        </span>
                      </p>
                    </div>
                    <h4>
                      <small>
                        <Link target="_blank" href={`/property-details/${property?.slug}`}>
                          {property.name}
                        </Link>
                      </small>
                    </h4>
                    <p>{property.bhk_type} {translation?.flat_by_real_estate || "Flat by (Real estate)"}</p>
                    <p>
                      <a href="#">
                        <i className="icon-feather-map-pin"></i> {property.property_address}
                      </a>
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </Carousel>
        ) : (
          <article className="col-12 mb-3 text-center">
            <img alt="Icon" height="48" width="48" src="/assets/images/icons/9939447.png" />
            <p className="text-muted">
              {translation?.no_properties_available || "No properties available for the selected criteria."}
            </p>
          </article>
        )}
      </div>

      {/* Modal for Project Enquiry Form */}
      <Modal show={showForm} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {translation?.contact_agent_for_property || "Contact Agent for Property"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentPropertyId && <ProjectEnquiryForm propertyId={currentPropertyId} />}
        </Modal.Body>
      </Modal>
    </section>
  );
};

export default ProjectedProperty;
