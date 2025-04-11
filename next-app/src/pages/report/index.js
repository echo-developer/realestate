"use client";
import DashboardLayout from "@/components/layout/DashboardLayout";
import React, { useEffect, useState } from "react";
import AuthUser from "@/components/Authentication/AuthUser";
import { CustomLoader } from "@/components/postproject/ProjectAmenities";
import useTranslation from "@/hooks/useTranslation";
import TextComponent from "@/components/addtional/AreaExpand";
import {
  Form,
  Row,
  Col,
  ListGroup,
  Nav,
  ProgressBar,
  FloatingLabel,
} from "react-bootstrap";
import { Calendar, Person } from 'react-bootstrap-icons';

const index = () => {
  const [activeTab, setActiveTab] = useState("property");
  const [reportList, setReportList] = useState([]);
  const [page, setPage] = useState(1);
  const [currentpage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const { GetMemberId, callApi } = AuthUser();
  const [loading, setLoading] = useState(true);
  const memberId = GetMemberId();
const translation = useTranslation();
  const getReportList = async (loadmore, page = 1) => {
    if (!loadmore) {
      setLoading(true);
    }
    try {
      const url =
        activeTab === "property"
          ? "/get_reported_properties"
          : "/get_reported_projects";
      const res = await callApi({
        api: url,
        method: "GET",
        data: {
          user_id: memberId,
          current_page: page,
        },
      });

      if (res && res?.status === 1) {
        if (!loadmore) {
          setReportList(res?.data || []);
        } else {
          setReportList((prev) => {
            return [...prev, ...(res?.data || [])];
          });
        }
        setCurrentPage(res?.pagination?.current_page || 0);
        setTotalPages(res?.pagination?.total_pages || 0);
      }
    } catch (error) {
      console.error(error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (memberId) {
      getReportList(false, page);
    }
  }, [activeTab, memberId]);

  const handleLoadMoreClick = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    getReportList(true, nextPage);
  };

  return (
    <DashboardLayout>
      <aside className="col-lg col-12">
      <div className="p-lg-4 p-3">
        <Nav variant="underline" className="mb-3">
          <Nav.Item>
            <Nav.Link
              className={`${activeTab === "property" ? "active" : ""}`}
              onClick={() => {
              setActiveTab("property");
              setPage(1);
            }}
            >
              {translation?.property || "Property"} Reviews
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              className={`${activeTab === "project" ? "active" : ""}`}
                onClick={() => {
                setActiveTab("project");
                setPage(1);
              }}
            >
              {translation?.project || "Project"} Reviews
            </Nav.Link>
          </Nav.Item>
        </Nav>

        <div className="d-flex justify-content-between mb-3">
          <h4>
            {activeTab === "property"
              ? `${translation?.reported_properties ||"Reported Properties"}`
              : `${translation?.reported_projects ||"Reported Projects"}`}
          </h4>
        </div>

        <div className="dashboard-listing mb-4">
        <ul className="card-listing">
          {loading && <CustomLoader />}
          {!loading &&
            reportList?.length > 0 &&
            reportList?.map((report, i) => {
              const isProperty = activeTab === "property";

              return (
                <li>
                <div key={i} className="d-flex mb-2 align-items-center">
                  {/* Dynamic Image */}
                  <div className="photox mx-auto mb-md-0">
                    <img
                      src={
                        isProperty
                          ? report?.image
                          : report?.image ||
                            "/assets/images/property/default-property-1.jpg"
                      }
                      alt="Thumbnail"
                      height="64"
                      width="96"
                    />
                  </div>

                  {/* Dynamic Details */}
                  <div className="flex-grow-1 ps-3">
                    <div className="row">
                      <div className="col-md">
                        <h4 className="mb-0">
                          <small>
                          {report?.name || "Unknown"}
                          (ID:{" "}
                          {isProperty
                            ? report?.property_id
                            : report?.project_id || "Not Available"}
                          )
                          </small>
                        </h4>
                        <p className="mb-0">
                          <Person color="primary" size={16} /> {report?.reported_by || "Anonymous"}
                        </p>
                      </div>

                      {/* Report Details */}
                      <div className="col-md-auto text-md-end">
                        <i className="text-muted">{translation?.reason || "Reason"}{" "}</i>:{" "}
                        <span className="mb-0">
                          {report?.reason || "No Reason"}
                        </span>                    
                      </div>
                    </div>
                  </div>

                  
                </div>
                <TextComponent text={report?.description || "No description"} />
                </li>
              );
            })}
          {!loading && reportList?.length === 0 && (
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
                  <p className="text-muted">{translation?.no_record_founds || "No Record Founds"}</p>
                </div>
              </div>
            </>
          )}
          {!loading && currentpage < totalPages && (
            <button
              className="btn btn-primary btn-lg d-block mx-auto mt-4"
              onClick={handleLoadMoreClick}
            >
              {translation?.load_more || "Load More"}
            </button>
          )}
          </ul>
        </div>
      </div>
      </aside>
    </DashboardLayout>
  );
};

export default index;
