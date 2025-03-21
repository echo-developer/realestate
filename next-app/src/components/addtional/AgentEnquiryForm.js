"use client";
import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import AuthUser from "../Authentication/AuthUser";
import useTranslation from "@/hooks/useTranslation";
import {
    Row,
    Col,
    FloatingLabel,
    Button
} from "react-bootstrap";
import { useRouter } from "next/navigation";

const AgentEnquiryForm = ({agentId,handleClose }) => {
    const router=useRouter();
    const translation = useTranslation();
    const { callApi, isLogin } = AuthUser();
    const [loading, setLoading] = useState(false);
    const [phone, setPhone] = useState();
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const token = isLogin();


    // Validation schema for the form
const validationSchema = Yup.object({
    
    name: Yup.string().required(translation?.name_is_required || "Name is required"),
    email: Yup.string()
    .email(translation?.invalid_email || "Invalid email format")
    .required(translation?.email_required || "Email is required"),
    phone: Yup.string()
        .matches(/^\d+$/,translation?.phone_number_must_be_digits_only || "phone number must be digits only")
        .required(translation?.phone_number || "phone number is required"),
    message: Yup.string().required(translation?.message_is_required || "Message is required"),
    otp: Yup.string().when("otpSent", {
        is: true,
        then: Yup.string().required(translation?.otp_is_required|| "OTP is required"),
    }),
});

    const sendOtp = async (phone) => {
        setLoading(true);
        try {
            const response = await callApi({
                api: `/send-otp`,
                method: "UPLOAD",
                data: { phone },
            });
            if (response) {
                setOtpSent(true);
                toast.success("OTP sent successfully!");
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
                data: { otp, phone },
            });

            if (response) {
                setOtpVerified(true);
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

    const submitFormData = async (values, resetForm) => {
        setLoading(true);
        try {

            const data = {
                agent_id:agent_id,
                name: values.name,
                email: values.email,
                phone: values.phone,
                message: values.message,
            };


            if (!token) {
                data.user_type = "customer";
            }


            const response = await callApi({
                api: `/add_property_enquery`,
                method: "UPLOAD",
                data,
            });

            if (response && response.status === 1) {
                handleClose();
                resetForm();
                toast.success(response.message || "Enquiry Send Success");
            } else {
                toast.error(response.message || "Form submission failed.");
            }
        } catch (error) {
            toast.error("An error occurred while submitting the form");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div>
            <Formik
                initialValues={{
                    name: "",
                    email: "",
                    phone: "",
                    message: "",
                    otp: "",
                }}
                validationSchema={validationSchema}
                validateOnChange={false}
                validateOnBlur={false}
                onSubmit={async (values, { setSubmitting, resetForm }) => {
                    if (!token && !otpVerified) {
                        toast.error("Please verify the OTP first.");
                    } else {
                        await submitFormData(values, resetForm);
                    }
                    setSubmitting(false);
                }}
            >
                {({ isSubmitting, values }) => (
                    <Form>
                        {/* Form fields */}
                        <FloatingLabel
                            label={
                                <>
                                    {translation?.name || "Name"} <span className="req">*</span>
                                </>
                            }
                            className="mb-3"
                        >
                            <Field
                                type="text"
                                name="name"
                                className="form-control"
                                placeholder=" "
                            />
                            <ErrorMessage
                                name="name"
                                component="div"
                                className="error-message"
                            />

                        </FloatingLabel>

                        <FloatingLabel
                            label={
                                <>
                                    {translation?.email || "Email"} <span className="req">*</span>
                                </>
                            }
                            className="mb-3"
                        >                                                                                                                            
                            <Field
                                type="email"
                                name="email"
                                className="form-control"
                                placeholder=" "
                            />
                            <ErrorMessage
                                name="email"
                                component="div"
                                className="error-message"
                            />
                        </FloatingLabel>

                        <Row className="gx-3">
                            <Col>
                                <FloatingLabel
                                    label={
                                        <>
                                            {translation?.phone || "Phone"}  <span className="req">*</span>
                                        </>
                                    }
                                    className="mb-3"
                                >  
                                    <Field
                                        type="text"
                                        name="phone"
                                        className="form-control"
                                        placeholder=" "
                                    />
                                    <ErrorMessage
                                        name="phone"
                                        component="div"
                                        className="error-message"
                                    />
                                </FloatingLabel>
                            </Col>
                            {!token && (                                
                                <Col className="col-auto mt-1">
                                    {values.phone && !otpVerified && (
                                        <Button variant="primary"
                                            onClick={() => {
                                                sendOtp(values.phone);
                                                setPhone(values.phone);
                                            }}
                                            disabled={loading || otpSent}
                                        >
                                            {loading
                                                ? "sending otp..."
                                                : "send otp"}
                                        </Button>
                                    )}
                                </Col>
                            )}
                        </Row>
                        <FloatingLabel
                            label={
                                <>
                                    {translation?.message || "Message"} <span className="req">*</span>
                                </>
                            }
                            className="mb-3"
                        >                            
                            <Field
                                as="textarea"
                                rows="3"
                                name="message"
                                className="form-control"
                                placeholder=""
                                style={{ height: '100px' }}
                            />
                            <ErrorMessage
                                name="message"
                                component="div"
                                className="error-message"
                            />
                        </FloatingLabel>
                        
                        {/* OTP verification */}
                        {!token && otpSent && !otpVerified && (
                            
                            <Row className="gx-3">
                                <Col>
                                    <FloatingLabel
                                        label={translation?.otp || "OTP"}
                                        className="mb-3"
                                    >                                        
                                        <Field
                                            type="text"
                                            name="otp"
                                            className="form-control"
                                            placeholder=" "
                                        />
                                        <ErrorMessage
                                            name="otp"
                                            component="div"
                                            className="error-message"
                                        />
                                    </FloatingLabel>
                                </Col>
                                <Col className="col-auto mt-1">
                                    <Button variant="primary"
                                        onClick={() => verifyOtp(values.otp)}
                                        disabled={loading}
                                    >
                                        {loading ? "Verifying..." : "Verify OTP"}
                                    </Button>
                                </Col>                                                                
                            </Row>
                            
                        )}
                        {/* Submit button */}
                        <div className="d-grid">
                            <Button variant="primary"
                                type="submit"
                                disabled={
                                    isSubmitting ||
                                    loading ||
                                    (!token && !otpVerified)
                                }
                            >
                                {loading ? "Sending..." : `${translation?.send || "Send"}`}
                            </Button>                            
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default AgentEnquiryForm;
