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
import useTranslation from "@/hooks/useTranslation";

import {
  facingOptions,
  ownershipTypeOptions,
  electricityStatusOptions,
  waterAvailabilityOptions,
  propertyFeatures,
  flooringOptions,
} from "@/components/post/PropertyData";
import ChatBot from "@/components/chatbot/ChatBot";

const index = ({ detailsData }) => {
  const { callApi, isLogin, GetMemberId } = AuthUser();
  const router = useRouter();
  const translation = useTranslation();
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
          } else if (type === "nearby_properties") {
            updateNearByProperties(propertyId);
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
    const list = propertyDetails?.similar_properties || [];
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
        similar_properties: newList,
      };
    });
  };

  const updateNearByProperties = (id) => {
    const list = propertyDetails?.nearby_properties || [];
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
        nearby_properties: newList,
      };
    });
  };

  const addFavSimilarProjects = (id) => {
    addRemoveFav(id, "similar_properties");
  };

  const addFavNearByProperties = (id) => {
    addRemoveFav(id, "nearby_properties");
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
        <ChatBot/>
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
                      {propertyDetails?.address || `${translation?.not_available ||"Not available"}`}
                    </Link>
                  </p>
                </div>
                <div className="text-md-end">
                  <p className="mb-2">
                  {translation?.launched_in || "Launched In"}{" "}
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
                  {propertyDetails?.property_features?.bedrooms && (
                    <p>
                      {propertyDetails?.property_features?.bedrooms}  {translation?.bhk_flats || "BHK Flats"}
                    </p>
                  )}

                  {propertyDetails?.property_brochure_pdf && (
                    <p>
                       {translation?.download_brochure || "Download Brochure"}
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
                  {!propertyDetails?.is_my_property && (
                    <div className="d-grid flex-column gap-3 h-100">
                    <a onClick={handleShow} className="btn btn-primary mb-auto">
                    {translation?.write_a_review || "Write A Review"}
                    </a>
                  </div>
                  )}
                </div>
              </div>
              {/* <p>
                {removeHtmlTags(propertyDetails?.property_description) ||
                  "description not available"}
              </p> */}
              <div id="undefined-sticky-wrapper" className="sticky-wrapper">
                <div className="one-page-menu mb-3">
                  <ul>
                    <li className="active">
                      <a href="#overview">{translation?.overview || "Overview"}</a>
                    </li>
                    <li>
                      <a href="#about">{translation?.about_property || "About Property"}</a>
                    </li>
                    <li>
                      <a href="#amenity">{translation?.amenities || "Amenities"}</a>
                    </li>
                    <li>
                      <a href="#property_review">{translation?.property_reviews || "Property Reviews"}</a>
                    </li>
                    <li>
                      <a href="#locality">{translation?.about_landmark || "About Landmark"}</a>
                    </li>
                  </ul>
                </div>
              </div>

              <section id="about">
                <div className="card border-0 shadow-1 mb-4">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <h4 className="mb-3 text-primary">{translation?.more_details || "More Details"}</h4>
                    </div>

                    <ul className="list list-property-details mb-4">
                      {propertyDetails?.property_key === "residential" ? (
                        <li>
                          <div className="d-flex">
                            <img
                              src="/assets/images/icons/bed.png"
                              alt="bhk"
                              height="48"
                              width="48"
                            />
                            <div className="flex-grow-1 ps-2">
                              <span>{translation?.bedrooms || "Bedrooms"}</span>
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
                              <span>{translation?.bedrooms || "Washrooms"} </span>
                              <h5>
                                {propertyDetails?.property_features?.washroom ||
                                  `${translation?.not_available ||"Not available"}`}
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
                            <span className="text-muted">{translation?.property_size || "Property Size"}</span>
                            <h5>
                              {propertyDetails?.property_features?.property_size
                                ? `${propertyDetails.property_features.property_size} sqft`
                                : `${translation?.not_available ||"Not available"}`}
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
                            <span className="text-muted">{translation?.carpet_area || "Carpet Area"}</span>
                            <h5>
                              {propertyDetails?.carpet_area
                                ? `${propertyDetails?.carpet_area} sq ft`
                                : `${translation?.not_available ||"Not available"}`}
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
                            <span>{translation?.launch_date || "Launch Date"}</span>
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
                            <span>{translation?.facing || "Facing"}</span>
                            <h5>
                              {facingOptions.find(
                                (item) =>
                                  item.key === propertyDetails?.facing_direction
                              )?.value ||`${translation?.not_available ||"Not available"}`}
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
                            <span className="text-muted">{translation?.booking_price || "Booking Price"}</span>
                            <h5>{propertyDetails?.price || `${translation?.not_available ||"Not available"}`}</h5>
                          </div>
                        </div>
                      </li>
                    </ul>

                    <table className="table">
                      <tbody>
                        <tr>
                          <td className="text-muted">{translation?.price_breakup || "Price Breakup:"}</td>
                          <td>{propertyDetails?.price}</td>
                        </tr>
                        <tr>
                          <td className="text-muted">{translation?.address || "Address:"}</td>
                          <td>{propertyDetails?.address || `${translation?.not_available ||"Not available"}`}</td>
                        </tr>
                        <tr>
                          <td className="text-muted">{translation?.locality || "Locality:"}</td>
                          <td>
                            {propertyDetails?.locality || `${translation?.not_available ||"Not available"}`}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-muted">{translation?.furnishing || "Furnishing:"}</td>
                          <td>
                            {propertyDetails?.furnish_status || `${translation?.not_available ||"Not available"}`}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-muted">{translation?.flooring || "Flooring:"}</td>
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
                              <span>{translation?.no_flooring_info || "No flooring information available"}</span>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-muted">{translation?.type_of_ownership || "Type of Ownership:"}</td>
                          <td>
                            {ownershipTypeOptions.find(
                              (item) =>
                                item.key === propertyDetails?.ownership_type
                            )?.value || `${translation?.not_available ||"Not available"}`}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-muted">{translation?.overlooking || "Overlooking:"}</td>
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
                              <span>{translation?.no_overlooking_info || "No overlooking information available"}</span>
                            )}
                          </td>
                        </tr>

                        {viewMore && (
                          <>
                            <tr>
                              <td className="text-muted">{translation?.main_road_facing || "Main Road Facing:"}</td>
                              <td>
                                {propertyDetails?.main_road_facing ||
                                  `${translation?.not_available ||"Not available"}`}
                              </td>
                            </tr>
                            <tr>
                              <td className="text-muted">{translation?.possession_status || "Possession Status:"}</td>
                              <td>
                                {propertyDetails?.possession_status ||
                                 `${translation?.not_available ||"Not available"}`}{" "}
                              </td>
                            </tr>
                            <tr>
                              <td className="text-muted">
                              {translation?.parking_availability || "Parking Availability:"}
                              </td>
                              <td>
                                {propertyDetails?.parking_ability === "av"
                                  ? "Available"
                                  : propertyDetails?.parking_ability === "na"
                                  ? `${translation?.not_available ||"Not available"}`
                                  : propertyDetails?.parking_ability === "uc"
                                  ? "Under Construction"
                                  : `${translation?.not_available ||"Not available"}`}
                              </td>
                            </tr>
                            <tr>
                              <td className="text-muted">{translation?.lift_number || "flats_per_floor"}</td>
                              <td>
                                {propertyDetails?.flats_per_floor ||
                                  `${translation?.not_available ||"Not available"}`}
                              </td>
                            </tr>
                            <tr>
                              <td className="text-muted">  {translation?.lift_number || "Lift Number:"}</td>
                              <td>
                                {propertyDetails?.lifts_in_tower ||
                                  `${translation?.not_available ||"Not available"}`}
                              </td>
                            </tr>
                            <tr>
                              <td className="text-muted">
                              {translation?.water_availability || "Water Availability:"}
                              </td>
                              <td>
                                {waterAvailabilityOptions.find(
                                  (item) =>
                                    item.key ===
                                    propertyDetails?.water_availability
                                )?.value || `${translation?.not_available ||"Not available"}`}
                              </td>
                            </tr>
                            <tr>
                              <td className="text-muted">
                              {translation?.electricity_status || "Electricity Status:"}
                              </td>
                              <td>
                                {electricityStatusOptions.find(
                                  (item) =>
                                    item.key === propertyDetails?.electricity
                                )?.value || `${translation?.not_available ||"Not available"}`}
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
                                ? `${translation?.view_less_details || "View Less Details"}`
                                : `${translation?.view_more_details || "View More Details"}`}{" "}
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
                      <b>{translation?.description || "Description"}</b>{" "}
                      {removeHtmlTags(propertyDetails?.property_description) ||
                        "description not available"}
                    </p>
                  </div>
                </div>
              </section>

              <section id="amenity">
                <div className="card border-0 shadow-1 mb-4">
                  <div className="card-body">
                    <h4 className="mb-3 text-primary">{translation?.amenities || "Amenities"}</h4>
                    <ul className="list-info g-col-5 list-property-info mb-4">
                      {propertyDetails?.property_amenities?.length > 0 ? (
                        propertyDetails.property_amenities.map(
                          (amenity, index) => <li key={index}>{amenity}</li>
                        )
                      ) : (
                        <li> {translation?.not_available || `${translation?.not_available ||"Not available"}`}</li>
                      )}
                    </ul>
                    {propertyDetails?.property_amenities?.length > 10 && (
                      <div className="g-col-sm-6 g-col-12 d-md-block">
                        <button
                          className="btn btn-outline-primary me-md-3"
                          onClick={handleViewMore}
                        >
                          {showAllAmenities
                            ? `${translation?.view_less_amenities || "View Less Amenities"}`
                            : `${translation?.view_more_amenities || "View More Amenities"}`}
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
                    {translation?.why_buy_real_estate || "Why Buy In Real Estate Property"}
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
                        {translation?.view_more || "View More "}<i className="bi bi-plus-lg"></i>
                      </a>
                    )}
                  </div>
                </div>
              </section>

              {propertyDetails?.property_reviews && (
                <PropertyReviewDetails
                  property_reviews={propertyDetails?.property_reviews}
                  handleShowCanvas={handleShow}
                  isMyProperty={propertyDetails?.is_my_property}
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
                addFavNearByProperties={addFavNearByProperties}
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
            <Offcanvas.Title>{translation?.review_for_this_property || "Review for this property"}</Offcanvas.Title>
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
              {translation?.cancel || "Cancel"}
            </button>

            {/* Centered Error Message */}
            <Modal.Title className="mx-auto"> {translation?.login_required || "Login Required"}</Modal.Title>

            {/* Right-aligned Login button */}
            <button
              className="btn btn-danger"
              onClick={() => {
                handleLoginErrorClose();
                router.push("/login");
              }}
              style={{ position: "absolute", right: "15px" }}
            >
              {translation?.login || "Login"}
            </button>
          </Modal.Header>

          <Modal.Body>
            <p className="text-center">{translation?.please_log_in || "Please log in to perform this action."}</p>
          </Modal.Body>
        </Modal>
      </>
    </MainLayout>
  );
};

export default index;
