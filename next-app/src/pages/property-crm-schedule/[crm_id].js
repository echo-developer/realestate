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
// import { enquiryStatuses } from "@/components/post/PropertyData";

const Index = () => {
  const { callApi } = AuthUser();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { crm_id } = router.query;
  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);
  const [scheduleData, setScheduleData] = useState({});
  const [CRMEnquiryForm, setCRMEnquiryForm] = useState({
      enq_status: "",
      date: "",
      remarks: "",
    });

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


  const changeCRMForm = (e) => {
    const { name, value } = e.target;
    setCRMEnquiryForm({
        ...CRMEnquiryForm,
        [name]: value,
    });
};

  const getStatusLabel = (statusId) => {
    const status = enquiryStatuses.find((item) => item.id === statusId);
    return status ? status.label : "Unknown Status";
  };

  const actionUpdateFunction = (id, data) => {
    const newState = scheduleData;
    newState.enquery_status = Number(data?.enq_status);
    newState.log_data = {
      ...newState?.log_data,
      enquery_status: Number(data?.enq_status),
      remarks: data?.remarks,
      schedule_date: data?.date
    }
    setScheduleData(newState);
  }

  const enq_value = enquiryStatuses?.find((item) => item?.id == scheduleData?.enquery_status)

  const handleSubmitEnquery = async (e) => {
    e.preventDefault();
    try {
      const res = await callApi({
        api: "/property_CRM_logs",
        method: "POST",
        data: {
            enquiry_id: crm_id,
            enq_status: CRMEnquiryForm.enq_status,
            date: CRMEnquiryForm.date,
            remarks: CRMEnquiryForm.remarks,
        }
      })
      if(res && res?.status === 1) {
        toast?.success("Schedule added successfully");
        handleClose();
        setCRMEnquiryForm({
          enq_status: "",
          date: "",
          remarks: "",
        })
      } else {
        toast?.error(res?.error?.message || "Failed to add schedule")
      }
    } catch (error) {
      toast?.error(error?.message || "Something went wrong")
    }
  }


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
                <Link className="nav-link active" href={`/property-crm-schedule/${scheduleData?.enquery_id}`}>
                  CRM Lead Details
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href={`/property-crm-timeline?enquery_id=${scheduleData?.enquery_id}`}>
                  Timeline
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href={`/property-crm-calender`}>
                  Scheduled
                </Link>
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
                    <span className={`badge ${scheduleData?.enquery_status ==
                      "1"
                      ? "bg-primary"
                      : scheduleData?.enquery_status ==
                        "2"
                        ? "bg-success"
                        : scheduleData?.enquery_status ==
                          "3"
                          ? "bg-danger"
                          : scheduleData?.enquery_status ==
                            "4"
                            ? "bg-info"
                            : scheduleData?.enquery_status ==
                              "5"
                              ? "bg-warning"
                              : "bg-primary"
                      }`}>{enq_value?.label || "Not available"}</span>
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
                <b>Mobile No.:</b> {scheduleData?.Phone ? `+91${scheduleData.Phone}` : "Not Available"}
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
          <div>
            <form>
              <div className="form-floating mb-4">
                <select className="form-select" id="floatingSelect" name="enq_status" aria-label="Floating label select example" value={CRMEnquiryForm.enq_status} onChange={changeCRMForm}>
                  <option value="">Select Status</option>
                  {enquiryStatuses?.map((status) => (
                    <option key={status.id} value={status.id}>
                      {status.label}
                    </option>
                  ))}
                </select>
                <label htmlFor="floatingSelect">Status</label>
              </div>

              <div className="form-floating mb-4">
                <input type="datetime-local" className="form-control" id="scheduleDate" name="date" value={CRMEnquiryForm.date} onChange={changeCRMForm} />
                <label htmlFor="scheduleDate">Schedule Date</label>
              </div>

              <div className="form-floating mb-4">
                <textarea rows="4" className="form-control" id="remarks" name="remarks" placeholder="Remarks" style={{ minHeight: "80px" }} value={CRMEnquiryForm.remarks} onChange={changeCRMForm}></textarea>
                <label htmlFor="remarks">Remarks</label>
              </div>

              <div className="text-end">
                <button type="submit" className="btn btn-success" onClick={handleSubmitEnquery}>Submit</button>
              </div>
            </form>

          </div>
          {/* )} */}

        </Modal.Body>
      </Modal>
    </DashboardLayout>
  );
};

export default withAuth(Index);
