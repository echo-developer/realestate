"use client"
import Link from 'next/link';
import React, { useState } from 'react';
import ProjectEnquiryForm from './ProjectEnquiryForm';
import { Modal } from 'react-bootstrap';





const ProjectedProperty = () => {
  const [activeTab, setActiveTab] = useState("rent");
  const [selectedBHK, setSelectedBHK] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [currentPropertyId, setCurrentPropertyId] = useState(null);

  const properties = {
    rent: [
      {
        id: 1,
        type: "2 BHK Flat",
        price: "₹3.1 Cr - ₹4.8 Cr",
        size: "848-984 Sq. Ft.",
        location: "Dubai Marina, Dubai, UAE",
        images: [
          "/assets/images/uploads/complex-3.jpg",
          "/assets/images/uploads/complex-2.jpg",
          "/assets/images/uploads/plot-3.jpg",
        ],
      },
      {
        id: 2,
        type: "3 BHK Flat",
        price: "₹5.5 Cr - ₹7.2 Cr",
        size: "1050-1200 Sq. Ft.",
        location: "Jumeirah Beach, Dubai, UAE",
        images: [
          "/assets/images/uploads/complex-1.jpg",
          "/assets/images/uploads/complex-2.jpg",
          "/assets/images/uploads/complex-3.jpg",
        ],
      },
      {
        id: 3,
        type: "5 BHK Flat",
        price: "₹5.6 Cr - ₹4.2 Cr",
        size: "1050-1200 Sq. Ft.",
        location: "Jumeirah Beach, Dubai, UAE",
        images: [
          "/assets/images/uploads/complex-1.jpg",
          "/assets/images/uploads/complex-2.jpg",
          "/assets/images/uploads/complex-3.jpg",
        ],
      },
    ],
    buy: [
      {
        id: 1,
        type: "1 BHK Flat",
        price: "₹1.1 Cr - ₹1.8 Cr",
        size: "500-600 Sq. Ft.",
        location: "Downtown, Dubai, UAE",
        images: [
          "/assets/images/uploads/complex-1.jpg",
          "/assets/images/uploads/complex-2.jpg",
          "/assets/images/uploads/complex-3.jpg",
        ],
      },
      {
        id: 2,
        type: "4 BHK Villa",
        price: "₹8 Cr - ₹12 Cr",
        size: "2000-2500 Sq. Ft.",
        location: "Palm Jumeirah, Dubai, UAE",
        images: [
          "/assets/images/uploads/complex-3.jpg",
          "/assets/images/uploads/complex-2.jpg",
          "/assets/images/uploads/complex-1.jpg",
        ],
      },
      {
        id: 3,
        type: "5 BHK Villa",
        price: "₹10 Cr - ₹13 Cr",
        size: "2000-2500 Sq. Ft.",
        location: "Palm Jumeirah, Dubai, UAE",
        images: [
          "/assets/images/uploads/complex-3.jpg",
          "/assets/images/uploads/complex-2.jpg",
          "/assets/images/uploads/complex-1.jpg",
        ],
      },
    ],
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedBHK("All");
  };

  const handleBHKChange = (bhk) => {
    setSelectedBHK(bhk);
  };

  const filteredProperties =
    selectedBHK === "All"
      ? properties[activeTab]
      : properties[activeTab].filter((property) =>
          property.type.startsWith(selectedBHK)
        );

  const handleShowForm = (propertyId) => {
    setCurrentPropertyId(propertyId);  // Set the property ID to track which one is clicked
    setShowForm(true);  // Open the modal
  };

  const handleCloseModal = () => {
    setShowForm(false);  // Close the modal
    setCurrentPropertyId(null); // Reset property ID
  };

  return (
    <section id="overview">
      <h4 className="text-primary mb-3">Properties In Real Estate</h4>
      <nav>
        <div className="nav nav-pills" id="nav-tab" role="tablist">
          <button
            className={`nav-link ps-4 pe-4 ${activeTab === "buy" ? "active" : ""}`}
            onClick={() => handleTabChange("buy")}
            type="button"
            aria-selected={activeTab === "buy"}
          >
            Buy
          </button>
          <button
            className={`nav-link ps-4 pe-4 ${activeTab === "rent" ? "active" : ""}`}
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
            {["All", "1 BHK", "2 BHK", "3 BHK", "4 BHK", "5 BHK"].map((bhk, index) => (
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
                <label className="btn btn-outline-light" htmlFor={`flat_${index}`}>
                  {bhk}
                </label>
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="col-sm-auto">
          <h5>
            <Link href="/project-listing">
              Show All Properties For Sale <i className="bi bi-arrow-right"></i>
            </Link>
          </h5>
        </div>
      </div>

      {/* Property Listing */}
      <div className="tab-content bg-white p-3 mb-4" id="nav-tabContent">
        <div className="row -mb-3">
          {filteredProperties.map((property) => (
            <article key={property.id} className="col-lg-4 col-sm-6 col-12">
              <div className="card card-ads">
                <div className="card-image">
                  <div
                    id={`carousel${activeTab}-${property.id}`}
                    className="carousel slide ads-carousel"
                  >
                    <div className="carousel-inner">
                      {property.images.map((image, index) => (
                        <div
                          key={index}
                          className={`carousel-item ${index === 0 ? "active" : ""}`}
                        >
                          <img src={image} alt="" className="card-img-top" />
                        </div>
                      ))}
                    </div>
                    <button
                      className="carousel-control-prev"
                      type="button"
                      data-bs-target={`#carousel${activeTab}-${property.id}`}
                      data-bs-slide="prev"
                    >
                      <span
                        className="carousel-control-prev-icon"
                        aria-hidden="true"
                      ></span>
                      <span className="visually-hidden">Previous</span>
                    </button>
                    <button
                      className="carousel-control-next"
                      type="button"
                      data-bs-target={`#carousel${activeTab}-${property.id}`}
                      data-bs-slide="next"
                    >
                      <span
                        className="carousel-control-next-icon"
                        aria-hidden="true"
                      ></span>
                      <span className="visually-hidden">Next</span>
                    </button>
                  </div>
                  <span
                    className={`ads-type ${activeTab === "buy" ? "sale" : "rent"}`}
                  >
                    {activeTab === "buy" ? "For Sale" : "For Rent"}
                  </span>
                  <span className="ads-fav">
                    <i className="icon-line-awesome-heart-o"></i>
                  </span>
                  <span className="total-ad-pic">
                    <i className="bi bi-camera"></i> {property.images.length}
                  </span>
                </div>
                <div className="card-body">
                  <h4 className="text-muted">{property.type}</h4>
                  <div className="d-flex justify-content-between">
                    <h3>{property.price}</h3>
                    <p>
                      <span className="text-muted">{property.size}</span>
                    </p>
                  </div>
                  <h4>
                    <a href="project-details.php">Real estate {property.type}</a>
                  </h4>
                  <p className="mb-2">
                    <a href="">
                      <i className="icon-feather-map-pin"></i> {property.location}
                    </a>
                  </p>
                  {/* <a onClick={() => handleShowForm(property.id)} className="btn btn-outline-primary">
                    Contact Agent
                  </a> */}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Modal for Project Enquiry Form */}
      <Modal show={showForm} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Contact Agent for Property</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentPropertyId && <ProjectEnquiryForm propertyId={currentPropertyId} />}
        </Modal.Body>
      </Modal>
    </section>
  );
};

export default ProjectedProperty;
