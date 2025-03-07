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

const Timeline = () => {
  const translation = useTranslation();
  const { callApi } = AuthUser();
  const [showModal, setShowModal] = useState(false);
  const [timelineData, setTimelineData] = useState([]);
  const router = useRouter();
  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);
  const { enquery_id } = router?.query || {};
  const [CRMEnquiryForm, setCRMEnquiryForm] = useState({
    enq_status: "",
    date: "",
    remarks: "",
  });

  useEffect(() => {
    if (router?.isReady) {
      const { enquery_id } = router?.query || {};
      FetchTimeLineData(enquery_id);
      Aos.init();
      Aos.refresh();
    }
  }, [router?.isReady]);

  const FetchTimeLineData = async (enquery_id) => {
    try {
      const response = await callApi({
        api: "/enquery_timeline",
        method: "GET",
        data: {
          enquery_id: enquery_id,
        },
      });

      if (response && response.status === 1) {
        setTimelineData(response.data);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Error fetching timeline data.");
    }
  };


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
    if(res && res?.status === 1) {
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


  return (
    <DashboardLayout>
      <div className="container">
        <div className="row">
          <aside className="col-lg col-12">
            <div className="p-4">
              <h1 className="h4 text-primary">{translation?.property_crm || "Property CRM"}</h1>

              <ul className="nav mb-3 gap-4">
                <li className="nav-item">
                  <a className="nav-link" href={`/property-crm-schedule/${enquery_id}`}>
                  {translation?.crm_lead_details || "CRM Lead Details"}
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
                <li className="nav-item">
                  <a className="nav-link" href={`/property-crm-calender`}>
                  {translation?.scheduled || "Scheduled"}
                  </a>
                </li>
              </ul>

              <div className="d-flex align-items-center justify-content-end mb-4">
                <Button variant="primary" onClick={handleShow}>
                {translation?.add_new_data || "Add New Data"} <BsPlusLg />
                </Button>
              </div>

              <div className="timeline-container">
                {timelineData?.length > 0 && timelineData?.slice()?.reverse()?.map((item, i) => {
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
                            <h5 className="_title">{findEnqStatus(item?.enquery_status)}</h5>
                            <div className="_details">
                              <h5>{translation?. actions || "Action:"}</h5>
                              <p>{item?.remarks || `${translation?.not_available ||"Not available"}`}</p>
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
              </div>
            </div>
          </aside>
        </div>

        <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{translation?.add_new_data || "Add New Data"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <form>
                <div className="form-floating mb-4">
                  <select className="form-select" id="floatingSelect" name="enq_status" aria-label="Floating label select example" value={CRMEnquiryForm.enq_status}
                        onChange={changeCRMForm}>
                  {enquiryStatuses?.map((status) => (
                            <option key={status.id} value={status.id}>
                                {status.label}
                            </option>
                        ))}
                  </select>
                  <label htmlFor="floatingSelect">{translation?.status || "Status"}</label>
                </div>

                <div className="form-floating mb-4">
                  <input type="datetime-local" className="form-control" id="scheduleDate" name="date" value={CRMEnquiryForm.date}
                        onChange={changeCRMForm} />
                  <label htmlFor="scheduleDate">{translation?.schedule_date || "Schedule Date"}</label>
                </div>

                <div className="form-floating mb-4">
                  <textarea rows="4" className="form-control" id="remarks" name="remarks" placeholder="Remarks" style={{ minHeight: "80px" }} value={CRMEnquiryForm.remarks}
                        onChange={changeCRMForm}></textarea>
                  <label htmlFor="remarks">{translation?.remarks || "Remarks"}</label>
                </div>
              </form>
            </div>

          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
            {translation?.close || "Close"}
            </Button>
            <Button variant="primary" onClick={handleSubmitEnquery}>
            {translation?.submit || "Submit"}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default withAuth(Timeline);
