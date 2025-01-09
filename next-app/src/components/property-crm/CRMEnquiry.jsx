import React, { useState } from "react";
import AuthUser from "../Authentication/AuthUser";

const CRMEnquiry = () => {
  const { callApi } = AuthUser();
  const [CRMEnquiryForm, setCRMEnquiryForm] = useState({
    enq_status: "No Answer",
    date: "",
    remarks: "",
  });

  const changeCRMForm = (e) => {
    const { name, value } = e.target;
    setCRMEnquiryForm({
      ...CRMEnquiryForm,
      [name]: value,
    });
  };

  const validateForm = () => {
    // Basic validation: Ensure all fields are filled out
    return CRMEnquiryForm.date && CRMEnquiryForm.remarks;
  };

  const SubmitCRMEnquiryData = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const response = await callApi({
        api: "/property_CRM_logs",
        method: "POST", // Use POST for submission
        data: {
          enquiry_id: 1, // You should pass the actual enquiry ID here
          enq_status: CRMEnquiryForm.enq_status,
          date: CRMEnquiryForm.date,
          remarks: CRMEnquiryForm.remarks,
        },
      });

      if (response && response.success) {
        // Reset the form on success
        setCRMEnquiryForm({
          enq_status: "No Answer",
          date: "",
          remarks: "",
        });
        alert("Enquiry submitted successfully!");
      } else {
        alert(response.message || "Failed to submit the enquiry.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      alert("An error occurred while submitting the enquiry.");
    }
  };

  return (
    <div>
      <form onSubmit={SubmitCRMEnquiryData}>
        <div className="form-floating mb-4">
          <select
            className="form-select"
            id="floatingSelect"
            name="enq_status"
            value={CRMEnquiryForm.enq_status}
            onChange={changeCRMForm}
            aria-label="Floating label select example"
          >
            <option value="No Answer">No Answer</option>
            <option value="Lead">Lead</option>
            <option value="Reject">Reject</option>
            <option value="Accepted">Accepted</option>
          </select>
          <label htmlFor="floatingSelect">Status</label>
        </div>

        <div className="form-floating mb-4">
          <input
            type="datetime-local"
            className="form-control"
            id="scheduleDate"
            name="date"
            value={CRMEnquiryForm.date}
            onChange={changeCRMForm}
            required
          />
          <label htmlFor="scheduleDate">Schedule Date</label>
        </div>

        <div className="form-floating mb-4">
          <textarea
            rows="4"
            className="form-control"
            id="remarks"
            name="remarks"
            value={CRMEnquiryForm.remarks}
            placeholder="Remarks"
            onChange={changeCRMForm}
            style={{ minHeight: "80px" }}
            required
          ></textarea>
          <label htmlFor="remarks">Remarks</label>
        </div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default CRMEnquiry;
