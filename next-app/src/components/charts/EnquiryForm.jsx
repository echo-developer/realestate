"use client";
import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import AuthUser from "../Authentication/AuthUser";

// Validation schema for the form
const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
  mobile: Yup.string().matches(/^\d+$/, "Mobile number must be digits only").required("Mobile number is required"),
  message: Yup.string().required("Message is required"),
  otp: Yup.string().when('$otpSent', {
    is: true,
    then: Yup.string().required("OTP is required")
  }),
});

const EnquiryForm = ({ propertyId, setPropertyid, setShow }) => {
  const { callApi, isLogin } = AuthUser();
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  
  const token = isLogin();

  const sendOtp = async (mobile) => {
    setLoading(true);
    try {
      const response = await callApi({
        api: `/send-otp`,
        method: "POST",
        data: { mobile },
      });
      if (response) {
        setOtpSent(true);
        toast.success("OTP sent successfully!");
      } else {
        console.error("Failed to send OTP:", response.message || "Unknown error");
      }
    } catch (error) {
      toast.error("An error occurred while sending the OTP");
      console.error("An error occurred while sending the OTP:", error);
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP function
  const VerifyOtp = async (otp) => {
    setLoading(true);
    try {
      const response = await callApi({
        api: `/verify-otp`,
        method: "POST",
        data: { otp },
      });

      if (response) {
        setOtpSent(false);
        toast.success("OTP verified successfully!");
        return true; 
      } else {
        toast.error("Invalid OTP");
        return false;
      }
    } catch (error) {
      toast.error("An error occurred while verifying the OTP");
      console.error("An error occurred while verifying the OTP:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const submitFormData = async (values, resetForm) => {
    setLoading(true);
    try {
      const data = {
        propertyId: propertyId,
        data: values,
      };
      if (!token) {
        data.user_type = 'customer'; 
      }

      const response = await callApi({
        api: token ? `/seller_enquiry` : `/insert_property_enquiry_without_login`,
        method: "POST",
        data: data,
      });

      if (response) {
        setShow(false);
        setPropertyid("");
        resetForm(); 
        toast.success("Form submitted successfully!");
      } else {
        toast.error("Form submission failed:", response.message || "Unknown error");
      }
    } catch (error) {
      toast.error("An error occurred while submitting the form");
      console.error("An error occurred while submitting the form:", error);
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
          mobile: "",
          message: "",
          otp: "",
        }}
        validationSchema={validationSchema}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          if (otpSent && !token) {
            const otpVerified = await VerifyOtp(values.otp);
            if (otpVerified) {
              await submitFormData(values, resetForm);
            }
          } else {
            await submitFormData(values, resetForm);
          }
          setSubmitting(false);
        }}
      >
        {({ isSubmitting, values }) => (
          <Form>
            {!otpSent ? (
              <>
                <div className="floating-label-group">
                  <Field
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder=" "
                  />
                  <label className="floating-label">
                    Name <span className="req">*</span>
                  </label>
                  <ErrorMessage name="name" component="div" className="error-message" />
                </div>
                <div className="floating-label-group">
                  <Field
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder=" "
                  />
                  <label className="floating-label">
                    Email <span className="req">*</span>
                  </label>
                  <ErrorMessage name="email" component="div" className="error-message" />
                </div>
                <div className="row">
                  <div className="col-lg-9 col-sm-9">
                    <div className="floating-label-group">
                      <Field
                        type="text"
                        name="mobile"
                        className="form-control"
                        placeholder=" "
                      />
                      <label className="floating-label">Mobile</label>
                      <ErrorMessage name="mobile" component="div" className="error-message" />
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-3">
                    {!token && values.mobile && (
                      <div className="d-flex">
                        <button
                          type="button"
                          className="btn btn-site"
                          onClick={() => sendOtp(values.mobile)}
                          disabled={loading}
                        >
                          {loading ? "Sending OTP..." : "Send OTP"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="floating-label-group">
                  <Field
                    as="textarea"
                    rows="3"
                    name="message"
                    className="form-control"
                    placeholder=" "
                  />
                  <label className="floating-label">
                    Message <span className="req">*</span>
                  </label>
                  <ErrorMessage name="message" component="div" className="error-message" />
                </div>
              </>
            ) : (
              !token && (
                <div className="row">
                  <div className="col-lg-9 col-sm-9">
                    <div className="floating-label-group">
                      <Field
                        type="text"
                        name="otp"
                        className="form-control"
                        placeholder=" "
                      />
                      <label className="floating-label">OTP</label>
                      <ErrorMessage name="otp" component="div" className="error-message" />
                    </div>
                  </div>
                  <div className="col-lg-3 col-sm-3 mb-3">
                    <button
                      type="button"
                      className="btn btn-site"
                      onClick={() => VerifyOtp(values.otp)}
                      disabled={loading}
                    >
                      {loading ? "Verifying OTP..." : "Verify OTP"}
                    </button>
                  </div>
                </div>
              )
            )}

            <div className="d-grid">
              <button type="submit" className="btn btn-site" disabled={isSubmitting || loading}>
                {loading ? "Sending..." : "Send"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EnquiryForm;
