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
import PropertyLandmarkData from "@/components/property/landMarkDetails";
import PropertyReviewDetails from "@/components/property/PropertyReviewDetails";
import { toast } from "react-toastify";
import { Modal, Row, Col, Button } from "react-bootstrap";
import useTranslation from "@/hooks/useTranslation";
import DOMPurify from "dompurify";
import useAdvertisement from "@/hooks/useAdvertisement";
import { People, House, HouseAddFill, Person, Search } from 'react-bootstrap-icons';
import { useAuth } from "@/context/AuthProvider";
import {
  facingOptions,
  ownershipTypeOptions,
  electricityStatusOptions,
  waterAvailabilityOptions,
  propertyFeatures,
  flooringOptions,
} from "@/components/post/PropertyData";
import { CheckCircleFill, XCircleFill, Calendar2Check } from "react-bootstrap-icons";
import YearlyPriceTrendChart from "@/components/property/YearlyPriceTrends";

const index = () => {
  const { callApi, isLogin, GetMemberId } = AuthUser();
  const router = useRouter();
  const { userData, defaultCity, currencyCode, formatPrice } = useAuth();
  const translation = useTranslation();
  const [showAll, setShowAll] = useState(false);
  const { property_id } = router.query;
  const [loading, setLoading] = useState(false);
  const [propertyDetails, setPropertyDetails] = useState([]);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [visible, setVisible] = useState(false);
  const [show, setShow] = useState(false);
  const [showPhoneNumber, setShowPhoneNumber] = useState(false);
  const [viewMore, setViewMore] = useState(false);
  const memberId = GetMemberId();
  const [showCommunicationModal, setShowCommunicationModal] = useState(false);
  const [showLoginErrorModal, setShowLoginErrorModal] = useState(false);
  const [userDetails, setUserDetails] = useState();
  const [activeScrollMenu, setActiveScrollMenu] = useState("overview")
  const [propertyPriceTrends, setPropertyPriceTrends] = useState(null);
  const [pendingLocations, setPendingLocations] = useState([
    { name: 'Local Library', distance: '1.0' },
  ]);
  const { adsData, logAdClick } = useAdvertisement(
    "detail-page",
    "footer",
    defaultCity?.city_id
  );
  const [viewNumber, setViewNumber] = useState("");

  useEffect(() => {
    if (property_id) {
      FetchPropertyDetails(property_id);
    }
  }, [property_id, memberId]);

  useEffect(() => {
    if(propertyDetails?.locality_id) {
      getPriceTrends(propertyDetails?.locality_id)
    }
  }, [propertyDetails])

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
        setUserDetails(response?.data[0]?.user_details);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const displayPhoneNumber = () => {
    setViewNumber(propertyDetails?.user_details?.phone ? `${propertyDetails?.user_details?.phone_code}-${propertyDetails?.user_details?.phone}` : 'Not Available')
  }
  const amenitiesToShow = showAllAmenities
    ? propertyDetails?.property_amenities || []
    : propertyDetails?.property_amenities?.slice(0, 10) || [];

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

  const getPriceTrends = async (locality_id) => {
    try {
      const res = await callApi({
        api: `/yearly-price-trend`,
        method: "GET",
        data: {
          locality_id: locality_id
        }
      })
      if(res && res?.status == 1) {
        setPropertyPriceTrends(res?.data?.property_price_trend)
      }
    } catch (error) {
      console.error(error.message || "Something went wrong")
    }
  }

  const addReviewSuccessFunction = (review) => {

    // Basic validation
    if (!review || typeof review !== 'object') {
      console.error("Invalid review data");
      return;
    }

    // Filter rating keys
    const ratingKeys = Object.keys(review).filter(
      key => key.endsWith('_rate') && typeof review[key] === 'number'
    );

    if (ratingKeys.length === 0) {
      return;
    }

    // Calculate total and average
    const total = ratingKeys.reduce((sum, key) => sum + review[key], 0);
    const overallRating = total / ratingKeys.length;

    const ratingObj = {
      "property_id": review?.property_id,
      "overall_rating": overallRating,
      "created_at": Date.now(),
      "updated_at": Date.now(),
      "review-id": "",
      "review_title": review?.review_title,
      "review_description": review?.review_description,
      "user_relation": userData?.user_type == 'O' ? "Owner" : userData?.user_type == 'B' ? "Builder" : 'Agent',
      "name": userData?.name
    }
    setPropertyDetails(prev => {
      return {
        ...prev,
        "property_reviews": {
          ...prev.property_reviews,
          "total_reviews": prev.property_reviews?.total_reviews,
          "reviews": [
            ...prev.property_reviews?.reviews,
            ratingObj
          ]
        }
      }
    })
  };

  const title = `${propertyDetails?.property_name || ''}, ${propertyDetails?.locality || ''}, ${propertyDetails?.address || ''}. Priced at ${formatPrice(propertyDetails?.price)} | https://realestate.scriptlisting.com`
  const description = `${propertyDetails?.property_name || ''}, ${propertyDetails?.locality || ''}, ${propertyDetails?.address || ''}. Priced at ${formatPrice(propertyDetails?.price)}, this ${propertyDetails?.property_features?.area_in_sqft ? `${propertyDetails?.property_features?.area_in_sqft} sqft` : ''} ${propertyDetails?.ownership_type || 'property'} offers modern amenities like ${propertyDetails?.property_amenities?.slice(0, 5).map(a => a.amenity_name).join(', ')} `;


  return (
    <MainLayout>
      <Helmet>
        <title>
          {title}
        </title>
        <meta
          name="description"
          content={description}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>
      <div className="clearfix"></div>
      <div className="section">
        {/* <ChatBot/> */}
        <div className="container-fluid">
          <div className="row">
            <aside className="col-xl-9 col-12 mb-4 mb-xl-0">
              {/* <div className="d-md-flex justify-content-between align-items-end mb-3">
                <div className="mb-3 mb-md-0">
                  <h1 className="h3">
                    {propertyDetails?.property_name ||
                      "property name not available"}{" "}
                    {"in"} {propertyDetails?.address || "address not available"}
                  </h1>
                  <p>
                    <Link href="">
                      <i className="icon-feather-map-pin"></i>{" "}
                      {propertyDetails?.address ||
                        `${translation?.not_available || "Not available"}`}
                    </Link>
                  </p>
                </div>
                <div className="text-md-end" style={{ minWidth: "150px" }}>
                  <p className="mb-0 text-muted">
                    {translation?.launched_in || "Launched In"}
                  </p>
                  <h5 className="mb-0">
                    {useDateFormat(propertyDetails?.created_at) || "Date "}
                  </h5>
                </div>
              </div> */}
              <div className="d-md-flex justify-content-between align-items-end mb-3">
                <div className="mb-3 mb-md-0">
                  <h1 className="h3">
                    {propertyDetails?.property_name ||
                      "property name not available"}{" "}
                    {"in"} {propertyDetails?.address || "address not available"}
                  </h1>
                  <p className="mb-0">
                    <a role="button">
                      <i className="icon-feather-map-pin"></i>{" "}
                      {propertyDetails?.address ||
                        `${translation?.not_available || "Not available"}`}
                    </a>{" "}
                    {/* <span className="text-muted">
                      {translation?.by_real_estate_limited ||
                        "(By Real Estate Limited)"}
                    </span> */}
                  </p>
                  <p className="text-muted mb-0">
                    {translation?.launched_in || "Launched On:"}{" "} {useDateFormat(propertyDetails?.created_at)}
                  </p>
                </div>
                <div className="text-md-end" style={{ minWidth: "150px" }}>
                  <h3>
                    {propertyDetails?.price ? formatPrice(propertyDetails?.price) : ""}
                  </h3>
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
                <GalleryList
                  setVisible={setVisible}
                  propertyId={property_id}
                  userDetails={userDetails}
                  video={propertyDetails?.property_video}
                />
              )}

              <div className="row mb-3">
                <div className="col-md mb-3 mb-md-0">
                  {/* <h3>
                    {propertyDetails?.price ? formatPrice(propertyDetails?.price) : ""}
                  </h3>
                  {propertyDetails?.property_features?.bedrooms && (
                    <p>
                      {propertyDetails?.property_features?.bedrooms}{" "}
                      {translation?.bhk_flats || "BHK Flats"}
                    </p>
                  )} */}
                </div>
                {propertyDetails?.property_brochure_pdf && (
                  <div class="col-md-auto text-md-end">
                    <div class="d-grid flex-column gap-3 h-100">
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
                    </div>
                  </div>
                )}

                <div className="col-md-auto text-md-end"></div>
              </div>
              <div id="undefined-sticky-wrapper" className="sticky-wrapper">
                <div className="one-page-menu mb-3">
                  <ul>
                    <li className={activeScrollMenu == 'overview' ? "active" : ""} onClick={() => setActiveScrollMenu('overview')}>
                      <a href="#overview">
                        {translation?.overview || "Overview"}
                      </a>
                    </li>
                    <li className={activeScrollMenu == 'about_property' ? "active" : ""} onClick={() => setActiveScrollMenu('about_property')}>
                      <a href="#about">
                        {translation?.about_property || "About Property"}
                      </a>
                    </li>
                    <li className={activeScrollMenu == 'amenities' ? "active" : ""} onClick={() => setActiveScrollMenu('amenities')}>
                      <a href="#amenity">
                        {translation?.amenities || "Amenities"}
                      </a>
                    </li>
                    <li className={activeScrollMenu == 'property_reviews' ? "active" : ""} onClick={() => setActiveScrollMenu('property_reviews')}>
                      <a href="#property_review">
                        {translation?.property_reviews || "Property Reviews"}
                      </a>
                    </li>
                    <li className={activeScrollMenu == 'about_landmark' ? "active" : ""} onClick={() => setActiveScrollMenu('about_landmark')}>
                      <a href="#landmark-near">
                        {translation?.about_landmark || "About Landmark"}
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              <section id="about">
                <div className="card border-0 shadow-1 mb-4">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <h4 className="mb-3 text-primary"> {translation?.overview || "Overview"}</h4>
                    </div>

                    <ul className="list list-property-details mb-4">
                      {propertyDetails?.property_key === "residential"
                        ? propertyDetails?.property_features?.bedrooms && (
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
                                <h5>{propertyDetails?.property_features?.bedrooms}</h5>
                              </div>
                            </div>
                          </li>
                        )
                        : propertyDetails?.property_features?.washroom && (
                          <li>
                            <div className="d-flex">
                              <img
                                src="/assets/images/icons/bed.png"
                                alt="bhk"
                                height="48"
                                width="48"
                              />
                              <div className="flex-grow-1 ps-2">
                                <span>{translation?.washrooms || "Washrooms"}</span>
                                <h5>{propertyDetails?.property_features?.washroom}</h5>
                              </div>
                            </div>
                          </li>
                        )}

                      {propertyDetails?.carpet_area && (
                        <li>
                          <div className="d-flex">
                            <img
                              src="/assets/images/icons/size.png"
                              alt="Property Size"
                              height="48"
                              width="48"
                            />
                            <div className="flex-grow-1 ps-2">
                              <span className="text-muted">
                                {translation?.carpet_area || "Carpet Area"}
                              </span>
                              <h5>
                                {propertyDetails?.carpet_area} {propertyDetails?.unit_type}
                              </h5>
                            </div>
                          </div>
                        </li>
                      )}

                      {propertyDetails?.created_at && (
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
                              <h5>{useDateFormat(propertyDetails?.created_at)}</h5>
                            </div>
                          </div>
                        </li>
                      )}

                      {propertyDetails?.facing_direction && (
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
                                {
                                  facingOptions.find(
                                    (item) =>
                                      item.key === propertyDetails?.facing_direction
                                  )?.value
                                }
                              </h5>
                            </div>
                          </div>
                        </li>
                      )}

                      {propertyDetails?.price && (
                        <li>
                          <div className="d-flex">
                            <img
                              src="/assets/images/icons/money.png"
                              alt="Booking Price"
                              height="48"
                              width="48"
                            />
                            <div className="flex-grow-1 ps-2">
                              <span className="text-muted">
                                {translation?.booking_price || "Booking Price"}
                              </span>
                              <h5>
                                {propertyDetails?.currency
                                  ? `${propertyDetails?.currency} `
                                  : ""}
                                {propertyDetails?.price}
                              </h5>
                            </div>
                          </div>
                        </li>
                      )}
                    </ul>


                    <h4 className="mb-3 text-primary">
                      {translation?.more_details || "More Details"}
                    </h4>
                    <Row>
                      {propertyDetails?.price && (
                        <Col className="col-xl-3 col-md-4 col-6 mb-4">
                          <p className="text-muted mb-2">
                            {translation?.price_breakup || "Price Breakup:"}
                          </p>
                          <div className="flex-grow-1 ps-2">
                            <span className="text-muted">
                              {translation?.booking_price || "Booking Price"}
                            </span>
                            <h5>
                              {currencyCode}
                              {propertyDetails.price}
                            </h5>
                          </div>
                        </Col>
                      )}

                      {propertyDetails?.furnish_status && (
                        <Col className="col-xl-3 col-md-4 col-6 mb-4">
                          <p className="text-muted mb-2">
                            {translation?.furnishing || "Furnishing:"}
                          </p>
                          <h5>{propertyDetails.furnish_status}</h5>
                        </Col>
                      )}



                      {propertyDetails?.ownership_type && (
                        <Col className="col-xl-3 col-md-4 col-6 mb-4">
                          <p className="text-muted mb-2">
                            {translation?.type_of_ownership || "Type of Ownership:"}
                          </p>
                          <h5>
                            {
                              ownershipTypeOptions.find(
                                (item) => item.key === propertyDetails.ownership_type
                              )?.value
                            }
                          </h5>
                        </Col>
                      )}

                      {propertyDetails?.parking_ability && (
                        <Col className="col-xl-3 col-md-4 col-6 mb-4">
                          <p className="text-muted mb-2">
                            {translation?.parking_availability || "Parking Availability:"}
                          </p>
                          <h5>
                            {propertyDetails.parking_ability === "av"
                              ? "Available"
                              : propertyDetails.parking_ability === "na"
                                ? translation?.not_available || "Not available"
                                : propertyDetails.parking_ability === "uc"
                                  ? "Under Construction"
                                  : translation?.not_available || "Not available"}
                          </h5>
                        </Col>
                      )}


                      {propertyDetails?.possession_status && (
                        <Col className="col-xl-3 col-md-4 col-6 mb-4">
                          <p className="text-muted mb-2">
                            {translation?.possession_status || "Possession Status:"}
                          </p>
                          <h5>{propertyDetails.possession_status}</h5>
                        </Col>
                      )}

                      {propertyDetails?.address && (
                        <Col className="col-md-6 col-12 mb-4">
                          <p className="text-muted mb-2">
                            {translation?.address || "Address:"}
                          </p>
                          <h5>{propertyDetails.address}</h5>
                        </Col>
                      )}

                      {propertyDetails?.locality && (
                        <Col className="col-md-6 col-12 mb-4">
                          <p className="text-muted mb-2">
                            {translation?.locality || "Locality:"}
                          </p>
                          <h5>{propertyDetails.locality}</h5>
                        </Col>
                      )}


                      {viewMore && (
                        <>
                          {propertyDetails?.main_road_facing && (
                            <Col className="col-xl-3 col-md-4 col-6 mb-4">
                              <p className="text-muted mb-2">
                                {translation?.main_road_facing || "Main Road Facing:"}
                              </p>
                              <h5>{propertyDetails.main_road_facing}</h5>
                            </Col>
                          )}

                          {propertyDetails?.flats_per_floor && (
                            <Col className="col-xl-3 col-md-4 col-6 mb-4">
                              <p className="text-muted mb-2">
                                {translation?.flats_per_floor || "Flat per floor"}
                              </p>
                              <h5>{propertyDetails.flats_per_floor}</h5>
                            </Col>
                          )}

                          {propertyDetails?.lifts_in_tower && (
                            <Col className="col-xl-3 col-md-4 col-6 mb-4">
                              <p className="text-muted mb-2">
                                {translation?.lift_number || "Lift Number:"}
                              </p>
                              <h5>{propertyDetails.lifts_in_tower}</h5>
                            </Col>
                          )}

                          {propertyDetails?.water_availability && (
                            <Col className="col-xl-3 col-md-4 col-6 mb-4">
                              <p className="text-muted mb-2">
                                {translation?.water_availability || "Water Availability:"}
                              </p>
                              <h5>
                                {
                                  waterAvailabilityOptions.find(
                                    (item) => item.key === propertyDetails.water_availability
                                  )?.value
                                }
                              </h5>
                            </Col>
                          )}

                          {propertyDetails?.electricity && (
                            <Col className="col-xl-3 col-md-4 col-6 mb-4">
                              <p className="text-muted mb-2">
                                {translation?.electricity_status || "Electricity Status:"}
                              </p>
                              <h5>
                                {
                                  electricityStatusOptions.find(
                                    (item) => item.key === propertyDetails.electricity
                                  )?.value
                                }
                              </h5>
                            </Col>
                          )}

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

                    <h4 className="mb-3 text-primary">{
                      translation?.description ||
                      "Description"
                    }</h4>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: propertyDetails?.property_description
                          ? DOMPurify.sanitize(
                            propertyDetails.property_description
                          )
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
                        {propertyDetails?.flooring_style?.length > 0 ? (
                          propertyDetails.flooring_style.map((item, index) => {
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
                                  propertyDetails.flooring_style.length - 1 &&
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
                        {propertyDetails?.overlooking?.length > 0 ? (
                          propertyDetails.overlooking.map((item, index) => {
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
                                {index <
                                  propertyDetails.overlooking.length - 1 &&
                                  ", "}
                              </li>
                            );
                          })
                        ) : (
                          <li>
                            {translation?.no_overlooking_info ||
                              "No overlooking information available"}
                          </li>
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

                    {propertyDetails?.property_amenities?.length > 10 && (
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
              {propertyDetails?.property_project && (
                <AboutProject projectData={propertyDetails?.property_project} />
              )}

              {propertyDetails?.property_reviews?.reviews?.length > 0 && (
                <PropertyReviewDetails
                  property_reviews={propertyDetails?.property_reviews}
                  handleShowCanvas={handleShow}
                  isMyProperty={propertyDetails?.is_my_property}
                />
              )}
              {propertyDetails?.landmarks && (
                <PropertyLandmarkData
                  detailsData={propertyDetails}
                  translation={translation}
                />
              )}
              <YearlyPriceTrendChart data={propertyPriceTrends || []} />
              <div className="text-center mb-4">
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
              <NearbyProperties
                propertydata={propertyDetails?.nearby_properties}
                heading={translation?.near_by_properties || "Near By Properties"}
                addFavNearByProperties={addFavNearByProperties}
              />
              <SimilarProperties
                propertydata={propertyDetails?.similar_properties}
                heading={translation?.similar_properties || "Similar Properties"}
                addFavSimilarProjects={addFavSimilarProjects}
              />
            </aside>
            <PropertySidebar
              propertyId={propertyDetails?.property_id}
              propertyDetails={propertyDetails}
              addRemoveFav={addRemoveFav}
              setShowLoginErrorModal={setShowLoginErrorModal}
              showCommunicationModal={showCommunicationModal}
              setShowCommunicationModal={setShowCommunicationModal}
              viewNumber={viewNumber}
              displayPhoneNumber={displayPhoneNumber}
              showPhoneNumber={showPhoneNumber}
              setShowPhoneNumber={setShowPhoneNumber}

            />
          </div>
        </div>
      </div>

      {!propertyDetails?.is_my_property ? (
        <footer className="small-footer special-footer p-3">
          <div className="d-grid columns-2">
            <button
              className="btn btn-outline-primary"
              onClick={() => {
                setShowPhoneNumber(true);
                setShowCommunicationModal(true);
              }}
            >
              {viewNumber || "GET Phone Number"}
            </button>
            <button
              className="btn btn-primary"
              onClick={() => setShowCommunicationModal(true)}
            >
              {translation?.contact_now || "Contact Now"}
            </button>
          </div>
        </footer>
      ) : (
        <footer className="small-footer">
          <ul>
            <li><Link href="/" className=''><House color="current" size={20} /> {translation?.home || "Home"} </Link></li>
            <li><Link href="/property-listing" className=''><Search color="current" size={20} /> Search</Link></li>
            <li><Link href="/postproperty" className='postAd-btn'><HouseAddFill color="white" size={32} /></Link></li>
            <li><Link href="/agent-list" className=''><People color="current" size={20} /> Agents</Link></li>
            <li><Link href="/dashboard" className=''><Person color="current" size={20} /> You</Link></li>
          </ul>
        </footer>
      )}
      <>
        <Offcanvas show={show} placement="end" onHide={handleClose}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title as="h4">
              {translation?.review_for_this_property ||
                "Review for this property"}
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <UserReviewData
              propertyId={propertyDetails?.property_id}
              closeButton={handleClose}
              addReviewSuccessFunction={addReviewSuccessFunction}
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
            <Modal.Title className="mx-auto">
              {" "}
              {translation?.login_required || "Login Required"}
            </Modal.Title>

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
            <p className="text-center">
              {translation?.please_log_in ||
                "Please log in to perform this action."}
            </p>
          </Modal.Body>
        </Modal>
      </>
    </MainLayout>
  );
};

export default index;
