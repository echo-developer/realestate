import React, { useState } from "react";

const ReportAdvertisementForm = () => {
  const [formData, setFormData] = useState({
    reason: "",
    additionalInfo: "",
  });

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
        {errors.additionalInfo && (
          <div className="invalid-feedback">{errors.additionalInfo}</div>
        )}
      </div>

      {/* Buttons */}
      <div className="d-flex justify-content-between">
        <button type="button" className="btn btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn btn-danger">
          Submit Report
        </button>
      </div>
    </form>
  );
};

export default ReportAdvertisementForm;
