"use client";
import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import AuthUser from "../Authentication/AuthUser";
import useTranslation from "@/hooks/useTranslation";
import { FloatingLabel, Button } from "react-bootstrap";

const EnquiryForm = ({ propertyId, handleClose, showPhoneNumber, displayPhoneNumber }) => {
  const translation = useTranslation();
  const { callApi, isLogin } = AuthUser();
  const [loading, setLoading] = useState(false);
  const token = isLogin();
  const [emailTimer, setEmailTimer] = useState(0);

  const validationSchema = Yup.object({
    name: Yup.string().required(translation?.name_is_required || "Name is required"),
    email: Yup.string()
      .email(translation?.invalid_email || "Invalid email format")
      .required(translation?.email_required || "Email is required"),
    phone: Yup.string()
      .matches(/^\d+$/, translation?.phone_number_must_be_digits_only || "Phone number must be digits only")
      .required(translation?.phone_number || "Phone number is required"),
    message: Yup.string().required(translation?.message_is_required || "Message is required"),
    otp: Yup.string().when("otpSent", {
      is: true,
      then: Yup.string().required(translation?.otp_is_required || "OTP is required"),
    }),
  });

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
        if (showPhoneNumber) displayPhoneNumber();
        toast.success("Enquiry sent successfully. You will be contacted soon.");
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
        initialValues={{ name: "", email: "", phone: "", message: "", otp: "" }}
        validationSchema={validationSchema}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          await submitFormData(values, resetForm);
          setSubmitting(false);
        }}
      >
        {({ errors, touched, setFieldValue, setFieldTouched, validateField }) => (
          <Form>
            {/* Name */}
            <FloatingLabel
              label={<>{translation?.name || "Name"} <span className="req">*</span></>}
              className="mb-3"
            >
              <Field name="name">
                {({ field }) => (
                  <input
                    type="text"
                    {...field}
                    className={`form-control ${errors.name && touched.name ? "is-invalid" : ""}`}
                    placeholder=" "
                    onChange={(e) => {
                      setFieldValue("name", e.target.value);
                      setFieldTouched("name", true, false);
                      validateField("name");
                    }}
                  />
                )}
              </Field>
              <ErrorMessage name="name" component="div" className="error-message text-danger" />
            </FloatingLabel>

            {/* Email */}
            <FloatingLabel
              label={<>{translation?.email || "Email"} <span className="req">*</span></>}
              className="mb-3"
            >
              <Field name="email">
                {({ field }) => (
                  <input
                    type="email"
                    {...field}
                    className={`form-control ${errors.email && touched.email ? "is-invalid" : ""}`}
                    placeholder=" "
                    onChange={(e) => {
                      setFieldValue("email", e.target.value);
                      setFieldTouched("email", true, false);
                      validateField("email");
                    }}
                  />
                )}
              </Field>
              <ErrorMessage name="email" component="div" className="error-message text-danger" />
            </FloatingLabel>

            {/* Phone */}
            <FloatingLabel
              label={<>{translation?.phone || "Phone"} <span className="req">*</span></>}
              className="mb-3"
            >
              <Field name="phone">
                {({ field }) => (
                  <input
                    type="text"
                    {...field}
                    className={`form-control ${errors.phone && touched.phone ? "is-invalid" : ""}`}
                    placeholder=" "
                    onChange={(e) => {
                      setFieldValue("phone", e.target.value);
                      setFieldTouched("phone", true, false);
                      validateField("phone");
                    }}
                  />
                )}
              </Field>
              <ErrorMessage name="phone" component="div" className="error-message text-danger" />
            </FloatingLabel>

            {/* Message */}
            <FloatingLabel
              label={<>{translation?.message || "Message"} <span className="req">*</span></>}
              className="mb-3"
            >
              <Field name="message">
                {({ field }) => (
                  <textarea
                    rows="3"
                    {...field}
                    className={`form-control ${errors.message && touched.message ? "is-invalid" : ""}`}
                    placeholder=" "
                    style={{ height: "100px" }}
                    onChange={(e) => {
                      setFieldValue("message", e.target.value);
                      setFieldTouched("message", true, false);
                      validateField("message");
                    }}
                  />
                )}
              </Field>
              <ErrorMessage name="message" component="div" className="error-message text-danger" />
            </FloatingLabel>

            <div className="d-grid">
              <Button variant="primary" type="submit">
                {loading ? "Sending..." : `${translation?.send || "Send"}`}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EnquiryForm;
