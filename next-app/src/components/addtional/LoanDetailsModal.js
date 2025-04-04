"use client";
import { useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import AuthUser from "../Authentication/AuthUser";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthProvider";

const LoanDetailsModal = ({ show, handleClose }) => {
  const {setGetAllCity}= useAuth();
  const { callApi } = AuthUser();
  const [formData, setFormData] = useState({
    loan_amount: "30,00,000",
    tenure: "20",
    age: "35",
    property_cost: "37,50,000",
    property_identified: "",
    property_city: "",
    employment_type: "Salaried",
    income: "1,00,000",
    current_emi: "10,000",
    name: "",
    email: "",
    phone: "",
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
                  name="loan_amount"
                  value={formData.loan_amount}
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
                  name="property_cost"
                  value={formData.property_cost}
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
                  name="property_identified"
                  value={formData.property_identified}
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
                  name="property_city"
                  value={formData.property_city}
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
                  name="employment_type"
                  value={formData.employment_type}
                  onChange={handleChange}
                >
                  <option value="salaried">Salaried</option>
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
                  name="current_emi"
                  value={formData.current_emi}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Full Name (as per PAN)</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
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
                  phone Number (OTP verification required)
                </Form.Label>
                <Form.Control
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
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
