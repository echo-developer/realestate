"use client";
import { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import AuthUser from "../Authentication/AuthUser";
import { toast } from "react-toastify";
import useTranslation from "@/hooks/useTranslation";

const LoanDetailsModal = ({ show, handleClose }) => {
  const { callApi } = AuthUser();
  const translation = useTranslation();

  const [formData, setFormData] = useState({
    loan_amount: "",
    tenure: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    property_identified: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [showSubmitBtn, setShowSubmitBtn] = useState(false);

  useEffect(() => {
    const { name, email, phone, address } = formData;
    setShowSubmitBtn(
      name.trim() && email.trim() && phone.trim() && address.trim()
    );
  }, [formData]);

  const requiredFields = ["name", "email", "phone", "address"];

  const validateField = (name, value) => {
    switch (name) {
      case "name":
        return value.trim() ? "" : "Name is required";
      case "email":
        if (!value.trim()) return "Email is required";
        if (!/\S+@\S+\.\S+/.test(value)) return "Invalid email format";
        return "";
      case "phone":
        return value.trim() ? "" : "Phone is required";
      case "address":
        return value.trim() ? "" : "Address is required";
      default:
        return "";
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (!requiredFields.includes(name)) return;

    setTouchedFields((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setFormErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touchedFields[name]) {
      const error = validateField(name, value);
      setFormErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const errors = {};
    requiredFields.forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) errors[field] = error;
    });
  
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      const touched = {};
      Object.keys(errors).forEach((key) => (touched[key] = true));
      setTouchedFields(touched);
      return;
    }
  
    const payload = {
      ...formData,
      property_identified: formData.property_identified === "Yes" ? 1 : 0,
    };
  
    try {
      const response = await callApi({
        api: `/save_loan_enquery`,
        method: "UPLOAD",
        data: payload,
      });
  
      if (response?.status == 1) {
        toast.success("Loan details submitted successfully!");
        handleClose();
        setFormErrors({});
        setTouchedFields({});
      } else {
        toast.error("Error submitting loan details.");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };
  

  const requiredLabel = (label) => (
    <>
      {label} <span style={{ color: "red" }}>*</span>
    </>
  );

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title> Loan Enquiry</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p className="mb-3">
          Just a few quick details to help us match you with the right loan options for your property or project.
        </p>

        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>{translation?.loan_amount || "Loan Amount"}</Form.Label>
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
                <Form.Label>{translation?.tenure || "Tenure"}</Form.Label>
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
                <Form.Label>{requiredLabel("Name")}</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touchedFields.name && !!formErrors.name}
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.name}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>{requiredLabel("Email")}</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touchedFields.email && !!formErrors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.email}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>{requiredLabel("Phone")}</Form.Label>
                <Form.Control
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touchedFields.phone && !!formErrors.phone}
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.phone}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>{requiredLabel("Address")}</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touchedFields.address && !!formErrors.address}
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.address}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>{translation?.property_identified || "Is your property identified?"}</Form.Label>
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
          </Row>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          {translation?.close || "Close"}
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={!showSubmitBtn}
        >
          {translation?.submit_details || "Submit Details"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LoanDetailsModal;
