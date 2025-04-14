"use client";

import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";
import {
  BsPlusLg,
  BsClock,
  BsChevronDoubleRight,
  BsChevronDoubleLeft,
} from "react-icons/bs";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AuthUser from "@/components/Authentication/AuthUser";
import { toast } from "react-toastify";
import CRMEnquiry from "@/components/property-crm/CRMEnquiry";
import Aos from "aos";
import "aos/dist/aos.css";
import withAuth from "@/utils/withAuth";
import { useRouter } from "next/router";
import { enquiryStatuses } from "@/components/post/PropertyData";
import useTranslation from "@/hooks/useTranslation";
import ContactModal from "@/components/property-crm/ContactModal";

const Timeline = () => {
  const translation = useTranslation();
  const { callApi, GetMemberId } = AuthUser();
  const [showModal, setShowModal] = useState(false);
  const [timelineData, setTimelineData] = useState([]);
  const router = useRouter();
  const { assign_id } = router?.query || {};
  const member_id = GetMemberId();
  const enquery_id = 2;
  const [loading, setLoading] = useState(true);
  const [CRMEnquiryForm, setCRMEnquiryForm] = useState({
    enq_status: "",
    date: "",
    remarks: "",
  });
  const [leadData, setLeadData] = useState(null);

  useEffect(() => {
    if (router?.isReady && member_id) {
      const { assign_id } = router?.query || {};
      FetchTimeLineData(assign_id);
      Aos.init();
      Aos.refresh();
    }
  }, [router?.isReady, member_id]);

  const FetchTimeLineData = async (assign_id) => {
    setLoading(true);
    try {
      const response = await callApi({
        api: "/lead-contact-history",
        method: "GET",
        data: {
          user_id: member_id,
          assign_id: assign_id,
        },
      });


      if (response && response.status === 1) {
        setTimelineData(response.data);
        setLeadData({
          "assign_id": response?.assign_id,
          "enquery_id": response?.enquiry_id,
          "lead_type": response?.lead_type,
          "phone": response?.phone,
          "email": response?.email
        })
      } else {
        toast.error(response.message);
        setLeadData({
          "assign_id": response?.assign_id || "",
          "enquery_id": response?.enquiry_id || "",
          "lead_type": response?.lead_type || "",
          "phone": response?.phone || "",
          "email": response?.email || ""
        })
      }
    } catch (error) {
      toast.error("Error fetching timeline data.");
    } finally {
      setLoading(false);
    }
  };


  const handleShow = () => {
    setShowModal(true)
  };
  const handleClose = () => setShowModal(false);

  const findEnqStatus = (id) => {
    const item = enquiryStatuses?.find(item => item?.id == id);
    return item ? item?.label : "Not available"
  }

  const changeCRMForm = (e) => {
    const { name, value } = e.target;
    setCRMEnquiryForm({
      ...CRMEnquiryForm,
      [name]: value,
    });
  };

  const handleSubmitEnquery = async () => {
    try {
      const res = await callApi({
        api: "/property_CRM_logs",
        method: "POST",
        data: {
          enquiry_id: enquery_id,
          enq_status: CRMEnquiryForm.enq_status,
          date: CRMEnquiryForm.date,
          remarks: CRMEnquiryForm.remarks,
        }
      })
      if (res && res?.status === 1) {
        toast?.success("Schedule added successfully");
        FetchTimeLineData(enquery_id);
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

  const submitHandler = async (data) => {
    const newData = {
      ...data,
      user_id: member_id,
      ...leadData
    };
    delete newData.phone;
    delete newData.email;

    try {
      const res = await callApi({
        api: '/save-lead-contact-status',
        method: "UPLOAD",
        data: newData
      })

      if (res && res?.status === 1) {
        toast.success("Contact form submitted successfully");
        handleClose();
        setTimelineData(prev => {
          return [...prev, {
            "schedule_date": data?.schedule_date,
            "remark_type": data.remark_type,
            "remarks": data.remarks
          }]
        })
      }
    } catch (error) {
      console.log(error.message || "Something went wrong")
    }
  }


  return (
    <DashboardLayout>
      <div className="container">
        <div className="row">
          <aside className="col-lg col-12">
            <div className="p-4">
              <h1 className="h4 text-primary">{translation?.leads_management || "Leads Management"}</h1>

              <ul className="nav mb-3 gap-4">
                <li className="nav-item">
                  <a className="nav-link" href={`/lead-details/${assign_id}`}>
                    Lead Details
                  </a>
                </li>
                <li className="nav-item nav-underline">
                  <a
                    className="nav-link active"
                    href={`/property-crm-timeline`}
                  >
                    {translation?.timeline || "Timeline"}
                  </a>
                </li>
                {/* <li className="nav-item">
                  <a className="nav-link" href={`/property-crm-calender`}>
                    {translation?.scheduled || "Scheduled"}
                  </a>
                </li> */}
              </ul>

              <div className="d-flex align-items-center justify-content-end mb-4">
                <Button variant="primary" onClick={handleShow}>
                  {translation?.add_new_data || "Add New Data"} <BsPlusLg />
                </Button>
              </div>
              {loading && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "200px",
                      width: "100%", // Ensure full width
                    }}
                    className="d-flex justify-content-center align-items-center w-100"
                  >
                    <div
                      className="spinner-border text-primary"
                      role="status"
                    >
                      <span className="visually-hidden">
                        {translation?.loading ||
                          "Loading...."}{" "}
                      </span>
                    </div>
                  </div>
                )}
              <div className="timeline-container">
                {!loading && timelineData?.length > 0 && timelineData?.slice()?.reverse()?.map((item, i) => {
                  const isEven = i % 2;

                  return (
                    <div
                      key={i}
                      className={`row gx-lg-5 align-items-center timeline _${isEven ? "start" : "end"}`}
                      data-aos={`fade-${isEven ? "right" : "left"}`}
                    >
                      <aside className={`col-lg col-12 ${isEven ? "text-end" : "order-lg-3"}`}>
                        <div className="timeline-box">
                          <div className="_body">
                            <span class="text-white">Schedule Date:</span>
                            <h6 className="_title">{formatDateTime(item.schedule_date)}</h6>
                            <div className="_details">
                              <h5>{item?.remark_type || "Not available"}</h5>
                              <p>{item?.remarks || "Not available"}</p>
                            </div>
                          </div>
                        </div>
                      </aside>
                      <aside className={`col-lg col-12 text-center ${isEven ? "" : "order-lg-2"}`}>
                        <span className="timeline-badge bg-secondary-subtle text-dark">
                          <i className="bi bi-clock"></i> {item?.action_taken_on}
                          <span className="arrow-icon text-primary">
                            <svg
                              className="bi"
                              width="24"
                              height="24"
                              fill="currentColor"
                              role="img"
                            >
                              <use xlinkHref="bootstrap-icons.svg#chevron-double-right"></use>
                            </svg>
                          </span>
                        </span>
                      </aside>
                      <aside className="col-lg col-12 text-center order-lg-1"></aside>
                    </div>
                  )
                })}

                {!loading && (timelineData?.length == 0 || timelineData == null) && (
                  <>
                  <div className="card border-0 text-center mt-4">
                      <div className="card-body">
                          <img
                              src="/assets/images/icons/9939447.png"
                              alt="Icon"
                              height={48}
                              width={48}
                              className="mb-2"
                              loading="lazy"
                          />
                          <p className="text-muted">{translation?.no_record_founds || "No Record Founds"}</p>
                      </div>
                  </div>
              </>
                )}
              </div>
            </div>
          </aside>
        </div>

        <ContactModal show={showModal} handleClose={handleClose} phone={leadData?.phone} email={leadData?.email} submitHandler={submitHandler} />
      </div>
    </DashboardLayout>
  );
};


function formatDateTime(dateTimeStr) {
  // Edge case: Handle null, undefined, or empty string
  if (!dateTimeStr?.trim()) {
    return "Invalid date: Input is empty or null";
  }

  try {
    const date = new Date(dateTimeStr.replace(' ', 'T') + 'Z');

    // Check if the date is invalid (e.g., "Invalid Date")
    if (isNaN(date?.getTime())) {
      return "Invalid date: Could not parse";
    }

    // Extract day, month, year (optional chaining not needed here)
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    // Extract hours, minutes, seconds
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // Determine AM/PM
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? String(hours).padStart(2, '0') : '12'; // Convert 0 to 12 for 12 AM

    // Construct the formatted string
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds} ${ampm}`;
  } catch (error) {
    return `Error: ${error.message}`;
  }
}

export default withAuth(Timeline);
