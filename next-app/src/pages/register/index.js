import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import AuthUser from "@/components/Authentication/AuthUser";
import { useRouter } from "next/router";
import { Helmet } from "react-helmet-async";

const Index = () => {
  const router = useRouter();
  const { callApi } = AuthUser();
  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
    phone: Yup.string()
      .required("Phone number is required")
      .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),
    phone_code: Yup.string().required("Phone code is required"),
  });

  const handleSubmit = async (values) => {
    try {
      const response = await callApi({
        api: `/register`,
        method: "POST",
        data: values,
      });
      if (response && response.status === 1) {
        toast.success(response.message || "User Registration Successfully");
        router.push("/login");
      } else {
        toast.error(response.message || "User Registration Failed");
      }
    } catch (error) {
      toast.error(response.message || "Data Not Found");
    }
  };

  return (
    <>
      <Helmet>
        <title>Register on RealEstate | Create Your Property Account</title>
        <meta
          name="description"
          content="Join RealEstate to explore property listings, save your favorites, and receive personalized property recommendations. Sign up today!"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>
      <section className="section authentication-page">
        <div className="container h-100">
          <div className="d-flex justify-content-center align-items-center h-100">
            <div className="authentication-container mx-auto w-100 bg-primary">
              <div className="row">
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
                    initialValues={{
                      name: "",
                      email: "",
                      password: "",
                      phone: "",
                      phone_code: "+91",
                      user_type: "O",
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                  >
                    {({ isValid, dirty, handleChange, handleBlur, values }) => (
                      <Form className="authentication-form" autoComplete="off">
                        <h3 className="mb-3">Sign Up</h3>
                        <label className="form-label d-block">
                          Register as a/an
                        </label>
                        <div
                          className="btn-group btn-group-light d-flex mb-3"
                          role="group"
                        >
                          <Field
                            type="radio"
                            name="user_type"
                            value="O"
                            id="owner"
                            className="btn-check"
                          />
                          <label
                            className="btn btn-outline-light"
                            htmlFor="owner"
                          >
                            <img
                              src="/assets/images/icons/owner.png"
                              alt=""
                              height="32"
                              width="32"
                            />{" "}
                            Owner
                          </label>

                          <Field
                            type="radio"
                            name="user_type"
                            value="A"
                            id="agent"
                            className="btn-check"
                          />
                          <label
                            className="btn btn-outline-light"
                            htmlFor="agent"
                          >
                            <img
                              src="/assets/images/icons/agent.png"
                              alt=""
                              height="32"
                              width="32"
                            />{" "}
                            Agent
                          </label>

                          <Field
                            type="radio"
                            name="user_type"
                            value="Builder"
                            id="builder"
                            className="btn-check"
                          />
                          <label
                            className="btn btn-outline-light"
                            htmlFor="builder"
                          >
                            <img
                              src="/assets/images/icons/builder.png"
                              alt=""
                              height="32"
                              width="32"
                            />{" "}
                            Builder
                          </label>
                        </div>

                        <div className="form-floating mb-3">
                          <Field
                            type="text"
                            id="name"
                            className="form-control"
                            placeholder=""
                            name="name"
                          />
                          <label htmlFor="name" className="floating-label">
                            Name
                          </label>
                          <ErrorMessage
                            name="name"
                            component="div"
                            className="text-danger"
                          />
                        </div>

                        <div className="form-floating mb-3">
                          <Field
                            type="email"
                            id="email"
                            className="form-control"
                            placeholder=""
                            name="email"
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

                        <div className="form-floating mb-3 with-icon-end">
                          <Field
                            type="password"
                            id="current-password"
                            className="form-control"
                            placeholder=""
                            name="password"
                          />
                          <label
                            htmlFor="current-password"
                            className="floating-label"
                          >
                            Password
                          </label>
                          <ErrorMessage
                            name="password"
                            component="div"
                            className="text-danger"
                          />
                        </div>

                        <div className="form-field">
                          <div className="input-group">
                            <div className="input-group mb-3">
                              <div className="" style={{ width: "80px" }}>
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
                              </div>
                              <Field
                                type="text"
                                className="form-control"
                                placeholder="Mobile Number"
                                name="phone"
                              />
                            </div>
                          </div>
                          <ErrorMessage
                            name="phone"
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
                            Sign Up
                          </button>
                        </div>

                        <p>
                          <small>
                            By signing up you agree to our{" "}
                            <a href="#">Terms &amp; Conditions</a> and{" "}
                            <a href="#">Privacy Policy</a>.
                          </small>
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
                            Already have an account?{" "}
                            <a href="/login">Login Now</a>
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
