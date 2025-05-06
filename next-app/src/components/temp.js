"use client";
import DashboardLayout from "@/components/layout/DashboardLayout";
import React, { useState } from "react";
import AuthUser from "@/components/Authentication/AuthUser";
import { toast } from "react-toastify";
import { Formik, Form, Form as FormikForm, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import useTranslation from "@/hooks/useTranslation";
import { Row, Col, Card, Form as BootstrapForm, FloatingLabel, Button } from "react-bootstrap";
import { useAuth } from "@/context/AuthProvider";

const Index = () => {
    const { callApi, GetMemberId } = AuthUser();
    const { userData } = useAuth();
    const memberId = GetMemberId();
    const [showPassword, setShowPassword] = useState(false);
    const [step, setStep] = useState('password');
    const translation = useTranslation();

    const validationSchema = Yup.object({
        newpassword: Yup.string()
            .min(6, translation?.password_min_length || "Password must be at least 6 characters.")
            .required(translation?.new_password_required || "New password is required."),
        confirm_password: Yup.string()
            .oneOf([Yup.ref("newpassword"), null], translation?.new_passwords_do_not_match || "New passwords do not match.")
            .required(translation?.confirm_password_required || "Confirm password is required."),
    });

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const response = await callApi({
                api: `/change_user_password`,
                method: "UPLOAD",
                data: {
                    oldpassword: values.oldpassword,
                    newpassword: values.newpassword,
                    confirm_password: values.confirm_password,
                    user_id: memberId,
                },
            });

            if (response && response.status === 1) {
                toast.success(response.message || "Password has been updated successfully");
                resetForm();
            } else {
                toast.error(response.message || "Password failed to update");
            }
        } catch (error) {
            console.error(error.message || "Data not found");
        }
        setSubmitting(false);
    };

    return (
        <DashboardLayout>
            <aside className="col-lg col-12">
                <div className="page-fluid-container">
                    <div className="pageTitle">
                        <h1>
                            {translation?.update_password || "Update Password"}
                        </h1>
                    </div>
                    <Row className="justify-content-center1">
                        <Col xl={6}>
                            <Card>
                                <Card.Body>
                                    <Formik
                                        initialValues={{ oldpassword: "", newpassword: "", confirm_password: "", showPassword: false }}
                                        validationSchema={validationSchema}
                                        onSubmit={handleSubmit}
                                    >
                                        {({ isSubmitting }) => (
                                            <Form className="authentication-form" autoComplete="off">
                                                <div className="row">
                                                    <div className="col-md-12 col-12">
                                                        <FloatingLabel
                                                            label="Email"
                                                            className="mb-3"
                                                        >
                                                            <input
                                                                type="email"
                                                                className="form-control"
                                                                value={userData.email}
                                                                readOnly
                                                            />
                                                        </FloatingLabel>



                                                        <FloatingLabel
                                                            label={
                                                                <>
                                                                    {translation?.new_password || "New Password"} <span>*</span>
                                                                </>
                                                            }
                                                            className="mb-3"
                                                        >
                                                            <Field type={showPassword ? "text" : "password"} name="newpassword" className="form-control" placeholder="" />
                                                            <ErrorMessage name="newpassword" component="div" className="text-danger small" />
                                                        </FloatingLabel>

                                                        <FloatingLabel
                                                            label={
                                                                <>
                                                                    {translation?.confirm_password || "Confirm Password"} <span>*</span>
                                                                </>
                                                            }
                                                            className="mb-3"
                                                        >
                                                            <Field type={showPassword ? "text" : "password"} name="confirm_password" className="form-control" placeholder="" />
                                                            <ErrorMessage name="confirm_password" component="div" className="text-danger small" />
                                                        </FloatingLabel>

                                                        <div className="mb-3">
                                                            <FormikForm>
                                                                <BootstrapForm.Check
                                                                    inline
                                                                    label={translation?.show_password || "Show Password"}
                                                                    name="showPassword"
                                                                    type="checkbox"
                                                                    id="showPassword"
                                                                    checked={showPassword}
                                                                    onChange={(e) => setShowPassword(e.target.checked)}
                                                                />
                                                            </FormikForm>
                                                        </div>

                                                        <div className="d-grid">
                                                            {step === 'password' && (
                                                                <Button type="submit" variant="primary" disabled={isSubmitting}>
                                                                    Send OTP
                                                                </Button>
                                                            )}

                                                            {step === 'otp' && (
                                                                <div className="d-flex justify-content-between">
                                                                    <Button variant="secondary" onClick={() => setStep('password')}>
                                                                        Go Back
                                                                    </Button>
                                                                    <Button type="submit" variant="primary" disabled={isSubmitting}>
                                                                        Verify
                                                                    </Button>
                                                                </div>
                                                            )}
                                                        </div>

                                                    </div>
                                                </div>
                                            </Form>
                                        )}
                                    </Formik>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                </div>
            </aside>
        </DashboardLayout>
    );
};

export default Index;
