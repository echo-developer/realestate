import React from 'react'
import Link from 'next/link'
import useDateFormat from '@/hooks/useDateFormat'
import GalleryComponent from '../property/GalleryComponent'

const ResidentialDetails = ({propertyDetails ,setVisible}) => {
  return (
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
                  <h3>{propertyDetails?.price}</h3>
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
                          <td>{propertyDetails?.address || `${translation?.not_available ||"Not available"}`}</td>
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
                            {propertyDetails?.furnish_status || `${translation?.not_available ||"Not available"}`}
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
                            {propertyDetails?.ownership_type || `${translation?.not_available ||"Not available"}`}
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

                    {/* <div className="d-grid d-sm-block">
                      <a href="" className="btn btn-primary">
                        Contact Owner
                      </a>
                    </div> */}
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
                        <li>{translation?.not_available ||"Not available"}</li>
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
                    </div>
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
                />
              )}
              {propertyDetails.landmarks && (
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
              />
            </aside>
            <PropertySidebar />
          </div>
        </div>
      </div>
  )
}

export default ResidentialDetails
