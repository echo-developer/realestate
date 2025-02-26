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
import removeHtmlTags from "@/hooks/RemoveHTMLTags";
import {
  facingOptions,
  featureList,
  waterAvailabilityOptions,
  electricityStatusOptions,
  addFavOtherProjects,
  propertyFeatures,
  flooringOptions,
} from "../post/PropertyData";
import ProjectReviewDetails from "../project/ProjectReviewDetails";

const CommercialProjectDetails = ({
  detailsData,
  loading,
  addRemoveFav,
  addFavSimilarProjects,
  addFavNearByProjects,
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
                        {detailsData?.project_name || "Not available"}
                      </h1>
                      <p>
                        <a role="button">
                          <i className="icon-feather-map-pin"></i>{" "}
                          {detailsData?.address || "Not available"}
                        </a>{" "}
                        <span className="text-muted">
                          (By Real Estate Limited)
                        </span>
                      </p>
                    </div>
                    <div className="text-md-end">
                      <p className="mb-2">
                        Launched In:{" "}
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
                            role="button"
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
                                  {imageList?.length - 4} Photos
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
                    {detailsData?.currency || "Not Available"}{" "}
                    {detailsData?.expected_price || "Not Available"}
                  </h3>
                  {detailsData?.project_brochure_pdf && (
                    <p>
                      Download Brochure{" "}
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
                    <a
                      role="button"
                      onClick={ShowReviewModal}
                      className="btn btn-primary mb-auto"
                    >
                      Write A Review
                    </a>
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
                      <a href="#overview">Overview</a>
                    </li>
                    <li
                      className={activeTabMenu === "properties" ? "active" : ""}
                      onClick={() => setActiveTabMenu("properties")}
                    >
                      <a href="#properties">Properties</a>
                    </li>
                    <li
                      className={
                        activeTabMenu === "about_projects" ? "active" : ""
                      }
                      onClick={() => setActiveTabMenu("about_projects")}
                    >
                      <a href="#overview">About Projects</a>
                    </li>
                    <li
                      className={activeTabMenu === "amenities" ? "active" : ""}
                      onClick={() => setActiveTabMenu("amenities")}
                    >
                      <a href="#amenity">Amenities</a>
                    </li>
                    <li
                      className={
                        activeTabMenu === "top_advertiser" ? "active" : ""
                      }
                      onClick={() => setActiveTabMenu("top_advertiser")}
                    >
                      <a href="#advertiser">Top Advertiser</a>
                    </li>
                    <li
                      className={activeTabMenu === "floor_plan" ? "active" : ""}
                      onClick={() => setActiveTabMenu("floor_plan")}
                    >
                      <a href="#floor-plan">Floor Plan 7 units</a>
                    </li>
                    <li
                      className={
                        activeTabMenu === "about_developer" ? "active" : ""
                      }
                      onClick={() => setActiveTabMenu("about_developer")}
                    >
                      <a href="#about-developer">About Developer</a>
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
                      <h4 className="mb-3 text-primary">More Details</h4>
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
                            <span className="text-muted">Property Type</span>
                            <h5>
                              {detailsData?.project_type || "Not available"}
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
                            <span>Total Units</span>
                            <h5>
                              {detailsData?.total_units || "Not Available"}
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
                            <span>Total Towers</span>
                            <h5>
                              {detailsData?.total_towers || "Not Available"}
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
                            <span>Occupied Area</span>
                            <h5>
                              {detailsData?.occupied_area || "Not Available"}{" "}
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
                            <span>Launch Date</span>
                            <h5>
                              {useDateFormat(detailsData?.created_at) ||
                                "Not Available"}
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
                            <span> Total Area</span>
                            <h5>
                              {detailsData?.total_area || "Not Available"}{" "}
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
                            <span>Facing</span>
                            <h5>
                              {facingOptions.find(
                                (item) =>
                                  item.key === detailsData?.project_facing
                              )?.value || "Not Available"}
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
                            <span className="text-muted">Booking Price</span>

                            <h5>
                              {detailsData?.currency || "N/A"}{" "}
                              {detailsData?.token_amount || "Not Available"}
                            </h5>
                          </div>
                        </div>
                      </li>
                    </ul>
                    <table className="table">
                      <tbody>
                        <tr>
                          <td className="text-muted">Price Breakup:</td>
                          <td>
                            {detailsData?.currency || "N/A"}{" "}
                            {detailsData?.expected_price || "Not Available"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-muted">Address:</td>
                          <td>{detailsData?.address || "Not Available"}</td>
                        </tr>
                        <tr>
                          <td className="text-muted">Locality:</td>
                          <td>{detailsData?.locality || "Not Available"}</td>
                        </tr>
                        <tr>
                          <td className="text-muted">Furnishing:</td>
                          <td>
                            {detailsData?.project_furnish || "Not Available"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-muted">Flooring:</td>
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
                              <span>No flooring information available</span>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-muted">Type of Ownership:</td>
                          <td>
                            {detailsData?.ownership_type || "Not Available"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-muted">Overlooking:</td>
                          <td>
                            {detailsData?.overlooking?.length > 0 ? (
                              detailsData?.overlooking?.map((item, index) => {
                                const feature = propertyFeatures.find(
                                  (f) => f.key === item
                                );
                                return (
                                  <span key={index}>
                                    {feature ? feature.value : item}
                                    {index <
                                      detailsData?.overlooking?.length - 1 &&
                                      ", "}
                                  </span>
                                );
                              })
                            ) : (
                              <span>No overlooking information available</span>
                            )}
                          </td>
                        </tr>

                        {/* View More Details */}
                        {viewMore && (
                          <>
                            <tr>
                              <td className="text-muted">Main Road Facing:</td>
                              <td>
                                {detailsData?.main_road_facing ||
                                  "Not Available"}
                              </td>
                            </tr>
                            <tr>
                              <td className="text-muted">Possession Status:</td>
                              <td>
                                {detailsData?.possession_status ||
                                  "Not Available"}{" "}
                              </td>
                            </tr>
                            <tr>
                              <td className="text-muted">
                                Parking Availability:
                              </td>
                              <td>
                                {detailsData?.parking_availability === "AV"
                                  ? "Available"
                                  : detailsData?.parking_availability === "NA"
                                  ? "Not Available"
                                  : detailsData?.parking_availability === "UC"
                                  ? "Under Construction"
                                  : "Not Available"}
                              </td>
                            </tr>
                            <tr>
                              <td className="text-muted">
                                Water Availability:
                              </td>
                              <td>
                                {waterAvailabilityOptions.find(
                                  (item) =>
                                    item.key === detailsData?.water_availability
                                )?.value || "Not Available"}
                              </td>
                            </tr>
                            <tr>
                              <td className="text-muted">
                                Electricity Status:
                              </td>
                              <td>
                                {electricityStatusOptions.find(
                                  (item) =>
                                    item.key === detailsData?.electricity
                                )?.value || "Not Available"}
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
                                ? "View Less Details"
                                : "View More Details"}{" "}
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
                    <p>
                      <b>Description:</b>{" "}
                      {removeHtmlTags(detailsData?.project_desc) ||
                        "Not Available"}
                    </p>
                  </div>
                </div>
              </section>
              <section id="amenity">
                <div className="card border-0 shadow-1 mb-4">
                  <div className="card-body">
                    <h4 className="mb-3 text-primary">Amenities</h4>
                    <ul className="list-info g-col-5 list-property-info mb-4">
                      {detailsData?.project_amenity?.length > 0 ? (
                        detailsData.project_amenity.map((amenity, index) => (
                          <li key={index}>{amenity}</li>
                        ))
                      ) : (
                        <li>Not Available</li>
                      )}
                    </ul>
                    {detailsData?.project_amenity?.length > 10 && (
                      <div className="g-col-sm-6 g-col-12 d-md-block">
                        <button className="btn btn-outline-primary me-md-3">
                          View More Amenities
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
                      Why Buy In Real Estate Projects
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
                        View More <i className="bi bi-plus-lg"></i>
                      </a>
                    )}
                  </div>
                </div>
              </section>
              <ProjectReviewDetails
                project_reviews={detailsData?.project_reviews}
                ShowReviewModal={ShowReviewModal}
              />
              {detailsData?.landmarks?.length > 0 && (
                <ProjectLandmarkData detailsData={detailsData} />
              )}
              <section id="about-developer" className="mb-4">
                <div className="card border-0 shadow-1 mb-4">
                  <div className="card-body">
                    <h4 className="mb-3 text-primary">About Developer</h4>
                    <div className="row">
                      {/* Developer Info */}
                      <article className="col-xxl-4 col-lg-5 col-sm-7 mb-3">
                        <h3>
                          {detailsData?.developer_name || "Not Available"}
                        </h3>
                        <p>
                          {detailsData?.developer_experience || "Not Available"}{" "}
                        </p>
                      
                      </article>

                      {/* Operating In Info */}
                      <article className="col-lg-auto col-sm-5">
                        <h3>Operating In</h3>
                        <p>Mumbai</p>
                      </article>

                      {/* Description */}
                      <article className="col-lg">
                        <p>
                          {detailsData?.developer_details || "Not Available"}
                          {/* <a>Read more</a> */}
                        </p>
                      </article>
                    </div>
                  </div>
                </div>
              </section>

                {detailsData?.nearby_projects?.length > 0 && (
                <NearbyProjects nearbyProjects={detailsData?.nearby_projects} />
              )}
               {detailsData?.similar_projects?.length > 0 && (
                <SimilarProjects
                projectdata={detailsData?.similar_projects}
                addRemoveFav={addFavSimilarProjects}
              />
              )}
               {detailsData?.other_projects?.length  > 0 && (
                <OtherProjects otherProjects={detailsData?.other_projects} addRemoveFav={addFavOtherProjects}/>
              )}
              
              <p className="small">
                <b>Disclaimer:</b> All property information, including but not
                limited to pricing, features, and availability, is subject to
                change without notice. Accuracy is not guaranteed, and
                interested parties should verify all details independently
                before making any decisions.
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
          <Offcanvas.Title>Review for this Project</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <ProjectReviewData
            projectId={detailsData?.id}
            closeButton={handleHideReviewModal}
          />
        </Offcanvas.Body>
      </Offcanvas>

      <Modal closeButton={() => setShowCotactModal(false)}>
        <Modal.Header>Contact Header</Modal.Header>
        <Modal.Body show={showContactModal}>
          <ProjectEnquiryForm closeModal={() => setShowCotactModal(false)} />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CommercialProjectDetails;
