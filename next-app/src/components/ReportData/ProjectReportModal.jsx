import React, { useState, useEffect } from "react";
import AuthUser from "../Authentication/AuthUser";
import { toast } from "react-toastify";
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

const ProjectReportModal = ({ projectId, handleClose }) => {
  const { callApi, GetMemberId } = AuthUser();
  const memberId = GetMemberId();
  const translation = useTranslation();
  const [formData, setFormData] = useState({
    reason: "",
    additionalInfo: "",
    project_id: projectId,
    user_id: memberId,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (memberId) {
      setFormData((prevData) => ({
        ...prevData,
        user_id: JSON.parse(memberId),
      }));
    }
  }, [memberId]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await callApi({
        api: "/report_project",
        method: "UPLOAD",
        data: formData,
      });

      if (response && response.status === 1) {
        toast.success(response.message || "Report submitted successfully!");
        setFormData({ reason: "", additionalInfo: "",  project_id: projectId, user_id: memberId });
        handleClose(); // Close modal after successful submission
      } else {
        toast.error(response.message || "Failed to submit the report.");
      }
    } catch (error) {
      console.error("Error reporting property:", error);
      toast.error("An error occurred while submitting the report.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* <h4>{translation?.report_advertisement || "Report This Advertisement"}</h4> */}

      {/* Reason Selection */}      
      <FloatingLabel
       controlId="floatingSelect" label={translation?.reason || "Reason"}
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
        {errors.additionalInfo && <div className="invalid-feedback">{errors.additionalInfo}</div>}
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

export default ProjectReportModal;
