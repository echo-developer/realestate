"use client";
import React, { useEffect, useState } from "react";
import AuthUser from "@/components/Authentication/AuthUser";
import { toast } from "react-toastify";
import useDateFormat from "@/hooks/useDateFormat";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import withAuth from "@/utils/withAuth";
import { enGB } from "date-fns/locale";
import LocalitySearch from "@/components/MapData/LocalitySearch";
import { DateRangePicker } from "rsuite";
import "rsuite/DateRangePicker/styles/index.css";
import moment from "moment";
import {
  Form,
  Row,
  Col,
  ListGroup,
  Nav,
  ProgressBar,
  FloatingLabel,
  Modal,
  Button,
} from "react-bootstrap";

import useTranslation from "@/hooks/useTranslation";
const Index = () => {
  const translation = useTranslation();
  const { callApi, GetMemberId } = AuthUser();
  const [enquiryList, setEnquiryList] = useState([]);
  const [sortType, setSortType] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [activeTab, setActiveTab] = useState("property");
  const [locality, setLocality] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("");
  const [dateRange, setDateRange] = useState(null);
  const [PropertyName, setpropertyName] = useState([]);


  const handleDateChange = (value) => {
    setDateRange(value);
  };
  const handleSearch = () => {
    const apiUrl =
      activeTab === "property"
        ? "/my_property_enquery_list"
        : "/my_project_enquery_list";

    fetchEnquiryList(apiUrl, false, 1, {
      searchTerm,
      status,
      dateRange,
      locality,
    });
  };

  const [enqueryModal, setEnqueryModal] = useState({
    enquery_id: "",
    status: false,
    data: null,
  });

  const memberId = GetMemberId();

  const credit = 20;

  useEffect(() => {
    if (memberId) {
      if (activeTab === "property") {
        fetchEnquiryList("/my_property_enquery_list");
      } else if (activeTab === "project") {
        fetchEnquiryList("/my_project_enquery_list");
      }
    }
  }, [memberId, sortType, activeTab]);

  const fetchEnquiryList = async (
    apiUrl,
    loadMore = false,
    page = 1,
    filters = {}
  ) => {
    if (!loadMore) {
      setIsLoading(true);
    }
    try {
      const response = await callApi({
        api: apiUrl,
        method: "GET",
        data: {
          user_id: memberId,
          sort_type: sortType,
          current_page: page,
          search_term: filters.searchTerm || "",
          status: filters.status || "",
          start_date: filters.dateRange?.[0]
            ? moment(filters.dateRange[0]).format("YYYY-MM-DD")
            : "",
          end_date: filters?.dateRange?.[1]
            ? moment(filters?.dateRange[1]).format("YYYY-MM-DD")
            : "",
          ...(filters.locality || ""),
        },
      });

      if (response && response.status === 1) {
        if (!loadMore) {
          setEnquiryList(
            response?.data?.enquiredProperties ||
              response?.data?.enquiredProjects 
          );
          setpropertyName(response?.options?.property_list || response?.options?.project_list);
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
        toast.error(response.message || "failed to load data");
      }
    } catch (error) {
      console.error("Data not found");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMoreClick = () => {
    if (activeTab === "property") {
      fetchEnquiryList(
        "/my_property_enquery_list",
        true,
        Number(currentPage) + 1
      );
    } else {
      fetchEnquiryList(
        "/my_project_enquery_list",
        true,
        Number(currentPage) + 1
      );
    }
  };

  const handleViewEnquery = (enquery_id) => {
    const enquery = enquiryList?.find(
      (item) => item?.enquery_id === enquery_id
    );

    setEnqueryModal({
      enquery_id: enquery_id,
      status: true,
      data: {
        message: enquery?.message || "Sorry no enquery message found",
        name: enquery?.Name,
      },
    });
  };

  const handleCloseEnqueryModal = () => {
    setEnqueryModal({
      enquery_id: "",
      status: false,
      data: null,
    });
  };

  console.log(status);

  return (
    <DashboardLayout>
      <aside className="col-lg col-12">
        <div className="p-4">
          <h4>
            {activeTab === "property"
              ? `${translation?.property_enquiries || "Property Enquiries"}`
              : `${translation?.project_enquiries || "Project Enquiries"}`}
          </h4>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <ul className="nav nav-underline mb-3 gap-4">
              <li className="nav-item">
                <a
                  role="button"
                  className={`nav-link ${
                    activeTab === "property" ? "active" : "secondary"
                  } tab-btn`}
                  onClick={() => {
                    setActiveTab("property");
                    setEnquiryList([]);
                  }}
                >
                  {translation?.property || "Property"}
                </a>
              </li>
              <li className="nav-item">
                <a
                  role="button"
                  className={`nav-link ${
                    activeTab === "project" ? "active" : "secondary"
                  } tab-btn ms-2`}
                  onClick={() => {
                    setActiveTab("project");
                    setEnquiryList([]);
                  }}
                >
                  {translation?.project || "Project"}
                </a>
              </li>
            </ul>

            <select
              className="form-select"
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
              style={{ width: "150px" }}
            >
              <option value="all"> {translation?.sort_by || "Sort By"}</option>
              <option value="weekly">{translation?.weekly || "Weekly"}</option>
              <option value="monthly">
                {translation?.monthly || "Monthly"}
              </option>
              <option value="yearly">{translation?.yearly || "Yearly"}</option>
            </select>
          </div>
          <Row className="gx-3 mb-3">
            {/* Search Input */}
            <Col className="col-lg col-sm-6 col-12">
              <div className="form-field with-icon-start mb-0 flex-grow-1 me-1">
                {/* <i className="bi bi-search"></i> */}
                <FloatingLabel
                  controlId="floatingInput"
                  label="Search"
                  className="mb-3"
                >
                  <Form.Control
                    type="text"
                    placeholder={
                      translation?.search_enquiry_here || "Search enquiry here"
                    }
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </FloatingLabel>
              </div>
            </Col>

            <Col className="col-lg col-sm-6 col-12">
              <LocalitySearch
                locality={locality}
                setLocalityData={setLocality}
              />
            </Col>

            {/* Status Dropdown */}
            <Col className="col-lg col-sm-6 col-12">
              <div className="form-field with-icon-start mb-0 flex-grow-1 me-1">
                <FloatingLabel controlId="floatingSelect" label="Status">
                  <Form.Select
                    aria-label="Floating label select example"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="">Select Name</option>{" "}
                    {/* Default option */}
                    {PropertyName?.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name || item.project_name}
                      </option>
                    ))}
                  </Form.Select>
                </FloatingLabel>
              </div>
            </Col>

            {/* Date Range Picker */}
            <Col className="col-lg col-sm-6 col-12">
              <FloatingLabel
                controlId="floatingInput"
                label="Date Range"
                className="mb-3"
              >
                <DateRangePicker
                  format="yyyy-MM-dd"
                  showHeader={false}
                  value={dateRange}
                  onChange={handleDateChange}
                  className="form-control"
                  placeholder={
                    translation?.select_date_range || "Select Date Range"
                  }
                  placement="bottomEnd"
                />
              </FloatingLabel>
            </Col>

            {/* Search Button */}
            <Col className="col-lg-auto col-12">
              <div className="d-grid">
                <button className="btn btn-primary" onClick={handleSearch}>
                  {translation?.search || "Search"}
                </button>
              </div>
            </Col>
          </Row>

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
                    if (activeTab === "property") {
                      return listing?.galleries?.[0]?.filename;
                    } else {
                      return listing?.project_details?.gallery?.[0]?.images?.[0]
                        ?.filename;
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
                              firstImage ||
                              "/assets/images/property/default-property-1.jpg"
                            }
                            alt="Property Thumbnail"
                            height="64"
                            width="96"
                          />
                        </div>

                        <div className="flex-grow-1 ps-sm-3">
                          <h4 className="mb-1">
                            <Link
                              href={`/property-details/${
                                listing?.slug || listing?.project_details?.slug
                              }`}
                            >
                              <small>
                                {listing?.name ||
                                  listing?.project_details?.project_name}
                              </small>
                            </Link>
                            &nbsp;(
                            {listing.carpet_area ||
                              listing?.project_details?.project_size ||
                              "200"}{" "}
                            sq ft)
                          </h4>
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
                              {listing.Phone ||
                                listing?.customer_phone ||
                                "phone"}
                            </span>
                            <span className="me-3">
                              <i className="ri-mail-line me-1"></i>
                              {listing.Email ||
                                listing?.customer_email ||
                                "email"}
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
                          <button
                            className="btn btn-primary btn-sm mb-2"
                            onClick={() =>
                              handleViewEnquery(listing?.enquery_id)
                            }
                          >
                            {translation?.view_enquiry || "View Enquiry"}
                          </button>
                          <p>
                            <i className="material-icons-outlined">
                              {" "}
                              {translation?.today || "Today"}
                            </i>{" "}
                            {useDateFormat(listing.created_at)}
                          </p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <>
              <div className="card border-0 text-center">
                <div className="card-body">
                  <img
                    src="/assets/images/icons/9939447.png"
                    alt="Icon"
                    height={48}
                    width={48}
                    className="mb-2"
                  />
                  <p className="text-muted">
                    {translation?.no_record_founds || "No Record Founds"}
                  </p>
                </div>
              </div>
            </>
          )}
          {!isLoading &&
            currentPage < totalPages &&
            enquiryList.length > 10 && (
              <div className="text-center">
                <button
                  className="btn btn-primary mx-auto mt-4"
                  onClick={handleLoadMoreClick}
                >
                  {translation?.load_more || "Load More"}
                </button>
              </div>
            )}
        </div>
      </aside>

      <Modal
        show={enqueryModal?.status}
        centered
        onHide={handleCloseEnqueryModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {translation?.enquired_by || "Enquired by"}{" "}
            {enqueryModal?.data?.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{enqueryModal?.data?.message}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEnqueryModal}>
            {translation?.close || "Close"}
          </Button>
        </Modal.Footer>
      </Modal>
    </DashboardLayout>
  );
};

export default withAuth(Index);
