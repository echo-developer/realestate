"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import MainLayout from "@/components/layout/MainLayout";
import PropertySidebar from "@/components/property/PropertySideBar";
import AuthUser from "@/components/Authentication/AuthUser";
import useDateFormat from "@/hooks/useDateFormat";
import GalleryComponent from "@/components/property/GalleryComponent";
import GalleryList from "@/components/property/GalleryList";
import { useRouter } from "next/router";
import UserReviewData from "@/components/userReview/UserReviewData";
import Offcanvas from "react-bootstrap/Offcanvas";
import { Helmet } from "react-helmet-async";
import SimilarProperties from "@/components/property/SimilarProperty";
import NearbyProperties from "@/components/property/NearByProperty";
import AboutProject from "@/components/property/AboutProject";
import LandMarkDetails from "@/components/property/landMarkDetails";
import { property_features } from "@/components/post/PropertyData";
import PropertyReviewDetails from "@/components/property/PropertyReviewDetails";
import { toast } from "react-toastify";
import removeHtmlTags from "@/hooks/RemoveHTMLTags";
import { Modal } from "react-bootstrap";

import {
  facingOptions,
  ownershipTypeOptions,
  electricityStatusOptions,
  waterAvailabilityOptions,
  propertyFeatures,
  flooringOptions,
} from "@/components/post/PropertyData";

const index = ({ detailsData }) => {
  const { callApi, isLogin, GetMemberId } = AuthUser();
  const router = useRouter();
  const [showAll, setShowAll] = useState(false);
  const { property_id } = router.query;
  const [loading, setLoading] = useState(false);
  const [propertyDetails, setPropertyDetails] = useState([]);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [visible, setVisible] = useState(false);
  const [show, setShow] = useState(false);
  const [viewMore, setViewMore] = useState(false);
  const memberId = GetMemberId();
  const [showLoginErrorModal, setShowLoginErrorModal] = useState(false);

  useEffect(() => {
    if (property_id) {
      FetchPropertyDetails(property_id);
    }
  }, [property_id, memberId]);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    if (isLogin()) {
      setShow(true);
    } else {
      setShowLoginErrorModal(true);
    }
  };
  const handleLoginErrorClose = () => setShowLoginErrorModal(false);

  const FetchPropertyDetails = async (property_id) => {
    setLoading(true);
    let response;
    try {
      response = await callApi({
        api: `/get_property_details/${property_id}&user_id=${memberId}`,
        method: "GET",
      });
      if (response && response.status === 1) {
        setPropertyDetails(response?.data[0]);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const amenitiesToShow = showAllAmenities
    ? propertyDetails?.property_amenities
    : propertyDetails?.property_amenities?.slice(0, 5);

  const handleViewMore = () => {
    setShowAllAmenities((prevState) => !prevState);
  };
  const addRemoveFav = async (propertyId, type) => {
    if (isLogin()) {
      try {
        const res = await callApi({
          api: "/add_my_fav_property",
          method: "POST",
          data: {
            user_id: memberId,
            property_id: propertyId,
          },
        });

        if (res && res?.status === 1) {
          toast.success(res?.message);
          if (type === "similar_properties") {
            updateSimilarProperties(propertyId);
          } else {
            setPropertyDetails((prev) => {
              return {
                ...prev,
                is_favourite: !prev?.is_favourite,
              };
            });
          }
        }
      } catch (error) {
        console.error(error?.message || "Something went wrong");
      }
    } else {
      setShowLoginErrorModal(true);
    }
  };

  const updateSimilarProperties = (id) => {
    const list = detailsData?.similar_properties || [];
    const newList = list?.map((item, i) => {
      if (item?.id == id) {
        return {
          ...item,
          is_favourite: !item?.is_favourite,
        };
      } else {
        return item;
      }
    });

    setPropertyDetails((prev) => {
      return {
        ...prev,
        similar_projects: newList,
      };
    });
  };

  const addFavSimilarProjects = (id) => {
    addRemoveFav(id, "similar_properties");
  };

  return (
    <MainLayout>
      <Helmet>
        <title>
          Property Details | Find Your Dream Home or Investment Property
        </title>
        <meta
          name="description"
          content="Discover detailed information about premium properties, including features, pricing, and locations. Explore your perfect home or property investment opportunity today!"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>
      <div className="clearfix"></div>
      <div className="section">
        <div className="container-fluid">
          <div className="row">
            <aside className="col-xl-9 col-12 mb-4 mb-xl-0">
              <div className="d-md-flex justify-content-between mb-3">
                <div className="mb-3 mb-md-0">
                  <h1 className="h3">
                    {propertyDetails?.property_name ||
                      "property name not available"}{" "}
                    {"in"} {propertyDetails?.address || "address not available"}
                  </h1>
                  <p>
                    <Link href="">
                      <i className="icon-feather-map-pin"></i>{" "}
                      {propertyDetails?.address || "not available"}
                    </Link>
                  </p>
                </div>
                <div className="text-md-end">
                  <p className="mb-2">
                    Launched In:{" "}
                    <span className="text-muted">
                      {useDateFormat(propertyDetails?.created_at) || "Date "}
                    </span>
                  </p>
                  {/* <p>
                    Possession In: <span className="text-muted">2030</span>
                  </p> */}
                </div>
              </div>
              <div className="position-relative">
                <span className="ads-type rent">
                  {propertyDetails?.post_for || "rent"}
                </span>
              </div>

              <GalleryComponent
                propertyDetails={propertyDetails}
                setVisible={setVisible}
              />

              {visible && (
                <GalleryList setVisible={setVisible} propertyId={property_id} />
              )}

              <div className="row mb-3">
                <div className="col-md mb-3 mb-md-0">
                  <h3>{propertyDetails?.price}</h3>

                  <p>
                    {propertyDetails?.property_features?.bedrooms} BHK Flats
                  </p>
                  {propertyDetails?.property_brochure_pdf && (
                    <p>
                      Download Brochure
                      <Link
                        target="_blank"
                        href={`${propertyDetails?.property_brochure_pdf}`}
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
                    <a onClick={handleShow} className="btn btn-primary mb-auto">
                      Write A Review
                    </a>
                  </div>
                </div>
              </div>
              <p>
                {removeHtmlTags(propertyDetails?.property_description) ||
                  "description not available"}
              </p>
              <div id="undefined-sticky-wrapper" className="sticky-wrapper">
                <div className="one-page-menu mb-3">
                  <ul>
                    <li className="active">
                      <a href="#overview">Overview</a>
                    </li>
                    <li>
                      <a href="#about">About Property</a>
                    </li>
                    <li>
                      <a href="#amenity">Amenities</a>
                    </li>
                    <li>
                      <a href="#property_review">Property Reviews</a>
                    </li>
                    <li>
                      <a href="#floor-plan">Floor Plan 7 units</a>
                    </li>
                    <li>
                      <a href="#locality">About Locality</a>
                    </li>
                  </ul>
                </div>
              </div>

              <section id="about">
                <div className="card border-0 shadow-1 mb-4">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <h4 className="mb-3 text-primary">More Details</h4>
                    </div>

                    <ul className="list list-property-details mb-4">
                      {!propertyDetails?.property_type === "Commercial" ? (
                        <li>
                          <div className="d-flex">
                            <img
                              src="/assets/images/icons/bed.png"
                              alt="bhk"
                              height="48"
                              width="48"
                            />
                            <div className="flex-grow-1 ps-2">
                              <span>BHK</span>
                              <h5>
                                {propertyDetails?.property_features?.bedrooms}
                              </h5>
                            </div>
                          </div>
                        </li>
                      ) : (
                        <li>
                          <div className="d-flex">
                            <img
                              src="/assets/images/icons/bed.png"
                              alt="bhk"
                              height="48"
                              width="48"
                            />
                            <div className="flex-grow-1 ps-2">
                              <span>Washrooms</span>
                              <h5>
                                {propertyDetails?.personal_washroom ||
                                  "Not Available"}
                              </h5>
                            </div>
                          </div>
                        </li>
                      )}

                      <li>
                        <div className="d-flex">
                          <img
                            src="/assets/images/icons/size.png"
                            alt="Property Size"
                            height="48"
                            width="48"
                          />
                          <div className="flex-grow-1 ps-2">
                            <span className="text-muted">Property Size</span>
                            <h5>
                              {propertyDetails?.property_features?.property_size
                                ? `${propertyDetails.property_features.property_size} sqft`
                                : "Not Available"}
                            </h5>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="d-flex">
                          <img
                            src="/assets/images/icons/size.png"
                            alt="Property Size"
                            height="48"
                            width="48"
                          />
                          <div className="flex-grow-1 ps-2">
                            <span className="text-muted">Carpet Area</span>
                            <h5>
                              {propertyDetails?.carpet_area
                                ? `${propertyDetails?.carpet_area} sq ft`
                                : "Not Available"}
                            </h5>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="d-flex">
                          <img
                            src="/assets/images/icons/calendar.png"
                            alt="Launch Date"
                            height="48"
                            width="48"
                          />
                          <div className="flex-grow-1 ps-2">
                            <span>Launch Date</span>
                            <h5>
                              {useDateFormat(propertyDetails?.created_at) ||
                                "Date"}
                            </h5>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="d-flex">
                          <img
                            src="/assets/images/icons/8270179.png"
                            alt="Facing"
                            height="48"
                            width="48"
                          />
                          <div className="flex-grow-1 ps-2">
                            <span>Facing</span>
                            <h5>
                              {facingOptions.find(
                                (item) =>
                                  item.key === propertyDetails?.facing_direction
                              )?.value || "Not Available"}
                            </h5>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="d-flex">
                          <img
                            src="/assets/images/icons/money.png"
                            alt="Booking Price"
                            height="48"
                            width="48"
                          />
                          <div className="flex-grow-1 ps-2">
                            <span className="text-muted">Booking Price</span>
                            <h5>{propertyDetails?.price || "Not Available"}</h5>
                          </div>
                        </div>
                      </li>
                    </ul>

                    <table className="table">
                      <tbody>
                        <tr>
                          <td className="text-muted">Price Breakup:</td>
                          <td>{propertyDetails?.price}</td>
                        </tr>
                        <tr>
                          <td className="text-muted">Address:</td>
                          <td>{propertyDetails?.address || "Not Available"}</td>
                        </tr>
                        <tr>
                          <td className="text-muted">Locality:</td>
                          <td>
                            {propertyDetails?.locality || "Not Available"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-muted">Furnishing:</td>
                          <td>
                            {propertyDetails?.furnish_status || "Not Available"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-muted">Flooring:</td>
                          <td>
                            {propertyDetails?.flooring_style?.length > 0 ? (
                              propertyDetails.flooring_style.map(
                                (item, index) => {
                                  const flooring = flooringOptions.find(
                                    (f) => f.key === item
                                  );
                                  return (
                                    <span key={index}>
                                      {flooring ? flooring.value : item}
                                      {index <
                                        propertyDetails.flooring_style.length -
                                          1 && ", "}
                                    </span>
                                  );
                                }
                              )
                            ) : (
                              <span>No flooring information available</span>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-muted">Type of Ownership:</td>
                          <td>
                            {ownershipTypeOptions.find(
                              (item) =>
                                item.key === propertyDetails?.ownership_type
                            )?.value || "Not Available"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-muted">Overlooking:</td>
                          <td>
                            {propertyDetails?.overlooking?.length > 0 ? (
                              propertyDetails.overlooking.map((item, index) => {
                                const feature = propertyFeatures.find(
                                  (f) => f.key === item
                                );
                                return (
                                  <span key={index}>
                                    {feature ? feature.value : item}
                                    {index <
                                      propertyDetails.overlooking.length - 1 &&
                                      ", "}
                                  </span>
                                );
                              })
                            ) : (
                              <span>No overlooking information available</span>
                            )}
                          </td>
                        </tr>

                        {viewMore && (
                          <>
                            <tr>
                              <td className="text-muted">Main Road Facing:</td>
                              <td>
                                {propertyDetails?.main_road_facing ||
                                  "Not Available"}
                              </td>
                            </tr>
                            <tr>
                              <td className="text-muted">Possession Status:</td>
                              <td>
                                {propertyDetails?.possession_status ||
                                  "Not Available"}{" "}
                              </td>
                            </tr>
                            <tr>
                              <td className="text-muted">
                                Parking Availability:
                              </td>
                              <td>
                                {propertyDetails?.car_parking === "av"
                                  ? "Available"
                                  : propertyDetails?.car_parking === "na"
                                  ? "Not Available"
                                  : propertyDetails?.car_parking === "uc"
                                  ? "Under Construction"
                                  : "Not Available"}
                              </td>
                            </tr>
                            <tr>
                              <td className="text-muted">Flats Per Floor:</td>
                              <td>
                                {propertyDetails?.flats_per_floor ||
                                  "Not Available"}
                              </td>
                            </tr>
                            <tr>
                              <td className="text-muted">Lift Number:</td>
                              <td>
                                {propertyDetails?.lifts_in_tower ||
                                  "Not Available"}
                              </td>
                            </tr>
                            <tr>
                              <td className="text-muted">
                                Water Availability:
                              </td>
                              <td>
                                {waterAvailabilityOptions.find(
                                  (item) =>
                                    item.key ===
                                    propertyDetails?.water_availability
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
                                    item.key === propertyDetails?.electricity
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
                      {removeHtmlTags(propertyDetails?.property_description) ||
                        "description not available"}
                    </p>
                  </div>
                </div>
              </section>

              <section id="amenity">
                <div className="card border-0 shadow-1 mb-4">
                  <div className="card-body">
                    <h4 className="mb-3 text-primary">Amenities</h4>
                    <ul className="list-info g-col-5 list-property-info mb-4">
                      {propertyDetails?.property_amenities?.length > 0 ? (
                        propertyDetails.property_amenities.map(
                          (amenity, index) => <li key={index}>{amenity}</li>
                        )
                      ) : (
                        <li>Not Available</li>
                      )}
                    </ul>
                    {propertyDetails?.property_amenities?.length > 10 && (
                      <div className="g-col-sm-6 g-col-12 d-md-block">
                        <button
                          className="btn btn-outline-primary me-md-3"
                          onClick={handleViewMore}
                        >
                          {showAllAmenities
                            ? "View Less Amenities"
                            : "View More Amenities"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </section>
              {detailsData?.property_project && (
                <AboutProject projectData={propertyDetails?.property_project} />
              )}

              <section id="features">
                <div className="card border-0 shadow-1 mb-4">
                  <div className="card-body">
                    <h4 className="mb-3 text-primary">
                      Why Buy In Real Estate Property
                    </h4>
                    <ul className="list list-1 list-get">
                      {property_features
                        .slice(0, showAll ? property_features.length : 5)
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

              {propertyDetails?.property_reviews && (
                <PropertyReviewDetails
                  property_reviews={propertyDetails?.property_reviews}
                  handleShowCanvas={handleShow}
                />
              )}
              {propertyDetails?.landmarks?.length > 0 && (
                <LandMarkDetails propertyDetails={propertyDetails} />
              )}

              <div className="text-center mb-4">
                {" "}
                <img
                  src="/assets/images/ads/ads-blank.jpg"
                  alt="Ads"
                  className="img-fluid"
                />{" "}
              </div>
              <NearbyProperties
                propertydata={propertyDetails?.nearby_properties}
                heading="Near By Properties"
              />
              <SimilarProperties
                propertydata={propertyDetails?.similar_properties}
                heading="Similar Properties"
                addFavSimilarProjects={addFavSimilarProjects}
              />
            </aside>
            <PropertySidebar
              propertyId={propertyDetails?.property_id}
              propertyDetails={propertyDetails}
              addRemoveFav={addRemoveFav}
              setShowLoginErrorModal={setShowLoginErrorModal}
            />
          </div>
        </div>
      </div>

      <>
        <Offcanvas show={show} placement="end" onHide={handleClose}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Review for this property</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <UserReviewData
              propertyId={propertyDetails?.property_id}
              closeButton={handleClose}
            />
          </Offcanvas.Body>
        </Offcanvas>

        <Modal
          show={showLoginErrorModal}
          onHide={handleLoginErrorClose}
          centered
          size="lg"
        >
          <Modal.Header>
            {/* Left-aligned Cancel button */}
            <button
              className="btn btn-secondary"
              onClick={handleLoginErrorClose}
              style={{ position: "absolute", left: "15px" }}
            >
              Cancel
            </button>

            {/* Centered Error Message */}
            <Modal.Title className="mx-auto">Login Required</Modal.Title>

            {/* Right-aligned Login button */}
            <button
              className="btn btn-danger"
              onClick={() => {
                handleLoginErrorClose();
                router.push("/login");
              }}
              style={{ position: "absolute", right: "15px" }}
            >
              Login
            </button>
          </Modal.Header>

          <Modal.Body>
            <p className="text-center">Please log in to perform this action.</p>
          </Modal.Body>
        </Modal>
      </>
    </MainLayout>
  );
};

export default index;
