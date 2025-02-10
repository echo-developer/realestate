"use client";
import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AuthUser from "@/components/Authentication/AuthUser";
import { toast } from "react-toastify";

const ProfileForm = () => {
  const { callApi, GetMemberId } = AuthUser();
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_code: "",
    phone: "",
    whatsapp: "",
    address: "",
    city_id: "",
    website_title: "",
    website_url: "",
    description: "",
    user_id: "",
  });
  const [errors, setErrors] = useState({});

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
        setUserData(response.data);
        setFormData({
          name: response.data.user.name || "",
          email: response.data.user.email || "",
          phone_code: response.data.user.phone_code || "",
          phone: response.data.user.phone || "",
          whatsapp: response.data.user.whatsapp_no || "",
          address: response.data.user.address || "",
          city_id: response.data.user.city || "", // Ensure city is mapped correctly
          website_title: response.data.user.website_title || "",
          website_url: response.data.user.website_url || "",
          description: response.data.user.description || "",
          user_id: memberId,
        });
      } else {
        toast.error(response.message || "Failed to fetch user data.");
      }
    } catch (error) {
      toast.error("An error occurred while fetching user data.");
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = "Invalid email format.";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^\d{10,15}$/.test(formData.phone)) {
      newErrors.phone = "Invalid phone number format.";
    }
    if (formData.website_url && !/^https?:\/\/.+/i.test(formData.website_url)) {
      newErrors.website_url = "Invalid website URL.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await callApi({
        api: `/update_my_profile`,
        method: "UPLOAD",
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

  if (!userData) {
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
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && (
                  <small className="text-danger">{errors.name}</small>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="col-md-6 col-12">
              <div className="floating-label-group">
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Your email address"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <small className="text-danger">{errors.email}</small>
                )}
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
                      <option value="">Code</option>
                      <option value="IND +91">IND +91</option>
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
                      name="phone"
                      className="form-control"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                    {errors.phone && (
                      <small className="text-danger">{errors.phone}</small>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp Number */}
            <div className="col-md-6 col-12">
              <div className="floating-label-group">
                <input
                  type="text"
                  name="whatsapp"
                  className="form-control"
                  placeholder="Enter your WhatsApp number"
                  value={formData.whatsapp}
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
                  name="city_id"
                  className="form-control"
                  value={formData.city_id}
                  onChange={handleChange}
                >
                  <option value="">Select City</option>
                  {userData?.cities?.map((city) => (
                    <option
                      key={city?.city_id}
                      value={city?.city_id.toString()}
                    >
                      {city?.name}
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
                {errors.website_url && (
                  <small className="text-danger">{errors.website_url}</small>
                )}
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