import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import AuthUser from "@/components/Authentication/AuthUser";
import { useRouter } from 'next/router';
import { toast } from "react-toastify";

const index = () => {
  const router = useRouter();
  const { callApi } = AuthUser();

  // Validation schema for email field
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
  });

  const handleSubmit = async (values) => {
    try {
      const response = await callApi({
        api: `/forgot-password`,
        method: 'POST',
        data: values,
      });

      if (response && response.status === 1) {
        toast.success(response.message || 'Password reset instructions sent to your email');
        router.push("/login");
      } else {
        toast.error(response.message || 'Failed to send password reset instructions');
      }
    } catch (error) {
      toast.error(response.message || 'An unexpected error occurred');
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
                  src="assets/images/authentication.png"
                  alt="Authentication"
                  className="img-fluid auth"
                />
                <h1>Forgot Password</h1>
                <p>
                  Enter your registered email address, and we'll send you instructions to reset your password.
                </p>
              </aside>
              <aside className="col-lg-6 col-12">
                <Formik
                  initialValues={{ email: '' }}
                  validationSchema={validationSchema}
                  onSubmit={(values) => {
                    handleSubmit(values);
                  }}
                >
                  {({ isValid, dirty }) => (
                    <Form className="authentication-form" autoComplete="off">
                      <h3 className="mb-4">Forgot Password</h3>
                      <div className="form-floating mb-4">
                        <Field
                          type="email"
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
  );
};

export default index;
