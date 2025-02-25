"use client";
import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AuthUser from "@/components/Authentication/AuthUser";
import { toast } from "react-toastify";
import BusinessAddressForm from "@/components/profile/BusinessForm";
import SocialMediaLinks from "@/components/profile/SocialMedia";
import { X } from "lucide-react";

const ProfileForm = () => {
  const { callApi, GetMemberId } = AuthUser();
  const [userData, setUserData] = useState(null);
  const [userType, setUserType] = useState("");
  const [addresses, setAddresses] = useState([
    { key: "service_1", city: "", locality: "" },
  ]);
  const [socialLinks, setSocialLinks] = useState([
    { key: "social_1", name: "", url: "" },
  ]);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [preview, setPreview] = useState(null);

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
    broker_type: "",
    opening_hours: "",
    closing_hours: "",
    company_name: "",
    license_number: "",
    experience_years: "",
    specialization: "",
    specialization: "",
    business_phone: "",
    business_email: "",
    social_media: "",
    agent_document: "",
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
      if (response && response.status === 1) {
        setUserData(response.data);
        setUserType(response.data.user.user_type);
        const updatedFormData = {
          name: response.data.user.name || "",
          email: response.data.user.email || "",
          phone_code: response.data.user.phone_code || "",
          phone: response.data.user.phone || "",
          whatsapp: response.data.user.whatsapp_no || "",
          address: response.data.user.address || "",
          city_id: response.data.user.city || "",
          website_title: response.data.user.website_title || "",
          website_url: response.data.user.website_url || "",
          description: response.data.user.description || "",
          user_id: memberId,
        };

        if (response.data.user.user_type === "A") {
          Object.assign(updatedFormData, {
            company_name: response.data.user.company_name || "",
            license_number: response.data.user.license_no || "",
            experience_years: response.data.user.experience_yr || "",
            specialization: response.data.user.specialization || "",
            broker_type: response.data.user.broker_type || "",
            agent_document: response.data.user.agent_docucment || "",
            business_phone: response.data.user.bussiness_phone || "",
            business_email: response.data.user.bussiness_email || "",
            opening_hours: response.data.user.opening_hours || "",
            closing_hours: response.data.user.closing_hours || "",
            social_media: response.data.user.social_media || "",
          });
          setPreview(response.data.user.agent_docucment || "")
          if(response?.data?.user?.service_area?.length > 0) {
            let addressState = [];
          response?.data?.user?.service_area?.forEach((item, i) => {
            addressState.push({
              "key": item?.loc_key,
              "city": item?.city,
              "locality": item?.locality,
              "latitude": item?.latitude,
              "longitude": item?.longitude,
          })
          })
          setAddresses(addressState)
          }

          if(response?.data?.user?.social?.length > 0) {
            let socialSTate = [];
          response?.data?.user?.social?.forEach((item, i) => {
            socialSTate.push({
              "key": item?.platform_key,
              "name": item?.platform_name,
              "url": item?.platform_url
          })
          })
          setSocialLinks(socialSTate)
          }
        }

        setFormData(updatedFormData);
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
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await callApi({
        api: `/update_my_profile`,
        method: "UPLOAD",
        data: {
          ...formData,
          service_area: JSON.stringify(addresses),
          social_media: JSON.stringify(socialLinks),
          user_id: memberId
        },
      });
      if (response && response.success === 1) {
        fetchUserData();
        toast.success(response.message || "Profile updated successfully!");
      } else {
        // toast.error(response.message || "Failed to update profile.");
      }
    } catch (error) {
      toast.error("An error occurred while updating your profile.");
    }
  };

  if (!userData) {
    return <div className="loading-spinner"></div>;
  }

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/png", "image/jpeg", "application/pdf"];
    const maxSize = 2 * 1024 * 1024; // 2MB

    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      alert("Invalid file type. Please upload a PNG, JPG, or PDF.");
      return;
    }

    // Validate file size
    if (file.size > maxSize) {
      alert("File size exceeds 2MB. Please upload a smaller file.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("user_id", memberId);

      const response = await callApi({
        api: "/uploadDocument",
        method: "POST",
        data: formData
      });

      if (response?.status === 1) {
        toast.success("File uploaded successfully!");
      } else {
        // toast.error(response?.message || "Failed to upload file.");
      }
    } catch (error) {
      toast.error("An error occurred while uploading the file.");
    }

    // Preview file
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(file.type.includes("image") ? e.target.result : null);
      setUploadedFile(file);
    };

    if (file.type.includes("image")) {
      reader.readAsDataURL(file);
    } else {
      setUploadedFile(file);
      setPreview(null);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setPreview(null);
  };

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
            {/* Common Fields */}
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
            {userType === "A" && (
              <>
                <div className="col-md-6 col-12">
                  <input
                    type="text"
                    name="company_name"
                    className="form-control"
                    placeholder="Company Name"
                    value={formData.company_name}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 col-12">
                  {/* File Upload Label */}
                  <label
                    htmlFor="agent_document"
                    style={{
                      display: "block",
                      background: "#f8f9fa",
                      border: "1px solid #ced4da",
                      padding: "10px",
                      borderRadius: "5px",
                      textAlign: "center",
                      cursor: "pointer",
                      color: "#6c757d",
                    }}
                  >
                    {uploadedFile
                      ? uploadedFile.name
                      : "Upload Document (PDF, DOC, JPG, PNG)"}
                  </label>

                  {/* Hidden File Input */}
                  <input
                    type="file"
                    id="agent_document"
                    name="agent_document"
                    style={{ display: "none" }}
                    accept=".pdf,.doc,.docx,.jpg,.png"
                    onChange={handleFileUpload}
                  />

                  {/* Preview Section */}
                  {preview && (
                    <div className="mt-2 d-flex align-items-center gap-2">
                      {preview && (
                        <div className="position-relative">
                          <img
                            src={preview}
                            alt="Preview"
                            style={{
                              maxWidth: "100px",
                              height: "auto",
                              borderRadius: "5px",
                            }}
                          />
                          <button
                            type="button"
                            className="btn btn-danger btn-sm position-absolute"
                            style={{
                              top: "-5px",
                              right: "-5px",
                              borderRadius: "50%",
                              padding: "2px 5px",
                            }}
                            onClick={removeFile}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      )}

                      {!preview && (
                        <div className="d-flex align-items-center">
                          <p className="mb-0">{uploadedFile.name}</p>
                          <button
                            type="button"
                            className="btn btn-danger btn-sm ms-2"
                            onClick={removeFile}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="col-md-6 col-12">
                  <input
                    type="text"
                    name="license_number"
                    className="form-control"
                    placeholder="License Number"
                    value={formData.license_number}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 col-12">
                  <input
                    type="text"
                    name="experience_years"
                    className="form-control"
                    placeholder="Experience (Years)"
                    value={formData.experience_years}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 col-12">
                  <input
                    type="text"
                    name="specialization"
                    className="form-control"
                    placeholder="Specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 col-12">
                  <label className="form-label">Broker Type</label>
                  <div
                    style={{
                      display: "flex",
                      gap: "15px",
                      alignItems: "center",
                    }}
                  >
                    <div className="form-check">
                      <input
                        type="radio"
                        name="broker_type"
                        value="Independent"
                        className="form-check-input"
                        checked={formData.broker_type === "Independent"}
                        onChange={handleChange}
                      />
                      <label className="form-check-label">Independent</label>
                    </div>
                    <div className="form-check">
                      <input
                        type="radio"
                        name="broker_type"
                        value="Agency"
                        className="form-check-input"
                        checked={formData.broker_type === "Agency"}
                        onChange={handleChange}
                      />
                      <label className="form-check-label">Agency</label>
                    </div>
                    <div className="form-check">
                      <input
                        type="radio"
                        name="broker_type"
                        value="Franchise"
                        className="form-check-input"
                        checked={formData.broker_type === "Franchise"}
                        onChange={handleChange}
                      />
                      <label className="form-check-label">Franchise</label>
                    </div>
                  </div>
                </div>
                <BusinessAddressForm
                  addresses={addresses}
                  setAddresses={setAddresses}
                />

                <div className="col-md-6 col-12">
                  <input
                    type="text"
                    name="business_phone"
                    className="form-control"
                    placeholder="Business Phone"
                    value={formData.business_phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 col-12">
                  <input
                    type="text"
                    name="business_email"
                    className="form-control"
                    placeholder="Business Email"
                    value={formData.business_email}
                    onChange={handleChange}
                  />
                </div>
                <SocialMediaLinks
                  socialLinks={socialLinks}
                  setSocialLinks={setSocialLinks}
                />

                <div className="col-md-6 col-12">
                  <label className="form-label">Opening Hours</label>
                  <input
                    type="time"
                    name="opening_hours"
                    className="form-control"
                    value={formData.opening_hours}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6 col-12">
                  <label className="form-label">Closing Hours</label>
                  <input
                    type="time"
                    name="closing_hours"
                    className="form-control"
                    value={formData.closing_hours}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}

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
          </div>

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
