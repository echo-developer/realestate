"use client";
import React, { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import AuthUser from "../Authentication/AuthUser";
import Modal from "react-bootstrap/Modal";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import useTranslation from "../../hooks/useTranslation";
import { Col } from "react-bootstrap";
import PropertyTypeDropdown from "../addtional/PropertyTypeDropdown";
import SizeDropdown from "../addtional/SizeDropdown";

const PropertyRequirementForm = () => {
  const translation = useTranslation();
  const [selectedPropertyType, setSelectedPropertyType] = useState("1");
  const [selectedPropertyFor, setSelectedPropertyFor] = useState(null);
  const [budget, setBudget] = useState(200);
  const { callApi, isLogin } = AuthUser();
  const router = useRouter();
  const [showLoginErrorModal, setShowLoginErrorModal] = useState(false);
  const validationSchema = Yup.object({
    name: Yup.string().required(
      translation?.name_is_required || "Name is required"
    ),
    phone: Yup.string()
      .matches(
        /^[0-9]{10}$/,
        translation?.phone_min_length ||
          "Phone number must be exactly 10 digits"
      )
      .required(translation?.phone_number || "phone number is required"),
    email: Yup.string()
      .email(translation?.invalid_email || "Invalid email format")
      .required(translation?.email_required || "Email is required"),
    location: Yup.string().optional(),
    area: Yup.string().when("property_size_type", {
      is: "custom",
      then: Yup.string().required(
        translation?.area_required_for_custom_size ||
          "Area is required for custom size"
      ),
    }),
    purchase_timeline: Yup.string().required(
      translation?.purchase_timeline_required || "Purchase timeline is required"
    ),
    terms: Yup.boolean().oneOf(
      [true],
      `${translation?.agree_to_terms || "You must agree to the terms"}`
    ),
  });

    // State for min & max size
    const [minSize, setMinSize] = useState("");
    const [maxSize, setMaxSize] = useState("");
  
    // Function to apply the selected sizes
    const applySizes = () => {
      console.log("Applied Sizes:", { minSize, maxSize });
      // Add API call or logic to filter properties based on size
    };
  
    // Function to reset the sizes
    const resetSizes = () => {
      setMinSize("");
      setMaxSize("");
    };

  const propertySizes = [
    { id: "property_size_1", label: "0 - 250 sq ft", value: "0-250" },
    { id: "property_size_2", label: "251 sq ft - 350 sq ft", value: "251-350" },
    { id: "property_size_3", label: "351 sq ft - 500 sq ft", value: "351-500" },
    {
      id: "property_size_4",
      label: "501 sq ft - 1000 sq ft",
      value: "501-1000",
    },
    {
      id: "property_size_5",
      label: "1001 sq ft - 3000 sq ft",
      value: "1001-3000",
    },
    { id: "property_size_6", label: "Above 3000 sq ft", value: "Above 3000" },
  ];

  const handlePropertyTypeChange = (typeId) => {
    setSelectedPropertyType(typeId);
  };

  const handlePropertyForChange = (subCategoryId) => {
    setSelectedPropertyFor(subCategoryId);
  };

  const handleReset = () => {
    setSelectedPropertyType(null);
    setSelectedPropertyFor(null);
  };

  const handleDone = () => {
    console.log("Selected Type:", selectedPropertyType);
    console.log("Selected For:", selectedPropertyFor);
  };

  const handleLoginErrorClose = () => setShowLoginErrorModal(false);

  const handleSubmit = async (data, { resetForm }) => {
    if (isLogin()) {
      if (budget) data.max_budget = budget;
      try {
        const res = await callApi({
          api: "/buyer_property_enquery",
          method: "POST",
          data: data,
        });

        if (res && res?.status === 1) {
          toast.success(
            "Buyer’s Property Requirement Form submitted successfully!"
          );
          resetForm();
        }
      } catch (error) {
        console.error(error?.message || "Something went wrong");
      }
    } else {
      setShowLoginErrorModal(true);
    }
  };

  return (
    <aside className="col-lg-6 col-12">
      <div className="card">
        <div className="card-body p-lg-4">
          <div className="section-headline">
            <h3>
              {translation?.buyers_property_requirement_form ||
                "Buyer’s Property Requirement Form"}{" "}
            </h3>
            <p className="text-help mb-4">
              {translation?.provide_details ||
                "Please provide as much detail as possible to help us find thsi deal property for you."}
            </p>
          </div>

          <Formik
            initialValues={{
              name: "",
              phone: "",
              email: "",
              location: "",
              area: "",
              purchase_timeline: "",
              terms: false,
              property_type: "1",
              flat_type: "1BHK",
              property_size_type: "0-250",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, handleChange }) => {
              return (
                <Form id="leadForm">
                  <div id="step-1">
                    {/* Name and Phone */}
                    <div className="row">
                      <div className="col-lg-6 col-12">
                        <div className="form-field mb-3">
                          <Field
                            type="text"
                            className="form-control"
                            name="name"
                            placeholder={translation?.name || "Name"}
                          />
                          <ErrorMessage
                            name="name"
                            component="span"
                            className="error nameError text-danger"
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 col-12">
                        <div className="form-field mb-3">
                          <Field
                            type="number"
                            name="phone"
                            className="form-control"
                            placeholder={
                              translation?.mobile_number || "Mobile Number"
                            }
                          />
                          <ErrorMessage
                            name="phone"
                            component="span"
                            className="error phoneError text-danger"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Email and Preferred Location */}
                    <div className="row">
                      <div className="col-lg-6 col-12">
                        <div className="form-field mb-3">
                          <Field
                            type="email"
                            name="email"
                            className="form-control"
                            placeholder={translation?.email || "Email"}
                          />
                          <ErrorMessage
                            name="email"
                            component="span"
                            className="error emailError text-danger"
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 col-12">
                        <div className="form-field mb-3">
                          <Field
                            type="text"
                            className="form-control"
                            name="location"
                            placeholder={
                              translation?.preferred_location ||
                              "Preferred Location"
                            }
                          />
                        </div>
                      </div>
                    </div>

                    {/* Property Type and Flat Type Selection */}
                    <Col className="col-lg-6 col-12">
                      <PropertyTypeDropdown
                        selectedPropertyType={selectedPropertyType}
                        selectedPropertyFor={selectedPropertyFor}
                        handlePropertyTypeChange={handlePropertyTypeChange}
                        handlePropertyForChange={handlePropertyForChange}
                        handleReset={handleReset}
                        handleDone={handleDone}
                      />
                    </Col>
                    {/* Area Input with Unit Selection */}
                    <Col className="col-lg-4 col-sm-6 col-12">
                      <SizeDropdown
                        minSize={minSize}
                        maxSize={maxSize}
                        setMinSize={setMinSize}
                        setMaxSize={setMaxSize}
                        applySizes={applySizes}
                        resetSizes={resetSizes}
                        translation={translation}
                      />
                    </Col>

                    {/* Property Size Selection */}
                    <div
                      className="btn-group btn-group-light d-flex flex-wrap mb-4"
                      role="group"
                    >
                      {propertySizes.map((size) => (
                        <React.Fragment key={size.id}>
                          <Field
                            type="radio"
                            className="btn-check"
                            name="property_size_type"
                            id={size.id}
                            value={size.value}
                          />
                          <label
                            className="btn btn-outline-light mb-1"
                            htmlFor={size.id}
                          >
                            {size.label}
                          </label>
                        </React.Fragment>
                      ))}
                    </div>

                    {/* Budget Range */}
                    <div className="row">
                      <div className="col-sm-auto">
                        <label className="form-label text-white">
                          {" "}
                          {translation?.max_budget || "Max Budget:"}{" "}
                        </label>
                      </div>
                      <div className="col-sm">
                        <input
                          type="range"
                          min={200}
                          max={5000}
                          step={100}
                          value={budget}
                          onChange={(e) => setBudget(parseInt(e.target.value))}
                          className="mt-1"
                        />
                        <span className="ms-2 text-white">{`$${budget}`}</span>
                      </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="form-check mb-3">
                      <Field
                        type="checkbox"
                        className="form-check-input"
                        name="terms"
                      />
                      <label
                        className="form-check-label text-white"
                        htmlFor="terms"
                      >
                        <small>
                          {translation?.agree_terms_conditions ||
                            "I agree to the terms and conditions and the privacy policy"}{" "}
                          <a href="#"></a> <a href="#"></a>.
                        </small>
                      </label>
                      <ErrorMessage
                        name="terms"
                        component="div"
                        className="error text-danger"
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="row">
                      <div className="col-lg-12 col-12">
                        <button type="submit" className="btn btn-primary w-100">
                          {translation?.submit || "Submit"}
                        </button>
                      </div>
                    </div>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>

      <Modal
        show={showLoginErrorModal}
        onHide={handleLoginErrorClose}
        centered
        size="lg"
      >
        <Modal.Header>
          {/* Left-aligned Cancel button */}
          <button
            className="btn btn-secondary"
            onClick={handleLoginErrorClose}
            style={{ position: "absolute", left: "15px" }}
          >
            {translation?.cancel || "Cancel"}
          </button>

          {/* Centered Error Message */}
          <Modal.Title className="mx-auto">
            {" "}
            {translation?.login_required || "Login Required"}
          </Modal.Title>

          {/* Right-aligned Login button */}
          <button
            className="btn btn-danger"
            onClick={() => {
              handleLoginErrorClose();
              router.push("/login");
            }}
            style={{ position: "absolute", right: "15px" }}
          >
            {translation?.login || "Login"}
          </button>
        </Modal.Header>

        <Modal.Body>
          <p className="text-center">
            {translation?.please_log_in_to_perform_this_action ||
              "Please log in to perform this action."}{" "}
          </p>
        </Modal.Body>
      </Modal>
    </aside>
  );
};

export default PropertyRequirementForm;
