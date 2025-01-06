"use client";
import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Link from "next/link";
import AuthUser from "@/components/Authentication/AuthUser";
import { toast } from "react-toastify";

const ProfileForm = () => {
    const { callApi, GetMemberId } = AuthUser();
    const [userData, setUserData] = useState(null);
    const [formData, setFormData] = useState(null);

    const memberId = GetMemberId();

    useEffect(() => {
        if (memberId) {
            fetchUserData();
        }
    }, [memberId]);

    const fetchUserData = async () => {
        try {
            const response = await callApi({
                api: `/my_profile`,
                method: "GET",
                data: {
                    user_id: memberId,
                },
            });
            if (response && response.success === 1) {
                const fetchedData = response.data.user;
                setUserData(fetchedData);
                setFormData({
                    name: fetchedData.name || "",
                    email: fetchedData.email || "",
                    phone_code: fetchedData.phone_code || "",
                    phone_number: fetchedData.phone || "",
                    whatsapp_number: fetchedData.whatsapp_no || "",
                    address: fetchedData.address || "",
                    city: fetchedData.city_id || "",
                    website_title: fetchedData.website_title || "",
                    website_url: fetchedData.website_url || "",
                    description: fetchedData.description || "",
                });
            } else {
                toast.error(response.message || "Failed to fetch user data.");
            }
        } catch (error) {
            toast.error("An error occurred while fetching user data.");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await callApi({
                api: `/update_my_profile`,
                method: "POST",
                data: formData,
            });
            if (response && response.success === 1) {
                fetchUserData();
                toast.success(response.message || "Profile updated successfully!");
            } else {
                toast.error(response.message || "Failed to update profile.");
            }
        } catch (error) {
            toast.error("An error occurred while updating your profile.");
        }
    };

    if (!formData) {
        return <div className="loading-spinner"></div>;
    }

    return (
        <DashboardLayout>
            <div className="col-xl-9 col-lg-9 col-12">
                <h1 className="h4 text-primary mb-4">Profile Update</h1>
                <form
                    className="authentication-form"
                    autoComplete="off"
                    onSubmit={handleSubmit}
                >
                    <div className="row g-4">
                        {/* Name */}
                        <div className="col-md-6 col-12">
                            <div className="floating-label-group">
                                <input
                                    type="text"
                                    name="name"
                                    className="form-control"
                                    placeholder="Enter your name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="col-md-6 col-12">
                            <div className="floating-label-group">
                                <input
                                    type="text"
                                    name="email"
                                    className="form-control"
                                    placeholder="Your email address"
                                    disabled
                                    value={formData.email}
                                />
                            </div>
                        </div>

                        {/* Phone Number */}
                        <div className="col-md-6 col-12">
                            <div className="row">
                                <div className="col-lg-3">
                                    <div className="floating-label-group">
                                        <select
                                            className="form-control"
                                            name="phone_code"
                                            value={formData.phone_code}
                                            onChange={handleChange}
                                        >
                                            <option value="IND +91">
                                                IND +91
                                            </option>
                                            <option value="+71">+71</option>
                                            <option value="+81">+81</option>
                                            <option value="+30">+30</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-9">
                                    <div className="floating-label-group">
                                        <input
                                            type="text"
                                            name="phone_number"
                                            className="form-control"
                                            placeholder="Enter your phone number"
                                            required
                                            value={formData.phone_number}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* WhatsApp Number */}
                        <div className="col-md-6 col-12">
                            <div className="floating-label-group">
                                <input
                                    type="text"
                                    name="whatsapp_number"
                                    className="form-control"
                                    placeholder="Enter your WhatsApp number"
                                    value={formData.whatsapp_number}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Address */}
                        <div className="col-md-6 col-12">
                            <div className="floating-label-group">
                                <input
                                    type="text"
                                    name="address"
                                    className="form-control"
                                    placeholder="Enter your address"
                                    value={formData.address}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* City */}
                        <div className="col-md-6 col-12">
                            <div className="floating-label-group">
                                <select
                                    name="city"
                                    className="form-control"
                                    value={formData.city}
                                    onChange={handleChange}
                                >
                                    <option value="">Select City</option>
                                    {userData?.cities?.map((city) => (
                                        <option key={city.city_id} value={city.city_id}>
                                            {city.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Website Title */}
                        <div className="col-md-6 col-12">
                            <div className="floating-label-group">
                                <input
                                    type="text"
                                    name="website_title"
                                    className="form-control"
                                    placeholder="Enter your website title"
                                    value={formData.website_title}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Website URL */}
                        <div className="col-md-6 col-12">
                            <div className="floating-label-group">
                                <input
                                    type="text"
                                    name="website_url"
                                    className="form-control"
                                    placeholder="Enter your website URL"
                                    value={formData.website_url}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="floating-label-group mt-4">
                        <textarea
                            name="description"
                            className="form-control"
                            placeholder="Write a brief description about yourself"
                            rows="5"
                            value={formData.description}
                            onChange={handleChange}
                        ></textarea>
                    </div>

                    {/* Submit Button */}
                    <div className="d-grid mt-4">
                        <button type="submit" className="btn btn-primary mb-2">
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
};

export default ProfileForm;
