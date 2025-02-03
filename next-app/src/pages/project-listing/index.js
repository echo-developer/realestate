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
          setEnquiryList(response.data.enquiredProperties);
        } else {
          setEnquiryList((prev) => [
            ...prev,
            ...(response?.data?.enquiredProperties || []),
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
                  className={`tab-btn ${activeTab === "property" ? "active" : ""}`}
                  onClick={() => setActiveTab("property")}
                >
                  Property
                </button>
                <button
                  className={`tab-btn ${activeTab === "project" ? "active" : ""}`}
                  onClick={() => setActiveTab("project")}
                >
                  Project
                </button>
              </div>

              <div className="d-flex justify-content-between mb-3">
                <h4>{activeTab === "property" ? "Property Enquiries" : "Project Enquiries"}</h4>
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
                      key={listing.enquery_id} // Use enquiry_id as the unique key
                      className="d-flex align-items-center mb-3"
                    >
                      <div className="photox">
                        <img
                          src={
                            listing?.galleries?.[0]?.filename
                              ? `path/to/images/${listing?.galleries?.[0]?.filename}`
                              : "/default-image.jpg"
                          }
                          alt="Property Thumbnail"
                          height="64"
                          width="96"
                        />
                      </div>
                      <div className="flex-grow-1 ms-3">
                        <Link href={`/property-details/${listing.property_id}`}>
                          <h4 className="mb-0">{listing.name}</h4>
                        </Link>
                        <p className="mb-0">
                          <i className="icon-feather-map-pin text-site"></i>{" "}
                          {listing.property_address}
                        </p>
                        <div className="user-groups ms-3">
                          <span className="ms-1">
                            {listing.enquery_status} Enquiries
                          </span>
                        </div>
                      </div>
                      <div className="text-end">
                        <span
                          className={`ads-type ${listing.enquery_status.toLowerCase()}`}
                        >
                          {listing.enquery_status}
                        </span>
                        <h3>{listing.super_area} sq ft</h3>
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
