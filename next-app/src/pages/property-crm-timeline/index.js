"use client";

import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";
import { BsPlusLg, BsClock, BsChevronDoubleRight, BsChevronDoubleLeft } from "react-icons/bs";
import DashboardLayout from "@/components/layout/DashboardLayout";

const Timeline = () => {
  const [showModal, setShowModal] = React.useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  return (
    <DashboardLayout>
    <div className="container">
      <div className="row">
        <aside className="col-lg col-12">
          <div className="p-4">
            <h1 className="h4 text-primary">Property CRM</h1>

            <ul className="nav nav-underline mb-3 gap-4">
              <li className="nav-item">
                <a className="nav-link" href="#">
                  CRM Lead Details
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link active" href="#">
                  Timeline
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
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
              {[
                { title: "No response:", details: "Call him but he was busy.", date: "12/11/2024 10:12 am", direction: "right" },
                { title: "Date confirmation:", details: "He call us and give a date to visit office", date: "12/11/2024 10:12 am", direction: "left" },
                { title: "Show interest:", details: "Call us and show interest to visit site", date: "12/11/2024 10:12 am", direction: "right" },
                { title: "Visit site:", details: "Visited site, willing to take time for know more details about the site.", date: "12/11/2024 10:12 am", direction: "right" },
                { title: "Final confirmation:", details: "See all papers and documents. Give a final confirmation. He will call us", date: "12/11/2024 10:12 am", direction: "left" },
              ].map((step, index) => (
                <div className={`row gx-lg-5 align-items-center timeline _${step.direction}`} key={index}>
                  <aside className={`col-lg col-12 ${step.direction === "right" ? "text-end" : "text-start"}`}>
                    <div className="timeline-box">
                      <div className="_body">
                        <h5 className="_title">{step.title}</h5>
                        <div className="_details">
                          <h5>{step.details}</h5>
                        </div>
                      </div>
                    </div>
                  </aside>
                  <aside className="col-lg col-12 text-center">
                    <span className="timeline-badge bg-secondary-subtle text-dark">
                      <BsClock /> {step.date}
                      <span className="arrow-icon text-primary">
                        {step.direction === "right" ? (
                          <BsChevronDoubleRight />
                        ) : (
                          <BsChevronDoubleLeft />
                        )}
                      </span>
                    </span>
                  </aside>
                  <aside className="col-lg col-12"></aside>
                </div>
              ))}
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
          {/* Modal content goes here */}
          <p>Form or content to add new data.</p>
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
