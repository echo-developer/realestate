"use client";
import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Modal, Button } from "react-bootstrap";
import CRMEnquiry from "@/components/property-crm/CRMEnquiry";
import { useRouter } from "next/router";
import AuthUser from "@/components/Authentication/AuthUser";
import { toast } from "react-toastify";
import { ShimmerSectionHeader } from "react-shimmer-effects";
import Link from "next/link";
import withAuth from "@/utils/withAuth";
import useTranslation from "@/hooks/useTranslation";

const Index = () => {
  const translation = useTranslation();
  const { callApi } = AuthUser();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { assign_id } = router?.query || {};
  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);
  const [scheduleData, setScheduleData] = useState({});
  const [CRMEnquiryForm, setCRMEnquiryForm] = useState({
    enq_status: "",
    date: "",
    remarks: "",
  });
  const [leadDetails, setLeadDetails] = useState(null);

  useEffect(() => {
    if (assign_id) {
      fetchCRMDetails(assign_id);
    }
  }, [assign_id]);

  const fetchCRMDetails = async (assign_id) => {
    setLoading(true);
    try {
      const response = await callApi({
        api: `/lead-details`,
        method: "GET",
        data: {
          assign_id: assign_id,
        },
      });
      if (response?.status === 1) {
        setLeadDetails(response?.data);
      }
    } catch (error) {
      console.error("Error fetching lead details:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderDetail = (label, value, formatter = null) => {
    if (value === undefined || value === null) return null;
    return (
      <p className="mb-2">
        <b style={{display: 'inline-block', minWidth: '120px'}}>{label}:</b> {formatter ? formatter(value) : value}
      </p>
    );
  };

  return (
    <DashboardLayout>
      <aside className="col-lg col-12">
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "200px",
              width: "100%",
            }}
            className="d-flex justify-content-center align-items-center w-100"
          >
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">
                {translation?.loading || "Loading...."}
              </span>
            </div>
          </div>
        ) : leadDetails ? (
          <div className="p-4">
            <h1 className="h4 text-primary">Property CRM</h1>

            <ul className="nav nav-underline mb-3 gap-4">
              <li className="nav-item">
                <Link className="nav-link active" href="#">
                  CRM Lead Details
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  href={`/property-crm-timeline?assign_id=${
                    assign_id
                  }`}
                >
                  Timeline
                </Link>
              </li>
            </ul>

            <h4 className="text-primary mb-3">Lead Details</h4>
            <div className="bg-primary-subtle rounded-3 p-3">
            <h4 className="mb-3"><span className="text-muted">Customer Name:</span> {leadDetails?.name}</h4>
              {renderDetail("Mobile No.", leadDetails?.phone)}
              {renderDetail("Email I'd", leadDetails?.email)}
              {renderDetail("Remarks", leadDetails?.message || "No Remarks Available")}
              {renderDetail(
                "Purchase Timeline",
                leadDetails?.purchase_timeline,
                formatPurchaseTimeline
              )}
              {renderDetail("Meeting Date", "Not Scheduled")}
              {renderDetail("Lead Status", leadDetails?.status, getStatusText)}
              {renderDetail(
                "Budget Range",
                leadDetails?.min_budget && leadDetails?.max_budget
                  ? `${leadDetails?.min_budget} - ${leadDetails?.max_budget}`
                  : null
              )}
              {renderDetail(
                "Size Range",
                leadDetails?.min_size && leadDetails?.max_size
                  ? `${leadDetails?.min_size} - ${leadDetails?.max_size} sq.ft`
                  : null
              )}
              {renderDetail("Created At", leadDetails?.created_at, formatDate)}
              {renderDetail("Last Updated", leadDetails?.updated_at, formatDate)}
              {renderDetail("Locality", leadDetails?.locality)}
              {renderDetail(
                "Property Type",
                leadDetails?.property_type,
                getPropertyTypeName
              )}
              {renderDetail("Property For", leadDetails?.property_for)}
              {renderDetail("Terms", leadDetails?.terms)}
            </div>
          </div>
        ) : (
          <div className="alert alert-warning">No lead details found</div>
        )}
      </aside>
    </DashboardLayout>
  );
};

// Helper functions
function formatDate(dateString) {
  if (!dateString) return "";
  try {
    return new Date(dateString)?.toLocaleString();
  } catch (e) {
    return dateString;
  }
}

function getStatusText(status) {
  const statusMap = {
    "1": "New",
    "2": "Contacted",
    "3": "Qualified",
    "4": "Lost",
  };
  return statusMap?.[status] || status;
}

function getPropertyTypeName(typeId) {
  const propertyTypes = {
    1: "Residential",
    2: "Commercial",
  };
  return propertyTypes?.[typeId] || `Type ${typeId}`;
}

function formatPurchaseTimeline(timeline) {
  const mappings = {
    "6_months": "Within 6 months",
    "1_year": "Within 1 year",
  };
  return mappings?.[timeline] || timeline;
}

export default withAuth(Index);