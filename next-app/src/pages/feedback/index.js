import React from "react";
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
      <div className="text-center my-4 ">
        <h1 className="fw-bold">{translation?.feedback || "Feedback"}</h1>
        <p className="text-muted">
          {translation?.feedback_description || "We value your feedback! Let us know your thoughts below."}
        </p>
      </div>

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
          <Form className="authentication-form container mb-3" autoComplete="off">
            {/* Name Field */}
            <div className="form-floating mb-3">
              <Field type="text" id="name" className="form-control" placeholder="Name" name="name" />
              <label htmlFor="name">{translation?.name || "Name"}</label>
              <ErrorMessage name="name" component="div" className="text-danger" />
            </div>

            {/* Email Field */}
            <div className="form-floating mb-3">
              <Field type="email" id="email" className="form-control" placeholder="Email" name="email" />
              <label htmlFor="email">{translation?.email || "Email"}</label>
              <ErrorMessage name="email" component="div" className="text-danger" />
            </div>

            {/* Phone Number Field */}
            <div className="form-field">
              <div className="input-group mb-3">
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
              <ErrorMessage name="phone" component="div" className="text-danger" />
            </div>

            {/* Feedback Field (Textarea) */}
            <div className="form-floating mb-3">
              <Field as="textarea" id="feedback" className="form-control" placeholder="Your Feedback" name="feedback" style={{ height: "120px" }} />
              <label htmlFor="feedback">{translation?.feedback || "Your Feedback"}</label>
              <ErrorMessage name="feedback" component="div" className="text-danger" />
            </div>

            {/* Submit Button */}
            <div className="d-grid">
              <button type="submit" className="btn btn-primary mb-2" disabled={isSubmitting || !dirty}>
                {isSubmitting ? "Submitting..." : `${translation?.submit ||"Submit"}`}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </MainLayout>
  );
};

export default Feedback;
