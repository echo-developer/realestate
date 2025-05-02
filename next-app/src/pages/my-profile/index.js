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
  const [counters, setCounters] = useState({});
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
        setCounters(response.data?.counters);
      }
    } catch (error) { }
  };

  useEffect(() => {
    fetchDashboardListData();
  }, [])

  console.log("counters", counters)


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
                      <p className="mb-1">
                        <Whatsapp color="current" size={14} className="me-1" />
                        <b>{userData?.whatsapp_no || ""}</b>
                      </p>
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
              {Object.keys(counters).length > 0 && (
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
              )}


            </>

          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default withAuth(Index);
