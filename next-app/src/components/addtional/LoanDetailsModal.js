"use client";
import { useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import AuthUser from "../Authentication/AuthUser";
import { toast } from "react-toastify";

const LoanDetailsModal = ({ show, handleClose }) => {
  const { callApi } = AuthUser();
  const [formData, setFormData] = useState({
    loanAmount: "30,00,000",
    tenure: "20",
    age: "35",
    propertyCost: "37,50,000",
    propertyIdentified: "",
    propertyCity: "",
    employmentType: "Salaried",
    income: "1,00,000",
    currentEMI: "10,000",
    fullName: "",
    email: "",
    mobile: "",
    consent: false,
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await callApi({
        api: `/loan-eligibility`,
        method: "UPLOAD",
        data: formData,
      });

      if (response.ok) {
        toast.success("Loan details submitted successfully!");
        handleClose();
      } else {
        toast.error("Error submitting loan details.");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Home Loan Details</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p className="mb-3">
          We just need a few details to match you with the right home loan
          product.
        </p>

        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Loan Amount</Form.Label>
                <Form.Control
                  type="text"
                  name="loanAmount"
                  value={formData.loanAmount}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Tenure</Form.Label>
                <Form.Control
                  type="text"
                  name="tenure"
                  value={formData.tenure}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Your Age </Form.Label>
                <Form.Control type="text" value={formData.age} disabled />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Property Cost</Form.Label>
                <Form.Control
                  type="text"
                  name="propertyCost"
                  value={formData.propertyCost}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Is your property identified?</Form.Label>
                <Form.Select
                  name="propertyIdentified"
                  value={formData.propertyIdentified}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Property City</Form.Label>
                <Form.Select
                  name="propertyCity"
                  value={formData.propertyCity}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Bangalore">Bangalore</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Employment Type</Form.Label>
                <Form.Select
                  name="employmentType"
                  value={formData.employmentType}
                  onChange={handleChange}
                >
                  <option value="Salaried">Salaried</option>
                  <option value="Self-Employed">Self-Employed</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Your Income</Form.Label>
                <Form.Control
                  type="text"
                  name="income"
                  value={formData.income}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Current Total EMI (Monthly) </Form.Label>
                <Form.Control
                  type="text"
                  name="currentEMI"
                  value={formData.currentEMI}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Full Name (as per PAN)</Form.Label>
                <Form.Control
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter full name"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>
                  Mobile Number (OTP verification required)
                </Form.Label>
                <Form.Control
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="Enter mobile number"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Email ID</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              name="consent"
              checked={formData.consent}
              onChange={handleChange}
              label="I authorize 99acres.com relevant loan providers to contact me."
            />
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Submit Details
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LoanDetailsModal;
