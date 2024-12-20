import React, { useState } from "react";
import Link from "next/link";
import Modal from "react-bootstrap/Modal";

// Simulate static property data
const properties = [
  {
    property_id: 1,
    gallery: [
      {
        images: [
          { image: "assets/images/property/default_property.jpg" },
          { image: "assets/images/property/default_property.jpg" },
        ],
      },
    ],
    property_for: "rent",
    carpet_area: 1200,
    property_type: "Apartment",
    property_type_for: "Sale",
    bedroom: 3,
    bathroom: 2,
    city_name: "Dubai",
    expected_amt: 50000,
    member_name: "John Doe",
    agentDetailUrl: "/agent/1",
    logo: "logo.jpg",
    created_at: "2024-12-01",
  },
  {
    property_id: 2,
    gallery: [
      {
        images: [
          { image: "assets/images/property/default_property.jpg" },
          { image: "assets/images/property/default_property.jpg" },
        ],
      },
    ],
    property_for: "sale",
    carpet_area: 1500,
    property_type: "Villa",
    property_type_for: "Rent",
    bedroom: 4,
    bathroom: 3,
    city_name: "Abu Dhabi",
    expected_amt: 100000,
    member_name: "Jane Smith",
    agentDetailUrl: "/agent/2",
    logo: "logo2.jpg",
    created_at: "2024-12-10",
  },
];

const ResidentialType = () => {
  const [show, setShow] = useState(false);
  const [propertyId, setPropertyId] = useState(null);

  const handleClose = () => setShow(false);

  const handleClick = (property_id) => {
    setPropertyId(property_id);
    setShow(true);
  };

  const formattedDate = (date) => new Date(date).toLocaleDateString();

  return (
    <div className="list-display">
      {properties.map((property) => (
        <div key={property.property_id} className="card card-ads">
          <div className="row g-0">
            <div className="col-lg-3 col-sm-3">
              <div className="card-image">
                <div
                  id={`carousel${property.property_id}`}
                  className="carousel slide ads-carousel"
                  data-bs-ride="carousel"
                >
                  <div className="carousel-inner">
                    {property.gallery.flatMap((gallery, index) =>
                      gallery.images.map((image, imgIndex) => (
                        <div
                          key={`${index}-${imgIndex}`}
                          className={`carousel-item ${
                            imgIndex === 0 ? "active" : ""
                          }`}
                        >
                          <img
                            src={`assets/images/property/default_property.jpg`}
                            alt={`property image ${imgIndex}`}
                            className="card-img-top"
                          />
                        </div>
                      ))
                    )}
                  </div>
                  <button
                    className="carousel-control-prev"
                    type="button"
                    data-bs-target={`#carousel${property.property_id}`}
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
                    data-bs-target={`#carousel${property.property_id}`}
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
                  className="ads-type"
                  style={{
                    backgroundColor:
                      property.property_for === "rent" ? "green" : "orange",
                  }}
                >
                  For {property.property_for}
                </span>
                <div className="ads-price">
                  <h4>{property.carpet_area}/sq ft</h4>
                </div>
              </div>
            </div>
            <div className="col-lg-7 col-sm-7 position-relative">
              <div className="card-body">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a href="#">Property</a>
                  </li>
                  <li className="breadcrumb-item">
                    <a href="#">
                      {property.property_for.charAt(0).toUpperCase() +
                        property.property_for.slice(1)}
                    </a>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    {property.property_type}
                  </li>
                </ol>
                <h4>
                  <Link href={`/property-details/${property.property_id}`}>
                    {`${property.bedroom} BHK ${property.property_type} ${property.property_type_for} for ${property.property_for} in ${property.city_name}`}
                  </Link>
                </h4>
                <p className="mb-1">
                  <i className="icon-feather-map-pin"></i>
                  {property.city_name}
                </p>
                <ul className="list-info mb-2">
                  <li>
                    <i className="icon-img-flat"></i>
                    {property.property_type_for}
                  </li>
                  <li>
                    <i className="icon-img-bed" title="Bedrooms:"></i>
                    <span>{property.bedroom}</span>
                  </li>
                  <li>
                    <i className="icon-img-ratio"></i>
                    <span>{property.carpet_area}</span> sq ft
                  </li>
                  <li>
                    <i className="icon-img-tub" title="Bathrooms:"></i>
                    {property.property_type === "Commercial" ? (
                      <span>{property.washroom_no}</span>
                    ) : (
                      <span>{property.bathroom}</span>
                    )}
                  </li>
                </ul>
              </div>
              <div className="card-footer">
                <div className="user-details">
                  <div className="user-avatar">
                    <img
                      src={`/assets/images/default_property.jpg`}
                      alt=""
                      height="32"
                      width="32"
                      className="rounded-circle"
                    />
                  </div>
                  <div className="user-name">
                    <span>
                      <Link href={property.agentDetailUrl}>
                        {property.member_name}
                      </Link>
                    </span>
                  </div>
                </div>
                <div>
                  <span className="ad-post-date ms-3">
                    <i className="icon-feather-calendar"></i>
                    {formattedDate(property.created_at)}
                  </span>
                </div>
              </div>
            </div>
            <div className="col-lg-2 col-sm-2">
              <div className="contact-box">
                <div className="mb-2">
                  <h4 className="mb-0">AED {property.expected_amt}</h4>
                </div>
                <div className="d-grid">
                  <button
                    className="btn btn-primary btn-sm msg-send mb-2"
                    onClick={() => handleClick(property.property_id)}
                  >
                    Contact Now
                  </button>
                  <button className="btn btn-primary btn-sm msg-send mb-2">
                    Favourite
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      {/* Modal for Contact Owner */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Contact Owner</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Enquiry Form for property {propertyId}</p>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ResidentialType;
