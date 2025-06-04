"use client";
import React, { useState, useEffect, useRef } from "react";
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
  const formRef = useRef();
  const nameInputRef = useRef();
  const emailInputRef = useRef();
  const phoneInputRef = useRef();

  const validationSchema = Yup.object({
    name: Yup.string().required(translation?.name_is_required || "Name is required"),
    email: Yup.string()
      .email(translation?.invalid_email || "Invalid email format")
      .required(translation?.email_required || "Email is required"),
    phone: Yup.string()
      .matches(/^\d+$/, translation?.phone_number_must_be_digits_only || "Phone number must be digits only")
      .required(translation?.phone_number || "Phone number is required"),
    message: Yup.string().required(translation?.message_is_required || "Message is required"),
  });

  // Handle auto-fill with mutation observer
  useEffect(() => {
    const checkAutoFill = () => {
      if (nameInputRef.current?.value) {
        nameInputRef.current.dispatchEvent(new Event('input', { bubbles: true }));
      }
      if (emailInputRef.current?.value) {
        emailInputRef.current.dispatchEvent(new Event('input', { bubbles: true }));
      }
      if (phoneInputRef.current?.value) {
        phoneInputRef.current.dispatchEvent(new Event('input', { bubbles: true }));
      }
    };

    // Initial check after a small delay
    const timer = setTimeout(checkAutoFill, 200);

    // Setup mutation observer to detect changes
    const observer = new MutationObserver(checkAutoFill);
    if (formRef.current) {
      observer.observe(formRef.current, {
        attributes: true,
        childList: true,
        subtree: true,
        characterData: true
      });
    }

    // Also check on window load
    window.addEventListener('load', checkAutoFill);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
      window.removeEventListener('load', checkAutoFill);
    };
  }, []);

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
        initialValues={{ name: "", email: "", phone: "", message: "" }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          await submitFormData(values, resetForm);
          setSubmitting(false);
        }}
      >
        {({ errors, touched, handleChange, handleBlur, values }) => (
          <Form ref={formRef}>
            {/* Name */}
            <FloatingLabel
              label={<>{translation?.name || "Name"} <span className="req">*</span></>}
              className="mb-3"
            >
              <Field 
                name="name"
                innerRef={nameInputRef}
                type="text"
                className={`form-control ${errors.name && touched.name ? "is-invalid" : ""}`}
                placeholder=" "
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.name}
              />
              <ErrorMessage name="name" component="div" className="error-message text-danger" />
            </FloatingLabel>

            {/* Email */}
            <FloatingLabel
              label={<>{translation?.email || "Email"} <span className="req">*</span></>}
              className="mb-3"
            >
              <Field
                name="email"
                innerRef={emailInputRef}
                type="email"
                className={`form-control ${errors.email && touched.email ? "is-invalid" : ""}`}
                placeholder=" "
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
              />
              <ErrorMessage name="email" component="div" className="error-message text-danger" />
            </FloatingLabel>

            {/* Phone */}
            <FloatingLabel
              label={<>{translation?.phone || "Phone"} <span className="req">*</span></>}
              className="mb-3"
            >
              <Field
                name="phone"
                innerRef={phoneInputRef}
                type="text"
                className={`form-control ${errors.phone && touched.phone ? "is-invalid" : ""}`}
                placeholder=" "
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.phone}
              />
              <ErrorMessage name="phone" component="div" className="error-message text-danger" />
            </FloatingLabel>

            {/* Message */}
            <FloatingLabel
              label={<>{translation?.message || "Message"} <span className="req">*</span></>}
              className="mb-3"
            >
              <Field
                name="message"
                as="textarea"
                rows="3"
                className={`form-control ${errors.message && touched.message ? "is-invalid" : ""}`}
                placeholder=" "
                style={{ height: "100px" }}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.message}
              />
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