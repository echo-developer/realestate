"use client";
import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ChartsRow from "@/components/charts/ChartShow";
import Image from "next/image";
import withAuth from "@/utils/withAuth";
import { Helmet } from "react-helmet-async";
import AuthUser from "@/components/Authentication/AuthUser";
import { toast } from "react-toastify";
import moment from "moment";
import Link from "next/link";
import useTranslation from "@/hooks/useTranslation";
import { BoxArrowUpRight, Calendar, GeoAlt, Hash } from "react-bootstrap-icons";
import { useRouter } from "next/router";

// const customerReviews = [
//   {
//     id: 1,
//     name: "Hawkins Marow",
//     timeAgo: "4 min ago",
//     rating: 3.5,
//     comment:
//       "I viewed a number of properties with Just Property and found them to be professional, efficient, patient, courteous and helpful every time.",
//     avatar: "/assets/images/agents/agent-1.jpg",
//   },
//   {
//     id: 2,
//     name: "Hawkins Marow",
//     timeAgo: "4 min ago",
//     rating: 4.5,
//     comment:
//       "I viewed a number of properties with Just Property and found them to be professional, efficient, patient, courteous and helpful every time.",
//     avatar: "/assets/images/agents/agent-3.jpg",
//   },
// ];

// const data = {
//   bestSellers: [
//     {
//       imgSrc: "/assets/images/uploads/property-1.jpg",
//       description: "Lorem ipsum dolor sit amet, ur adipiscing elit.",
//       sold: 318,
//       price: 320,
//       earnings: 9800,
//     },
//     {
//       imgSrc: "/assets/images/uploads/property-2.jpg",
//       description: "Lorem ipsum dolor sit amet, ur adipiscing elit.",
//       sold: 450,
//       price: 800,
//       earnings: 1278.3,
//     },
//     {
//       imgSrc: "/assets/images/uploads/property-3.jpg",
//       description: "Lorem ipsum dolor sit amet, ur adipiscing elit.",
//       sold: 510,
//       price: 750,
//       earnings: 1249,
//     },
//   ],
//   topClients: [
//     {
//       imgSrc: "/assets/images/uploads/property-1.jpg",
//       description: "Lorem ipsum dolor sit amet, ur adipiscing elit.",
//       location: "USA",
//       status: "Online",
//       amount: 9800,
//     },
//     {
//       imgSrc: "/assets/images/uploads/property-2.jpg",
//       description: "Lorem ipsum dolor sit amet, ur adipiscing elit.",
//       location: "India",
//       status: "Offline",
//       amount: 1278.3,
//     },
//     {
//       imgSrc: "/assets/images/uploads/property-3.jpg",
//       description: "Lorem ipsum dolor sit amet, ur adipiscing elit.",
//       location: "Saudi Arabia",
//       status: "Online",
//       amount: 1249,
//     },
//   ],
// };

const Index = () => {
  const translation = useTranslation();
  const router = useRouter();
  const { callApi, GetMemberId } = AuthUser();
  const [dashboardList, setDashboardList] = useState({});
  const memberId = GetMemberId();
  const [customerReviews, setCustomerReviews] = useState([])
  const [facts, setFacts] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(true);
  const propertyData = dashboardList?.topViewsPropList?.map((property) => ({
    orderNo: property.id || "Not Available",
    customer: property.name || "Not Available",
    property: property.locality || "Not Available",
    date: moment(property.created_at).format("DD/MM/YYYY"),
    type: property.property_type ? property.property_type : <i className="text-muted">Not Available</i>,
    status: property.property_for === "Rent" ? "On Rent" : `${translation?.on_sale || "On Sale"}`,
    badgeClass: property.property_for === "Rent" ? "bg-success" : "bg-warning",
    slug: property.slug,
  }));

  // `${translation?.on_sale || "On Sale"}`
  useEffect(() => {
    if (memberId) {
      fetchDashboardListData();
      fetchCustomerReviews();
    }
  }, []);

  const fetchCustomerReviews = async () => {
    setReviewLoading(true);
    try {
      const res = await callApi({
        api: `/get_users_property_review`,
        method: "GET",
        data: {
          user_id: memberId,
          currentpage: 1
        }
      })

      if (res && res?.status == 1) {
        setCustomerReviews(res.data?.property_reviews || []);
      }
    } catch (error) {
      console.error(error?.message || "Something went wrong")
    } finally {
      setReviewLoading(false);
    }
  }

  const routePush = (url) => {
    if (url) {
      router.push(url);
    }
  }

  useEffect(() => {
    if (dashboardList) {
      setFacts([
        {
          bgColor: "rgba(137, 178, 231, 0.2)",
          iconBgColor: "rgb(19, 101, 207)",
          iconSrc: "/assets/images/icons/home-2.png",
          number: dashboardList?.counters?.allProperty,
          url: '/my-property-listing',
          title: `${translation?.all_property || 'All Property'}`,
        },
        {
          bgColor: "rgba(139, 202, 153, 0.2)",
          iconBgColor: "rgb(24, 150, 52)",
          iconSrc: "/assets/images/icons/sale-2.png",
          number: dashboardList?.counters?.forSell,
          url: '/my-property-listing?post_for=sale',
          title: `${translation?.property_for_sale || 'Property for Sale'}`,
        },
        {
          bgColor: "rgba(243, 168, 189, 0.2)",
          iconBgColor: "rgb(232, 82, 124)",
          iconSrc: "/assets/images/icons/rent-3.png",
          number: dashboardList?.counters?.forRent,
          url: '/my-property-listing?post_for=rent',
          title: `${translation?.property_for_rent || 'Property for Rent'}`,
        },
        {
          bgColor: "rgba(208, 168, 243, 0.2)",
          iconBgColor: "rgb(162, 82, 232)",
          iconSrc: "/assets/images/icons/wallet.png",
          number: `$${dashboardList?.counters?.totalSpending}`,
          title: `${translation?.total_spending || 'Total Spending'}`,
        },
        {
          bgColor: "rgba(144, 220, 222, 0.2)",
          iconBgColor: "rgb(34, 185, 190)",
          iconSrc: "/assets/images/icons/favourite-property.png",
          number: dashboardList?.counters?.favProperty,
          url: "/my-favourite-list",
          title: `${translation?.favourite_property || 'Favourite Property'}`,
        },
        {
          bgColor: "rgba(239, 195, 141, 0.2)",
          iconBgColor: "rgb(224, 135, 28)",
          iconSrc: "/assets/images/icons/home-2.png",
          number: dashboardList?.counters?.propertyEnquery,
          url: '/property-crm',
          title: `${translation?.property_enquiries || 'Property Enquiries'}`
          ,
        },
      ]);
    }
  }, [dashboardList]);

  const fetchDashboardListData = async () => {
    try {
      const response = await callApi({
        api: `/dashboard_data`,
        method: "GET",
        data: {
          user_id: memberId,
        },
      });
      if (response && response.status === 1) {
        setDashboardList(response.data);
      } else {
        toast.error(response.message);
      }
    } catch (error) { }
  };

  return (
    <DashboardLayout>
      <Helmet>
        <title>
          {translation?.realestate_dashboard || 'RealEstate Dashboard | Manage Your Properties & Investments'}

        </title>
        <meta
          name="description"
          content="Access your personalized dashboard to manage property listings, track investments, and view insights. Stay updated with all your real estate activities in one place."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>
      <aside className="col-lg col-12">
        <div className="p-4">
          <div className="row">
            {facts.map((fact, index) => (
              <article className="col-md-4 col-sm-6 col-12" key={index} onClick={() => routePush(fact?.url)}>
                <a
                  role="button"
                  className="fun-fact"
                  style={{ backgroundColor: fact.bgColor }}
                >
                  <div
                    className="fun-fact-icon"
                    style={{ backgroundColor: fact.iconBgColor }}
                  >
                    <img
                      src={fact.iconSrc}
                      alt={`${fact.title} Icon`}
                      height="40"
                      width="40"
                    />
                  </div>
                  <div className="fun-fact-text">
                    <h3>{fact.number}</h3>
                    <h5>{fact.title}</h5>
                  </div>
                </a>
              </article>
            ))}
          </div>
          {/* Chart Row */}
          <ChartsRow dashboardList={dashboardList} />
          <div className="row mb-4">
            {/* Active Listings Card */}
            <article className="col-xxl-3 col-lg-4 col-sm-6 col-12">
              <div className="card card-summary">
                <div className="card-body d-flex align-items-center">
                  <div className="iconx">
                    <img
                      src="/assets/images/icons/listing.png"
                      alt="Icon"
                      height="48"
                      width="48"
                    />
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <h5>{translation?.active_listings || 'Active Listings'}
                    </h5>
                    <h3>{dashboardList?.counters?.activeListing || "0"}</h3>
                  </div>
                  <Link target="_blank" href="/my-property-listing" className="">
                    <i className="bi bi-box-arrow-up-right"></i>
                  </Link>
                </div>
              </div>
            </article>
            {/* favourite list  */}
            <article className="col-xxl-3 col-lg-4 col-sm-6 col-12">
              <div className="card card-summary">
                <div className="card-body d-flex align-items-center">
                  <div className="iconx">
                    <img
                      src="/assets/images/icons/listing.png"
                      alt="Icon"
                      height="48"
                      width="48"
                    />
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <h5>{translation?.favourite_listings || 'Favourite Listings'}
                    </h5>
                    <h3>{dashboardList?.counters?.favProperty || "0"}</h3>
                  </div>
                  <Link target="_blank" href="/my-favourite-list" className="">
                    <i className="bi bi-box-arrow-up-right"></i>
                  </Link>
                </div>
              </div>
            </article>

            {/* Listing Views Card */}
            <article className="col-xxl-3 col-lg-4 col-sm-6 col-12">
              <div className="card card-summary">
                <div className="card-body d-flex align-items-center">
                  <div className="iconx">
                    <img
                      src="/assets/images/icons/report.png"
                      alt="Icon"
                      height="48"
                      width="48"
                    />
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <h5>{translation?.listing_views || 'Listing Views'}
                    </h5>
                    <h3>
                      {dashboardList?.counters?.propertyTotalViews?.totalViews || "0"}{" "}
                      <small>
                        (<span className="text-site">{dashboardList?.counters?.propertyTotalViews?.lastWeekViews || "0"}</span> this week)
                      </small>
                    </h3>
                  </div>
                  {/* <Link target="_blank" href="/property-listing" className="">
                    <i className="bi bi-box-arrow-up-right"></i>
                  </Link> */}
                </div>
              </div>
            </article>

            {/* Your Reviews Card */}
            {/* <article className="col-xxl-3 col-lg-4 col-sm-6 col-12">
              <div className="card card-summary">
                <div className="card-body d-flex align-items-center">
                  <div className="iconx">
                    <img
                      src="/assets/images/icons/review.png"
                      alt="Icon"
                      height="48"
                      width="48"
                    />
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <h5>{translation?.your_reviews || 'Your Reviews'}
                    </h5>
                    <h3>
                      {dashboardList?.counters?.propertyTotalReviews?.totalCount || "0"}{" "}
                      <small>
                        (<span className="text-site">{dashboardList?.counters?.propertyTotalReviews?.lastweekCount || "0"}{" "}</span> this week)
                      </small>
                    </h3>
                  </div>
                  <Link target="_blank" href="/review-list" className="">
                    <i className="bi bi-box-arrow-up-right"></i>
                  </Link>
                </div>
              </div>
            </article> */}
          </div>

          {/* Customer Reviews Section */}
          <div className="card border-0 mb-4">
            <div className="card-header d-flex">
              <h4 className="text-primary">{translation?.customer_reviews || 'Customer Reviews'}
              </h4>
              {/* <div className="dropdown dots-only">
                <a
                  className="btn btn-link dropdown-toggle p-1"
                  href="#"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-three-dots-vertical"></i>
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <a className="dropdown-item" href="#">
                    {translation?.action || 'Action'}

                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                    {translation?.another_action || 'Another Action'}

                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                    {translation?.something_else_here || 'Something Else Here'}

                    </a>
                  </li>
                </ul>
              </div> */}
            </div>

            <div data-simplebar="init">
              <div
                className="simplebar-track horizontal"
                style={{ visibility: "visible" }}
              >
                <div
                  className="simplebar-scrollbar"
                  style={{ visibility: "visible", left: "0px", width: "25px" }}
                ></div>
              </div>
              <div
                className="simplebar-scroll-content"
                style={{ paddingRight: "17px", }}
              >
                <div
                  className="simplebar-content"
                  style={{ marginRight: "-17px" }}
                >
                  <ul className="card-listing">
                    {reviewLoading && (
                      <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "200px",
                        width: "100%", // Ensure full width
                      }}
                      className="d-flex justify-content-center align-items-center w-100"
                    >
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">
                          {translation?.loading ||
                            "Loading...."}{" "}
                        </span>
                      </div>
                    </div>
                    )}
                    {customerReviews.length > 0 && customerReviews?.slice(0, 2).map((review) => (
                      <li key={review.id}>
                        {console.log("review loop", review)}
                        <div className="d-flex">
                          <img
                            src={review?.image || '/assets/images/user.jpg'}
                            alt=""
                            height="40"
                            width="40"
                            className="rounded-2"
                          />
                          <div className="flex-grow-1 ps-3">
                            <h5 className="mb-0">{review.name}</h5>
                            <p className="text-muted">{review.updated_at}</p>
                          </div>
                          <div className="flex-shrink-0">
                            <div
                              className="star-rating"
                              data-rating={review.rating}
                            >
                              {[...Array(5)].map((_, index) => {
                                return index < Math.floor(review.overall_rating) ? (
                                  <span key={index} className="star"></span>
                                ) : index < Math.ceil(review.rating) ? (
                                  <span
                                    key={index}
                                    className="star half"
                                  ></span>
                                ) : (
                                  <span
                                    key={index}
                                    className="star empty"
                                  ></span>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                        <p>{review.comment}</p>
                      </li>
                    ))}
                    {!reviewLoading && customerReviews?.length == 0 && (
                      <>
                      <div className='card border-0 text-center'>
                        <div className="card-body">
                          <img src="/assets/images/icons/9939447.png" alt="Icon" height={48} width={48} className="mb-2" loading="lazy"/>
                          <p className='text-muted'> {translation?.no_record_founds || "No Record Founds"}</p>
                        </div>
                      </div>
                    </>
                    )}
                  </ul>
                </div>
              </div>
            </div>
            {!reviewLoading && customerReviews?.length > 0 && (
              <div className="text-center mb-3">
                <Link target="_blank" href={`/review-list`} className="btn btn-primary">
                  {translation?.view_more_reviews || 'View More Reviews'} {/*  */}
                  <i className="bi bi-arrow-right"></i>
                </Link>
              </div>
            )}
          </div>

          <div className="card border-0">
            <div className="card-header d-flex justify-content-between">
              <h4 className="text-primary">{translation?.property_overview || 'Property Overview'}
              </h4>
              <Link
                href="/my-property-listing"
                className="btn btn-link text-decoration-none"
              >
                {translation?.see_all_properties || 'See All Properties'}
                <i className="bi bi-arrow-right"></i>
              </Link>
            </div>
            <div className="ul-table-responsive">
              <div className="ul-table">
                {/* Table Head */}
                <ul className="head">
                  <li>{translation?.order_no || 'Order No'}
                  </li>
                  <li>{translation?.name || 'Name'}
                  </li>
                  <li>{translation?.locality || 'Locality'}
                  </li>
                  <li>{translation?.date || 'Date'}
                  </li>
                  <li>{translation?.type || 'Type'}
                  </li>
                  <li>{translation?.status || 'Status'}
                  </li>
                </ul>

                {/* Table Body */}
                {propertyData?.length > 0 ? (
                  propertyData?.map((property, index) => (
                    <ul key={index} className="property-row">
                      <li><span className="text-primary"><Hash color="currentColor" size={18} /></span> {property.orderNo}</li>
                      <li><Link target="_blank" href={`/property-details/${property.slug}`}><span className="text-primary"><BoxArrowUpRight color="currentColor" size={16} /></span> {property.customer}</Link></li>
                      <li><span className="text-primary"><GeoAlt color="currentColor" size={16} /></span> {property.property}</li>
                      <li><span className="text-primary"><Calendar color="currentColor" size={16} /></span> {property.date}</li>
                      <li>{property.type}</li>
                      <li>
                        <span className={`badge ${property.badgeClass}`}>
                          {property.status}
                        </span>
                      </li>
                    </ul>
                  ))
                ) : (
                  <p className="text-center my-3">
                    {translation?.no_property_data_available || 'No property data available'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </DashboardLayout>
  );
};

export default withAuth(Index);
