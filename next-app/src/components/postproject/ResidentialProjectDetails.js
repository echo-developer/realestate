"use client";
import Link from "next/link";
import React, { useState } from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import "react-image-gallery/styles/css/image-gallery.css";
import useDateFormat from "@/hooks/useDateFormat";
import ProjectGallery from "./ProjectGallery";
import ProjectedProperty from "./ProjectedProperty";
import { minBudgetOptions, maxBudgetOptions } from "../post/PropertyData";
import FloorPlanSection from "../project/FloorPlanSection";
import NearbyProjects from "../project/NearByProject";
import OtherProjects from "../project/OtherProject";
import SimilarProjects from "../project/SimilarProjects";
import ProjectSidebar from "../project/ProjectSidebar";
import ProjectReviewData from "../userReview/ProjectReviewData";
import { ShimmerFeaturedGallery } from "react-shimmer-effects";
import ProjectEnquiryForm from "./ProjectEnquiryForm";
import { Modal, Row, Col, Button } from "react-bootstrap";
import ProjectLandmarkData from "../project/ProjectLandmarkData";
import DOMPurify from "dompurify";
import useTranslation from "@/hooks/useTranslation";
import { CheckCircleFill, XCircleFill } from "react-bootstrap-icons";
 import {
  facingOptions,
  featureList,
  waterAvailabilityOptions,
  electricityStatusOptions,
  propertyFeatures,
  flooringOptions,
} from "../post/PropertyData";
import ProjectReviewDetails from "../project/ProjectReviewDetails";
import FloorSection from "../project/FloorSection";
import { useAuth } from "@/context/AuthProvider";
import useAdvertisement from "@/hooks/useAdvertisement";

const ResidentialProjectDetails = ({
  detailsData,
  loading,
  addRemoveFav,
  addFavSimilarProjects,
  addFavNearByProjects,
  addFavOtherProjects,
  loginCheck,
  setShowLoginErrorModal,
  userDetails,
  showCommunicationModal,
  setShowCommunicationModal,
  showPhoneNumber, 
  setShowPhoneNumber,
  displayNumber,
  viewNumber,
}) => {
  const { defaultCity, currencyCode, formatPrice } = useAuth();
  const [visible, setVisible] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [projectId, setprojectId] = useState();
  const [showReview, setShowReview] = useState(false);
  const [showContactModal, setShowCotactModal] = useState(false);
  const [viewMore, setViewMore] = useState(false);
  const [activeTabMenu, setActiveTabMenu] = useState("overview");
  const translation = useTranslation();
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const { adsData, logAdClick } = useAdvertisement(
    "project-detail-page",
    "footer",
    defaultCity?.city_id,
    detailsData?.project_type_id
  );

  const ShowGalleryList = (id) => {
    setVisible(true);
    setprojectId(id);
  };

  const minPrice = minBudgetOptions?.find(
    (item) => item?.value == detailsData?.minBudget
  );
  const maxPrice = maxBudgetOptions?.find(
    (item) => item?.value == detailsData?.minBudget
  );
  const imageList = detailsData?.gallery?.flatMap((item) => item?.images);

  const ShowReviewModal = () => {
    if (loginCheck()) {
      setShowReview(true);
    } else {
      setShowLoginErrorModal(true);
    }
  };

  const handleHideReviewModal = () => setShowReview(false);

  const handleShowContactModal = (id) => {
    setShowCotactModal(true);
  };

  const handleViewMore = () => {
    setShowAllAmenities((prevState) => !prevState);
  };

  const amenitiesToShow = showAllAmenities
    ? detailsData?.project_amenity || []
    : detailsData?.project_amenity?.slice(0, 10) || [];

  return (
    <>
      <div className="clearfix"></div>
      <section className="section">
        <div className="container-fluid">
          <div className="row main-row">
            <aside className="col-xl-9 col-12 mb-4 mb-xl-0">
              {!loading ? (
                <>
                  {/* Project Information Section */}
                  <div className="d-md-flex justify-content-between align-items-end mb-3">
                    <div className="mb-3 mb-md-0">
                      <h1 className="h3">
                        {detailsData?.project_name ||
                          `${translation?.not_available ||
                          `${translation?.not_available || "Not Available"}`
                          }`}
                      </h1>
                      <p>
                        <a role="button">
                          <i className="icon-feather-map-pin"></i>{" "}
                          {detailsData?.address ||
                            `${translation?.not_available ||
                            `${translation?.not_available || "Not Available"}`
                            }`}
                        </a>{" "}
                        <span className="text-muted">
                          {translation?.by_real_estate_limited ||
                            "(By Real Estate Limited)"}
                        </span>
                      </p>
                    </div>
                    <div className="text-md-end" style={{ minWidth: "150px" }}>
                      <p className="text-muted mb-0">
                        {translation?.launched_in || "Launched In:"}{" "}
                      </p>
                      <h5 className="mb-0">
                        {useDateFormat(detailsData?.created_at)}
                      </h5>
                      {/* <p>
                        Possession In: <span className="text-muted">2030</span>
                      </p> */}
                    </div>
                  </div>

                  {/* Gallery Section */}
                  <div className="frontGallery-project">
                    <div
                      className="row gx-3"
                      onClick={() => ShowGalleryList(detailsData?.id)}
                    >
                      {/* Main Property Image */}
                      <div className="col-12 mb-3">
                        <img
                          className="w-100"
                          src={
                            detailsData?.gallery?.[0]?.images?.[0]?.file ||
                            "/assets/images/property/default-property-1.jpg"
                          }
                          alt="First Property Image"
                        />
                      </div>

                      {/* Additional Images */}
                      {!visible &&
                        imageList?.slice(1, 5).map((item, index) => (
                          <div
                            key={index}
                            className="col-md-3 col-6 mb-3"
                            style={{ cursor: "pointer" }}
                          >
                            <a
                              href="#"
                              className="gallery-item"
                              style={
                                index === 3
                                  ? {
                                    position: "relative",
                                    display: "block",
                                  }
                                  : {}
                              }
                            >
                              <img
                                className="w-100"
                                src={
                                  item.file ||
                                  "/assets/images/property/default-property-1.png"
                                }
                                alt={`Gallery Image ${index + 2}`}
                                style={
                                  index === 3
                                    ? {
                                      display: "block", // Prevents inline-level gaps
                                    }
                                    : {}
                                }
                              />

                              {/* Overlay */}
                              <div
                                style={
                                  index === 3
                                    ? {
                                      position: "absolute",
                                      top: 0,
                                      left: 0,
                                      width: "100%",
                                      height: "100%",
                                      backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
                                      backdropFilter: "blur(8px)", // Apply blur effect
                                      WebkitBackdropFilter: "blur(8px)", // Safari support
                                      display: "flex", // Center content
                                      alignItems: "center",
                                      justifyContent: "center",
                                      color: "#fff", // Text color
                                      zIndex: 1, // Ensure overlay is above the image
                                    }
                                    : {}
                                }
                              >
                                {index === 3 && (
                                  <h4>
                                    <i className="bi bi-plus-lg"></i>{" "}
                                    {imageList?.length - 4}{" "}
                                    {translation?.photos || "Photos"}
                                  </h4>
                                )}
                              </div>
                            </a>
                          </div>
                        ))}
                    </div>
                  </div>
                </>
              ) : (
                <ShimmerFeaturedGallery
                  row={2}
                  col={2}
                  card
                  frameHeight={600}
                />
              )}

              {visible && (
                <ProjectGallery
                  setVisible={setVisible}
                  projectId={projectId}
                  userDetails={userDetails}
                />
              )}

              <div className="row mb-3 mt-3">
                <div className="col-md mb-3 mb-md-0">
                  <h3>
                    {/* {detailsData?.currency ||
                      `${translation?.not_available ||
                      `${translation?.not_available || "Not Available"}`
                      }`}{" "} */}
                      {/* {currencyCode || ""}
                    {detailsData?.expected_price ||
                      `${translation?.not_available || "Price Not Available"}`} */}
                      {formatPrice(detailsData?.expected_price) || "Price Not Available"}
                  </h3>
                  <p>
                    {detailsData?.available_bhk
                      ? `${detailsData?.available_bhk} BHK Flats`
                      : ""}
                  </p>
                </div>
                <div className="col-md-auto text-md-end">
                  <div className="d-grid flex-column gap-3 h-100">
                    {detailsData?.project_brochure_pdf && (
                      <p>
                        {translation?.download_brochure || "Download Brochure"}{" "}
                        <Link
                          target="_blank"
                          href={`${detailsData?.project_brochure_pdf}`}
                          className="ms-3"
                        >
                          <img
                            src="/assets/images/icons/brochure.png"
                            alt="Download Brochure"
                            height="32"
                          />
                        </Link>
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div id="undefined-sticky-wrapper" className="sticky-wrapper">
                <div className="one-page-menu mb-3" style={{}}>
                  <ul>
                    <li
                      className={activeTabMenu === "overview" ? "active" : ""}
                      onClick={() => setActiveTabMenu("overview")}
                    >
                      <a href="#overview">
                        {translation?.overview || "Overview"}
                      </a>
                    </li>
                    <li
                      className={activeTabMenu === "properties" ? "active" : ""}
                      onClick={() => setActiveTabMenu("properties")}
                    >
                      <a href="#properties">
                        {translation?.properties || "Properties"}
                      </a>
                    </li>
                    <li
                      className={
                        activeTabMenu === "about_projects" ? "active" : ""
                      }
                      onClick={() => setActiveTabMenu("about_projects")}
                    >
                      <a href="#overview">
                        {translation?.about_projects || "About Projects"}
                      </a>
                    </li>
                    <li
                      className={activeTabMenu === "amenities" ? "active" : ""}
                      onClick={() => setActiveTabMenu("amenities")}
                    >
                      <a href="#amenity">
                        {translation?.amenities || "Amenities"}
                      </a>
                    </li>
                    <li
                      className={activeTabMenu === "review" ? "active" : ""}
                      onClick={() => setActiveTabMenu("review")}
                    >
                      <a href="#review">
                        {translation?.project_reviews || "Project Reviews"}
                      </a>
                    </li>
                    <li
                      className={activeTabMenu === "floor_plan" ? "active" : ""}
                      onClick={() => setActiveTabMenu("floor_plan")}
                    >
                      <a href="#floor-plan">
                        {translation?.floor_plan_units || "Floor Plan 7 units"}
                      </a>
                    </li>
                    <li
                      className={
                        activeTabMenu === "about_developer" ? "active" : ""
                      }
                      onClick={() => setActiveTabMenu("about_developer")}
                    >
                      <a href="#about-developer">
                        {translation?.about_developer || "About Developer"}
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <ProjectedProperty
                projectProperties={detailsData?.project_properties}
              />

              <section id="overview">
                <div className="card border-0 shadow-1 mb-4">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <h4 className="mb-3 text-primary">{translation?.overview || "Overview"}</h4>
                    </div>
                    <ul className="list list-property-details mb-4">
                      <li>
                        <div className="d-flex">
                          <img
                            alt="Property Type"
                            height="48"
                            width="48"
                            src="/assets/images/icons/property-type.png"
                          />
                          <div className="flex-grow-1 ps-2">
                            <span className="text-muted">
                              {translation?.property_type || "Property Type"}
                            </span>
                            <h5>
                              {detailsData?.project_type ||
                                `${translation?.not_available || "Not Available"
                                }`}
                            </h5>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="d-flex">
                          <img
                            alt="Total Units"
                            height="48"
                            width="48"
                            src="/assets/images/icons/carpet-area.png"
                          />
                          <div className="flex-grow-1 ps-2">
                            <span>
                              {translation?.total_units || "Total Units"}
                            </span>
                            <h5>
                              {detailsData?.total_units ||
                                `${translation?.not_available || "Not Available"
                                }`}
                            </h5>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="d-flex">
                          <img
                            alt="Total Towers"
                            height="48"
                            width="48"
                            src="/assets/images/icons/tower.png"
                          />
                          <div className="flex-grow-1 ps-2">
                            <span>
                              {translation?.total_towers || "Total Towers"}
                            </span>
                            <h5>
                              {detailsData?.total_towers ||
                                `${translation?.not_available || "Not Available"
                                }`}
                            </h5>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="d-flex">
                          <img
                            alt="Garage Size"
                            height="48"
                            width="48"
                            src="/assets/images/icons/carpet-area.png"
                          />
                          <div className="flex-grow-1 ps-2">
                            <span>
                              {" "}
                              {translation?.occupied_area || "Occupied Area"}
                            </span>
                            <h5>
                              {detailsData?.occupied_area ||
                                `${translation?.not_available || "Not Available"
                                }`}{" "}
                              {detailsData?.unit_type}
                            </h5>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="d-flex">
                          <img
                            alt="Launch Date"
                            height="48"
                            width="48"
                            src="/assets/images/icons/calendar.png"
                          />
                          <div className="flex-grow-1 ps-2">
                            <span>
                              {" "}
                              {translation?.launch_date || "Launch Date"}
                            </span>
                            <h5>
                              {useDateFormat(detailsData?.created_at) ||
                                `${translation?.not_available || "Not Available"
                                }`}
                            </h5>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="d-flex">
                          <img
                            alt="Locatily"
                            height="48"
                            width="48"
                            src="/assets/images/icons/size.png"
                          />
                          <div className="flex-grow-1 ps-2">
                            <span>
                              {" "}
                              {translation?.total_area || "Total Area"}
                            </span>
                            <h5>
                              {detailsData?.total_area ||
                                `${translation?.not_available || "Not Available"
                                }`}{" "}
                              {detailsData?.unit_type}
                            </h5>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="d-flex">
                          <img
                            alt="Facing"
                            height="48"
                            width="48"
                            src="/assets/images/icons/8270179.png"
                          />
                          <div className="flex-grow-1 ps-2">
                            <span>{translation?.facing || "Facing"}</span>
                            <h5>
                              {facingOptions.find(
                                (item) =>
                                  item.key === detailsData?.project_facing
                              )?.value ||
                                `${translation?.not_available || "Not Available"
                                }`}
                            </h5>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="d-flex">
                          <img
                            alt="Booking Price"
                            height="48"
                            width="48"
                            src="/assets/images/icons/money.png"
                          />
                          <div className="flex-grow-1 ps-2">
                            <span className="text-muted">
                              {translation?.booking_price || "Booking Price"}
                            </span>

                            <h5>
                              {detailsData?.currency || "Not Available"}{" "}
                              {detailsData?.token_amount ||
                                `${translation?.not_available || "Not Available"
                                }`}
                            </h5>
                          </div>
                        </div>
                      </li>
                    </ul>

                    <h4 className="mb-3 text-primary">
                      {translation?.more_details || "More Details"}
                    </h4>
                    <Row>
                      <Col className="col-xl-3 col-md-4 col-6 mb-4">
                        <p className="text-muted mb-2">
                          {translation?.price_breakup || "Price Breakup:"}
                        </p>
                        <h5>
                          {detailsData?.currency || "Not Available"}{" "}
                          {detailsData?.expected_price ||
                            `${translation?.not_available || "Not Available"}`}
                        </h5>
                      </Col>
                      <Col className="col-xl-3 col-md-4 col-6 mb-4">
                        <p className="text-muted mb-2">
                          {translation?.furnishing || "Furnishing:"}
                        </p>
                        <h5>
                          {detailsData?.project_furnish ||
                            `${translation?.not_available || "Not Available"}`}
                        </h5>
                      </Col>
                      <Col className="col-xl-3 col-md-4 col-6 mb-4">
                        <p className="text-muted mb-2">
                          {translation?.type_of_ownership ||
                            "Type of Ownership:"}
                        </p>
                        <h5>
                          {detailsData?.ownership_type ||
                            `${translation?.not_available || "Not Available"}`}
                        </h5>
                      </Col>
                      <Col className="col-xl-3 col-md-4 col-6 mb-4">
                        <p className="text-muted mb-2">
                          {translation?.main_road_facing || "Main Road Facing:"}
                        </p>
                        <h5>
                          {detailsData?.main_road_facing ||
                            `${translation?.not_available || "Not Available"}`}
                        </h5>
                      </Col>
                      <Col className="col-xl-6 col-md-6 mb-4">
                        <p className="text-muted mb-2">
                          {translation?.address || "Address:"}
                        </p>
                        <h5>
                          {detailsData?.address ||
                            `${translation?.not_available || "Not Available"}`}
                        </h5>
                      </Col>
                      <Col className="col-xl-6 col-md-6 mb-4">
                        <p className="text-muted mb-2">
                          {translation?.locality || "Locality:"}
                        </p>
                        <h5>
                          {detailsData?.locality ||
                            `${translation?.not_available || "Not Available"}`}
                        </h5>
                      </Col>

                      {/* View More Details */}
                      {viewMore && (
                        <>
                          <Col className="col-xl-3 col-md-4 col-6 mb-4">
                            <p className="text-muted mb-2">
                              {translation?.possession_status ||
                                "Possession Status:"}
                            </p>
                            <h5>
                              {detailsData?.possession_status ||
                                `${translation?.not_available || "Not Available"
                                }`}
                            </h5>
                          </Col>
                          <Col className="col-xl-3 col-md-4 col-6 mb-4">
                            <p className="text-muted mb-2">
                              {translation?.parking_availability ||
                                "Parking Availability:"}
                            </p>
                            <h5>
                              {detailsData?.parking_availability === "AV"
                                ? "Available"
                                : detailsData?.parking_availability === "NA"
                                  ? `${translation?.not_available ||
                                  "Not Available"
                                  }`
                                  : detailsData?.parking_availability === "UC"
                                    ? "Under Construction"
                                    : `${translation?.not_available ||
                                    "Not Available"
                                    }`}
                            </h5>
                          </Col>

                          <Col className="col-xl-3 col-md-4 col-6 mb-4">
                            <p className="text-muted mb-2">
                              {translation?.water_availability ||
                                "Water Availability:"}
                            </p>
                            <h5>
                              {waterAvailabilityOptions.find(
                                (item) =>
                                  item.key === detailsData?.water_availability
                              )?.value ||
                                `${translation?.not_available || "Not Available"
                                }`}
                            </h5>
                          </Col>
                          <Col className="col-xl-3 col-md-4 col-6 mb-4">
                            <p className="text-muted mb-2">
                              {translation?.electricity_status ||
                                "Electricity Status:"}
                            </p>
                            <h5>
                              {electricityStatusOptions.find(
                                (item) => item.key === detailsData?.electricity
                              )?.value ||
                                `${translation?.not_available || "Not Available"
                                }`}
                            </h5>
                          </Col>
                        </>
                      )}
                    </Row>

                    <Button
                      variant="outline-primary"
                      className="mb-3"
                      onClick={() => setViewMore(!viewMore)}
                    >
                      {viewMore
                        ? `${translation?.view_less_details ||
                        "View Less Details"
                        }`
                        : `${translation?.view_more_details ||
                        "View More Details"
                        }`}{" "}
                      <i
                        className={`bi bi-chevron-${viewMore ? "up" : "down"}`}
                      ></i>
                    </Button>

                    <h4 className="mb-3 text-primary">{translation?.description || "Description"}</h4>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: detailsData?.project_desc
                          ? DOMPurify.sanitize(detailsData?.project_desc)
                          : "Description not available",
                      }}
                    />
                  </div>
                </div>
              </section>
              <div className="card border-0 shadow-1 mb-4">
                <div className="card-body">
                  <Row className="-mb-3">
                    <Col className="col-lg-6 col-12 mb-3">
                      <h4 className="text-primary mb-3">
                        {translation?.flooring_material || "Flooring Material"}
                      </h4>
                      <ul className="list list-none mb-0">
                        {detailsData?.flooring_style?.length > 0 ? (
                          detailsData?.flooring_style.map((item, index) => {
                            const flooring = flooringOptions.find(
                              (f) => f.key === item
                            );
                            return (
                              <li key={index}>
                                <CheckCircleFill
                                  color="green"
                                  size={16}
                                  className="me-2"
                                />
                                {flooring ? flooring.value : item}
                                {index <
                                  detailsData?.flooring_style?.length - 1 &&
                                  ", "}
                              </li>
                            );
                          })
                        ) : (
                          <span>
                            {translation?.no_flooring_info ||
                              "No flooring information available"}
                          </span>
                        )}
                      </ul>
                    </Col>
                    <Col className="col-lg-6 col-12 mb-3">
                      <h4 className="text-primary mb-3">
                        {translation?.overlooking || "Overlooking:"}
                      </h4>
                      <ul className="list list-none mb-0">
                        {detailsData?.overlooking?.length > 0 ? (
                          detailsData.overlooking.map((item, index) => {
                            const feature = propertyFeatures.find(
                              (f) => f.key === item
                            );
                            return (
                              <li key={index}>
                                <CheckCircleFill
                                  color="green"
                                  size={16}
                                  className="me-2"
                                />
                                {feature ? feature.value : item}
                                {index < detailsData.overlooking.length - 1 &&
                                  ", "}
                              </li>
                            );
                          })
                        ) : (
                          <span>
                            {translation?.no_overlooking_info ||
                              "No overlooking information available"}
                          </span>
                        )}
                      </ul>
                    </Col>
                  </Row>
                </div>
              </div>
              <section id="amenity">
                <div className="card border-0 shadow-1 mb-4">
                  <div className="card-body">
                    <h4 className="mb-3 text-primary">
                      {translation?.amenities || "Amenities"}
                    </h4>
                    <ul className="list-info g-col-5 list-property-info mb-4">
                      {amenitiesToShow.length > 0 ? (
                        amenitiesToShow.map((amenity, index) => (
                          <li key={index} className="d-flex align-items-center">
                            <img
                              src={
                                amenity?.image ||
                                "/assets/images/icons/default.png"
                              }
                              alt={amenity?.amenity_name || "Amenity"}
                              height="24"
                              width="24"
                              className="me-2"
                            />
                            <span>
                              {amenity?.amenity_name ||
                                translation?.not_available ||
                                "Not available"}
                            </span>
                          </li>
                        ))
                      ) : (
                        <li>{translation?.not_available || "Not available"}</li>
                      )}
                    </ul>
                    {detailsData?.project_amenity?.length > 10 && (
                      <div className="g-col-sm-6 g-col-12 d-md-block">
                        <button
                          className="btn btn-outline-primary me-md-3"
                          onClick={handleViewMore}
                        >
                          {showAllAmenities
                            ? `${translation?.view_less_amenities ||
                            "View Less Amenities"
                            }`
                            : `${translation?.view_more_amenities ||
                            "View More Amenities"
                            }`}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </section>
              {/* <AdvertiserSection /> */}

              <FloorPlanSection detailsData={detailsData} />

              <FloorSection detailsData={detailsData} />
              <ProjectReviewDetails
                project_reviews={detailsData?.project_reviews}
                ShowReviewModal={ShowReviewModal}
                is_my_project={detailsData?.is_my_project}
              />
              {detailsData?.landmarks && (
                <ProjectLandmarkData detailsData={detailsData} />
              )}

              <section id="about-developer" className="mb-4">
                <div className="card border-0 shadow-1 mb-4">
                  <div className="card-body">
                    <h4 className="mb-3 text-primary">
                      {translation?.about_developer || "About Developer"}
                    </h4>
                    <div className="row">
                      {/* Developer Info */}
                      <article className="col-xxl-4 col-lg-5 col-sm-7 mb-3">
                        <h4>
                          {detailsData?.developer_name ||
                            `${translation?.not_available || "Not Available"}`}
                        </h4>
                        <p>
                          {detailsData?.developer_experience ||
                            `${translation?.not_available ||
                            `${translation?.not_available || "Not Available"}`
                            }`}{" "}
                        </p>
                      </article>

                      {/* Operating In Info */}
                      <article className="col-lg-auto col-sm-5">
                        <h4>{translation?.operating_in || "Operating In"}</h4>
                        <p>{translation?.mumbai || "Mumbai"}</p>
                      </article>

                      {/* Description */}
                      <article className="col-lg">
                        <p>
                          {detailsData?.developer_details ||
                            `${translation?.not_available || "Not Available"}`}
                          {/* <a>Read more</a> */}
                        </p>
                      </article>
                    </div>
                  </div>
                </div>
              </section>

              <div className="text-center mt-1 mb-2">
                {adsData.length > 0 ? (
                  adsData.map((ad) => (
                    <a
                      key={ad.advertisement_id}
                      role="button"
                      onClick={(e) => {
                        e.preventDefault();
                        logAdClick(ad.advertisement_id, ad.ad_url);
                      }}
                    >
                      <img src={ad.ad_image} alt="Ad" />
                    </a>
                  ))
                ) : (
                  <img
                    alt="Advertisement"
                    src="/assets/images/ads/ads-blank.jpg"
                    className="img-fluid"
                  />
                )}
              </div>

              {detailsData?.nearby_projects?.length > 0 && (
                <NearbyProjects
                  nearbyProjects={detailsData?.nearby_projects}
                  addRemoveFav={addFavNearByProjects}
                />
              )}
              {detailsData?.similar_projects?.length > 0 && (
                <SimilarProjects
                  projectdata={detailsData?.similar_projects}
                  addRemoveFav={addFavSimilarProjects}
                />
              )}
              {detailsData?.other_projects?.length > 0 && (
                <OtherProjects
                  otherProjects={detailsData?.other_projects}
                  addRemoveFav={addFavOtherProjects}
                />
              )}
  
              <p className="small">
                <b>{translation?.disclaimer || "Disclaimer"}</b>
                {translation?.property_disclaimer ||
                  "All property information, including but not limited to pricing, features, and availability, is subject to change without notice. Accuracy is not guaranteed, and interested parties should verify all details independently before making any decisions."}
              </p>
            </aside>
            <ProjectSidebar
              userDetails={detailsData?.user_details}
              projectId={detailsData?.id}
              addRemoveFav={addRemoveFav}
              projectDetails={detailsData}
              setShowLoginErrorModal={setShowLoginErrorModal}
              categoryId={detailsData?.project_type_id}
              showCommunicationModal={showCommunicationModal}
              setShowCommunicationModal={setShowCommunicationModal}
              showPhoneNumber={showPhoneNumber}
              setShowPhoneNumber={setShowPhoneNumber}
              viewNumber={viewNumber}
              displayNumber={displayNumber}
            />
          </div>
        </div>
      </section>

      <Offcanvas
        show={showReview}
        placement="end"
        onHide={handleHideReviewModal}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            {translation?.review_for_this_project || "Review for this Project"}
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <ProjectReviewData
            projectId={detailsData?.id}
            closeButton={handleHideReviewModal}
          />
        </Offcanvas.Body>
      </Offcanvas>

      <Modal closeButton={() => setShowCotactModal(false)}>
        <Modal.Header>
          {translation?.contact_header || "Contact Header"}
        </Modal.Header>
        <Modal.Body show={showContactModal}>
          <ProjectEnquiryForm closeModal={() => setShowCotactModal(false)} showPhoneNumber={true} displayNumber={displayNumber} />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ResidentialProjectDetails;
