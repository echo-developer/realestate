import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CardImageSlider from "../cardImageSlider/CardImageSlider";
import Link from "next/link";
import { Modal, Button } from "react-bootstrap";
import EnquiryForm from "../charts/EnquiryForm";
import useTranslation from "@/hooks/useTranslation";

// Custom Arrow components
const PrevArrow = (props) => {
  const { className, onClick } = props;
  return (
    <button
      className={`slick-prev ${className}`}
      onClick={onClick}
      style={{ position: "absolute", top: "50%", left: "10px", zIndex: 1 }}
    >
      <i className="bi bi-chevron-left" style={{ fontSize: "24px" }}></i>
    </button>
  );
};

const NextArrow = (props) => {
  const { className, onClick } = props;
  return (
    <button
      className={`slick-next ${className}`}
      onClick={onClick}
      style={{ position: "absolute", top: "50%", right: "10px", zIndex: 1 }}
    >
      <i className="bi bi-chevron-right" style={{ fontSize: "24px" }}></i>
    </button>
  );
};

const NearbyProperties = ({ propertydata, heading, addFavNearByProperties }) => {
  const translation = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const handleShowModal = (id) => {
    setSelectedProjectId(id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProjectId(null);
  };

  const settings = {
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    dots: false,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
  };

  // Display only the first 3 projects
  const displayedProperties = propertydata?.slice(0, 3);

  return (
    <>
      {propertydata?.length > 0 && (
        <div className="card border-0 shadow-1 mb-4">
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <h4 className="mb-3 text-primary">{heading || "Nearby Projects"}</h4>
              <h5>
                <Link target="_blank" href="/property-listing">
                {translation?.explore_all_properties|| "Explore All Properties"} <i className="bi bi-arrow-right"></i>
                </Link>
              </h5>
            </div>
            <div className="row gx-3 -mb-3">
              {displayedProperties?.map((property, index) => (
                <article key={index} className="col-lg-4 col-sm-6 mb-3">
                  <div className="card card-ads">
                    <CardImageSlider data={property} keyword="gallery" addRemoveFav={addFavNearByProperties} id="id" />
                    <div className="card-body">
                      <h4>
                      <Link target="_blank" href={`/property-details/${property.slug}`}>{property.property_name ||"Not Available"}</Link>
                      </h4>
                      <p className="mb-1">
                        <i className="icon-feather-map-pin"></i> {property.address ||"Not Available"}
                      </p>
                      <p className="text-muted mb-2">{property.possession_status ||"Not Available"}</p>
                      <a onClick={() => handleShowModal(property.id)} style={{ cursor: "pointer", color: "blue" }}>
                      {translation?.contact_agent || "Contact Agent"} <i className="bi bi-arrow-right"></i>
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Modal */}
          <Modal show={showModal} onHide={handleCloseModal} centered>
            <Modal.Header closeButton>
              <Modal.Title> {translation?.contact_agent || "Contact Agent"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <EnquiryForm projectId={selectedProjectId} handleClose={handleCloseModal} />
            </Modal.Body>
          </Modal>
        </div>
      )}
    </>
  );
};

export default NearbyProperties;
