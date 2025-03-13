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
import { Modal } from "react-bootstrap";
import ProjectLandmarkData from "../project/ProjectLandmarkData";
import DOMPurify from "dompurify";
import useTranslation from "@/hooks/useTranslation";

import {
  facingOptions,
  featureList,
  waterAvailabilityOptions,
  electricityStatusOptions,
  propertyFeatures,
  flooringOptions,
} from "../post/PropertyData";
import ProjectReviewDetails from "../project/ProjectReviewDetails";

const ResidentialProjectDetails = ({
  detailsData,
  loading,
  addRemoveFav,
  addFavSimilarProjects,
  addFavNearByProjects,
  addFavOtherProjects,
  loginCheck,
  setShowLoginErrorModal,
}) => {
  const [visible, setVisible] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [projectId, setprojectId] = useState();
  const [showReview, setShowReview] = useState(false);
  const [showContactModal, setShowCotactModal] = useState(false);
  const [viewMore, setViewMore] = useState(false);
  const [activeTabMenu, setActiveTabMenu] = useState("overview");
  const translation = useTranslation();
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
                  <div className="d-md-flex justify-content-between mb-3">
                    <div className="mb-3 mb-md-0">
                      <h1 className="h3">
                        {detailsData?.project_name ||
                          `${
                            translation?.not_available ||
                            `${translation?.not_available || "Not Available"}`
                          }`}
                      </h1>
                      <p>
                        <a role="button">
                          <i className="icon-feather-map-pin"></i>{" "}
                          {detailsData?.address ||
                            `${
                              translation?.not_available ||
                              `${translation?.not_available || "Not Available"}`
                            }`}
                        </a>{" "}
                        <span className="text-muted">
                          {translation?.by_real_estate_limited ||
                            "(By Real Estate Limited)"}
                        </span>
                      </p>
                    </div>
                    <div className="text-md-end">
                      <p className="mb-2">
                        {translation?.launched_in || "Launched In:"}{" "}
                        <span className="text-muted">
                          {useDateFormat(detailsData?.created_at)}
                        </span>
                      </p>
                      {/* <p>
                        Possession In: <span className="text-muted">2030</span>
                      </p> */}
                    </div>
                  </div>

                  {/* Gallery Section */}
                  <div
                    className="row gx-3"
                    onClick={() => ShowGalleryList(detailsData?.id)}
                  >
                    {/* Main Property Image */}
                    <div className="col-12 mb-3">
                      <img
                        className="rounded w-100"
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
                          className="col-sm-3"
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
                              className="rounded w-100"
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
                <ProjectGallery setVisible={setVisible} projectId={projectId} />
              )}

              <div className="row mb-3 mt-3">
                <div className="col-md mb-3 mb-md-0">
                  <h3>
                    {detailsData?.currency ||
                      `${
                        translation?.not_available ||
                        `${translation?.not_available || "Not Available"}`
                      }`}{" "}
                    {detailsData?.expected_price ||
                      `${translation?.not_available || "Not Available"}`}
                  </h3>
                  <p>
                    {detailsData?.available_bhk
                      ? `${detailsData?.available_bhk} BHK Flats`
                      : ""}
                  </p>
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
                <div className="col-md-auto text-md-end">
                  <div className="d-grid flex-column gap-3 h-100">
                    {!detailsData?.is_my_project && (
                      <a
                        role="button"
                        onClick={ShowReviewModal}
                        className="btn btn-primary mb-auto"
                      >
                        {translation?.write_a_review || "Write A Review"}
                      </a>
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
                        {translation?.more_details || "More Details"}
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
                      <h4 className="mb-3 text-primary">
                        {translation?.more_details || "More Details"}
                      </h4>
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
                                `${
                                  translation?.not_available || "Not Available"
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
                                `${
                                  translation?.not_available || "Not Available"
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
                                `${
                                  translation?.not_available || "Not Available"
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
                                `${
                                  translation?.not_available || "Not Available"
                                }`}{" "}
                              {"sqft"}
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
                                `${
                                  translation?.not_available || "Not Available"
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
                                `${
                                  translation?.not_available || "Not Available"
                                }`}{" "}
                              {" sqft"}
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
                                `${
                                  translation?.not_available || "Not Available"
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
                                `${
                                  translation?.not_available || "Not Available"
                                }`}
                            </h5>
                          </div>
                        </div>
                      </li>
                    </ul>
                    <table className="table">
                      <tbody>
                        <tr>
                          <td className="text-muted">
                            {translation?.price_breakup || "Price Breakup:"}
                          </td>
                          <td>
                            {detailsData?.currency || "Not Available"}{" "}
                            {detailsData?.expected_price ||
                              `${
                                translation?.not_available || "Not Available"
                              }`}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-muted">
                            {translation?.address || "Address:"}
                          </td>
                          <td>
                            {detailsData?.address ||
                              `${
                                translation?.not_available || "Not Available"
                              }`}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-muted">
                            {translation?.locality || "Locality:"}
                          </td>
                          <td>
                            {detailsData?.locality ||
                              `${
                                translation?.not_available || "Not Available"
                              }`}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-muted">
                            {translation?.furnishing || "Furnishing:"}
                          </td>
                          <td>
                            {detailsData?.project_furnish ||
                              `${
                                translation?.not_available || "Not Available"
                              }`}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-muted">
                            {translation?.flooring || "Flooring:"}
                          </td>
                          <td>
                            {detailsData?.flooring_style?.length > 0 ? (
                              detailsData?.flooring_style.map((item, index) => {
                                const flooring = flooringOptions.find(
                                  (f) => f.key === item
                                );
                                return (
                                  <span key={index}>
                                    {flooring ? flooring.value : item}
                                    {index <
                                      detailsData?.flooring_style?.length - 1 &&
                                      ", "}
                                  </span>
                                );
                              })
                            ) : (
                              <span>
                                {translation?.no_flooring_info ||
                                  "No flooring information available"}
                              </span>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-muted">
                            {translation?.type_of_ownership ||
                              "Type of Ownership:"}
                          </td>
                          <td>
                            {detailsData?.ownership_type ||
                              `${
                                translation?.not_available || "Not Available"
                              }`}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-muted">
                            {translation?.overlooking || "Overlooking:"}
                          </td>
                          <td>
                            {detailsData?.overlooking?.length > 0 ? (
                              detailsData.overlooking.map((item, index) => {
                                const feature = propertyFeatures.find(
                                  (f) => f.key === item
                                );
                                return (
                                  <span key={index}>
                                    {feature ? feature.value : item}
                                    {index <
                                      detailsData.overlooking.length - 1 &&
                                      ", "}
                                  </span>
                                );
                              })
                            ) : (
                              <span>
                                {translation?.no_overlooking_info ||
                                  "No overlooking information available"}
                              </span>
                            )}
                          </td>
                        </tr>

                        {/* View More Details */}
                        {viewMore && (
                          <>
                            <tr>
                              <td className="text-muted">
                                {translation?.main_road_facing ||
                                  "Main Road Facing:"}
                              </td>
                              <td>
                                {detailsData?.main_road_facing ||
                                  `${
                                    translation?.not_available ||
                                    "Not Available"
                                  }`}
                              </td>
                            </tr>
                            <tr>
                              <td className="text-muted">
                                {" "}
                                {translation?.possession_status ||
                                  "Possession Status:"}
                              </td>
                              <td>
                                {detailsData?.possession_status ||
                                  `${
                                    translation?.not_available ||
                                    "Not Available"
                                  }`}{" "}
                              </td>
                            </tr>
                            <tr>
                              <td className="text-muted">
                                {translation?.parking_availability ||
                                  "Parking Availability:"}
                              </td>
                              <td>
                                {detailsData?.parking_availability === "AV"
                                  ? "Available"
                                  : detailsData?.parking_availability === "NA"
                                  ? `${
                                      translation?.not_available ||
                                      "Not Available"
                                    }`
                                  : detailsData?.parking_availability === "UC"
                                  ? "Under Construction"
                                  : `${
                                      translation?.not_available ||
                                      "Not Available"
                                    }`}
                              </td>
                            </tr>
                            <tr>
                              <td className="text-muted">
                                {translation?.water_availability ||
                                  "Water Availability:"}
                              </td>
                              <td>
                                {waterAvailabilityOptions.find(
                                  (item) =>
                                    item.key === detailsData?.water_availability
                                )?.value ||
                                  `${
                                    translation?.not_available ||
                                    "Not Available"
                                  }`}
                              </td>
                            </tr>
                            <tr>
                              <td className="text-muted">
                                {translation?.electricity_status ||
                                  "Electricity Status:"}
                              </td>
                              <td>
                                {electricityStatusOptions.find(
                                  (item) =>
                                    item.key === detailsData?.electricity
                                )?.value ||
                                  `${
                                    translation?.not_available ||
                                    "Not Available"
                                  }`}
                              </td>
                            </tr>
                          </>
                        )}

                        <tr>
                          <td className="text-muted" colSpan="2">
                            <button
                              className="btn p-0"
                              onClick={() => setViewMore(!viewMore)}
                            >
                              {viewMore
                                ? `${
                                    translation?.view_less_details ||
                                    "View Less Details"
                                  }`
                                : `${
                                    translation?.view_more_details ||
                                    "View More Details"
                                  }`}{" "}
                              <i
                                className={`bi bi-chevron-${
                                  viewMore ? "up" : "down"
                                }`}
                              ></i>
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: detailsData?.project_desc
                          ? DOMPurify.sanitize(
                            detailsData?.project_desc
                            )
                          : "Description not available",
                      }}
                    />
                  </div>
                </div>
              </section>
              <section id="amenity">
                <div className="card border-0 shadow-1 mb-4">
                  <div className="card-body">
                    <h4 className="mb-3 text-primary">
                      {translation?.amenities || "Amenities"}
                    </h4>
                    <ul className="list-info g-col-5 list-property-info mb-4">
                      {detailsData?.project_amenity?.length > 0 ? (
                        detailsData.project_amenity.map((amenity, index) => (
                          <li key={index}>{amenity}</li>
                        ))
                      ) : (
                        <li>
                          {translation?.not_available || " Not Available"}
                        </li>
                      )}
                    </ul>
                    {detailsData?.project_amenity?.length > 10 && (
                      <div className="g-col-sm-6 g-col-12 d-md-block">
                        <button className="btn btn-outline-primary me-md-3">
                          {translation?.view_more_amenities ||
                            "View More Amenities"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </section>
              {/* <AdvertiserSection /> */}

              <FloorPlanSection detailsData={detailsData} />
              <section id="features">
                <div className="card border-0 shadow-1 mb-4">
                  <div className="card-body">
                    <h4 className="mb-3 text-primary">
                      {translation?.why_buy_real_estate_projects ||
                        "Why Buy In Real Estate Projects"}
                    </h4>
                    <ul className="list list-1 list-get">
                      {featureList
                        .slice(0, showAll ? featureList.length : 5)
                        .map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                    </ul>
                    {!showAll && (
                      <a
                        role="button"
                        className="ms-3"
                        onClick={() => setShowAll(true)}
                      >
                        {translation?.view_more || "View More "}
                        <i className="bi bi-plus-lg"></i>
                      </a>
                    )}
                  </div>
                </div>
              </section>
              <ProjectReviewDetails
                project_reviews={detailsData?.project_reviews}
                ShowReviewModal={ShowReviewModal}
                is_my_project={detailsData?.is_my_project}
              />
              {detailsData?.landmarks?.length > 0 && (
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
                        <h3>
                          {detailsData?.developer_name ||
                            `${translation?.not_available || "Not Available"}`}
                        </h3>
                        <p>
                          {detailsData?.developer_experience ||
                            `${
                              translation?.not_available ||
                              `${translation?.not_available || "Not Available"}`
                            }`}{" "}
                        </p>
                      </article>

                      {/* Operating In Info */}
                      <article className="col-lg-auto col-sm-5">
                        <h3>{translation?.operating_in || "Operating In"}</h3>
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
          <ProjectEnquiryForm closeModal={() => setShowCotactModal(false)} />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ResidentialProjectDetails;
