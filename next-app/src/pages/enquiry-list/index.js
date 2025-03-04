"use client";
import React, { useEffect, useState } from "react";
import AuthUser from "@/components/Authentication/AuthUser";
import { toast } from "react-toastify";
import useDateFormat from "@/hooks/useDateFormat";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import withAuth from "@/utils/withAuth";
import { Modal, Button } from "react-bootstrap";
import EnquirySearchFilter from "@/components/addtional/EnquirySearchFilter";

const Index = () => {
  const { callApi, GetMemberId } = AuthUser();
  const [enquiryList, setEnquiryList] = useState([]);
  const [sortType, setSortType] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [activeTab, setActiveTab] = useState("property");
  const [enqueryModal, setEnqueryModal] = useState({
    enquery_id: "",
    status: false,
    data: null
  })

  const memberId = GetMemberId();

  const credit =20;

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
        data: { user_id: memberId, sort_type: sortType, current_page: page },
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


  const handleLoadMoreClick = () => {
    if (activeTab === "property") {
      fetchEnquiryList("/my_property_enquery_list", true, Number(currentPage) + 1);
    } else {
      fetchEnquiryList("/my_project_enquery_list", true, Number(currentPage) + 1);
    }
  };


  const handleViewEnquery = (enquery_id) => {
    const enquery = enquiryList?.find(item => item?.enquery_id === enquery_id);


    setEnqueryModal({
      enquery_id: enquery_id,
      status: true,
      data: {
        message: enquery?.message || "Sorry no enquery message found",
        name: enquery?.Name
      }
    })
  }

  const handleCloseEnqueryModal = () => {
    setEnqueryModal({
      enquery_id: "",
      status: false,
      data: null
    })
  }

  return (
    <DashboardLayout>
      <aside className="col-lg col-12">        
      <div className="p-4">        
        <h4>
          {activeTab === "property"
            ? "Property Enquiries"
            : "Project Enquiries"}
        </h4>
          
        <div className="d-flex justify-content-between align-items-center mb-3">        
          <ul className="nav nav-underline mb-3 gap-4">
            <li className="nav-item">
            <a role="button"
              className={`nav-link ${activeTab === "property" ? "active" : "secondary"} tab-btn`}
              onClick={() => setActiveTab("property")}
            >
              Property
            </a></li>
            <li className="nav-item">
              <a role="button"
              className={`nav-link ${activeTab === "project" ? "active" : "secondary"} tab-btn ms-2`}
              onClick={() => setActiveTab("project")}
            >
              Project
            </a></li>
          </ul>
          
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
       <EnquirySearchFilter/>
        

        {/* Loading Spinner or Listings */}
        {isLoading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        ) : enquiryList.length > 0 ? (
          <div className="dashboard-listing mb-4">
            <ul className="dashboard-box-list">
            {enquiryList.map((listing) => {
              const firstImage = (() => {
                if(activeTab === "property") {
                  return listing?.galleries?.[0]?.filename 
                } else {
                  return listing?.project_details?.gallery?.[0]?.images?.[0]?.filename
                }
              })();
              return (
              <li>
              <div
                key={listing.enquery_id}
                className="d-sm-flex align-items-center"
              >
                <div className="photox text-center mb-3 mb-sm-0">
                  <img
                    src={
                      firstImage || "/assets/images/property/default-property-1.jpg"
                    }
                    alt="Property Thumbnail"
                    height="64"
                    width="96"
                  />
                </div>

                <div className="flex-grow-1 ps-sm-3">
                  <h4 className="mb-0"><Link
                    href={`/property-details/${
                      listing?.slug || listing?.project_details?.slug
                    }`}
                  >
                    
                      {listing?.name || listing?.project_details?.project_name}
                    
                  </Link>
                  &nbsp;(
                  {listing.carpet_area ||
                      listing?.project_details?.project_size ||
                      "200"}{" "}
                    sq ft)</h4>
                  <p className="mb-0">
                    <i className="icon-feather-map-pin text-site"></i>{" "}
                    {listing.property_address ||
                      listing.project_details?.address}
                  </p>
                  <div className="user-groups d-flex flex-wrap">
                    <span className="me-3">
                      <i className="ri-account-circle-line me-1"></i>
                      {listing.Name || listing?.customer_name || "user"}
                    </span>
                    <span className="me-3">
                      <i className="ri-phone-line me-1"></i>
                      {listing.Phone || listing?.customer_phone || "phone"}
                    </span>
                    <span className="me-3">
                      <i className="ri-mail-line me-1"></i>
                      {listing.Email || listing?.customer_email || "email"}
                    </span>
                  </div>
                </div>
                <div className="text-sm-end">
                  <span
                    className={`ads-type ${
                      listing.enquery_status
                        ? listing?.enquery_status
                        : "unknown"
                    }`}
                  >
                    {listing.enquery_status || "Unknown"}
                  </span>
                  <button className="btn btn-primary btn-sm mb-2" onClick={() => handleViewEnquery(listing?.enquery_id)}>View Enquiry</button>
                  <p>
                    <i className="material-icons-outlined">today</i>{" "}
                    {useDateFormat(listing.created_at)}
                  </p>
                </div>
              </div>
              </li>
              )
            })}
            </ul>
          </div>
        ) : (
          <div className="text-center">
            <h5>No records found</h5>
          </div>
        )}
        {!isLoading && currentPage < totalPages && (
          <div className="text-center">
            <button
              className="btn btn-primary mx-auto mt-4"
              onClick={handleLoadMoreClick}
            >
              Load More
            </button>
          </div>
        )}
        </div>
      </aside>

      <Modal show={enqueryModal?.status} centered onHide={handleCloseEnqueryModal}>
        <Modal.Header closeButton>
          <Modal.Title>Enquired by {enqueryModal?.data?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{enqueryModal?.data?.message}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEnqueryModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </DashboardLayout>
  );
};

export default withAuth(Index);
