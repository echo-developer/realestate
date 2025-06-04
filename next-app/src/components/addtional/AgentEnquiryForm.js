"use client";
import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import AuthUser from "../Authentication/AuthUser";
import useTranslation from "@/hooks/useTranslation";
import { Row, Col, FloatingLabel, Button } from "react-bootstrap";
import { useRouter } from "next/navigation";

const AgentEnquiryForm = ({ agentId, handleClose, callSuccessfuntion }) => {
  const router = useRouter();
  const translation = useTranslation();
  const { callApi, isLogin } = AuthUser();
  const [loading, setLoading] = useState(false);
  const token = isLogin();

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

  const submitFormData = async (values, resetForm) => {
    setLoading(true);
    try {
      const data = {
        agent_id: agentId,
        name: values.name,
        email: values.email,
        phone: values.phone,
        message: values.message,
      };

      if (!token) {
        data.user_type = "customer";
      }

      const response = await callApi({
        api: `/buyer_property_enquery`,
        method: "UPLOAD",
        data,
      });

      if (response && response.status === 1) {
        handleClose();
        resetForm();
        toast.success(response.message || "Enquiry Sent Successfully");
        callSuccessfuntion();
      }
    } catch (error) {
      toast.error("Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Formik
        initialValues={{ name: "", email: "", phone: "", message: "" }}
        validationSchema={validationSchema}
        validateOnChange={true}
        validateOnBlur={true}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          await submitFormData(values, resetForm);
          setSubmitting(false);
        }}
      >
        {({ errors, touched, handleChange, handleBlur }) => (
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
                className={`form-control ${errors.name && touched.name ? "is-invalid" : ""}`}
                placeholder=" "
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage name="name" component="div" className="error-message text-danger" />
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
                className={`form-control ${errors.email && touched.email ? "is-invalid" : ""}`}
                placeholder=" "
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage name="email" component="div" className="error-message text-danger" />
            </FloatingLabel>

            {/* Phone */}
            <Row className="gx-3">
              <Col>
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
                    className={`form-control ${errors.phone && touched.phone ? "is-invalid" : ""}`}
                    placeholder=" "
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <ErrorMessage name="phone" component="div" className="error-message text-danger" />
                </FloatingLabel>
              </Col>
            </Row>

            {/* Message */}
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
                name="message"
                rows="3"
                className={`form-control ${errors.message && touched.message ? "is-invalid" : ""}`}
                placeholder=" "
                style={{ height: "100px" }}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage name="message" component="div" className="error-message text-danger" />
            </FloatingLabel>

            {/* Submit Button */}
            <div className="d-grid">
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? "Sending..." : translation?.send || "Send"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AgentEnquiryForm;
