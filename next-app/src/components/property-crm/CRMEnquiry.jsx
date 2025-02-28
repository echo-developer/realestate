import React, { useState, useEffect } from "react";
import AuthUser from "../Authentication/AuthUser";
import { toast } from "react-toastify";
import { Modal, Button } from "react-bootstrap";
import useTranslation from "@/hooks/useTranslation";

const CRMEnquiry = ({ handleCloseModal, logData, enquiryId, actionUpdateFunction, showModal, modalContent }) => {
    const { callApi, GetMemberId } = AuthUser();
    const [CRMEnquiryForm, setCRMEnquiryForm] = useState({
        enq_status: "",
        date: "",
        remarks: "",
    });
    const memberId = GetMemberId();
const translation = useTranslation();
    useEffect(() => {
        if (logData) {
            setCRMEnquiryForm(prev => {
                return {
                    enq_status: logData?.enquery_status,
                    date: logData?.schedule_date || "",
                    remarks: logData?.remarks || "",
                }
            })
        }
    }, [logData])

    const enquiryStatuses = [
        { id: "1", value: "No Answer", label: "No Answer" },
        { id: "2", value: "Lead", label: "Lead" },
        { id: "3", value: "Reject", label: "Reject" },
        { id: "4", value: "Accepted", label: "Accepted" },
        { id: "5", value: "Pending", label: "Pending" },
    ];

    useEffect(() => {
        fecthPropertyCRMData(memberId);
    }, [memberId]);

    const fecthPropertyCRMData = async (memberId) => {
        try {
            const response = await callApi({
                api: "/my_property_CRMS",
                method: "GET",
                data: {
                    user_id: memberId,
                },
            });

            if (response && response.status === 1) {
            }
        } catch (error) {
            console.error("Error fetching property CRM data: ", error);
        }
    };


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
                actionUpdateFunction(enquiryId, CRMEnquiryForm)
                setCRMEnquiryForm({
                    enq_status: "1",
                    date: "",
                    remarks: "",
                });
                toast.success(response.message);
                handleCloseModal();
                fecthPropertyCRMData(memberId);
            } else {
                toast.error(response.message || "Failed to submit data");
            }
        } catch (error) {
            console.error("Error submitting CRM enquiry data:", error);
            toast.error("An error occurred while submitting data.");
        }
    };




    return (

        <Modal show={showModal.visible} onHide={handleCloseModal}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {showModal.type === "details" && (
                        <h4>
                            {modalContent?.customer_name}{" "}
                            <span className={`ads-type ${modalContent?.type}`} style={{ position: "inherit" }}>
                                #{modalContent?.property_id}
                            </span>
                        </h4>
                    )}
                    {showModal.type === "remarks" && "Remarks"}
                    {showModal.type === "communication" && "Communication"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {showModal.type === "details" && (
                    <>
                        <p className="d-flex gap-3 mb-1">
                            <span>
                                <i className="bi bi-telephone text-primary"></i> {modalContent?.Phone}
                            </span>
                            <span>
                                <i className="bi bi-envelope text-primary"></i> {modalContent?.Email}
                            </span>
                        </p>
                        <hr />
                        <p>
                            {modalContent?.message ||
                                "Lorem ipsum is simply dummy text of the printing and typesetting industry."}
                        </p>
                    </>
                )}
                {(showModal.type === "communication" || showModal.type === "remarks") && (
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
                                        <option key={status.id} value={status.id}>
                                            {status.label}
                                        </option>
                                    ))}
                                </select>
                                <label htmlFor="floatingSelect">{translation?.status || "Status"}</label>
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
                                <label htmlFor="scheduleDate">{translation?.schedule_date || "Schedule Date"}</label>
                            </div>

                            <div className="form-floating mb-4">
                                <textarea
                                    rows="4"
                                    className="form-control"
                                    id="remarks"
                                    name="remarks"
                                    placeholder="Remarks"
                                    value={CRMEnquiryForm.remarks}
                                    onChange={changeCRMForm}
                                    style={{ minHeight: "80px" }}
                                ></textarea>
                                <label htmlFor="remarks">{translation?.remarks || "Remarks"}</label>
                            </div>

                            {/* <button type="submit" className="btn btn-success">
                    Submit
                </button> */}
                        </form>
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-secondary" onClick={handleCloseModal}>
                {translation?.close || "Close"}
                </button>
                <Button variant="primary" onClick={SubmitCRMEnquiryData}>
                {translation?.submit || "Submit"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CRMEnquiry;
