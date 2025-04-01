import { Modal, Button, Alert } from "react-bootstrap";
import { useState } from "react";
import AuthUser from "../Authentication/AuthUser";

function ContactModal({ show, handleClose, phone, email, submitHandler }) {
    const { } = AuthUser();
    // Form states
    const [formData, setFormData] = useState({
        remark_type: "",
        is_schedule: 0,
        schedule_date: "",
        remarks: ""
    });

    // Contact button states
    const [showCallButton, setShowCallButton] = useState(true);
    const [showEmailButton, setShowEmailButton] = useState(true);
    const [callInfo, setCallInfo] = useState(null);
    const [emailInfo, setEmailInfo] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRadioChange = (e) => {
        setFormData(prev => ({
            ...prev,
            is_schedule: e.target.id === "schedule-yes" ? 1 : 0
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        submitHandler(formData);
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Contact Now</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <div className="d-flex justify-content-between mb-3">
                    {/* Call Button Section */}
                    <div className="text-center" style={{ width: "48%" }}>
                        {showCallButton ? (
                            <Button 
                                variant="outline-primary" 
                                onClick={() => {
                                    setCallInfo(phone ? `📞 ${phone}` : "Not Available");
                                    setShowCallButton(false);
                                }}
                                className="w-100"
                            >
                                📞 Call
                            </Button>
                        ) : (
                            <Alert variant="info" className="mb-0 p-2 text-center">
                                {callInfo}
                            </Alert>
                        )}
                    </div>

                    {/* Email Button Section */}
                    <div className="text-center" style={{ width: "48%" }}>
                        {showEmailButton ? (
                            <Button 
                                variant="outline-primary" 
                                onClick={() => {
                                    setEmailInfo(email ? `✉️ ${email}` : "Not Available");
                                    setShowEmailButton(false);
                                }}
                                className="w-100"
                            >
                                ✉️ Email
                            </Button>
                        ) : (
                            <Alert variant="info" className="mb-0 p-2 text-center">
                                {emailInfo}
                            </Alert>
                        )}
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Contact Status Select */}
                    <div className="mb-3">
                        <label htmlFor="remark_type" className="form-label">
                            Contact Status
                        </label>
                        <select 
                            className="form-select" 
                            id="remark_type"
                            name="remark_type"
                            value={formData.remark_type}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select an option</option>
                            <option value="not-interested">Not Interested</option>
                            <option value="call-not-received">Call Not Received</option>
                            <option value="not-connected">Not Connected</option>
                            <option value="interested">Interested</option>
                        </select>
                    </div>

                    {/* Schedule Option */}
                    <div className="mb-3">
                        <strong>Do you want to schedule?</strong>
                        <div className="form-check">
                            <input
                                type="radio"
                                className="form-check-input"
                                name="schedule"
                                id="schedule-no"
                                checked={formData.is_schedule === 0}
                                onChange={handleRadioChange}
                            />
                            <label className="form-check-label" htmlFor="schedule-no">
                                No
                            </label>
                        </div>
                        <div className="form-check">
                            <input
                                type="radio"
                                className="form-check-input"
                                name="schedule"
                                id="schedule-yes"
                                checked={formData.is_schedule === 1}
                                onChange={handleRadioChange}
                            />
                            <label className="form-check-label" htmlFor="schedule-yes">
                                Yes
                            </label>
                        </div>
                    </div>

                    {/* Scheduled Date & Time */}
                    {formData.is_schedule === 1 && (
                        <div className="mb-3">
                            <label htmlFor="schedule_date" className="form-label">
                                Scheduled Date & Time
                            </label>
                            <input 
                                type="datetime-local" 
                                className="form-control" 
                                id="schedule_date"
                                name="schedule_date"
                                value={formData.schedule_date}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    )}

                    {/* Feedback */}
                    <div className="mb-3">
                        <label htmlFor="remarks" className="form-label">
                            Please leave your feedback
                        </label>
                        <textarea 
                            className="form-control" 
                            id="remarks" 
                            name="remarks"
                            rows="3"
                            value={formData.remarks}
                            onChange={handleInputChange}
                        ></textarea>
                    </div>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal.Body>
        </Modal>
    );
}

export default ContactModal;