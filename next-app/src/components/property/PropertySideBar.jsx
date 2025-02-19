import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import AuthUser from "../Authentication/AuthUser";
import { toast } from "react-toastify";
import EnquiryForm from "../charts/EnquiryForm";
import { useRouter } from "next/navigation";
import PropertyReportModal from "../ReportData/PropertyReportModal";
import Offcanvas from "react-bootstrap/Offcanvas";
import TopAgentList from "../userReview/TopAgent";
import Link from "next/link";

const PropertySidebar = ({
  propertyId,
  propertyDetails,
  addRemoveFav,
  setShowLoginErrorModal,
}) => {
  const { callApi,isLogin, GetMemberId } = AuthUser();
  const [showPhoneNumber, setShowPhoneNumber] = useState(false);
  const [showCommunicationModal, setShowCommunicationModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showAgentModal, setShowAgentModal] = useState(false);

  const memberId = GetMemberId();

  const handleReportClick = () => {
    if (isLogin()) {
      setShowReportModal(true);
    } else {
      setShowLoginErrorModal(true);
    }
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

  const countryCodes = ["IND +91", "+81", "+71", "+61", "+51"];

  const handleClose = () => setShowCommunicationModal(false);

  const handleAgentClose = () => setShowAgentModal(false);
  const handleAgentShow = () => setShowAgentModal(true);

  const rating = propertyDetails?.user_details?.rating || 0;

  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;

  const defaultLatitude = 22.5726;
  const defaultLongitude = 88.3639;

  const latitude = propertyDetails?.latitude ?? defaultLatitude;
  const longitude = propertyDetails?.longitude ?? defaultLongitude;

  const handleSaveFav = () => {
    if (isLogin()) {
      addRemoveFav(propertyId);
    }else{
      setShowLoginErrorModal(true)
    }
  };

  return (
    <aside className="col-xl-3 col-12">
      <div className="sticky-top_ mb-4">
        <div className="sort-by mb-3">
          {propertyDetails?.project_reviews?.total_reviews && (
            <div className="rateStar me-2">
              <i className="icon-line-awesome-star text-warning"></i>{" "}
              <span>
                {propertyDetails?.project_reviews?.total_reviews ||
                  "Not Available"}
                {"/5"}
              </span>
            </div>
          )}

          <a
            role="button"
            className={` btn me-2 ads-fav ${
              propertyDetails?.is_favourite ? "active" : ""
            }`}
            title="Save for Later"
            onClick={handleSaveFav}
          >
            <i className="icon-line-awesome-heart-o"></i>
          </a>
          {!(memberId === propertyDetails?.user_details?.id) && (
            <a
              role="button"
              className="btn me-2"
              title="Report this Ad"
              onClick={handleReportClick}
            >
              <i className="icon-feather-flag"></i>
            </a>
          )}

          <a
            role="button"
            className="btn me-2"
            title="Print"
            onClick={() => window.print()}
          >
            <i className="icon-feather-printer"></i>
          </a>

          <Link
            target="_blank"
            href={"https://originatesoft.com/"}
            className="btn btn-sm btn-outline-primary w-auto"
          >
            <i className="icon-feather-share-2"></i> Share
          </Link>
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
                  src={`${
                    propertyDetails?.user_details?.image ||
                    "/assets/images/user.jpg"
                  }`}
                />
              </div>
              <div>
                <h4>
                  {propertyDetails?.user_details?.name || "Not Available"}
                  <i
                    class="icon-img-check ms-2"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    aria-label="Certified Agent"
                    data-bs-original-title="Certified Agent"
                  ></i>
                </h4>
                <p class="mb-0">
                  <i>
                    {propertyDetails?.user_details?.totalProperty ||
                      "Not Available"}{" "}
                    Buyer served
                  </i>
                </p>
                <div className="star-rating" data-rating={rating}>
                  {Array(fullStars)
                    .fill()
                    .map((_, i) => (
                      <span key={i} className="star"></span>
                    ))}
                  {halfStar === 1 && <span className="star half"></span>}
                  {Array(emptyStars)
                    .fill()
                    .map((_, i) => (
                      <span key={i + fullStars} className="star empty"></span>
                    ))}
                </div>
                <p class="text-muted">
                  Real Estate{" "}
                  {propertyDetails?.user_details?.user_type === "A"
                    ? "Agent"
                    : propertyDetails?.user_details?.user_type === "O"
                    ? "Owner"
                    : propertyDetails?.user_details?.user_type === "B"
                    ? "Builder"
                    : "Not Available"}
                </p>

                <p>
                  <i class="icon-feather-map-pin text-site"></i>
                  {propertyDetails?.user_details?.address || "Not Available"}
                </p>
                <ul class="p-0">
                  {/* <li class="d-flex justify-content-between mb-1">
                    <span class="text-muted">Operating Since:</span>
                    <span>2010</span>
                  </li> */}
                  <li class="d-flex justify-content-between mb-1">
                    <span class="text-muted">Properties For Sale:</span>
                    <span>
                      {propertyDetails?.user_details?.PropertyInSell ||
                        "Not Available"}
                    </span>
                  </li>
                  <li class="d-flex justify-content-between">
                    <span class="text-muted">Properties For Rent:</span>
                    <span>
                      {propertyDetails?.user_details?.PropertyInRent ||
                        "Not Available"}
                    </span>
                  </li>
                </ul>
                <div class="d-grid">
                  {propertyDetails?.user_details?.phone && (
                    <button
                      className="btn btn-primary mb-1"
                      onClick={() => setShowPhoneNumber(!showPhoneNumber)}
                    >
                      {showPhoneNumber
                        ? propertyDetails?.user_details?.phone_code +
                          propertyDetails?.user_details?.phone
                        : "Get Phone Number"}
                    </button>
                  )}
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
          src={`https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7365.550470855868!2d${longitude}!3d${latitude}!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f89f80fcac8bbd%3A0x82897f52b160f677!2sOriginatesoft!5e0!3m2!1sen!2sin!4v1729171598795!5m2!1sen!2sin`}
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
        ;
        {propertyDetails?.property_brochure_pdf && (
          <div className="cardbox shadow-1 d-flex align-items-center justify-content-between">
            <h4 className="mb-0">Download Brochure</h4>
            <Link
              target="_blank"
              href={`${propertyDetails?.property_brochure_pdf}`}
              className="ms-3"
            >
              <img
                src="/assets/images/icons/brochure.png"
                alt="Download Brochure"
                height="32"
              />
            </Link>
          </div>
        )}
        {propertyDetails?.top_agents?.length > 0 && (
          <div className="card border-0 shadow-1 mb-4">
            <div className="card-body">
              <h4 className="mb-3 text-primary">Top Agents In This Locality</h4>
              {propertyDetails?.top_agents.slice(0, 3).map((agent, index) => (
                <div
                  className="d-flex align-items-center mb-3"
                  key={agent.id || index}
                >
                  <img
                    src={agent.image || "/assets/images/user.jpg"}
                    alt="Agent image"
                    height="64"
                    width="64"
                    className="rounded-circle"
                  />
                  <div className="flex-grow-1 ps-3">
                    <h5 className="mb-0">
                      <a href="#">{agent?.name}</a>{" "}
                      <i
                        className="icon-img-check ms-2"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        aria-label="Certified Agent"
                        data-bs-original-title="Certified Agent"
                      ></i>
                    </h5>
                    <p className="mb-0 text-muted">{agent.email}</p>
                    <p className="mb-2">
                      <i className="icon-line-awesome-star text-warning"></i>{" "}
                      <span className="text-muted">
                        {agent.average_rating} Rating
                      </span>
                    </p>
                  </div>
                </div>
              ))}

              <a role="button" onClick={() => handleAgentShow()}>
                View All Agents <i className="bi bi-arrow-right"></i>
              </a>
            </div>
          </div>
        )}
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
        <div className="text-center mb-4">
          <img
            src="/assets/images/ads/8c178a3ead69fc4c042ecb0e550c2579.png"
            alt="ads"
            className="img-fluid"
          />
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

      <>
        <Offcanvas
          show={showAgentModal}
          placement="end"
          onHide={handleAgentClose}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Review for this property</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <TopAgentList agents={propertyDetails?.top_agents} />
          </Offcanvas.Body>
        </Offcanvas>
      </>
    </aside>
  );
};

export default PropertySidebar;
