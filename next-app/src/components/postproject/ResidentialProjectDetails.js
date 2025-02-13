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
import AdvertiserSection from "../project/AdvertiseDetailsSection";
import NearbyProjects from "../project/NearByProject";
import OtherProjects from "../project/OtherProject";
import SimilarProjects from "../project/SimilarProjects";
import ProjectSidebar from "../project/ProjectSidebar";
import ProjectReviewData from "../userReview/ProjectReviewData";
import { ShimmerFeaturedGallery } from "react-shimmer-effects";
import ProjectEnquiryForm from "./ProjectEnquiryForm";
import { Modal } from "react-bootstrap";

const ResidentialProjectDetails = ({ detailsData ,loading}) => {
  const [visible, setVisible] = useState(false);
  const [projectId, setprojectId] = useState();
  const [showReview, setShowReview] = useState(false);
  const [showContactModal,setShowCotactModal]=useState(false)

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
    setShowReview(true);
  };

  const handleHideReviewModal = () => setShowReview(false);

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
                      <p>
                        Possession In: <span className="text-muted">2030</span>
                      </p>
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
                          detailsData?.gallery[0]?.images[0]?.file ||
                          "/assets/images/property/default-property-1.png"
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
                                  {imageList?.length - 5} Photos
                                </h4>
                              )}
                            </div>
                          </a>
                        </div>
                      ))}
                  </div>
                </>
              ) : (
                <ShimmerFeaturedGallery row={2} col={2} card frameHeight={600} />
                
              )}

              {visible && (
                <ProjectGallery setVisible={setVisible} projectId={projectId} />
              )}

              <div className="row mb-3 mt-3">
                <div className="col-md mb-3 mb-md-0">
                  <h3>
                    {detailsData?.currency || "Not Available"}{" "}
                    {detailsData?.project_budget || "Not Available"}
                  </h3>
                  <p>
                    <a href="">Check Market Value</a>
                  </p>
                  <p>
                    Download Brochure{" "}
                    <a href="" className="ms-3">
                      <img
                        src="/assets/images/icons/brochure.png"
                        alt="Download Brochure"
                        height="32"
                      />
                    </a>
                  </p>
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
                    <li className="active">
                      <a href="#overview">Overview</a>
                    </li>
                    <li>
                      <a href="#properties">Properties</a>
                    </li>
                    <li>
                      <a href="#overview">About Projects</a>
                    </li>
                    <li>
                      <a href="#amenity">Amenities</a>
                    </li>
                    <li>
                      <a href="#advertiser">Top Advertiser</a>
                    </li>
                    <li>
                      <a href="#floor-plan">Floor Plan 7 units</a>
                    </li>
                    <li>
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
                            alt="Property Size"
                            height="48"
                            width="48"
                            src="/assets/images/icons/size.png"
                          />
                          <div className="flex-grow-1 ps-2">
                            <span className="text-muted">Property Size</span>
                            <h5>
                              {detailsData?.property_size || "Not available"}
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
                            src="/assets/images/icons/key.png"
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
                            <h5>{detailsData?.floor || "Not Available"}</h5>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="d-flex">
                          <img
                            alt="Garage Size"
                            height="48"
                            width="48"
                            src="/assets/images/icons/size.png"
                          />
                          <div className="flex-grow-1 ps-2">
                            <span>Carpet Area</span>
                            <h5>
                              {detailsData?.carpet_area || "Not Available"}
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
                            <span> Super Area</span>
                            <h5>
                              {detailsData?.super_area || "Not Available"}
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
                            <h5>{detailsData?.facing || "Not Available"}</h5>
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
                          <td className="text-muted">Landmark:</td>
                          <td>
                            Dakshineswar Dolpiri More temple, Adyapith temple
                          </td>
                        </tr>
                        <tr>
                          <td className="text-muted">Furnishing:</td>
                          <td>
                            {detailsData?.project_furnish || "Not Avaialable"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-muted">Flooring:</td>
                          <td>
                            <span>Wooden, </span>
                            <span>Normal Tiles/Kotah Stone, </span>
                            <span>Vitrified, </span>
                            <span>Granite</span>
                          </td>
                        </tr>
                        {/* <tr>
                                                <td className="text-muted">
                                                    Type of Ownership:
                                                </td>
                                                <td>Co-operative Society</td>
                                            </tr> */}
                        <tr>
                          <td className="text-muted">Overlooking:</td>
                          <td>
                            <span>Garden/Park, </span>
                            <span>Pool, </span>
                            <span>Main Road</span>
                          </td>
                        </tr>
                        <tr>
                          <td className="text-muted">Loan Offered:</td>
                          <td>
                            <p>
                              Estimated EMI ₹3867{" "}
                              <img
                                alt="Axis Bank"
                                height="24"
                                width="106"
                                src="/assets/images/bank/axis-bank-logo.png"
                              />
                              <small>
                                <Link href="">Apply for Home loan</Link>
                              </small>
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td className="text-muted" colSpan="2">
                            <Link href="">
                              View More Details{" "}
                              <i className="bi bi-chevron-down"></i>
                            </Link>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <p>
                      <b>Description:</b>{" "}
                      {detailsData?.project_desc || "Not Available"}
                    </p>
                    <div className="d-grid d-sm-block">
                      <a href="#" className="btn btn-primary">
                        Contact Owner
                      </a>
                    </div>
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

                    <div className="g-col-sm-6 g-col-12 d-md-block">
                      <button className="btn btn-outline-primary me-md-3">
                        View More Amenities
                      </button>
                      <a href="#" className="btn btn-outline-primary">
                        Download Brochure{" "}
                        <img
                          alt="Download Brochure"
                          height="24"
                          src="/assets/images/icons/brochure.png"
                        />
                      </a>
                    </div>
                  </div>
                </div>
              </section>
              <AdvertiserSection />
              <FloorPlanSection detailsData={detailsData} />

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
                        <div className="d-flex gap-3">
                          <a href="#" className="btn btn-primary">
                            Explore Builder
                          </a>
                          <a href="#" className="btn btn-outline-primary">
                            Contact Now
                          </a>
                        </div>
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

              <NearbyProjects nearbyProjects={detailsData?.nearby_projects} />
              <OtherProjects otherProjects={detailsData?.other_projects} />
              <SimilarProjects projectdata={detailsData?.similar_projects} />
              <p className="small">
                <b>Disclaimer:</b> All property information, including but not
                limited to pricing, features, and availability, is subject to
                change without notice. Accuracy is not guaranteed, and
                interested parties should verify all details independently
                before making any decisions.
              </p>
            </aside>
            <ProjectSidebar projectId={detailsData?.id} />
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

      <Modal closeButton ={()=>setShowCotactModal(false)}>
        <Modal.Header>Contact Header</Modal.Header>
        <Modal.Body show={showContactModal}>
          <ProjectEnquiryForm
           closeModal ={()=>setShowCotactModal(false)} 
          />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ResidentialProjectDetails;
