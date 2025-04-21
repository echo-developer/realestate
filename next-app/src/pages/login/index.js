"use client"
import React, { useState, useEffect } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import AuthUser from "@/components/Authentication/AuthUser";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";
import { Helmet } from "react-helmet-async";
import useTranslation from "@/hooks/useTranslation";
import LoginHeader from "@/components/addtional/LoginHeader";

const Index = () => {
const router = useRouter();
const { saveToken } = AuthUser();
const translation = useTranslation();
const [passwordType, setPasswordType] = useState("password");
const togglePassword = () => {
  setPasswordType(passwordType === "password" ? "text" : "password");
};
const { callApi } = AuthUser();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email(translation?.invalid_email || "Invalid email format")
      .required(translation?.email_required || "Email is required"),
    password: Yup.string()
      .required(translation?.password_required || "Password is required")
      .min(6, translation?.password_min_length || "Password must be at least 6 characters"),
  });


  const handleSubmit = async (values, { setFieldError }) => {
    try {
      const response = await callApi({
        api: `/login`,
        method: "POST",
        data: values,
      });

      if (response && response.status === 1) {
       
        saveToken(response?.authorisation?.token);
        // toast.success(response.message || "User Login Successfully"); 
        router.push("/dashboard");
      } else {
        // toast.error(response.message || "Invalid Credential");
        setFieldError("password", response.message || "Invalid Credential");
      }
    } catch (error) {
      toast.error(response.message || "Data Not Found");
    }
  };

  return (

    <>
      <LoginHeader/>
      <section className="section authentication-page">
        <Helmet>
          <title>Login to RealEstate | Access Your Property Dashboard</title>
          <meta
            name="description"
            content="Login to your RealEstate account to manage property listings, track investments, and access personalized recommendations."
          />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Helmet>

        <div className="container h-100">
          <div className="d-flex justify-content-center align-items-center h-100">
            <div className="authentication-container mx-auto w-100 bg-primary">
              <div className="row justify-content-center align-items-center">
                <aside className="col-lg-6 col-12 text-white d-none d-lg-block">
                  <img
                    src="/assets/images/authentication.png"
                    alt="Authentication"
                    className="img-fluid auth"
                  />
                  <h1> {translation?.welcome || "Welcome!"}</h1>
                  <h4>
                    {" "}
                    {translation?.things_you_can_do ||
                      "Things you can do with this account"}
                  </h4>
                  <ul className="list list-1 list-get">
                    <li>
                      {" "}
                      {translation?.post_property ||
                        "Post Property for FREE"}
                    </li>
                    <li>
                      {" "}
                      {translation?.set_alerts ||
                        "Set property alerts for your requirement"}
                    </li>
                    <li>
                      {translation?.access_buyers ||
                        "Get accessed by over 1 Lakh buyers"}
                    </li>
                    <li>
                      {translation?.showcase_property ||
                        "Showcase your property as Rental, PG or for Sale"}
                    </li>
                    <li>
                      {translation?.get_queries ||
                        "Get instant queries over Phone, Email and SMS"}
                    </li>
                    <li>
                      {translation?.performance_tracking ||
                        "Performance in search  & Track responses & views online"}
                    </li>
                    <li>
                      {translation?.add_photos ||
                        "Add detailed property information & multiple photos per listing"}
                    </li>
                  </ul>
                </aside>
                <aside className="col-lg-6 col-12">
                  <Formik
                    initialValues={{ email: "", password: "" }}
                    validationSchema={validationSchema}
                    onSubmit={(values, actions) => {
                      handleSubmit(values, actions);
                    }}
                  >
                    {({ isValid, dirty }) => (
                      <div className="card border-0 authentication-form">
                        <div className="card-body">
                          <Form autoComplete="off">
                            <h3 className="mb-4">
                              {translation?.sign_in || "Sign In"}
                            </h3>

                            <div className="form-floating mb-4">
                              <Field
                                type="text"
                                id="email"
                                name="email"
                                className="form-control"
                                placeholder=" "
                              />
                              <label htmlFor="email" className="floating-label">
                                {translation?.email || "Email"}
                              </label>
                              <ErrorMessage
                                name="email"
                                component="div"
                                className="text-danger"
                              />
                            </div>

                            <div className="form-floating mb-4 with-icon-end">
                              <Field
                                type={passwordType}
                                id="password"
                                name="password"
                                className="form-control"
                                placeholder=" "
                                maxLength="8"
                                autoComplete="off"
                              />
                              <label htmlFor="password" className="floating-label">
                                {translation?.password || "Password"}
                              </label>
                              <a
                                role="button"
                                id="show-hide-pass"
                                title="Show Password"
                                onClick={togglePassword}
                              >
                                <i
                                  className={`icon-feather-${passwordType === "password" ? "eye-off" : "eye"
                                    }`}
                                ></i>
                              </a>
                              <ErrorMessage
                                name="password"
                                component="div"
                                className="text-danger"
                              />
                            </div>

                            <div className="d-grid">
                              <button
                                type="submit"
                                className="btn btn-primary mb-2"
                                disabled={!isValid || !dirty}
                              >
                                {translation?.log_in || "Log In"}
                              </button>
                            </div>

                            <p className="text-end">
                              <Link href="/forget-password">
                                {translation?.forgot_password || "Forgot Password?"}{" "}
                              </Link>
                            </p>

                            {/* <div className="social-login-separator">
                              <span>
                                {" "}
                                {translation?.or_login_with || "OR LOGIN WITH"}{" "}
                              </span>
                            </div>

                            <div className="social-login-buttons">
                              <button
                                type="button"
                                className="btn btn-outline-primary btn-fb"
                              >
                                <span> {translation?.facebook || "Facebook"} </span>
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline-success btn-google"
                              >
                                <span> {translation?.google || "Google"} </span>
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline-secondary btn-apple"
                              >
                                <span> {translation?.apple || "Apple"}</span>
                              </button>
                            </div> */}

                            <p className="text-center">
                              <small>
                                {translation?.dont_have_account ||
                                  "Don’t have an account?"}
                                <Link href="/register">
                                  {" "}
                                  {translation?.register_now || "Register Now"}{" "}
                                </Link>
                              </small>
                            </p>
                          </Form>
                        </div>
                      </div>
                    )}
                  </Formik>
                </aside>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;
