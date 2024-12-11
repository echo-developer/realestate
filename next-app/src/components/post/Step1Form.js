"use client";
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

const Step1Form = ({ formData, setFormData, nextStep }) => {

  const formik = useFormik({
    initialValues: {
      postAs: formData.postAs || "O",
      name: formData.name || "",
      countryCode: formData.countryCode || "IND +91",
      whatsappNumber: formData.whatsappNumber || "",
      email: formData.email || "",
    },
    validationSchema: Yup.object({
      postAs: Yup.string().required("Please select an option."),
      name: Yup.string()
        .min(2, "Name must be at least two characters long.")
        .required("Name is required."),
      countryCode: Yup.string().required("Country code is required."),
      whatsappNumber: Yup.string()
        .matches(/^\d{10}$/, "Enter a valid 10-digit WhatsApp number.")
        .required("WhatsApp number is required."),
      email: Yup.string()
        .email("Invalid email address.")
        .required("Email is required."),
    }),
    enableReinitialize: true,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    formik.handleChange(e);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    formik.handleBlur(e);
  };

  return (
    <div id="step-1">
      <label className="d-block mb-2">I'm a</label>
      <div className="btn-group btn-group-light d-flex mb-3" role="group">
        <input
          type="radio"
          className="btn-check"
          name="postAs"
          id="owner"
          value="O"
          checked={formik.values.postAs === "O"}
          onChange={handleChange}
        />
        <label className="btn btn-outline-light" htmlFor="owner">
          <img
            src="/assets/images/icons/owner.png"
            alt="Icon"
            height="24"
            width="24"
          />{" "}
          Owner
        </label>
        <input
          type="radio"
          className="btn-check"
          name="postAs"
          id="agent"
          value="A"
          checked={formik.values.postAs === "A"}
          onChange={handleChange}
        />
        <label className="btn btn-outline-light" htmlFor="agent">
          <img
            src="/assets/images/icons/agent.png"
            alt="Icon"
            height="24"
            width="24"
          />{" "}
          Agent
        </label>
        <input
          type="radio"
          className="btn-check"
          name="postAs"
          id="builder"
          value="B"
          checked={formik.values.postAs === "B"}
          onChange={handleChange}
        />
        <label className="btn btn-outline-light" htmlFor="builder">
          <img
            src="/assets/images/icons/builder.png"
            alt="Icon"
            height="24"
            width="24"
          />{" "}
          Builder
        </label>
      </div>
      {formik.touched.postAs && formik.errors.postAs && (
        <div className="text-danger">{formik.errors.postAs}</div>
      )}

      {/* Remaining fields and button */}
      <div className="form-field mb-3">
        <label htmlFor="name" className="form-label">
          Name
        </label>
        <input
          type="text"
          className="form-control"
          name="name"
          placeholder="Enter Your Name"
          value={formik.values.name}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {formik.touched.name && formik.errors.name && (
          <span className="error text-danger">{formik.errors.name}</span>
        )}
      </div>

      <div className="input-group mb-3">
        <select
          className="btn-group bootstrap-select input-group-btn fit-width"
          name="countryCode"
          value={formik.values.countryCode}
          onChange={handleChange}
          onBlur={handleBlur}
        >
          <option value="IND +91">IND +91</option>
          <option value="+81">+81</option>
          <option value="+71">+71</option>
          <option value="+61">+61</option>
          <option value="+51">+51</option>
        </select>
        <input
          type="text"
          className="form-control"
          name="whatsappNumber"
          placeholder="WhatsApp No."
          value={formik.values.whatsappNumber}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </div>
      {formik.touched.whatsappNumber && formik.errors.whatsappNumber && (
        <div className="text-danger">{formik.errors.whatsappNumber}</div>
      )}

      <div className="alert alert-success d-flex align-items-center">
        <img
          src="/assets/images/whatsapp.png"
          alt="whatsapp"
          height="48"
          width="48"
        />
        <p className="ps-3">
          Enter your{" "}
          <span className="text-green">WhatsApp Number</span> to get enquiries
          from buyer/tenant
        </p>
      </div>

      <div className="form-field mb-3">
        <label htmlFor="email" className="form-label">
          Email
        </label>
        <input
          type="email"
          name="email"
          className="form-control"
          placeholder="Enter Your Email I’d"
          value={formik.values.email}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {formik.touched.email && formik.errors.email && (
          <span className="error text-danger">{formik.errors.email}</span>
        )}
      </div>

      <div className="d-grid">
        <button
          type="button"
          className="btn btn-primary btn-next-2 btn-next-1"
          onClick={() => {
            if (!Object.keys(formik.errors).length) {
              nextStep();
            }
          }}
        >
          Next <i className="bi bi-arrow-right"></i>
        </button>
      </div>
    </div>
  );
};

export default Step1Form;
