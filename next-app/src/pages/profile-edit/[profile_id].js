"use client";
import React, { useState, useEffect, useRef } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AuthUser from "@/components/Authentication/AuthUser";
import { toast } from "react-toastify";
import BusinessAddressForm from "@/components/profile/BusinessForm";
import SocialMediaLinks from "@/components/profile/SocialMedia";
import { X } from "lucide-react";
import useTranslation from "@/hooks/useTranslation";
import { Modal } from "react-bootstrap";
import CropperModal from "@/components/profile/Cropper";

import {
  Button,
  Form,
  Row,
  Col,
  ListGroup,
  FloatingLabel,
  Card
} from "react-bootstrap";

const languageOptions = [
  "Afrikaans",
  "Albanian",
  "Amharic",
  "Arabic",
  "Aragonese",
  "Armenian",
  "Asturian",
  "Azerbaijani",
  "Basque",
  "Belarusian",
  "Bengali",
  "Bosnian",
  "Breton",
  "Bulgarian",
  "Catalan",
  "Central Kurdish",
  "Chinese",
  "Chinese (Hong Kong)",
  "Chinese (Simplified)",
  "Chinese (Traditional)",
  "Corsican",
  "Croatian",
  "Czech",
  "Danish",
  "Dutch",
  "English",
  "English (Australia)",
  "English (Canada)",
  "English (India)",
  "English (New Zealand)",
  "English (South Africa)",
  "English (United Kingdom)",
  "English (United States)",
  "Esperanto",
  "Estonian",
  "Faroese",
  "Filipino",
  "Finnish",
  "French",
  "French (Canada)",
  "French (France)",
  "French (Switzerland)",
  "Galician",
  "Georgian",
  "German",
  "German (Austria)",
  "German (Germany)",
  "German (Liechtenstein)",
  "German (Switzerland)",
  "Greek",
  "Guarani",
  "Gujarati",
  "Hausa",
  "Hawaiian",
  "Hebrew",
  "Hindi",
  "Hungarian",
  "Icelandic",
  "Indonesian",
  "Interlingua",
  "Irish",
  "Italian",
  "Italian (Italy)",
  "Italian (Switzerland)",
  "Japanese",
  "Kannada",
  "Kazakh",
  "Khmer",
  "Korean",
  "Kurdish",
  "Kyrgyz",
  "Lao",
  "Latin",
  "Latvian",
  "Lingala",
  "Lithuanian",
  "Macedonian",
  "Malay",
  "Malayalam",
  "Maltese",
  "Marathi",
  "Mongolian",
  "Nepali",
  "Norwegian",
  "Norwegian Bokmål",
  "Norwegian Nynorsk",
  "Occitan",
  "Oriya",
  "Oromo",
  "Pashto",
  "Persian",
  "Polish",
  "Portuguese",
  "Portuguese (Brazil)",
  "Portuguese (Portugal)",
  "Punjabi",
  "Quechua",
  "Romanian",
  "Romanian (Moldova)",
  "Romansh",
  "Russian",
  "Scottish Gaelic",
  "Serbian",
  "Serbo",
  "Shona",
  "Sindhi",
  "Sinhala",
  "Slovak",
  "Slovenian",
  "Somali",
  "Southern Sotho",
  "Spanish",
  "Spanish (Argentina)",
  "Spanish (Latin America)",
  "Spanish (Mexico)",
  "Spanish (Spain)",
  "Spanish (United States)",
  "Sundanese",
  "Swahili",
  "Swedish",
  "Tajik",
  "Tamil",
  "Tatar",
  "Telugu",
  "Thai",
  "Tigrinya",
  "Tongan",
  "Turkish",
  "Turkmen",
  "Twi",
  "Ukrainian",
  "Urdu",
  "Uyghur",
  "Uzbek",
  "Vietnamese",
  "Walloon",
  "Welsh",
  "Western Frisian",
  "Xhosa",
  "Yiddish",
  "Yoruba",
  "Zulu"
]

const ProfileForm = () => {
  const { callApi, GetMemberId } = AuthUser();
  const [userData, setUserData] = useState(null);
  const [userType, setUserType] = useState("");
  const [addresses, setAddresses] = useState([
    { key: "service_1", city: "", locality: "" },
  ]);
  const translation = useTranslation();

  const [socialLinks, setSocialLinks] = useState([
    { key: "facebook", name: "Facebook", url: "" },
    { key: "linkedin", name: "LinkedIn", url: "" },
    { key: "instagram", name: "Instragram", url: "" },
    { key: "youtube", name: "YouTube", url: "" },
  ]);

  const [showCoverModal, setShowCoverModal] = useState(false);
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
    company_logo: "",
    license_number: "",
    experience_years: "",
    languages: [],
    specialization: "",
    specialization: "",
    business_phone: "",
    business_email: "",
    social_media: "",
    agent_document: "",
  });

  const [errors, setErrors] = useState({});
  const [selectedCompanyLogo, setSelectedCompanyLogo] = useState(null);
  const memberId = GetMemberId();
  const [input, setInput] = useState("");
  const [languages, setLanguages] = useState(formData.languages || []);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCoverPhoto, setSelectedCoverPhoto] = useState("")
  const containerRef = useRef();

  useEffect(() => {
    if (memberId) {
      fetchUserData();
    }
  }, [memberId]);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [])

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
          company_logo: response.data?.user?.company_logo_name || ""
        };

        if (response.data.user.user_type === "A") {
          if (response.data?.user?.company_logo) {
            setSelectedCompanyLogo({
              file_name: response.data?.user?.company_logo_name,
              image_url: response.data?.user?.company_logo
            })
          }
          if(response.data?.user?.languages) {
            setLanguages(response.data.user.languages?.split(","))
          }
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
            company_logo: response.data?.user?.company_logo_name || "",
            languages: response.data?.user?.languages
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

            const mergedSocialLinks = socialLinks.map((defaultItem) => {
              const match = socialSTate.find((d) => d.key === defaultItem.key);
              return match
                ? {
                  key: match.platform_key,
                  name: defaultItem.name, 
                  url: match.url.replace(/\\\//g, "/") 
                }
                : defaultItem;
            });

            setSocialLinks(mergedSocialLinks);
          }
        }

        setFormData(updatedFormData);
      }
    } catch (error) {
      console.error("An error occurred while fetching user data.");
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
    const service_area = addresses.map(item => {
      if (typeof item.locality === 'object') {
        return {
          ...item,
          locality: item.locality?.locality_id
        }
      } else {
        return {
          ...item,
        }
      }
    })
    e.preventDefault();
    const newSocialLinks = socialLinks.map((item, i) => ({key: item.key, url: item.url}));
    try {
      const response = await callApi({
        api: `/update_my_profile`,
        method: "UPLOAD",
        data: {
          ...formData,
          service_area: JSON.stringify(service_area),
          social_media: JSON.stringify(newSocialLinks),
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
      console.error("An error occurred while updating your profile.");
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
      }
    } catch (error) {
      console.error("An error occurred while uploading the file.");
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
      if (response && response.status === 1) {
        toast.success(response.message || 'Document Removed Successfully')
      }
    } catch (error) { }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const res = await callApi({
        api: '/agent_company_image',
        method: "UPLOAD",
        data: {
          agent_id: memberId,
          company_logo: file
        }
      })
      if (res && res?.status == 1) {
        setSelectedCompanyLogo(res.data);
        setFormData(prev => {
          return {
            ...prev,
            company_logo: res.data.file_name
          }
        })
      }
    } catch (error) {
      console.error(error.message)
    }
  }

  const removeCompanyLogo = async () => {

    try {
      const res = await callApi({
        api: `/agent_company_image_delete`,
        method: "UPLOAD",
        data: {
          company_logo: formData.company_logo,
          agent_id: memberId
        }
      })
      if (res && res.status === 1) {
        setSelectedCompanyLogo(null);
        setFormData(prev => {
          return {
            ...prev,
            company_logo: ""
          }
        })
      }
    } catch (error) {
      console.error(error.message || "Something went wrong")
    }
  }

  const filteredOptions = languageOptions
    .filter((lang) => lang.toLowerCase().includes(input.toLowerCase()))
    .filter((lang) => !languages.includes(lang));

  const handleSelect = (lang) => {
    const updated = [...languages, lang];
    setLanguages(updated);
    setFormData({ ...formData, languages: updated });
    setInput("");
    setShowDropdown(false);
  };

  const handleRemove = (langToRemove) => {
    const updated = languages.filter((lang) => lang !== langToRemove);
    setLanguages(updated);
    setFormData({ ...formData, languages: updated });
  };

  const handleUploadCoverPic = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedCoverPhoto(reader.result);
        setShowCoverModal(true)
      }
      reader.readAsDataURL(file);
    }
  }


  const handleSaveCoverPhoto = async (file) => {
    try {
      const res = await callApi({
        api: `/save-cover-photo`,
        method: 'UPLOAD',
        data: {
          agent_cover_photo: file,
          agent_id: memberId
        }
      })
      if (res && res?.status == 1) {
        toast.success("coverphoto Uploaded successfully")
      }
    } catch (error) {
      console.error(error.message)
    }
  }

  return (
    <>
      <DashboardLayout>
        <div className="col-lg col-12">
          <div className="p-md-4 p-3">
            <h1 className="h4 text-primary mb-4">
              {translation?.profile_update || "Profile Update"}
            </h1>
            <Card>
              <Card.Body className="pt-4">
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
                          style={{ maxWidth: '120px' }}>
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
                    {userType === "A" ? (<>
                      <div className="col-md-6 col-12" ref={containerRef}>
                        <FloatingLabel
                          controlId="floatingLanguages"
                          label="Languages you can speak"
                          className="mb-4"
                        >
                          <div className="form-control position-relative" style={{ minHeight: "58px" }}>
                            <div className="d-flex flex-wrap gap-2">
                              {languages.map((lang, idx) => (
                                <span key={idx} className="badge bg-primary">
                                  {lang}
                                  <button
                                    type="button"
                                    className="btn-close btn-close-white btn-sm ms-1"
                                    onClick={() => handleRemove(lang)}
                                    style={{ fontSize: "0.6rem" }}
                                  ></button>
                                </span>
                              ))}
                              <input
                                type="text"
                                value={input}
                                onChange={(e) => {
                                  setInput(e.target.value);
                                  setShowDropdown(true);
                                }}
                                onFocus={() => setShowDropdown(true)}
                                className="border-0 flex-grow-1"
                                style={{ outline: "none", minWidth: "120px" }}
                                placeholder="Type or select a language"
                              />
                            </div>
                            {showDropdown && filteredOptions.length > 0 && (
                              <ul
                                className="list-group position-absolute w-100 mt-1"
                                style={{ zIndex: 1000, maxHeight: "200px", overflowY: "auto" }}
                              >
                                {filteredOptions.map((lang, idx) => (
                                  <li
                                    key={idx}
                                    className="list-group-item list-group-item-action"
                                    onClick={() => handleSelect(lang)}
                                    style={{ cursor: "pointer" }}
                                  >
                                    {lang}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </FloatingLabel>
                      </div>
                    </>) : null}


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
                        label={translation?.website_title || "Website Title"}
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
                        label={translation?.website_url || "Website URL"}
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
                    {userType === "A" && (
                      <div className="col-md-6 col-12">
                        <FloatingLabel
                          controlId="floatingFile"
                          label={translation?.cover_photo || "Cover Photo"}
                          className="mb-4"
                        >
                          <Form.Control
                            type="file"
                            name="document"
                            accept="image/*"
                            onChange={handleUploadCoverPic}
                          />

                        </FloatingLabel>
                      </div>
                    )}
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
                          <FloatingLabel
                            controlId="floatingFile"
                            label={translation?.upload_company_logo || "Company Logo"}
                            className="mb-4"
                          >
                            <Form.Control
                              type="file"
                              name="document"
                              accept="image/*"
                              onChange={handleFileChange}
                            />

                            {selectedCompanyLogo && (
                              <div className="position-relative mt-3 d-inline-block">
                                <img
                                  src={selectedCompanyLogo.image_url}
                                  alt="Company Logo Preview"
                                  style={{
                                    maxWidth: "120px", // reduced size here
                                    height: "auto",
                                    borderRadius: "8px",
                                    border: "1px solid #ddd",
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={removeCompanyLogo}
                                  style={{
                                    position: "absolute",
                                    top: "5px",
                                    right: "5px",
                                    background: "rgba(0,0,0,0.6)",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "50%",
                                    width: "24px",
                                    height: "24px",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "14px",
                                  }}
                                >
                                  ×
                                </button>
                              </div>
                            )}

                          </FloatingLabel>
                        </div>


                        <div className="col-md-6 col-12 mb-4">
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
                              : `${translation?.upload_document || "Upload Document (PDF, DOC, JPG, PNG)"}`}
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
                                value="I"
                                checked={formData.broker_type === "I"}
                                onChange={handleChange}
                                id={`broker_type_1`}
                              />
                              <Form.Check
                                inline
                                type={type}
                                label={translation?.agency || "Agency"}
                                name="broker_type"
                                value="A"
                                checked={formData.broker_type === "A"}
                                onChange={handleChange}
                                id={`broker_type_2`}
                              />
                              {/* <Form.Check
                            inline
                            type={type}
                            label={translation?.franchise || "Franchise"}
                            name="broker_type"
                            value="F"
                            checked={formData.broker_type === "F"}
                            onChange={handleChange}
                            id={`broker_type_3`}
                          />                       */}
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
                              placeholder={translation?.bussiness_phone || "Business Phone"}
                              value={formData.business_phone}
                              onChange={handleChange}
                            />
                          </FloatingLabel>
                        </div>
                        <div className="col-md-6 col-12">
                          <FloatingLabel
                            controlId="floatingInput"
                            label={translation?.business_email || "Business Email"}
                            className="mb-4"
                          >
                            <Form.Control
                              type="text"
                              name="business_email"
                              className="form-control"
                              placeholder={translation?.business_email || "Business Email"}
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
                    label={translation?.comments || "Comments"}
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
                    <Button type="submit" variant="primary">
                      {translation?.update || "Update"}
                    </Button>
                  </div>
                </form>
              </Card.Body>
            </Card>
          </div>
        </div>
      </DashboardLayout>
      <Modal show={showCoverModal} hide={() => {
        setShowCoverModal(false)
        setSelectedCoverPhoto(null);
      }} size="lg">
        <Modal.Header className="d-flex justify-content-between align-items-center">
          <h5 className="modal-title mb-0">Upload Cover Pic</h5>
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={() => {
              setShowCoverModal(false)
              setSelectedCoverPhoto(null);
            }} // <-- Define this function to close the modal
          ></button>
        </Modal.Header>
        <Modal.Body>
          <CropperModal image={selectedCoverPhoto} onClose={() => setShowCoverModal(false)} onCropDone={handleSaveCoverPhoto} />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ProfileForm;
