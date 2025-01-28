"use client";

import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";
import { BsPlusLg, BsClock, BsChevronDoubleRight, BsChevronDoubleLeft } from "react-icons/bs";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AuthUser from "@/components/Authentication/AuthUser";
import { toast } from "react-toastify";
import CRMEnquiry from "@/components/property-crm/CRMEnquiry";

const Timeline = () => {
  const { callApi } = AuthUser();
  const [showModal, setShowModal] = useState(false);
  const [timelineData, setTimelineData] = useState([]);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  useEffect(() => {
    FetchTimeLineData();
  }, []);

  const FetchTimeLineData = async () => {
    try {
      const response = await callApi({
        api: "/enquery_timeline",
        method: "GET",
        data: {
          enquery_id: "1",
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


  const getStatusTitle = (status) => {
    switch (status) {
      case 1:
        return "No response";
      case 2:
        return "Date confirmation";
      case 3:
        return "Show interest";
      case 4:
        return "Visit site";
      default:
        return "Unknown status";
    }
  };

  return (
    <DashboardLayout>
      <div className="container">
        <div className="row">
          <aside className="col-lg col-12">
            <div className="p-4">
              <h1 className="h4 text-primary">Property CRM</h1>

              <ul className="nav mb-3 gap-4">
                <li className="nav-item">
                  <a className="nav-link" href="/property-crm">
                    CRM Lead Details
                  </a>
                </li>
                <li className="nav-item nav-underline">
                  <a className="nav-link active" href={`/property-crm-timeline`}>
                    Timeline
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href={`/property-crm-calender`}>
                    Scheduled
                  </a>
                </li>
              </ul>

              <div className="d-flex align-items-center justify-content-end mb-4">
                <Button variant="primary" onClick={handleShow}>
                  Add New Data <BsPlusLg />
                </Button>
              </div>

              <div className="timeline-container">
                {/* Timeline Steps */}
                {timelineData.map((step, index) => {
                  const statusTitle = getStatusTitle(step.enquery_status);
                  const direction = index % 2 === 0 ? "right" : "left"; // Alternate direction for each step

                  return (
                    <div className={`row gx-lg-5 align-items-center timeline _${direction}`} key={index}>
                      <aside className={`col-lg col-12 ${direction === "right" ? "text-end" : "text-start"}`}>
                        <div className="timeline-box">
                          <div className="_body">
                            <h5 className="_title">{statusTitle}:</h5>
                            <div className="_details">
                              <h5>{step.remarks}</h5>
                            </div>
                          </div>
                        </div>
                      </aside>
                      <aside className="col-lg col-12 text-center">
                        <span className="timeline-badge bg-secondary-subtle text-dark">
                          <BsClock /> {new Date(step.action_taken_on).toLocaleString()}
                          <span className="arrow-icon text-primary">
                            {direction === "right" ? <BsChevronDoubleRight /> : <BsChevronDoubleLeft />}
                          </span>
                        </span>
                      </aside>
                      <aside className="col-lg col-12"></aside>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>

        {/* Modal for Adding New Data */}
        <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add New Data</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <CRMEnquiry/>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleClose}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Timeline;
