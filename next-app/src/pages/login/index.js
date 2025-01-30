import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import AuthUser from "@/components/Authentication/AuthUser";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import Link from "next/link";
import { Helmet } from "react-helmet-async";

const Index = () => {
  const router = useRouter();
  const { callApi, saveToken } = AuthUser();
  const [passwordType, setPasswordType] = useState("password");
  const togglePassword = () => {
    setPasswordType(passwordType === "password" ? "text" : "password");
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
  });

  const handleSubmit = async (values) => {
    try {
      const response = await callApi({
        api: `/login`,
        method: "POST",
        data: values,
      });

      if (response && response.status === 1) {
        router.push("/dashboard");
        saveToken(response?.authorisation?.token);
        toast.success(response.message || "User Login Successfully");
      } else {
        toast.error(response.message || "Invalid Credential");
      }
    } catch (error) {
      toast.error(response.message || "Data Not Found");
    }
  };

  return (
    <>
      
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
                <aside className="col-lg-6 col-12 text-white">
                  <img
                    src="/assets/images/authentication.png"
                    alt="Authentication"
                    className="img-fluid auth"
                  />
                  <h1>Welcome!</h1>
                  <h4>Things you can do with this account</h4>
                  <ul className="list list-1 list-get">
                    <li>Post one Single Property for FREE</li>
                    <li>Set property alerts for your requirement</li>
                    <li>Get accessed by over 1 Lakh buyers</li>
                    <li>Showcase your property as Rental, PG or for Sale</li>
                    <li>Get instant queries over Phone, Email and SMS</li>
                    <li>
                      Performance in search &amp; Track responses &amp; views
                      online
                    </li>
                    <li>
                      Add detailed property information &amp; multiple photos
                      per listing
                    </li>
                  </ul>
                </aside>
                <aside className="col-lg-6 col-12">
                  <Formik
                    initialValues={{ email: "", password: "" }}
                    validationSchema={validationSchema}
                    onSubmit={(values) => {
                      handleSubmit(values);
                    }}
                  >
                    {({ isValid, dirty }) => (
                      <Form className="authentication-form" autoComplete="off">
                        <h3 className="mb-4">Sign In</h3>

                        <div className="form-floating mb-4">
                          <Field
                            type="text"
                            id="email"
                            name="email"
                            className="form-control"
                            placeholder=" "
                          />
                          <label htmlFor="email" className="floating-label">
                            Email
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
                            Password
                          </label>
                          <a
                            href="#"
                            id="show-hide-pass"
                            title="Show Password"
                            onClick={togglePassword}
                          >
                            <i
                              className={`icon-feather-${
                                passwordType === "password" ? "eye-off" : "eye"
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
                            Log In
                          </button>
                        </div>

                        <p className="text-end">
                          <Link href="/forget-password">Forgot Password?</Link>
                        </p>

                        <div className="social-login-separator">
                          <span>OR LOGIN WITH</span>
                        </div>

                        <div className="social-login-buttons">
                          <button
                            type="button"
                            className="btn btn-outline-primary btn-fb"
                          >
                            <span>Facebook</span>
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-success btn-google"
                          >
                            <span>Google</span>
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-secondary btn-apple"
                          >
                            <span>Apple</span>
                          </button>
                        </div>

                        <p className="text-center">
                          <small>
                            Don’t have an account?{" "}
                            <Link href="/register">Register Now</Link>
                          </small>
                        </p>
                      </Form>
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
