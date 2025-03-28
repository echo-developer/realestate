import React, { useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import AuthUser from "@/components/Authentication/AuthUser";
import { useRouter } from 'next/router';
import { toast } from "react-toastify";
import LoginHeader from '@/components/addtional/LoginHeader';

const ResetPassword = () => {
  const router = useRouter();
  const { callApi } = AuthUser();
  const { token, email } = router.query;
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation schema for password fields
  const validationSchema = Yup.object({
    new_password: Yup.string()
      .min(6, 'Password must be at least 6 characters long')
      .required('New Password is required'),
    confirm_password: Yup.string()
      .oneOf([Yup.ref('new_password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
  });

  const handleSubmit = async (values) => {
    if (!token || !email) {
      toast.error("Invalid reset link. Please try again.");
      return;
    }

    try {
      const response = await callApi({
        api: `/reset-password`,
        method: 'POST',
        data: {
          token:token,
          email:email,
          password: values.new_password,
          password_confirmation: values.confirm_password,
        },
      });

      if (response && response.status === 1) {
        toast.success(response.message || 'Password reset successfully');
        router.push("/login");
      } else {
        toast.error(response.message || 'Failed to reset password. Please try again.');
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <>
     <LoginHeader/>
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
                <h1>Reset Password</h1>
                <p>
                  Enter your new password to reset your account.
                </p>
              </aside>
              <aside className="col-lg-6 col-12">
                <Formik
                  initialValues={{ new_password: '', confirm_password: '' }}
                  validationSchema={validationSchema}
                  onSubmit={(values) => {
                    handleSubmit(values);
                  }}
                >
                  {({ isValid, dirty }) => (
                    <Form className="authentication-form" autoComplete="off">
                      <h3 className="mb-4">Reset Password</h3>
                      <div className="form-floating mb-4 position-relative">
                        <Field
                          type={showNewPassword ? "text" : "password"}
                          id="new_password"
                          name="new_password"
                          className="form-control"
                          placeholder=" "
                        />
                        <label htmlFor="new_password" className="floating-label">
                          New Password
                        </label>
                        <ErrorMessage
                          name="new_password"
                          component="div"
                          className="text-danger"
                        />
                        <a
                          href="#"
                          id="show-hide-pass"
                          title="Show Password"
                          className="position-absolute"
                          style={{ top: "50%", right: "10px", transform: "translateY(-50%)" }}
                          onClick={(e) => {
                            e.preventDefault();
                            setShowNewPassword((prev) => !prev);
                          }}
                        >
                          <i
                            className={`icon-feather-${showNewPassword ? "eye" : "eye-off"}`}
                          ></i>
                        </a>
                      </div>
                      <div className="form-floating mb-4 position-relative">
                        <Field
                          type={showConfirmPassword ? "text" : "password"}
                          id="confirm_password"
                          name="confirm_password"
                          className="form-control"
                          placeholder=" "
                        />
                        <label htmlFor="confirm_password" className="floating-label">
                          Confirm Password
                        </label>
                        <ErrorMessage
                          name="confirm_password"
                          component="div"
                          className="text-danger"
                        />
                        <a
                          href="#"
                          id="show-hide-pass"
                          title="Show Password"
                          className="position-absolute"
                          style={{ top: "50%", right: "10px", transform: "translateY(-50%)" }}
                          onClick={(e) => {
                            e.preventDefault();
                            setShowConfirmPassword((prev) => !prev);
                          }}
                        >
                          <i
                            className={`icon-feather-${showConfirmPassword ? "eye" : "eye-off"}`}
                          ></i>
                        </a>
                      </div>
                      <div className="d-grid">
                        <button
                          type="submit"
                          className="btn btn-primary mb-2"
                          disabled={!isValid || !dirty}
                        >
                          Submit
                        </button>
                      </div>
                      <p className="text-center">
                        <small>
                          Remembered your password? <a href="/login">Log In</a>
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

export default ResetPassword;
