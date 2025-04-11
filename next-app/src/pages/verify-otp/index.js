import React, { useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import AuthUser from "@/components/Authentication/AuthUser";
import { useRouter } from 'next/router';
import { toast } from "react-toastify";
import Link from 'next/link';
import useTranslation from '@/hooks/useTranslation';

const Index = () => {
  const router = useRouter();
  const { callApi, saveToken } = AuthUser();
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [confirm_passwordType, setConfirmPasswordType] = useState('password');

  const toggleConfirmPassword = () => {
    setConfirmPasswordType(confirm_passwordType === 'password' ? 'text' : 'password');
  };
const translation = useTranslation();
  const validationSchemaPassword = Yup.object({
    password: Yup.string().required(translation?.password_required || "Password is required"),
    confirm_password: Yup.string()
      .required(translation?.confirm_password_required || "Confirm Password is required")
      .min(6, translation?.confirm_password_min_length || "Confirm Password must be at least 6 characters")
      .oneOf([Yup.ref('password'), null], translation?.passwords_must_match || "Passwords must match"),
  });

  const validationSchemaOtp = Yup.object({
    otp: Yup.string().required(translation?.otp_required || "OTP is required").length(6, translation?.otp_must_be_6_digits || "OTP must be 6 digits"),
  });

  const handleSubmitOtp = async (values) => {
    try {
      const response = await callApi({
        api: `/verify-otp`,
        method: 'POST',
        data: { otp: values.otp },
      });

      if (response && response.status === 1) {
        setIsOtpVerified(true);
        toast.success('OTP Verified Successfully');
      } else {
        toast.error('Invalid OTP');
      }
    } catch (error) {
      toast.error('Error verifying OTP');
    }
  };

  const handleSubmitPassword = async (values) => {
    try {
      const response = await callApi({
        api: `/set-password`,
        method: 'POST',
        data: { password: values.password },
      });

      if (response && response.status === 1) {
        toast.success('Password set successfully');
        saveToken(response?.authorisation?.token);
        router.push("/dashboard");
      } else {
        toast.error('Failed to set password');
      }
    } catch (error) {
      toast.error('Error setting password');
    }
  };

  return (
    <section className="section authentication-page">
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
                <h1>{translation?.welcome || "Welcome!"}
                </h1>
                <h4>{translation?.account_features_info || "Things you can do with this account"}
                </h4>
                <ul className="list list-1 list-get">
                  <li>{translation?.post_one_property_free || "Post one Single Property for FREE"}
                  </li>
                  <li>{translation?.set_property_alerts || "Set property alerts for your requirement"}
                  </li>
                  <li>{translation?.accessed_by_buyers || "Get accessed by over 1 Lakh buyers"}
                  </li>
                  <li>{translation?.showcase_property_options || "Showcase your property as Rental, PG or for Sale"}
                  </li>
                  <li>{translation?.instant_queries || "Get instant queries over Phone, password and SMS"}
                  </li>
                  <li>{translation?.performance_tracking || "Performance in search & Track responses & views online"}
                  </li>
                  <li>{translation?.add_property_details || "Add detailed property information & multiple photos per listing"}
                  </li>
                </ul>
              </aside>
              <aside className="col-lg-6 col-12">
                {isOtpVerified ? (
                  <Formik
                    initialValues={{ password: '', confirm_password: '' }}
                    validationSchema={validationSchemaPassword}
                    onSubmit={handleSubmitPassword}
                  >
                    {({ isValid, dirty }) => (
                      <Form className="authentication-form" autoComplete="off">
                        <h3 className="mb-4">{translation?.set_new_password || "Set New Password"}
                        </h3>

                        <div className="form-floating mb-4">
                          <Field
                            type="password"
                            id="password"
                            name="password"
                            className="form-control"
                            placeholder=" "
                          />
                          <label htmlFor="password" className="floating-label">
                          {translation?.password || "Password"}

                          </label>
                          <ErrorMessage name="password" component="div" className="text-danger" />
                        </div>

                        <div className="form-floating mb-4 with-icon-end">
                          <Field
                            type={confirm_passwordType}
                            id="confirm_password"
                            name="confirm_password"
                            className="form-control"
                            placeholder=" "
                          />
                          <label htmlFor="confirm_password" className="floating-label">
                          {translation?.confirm_password || "Confirm Password"}

                          </label>
                          <a
                            href="#"
                            id="show-hide-pass"
                            title="Show confirm_password"
                            onClick={toggleConfirmPassword}
                          >
                            <i
                              className={`icon-feather-${confirm_passwordType === 'password' ? 'eye-off' : 'eye'}`}
                            ></i>
                          </a>
                          <ErrorMessage name="confirm_password" component="div" className="text-danger" />
                        </div>

                        <div className="d-grid">
                          <button
                            type="submit"
                            className="btn btn-primary mb-2"
                            disabled={!isValid || !dirty}
                          >
                            {translation?.set_password || "Set Password"}

                          </button>
                        </div>

                        <p className="text-end">
                          <Link href="/forget-password">{translation?.forgot_password || "Forgot Password?"}
                          </Link>
                        </p>
                      </Form>
                    )}
                  </Formik>
                ) : (
                  <Formik
                    initialValues={{ otp: '' }}
                    validationSchema={validationSchemaOtp}
                    onSubmit={handleSubmitOtp}
                  >
                    {({ isValid, dirty }) => (
                      <Form className="authentication-form" autoComplete="off">
                        <h3 className="mb-4">{translation?.verify_otp || "Verify OTP"}
                        </h3>

                        <div className="form-floating mb-4">
                          <Field
                            type="text"
                            id="otp"
                            name="otp"
                            className="form-control"
                            placeholder=" "
                            maxLength="6"
                          />
                          <label htmlFor="otp" className="floating-label">
                          {translation?.enter_otp || "Enter OTP"}

                          </label>
                          <ErrorMessage name="otp" component="div" className="text-danger" />
                        </div>

                        <div className="d-grid">
                          <button
                            type="submit"
                            className="btn btn-primary mb-2"
                            disabled={!isValid || !dirty}
                          >
                            {translation?.verify_otp || "Verify OTP"}

                          </button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                )}
              </aside>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Index;
