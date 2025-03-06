import React, { useState } from "react";
import useTranslation from "@/hooks/useTranslation";
import {
  Form,
  Row,
  Col,
  ListGroup,
  Nav,
  ProgressBar,
  FloatingLabel,
} from "react-bootstrap";
const ReportAdvertisementForm = () => {
  const [formData, setFormData] = useState({
    reason: "",
    additionalInfo: "",
  });
  const translation = useTranslation();
  const [errors, setErrors] = useState({});

  const reasons = [
    "Non Original Content",
    "Inappropriate Content",
    "Trademark Violation",
    "Copyrights Violation",
    "Fraud",
    "Miscategorized",
    "Repetitive Listing",
    "Other",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.reason) {
      newErrors.reason = "Please select a reason.";
    }
    if (!formData.additionalInfo.trim()) {
      newErrors.additionalInfo = "Additional information is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      alert("Report submitted successfully!");
      // Reset form
      setFormData({ reason: "", additionalInfo: "" });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Reason Selection */}
      <FloatingLabel
       label={translation?.reason || "Reason"}
       className="mb-4"
       >
        <Form.Select
          className={`${errors.reason ? "is-invalid" : ""}`}
          name="reason"
          value={formData.reason}
          onChange={handleChange}
        >
          <option value="">{translation?.select_reason || "Select Reason"}</option>
          {reasons.map((reason, index) => (
            <option key={index} value={reason}>
              {reason}
            </option>
          ))}
        </Form.Select>
        {errors.reason && <div className="invalid-feedback">{errors.reason}</div>}
      </FloatingLabel>

      {/* Additional Information */}
      <FloatingLabel
        label={translation?.additional_information || "Additional Information"}
        className="mb-4"
      >
        <Form.Control
          as="textarea"
          className={`${errors.additionalInfo ? "is-invalid" : ""}`}
          name="additionalInfo"
          rows="4"
          placeholder="Enter additional information..."
          value={formData.additionalInfo}
          onChange={handleChange}
          style={{ height: '100px' }}
        />
        {errors.additionalInfo && (
          <div className="invalid-feedback">{errors.additionalInfo}</div>
        )}
      </FloatingLabel>

      {/* Buttons */}
      <div className="d-flex justify-content-end">        
        <button type="submit" className="btn btn-primary">
        {translation?.submit || "Submit"}
        </button>
      </div>
    </form>
  );
};

export default ReportAdvertisementForm;
