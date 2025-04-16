"use client"
import React, { useState, useEffect} from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import useTranslation from "@/hooks/useTranslation";
import MainLayout from "@/components/layout/MainLayout";

const Feedback = () => {
  const translation = useTranslation();

  const validationSchema = Yup.object({
    name: Yup.string().required(translation?.name_is_required || "Name is required"),
    email: Yup.string().email(translation?.invalid_email || "Invalid email").required(translation?.email_required || "Email is required"),
    phone: Yup.string().matches(/^\d{10}$/, "Phone number must be 10 digits").required(translation?.phone_number || "phone number is required"),
    feedback: Yup.string().required(translation?.feedback_is_required || "Feedback is required"),
  });

  return (
    <MainLayout>
      {/* ✅ Feedback Heading */}
      <div className="short-banner">
        <div className="container">
          <h1 className="mb-0 text-center fw-bold">{translation?.feedback || "Feedback"}</h1>
        </div>
      </div>
      <section className="section">
        <div className="container">
          <div className="row justify-content-center">
            <aside className="col-xl-6 col-lg-8 col-12">
              <Formik
                initialValues={{
                  name: "",
                  email: "",
                  phone: "",
                  phone_code: "+91",
                  feedback: "",
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  setSubmitting(false);
                  resetForm();
                }}
              >
                
                    {({ values, handleChange, handleBlur, isSubmitting, dirty }) => (
                      <div className="card authentication-form">
                        <div className="card-body">
                          <p className="text-muted">{translation?.feedback_description || "We value your feedback! Let us know your thoughts below."}</p>
                          <Form className="" autoComplete="off">
                            {/* Name Field */}
                            <div className="form-floating mb-3">
                              <Field type="text" id="name" className="form-control" placeholder="Name" name="name" />
                              <label htmlFor="name">{translation?.name || "Name"}</label>
                              <ErrorMessage name="name" component="div" className="text-danger small" />
                            </div>

                            {/* Email Field */}
                            <div className="form-floating mb-3">
                              <Field type="email" id="email" className="form-control" placeholder="Email" name="email" />
                              <label htmlFor="email">{translation?.email || "Email"}</label>
                              <ErrorMessage name="email" component="div" className="text-danger small" />
                            </div>

                            {/* Phone Number Field */}
                            <div className="form-field mb-3">
                              <div className="input-group">
                                <select
                                  className="form-control"
                                  style={{ maxWidth: "80px" }}
                                  name="phone_code"
                                  value={values.phone_code}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                >
                                  <option value="+91">+91</option>
                                  <option value="+71">+71</option>
                                  <option value="+81">+81</option>
                                  <option value="+30">+30</option>
                                </select>
                                <Field type="text" className="form-control" placeholder={translation?.mobile_number ||"Mobile Number"} name="phone" />
                              </div>
                              <ErrorMessage name="phone" component="div" className="text-danger small" />
                            </div>

                            {/* Feedback Field (Textarea) */}
                            <div className="form-floating mb-3">
                              <Field as="textarea" id="feedback" className="form-control" placeholder="Your Feedback" name="feedback" style={{ height: "120px" }} />
                              <label htmlFor="feedback">{translation?.feedback || "Your Feedback"}</label>
                              <ErrorMessage name="feedback" component="div" className="text-danger small" />
                            </div>

                            {/* Submit Button */}
                            <div className="d-grid">
                              <button type="submit" className="btn btn-primary mb-2" disabled={isSubmitting || !dirty}>
                                {isSubmitting ? "Submitting..." : `${translation?.submit ||"Submit"}`}
                              </button>
                            </div>
                          </Form>
                        </div>
                      </div>
                    )}
                  
              </Formik>
            </aside>
          </div>
        </div>
      </section>

    </MainLayout>
  );
};

export default Feedback;
