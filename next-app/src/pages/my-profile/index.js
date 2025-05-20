"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import AuthUser from "@/components/Authentication/AuthUser";
import { toast } from "react-toastify";
import withAuth from "@/utils/withAuth";
import useTranslation from "@/hooks/useTranslation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Envelope, Phone, Share, Whatsapp } from 'react-bootstrap-icons';
import { AuthProvider, useAuth } from "@/context/AuthProvider";

const Index = () => {
  const { callApi, GetMemberId } = AuthUser();
  const { userData, userLoading, currency } = useAuth();
  const [dashboardList, setDashboardList] = useState({});
  const [facts, setFacts] = useState([]);
  const memberId = GetMemberId();
  const translation = useTranslation();

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
      }
    } catch (error) { }
  };

  useEffect(() => {
    fetchDashboardListData();
  }, [])

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


  return (
    <DashboardLayout>
      <div className="col-lg">
        <div className="p-4">
          <h1 className="h3">{translation?.my_profile || "My Profile"}</h1>
          {userLoading ? (
            <div className="text-center my-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              <div className="card card-agent-page mb-4">
                <div className="row g-0">
                  <div className="col-sm-auto col-4">
                    <div className="card-image">
                      <img
                        alt="Profile"
                        className="img-fluid"
                        src={userData?.image || "/assets/images/user.jpg"}
                        onError={(e) =>
                          (e.target.src = "/assets/images/user.jpg")
                        }
                      />
                    </div>
                  </div>
                  <div className="col-sm col-8">
                    <div className="card-body">
                      <div className="card-title">
                        <h4 className="mb-1">
                          {userData?.name || ""}
                          <i className="icon-img-check ms-2"></i>
                        </h4>
                      </div>

                      <p className="mb-1">
                        <Envelope color="current" size={14} className="me-1" />
                        <b>{userData?.email || ""}</b>
                      </p>
                      <p className="mb-2">
                        <span>
                          <Phone color="current" size={14} className="me-1" />
                          <b>
                            {userData?.phone && userData?.phone !== 0
                              ? `${userData?.phone_code || "+91"}-${userData?.phone
                              }`
                              : "Not available"}
                          </b>
                        </span>
                      </p>
                      {userData?.whatsapp_no && (<p className="mb-1">
                        <Whatsapp color="current" size={14} className="me-1" />
                        <b>{userData?.whatsapp_no || ""}</b>
                      </p>)}
                      <p className="mb-2">
                        <i className="icon-feather-pin"></i>{" "}
                        <b>{userData?.address || ""}</b>
                      </p>

                      <div className="d-sm-flex justify-content-between">
                        <div className="social-share-wrap">
                          <a className="btn btn-sm btn-outline-primary w-auto">
                            <i className="bi bi-share me-1"></i> {translation?.share || "Share"}
                          </a>
                          <ul className="share-items social-links">
                            <li><a href="" role="button"><i class="icon-brand-facebook-f"></i></a></li>
                            <li><a href="" role="button"><i class="icon-brand-linkedin-in"></i></a></li>
                            <li><a href="" role="button"><i class="icon-brand-instagram"></i></a></li>
                            <li><a href="" role="button"><i class="icon-brand-youtube"></i></a></li>
                          </ul>

                        </div>
                        <span className="edit-wrap">
                          <Link
                            href={`/profile-edit/${memberId}`}
                            className="btn btn-sm btn-primary"
                          >
                            <i class="bi bi-pencil-square me-1"></i>
                            {translation?.edit || "Edit"}
                          </Link>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* {Object.keys(counters).length > 0 && (
                <div className="row g-4 mt-3">
                  {counters.totalSpending && (
                    <div className="col-md-3">
                      <div className="card p-3 text-center">
                        <h6>Total Spending</h6>
                        <strong>{`${currency}${counters.totalSpending}`}</strong>
                      </div>
                    </div>
                  )}
                  {counters.favProperty && (
                    <div className="col-md-3">
                      <div className="card p-3 text-center">
                        <h6>Favourite Properties</h6>
                        <strong>{counters.favProperty}</strong>
                      </div>
                    </div>
                  )}
                  {counters.forSell && (
                    <div className="col-md-3">
                      <div className="card p-3 text-center">
                        <h6>Properties for Sale</h6>
                        <strong>{counters.forSell}</strong>
                      </div>
                    </div>
                  )}
                  {counters.forRent && (
                    <div className="col-md-3">
                      <div className="card p-3 text-center">
                        <h6>Properties for Rent</h6>
                        <strong>{counters.forRent}</strong>
                      </div>
                    </div>
                  )}
                  {counters.allProperty && (
                    <div className="col-md-3">
                      <div className="card p-3 text-center">
                        <h6>All Properties</h6>
                        <strong>{counters.allProperty}</strong>
                      </div>
                    </div>
                  )}
                  {counters.allProject && (
                    <div className="col-md-3">
                      <div className="card p-3 text-center">
                        <h6>All Projects</h6>
                        <strong>{counters.allProject}</strong>
                      </div>
                    </div>
                  )}
                  {counters.propertyEnquery && (
                    <div className="col-md-3">
                      <div className="card p-3 text-center">
                        <h6>Property Enquiries</h6>
                        <strong>{counters.propertyEnquery}</strong>
                      </div>
                    </div>
                  )}
                  {counters.projectEnquery && (
                    <div className="col-md-3">
                      <div className="card p-3 text-center">
                        <h6>Project Enquiries</h6>
                        <strong>{counters.projectEnquery}</strong>
                      </div>
                    </div>
                  )}
                  {counters.propertyTotalViews?.totalViews && (
                    <div className="col-md-3">
                      <div className="card p-3 text-center">
                        <h6>Property Views (Total)</h6>
                        <strong>{counters.propertyTotalViews.totalViews}</strong>
                      </div>
                    </div>
                  )}
                  {counters.propertyTotalViews?.lastWeekViews && (
                    <div className="col-md-3">
                      <div className="card p-3 text-center">
                        <h6>Property Views (Last Week)</h6>
                        <strong>{counters.propertyTotalViews.lastWeekViews}</strong>
                      </div>
                    </div>
                  )}
                  {counters.projectTotalViews?.totalViews && (
                    <div className="col-md-3">
                      <div className="card p-3 text-center">
                        <h6>Project Views (Total)</h6>
                        <strong>{counters.projectTotalViews.totalViews}</strong>
                      </div>
                    </div>
                  )}
                  {counters.projectTotalViews?.lastWeekViews && (
                    <div className="col-md-3">
                      <div className="card p-3 text-center">
                        <h6>Project Views (Last Week)</h6>
                        <strong>{counters.projectTotalViews.lastWeekViews}</strong>
                      </div>
                    </div>
                  )}
                  {counters.propertyTotalReviews?.totalCount && (
                    <div className="col-md-3">
                      <div className="card p-3 text-center">
                        <h6>Property Reviews</h6>
                        <strong>{counters.propertyTotalReviews.totalCount}</strong>
                      </div>
                    </div>
                  )}
                  {counters.propertyTotalReviews?.lastweekCount && (
                    <div className="col-md-3">
                      <div className="card p-3 text-center">
                        <h6>Property Reviews (Last Week)</h6>
                        <strong>{counters.propertyTotalReviews.lastweekCount}</strong>
                      </div>
                    </div>
                  )}
                  {counters.projectTotalReviews?.totalCount && (
                    <div className="col-md-3">
                      <div className="card p-3 text-center">
                        <h6>Project Reviews</h6>
                        <strong>{counters.projectTotalReviews.totalCount}</strong>
                      </div>
                    </div>
                  )}
                  {counters.projectTotalReviews?.lastweekCount && (
                    <div className="col-md-3">
                      <div className="card p-3 text-center">
                        <h6>Project Reviews (Last Week)</h6>
                        <strong>{counters.projectTotalReviews.lastweekCount}</strong>
                      </div>
                    </div>
                  )}
                  {counters.activeListing && (
                    <div className="col-md-3">
                      <div className="card p-3 text-center">
                        <h6>Active Listings</h6>
                        <strong>{counters.activeListing}</strong>
                      </div>
                    </div>
                  )}
                </div>
              )} */}

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
                        <h3>{fact.number == '$undefined' ? "" : fact.number}</h3>
                        <h5>{fact.title}</h5>
                      </div>
                    </a>
                  </article>
                ))}
              </div>
            </>

          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default withAuth(Index);
