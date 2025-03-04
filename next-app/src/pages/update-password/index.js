"use client";
import DashboardLayout from "@/components/layout/DashboardLayout";
import React, { useState } from "react";
import AuthUser from "@/components/Authentication/AuthUser";
import { toast } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import useTranslation from "@/hooks/useTranslation";

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
            <div className="col-xl-9 col-lg-9 col-12 p-3">
                <h3>{translation?.update_password ||"Update Password"}</h3>
                <Formik
                    initialValues={{ oldpassword: "", newpassword: "", confirm_password: "" }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form className="authentication-form" autoComplete="off">
                            <div className="row">
                                <div className="col-md-12 col-12">
                                    <div className="floating-label-group mb-3">
                                        <label className="floating-label">
                                            {translation?.old_password || "Old Password"}<span>*</span>
                                        </label>
                                        <Field type={showPassword ? "text" : "password"} name="oldpassword" className="form-control" />
                                        <ErrorMessage name="oldpassword" component="div" className="text-danger" />
                                    </div>

                                    <div className="floating-label-group mb-3">
                                        <label className="floating-label">
                                            {translation?.new_password || "New Password"}<span>*</span>
                                        </label>
                                        <Field type={showPassword ? "text" : "password"} name="newpassword" className="form-control" />
                                        <ErrorMessage name="newpassword" component="div" className="text-danger" />
                                    </div>

                                    <div className="floating-label-group mb-3">
                                        <label className="floating-label">
                                            {translation?.confirm_password || "Confirm Password"}<span>*</span>
                                        </label>
                                        <Field type={showPassword ? "text" : "password"} name="confirm_password" className="form-control" />
                                        <ErrorMessage name="confirm_password" component="div" className="text-danger" />
                                    </div>

                                    <div className="mb-3">
                                        <input
                                            type="checkbox"
                                            id="showPassword"
                                            checked={showPassword}
                                            onChange={(e) => setShowPassword(e.target.checked)}
                                        />
                                        <label htmlFor="showPassword" className="ms-2">
                                            {translation?.show_password || "Show Password"}
                                        </label>
                                    </div>

                                    <div className="d-grid">
                                        <button type="submit" className="btn btn-primary mb-2" disabled={isSubmitting}>
                                            {isSubmitting ? "Updating..." : `${translation?.update_password ||"Update Password"}`}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </DashboardLayout>
    );
};

export default Index;
