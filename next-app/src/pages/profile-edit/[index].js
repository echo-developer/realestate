"use client";
import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AuthUser from "@/components/Authentication/AuthUser";
import { toast } from "react-toastify";

const ProfileForm = () => {
  const { callApi, GetMemberId } = AuthUser();
  const [userData, setUserData] = useState(null);
  const [userType, setUserType] = useState("");
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
        data: { user_id: memberId },
      });
      if (response?.success === 1) {
        setUserData(response.data);
        setUserType(response.data.user.user_type);
      } else {
        toast.error(response.message || "Failed to fetch user data.");
      }
    } catch (error) {
      toast.error("An error occurred while fetching user data.");
    }
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, "Name must be at least 2 characters")
      .required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    phone_code: Yup.string().required("Phone code is required"),
    phone: Yup.string()
      .matches(/\d+$/, "Phone number must contain only digits")
      .min(10, "Phone number must be at least 10 digits")
      .required("Phone number is required"),
    whatsapp: Yup.string()
      .matches(/\d*$/, "WhatsApp number must contain only digits")
      .nullable(),
    address: Yup.string()
      .min(5, "Address must be at least 5 characters")
      .required("Address is required"),
    city_id: Yup.string().required("City is required"),
    website_title: Yup.string().optional(),
    website_url: Yup.string()
      .url("Invalid website URL")
      .optional()
      .nullable(),
    description: Yup.string()
      .min(10, "Description must be at least 10 characters")
      .required("Description is required"),
    opening_hours: Yup.string().required("Opening hours are required"),
    closing_hours: Yup.string().required("Closing hours are required"),
    broker_type: Yup.string()
      .oneOf(["Independent", "Agency", "Franchise"], "Invalid broker type")
      .required("Broker type is required"),
    company_name: Yup.string().optional(),
    license_number: Yup.string().optional(),
    experience_years: Yup.string()
      .matches(/^\d+$/, "Experience must be a number")
      .optional(),
    specialization: Yup.string().optional(),
    website: Yup.string().url("Invalid website").optional().nullable(),
    business_address: Yup.string().optional(),
    business_phone: Yup.string()
      .matches(/^\d+$/, "Business phone must contain only digits")
      .optional(),
    business_email: Yup.string().email("Invalid business email").optional(),
    social_media: Yup.string().optional(),
    rating: Yup.string()
      .matches(/^[0-5](\.[0-9])?$/, "Rating must be between 0 and 5")
      .optional(),
  });

  const handleSubmit = async (values) => {
    try {
      const response = await callApi({
        api: `/update_my_profile`,
        method: "UPLOAD",
        data: values,
      });
      if (response?.success === 1) {
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
        <Formik
          initialValues={{
            name: userData?.user?.name || "",
            email: userData?.user?.email || "",
            phone_code: userData?.user?.phone_code || "",
            phone: userData?.user?.phone || "",
            whatsapp: userData?.user?.whatsapp_no || "",
            address: userData?.user?.address || "",
            city_id: "", // Dropdown selection
            website_title: userData?.user?.website_title || "",
            website_url: userData?.user?.website_url || "",
            description: userData?.user?.description || "",
            user_id: userData?.user?.user_id || "",
            opening_hours: "", // Time input field
            closing_hours: "", // Time input field
            broker_type: "",  // Radio button selection
            company_name: userData?.user?.company_name || "",
            license_number: userData?.user?.license_number || "",
            experience_years: userData?.user?.experience_years || "",
            specialization: userData?.user?.specialization || "",
            website: userData?.user?.website || "",
            business_address: userData?.user?.business_address || "",
            business_phone: userData?.user?.business_phone || "",
            business_email: userData?.user?.business_email || "",
            social_media: userData?.user?.social_media || "",
            rating: userData?.user?.rating || "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="authentication-form">
              <div className="row g-4">
                {/* Normal Input Fields */}
                <div className="col-md-6">
                  <Field type="text" name="name" className="form-control" placeholder="Name" />
                  <ErrorMessage name="name" component="small" className="text-danger" />
                </div>
                <div className="col-md-6">
                  <Field type="email" name="email" className="form-control" placeholder="Email" />
                  <ErrorMessage name="email" component="small" className="text-danger" />
                </div>
                <div className="col-md-6">
                  <Field type="text" name="phone_code" className="form-control" placeholder="Phone Code" />
                  <ErrorMessage name="phone_code" component="small" className="text-danger" />
                </div>
                <div className="col-md-6">
                  <Field type="text" name="phone" className="form-control" placeholder="Phone" />
                  <ErrorMessage name="phone" component="small" className="text-danger" />
                </div>
                <div className="col-md-6">
                  <Field type="text" name="whatsapp" className="form-control" placeholder="WhatsApp" />
                  <ErrorMessage name="whatsapp" component="small" className="text-danger" />
                </div>
                <div className="col-md-6">
                  <Field type="text" name="address" className="form-control" placeholder="Address" />
                  <ErrorMessage name="address" component="small" className="text-danger" />
                </div>
                <div className="col-md-6">
                  <Field type="text" name="website_title" className="form-control" placeholder="Website Title" />
                  <ErrorMessage name="website_title" component="small" className="text-danger" />
                </div>
                <div className="col-md-6">
                  <Field type="text" name="website_url" className="form-control" placeholder="Website URL" />
                  <ErrorMessage name="website_url" component="small" className="text-danger" />
                </div>
                <div className="col-md-6">
                  <Field type="text" name="company_name" className="form-control" placeholder="Company Name" />
                  <ErrorMessage name="company_name" component="small" className="text-danger" />
                </div>
                <div className="col-md-6">
                  <Field type="text" name="license_number" className="form-control" placeholder="License Number" />
                  <ErrorMessage name="license_number" component="small" className="text-danger" />
                </div>
                <div className="col-md-6">
                  <Field type="text" name="experience_years" className="form-control" placeholder="Experience (Years)" />
                  <ErrorMessage name="experience_years" component="small" className="text-danger" />
                </div>
                <div className="col-md-6">
                  <Field type="text" name="specialization" className="form-control" placeholder="Specialization" />
                  <ErrorMessage name="specialization" component="small" className="text-danger" />
                </div>
                <div className="col-md-6">
                  <Field type="text" name="website" className="form-control" placeholder="Website" />
                  <ErrorMessage name="website" component="small" className="text-danger" />
                </div>
                <div className="col-md-6">
                  <Field type="text" name="business_address" className="form-control" placeholder="Business Address" />
                  <ErrorMessage name="business_address" component="small" className="text-danger" />
                </div>
                <div className="col-md-6">
                  <Field type="text" name="business_phone" className="form-control" placeholder="Business Phone" />
                  <ErrorMessage name="business_phone" component="small" className="text-danger" />
                </div>
                <div className="col-md-6">
                  <Field type="email" name="business_email" className="form-control" placeholder="Business Email" />
                  <ErrorMessage name="business_email" component="small" className="text-danger" />
                </div>
                <div className="col-md-6">
                  <Field type="text" name="social_media" className="form-control" placeholder="Social Media" />
                  <ErrorMessage name="social_media" component="small" className="text-danger" />
                </div>
                <div className="col-md-6">
                  <Field type="text" name="rating" className="form-control" placeholder="Rating" />
                  <ErrorMessage name="rating" component="small" className="text-danger" />
                </div>
                {/* Special Fields */}
                <div className="col-md-12">
                  <label>Description</label>
                  <Field as="textarea" name="description" className="form-control" placeholder="Enter description" />
                  <ErrorMessage name="description" component="small" className="text-danger" />
                </div>
                <div className="col-md-6">
                  <label>City</label>
                  <Field as="select" name="city_id" className="form-control">
                    <option value="">Select City</option>
                    <option value="1">City 1</option>
                    <option value="2">City 2</option>
                  </Field>
                  <ErrorMessage name="city_id" component="small" className="text-danger" />
                </div>
                <div className="col-md-6">
                  <label>Opening Hours</label>
                  <Field type="time" name="opening_hours" className="form-control" />
                  <ErrorMessage name="opening_hours" component="small" className="text-danger" />
                </div>
                <div className="col-md-6">
                  <label>Closing Hours</label>
                  <Field type="time" name="closing_hours" className="form-control" />
                  <ErrorMessage name="closing_hours" component="small" className="text-danger" />
                </div>
                <div className="col-md-12">
                  <label>Broker Type</label>
                  <div role="group" aria-labelledby="brokerType">
                    <label>
                      <Field type="radio" name="broker_type" value="Independent" /> Independent
                    </label>
                    <label>
                      <Field type="radio" name="broker_type" value="Agency" /> Agency
                    </label>
                    <label>
                      <Field type="radio" name="broker_type" value="Franchise" /> Franchise
                    </label>
                  </div>
                  <ErrorMessage name="broker_type" component="small" className="text-danger" />
                </div>
              </div>
              <div className="d-grid mt-4">
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? "Updating..." : "Update"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </DashboardLayout>
  );
};

export default ProfileForm;
