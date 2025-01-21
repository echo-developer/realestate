"use client";
import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Modal, Button } from "react-bootstrap";
import CRMEnquiry from "@/components/property-crm/CRMEnquiry";
import { useRouter } from "next/router";
import AuthUser from "@/components/Authentication/AuthUser";
import { toast } from "react-toastify";
import { ShimmerSectionHeader } from "react-shimmer-effects";

const Index = () => {
  const { callApi } = AuthUser();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { crm_id } = router.query;
  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);
  const [scheduleData, setScheduleData] = useState({});

  const enquiryStatuses = [
    { id: "1", value: "No Answer", label: "No Answer" },
    { id: "2", value: "Lead", label: "Lead" },
    { id: "3", value: "Reject", label: "Reject" },
    { id: "4", value: "Accepted", label: "Accepted" },
    { id: "5", value: "Pending", label: "Pending" },
  ];

  useEffect(() => {
    if (crm_id) {
      fetchCRMDetails(crm_id);
    }
  }, [crm_id]);

  const fetchCRMDetails = async (crm_id) => {
    setLoading(true);
    try {
      const response = await callApi({
        api: `/crm_schedule_details`,
        method: "GET",
        data: {
          enquery_id: crm_id,
        },
      });
      if (response && response.status === 1) {
        setScheduleData(response.data);
      } else {
        toast.error("Failed to fetch CRM details.");
      }
    } catch (error) {
      console.error("Error fetching CRM details:", error);
      toast.error("An error occurred while fetching CRM details.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (statusId) => {
    const status = enquiryStatuses.find((item) => item.id === statusId);
    return status ? status.label : "Unknown Status";
  };

  return (
    <DashboardLayout>
      <aside className="col-lg col-12">
        {loading ? (
          <div>
            <ShimmerSectionHeader />
            <ShimmerSectionHeader center />
          </div>
        ) : (
          <div className="p-4">
            <h1 className="h4 text-primary">Property CRM</h1>

            <ul className="nav nav-underline mb-3 gap-4">
              <li className="nav-item">
                <a className="nav-link active" href="#">
                  CRM Lead Details
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Timeline
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Scheduled
                </a>
              </li>
            </ul>

            <div className="d-flex align-items-center justify-content-between mb-4">
              <div>
                <h4>
                  <span className="me-3">
                    {scheduleData?.property_name || "Property Name Not Available"}
                  </span>
                  <span className="h5">
                    <span className="badge bg-primary me-2">
                      #{scheduleData?.enquery_id || "Unknown ID"}
                    </span>
                    <span className="badge bg-success">LEAD</span>
                  </span>
                </h4>
                <p className="mb-1">
                  <i className="bi bi-geo-alt"></i>{" "}
                  {scheduleData?.property_address || "No Address Available"}
                </p>
              </div>
              <Button variant="primary" onClick={handleShow}>
                Update
              </Button>
            </div>

            <h4 className="text-primary mb-3">Lead Details</h4>
            <div className="bg-secondary-subtle rounded-3 p-3">
              <h4>
                {scheduleData?.customer_name || "Customer Name Not Available"}
              </h4>
              <p>
                <b>Mobile No.:</b> +91{scheduleData?.Phone || "Not Available"}
              </p>
              <p>
                <b>Email I’d:</b> {scheduleData?.Email || "Not Available"}
              </p>
              <p>
                <b>Remarks:</b> {scheduleData?.remarks || "No Remarks Available"}
              </p>
              <p>
                <b>Meeting Date:</b>{" "}
                {scheduleData?.schedule_date
                  ? new Date(scheduleData.schedule_date).toLocaleString()
                  : "Not Scheduled"}
              </p>
              <p>
                <b>Lead Status:</b> {getStatusLabel(scheduleData?.enquery_status)}
              </p>
            </div>
          </div>
        )}
      </aside>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Lead Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CRMEnquiry
            handleCloseModal={handleClose}
            logData={scheduleData?.log_data || {}}
            enquiryId={crm_id}
          />
        </Modal.Body>
      </Modal>
    </DashboardLayout>
  );
};

export default Index;
