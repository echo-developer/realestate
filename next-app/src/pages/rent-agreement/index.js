import React, { useState } from "react";
import { Container, Row, Col, Button, Card, Nav, Modal, Form, ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import MainLayout from "@/components/layout/MainLayout";

const RentAgreement = () => {
  const [activeTab, setActiveTab] = useState("what-is");
  const [showModal, setShowModal] = useState(false);
  const [userType, setUserType] = useState("Owner"); // Owner or Tenant

  const [formData, setFormData] = useState({
    title: "Mr",
    name: "",
    phone: "",
    email: "",
    address: "",
    pincode: "",
    city: "",
    state: "",
  });

  const tabContent = {
    "what-is": {
      title: "What is a Rent Agreement?",
      content:
        "A house rent agreement is a legal contract between the landlord and tenant for a fixed period. It outlines terms and conditions that both parties must follow. The agreement can be renewed every 11 months or as per the agreed terms.",
    },
    registered: {
      title: "Registered Rent Agreement",
      content:
        "A registered rent agreement is legally recorded with the government, ensuring protection for both parties. It provides more security and is often required for official purposes.",
    },
    terms: {
      title: "Terms & Conditions for Rent Agreement",
      content:
        "The agreement includes conditions like rent amount, deposit, maintenance charges, and obligations of both landlord and tenant.",
    },
    "how-to-register": {
      title: "How Do You Register a House Rent Agreement?",
      content:
        "To register a rent agreement, visit the sub-registrar office with necessary documents, including ID proofs, property details, and the agreement draft.",
    },
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Form Data:", formData);
    setShowModal(false);
  };

  return (
    <MainLayout>
      <Container className="mt-4">
        {/* Header Section */}
        <Row className="align-items-center bg-light p-4 rounded">
          <Col md={6}>
            <h2 className="text-danger fw-bold">
              FREE <span className="text-dark">Rent Agreement</span>
            </h2>
            <ul className="list-unstyled">
              <li>✅ Easy & super quick online drafting</li>
              <li>✅ Completely customizable template</li>
              <li>✅ Instant download available for FREE</li>
            </ul>
            <Button variant="primary" size="lg" onClick={() => setShowModal(true)}>
              Get FREE Rent Agreement
            </Button>
          </Col>
          <Col md={6} className="text-center">
            <img src="/assets/images/user.jpg" alt="Rent Agreement" className="img-fluid" />
          </Col>
        </Row>

        {/* Rent Agreement Info Section */}
        <h3 className="text-center my-4">All you need to know about Rent Agreement</h3>
        <Row>
          {/* Sidebar Navigation */}
          <Col md={3}>
            <Nav className="flex-column">
              {Object.keys(tabContent).map((key, index) => (
                <Nav.Link
                  key={index}
                  className={`p-2 ${activeTab === key ? "bg-primary text-white rounded" : "text-dark"}`}
                  onClick={() => setActiveTab(key)}
                  style={{ cursor: "pointer" }}
                >
                  {tabContent[key].title}
                </Nav.Link>
              ))}
            </Nav>
          </Col>

          {/* Tab Content */}
          <Col md={9}>
            <Card className="p-3 shadow-sm">
              <h5>{tabContent[activeTab].title}</h5>
              <p>{tabContent[activeTab].content}</p>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Modal Form */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Basic Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            {/* User Type Selection */}
            <div className="mb-3">
              <strong>You are :</strong>
              <div className="d-flex gap-2 mt-2">
                <Button variant={userType === "Owner" ? "success" : "outline-secondary"} onClick={() => setUserType("Owner")}>
                  Owner
                </Button>
                <Button variant={userType === "Tenant" ? "success" : "outline-secondary"} onClick={() => setUserType("Tenant")}>
                  Tenant
                </Button>
              </div>
            </div>

            {/* Title & Name */}
            <Row className="mb-3">
              <Col md={3}>
                <Form.Select name="title" value={formData.title} onChange={handleInputChange}>
                  <option>Mr</option>
                  <option>Ms</option>
                  <option>Mrs</option>
                </Form.Select>
              </Col>
              <Col md={9}>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder={`${userType}'s Name`}
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </Col>
            </Row>

            {/* Phone */}
            <Form.Group className="mb-3">
              <Form.Label>Mobile Number</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                placeholder="+91 Mobile Number"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            {/* Email */}
            <Form.Group className="mb-3">
              <Form.Label>Email ID</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            {/* Permanent Address */}
            <Form.Group className="mb-3">
              <Form.Label>
                Permanent Address <span className="text-info">(i)</span>
              </Form.Label>
              <Form.Control
                as="textarea"
                name="address"
                rows={2}
                placeholder="Enter your permanent address"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            {/* Pincode, City, State */}
            <Row className="mb-3">
              <Col md={4}>
                <Form.Control
                  type="text"
                  name="pincode"
                  placeholder="Pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  required
                />
              </Col>
              <Col md={4}>
                <Form.Control
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </Col>
              <Col md={4}>
                <Form.Control
                  type="text"
                  name="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                />
              </Col>
            </Row>

            {/* Submit Button */}
            <Button variant="primary" type="submit" className="w-100">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </MainLayout>
  );
};

export default RentAgreement;
