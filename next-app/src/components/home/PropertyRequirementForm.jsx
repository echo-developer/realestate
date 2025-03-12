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
import BudgetRangeSlider from "../addtional/BudgetRangeSlider";
import LocalityOption from "../MapData/LocalitySelector";

const PropertyRequirementForm = () => {
  const translation = useTranslation();
  const [selectedPropertyType, setSelectedPropertyType] = useState("1");
  const [selectedPropertyFor, setSelectedPropertyFor] = useState(null);
  const [budget, setBudget] = useState(200);
  const [minSize, setMinSize] = useState("");
  const [maxSize, setMaxSize] = useState("");
  const { callApi, isLogin } = AuthUser();
  const router = useRouter();
  const [showLoginErrorModal, setShowLoginErrorModal] = useState(false);
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [locality,setLocality]=useState('')

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
    purchase_timeline: Yup.string().required(
      translation?.purchase_timeline_required || "Purchase timeline is required"
    ),
    terms: Yup.boolean().oneOf(
      [true],
      `${translation?.agree_to_terms || "You must agree to the terms"}`
    ),
  });

  const applySizes = () => {};

  const resetSizes = () => {
    setMinSize("");
    setMaxSize("");
  };

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

  const handleDone = () => {};

  const handleLoginErrorClose = () => setShowLoginErrorModal(false);

  const handleSubmit = async (data, { resetForm }) => {
    if (isLogin()) {
      try {
        const res = await callApi({
          api: "/buyer_property_enquery",
          method: "POST",
          data: {
            ...data,
            property_type:selectedPropertyType,
            property_for:selectedPropertyFor,
            min_budget:minBudget,
            max_budget:maxBudget,
            min_size:minSize,
            max_size:maxSize,
            locality:locality?.locality
          },
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
              purchase_timeline: "",
              terms: false,
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
                            value={values?.name}
                            onChange={handleChange}
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
                        {/* <div className="form-field mb-3">
                          <Field
                            type="text"
                            className="form-control"
                            name="location"
                            placeholder={
                              translation?.preferred_location ||
                              "Preferred Location"
                            }
                          />
                        </div> */}
                        <LocalityOption setLocationData={setLocality}/>
                      </div>
                    </div>
                    <div className="row">
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
                      <Col className="col-lg-6 sm-6 col-12">
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
                    </div>
                    {/* Area Input with Unit Selection */}
                    <div className="row mb-3">
                      <div className="col-lg-6 col-12">
                        <Field
                          as="select"
                          className="form-select"
                          name="purchase_timeline"
                        >
                          <option value="" disabled>
                            {translation?.how_soon_purchase ||
                              "How soon you purchase?"}
                          </option>
                          {[
                            { label: "1 weeks", value: "1_weeks" },
                            { label: "2 weeks", value: "2_weeks" },
                            { label: "3 weeks", value: "3_weeks" },
                            { label: "1 Months", value: "1_months" },
                            { label: "45 Days", value: "45_days" },
                            { label: "2 Months", value: "2_months" },
                            { label: "3 Months", value: "3_months" },
                            { label: "6 Months", value: "6_months" },
                          ].map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </Field>
                      </div>
                    </div>
                    
                    {/* Budget Range */}
                    <BudgetRangeSlider
                      minLimit={500}
                      maxLimit={10000}
                      step={250}
                      setMinBudget={setMinBudget}
                      setMaxBudget={setMaxBudget}
                    />
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
                          <a role="button"></a> <a role="button"></a>.
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
