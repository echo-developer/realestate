"use client"
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import useTranslation from "@/hooks/useTranslation";
import MainLayout from "@/components/layout/MainLayout";
import { Envelope, Phone } from "react-bootstrap-icons";
import { Button } from "react-bootstrap";

const ContactUs = () => {
  const translation = useTranslation();

  const validationSchema = Yup.object({
    name: Yup.string().required(
      translation?.name_is_required || "Name is required"
    ),
    email: Yup.string()
      .email(translation?.invalid_email || "Invalid email")
      .required(translation?.email_required || "Email is required"),
    phone: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be 10 digits")
      .required(translation?.phone_number || "phone number is required"),
    message: Yup.string().required(translation?.message_is_required || "Message is required"),
  });

  return (
    <MainLayout>
      {/* ✅ Top Header Section */}
      <section className="section pb-0">
      <div className="container">
        <div className="text-center mb-4">
          <h1 className="fw-bold">{translation?.contact_us || "Contact Us"}</h1>
          <p className="text-muted">
            {translation?.contact_description ||
              "Have questions? Get in touch with us by filling out the form below."}
          </p>
        </div>
        <div className="row">
          {/* Left Section: Contact Information */}
          <div className="col-md-6 d-flex align-items-center">
            <div>
              <h2 className="mb-4">
                {translation?.get_in_touch || "Get in Touch"}
              </h2>
              <p>
                {translation?.contact_description_1 ||
                  "Have questions? We're here to help! Fill out the form and our team will get back to you as soon as possible."}
              </p>
              <div className="row gx-3">
                <article className="col-6">
                  <div className="card text-center">
                    <div className="card-body">
                      <Envelope color="#1365CF" size={32} className="mb-2" />
                      <p title={translation?.email || "Email:"}>
                        support@example.com
                      </p>
                    </div>
                  </div>
                </article>
                <article className="col-6">
                <div className="card text-center">
                <div className="card-body">
                  <Phone color="#1365CF" size={32} className="mb-2" />
                  <p tittle={translation?.phone || "Phone:"}>
                    +1 234 567 890
                  </p>
                  </div>
                  </div>
                </article>
              </div>

            </div>
          </div>

          {/* Right Section: Form */}
          <div className="col-md-6">
            <Formik
              initialValues={{
                name: "",
                email: "",
                phone: "",
                phone_code: "+91",
                message: "",
              }}
              validationSchema={validationSchema}
              validateOnMount // This ensures validation runs even before submission
              onSubmit={(values, { setSubmitting, resetForm }) => {
                console.log("Form submitted:", values);
                setSubmitting(false);
                resetForm();
              }}
            >
              {({
                values,
                handleChange,
                handleBlur,
                isSubmitting,
                isValid,
                touched,
              }) => (
                <div className="card authentication-form">
                  <div className="card-body">
                    <Form autoComplete="off">
                      {/* Name Field */}
                      <div className="form-floating mb-3">
                        <Field
                          type="text"
                          id="name"
                          className="form-control"
                          placeholder="Name"
                          name="name"
                        />
                        <label htmlFor="name">{translation?.name || "Name"}</label>
                        <ErrorMessage
                          name="name"
                          component="div"
                          className="text-danger small"
                        />
                      </div>

                      {/* Email Field */}
                      <div className="form-floating mb-3">
                        <Field
                          type="email"
                          id="email"
                          className="form-control"
                          placeholder="Email"
                          name="email"
                        />
                        <label htmlFor="email">
                          {translation?.email || "Email"}
                        </label>
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="text-danger small"
                        />
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
                          <Field
                            type="text"
                            className="form-control"
                            placeholder={translation?.mobile_number ||"Mobile Number"}
                            name="phone"
                          />
                        </div>
                        <ErrorMessage
                          name="phone"
                          component="div"
                          className="text-danger small"
                        />
                      </div>

                      {/* Message Field (Textarea) */}
                      <div className="form-floating mb-3">
                        <Field
                          as="textarea"
                          id="message"
                          className="form-control"
                          placeholder="Message"
                          name="message"
                          style={{ height: "94px" }}
                        />
                        <label htmlFor="message">
                          {translation?.message || "Your Message"}
                        </label>
                        <ErrorMessage
                          name="message"
                          component="div"
                          className="text-danger small"
                        />
                      </div>

                      {/* Submit Button (Disabled if form is invalid or untouched) */}
                      <div className="d-grid">
                        <Button
                          type="submit"
                          variant="primary"                          
                          disabled={
                            isSubmitting || !isValid || !Object.keys(touched).length
                          }
                        >
                          {isSubmitting ? "Submitting..." : `${translation?. submit || "Submit"}`}
                        </Button>
                      </div>
                    </Form>
                  </div>
                </div>
              )}
            </Formik>
          </div>
        </div>
      </div>

      <div class="mt-5">  
        <iframe
          title="Google Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509374!2d144.95373531531662!3d-37.81627977975171!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d5df1f287f3%3A0x2b1b2076f5f3a5e3!2sReal+Estate+Office!5e0!3m2!1sen!2sus!4v1633326639282"
          width="100%"
          height="300"
          className="d-block"
          loading="lazy"
        ></iframe>
      </div>
    </section>  
    </MainLayout>
  );
};

export default ContactUs;
