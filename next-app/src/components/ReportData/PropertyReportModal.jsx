import React, { useState, useEffect } from "react";
import AuthUser from "../Authentication/AuthUser";
import { toast } from "react-toastify";

const PropertyReportModal = ({ propertyId, handleClose }) => {
  const { callApi, GetMemberId } = AuthUser();
  const memberId = GetMemberId();

  const [formData, setFormData] = useState({
    reason: "",
    additionalInfo: "",
    property_id: propertyId,
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
        api: "/report_property",
        method: "UPLOAD",
        data: formData,
      });

      if (response && response.status === 1) {
        toast.success(response.message || "Report submitted successfully!");
        setFormData({ reason: "", additionalInfo: "", property_id: propertyId, user_id: memberId });
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
    <form className="p-4" onSubmit={handleSubmit}>
      <h3>Report This Advertisement</h3>

      {/* Reason Selection */}
      <div className="mb-3">
        <label className="form-label">Reason</label>
        <select
          className={`form-control ${errors.reason ? "is-invalid" : ""}`}
          name="reason"
          value={formData.reason}
          onChange={handleChange}
        >
          <option value="">Select Reason</option>
          {reasons.map((reason, index) => (
            <option key={index} value={reason}>
              {reason}
            </option>
          ))}
        </select>
        {errors.reason && <div className="invalid-feedback">{errors.reason}</div>}
      </div>

      {/* Additional Information */}
      <div className="mb-3">
        <label className="form-label">Additional Information</label>
        <textarea
          className={`form-control ${errors.additionalInfo ? "is-invalid" : ""}`}
          name="additionalInfo"
          rows="4"
          placeholder="Enter additional information..."
          value={formData.additionalInfo}
          onChange={handleChange}
        ></textarea>
        {errors.additionalInfo && <div className="invalid-feedback">{errors.additionalInfo}</div>}
      </div>

      {/* Buttons */}
      <div className="d-flex justify-content-between">
        <button type="button" className="btn btn-secondary" onClick={handleClose}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Submit Report
        </button>
      </div>
    </form>
  );
};

export default PropertyReportModal;
