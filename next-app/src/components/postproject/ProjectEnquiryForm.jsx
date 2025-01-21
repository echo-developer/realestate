"use client";
import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import AuthUser from "../Authentication/AuthUser";

// Validation schema for the form
const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    phone: Yup.string()
        .matches(/^\d+$/, "Phone number must be digits only")
        .required("Phone number is required"),
    message: Yup.string().required("Message is required"),
    otp: Yup.string().when("otpSent", {
        is: true,
        then: Yup.string().required("OTP is required"),
    }),
});

const ProjectEnquiryForm = ({ propertyId, handleClose }) => {
    const { callApi, isLogin } = AuthUser();
    const [loading, setLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [phone, setPhone] = useState("");

    const token = isLogin();

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
                propertyId,
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
                toast.success(response.message || "Enquiry sent successfully.");
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
                        {/* Name */}
                        <div className="floating-label-group">
                            <label className="floating-label">
                                Name <span className="req">*</span>
                            </label>
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
                        </div>

                        {/* Email */}
                        <div className="floating-label-group">
                            <label className="floating-label">
                                Email <span className="req">*</span>
                            </label>
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
                        </div>

                        {/* Phone */}
                        <div className="row">
                            <div className="col-lg-9 col-sm-9">
                                <div className="floating-label-group">
                                    <label className="floating-label">
                                        Phone <span className="req">*</span>
                                    </label>
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
                                </div>
                            </div>

                            {/* Send OTP button */}
                            {!token && (
                                <div className="col-lg-3 col-sm-3 p-2 mt-3">
                                    {values.phone && !otpVerified && (
                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            onClick={() => {
                                                sendOtp(values.phone);
                                                setPhone(values.phone);
                                            }}
                                            disabled={loading || otpSent}
                                        >
                                            {loading ? "Sending OTP..." : "Send OTP"}
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Message */}
                        <div className="floating-label-group mb-3">
                            <label className="floating-label">
                                Message <span className="req">*</span>
                            </label>
                            <Field
                                as="textarea"
                                rows="3"
                                name="message"
                                className="form-control"
                                placeholder=" "
                            />
                            <ErrorMessage
                                name="message"
                                component="div"
                                className="error-message"
                            />
                        </div>

                        {/* OTP verification */}
                        {!token && otpSent && !otpVerified && (
                            <div className="row">
                                <div className="col-lg-9 col-sm-9">
                                    <div className="floating-label-group">
                                        <label className="floating-label">
                                            OTP
                                        </label>
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
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-3 p-3">
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={() => verifyOtp(values.otp)}
                                        disabled={loading}
                                    >
                                        {loading ? "Verifying..." : "Verify OTP"}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Submit button */}
                        <div className="d-grid">
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={
                                    isSubmitting ||
                                    loading ||
                                    (!token && !otpVerified)
                                }
                            >
                                {loading ? "Sending..." : "Send Enquiry"}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default ProjectEnquiryForm;
