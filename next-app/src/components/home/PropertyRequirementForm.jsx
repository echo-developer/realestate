"use client";
import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

// Validation schema using Yup
const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),
  email: Yup.string().email("Invalid email format").required("Email is required"),
  property_location: Yup.string().optional(),
  area: Yup.string().required("Area is required"),
  purchaseTimeline: Yup.string().required("Purchase timeline is required"),
  terms: Yup.boolean().oneOf([true], "You must agree to the terms").required(),
});

const PropertyRequirementForm = () => {
  const [areaUnit, setAreaUnit] = useState("Sq. Ft");
  const [purchaseTimeline, setPurchaseTimeline] = useState("");

  const propertyTypes = [
    { id: "property_flat", label: "Flat", value: "Flat" },
    { id: "property_house", label: "House", value: "House" },
    { id: "property_villa", label: "Villa", value: "Villa" },
  ];

  const flatTypes = [
    { id: "flat_1", label: "1 BHK", value: "flat_1" },
    { id: "flat_2", label: "2 BHK", value: "flat_2" },
    { id: "flat_3", label: "3 BHK", value: "flat_3" },
    { id: "flat_4", label: "4 BHK", value: "flat_4" },
    { id: "flat_5", label: <i className="bi bi-plus-lg"></i>, value: "flat_5" },
  ];

  const propertySizes = [
    { id: "property_size_1", label: "0 - 250 sq ft", value: "0-250" },
    { id: "property_size_2", label: "251 sq ft - 350 sq ft", value: "251-350" },
    { id: "property_size_3", label: "351 sq ft - 500 sq ft", value: "351-500" },
    { id: "property_size_4", label: "501 sq ft - 1000 sq ft", value: "501-1000" },
    { id: "property_size_5", label: "Above 1000 sq ft", value: "Above 1000" },
    { id: "property_size_6", label: <i className="bi bi-plus-lg"></i>, value: "custom" },
  ];

  return (
    <aside className="col-lg-6 col-12">
      <div className="card">
        <div className="card-body p-4">
          <div className="section-headline">
            <h3>Buyer’s Property Requirement Form</h3>
            <p className="text-help mb-4">
              Please provide as much detail as possible to help us find the ideal property for you.
            </p>
          </div>

          <Formik
            initialValues={{
              name: "",
              phone: "",
              email: "",
              property_location: "",
              area: "",
              purchaseTimeline: "",
              terms: false,
              property_type: "Flat", // default property type
              flat_type: "", // default flat type
              property_size_type: "",
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              // Handle form submission logic here with values from Formik
              console.log(values);
            }}
          >
            {({ values, errors, touched, handleChange, handleBlur }) => (
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
                          placeholder="Name"
                        />
                        <ErrorMessage name="name" component="span" className="error nameError text-danger" />
                      </div>
                    </div>
                    <div className="col-lg-6 col-12">
                      <div className="form-field mb-3">
                        <Field
                          type="number"
                          name="phone"
                          className="form-control"
                          placeholder="Mobile Number"
                        />
                        <ErrorMessage name="phone" component="span" className="error phoneError text-danger" />
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
                          placeholder="Email"
                        />
                        <ErrorMessage name="email" component="span" className="error emailError text-danger" />
                      </div>
                    </div>
                    <div className="col-lg-6 col-12">
                      <div className="form-field mb-3">
                        <Field
                          type="text"
                          className="form-control"
                          name="property_location"
                          placeholder="Preferred Location"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Property Type Selection */}
                  <div className="row">
                    <div className="col-lg-6 col-12">
                      <div className="btn-group btn-group-light d-flex mb-3" role="group">
                        {propertyTypes.map((type) => (
                          <React.Fragment key={type.id}>
                            <Field
                              type="radio"
                              className="btn-check"
                              name="property_type"
                              id={type.id}
                              value={type.value}
                              checked={values.property_type === type.value}
                              onChange={handleChange}
                            />
                            <label className="btn btn-outline-light" htmlFor={type.id}>
                              {type.label}
                            </label>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Flat Type Selection */}
                  <div className="row">
                    <div className="col-lg-6 col-12">
                      <div className="btn-group btn-group-light d-flex mb-3" role="group">
                        {flatTypes.map((flat) => (
                          <React.Fragment key={flat.id}>
                            <Field
                              type="radio"
                              className="btn-check"
                              name="flat_type"
                              id={flat.id}
                              value={flat.value}
                              checked={values.flat_type === flat.value}
                              onChange={handleChange}
                            />
                            <label className="btn btn-outline-light" htmlFor={flat.id}>
                              {flat.label}
                            </label>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Area Input with Unit Selection */}
                  <div className="row">
                    <div className="col-lg-6 col-12">
                      <div className="input-group mb-3">
                        <Field
                          type="text"
                          className="form-control"
                          name="area"
                          placeholder="Enter Area"
                        />
                        <select
                          className="form-select"
                          style={{ maxWidth: "100px" }}
                          value={areaUnit}
                          onChange={(e) => setAreaUnit(e.target.value)}
                        >
                          <option value="Sq. Ft">Sq. Ft</option>
                          <option value="cm">cm</option>
                          <option value="inch">inch</option>
                        </select>
                      </div>
                    </div>

                    {/* Purchase Timeline */}
                    <div className="col-lg-6 col-12">
                      <Field
                        as="select"
                        className="form-select"
                        name="purchaseTimeline"
                      >
                        <option value="" disabled>
                          How soon you purchase?
                        </option>
                        <option value="30 days">30 days</option>
                        <option value="3 Months">3 Months</option>
                      </Field>
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="form-check mb-3">
                    <Field
                      type="checkbox"
                      className="form-check-input"
                      name="terms"
                    />
                    <label className="form-check-label" htmlFor="terms">
                      <small>
                        I agree to the <a href="#">terms and conditions</a> and the{" "}
                        <a href="#">privacy policy</a>.
                      </small>
                    </label>
                    <ErrorMessage name="terms" component="div" className="error text-danger" />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="row">
                  <div className="col-lg-12 col-12">
                    <button type="submit" className="btn btn-primary w-100">Submit</button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </aside>
  );
};

export default PropertyRequirementForm;
