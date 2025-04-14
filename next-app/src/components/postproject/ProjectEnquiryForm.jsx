"use client";
import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import AuthUser from "../Authentication/AuthUser";
import useTranslation from "@/hooks/useTranslation";
import { Row, Col, FloatingLabel, Button } from "react-bootstrap";

// Validation schema for the form
const ProjectEnquiryForm = ({ projectId, handleClose }) => {
  const { callApi, isLogin } = AuthUser();
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [phone, setPhone] = useState("");
  const [otpvalidate, setOtpValidate] = useState(false);
  const translation = useTranslation();
  const token = isLogin();
  const [emailTimer, setEmailTimer] = useState(0);
  const [emailValue, setEmailValue] = useState();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [emailvalidate, setEmailValidate] = useState(false);
  const [showOTPField, setShowOTPField] = useState(false);
  

  useEffect(() => {
    let interval = null;

    if (emailTimer > 0) {
      interval = setInterval(() => {
        setEmailTimer((prev) => prev - 1);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [emailTimer]);

  const validationSchema = Yup.object({
    name: Yup.string().required(
      translation?.name_is_required || "Name is required"
    ),
    email: Yup.string()
      .email(translation?.invalid_email || "Invalid email format")
      .required(translation?.email_required || "Email is required"),
    phone: Yup.string()
      .matches(
        /^\d+$/,
        translation?.phone_number_must_be_digits_only ||
          "phone number must be digits only"
      )
      .required(translation?.phone_number || "phone number is required"),
    message: Yup.string().required(
      translation?.message_is_required || "Message is required"
    ),
    otp: Yup.string().when("otpSent", {
      is: true,
      then: Yup.string().required(
        translation?.otp_is_required || "OTP is required"
      ),
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

  const handleSendOTP = async (email) => {
    let response;
    if (!email) return;
    setEmailTimer(60);
    setEmailValue(email);
    try {
      response = await callApi({
        api: `/send_otp_to_verify_email`,
        method: "UPLOAD",
        data: {
          email: email,
        },
      });
      if (response) {
        setEmailValidate(true);
        setShowOTPField(true);
        toast.success(response?.message || "OTP Send Successfully");
      } else {
        toast.error(response?.message || "OTP Send Failed");
      }
    } catch (error) {
      toast.error(response?.message || "Data Not Found");
    }
  };

  const handleOtpChange = (e, index) => {
    const value = e.target.value.replace(/\D/, ""); // Only digits

    const newOtp = [...otp];
    newOtp[index] = value; // Even if value is empty, we want to allow it
    setOtp(newOtp);

    // Move to next input if a digit is typed
    if (value && index < otp.length - 1) {
      const next = document.querySelector(`input[name='otp-${index + 1}']`);
      if (next) next.focus();
    }

    // Auto verify only if all fields are filled
    if (newOtp.every((digit) => digit !== "")) {
      handleVerifyOTP(newOtp.join(""));
    }
  };

  const handleVerifyOTP = async (values) => {
    let response;
    try {
      response = await callApi({
        api: `/verify_email`,
        method: "UPLOAD",
        data: {
          email: emailValue,
          otp: values,
        },
      });
      if (response && response?.status === 1) {
        setOtpValidate(true);
        toast.success(response?.message || "Verify OTP Successfully");
      } else {
        toast.error(response?.message || "Verify OTP Failed");
      }
    } catch (error) {
      toast.error(response?.message || "Data Not Found");
    }
  };

  const submitFormData = async (values, resetForm) => {
    setLoading(true);
    try {
      const data = {
        projectID: projectId,
        name: values.name,
        email: values.email,
        phone: values.phone,
        message: values.message,
      };

      if (!token) {
        data.user_type = "customer";
      }

      const response = await callApi({
        api: `/add_project_enquery`,
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
          await submitFormData(values, resetForm);
          setSubmitting(false);
        }}
      >
        {({ isSubmitting, values }) => (
          <Form>
            {/* Name */}
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
                placeholder=""
              />
              <ErrorMessage
                name="name"
                component="div"
                className="error-message text-danger"
              />
            </FloatingLabel>

            {/* Email */}
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
                className="error-message text-danger"
              />

              {!token &&  values?.email && (
                <button
                  type="button"
                  className="btn btn-primary position-absolute end-0 top-50 translate-middle-y me-2"
                  onClick={() => handleSendOTP(values.email)}
                  disabled={emailTimer > 0}
                >
                  {emailTimer > 0
                    ? `${translation?.resend_in || "Resend in"} ${emailTimer}s`
                    : translation?.send_otp || "Send OTP"}
                </button>
              )}
            </FloatingLabel>

            {!token && showOTPField && (
              <div className="d-flex gap-2 justify-content-between mb-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    name={`otp-${index}`}
                    value={digit}
                    onChange={(e) => handleOtpChange(e, index)}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && !otp[index] && index > 0) {
                        const prev = document.querySelector(
                          `input[name='otp-${index - 1}']`
                        );
                        if (prev) prev.focus();
                      }
                    }}
                    className="form-control text-center"
                    style={{
                      height: "50px",
                      fontSize: "20px",
                    }}
                    aria-label={`OTP Digit ${index + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Phone */}
            <FloatingLabel
              label={
                <>
                  {translation?.phone || "Phone"} <span className="req">*</span>
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
                className="error-message text-danger"
              />
            </FloatingLabel>

            {/* Message */}
            <FloatingLabel
              label={
                <>
                  {translation?.message || "Message"}{" "}
                  <span className="req">*</span>
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
                style={{ height: "100px" }}
              />
              <ErrorMessage
                name="message"
                component="div"
                className="error-message text-danger"
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
                      className="error-message text-danger"
                    />
                  </FloatingLabel>
                </Col>
                <Col className="col-auto mt-1">
                  <Button
                    variant="primary"
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
              <Button
                variant="primary"
                type="submit"
                // disabled={isSubmitting || loading || otpvalidate}
              >
                {loading
                  ? "Sending..."
                  : `${translation?.send_enquiry || "Send Enquiry"}`}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ProjectEnquiryForm;
