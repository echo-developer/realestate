"use client";
import React, { useEffect, useState } from "react";
import SideBar from "@/components/sidebar/SideBar";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import AuthUser from "@/components/Authentication/AuthUser";
import { toast } from "react-toastify";
import useDateFormat from "@/hooks/useDateFormat";
import Link from "next/link";

const Index = () => {
  const { callApi, GetMemberId } = AuthUser();
  const [enquiryList, setEnquiryList] = useState([]);
  const [sortType, setSortType] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [activeTab, setActiveTab] = useState("property");

  const memberId = GetMemberId();

  useEffect(() => {
    if (memberId) {
      if (activeTab === "property") {
        fetchEnquiryList("/my_property_enquery_list");
      } else if (activeTab === "project") {
        fetchEnquiryList("/my_project_enquery_list");
      }
    }
  }, [memberId, sortType, activeTab]);

  const fetchEnquiryList = async (apiUrl, loadMore = false, page = 1) => {
    if (!loadMore) {
      setIsLoading(true);
    }
    try {
      const response = await callApi({
        api: apiUrl,
        method: "GET",
        data: { user_id: memberId, sort_type: sortType, page },
      });

      if (response && response.status === 1) {
        if (!loadMore) {
          setEnquiryList(
            response.data.enquiredProperties || response.data.enquiredProjects
          );
        } else {
          setEnquiryList((prev) => [
            ...prev,
            ...(response?.data?.enquiredProperties ||
              response?.data?.enquiredProjects ||
              []),
          ]);
        }
        setCurrentPage(response?.data?.pagination?.current_page || 1);
        setTotalPages(response?.data?.pagination?.total_pages || 0);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Data not found");
      toast.error("Failed to load enquiries");
    } finally {
      setIsLoading(false);
    }
  };

  const filterListingsBySortType = () => {
    const now = new Date();
    if (sortType === "weekly") {
      return enquiryList.filter(
        (listing) =>
          new Date(listing.created_at) >= now &&
          new Date(listing.created_at) <=
            new Date(now.setDate(now.getDate() + 7))
      );
    } else if (sortType === "monthly") {
      return enquiryList.filter(
        (listing) =>
          new Date(listing.created_at).getMonth() === new Date().getMonth()
      );
    } else if (sortType === "yearly") {
      return enquiryList.filter(
        (listing) =>
          new Date(listing.created_at).getFullYear() ===
          new Date().getFullYear()
      );
    }
    return enquiryList;
  };

  const sortedListings = filterListingsBySortType();

  const handleLoadMoreClick = () => {
    if (activeTab === "property") {
      fetchEnquiryList("/my_property_enquery_list", true, currentPage + 1);
    } else {
      fetchEnquiryList("/my_project_enquery_list", true, currentPage + 1);
    }
  };

  return (
    <>
      <Header />
      <div className="short-banner">
        <div className="container">
          <h1>My Enquiry</h1>
        </div>
      </div>
      <section className="section">
        <div className="container">
          <div className="row">
            <SideBar />
            {/* Main Content */}
            <aside className="col-xl-9 col-lg-9 col-12">
              {/* Tabs for Property and Project */}
              <div className="tabs mb-3">
                <button
                  className={`btn btn-primary tab-btn ${
                    activeTab === "property" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("property")}
                >
                  Property
                </button>
                <button
                  className={`btn btn-secondary tab-btn ${
                    activeTab === "project" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("project")}
                >
                  Project
                </button>
              </div>

              <div className="d-flex justify-content-between mb-3">
                <h4>
                  {activeTab === "property"
                    ? "Property Enquiries"
                    : "Project Enquiries"}
                </h4>
                <select
                  className="form-select"
                  value={sortType}
                  onChange={(e) => setSortType(e.target.value)}
                  style={{ width: "150px" }}
                >
                  <option value="all">Sort By</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              {/* Loading Spinner or Listings */}
              {isLoading ? (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                </div>
              ) : sortedListings.length > 0 ? (
                <div className="dashboard-listing mb-4">
                  {sortedListings.map((listing) => (
                    <div
                      key={listing.enquery_id}
                      className="d-flex align-items-center mb-3"
                    >
                      <div className="photox">
                        <img
                          src={
                            listing?.gallery?.[0]?.images?.[0]?.file
                              ? listing.gallery[0].images[0].file
                              : listing?.galleries?.[0]?.images?.[0]?.filename
                              ? listing?.galleries?.[0]?.images?.[0]?.filename
                              : "/default-image.jpg"
                          }
                          alt="Property Thumbnail"
                          height="64"
                          width="96"
                        />
                      </div>

                      <div className="flex-grow-1 ms-3">
                        <Link
                          href={`/property-details/${
                            listing?.slug || listing?.project_details?.slug
                          }`}
                        >
                          <h4 className="mb-0">
                            {listing?.name ||
                              listing?.project_details?.project_name}
                          </h4>
                        </Link>
                        <p className="mb-0">
                          <i className="icon-feather-map-pin text-site"></i>{" "}
                          {listing.property_address ||
                            listing.project_details?.address}
                        </p>
                        <div className="user-groups ms-3">
                          <span className="ms-1">
                          <i className="icon-feather-user"></i>{listing.Name || listing?.customer_name || "user"}
                          </span>
                          <span className="ms-2">
                          <i className="icon-feather-phone"></i>{listing.Phone|| listing?.customer_phone || "phone"}
                          </span>
                          <span className="ms-3">
                            <i className="icon-feather-mail"></i>{listing.Email|| listing?.customer_email || "email"}
                          </span>
                        </div>
                      </div>
                      <div className="text-end">
                        <span
                          className={`ads-type ${
                            listing.enquery_status
                              ? listing.enquery_status.toLowerCase()
                              : "unknown"
                          }`}
                        >
                          {listing.enquery_status || "Unknown"}
                        </span>
                        <h3>
                          {listing.carpet_area ||
                            listing?.project_details?.project_size ||
                            "200"}{" "}
                          sq ft
                        </h3>
                        <p>
                          <i className="material-icons-outlined">today</i>{" "}
                          {useDateFormat(listing.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center">
                  <h5>No records found</h5>
                </div>
              )}
              {currentPage < totalPages && (
                <button
                  className="btn btn-primary btn-lg d-block mx-auto mt-4"
                  onClick={handleLoadMoreClick}
                >
                  Load More
                </button>
              )}
            </aside>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Index;
