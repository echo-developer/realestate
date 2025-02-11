"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import MainLayout from "@/components/layout/MainLayout";
import PropertySidebar from "@/components/property/PropertySideBar";
import PropertyHotspot from "@/components/property/PropertyHotspot";
import AuthUser from "@/components/Authentication/AuthUser";
import useDateFormat from "@/hooks/useDateFormat";
import GalleryComponent from "@/components/property/GalleryComponent";
import GalleryList from "@/components/property/GalleryList";
import { useRouter } from "next/router";
import UserReviewData from "@/components/userReview/UserReviewData";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import { Helmet } from "react-helmet-async";
import SimilarProperties from "@/components/property/SimilarProperty";
import NearbyProperties from "@/components/property/NearByProperty";
import AboutProject from "@/components/property/AboutProject";
import LandMarkDetails from "@/components/property/landMarkDetails";

const property_project = {
  id: 3,
  uid: 1,
  project_name: "Fortune Heights Barasat",
  slug: "fortune-heights-barasat-prjDtId-Mw==",
  project_desc:
    "The residence boasts excellent construction quality, cleanliness, and a range of amenities, including a garden, gym, rooftop pool, and ample parking. It offers good connectivity to urban and rural areas. However, it lacks CCTV on every floor, has high maintenance charges, no dedicated garbage disposal area, and an inadequate electricity backup system. Overall, it provides a pleasant living environment with attentive staff but has notable shortcomings",
  status: 0,
  is_deleted: 0,
  is_featured: 0,
  views: 84,
  is_popular: 1,
  is_top: 0,
  created_at: "2025-01-30T08:08:11.000000Z",
  project_budget: "100000-200000",
  parking_availability: "AV",
  total_towers: 1,
  total_area: 1234,
  occupied_area: 1234,
  total_units: 1222,
  project_furnish: 1,
  project_type: 1,
  project_facing: "east",
};

const index = ({detailsData}) => {
  const { callApi } = AuthUser();
  const router = useRouter();
  const { property_id } = router.query;
  const [loading, setLoading] = useState(false);
  const [propertyDetails, setPropertyDetails] = useState([]);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [visible, setVisible] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (property_id) {
      FetchPropertyDetails(property_id);
    }
  }, [property_id]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const FetchPropertyDetails = async (property_id) => {
    setLoading(true);
    let response;
    try {
      response = await callApi({
        api: `/get_property_details/${property_id}`,
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
                  <p>
                    Possession In: <span className="text-muted">2030</span>
                  </p>
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
                  <h3>
                    {propertyDetails?.price}
                  </h3>
                  <h4>Get Loan Offers From 32+ Banks</h4>
                  <p>
                    <a href="">Check Market Value</a>
                  </p>
                  <p>
                    {propertyDetails?.property_features?.bedrooms} BHK Flats
                  </p>
                  <p>
                    Download Brochure
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
                    <a onClick={handleShow} className="btn btn-primary mb-auto">
                      Write A Review
                    </a>
                    {/* <a href="" className="btn btn-outline-primary mt-auto">
                      Contact Now
                    </a> */}
                  </div>
                </div>
              </div>
              <p>
                {propertyDetails?.property_description || "description not va"}
              </p>
              <div id="undefined-sticky-wrapper" className="sticky-wrapper">
                <div className="one-page-menu mb-3">
                  <ul>
                    <li className="active">
                      <a href="#overview">Overview</a>
                    </li>
                    <li>
                      <a href="#properties">Properties</a>
                    </li>
                    <li>
                      <a href="#about">About Projects</a>
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
                                ? `${propertyDetails.property_features.property_size} sq ft`
                                : "1240 sq ft"}
                            </h5>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="d-flex">
                          <img
                            src="/assets/images/icons/key.png"
                            alt="Total Units"
                            height="48"
                            width="48"
                          />
                          <div className="flex-grow-1 ps-2">
                            <span>Total Units</span>
                            <h5>200</h5>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="d-flex">
                          <img
                            src="/assets/images/icons/tower.png"
                            alt="Total Towers"
                            height="48"
                            width="48"
                          />
                          <div className="flex-grow-1 ps-2">
                            <span>Total Towers</span>
                            <h5>3</h5>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="d-flex">
                          <img
                            src="/assets/images/icons/garage.png"
                            alt="Garage Size"
                            height="48"
                            width="48"
                          />
                          <div className="flex-grow-1 ps-2">
                            <span>Garage Size</span>
                            <h5>200 sq ft</h5>
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
                            src="/assets/images/icons/tub.png"
                            alt="Bathrooms"
                            height="48"
                            width="48"
                          />
                          <div className="flex-grow-1 ps-2">
                            <span>Bathrooms</span>
                            <h5>
                              {propertyDetails?.property_features?.bedrooms}
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
                            <h5>{propertyDetails?.facing_direction}</h5>
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
                            <h5>$149.00</h5>
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
                          <td className="text-muted">Landmark:</td>
                          <td>
                            Dakshineswar Dolpiri More temple, Adyapith temple
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
                                (item, index) => (
                                  <span key={index}>
                                    {item}
                                    {index <
                                      propertyDetails.flooring_style.length -
                                        1 && ", "}
                                  </span>
                                )
                              )
                            ) : (
                              <span>No flooring information available</span>
                            )}
                          </td>
                        </tr>

                        <tr>
                          <td className="text-muted">Type of Ownership:</td>
                          <td>
                            {propertyDetails?.ownership_type || "Not available"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-muted">Overlooking:</td>
                          <td>
                            {propertyDetails?.overlooking?.length > 0 ? (
                              propertyDetails.overlooking.map((item, index) => (
                                <span key={index}>
                                  {item}
                                  {index <
                                    propertyDetails.overlooking.length - 1 &&
                                    ", "}
                                </span>
                              ))
                            ) : (
                              <span>No overlooking information available</span>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-muted">Loan Offered:</td>
                          <td>
                            <p>
                              Estimated EMI ₹3867{" "}
                              <img
                                src="/assets/images/bank/axis-bank-logo.png"
                                alt="Axis Bank"
                                height="24"
                                width="106"
                              />{" "}
                              <small>
                                <a href="">Apply for Home loan</a>
                              </small>
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td className="text-muted" colSpan="2">
                            <a href="">
                              View More Details{" "}
                              <i className="bi bi-chevron-down"></i>
                            </a>
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <p>
                      <b>Description:</b> Marble flooring. Apartment was used
                      once a year. Address: AC Sarkar Road, Ariadaha, PS
                      Belghoria, Kolkata 76
                    </p>

                    <div className="d-grid d-sm-block">
                      <a href="" className="btn btn-primary">
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
                      <button
                        className="btn btn-outline-primary me-md-3"
                        onClick={handleViewMore}
                      >
                        {showAllAmenities
                          ? "View Less Amenities"
                          : "View More Amenities"}
                      </button>
                      <a href="#" className="btn btn-outline-primary">
                        Download Brochure{" "}
                        <img
                          src="/assets/images/icons/brochure.png"
                          alt="Download Brochure"
                          height="24"
                        />
                      </a>
                    </div>
                  </div>
                </div>
              </section>
              {console.log(property_project)}
              {property_project && (
                <AboutProject projectData={property_project} />
              )}

              <section id="">
                <div className="card border-0 shadow-1 mb-4">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <h4 className="mb-3 text-primary">
                        About Real Estate, Rajarhat
                      </h4>
                      <h5>
                        <a href="#">
                          Explore Rajarhat <i className="bi bi-arrow-right"></i>
                        </a>
                      </h5>
                    </div>
                    <div className="row">
                      <article className="col-lg-4 col-sm-6">
                        <div className="d-flex mb-3">
                          <div>
                            <div className="star-rating" data-rating="3.5">
                              <span className="star"></span>
                              <span className="star"></span>
                              <span className="star"></span>
                              <span className="star half"></span>
                              <span className="star empty"></span>
                            </div>
                          </div>
                          <div className="ps-4">
                            <p className="text-muted">
                              4.3 ratings <br />
                              750 Reviews
                            </p>
                          </div>
                        </div>
                      </article>
                      <article className="col-lg-4 col-sm-6">
                        <div className="d-flex mb-3">
                          <div>
                            <h5>Rank 32</h5>
                          </div>
                          <div className="ps-4">
                            <p className="text-muted">
                              Out of Localities <br />
                              3682
                            </p>
                          </div>
                        </div>
                      </article>
                      <article className="col-lg-4 col-sm-6">
                        <div className="mb-3">
                          <h5>Locality Average Price</h5>
                          <p className="text-muted">
                            ₹22547/Sqft +{" "}
                            <span className="text-green">₹881 (4.1%)</span> QoQ
                          </p>
                        </div>
                      </article>
                    </div>

                    <div className="row mb-3">
                      <article className="col-sm-4">
                        <div className="d-flex align-items-center justify-content-between justify-content-sm-start gap-3 mb-2">
                          <p className="mb-0">Environment</p>
                          <div
                            className="pie"
                            data-pie='{"percent":75}'
                            data-pie-index="1"
                            style={{
                              width: "50px",
                              height: "50px",
                            }}
                          >
                            <svg
                              role="progressbar"
                              width="50"
                              height="50"
                              viewBox="0 0 100 100"
                              aria-valuemin="0"
                              aria-valuemax="100"
                              aria-valuenow="75"
                            >
                              <circle
                                cx="50%"
                                cy="50%"
                                r="42"
                                shapeRendering="geometricPrecision"
                                className="pie-circle-1"
                                fill="none"
                                strokeWidth="10"
                                strokeDashoffset="66"
                                strokeDasharray="264"
                                strokeLinecap=""
                                style={{
                                  transform: "rotate(0deg)",
                                  transformOrigin: "50% 50%",
                                }}
                                stroke="#189634"
                                data-angel="75"
                              ></circle>
                              <text
                                className="pie-text-1"
                                x="50%"
                                y="50%"
                                fill="#189634"
                                textAnchor="middle"
                                dy="0.35em"
                                fontSize="2rem"
                                fontWeight="600"
                              >
                                <tspan className="pie-percent-1">75</tspan>
                                <tspan className="pie-unit-1">%</tspan>
                              </text>
                            </svg>
                          </div>
                        </div>
                      </article>
                      <article className="col-sm-4">
                        <div className="d-flex align-items-center justify-content-between justify-content-sm-start gap-3 mb-2">
                          <p className="mb-0">Place Of Interest</p>
                          <div
                            className="pie"
                            data-pie='{"percent":85}'
                            data-pie-index="2"
                            style={{
                              width: "50px",
                              height: "50px",
                            }}
                          >
                            <svg
                              role="progressbar"
                              width="50"
                              height="50"
                              viewBox="0 0 100 100"
                              aria-valuemin="0"
                              aria-valuemax="100"
                              aria-valuenow="85"
                            >
                              <circle
                                cx="50%"
                                cy="50%"
                                r="42"
                                shapeRendering="geometricPrecision"
                                className="pie-circle-2"
                                fill="none"
                                strokeWidth="10"
                                strokeDashoffset="39.6"
                                strokeDasharray="264"
                                strokeLinecap=""
                                style={{
                                  transform: "rotate(0deg)",
                                  transformOrigin: "50% 50%",
                                }}
                                stroke="#189634"
                                data-angel="85"
                              ></circle>
                              <text
                                className="pie-text-2"
                                x="50%"
                                y="50%"
                                fill="#189634"
                                textAnchor="middle"
                                dy="0.35em"
                                fontSize="2rem"
                                fontWeight="600"
                              >
                                <tspan className="pie-percent-2">85</tspan>
                                <tspan className="pie-unit-2">%</tspan>
                              </text>
                            </svg>
                          </div>
                        </div>
                      </article>
                      <article className="col-sm-4">
                        <div className="d-flex align-items-center justify-content-between justify-content-sm-start gap-3 mb-2">
                          <p className="mb-0">Commuting</p>
                          <div
                            className="pie"
                            data-pie='{"percent":60}'
                            data-pie-index="3"
                            style={{
                              width: "50px",
                              height: "50px",
                            }}
                          >
                            <svg
                              role="progressbar"
                              width="50"
                              height="50"
                              viewBox="0 0 100 100"
                              aria-valuemin="0"
                              aria-valuemax="100"
                              aria-valuenow="60"
                            >
                              <circle
                                cx="50%"
                                cy="50%"
                                r="42"
                                shapeRendering="geometricPrecision"
                                className="pie-circle-3"
                                fill="none"
                                strokeWidth="10"
                                strokeDashoffset="105.6"
                                strokeDasharray="264"
                                strokeLinecap=""
                                style={{
                                  transform: "rotate(0deg)",
                                  transformOrigin: "50% 50%",
                                }}
                                stroke="#189634"
                                data-angel="60"
                              ></circle>
                              <text
                                className="pie-text-3"
                                x="50%"
                                y="50%"
                                fill="#189634"
                                textAnchor="middle"
                                dy="0.35em"
                                fontSize="2rem"
                                fontWeight="600"
                              >
                                <tspan className="pie-percent-3">60</tspan>
                                <tspan className="pie-unit-3">%</tspan>
                              </text>
                            </svg>
                          </div>
                        </div>
                      </article>
                    </div>

                    <h5>Locality Introduction and Neighbourhood</h5>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      In feugiat nulla eget nisl mattis euismod. Pellentesque
                      nulla massa, tempus non ligula eu, elementum ultricies
                      orci. Nam bibendum purus tortor, vel pretium ipsum
                      efficitur varius. Maecenas sed leo magna. Aliquam non
                      dapibus ligula. Proin eu cursus dui...{" "}
                      <a href="#">Read more</a>
                    </p>
                    <h5 className="mb-3">Important Things</h5>
                    <div className="row -mb-3 facilities">
                      <article className="col-lg-4 col-sm-6">
                        <div className="cardbox bg-primary-subtle">
                          <div className="d-flex align-items-center mb-2">
                            <img
                              src="/assets/images/icons/institution.png"
                              alt="Institution"
                              height="32"
                              width="32"
                            />
                            <div className="flex-grow-1 ps-3">
                              <h5 className="text-primary mb-0">
                                Educational Institute
                              </h5>
                            </div>
                          </div>
                          <ul className="mb-0">
                            <li>National English School, Rajarhat Campus</li>
                            <li>Devaki Memorial School</li>
                            <li className="hide">Children Park, Rajarhat</li>
                            <li className="hide">Children Zoo, Rajarhat</li>
                            <li>
                              <a href="#" className="show-more">
                                +2 more
                              </a>
                            </li>
                          </ul>
                        </div>
                      </article>
                      <article className="col-lg-4 col-sm-6">
                        <div className="cardbox bg-primary-subtle">
                          <div className="d-flex align-items-center mb-2">
                            <img
                              src="/assets/images/icons/transport.png"
                              alt="Transport"
                              height="32"
                              width="32"
                            />
                            <div className="flex-grow-1 ps-3">
                              <h5 className="text-primary mb-0">
                                Transport Facilities
                              </h5>
                            </div>
                          </div>
                          <ul className="mb-0">
                            <li>Nearest Railway Station &amp; Metro Station</li>
                            <li>Petrol Pump</li>
                            <li>
                              <a href="#" className="show-more">
                                +2 more
                              </a>
                            </li>
                          </ul>
                        </div>
                      </article>
                      <article className="col-lg-4 col-sm-6">
                        <div className="cardbox bg-primary-subtle">
                          <div className="d-flex align-items-center mb-2">
                            <img
                              src="/assets/images/icons/airport.png"
                              alt="Airport"
                              height="32"
                              width="32"
                            />
                            <div className="flex-grow-1 ps-3">
                              <h5 className="text-primary mb-0">Airports</h5>
                            </div>
                          </div>
                          <ul className="mb-0">
                            <li>Kolkata CCU Airport</li>
                            <li>
                              <a href="#" className="show-more">
                                +2 more
                              </a>
                            </li>
                          </ul>
                        </div>
                      </article>
                    </div>
                  </div>
                </div>
              </section>

              <section id="mittal-group-reviews">
                <div className="card border-0 shadow-1 mb-4">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <h4 className="mb-3 text-primary">
                        Mittal Group Reviews &amp; Rating
                      </h4>
                      <h5>
                        <a onClick={handleShow}>
                          Write A Review <i className="bi bi-arrow-right"></i>
                        </a>
                      </h5>
                    </div>

                    <div className="row">
                      <article className="col-lg-4 col-sm-6">
                        <div className="d-flex mb-3">
                          <div className="">
                            <div className="star-rating" data-rating="4.5">
                              <span className="star"></span>
                              <span className="star"></span>
                              <span className="star"></span>
                              <span className="star"></span>
                              <span className="star half"></span>
                            </div>
                          </div>
                          <div className="ps-4">
                            <p className="text-muted">
                              4.3 ratings <br /> 750 Reviews
                            </p>
                          </div>
                        </div>
                      </article>
                    </div>

                    <div className="row">
                      <article className="col-lg-6 col-12">
                        <div className="user-review mb-3">
                          <div className="d-flex">
                            <div className="star-rating me-2" data-rating="4.5">
                              <span className="star"></span>
                              <span className="star"></span>
                              <span className="star"></span>
                              <span className="star"></span>
                              <span className="star half"></span>
                            </div>
                            <span className="text-muted">03/04/2024</span>
                          </div>
                          <h4>Real Estate Limited</h4>
                          <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Aenean lacinia finibus volutpat. Fusce
                            pulvinar leo vitae odio vulputate, sit amet
                            elementum tortor commodo.
                          </p>
                          <div className="d-flex user-review-footer">
                            <div className="flex-shrink-0">
                              <img
                                src="/assets/images/candidate/candidate-4.jpg"
                                alt="Sarah D. Patrik"
                                height="40"
                                width="40"
                                className="rounded-circle"
                              />
                            </div>
                            <div className="flex-grow-1 ps-3">
                              <h5 className="mb-0">Sarah D. Patrik</h5>
                              <p className="text-muted">Agent (Local Guide)</p>
                            </div>
                          </div>
                        </div>
                      </article>

                      <article className="col-lg-6 col-12">
                        <div className="user-review mb-3">
                          <div className="d-flex">
                            <div className="star-rating me-2" data-rating="4.5">
                              <span className="star"></span>
                              <span className="star"></span>
                              <span className="star"></span>
                              <span className="star"></span>
                              <span className="star half"></span>
                            </div>
                            <span className="text-muted">03/04/2024</span>
                          </div>
                          <h4>Real Estate Limited</h4>
                          <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Aenean lacinia finibus volutpat. Fusce
                            pulvinar leo vitae odio vulputate, sit amet
                            elementum tortor commodo.
                          </p>
                          <div className="d-flex user-review-footer">
                            <div className="flex-shrink-0">
                              <img
                                src="/assets/images/candidate/candidate-1.jpg"
                                alt="Sarah D. Patrik"
                                height="40"
                                width="40"
                                className="rounded-circle"
                              />
                            </div>
                            <div className="flex-grow-1 ps-3">
                              <h5 className="mb-0">Sarah D. Patrik</h5>
                              <p className="text-muted">Agent (Local Guide)</p>
                            </div>
                          </div>
                        </div>
                      </article>
                    </div>

                    <div className="d-grid d-sm-block">
                      <a
                        href="#view-more-reviews"
                        className="btn btn-outline-primary"
                      >
                        View More Reviews
                      </a>
                    </div>
                  </div>
                </div>
              </section>
              <LandMarkDetails propertyDetails={propertyDetails}/>

              <PropertyHotspot />

              <section id="about-developer" className="mb-4">
                <div className="card border-0 shadow-1 mb-4">
                  <div className="card-body">
                    <h4 className="mb-3 text-primary">About Developer</h4>
                    <div className="row">
                      <article className="col-xxl-4 col-lg-5 col-sm-7 mb-3">
                        <h3>Vestibulum diam</h3>
                        <p>Experience: 84 Years</p>
                        <div className="g-col-6">
                          <a href="" className="btn btn-primary">
                            Explore Builder
                          </a>
                          <a href="" className="btn btn-outline-primary">
                            Contact Now
                          </a>
                        </div>
                      </article>
                      <article className="col-lg-auto col-sm-5">
                        <h3>Operating In</h3>
                        <p>Mumbai</p>
                      </article>
                      <article className="col-lg">
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. In feugiat elementum ultricies orci. Nam
                          bibendum purus tortor, vel Proin eu cursus dui...{" "}
                          <a href="#">Read more</a>
                        </p>
                      </article>
                    </div>
                  </div>
                </div>
              </section>

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
              />
            </aside>
            <PropertySidebar />
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
      </>
    </MainLayout>
  );
};

export default index;
