import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import AuthUser from "../Authentication/AuthUser";
import { toast } from "react-toastify";
import EnquiryForm from "../charts/EnquiryForm";
import { useRouter } from "next/navigation";
import PropertyReportModal from "../ReportData/PropertyReportModal";

const PropertySidebar = ({ propertyId }) => {
  const { callApi, isLogin } = AuthUser();
  const router = useRouter();
  const [showPhoneNumber, setShowPhoneNumber] = useState(false);
  const [showCommunicationModal, setShowCommunicationModal] = useState(false);
  const [showLoginErrorModal, setShowLoginErrorModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const handleReportClick = () => {
    setShowReportModal(true);
  };

  const initialValues = {
    name: "",
    email: "",
    phone: "",
    message: "",
    propertyId: propertyId,
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    phone: Yup.string()
      .required("Phone number is required")
      .matches(/^\d+$/, "Phone number should contain only digits")
      .min(10, "Phone number should be at least 10 digits"),
    message: Yup.string().required("Message is required"),
  });

  const agents = [
    {
      name: "Udaya Singh",
      agency: "Udaya Real Estate",
      rating: 4.3,
      imgSrc: "/assets/images/agents/agent-9.jpg",
    },
    {
      name: "Myra Seikh",
      agency: "Myra Real Estate",
      rating: 4.3,
      imgSrc: "/assets/images/agents/agent-12.jpg",
    },
  ];

  const countryCodes = ["IND +91", "+81", "+71", "+61", "+51"];

  const handleClose = () => setShowCommunicationModal(false);
  const handleLoginErrorClose = () => setShowLoginErrorModal(false);

  return (
    <aside className="col-xl-3 col-12">
      <div className="sticky-top_ mb-4">
        <div className="sort-by mb-3">
          <div className="rateStar me-2">
            <i className="icon-line-awesome-star text-warning"></i>{" "}
            <span>3.5/5</span>
          </div>
          <button className="btn me-2 ads-fav" title="Save for Later">
            <i className="icon-line-awesome-heart-o"></i>
          </button>
          <button
            className="btn me-2"
            title="Report this Ad"
            onClick={() => handleReportClick()}
          >
            <i className="icon-feather-flag"></i>
          </button>
          {/* <button className="btn me-2" title="Print">
            <i className="icon-feather-printer"></i>
          </button> */}
          <button className="btn btn-sm btn-outline-primary w-auto">
            <i className="icon-feather-share-2"></i> Share
          </button>
        </div>
        <div class="card border-0 shadow-1 mb-4">
          <div class="card-body">
            <div class="user-profile align-items-center">
              <div class="mb-3">
                <img
                  alt="Agent image"
                  height="84"
                  width="84"
                  class="rounded-circle"
                  src="/assets/images/agents/agent-2.jpg"
                />
              </div>
              <div>
                <h4>
                  Millan Mathew
                  <i
                    class="icon-img-check ms-2"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    aria-label="Certified Agent"
                    data-bs-original-title="Certified Agent"
                  ></i>
                </h4>
                <p class="mb-0">
                  <i>400+ Buyer served</i>
                </p>
                <div class="star-rating" data-rating="3.5">
                  <span class="star"></span>
                  <span class="star"></span>
                  <span class="star"></span>
                  <span class="star half"></span>
                  <span class="star empty"></span>
                </div>
                <p class="text-muted">Real Estate Agent</p>
                <p>
                  <i class="icon-feather-map-pin text-site"></i>
                  A.C Sarkar Road, Ariadaha, PS Belghoria, Dakshineswar, Kolkata
                  - North 24 Parganas District, West Bengal
                </p>
                <ul class="p-0">
                  {/* <li class="d-flex justify-content-between mb-1">
                    <span class="text-muted">Operating Since:</span>
                    <span>2010</span>
                  </li> */}
                  <li class="d-flex justify-content-between mb-1">
                    <span class="text-muted">Properties For Sale:</span>
                    <span>320</span>
                  </li>
                  <li class="d-flex justify-content-between">
                    <span class="text-muted">Properties For Rent:</span>
                    <span>150</span>
                  </li>
                </ul>
                <div class="d-grid">
                  <button
                    className="btn btn-primary mb-1"
                    onClick={() => setShowPhoneNumber(!showPhoneNumber)}
                  >
                    {showPhoneNumber ? "+91 9876543210" : "Get Phone Number"}
                  </button>
                  <button
                    class="btn btn-primary"
                    onClick={() => setShowCommunicationModal(true)}
                  >
                    Contact Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7365.550470855868!2d88.440232!3d22.624867!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f89f80fcac8bbd%3A0x82897f52b160f677!2sPropstone%20Realty%3A%20Real%20Estate%20Broker%2FAgent%20in%20Rajarhat%2C%20Kolkata%7C%20Chinar%20Park%7C%20Tegharia%7C%20Kaikhali%7C%20Baguiati!5e0!3m2!1sen!2sin!4v1729171598795!5m2!1sen!2sin"
          height="300"
          style={{
            border: "0",
            borderRadius: "10px",
            marginBottom: "1rem",
            width: "100%",
          }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
        <div className="cardbox shadow-1 d-flex align-items-center justify-content-between">
          <h4 className="mb-0">Download Brochure</h4>
          <a href="">
            <img
              src="/assets/images/icons/brochure.png"
              alt="Download Brochure"
              height="32"
            />
          </a>
        </div>

        <div className="card border-0 shadow-1 mb-4">
          <div className="card-body">
            <h4 className="mb-3 text-primary">Top Agents In This Locality</h4>
            {agents.map((agent, index) => (
              <div className="d-flex align-items-center mb-3" key={index}>
                <img
                  src={agent.imgSrc}
                  alt="Agent image"
                  height="64"
                  width="64"
                  className="rounded-circle"
                />
                <div className="flex-grow-1 ps-3">
                  <h5 className="mb-0">
                    <a href="">{agent.name}</a>{" "}
                    <i
                      className="icon-img-check ms-2"
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      aria-label="Certified Agent"
                      data-bs-original-title="Certified Agent"
                    ></i>
                  </h5>
                  <p className="mb-0 text-muted">{agent.agency}</p>
                  <p className="mb-2">
                    <i className="icon-line-awesome-star text-warning"></i>{" "}
                    <span className="text-muted">{agent.rating} Rating</span>
                  </p>
                </div>
              </div>
            ))}
            <a href="">
              View All Agents <i className="bi bi-arrow-right"></i>
            </a>
          </div>
        </div>

        <div className="card border-0 shadow-1 mb-4">
          <div className="card-body">
            <h4 className="mb-3 text-primary">Looking For A Property</h4>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={async (values, { resetForm }) => {
                if (isLogin()) {
                  try {
                    const response = await callApi({
                      api: `/add_property_enquery`,
                      method: "UPLOAD",
                      data: values,
                    });
                    if (response && response.status === 1) {
                      toast.success(response.message);
                      resetForm();
                    } else {
                      toast.error(response.message);
                    }
                  } catch (error) {
                    console.error("Data not found");
                  }
                } else {
                  setShowLoginErrorModal(true);
                }
              }}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className="form-floating mb-3">
                    <Field
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      placeholder=" "
                    />
                    <label htmlFor="name">Name</label>
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                  <div className="form-floating mb-3">
                    <Field
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      placeholder="name@example.com"
                    />
                    <label htmlFor="email">Email Address</label>
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                  <div className="input-group mb-3">
                    <select
                      className="btn-group bootstrap-select input-group-btn fit-width"
                      defaultValue="IND +91"
                    >
                      {countryCodes.map((code, index) => (
                        <option key={index} value={code}>
                          {code}
                        </option>
                      ))}
                    </select>
                    <div className="form-floating">
                      <Field
                        type="text"
                        className="form-control"
                        id="phone"
                        name="phone"
                        placeholder=" "
                      />
                      <label htmlFor="phone">Phone Number</label>
                      <ErrorMessage
                        name="phone"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                  </div>
                  <div className="form-floating mb-3">
                    <Field
                      as="textarea"
                      className="form-control"
                      id="message"
                      name="message"
                      placeholder="Write your message"
                    />
                    <label htmlFor="message">Message</label>
                    <ErrorMessage
                      name="message"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary btn-block"
                    disabled={isSubmitting}
                  >
                    Send
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>

      <Modal
        show={showCommunicationModal}
        onHide={() => setShowCommunicationModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Communication</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EnquiryForm propertyId={propertyId} handleClose={handleClose} />
        </Modal.Body>
      </Modal>

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
            Cancel
          </button>

          {/* Centered Error Message */}
          <Modal.Title className="mx-auto">Login Required</Modal.Title>

          {/* Right-aligned Login button */}
          <button
            className="btn btn-danger"
            onClick={() => {
              handleLoginErrorClose();
              router.push("/login");
            }}
            style={{ position: "absolute", right: "15px" }}
          >
            Login
          </button>
        </Modal.Header>

        <Modal.Body>
          <p className="text-center">Please log in to perform this action.</p>
        </Modal.Body>
      </Modal>

      <Modal
        show={showReportModal}
        onHide={() => setShowReportModal(false)}
        // size={'lg'}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Report </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <PropertyReportModal
            propertyId={propertyId}
            handleClose={() => setShowReportModal(false)}
          />
        </Modal.Body>
      </Modal>
    </aside>
  );
};

export default PropertySidebar;
