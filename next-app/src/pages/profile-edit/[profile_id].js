"use client";
import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AuthUser from "@/components/Authentication/AuthUser";
import { toast } from "react-toastify";
import BusinessAddressForm from "@/components/profile/BusinessForm";
import SocialMediaLinks from "@/components/profile/SocialMedia";
import { X } from "lucide-react";
import useTranslation from "@/hooks/useTranslation";

import {
  Form,
  Row,
  Col,
  ListGroup,
  FloatingLabel,
} from "react-bootstrap";

const ProfileForm = () => {
  const { callApi, GetMemberId } = AuthUser();
  const [userData, setUserData] = useState(null);
  const [userType, setUserType] = useState("");
  const [addresses, setAddresses] = useState([
    { key: "service_1", city: "", locality: "" },
  ]);
  const translation = useTranslation();

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
          setPreview(response.data.user.agent_docucment || "");
          if (response?.data?.user?.service_area?.length > 0) {
            let addressState = [];
            response?.data?.user?.service_area?.forEach((item, i) => {
              addressState.push({
                key: item?.loc_key,
                city: item?.city,
                locality: item?.locality,
                latitude: item?.latitude,
                longitude: item?.longitude,
              });
            });
            setAddresses(addressState);
          }

          if (response?.data?.user?.social?.length > 0) {
            let socialSTate = [];
            response?.data?.user?.social?.forEach((item, i) => {
              socialSTate.push({
                key: item?.platform_key,
                name: item?.platform_name,
                url: item?.platform_url,
              });
            });
            setSocialLinks(socialSTate);
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
          user_id: memberId,
        },
      });
      if (response && response.status === 1) {
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
      toast.error("Invalid file type. Please upload a PNG, JPG, or PDF.");
      return;
    }

    // Validate file size
    if (file.size > maxSize) {
      toast.error("File size exceeds 2MB. Please upload a smaller file.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("user_id", memberId);

      const response = await callApi({
        api: "/uploadDocument",
        method: "POST",
        data: formData,
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

  const removeFile = async () => {
    setUploadedFile(null);
    setPreview(null);
    setFormData((prev) => {
      return {
        ...prev,
        agent_document: "",
      };
    });
    try {
      const response = await callApi({
        api: `/remove_document`,
        method: "UPLOAD",
        data: {
          user_id: memberId,
        },
      });
      if(response&& response.status===1){
        toast.success(response.message || 'Document Removed Successfully')
      }
    } catch (error) {}
  };

  return (
    <DashboardLayout>
      <div className="col-lg col-12">
        <div className="p-4">
        <h1 className="h4 text-primary mb-4">
          {translation?.profile_update || "Profile Update"}
        </h1>
        <form
          className="authentication-form"
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          
            {/* Common Fields */}
            <Row>
              {/* Name */}
              <div className="col-md-6 col-12">
                <FloatingLabel
                  controlId="floatingInput"
                  label={
                    translation?.enter_your_name || "Enter your name"
                  }
                  className="mb-4"
                >
                  <Form.Control
                    name="name"
                    placeholder={
                      translation?.enter_your_name || "Enter your name"
                    }
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {errors.name && (
                    <small className="text-danger">{errors.name}</small>
                  )}
                </FloatingLabel>
              </div>

              {/* Email */}
              <div className="col-md-6 col-12">
                <FloatingLabel
                    controlId="floatingInput"
                    label={
                      translation?.your_email_address || "Your email address"
                    }
                    className="mb-4"
                  >
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder={
                      translation?.your_email_address || "Your email address"
                    }
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && (
                    <small className="text-danger">{errors.email}</small>
                  )}
                </FloatingLabel>
              </div>

              {/* Phone Number */}
              <div className="col-md-6 col-12">
                <div className="input-group mb-4">                  
                  <FloatingLabel controlId="floatingSelect" label={translation?.code || "Code"}
                  style={{maxWidth: '120px'}}>
                    <Form.Select
                      name="phone_code"
                      value={formData.phone_code}
                      onChange={handleChange}
                      
                    >
                      <option value="">{translation?.code || "Code"}</option>
                      <option value="IND +91">IND +91</option>
                      <option value="+71">+71</option>
                      <option value="+81">+81</option>
                      <option value="+30">+30</option>
                    </Form.Select>
                  </FloatingLabel>
                
                  <FloatingLabel
                    controlId="floatingInput"
                    label={
                      translation?.enter_your_phone_number ||
                      "Enter your phone number"
                    }
                  >
                    <Form.Control
                      type="text"
                      name="phone"
                      placeholder={
                        translation?.enter_your_phone_number ||
                        "Enter your phone number"
                      }
                      value={formData.phone}
                      onChange={handleChange}
                    />
                    {errors.phone && (
                      <small className="text-danger">{errors.phone}</small>
                    )}
                  </FloatingLabel>                  
                </div>
              </div>

              {/* WhatsApp Number */}
              <div className="col-md-6 col-12">
                <FloatingLabel
                  controlId="floatingInput"
                  label={
                    translation?.enter_your_whatsapp_number || "Enter your WhatsApp number"
                  }
                  className="mb-4"
                >
                  <Form.Control
                    type="text"
                    name="whatsapp"
                    placeholder={
                      translation?.enter_your_whatsapp_number ||
                      "Enter your WhatsApp number"
                    }
                    value={formData.whatsapp}
                    onChange={handleChange}
                  />
                </FloatingLabel>
              </div>

              {/* Address */}
              <div className="col-md-6 col-12">
                <FloatingLabel
                  controlId="floatingInput"
                  label={
                    translation?.enter_your_address || "Enter your address"
                  }
                  className="mb-4"
                >
                  <Form.Control
                    type="text"
                    name="address"
                    placeholder={
                      translation?.enter_your_address || "Enter your address"
                    }
                    value={formData.address}
                    onChange={handleChange}
                  />
                </FloatingLabel>
              </div>

              {/* City */}
              <div className="col-md-6 col-12">
                <FloatingLabel className="mb-4" controlId="floatingSelect" label={translation?.select_city || "Select City"}>
                  <Form.Select
                    name="city_id"
                    value={formData.city_id}
                    onChange={handleChange}
                  >
                    <option value="">
                      {translation?.select_city || "Select City"}{" "}
                    </option>
                    {userData?.cities?.map((city) => (
                      <option
                        key={city?.city_id}
                        value={city?.city_id.toString()}
                      >
                        {city?.name}
                      </option>
                    ))}
                  </Form.Select>
                </FloatingLabel>
              </div>

              {/* Website Title */}
              <div className="col-md-6 col-12">
                <FloatingLabel
                  controlId="floatingInput"
                  label="Website Title"
                  className="mb-4"
                >
                  <Form.Control
                    type="text"
                    name="website_title"
                    placeholder={
                      translation?.enter_your_website_title ||
                      "Enter your website title"
                    }
                    value={formData.website_title}
                    onChange={handleChange}
                  />
                </FloatingLabel>
              </div>

              {/* Website URL */}
              <div className="col-md-6 col-12">
                <FloatingLabel
                  controlId="floatingInput"
                  label="Website URL"
                  className="mb-4"
                >
                  <Form.Control
                    type="text"
                    name="website_url"
                    placeholder={
                      translation?.enter_your_website_url ||
                      "Enter your website URL"
                    }
                    value={formData.website_url}
                    onChange={handleChange}
                  />
                  {errors.website_url && (
                    <small className="text-danger">{errors.website_url}</small>
                  )}
                </FloatingLabel>
              </div>
            </Row>
            {userType === "A" && (

              <>
              <Row>
                <div className="col-md-6 col-12">
                  <FloatingLabel
                    controlId="floatingInput"
                    label={translation?.company_name || "Company Name"}
                    className="mb-4"
                  >
                    <Form.Control
                      type="text"
                      name="company_name"
                      placeholder={translation?.company_name || "Company Name"}
                      value={formData.company_name}
                      onChange={handleChange}
                    />
                  </FloatingLabel>                  
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
                      : `${translation?.upload_document ||"Upload Document (PDF, DOC, JPG, PNG)" }`}
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
                      {preview.split(".").pop().toLowerCase() === "pdf" ? (
                        // Show PDF Preview
                        <div className="d-flex align-items-center">
                          <i
                            className="bi bi-file-earmark-pdf text-danger"
                            style={{ fontSize: "2rem" }}
                          ></i>
                          <p className="mb-0 ms-2">{uploadedFile?.name}</p>
                          <a
                            href={preview}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary btn-sm ms-2"
                          >
                            {translation?.view || "View"}
                          </a>
                          <button
                            type="button"
                            className="btn btn-danger btn-sm ms-2"
                            onClick={removeFile}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        // Show Image Preview
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
                    </div>
                  )}
                </div>
                <div className="col-md-6 col-12">
                  <FloatingLabel
                    controlId="floatingInput"
                    label={
                      translation?.license_number || "License Number"
                    }
                    className="mb-4"
                  >
                    <Form.Control
                      type="text"
                      name="license_number"
                      placeholder={translation?.license_number || "License Number"}
                      value={formData.license_number}
                      onChange={handleChange}
                    />
                  </FloatingLabel>
                </div>
                <div className="col-md-6 col-12">
                  <FloatingLabel
                    controlId="floatingInput"
                    label={
                      translation?.experience_years || "Experience (Years)"
                    }
                    className="mb-4"
                  >
                    <Form.Control
                      type="text"
                      name="experience_years"
                      placeholder={translation?.experience_years || "Experience (Years)"}
                      value={formData.experience_years}
                      onChange={handleChange}
                    />
                  </FloatingLabel>
                </div>
                <div className="col-md-6 col-12">
                  <FloatingLabel
                    controlId="floatingInput"
                    label={
                      translation?.specialization || "Specialization"
                    }
                    className="mb-4"
                  >
                    <Form.Control
                      type="text"
                      name="specialization"
                      placeholder={translation?.specialization || "Specialization"}
                      value={formData.specialization}
                      onChange={handleChange}
                    />
                  </FloatingLabel>
                </div>
                <div className="col-md-6 col-12">
                  <label className="form-label">
                    {translation?.broker_type || "Broker Type"}
                  </label>
                  {['radio'].map((type) => (
                  <div key={`inline-${type}`} className="mb-3">
                    
                    <Form.Check
                      inline
                      type={type}
                      label={translation?.independent || "Independent"}
                      name="broker_type"
                      value="Independent"
                      checked={formData.broker_type === "Independent"}
                      onChange={handleChange}
                      id={`broker_type_1`}
                    />                    
                    <Form.Check
                      inline
                      type={type}
                      label={translation?.agency || "Agency"}
                      name="broker_type"
                      value="Agency"
                      checked={formData.broker_type === "Agency"}
                      onChange={handleChange}
                      id={`broker_type_2`}
                    />                                          
                    <Form.Check
                        inline
                        type={type}
                        label={translation?.franchise || "Franchise"}
                        name="broker_type"
                        value="Franchise"
                        checked={formData.broker_type === "Franchise"}
                        onChange={handleChange}
                        id={`broker_type_3`}
                      />                      
                  </div>
                  ))}
                </div>

                <Col className="col-12">
                  <BusinessAddressForm
                    addresses={addresses}
                    setAddresses={setAddresses}
                  />
                </Col>

                <div className="col-md-6 col-12">
                  <FloatingLabel
                      controlId="floatingInput"
                      label={
                        translation?.bussiness_phone || "Business Phone"
                      }
                      className="mb-4"
                    >
                      <Form.Control
                      type="text"
                      name="business_phone"
                      placeholder={translation?.bussiness_phone || "Business Phone" }
                      value={formData.business_phone}
                      onChange={handleChange}
                    />
                  </FloatingLabel>
                </div>
                <div className="col-md-6 col-12">
                  <FloatingLabel
                      controlId="floatingInput"
                      label={translation?.business_email ||"Business Email" }
                      className="mb-4"
                    >
                      <Form.Control
                      type="text"
                      name="business_email"
                      className="form-control"
                      placeholder={translation?.business_email ||"Business Email" }
                      value={formData.business_email}
                      onChange={handleChange}
                    />
                  </FloatingLabel>
                </div>
                <Col className="col-12">
                  <SocialMediaLinks
                    socialLinks={socialLinks}
                    setSocialLinks={setSocialLinks}
                  />
                </Col>                

                <Col className="col-sm-6 col-12">
                  <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>{translation?.opening_hours || "Opening Hours"}</Form.Label>
                    <Form.Control 
                      type="time"
                      name="opening_hours"
                      value={formData.opening_hours}
                      placeholder=""
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>

                <Col className="col-sm-6 col-12">
                  <Form.Group className="mb-4" controlId="exampleForm.ControlInput1">
                    <Form.Label>{translation?.closing_hours || "Closing Hours"}</Form.Label>
                    <Form.Control
                      type="time" 
                      name="closing_hours" 
                      value={formData.closing_hours} 
                      placeholder=""
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              </>
            )}

            {/* Description */}
           
            <FloatingLabel controlId="floatingTextarea2"
              label="Comments"
              className="mb-4"
              >
              <Form.Control
                as="textarea"
                name="description"
                placeholder={
                  translation?.write_a_brief_description_about_yourself ||
                  "Write a brief description about yourself"
                }
                rows="5"
                value={formData.description}
                onChange={handleChange}
                style={{ height: '100px' }}
              />
            </FloatingLabel>              
            
          

          <div className="d-grid d-sm-block">
            <button type="submit" className="btn btn-primary mb-2">
              {translation?.update || "Update"}
            </button>
          </div>
        </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfileForm;
