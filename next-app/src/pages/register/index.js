"use client";
import React, { useState, useEffect } from "react";
import { Formik, Field, Form, ErrorMessage, useFormikContext } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import AuthUser from "@/components/Authentication/AuthUser";
import { useRouter } from "next/navigation";
import { Helmet } from "react-helmet-async";
import Link from "next/link";
import useTranslation from "../../hooks/useTranslation";
import LoginHeader from "@/components/addtional/LoginHeader";

const Index = () => {
  const router = useRouter();
  const translation = useTranslation();
  const [emailvalidate, setEmailValidate] = useState(false);
  const [otpvalidate, setOtpValidate] = useState(false);
  const [scrollState, setScrollState] = useState("header-sticky");
  const [currentLang, setCurrentLang] = useState("en");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [passwordColor, setPasswordColor] = useState("text-danger");
  const [emailTimer, setEmailTimer] = useState(0);
  const [emailValue,setEmailValue] =useState()
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [showOTPField, setShowOTPField] = useState(false);
  const { callApi } = AuthUser();
  const validationSchema = Yup.object({
    name: Yup.string().required(
      translation?.name_is_required || "Name is required"
    ),
    email: Yup.string()
      .email(translation?.invalid_email || "Invalid email format")
      .required(translation?.email_required || "Email is required"),
    password: Yup.string()
      .required(translation?.password_required || "Password is required")
      .min(
        6,
        translation?.password_min_length ||
          "Password must be at least 6 characters"
      ),
    phone: Yup.string()
      .required(translation?.phone_number || "phone number is required")
      .matches(
        /^[0-9]{10}$/,
        translation?.phone_min_length ||
          "Phone number must be exactly 10 digits"
      ),
    phone_code: Yup.string().required(
      translation?.phone_code || "Phone code is required"
    ),
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

  useEffect(() => {
    const storedLang = localStorage.getItem("lang") || "en";
    setCurrentLang(storedLang);
  }, []);

  const changeLanguage = (lang) => {
    localStorage.setItem("lang", lang);
    setCurrentLang(lang);
    window.location.reload();
  };

  const handleSendOTP = async (email) => {
    let response;
    if (!email) return;
    setEmailTimer(60);
    setEmailValue(email)
    try {
      response = await callApi({
        api: `/send_otp_to_verify_email`,
        method: "UPLOAD",
        data: {
          email: email,
        },
      });
      if (response) {
        setEmailValidate(true);
        setShowOTPField(true);
        toast.success(response?.message || "OTP Send Successfully");
      } else {
        toast.error(response?.message || "OTP Send Failed");
      }
    } catch (error) {
      toast.error(response?.message || "Data Not Found");
    }
  };
  const handleOtpChange = (e, index) => {
    const value = e.target.value.replace(/\D/, ""); // Only digits
  
    const newOtp = [...otp];
    newOtp[index] = value; // Even if value is empty, we want to allow it
    setOtp(newOtp);
  
    // Move to next input if a digit is typed
    if (value && index < otp.length - 1) {
      const next = document.querySelector(`input[name='otp-${index + 1}']`);
      if (next) next.focus();
    }
  
    // Auto verify only if all fields are filled
    if (newOtp.every((digit) => digit !== "")) {
      handleVerifyOTP(newOtp.join(""));
    }
  };
  

  const handleVerifyOTP = async (values) => {
    let response;
    try {
      response = await callApi({
        api: `/verify_email`,
        method: "UPLOAD",
        data: {
          email:emailValue,
          otp: values,
        },
      });
      if (response && response?.status === 1) {
        setOtpValidate(true);
        toast.success(response?.message || "Verify OTP Successfully");
      } else {
        toast.error(response?.message || "Verify OTP Failed");
      }
    } catch (error) {
      toast.error(response?.message || "Data Not Found");
    }
  };

  const handleSubmit = async (values) => {
    try {
      const response = await callApi({
        api: `/register`,
        method: "POST",
        data: values,
      });
      if (response && response.status === 1) {
        toast.success(response.message || "User Registration Successfully");
        router.push("/dashboard");
      } else {
        toast.error(response.message || "User Registration Failed");
      }
    } catch (error) {
      toast.error(response.message || "Data Not Found");
    }
  };

  const checkPasswordStrength = (password) => {
    // setFieldValue("password", password);

    if (password.length < 6) {
      setPasswordStrength("Too short");
      setPasswordColor("text-danger");
      return;
    }

    const strengthCriteria = [
      /[a-z]/.test(password),
      /[A-Z]/.test(password),
      /\d/.test(password),
      /[@$!%*?&#]/.test(password),
      password.length >= 8,
    ];

    const passedCriteria = strengthCriteria.filter(Boolean).length;

    if (passedCriteria === 5) {
      setPasswordStrength("Strong");
      setPasswordColor("text-success");
    } else if (passedCriteria >= 3) {
      setPasswordStrength("Medium");
      setPasswordColor("text-warning");
    } else {
      setPasswordStrength("Weak");
      setPasswordColor("text-danger");
    }
  };

  return (
    <>
      <LoginHeader />
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
                <aside className="col-lg-6 col-12 text-white d-none d-lg-block">
                  <img
                    src="/assets/images/authentication.png"
                    alt="Authentication"
                    className="img-fluid auth"
                  />
                  <h1>{translation?.welcome || "Welcome!"}</h1>
                  <h4>
                    {translation?.things_you_can_do ||
                      "Things you can do with this account"}
                  </h4>
                  <ul className="list list-1 list-get">
                    <li>
                      {translation?.post_property ||
                        "Post one Single Property for FREE"}
                    </li>
                    <li>
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
                        "Performance in search & Track responses & views online"}
                    </li>
                    <li>
                      {translation?.performance_tracking ||
                        "Add detailed property information & multiple photos per listing"}
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
                    {({ isValid, dirty, handleChange, handleBlur, values, setFieldValue }) => (
                      <div className="card border-0 authentication-form">
                        <div className="card-body">
                          <Form autoComplete="off">
                            <h3 className="mb-3">
                              {translation?.sign_up || "Sign Up"}
                            </h3>
                            <label className="form-label d-block">
                              {translation?.register_an || "Register as a/an"}
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
                                {translation?.owner || "Owner"}
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
                                {translation?.agent || "Agent"}
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
                                {translation?.builder || "Builder"}
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
                                {translation?.name || "Name"}
                              </label>
                              <ErrorMessage
                                name="name"
                                component="div"
                                className="text-danger"
                              />
                            </div>

                            <div className="form-floating mb-3 position-relative">
                              <Field
                                type="email"
                                id="email"
                                className="form-control"
                                placeholder=""
                                name="email"
                              />
                              <label htmlFor="email" className="floating-label">
                                {translation?.email || "Email"}
                              </label>
                              <ErrorMessage
                                name="email"
                                component="div"
                                className="text-danger"
                              />
                              {values?.email && (
                                <button
                                  type="button"
                                  className="btn btn-primary position-absolute end-0 top-50 translate-middle-y me-2"
                                  onClick={() => handleSendOTP(values?.email)}
                                  disabled={emailTimer > 0}
                                >
                                  {emailTimer > 0
                                    ? `Resend in ${emailTimer}s`
                                    : translation?.send_otp || "Send OTP"}
                                </button>
                              )}
                            </div>
                            {showOTPField && (
                              <div className="d-flex gap-2 justify-content-between mb-3">
                                {otp.map((digit, index) => (
                                  <input
                                  key={index}
                                  type="text"
                                  inputMode="numeric"
                                  maxLength={1}
                                  name={`otp-${index}`}
                                  value={digit}
                                  onChange={(e) => handleOtpChange(e, index)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Backspace" && !otp[index] && index > 0) {
                                      const prev = document.querySelector(`input[name='otp-${index - 1}']`);
                                      if (prev) prev.focus();
                                    }
                                  }}
                                  className="form-control text-center"
                                  style={{
                                    height: "50px",
                                    fontSize: "20px",
                                  }}
                                />
                                ))}
                              </div>
                            )}

                            <div className="form-floating mb-3 with-icon-end">
                              <Field
                                type="password"
                                id="current-password"
                                className="form-control"
                                placeholder=""
                                name="password"
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setFieldValue("password", val); // update Formik state
                                  checkPasswordStrength(val); // check strength
                                }}
                              />
                              <label
                                htmlFor="current-password"
                                className="floating-label"
                              >
                                {translation?.password || "Password"}
                              </label>
                              <ErrorMessage
                                name="password"
                                component="div"
                                className="text-danger"
                              />

                              {passwordStrength && (
                                <div className={`mt-1 ${passwordColor}`}>
                                  <strong>{passwordStrength}</strong>
                                </div>
                              )}
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
                                    placeholder={translation?.mobile_number || "Mobile Number"}
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
                                {translation?.sign_in || "Sign Up"}
                              </button>
                            </div>

                            <p>
                              <small>
                                {translation?.by_signing_up ||
                                  "By signing up you agree to our"}{" "}
                                <Link href="/term-conditions/">
                                  {translation?.terms_condition ||
                                    "Terms & Conditions"}
                                </Link>
                                {translation?.and || "and"}{" "}
                                <Link href="/privacy-policy">
                                  {translation?.privacy_policy ||
                                    "Privacy Policy"}
                                </Link>
                                .
                              </small>
                            </p>

                            <p className="text-center">
                              <small>
                                {translation?.already_have_an ||
                                  "Already have an account?"}{" "}
                                <a href="/login">
                                  {translation?.login_now || "Login Now"}
                                </a>
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
