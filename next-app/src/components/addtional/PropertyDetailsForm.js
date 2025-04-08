import React, { useState } from "react";
import { Button, FloatingLabel, Form as BootstrapForm } from "react-bootstrap";
import { toast } from "react-toastify";
import AuthUser from "../Authentication/AuthUser";

const PropertyDetailsForm = ({ translation, propertyId, setShowLoginErrorModal }) => {
  const { callApi, isLogin } = AuthUser();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    propertyId: propertyId || "",
    countryCode: "IND +91",
  });

  const [errors, setErrors] = useState({});
  const countryCodes = ["IND +91", "+81", "+71", "+61", "+51"];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = translation?.name_is_required || "Name is required";
    if (!formData.email) {
      newErrors.email = translation?.email_required || "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = translation?.invalid_email || "Invalid email format";
    }
    if (!formData.phone) {
      newErrors.phone = translation?.phone_number || "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = translation?.phone_min_length || "Phone number must be exactly 10 digits";
    }
    if (!formData.message) newErrors.message = translation?.message_is_required || "Message is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (isLogin()) {
      try {
        const response = await callApi({
          api: "/add_property_enquery",
          method: "POST",
          data: formData,
        });

        if (response?.status === 1) {
          toast.success(response?.message || "Enquiry submitted successfully!");
          setFormData({
            name: "",
            email: "",
            phone: "",
            message: "",
            propertyId: propertyId || "",
            countryCode: "IND +91",
          });
        } else {
          toast.error(response?.message || "Failed to submit enquiry.");
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        toast.error("An unexpected error occurred.");
      }
    } else {
      setShowLoginErrorModal(true);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Name Field */}
      <FloatingLabel controlId="name" label={translation?.name || "Name"} className="mb-3">
        <input
          type="text"
          className="form-control"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder=" "
        />
        {errors.name && <div className="text-danger small">{errors.name}</div>}
      </FloatingLabel>

      {/* Email Field */}
      <FloatingLabel controlId="email" label={translation?.email_address || "Email Address"} className="mb-3">
        <input
          type="email"
          className="form-control"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder=" "
        />
        {errors.email && <div className="text-danger small">{errors.email}</div>}
      </FloatingLabel>

      {/* Phone Field */}
      <div className="input-group mb-3">
        <BootstrapForm.Select
          value={formData.countryCode}
          onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
          style={{ maxWidth: "110px" }}
        >
          {countryCodes.map((code, index) => (
            <option key={index} value={code}>
              {code}
            </option>
          ))}
        </BootstrapForm.Select>
        <FloatingLabel controlId="phone" label={translation?.phone_number || "Phone Number"}>
          <input
            type="text"
            className="form-control"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder=" "
          />
        </FloatingLabel>
      </div>
      {errors.phone && <div className="text-danger small">{errors.phone}</div>}

      {/* Message Field */}
      <FloatingLabel controlId="message" label={translation?.message || "Message"} className="mb-3">
        <textarea
          className="form-control"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder=" "
          style={{ minHeight: "100px" }}
        />
        {errors.message && <div className="text-danger small">{errors.message}</div>}
      </FloatingLabel>

      {/* Submit Button */}
      <Button variant="primary" type="submit" className="btn-block">
        {translation?.contact_now || "Contact Now"}
      </Button>
    </form>
  );
};

export default PropertyDetailsForm;
