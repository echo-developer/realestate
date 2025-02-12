import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Modal, Button } from "react-bootstrap";
import EnquiryForm from "@/components/charts/EnquiryForm";

const Index = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <MainLayout>
      {/* Header Section */}
      <div className="header text-center text-white p-5" style={{ background: "#333" }}>
        <h1>Sales Enquiry</h1>
        <p>We are happy to help you.</p>
      </div>

      <div className="container mt-4">
        {/* Info Banner */}
        <div className="info-box d-flex align-items-center p-3 bg-light rounded shadow-sm">
          <img src="/assets/images/agents/user.jpg" alt="Support" className="me-3" style={{ width: "40px", height: "40px" }} />
          <p className="mb-0">
            <strong>
              Confused about which <span className="text-danger">Ad Package</span> to buy?
            </strong>{" "}
            Our <strong>Sales Specialist</strong> will help you with the best choice.
          </p>
          <Button variant="primary" className="ms-auto" onClick={() => setShowModal(true)}>
            Request a Callback
          </Button>
        </div>

        {/* Question Box */}
        <div className="question-box text-center bg-primary text-white p-3 mt-3 rounded">
          <p className="mb-1">
            <strong>HAVE A QUESTION?</strong> See if we have already answered it.
          </p>
          <a href="#" className="btn btn-light" role="button">
            Show Me
          </a>
        </div>

        {/* Headquarters */}
        <h3 className="mt-4">Headquarter Office</h3>
        <p>
          <i className="bi bi-geo-alt"></i> RealEstate Services Limited (realestate.com), Times Centre (Digital
          Content Production Facility), FC - 6, (Third Floor), Sector 16 A, Film City, Noida - 201301, U.P.
        </p>

        {/* Branch Offices Table */}
        <h3 className="mt-4">RealEstate Branch Offices</h3>
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="table-danger">
              <tr>
                <th>City</th>
                <th>Address</th>
                <th>Phone</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {/* Agra, Vrindavan & Mathura */}
              <tr>
                <td><strong>Agra, Vrindavan & Mathura</strong></td>
                <td>
                  Ankit Bhargava (Sales Consultant) <br />
                  Mr. Abhishek Kumar (For Owner Enquiry) <br />
                  RealEstate Realty Services Limited <br />
                  G 10/8, 4th floor, Padamdeep tower, Sanjay place, Agra
                </td>
                <td>
                  07217565363 <br />
                  07876400400
                </td>
                <td>
                  <a href="mailto:ankit.bhargava@realestate.com">ankit.bhargava@realestate.com</a>
                  <br />
                  <a href="mailto:enquiry@realestate.com">enquiry@realestate.com</a>
                </td>
              </tr>

              {/* Ahmedabad */}
              <tr>
                <td><strong>Ahmedabad</strong></td>
                <td>
                  Mr. Navin Singh (A.M) <br />
                  Mr. Dharmesh Goyal (Zonal Manager) <br />
                  Mr. Jayesh Patel (Zonal Manager) For Agent Enquiry <br />
                  Mr. Abhishek Kumar (For Owner Enquiry) <br />
                  RealEstate Realty Services Limited <br />
                  Fadia Chambers, 139, Ashram Rd, Opposite Bata Showroom, Vishalpur, Muslim Society, Navrangpura,
                  Ahmedabad, Gujarat 380009
                </td>
                <td>
                  07861064869 <br />
                  09665562252 <br />
                  09723344365 <br />
                  07876400400
                </td>
                <td>
                  <a href="mailto:navin.singh@realestate.com">navin.singh@realestate.com</a>
                  <br />
                  <a href="mailto:dharmesh.goyal@realestate.com">dharmesh.goyal@realestate.com</a>
                  <br />
                  <a href="mailto:jayesh.patel@realestate.com">jayesh.patel@realestate.com</a>
                  <br />
                  <a href="mailto:enquiry@realestate.com">enquiry@realestate.com</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Bootstrap Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Request a Callback</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EnquiryForm />
        </Modal.Body>
      </Modal>
    </MainLayout>
  );
};

export default Index;
