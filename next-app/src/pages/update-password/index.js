"use client"
import DashboardLayout from "@/components/layout/DashboardLayout";
import React, { useState } from "react";
import AuthUser from "@/components/Authentication/AuthUser";
import { toast } from "react-toastify";
import Link from "next/link";

const Index = () => {
    const { callApi } = AuthUser();
    const [oldpassword, setOldPassword] = useState("");
    const [newpassword, setNewPassword] = useState("");
    const [confirm_password, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async(e) => {
        e.preventDefault();

        if (!oldpassword) {
            setError("Old password is required.");
            return;
        }
        if (!newpassword || !confirm_password) {
            setError("Both new password fields are required.");
            return;
        }
        if (newpassword !== confirm_password) {
            setError("New passwords do not match.");
            return;
        }

        setError("");
       
        try {
            const response= await callApi({
                api:`/change_user_password`,
                method:'UPLOAD',
                data:{
                 oldpassword,
                 newpassword,
                 confirm_password
                }
            })
            if(response && response.status===1){
                toast.success(response.message)
            }else{
                toast.error(response.message)
            }
        } catch (error) {
            toast.error('data not found')
        }
        
    };

    return (
        <DashboardLayout>
            <div className="col-xl-9 col-lg-9 col-12 p-3">
                <h3>Update Password</h3>
                <form
                    className="authentication-form"
                    autoComplete="off"
                    onSubmit={handleSubmit}
                >
                    <div className="row">
                        <div className="col-md-12 col-12">
                            {/* Error Message */}
                            {error && (
                                <div
                                    className="alert alert-danger mb-3"
                                    role="alert"
                                    aria-live="assertive"
                                >
                                    {error}
                                </div>
                            )}

                            {/* Old Password Field */}
                            <div className="floating-label-group mb-3">
                                <label className="floating-label">
                                    Old Password<span>*</span>
                                </label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="oldpassword"
                                    className="form-control"
                                    required
                                    value={oldpassword}
                                    onChange={(e) =>
                                        setOldPassword(e.target.value)
                                    }
                                />
                            </div>

                            {/* New Password Field */}
                            <div className="floating-label-group mb-3">
                                <label className="floating-label">
                                    New Password<span>*</span>
                                </label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="newpassword"
                                    className="form-control"
                                    required
                                    value={newpassword}
                                    onChange={(e) =>
                                        setNewPassword(e.target.value)
                                    }
                                />
                            </div>

                            {/* Confirm Password Field */}
                            <div className="floating-label-group mb-3">
                                <label className="floating-label">
                                    Confirm Password<span>*</span>
                                </label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="confirm_password"
                                    className="form-control"
                                    required
                                    value={confirm_password}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                />
                            </div>

                            {/* Show Password Checkbox */}
                            <div className="mb-3">
                                <input
                                    type="checkbox"
                                    id="showPassword"
                                    checked={showPassword}
                                    onChange={(e) =>
                                        setShowPassword(e.target.checked)
                                    }
                                />
                                <label htmlFor="showPassword" className="ms-2">
                                    Show Password
                                </label>
                            </div>

                            {/* Submit Button */}
                            <div className="d-grid">
                                <button
                                    type="submit"
                                    className="btn btn-primary mb-2"
                                >
                                    Update Password
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
};

export default Index;
