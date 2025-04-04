"use client";
import { useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import AuthUser from "../Authentication/AuthUser";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthProvider";

const LoanDetailsModal = ({ show, handleClose }) => {
  const { getAllCity } = useAuth();
  const { callApi } = AuthUser();
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);
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

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [showSubmitBtn,setShowSubmitBtn]=useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleOTPChange = (e, index) => {
    const value = e.target.value.replace(/\D/, ""); // Only digits
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input if value exists
    if (value && index < 5) {
      const nextInput = document.querySelector(
        `input[name='otp-${index + 1}']`
      );
      if (nextInput) nextInput.focus();
    }
    // Check if all digits are filled
    const isComplete = newOtp.every((digit) => digit !== "");
    if (isComplete) {
      verifyOtp(newOtp.join(""));
    }
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
  const sendOtp = async () => {
    if (!formData.phone) return;
    setLoading(true);
    try {
      const response = await callApi({
        api: `/send-otp`,
        method: "UPLOAD",
        data: {
          phone: formData.phone,
        },
      });
      if (response && response.status===1) {
        setOtpSent(true);
        toast.success("OTP sent successfully!");
        setShowOtpField(true);
        setIsResendDisabled(true);
        setTimer(60);
        const countdown = setInterval(() => {
          setTimer((prev) => {
            if (prev === 1) {
              clearInterval(countdown);
              setIsResendDisabled(false);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        toast.error("Failed to send OTP.");
      }
    } catch (error) {
      toast.error("An error occurred while sending the OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (otp) => {
    setLoading(true);
    try {
      const response = await callApi({
        api: `/verify-otp`,
        method: "UPLOAD",
        data: {
          otp: otp,
          phone: formData.phone,
        },
      });

      if (response && response.status === 1) {
        setOtpVerified(true);
        setShowSubmitBtn(true)
        toast.success("OTP verified successfully!");
      } else {
        toast.error("Invalid OTP");
      }
    } catch (error) {
      toast.error("An error occurred while verifying the OTP");
    } finally {
      setLoading(false);
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
                  {getAllCity.map((city) => (
                    <option key={city.city_id} value={city.city_id}>
                      {city.name}
                    </option>
                  ))}
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
                  Phone Number (OTP verification required)
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
            <Col md={6} className="d-flex align-items-end">
              <Button
                variant="primary"
                onClick={sendOtp}
                disabled={!formData.phone || isResendDisabled}
              >
                {isResendDisabled ? `Resend OTP in ${timer}s` : "Send OTP"}
              </Button>
            </Col>
          </Row>
          {showOtpField && (
            <Row className="mb-3">
              <Col md={12}>
                <Form.Label>Enter 6-digit OTP</Form.Label>
                <div className="d-flex gap-2">
                  {[...Array(6)].map((_, index) => (
                    <Form.Control
                      key={index}
                      type="text"
                      maxLength="1"
                      name={`otp-${index}`}
                      value={otp[index] || ""}
                      onChange={(e) => handleOTPChange(e, index)}
                      className="text-center"
                      style={{
                        width: "50px",
                        height: "50px",
                        fontSize: "20px",
                      }}
                    />
                  ))}
                </div>
              </Col>
            </Row>
          )}

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
        <Button variant="primary" onClick={handleSubmit} disabled={!showSubmitBtn}>
          Submit Details
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LoanDetailsModal;
