import React, { useState } from "react";
import AuthUser from "../Authentication/AuthUser";

const CRMEnquiry = () => {
  const { callApi } = AuthUser();
  const [CRMEnquiryForm, setCRMEnquiryForm] = useState({
    selected: "No Answer",
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

  const SubmitCRMEnquiryData = async (e) => {
    e.preventDefault();
    try {
      const response = await callApi({
        api: `/crm_enquiry`,
        method: "POST",
        data: CRMEnquiryForm,
      });

      if (response && response.success === true) {
        // Reset the form
        setCRMEnquiryForm({
          selected: "No Answer",
          date: "",
          remarks: "",
        });
      } else {
        alert(response.message);
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
            name="selected"
            value={CRMEnquiryForm.selected}
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
