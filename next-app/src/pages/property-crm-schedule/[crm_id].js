"use client";
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Modal, Button } from 'react-bootstrap';
import CRMEnquiry from '@/components/property-crm/CRMEnquiry';

const index = () => {
  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  return (
    <DashboardLayout>
      <aside className="col-lg col-12">
        <div className="p-4">
          <h1 className="h4 text-primary">Property CRM</h1>

          <ul className="nav nav-underline mb-3 gap-4">
            <li className="nav-item">
              <a className="nav-link active" href="#">CRM Lead Details</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Timeline</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Scheduled</a>
            </li>
          </ul>

          <div className="d-flex align-items-center justify-content-between mb-4">
            <div>
              <h4>
                <span className="me-3">4 BHK Flat Sale, 2241 Sq-ft 4 BHK Flat For Sale in Rajarhat, Kolkata</span>
                <span className="h5">
                  <span className="badge bg-primary me-2">#5874569</span>
                  <span className="badge bg-success">LEAD</span>
                </span>
              </h4>
              <p className="mb-1">
                <i className="bi bi-geo-alt"></i> Orchid Plaza, Rajarhat, North 24 Parganas, Kolkata - 700135
              </p>
            </div>
            <Button variant="primary" onClick={handleShow}>Update</Button>
          </div>

          <h4 className="text-primary mb-3">Lead Details</h4>
          <div className="bg-secondary-subtle rounded-3 p-3">
            <h4>Dev Sharma</h4>
            <p><b>Mobile No.:</b> +910215895201</p>
            <p><b>Email I’d:</b> dev23@gmail.com</p>
            <p><b>Subject:</b> Lorem ipsum dolor</p>
            <p><b>Meeting Date:</b> 3rd March, 2024, 04:23 PM</p>
            <p><b>Message:</b> Lorem ipsum dolor sit amet consectetur adipiscing elit. Ut et. Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et.</p>
          </div>
        </div>
      </aside>

      {/* Modal for Update */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Lead Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CRMEnquiry/>
        </Modal.Body>
        {/* <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer> */}
      </Modal>
    </DashboardLayout>
  );
};

export default index;
