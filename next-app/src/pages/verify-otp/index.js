import React, { useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import AuthUser from "@/components/Authentication/AuthUser";
import { useRouter } from 'next/router';
import { toast } from "react-toastify";
import Link from 'next/link';

const Index = () => {
  const router = useRouter();
  const { callApi, saveToken } = AuthUser();
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [confirm_passwordType, setConfirmPasswordType] = useState('password');

  const toggleConfirmPassword = () => {
    setConfirmPasswordType(confirm_passwordType === 'password' ? 'text' : 'password');
  };

  const validationSchemaPassword = Yup.object({
    password: Yup.string().required('Password is required'),
    confirm_password: Yup.string()
      .required('Confirm Password is required')
      .min(6, 'Confirm Password must be at least 6 characters')
      .oneOf([Yup.ref('password'), null], 'Passwords must match'),
  });

  const validationSchemaOtp = Yup.object({
    otp: Yup.string().required('OTP is required').length(6, 'OTP must be 6 digits'),
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
                <h1>Welcome!</h1>
                <h4>Things you can do with this account</h4>
                <ul className="list list-1 list-get">
                  <li>Post one Single Property for FREE</li>
                  <li>Set property alerts for your requirement</li>
                  <li>Get accessed by over 1 Lakh buyers</li>
                  <li>Showcase your property as Rental, PG or for Sale</li>
                  <li>Get instant queries over Phone, password and SMS</li>
                  <li>Performance in search &amp; Track responses &amp; views online</li>
                  <li>Add detailed property information &amp; multiple photos per listing</li>
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
                        <h3 className="mb-4">Set New Password</h3>

                        <div className="form-floating mb-4">
                          <Field
                            type="password"
                            id="password"
                            name="password"
                            className="form-control"
                            placeholder=" "
                          />
                          <label htmlFor="password" className="floating-label">
                            Password
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
                            Confirm Password
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
                            Set Password
                          </button>
                        </div>

                        <p className="text-end">
                          <Link href="/forget-password">Forgot Password?</Link>
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
                        <h3 className="mb-4">Verify OTP</h3>

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
                            Enter OTP
                          </label>
                          <ErrorMessage name="otp" component="div" className="text-danger" />
                        </div>

                        <div className="d-grid">
                          <button
                            type="submit"
                            className="btn btn-primary mb-2"
                            disabled={!isValid || !dirty}
                          >
                            Verify OTP
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
