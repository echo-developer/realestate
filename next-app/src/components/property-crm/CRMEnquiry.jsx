import React, { useState, useEffect } from "react";
import AuthUser from "../Authentication/AuthUser";
import { toast } from "react-toastify";

const CRMEnquiry = ({ handleCloseModal, logData,fecthPropertyCRMData ,enquiryId }) => {
    const { callApi ,GetMemberId} = AuthUser();
    const [CRMEnquiryForm, setCRMEnquiryForm] = useState({
        enq_status: logData?.enquery_status || "No Answer",
        date: logData?.schedule_date || "",
        remarks: logData?.remarks || "",
    });

    const memberId = GetMemberId();

    useEffect(() => {
        if (logData) {
            setCRMEnquiryForm({
                enq_status: logData.enquery_status || "No Answer",
                date: logData.schedule_date || "",
                remarks: logData.remarks || "",
            });
        }
    }, [logData ,memberId]);

    const changeCRMForm = (e) => {
        const { name, value } = e.target;
        setCRMEnquiryForm({
            ...CRMEnquiryForm,
            [name]: value,
        });
    };

    const validateForm = () => {
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
                method: "POST",
                data: {
                    enquiry_id: enquiryId,
                    enq_status: CRMEnquiryForm.enq_status,
                    date: CRMEnquiryForm.date,
                    remarks: CRMEnquiryForm.remarks,
                },
            });

            if (response && response.status === 1) {
                setCRMEnquiryForm({
                    enq_status: "No Answer",
                    date: "",
                    remarks: "",
                });
                toast.success(response.message);
                handleCloseModal();
                fecthPropertyCRMData(memberId);
            } else {
                alert(response.message);
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
    };

    const enquiryStatuses = ["No Answer", "Lead", "Reject", "Accepted"];

    console.log(enquiryId)

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
                        {enquiryStatuses.map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
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

                <button type="submit" className="btn btn-success">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default CRMEnquiry;
