"use client";
import DashboardLayout from "@/components/layout/DashboardLayout";
import React, { useState } from "react";
import AuthUser from "@/components/Authentication/AuthUser";
import { toast } from "react-toastify";
import { Formik,Form, Form as FormikForm, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import useTranslation from "@/hooks/useTranslation";
import { Row, Col, Card, Form as BootstrapForm, FloatingLabel, Button } from "react-bootstrap";

const Index = () => {
    const { callApi, GetMemberId } = AuthUser();
    const memberId = GetMemberId();
    const [showPassword, setShowPassword] = useState(false);
    const translation = useTranslation();

    const validationSchema = Yup.object({
        oldpassword: Yup.string().required(translation?.old_password_required || "Old password is required."),
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
            toast.error("Data not found");
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
                                                            label={
                                                                <>
                                                                  {translation?.old_password || "Old Password"} <span>*</span>
                                                                </>
                                                            }
                                                            className="mb-3"                                                            
                                                        >
                                                            <Field type={showPassword ? "text" : "password"} name="oldpassword" className="form-control" placeholder="" />
                                                            <ErrorMessage name="oldpassword" component="div" className="text-danger small" />
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
                                                            <Button type="submit" variant="primary" disabled={isSubmitting}>
                                                                {isSubmitting ? "Updating..." : `${translation?.update_password || "Update Password"}`}
                                                            </Button>
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
