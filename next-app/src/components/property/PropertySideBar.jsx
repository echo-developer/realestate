"use client"
import React, { useState } from "react";
import {
  Modal,
  Form,
  Button,
  FloatingLabel,
  Form as BootstrapForm,
} from "react-bootstrap";
import AuthUser from "../Authentication/AuthUser";
import { toast } from "react-toastify";
import EnquiryForm from "../charts/EnquiryForm";
import PropertyReportModal from "../ReportData/PropertyReportModal";
import Offcanvas from "react-bootstrap/Offcanvas";
import TopAgentList from "../userReview/TopAgent";
import Link from "next/link";
import useTranslation from "@/hooks/useTranslation";
import { property_features } from "@/components/post/PropertyData";
import useAdvertisement from "@/hooks/useAdvertisement";

const PropertySidebar = ({
  propertyId,
  propertyDetails,
  addRemoveFav,
  setShowLoginErrorModal,
}) => {
  const { callApi, isLogin, GetMemberId } = AuthUser();
  const [showPhoneNumber, setShowPhoneNumber] = useState(false);
  const [showCommunicationModal, setShowCommunicationModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showAgentModal, setShowAgentModal] = useState(false);
  const translation = useTranslation();
  const memberId = GetMemberId();
  const { adsData, logAdClick } = useAdvertisement("detail-page", "right");
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
    if (!formData.name)
      newErrors.name = translation?.name_is_required || "Name is required";
    if (!formData.email) {
      newErrors.email = translation?.email_required || "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = translation?.invalid_email || "Invalid email format";
    }
    if (!formData.phone) {
      newErrors.phone = translation?.phone_number || "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone =
        translation?.phone_min_length ||
        "Phone number must be exactly 10 digits";
    }
    if (!formData.message)
      newErrors.message =
        translation?.message_is_required || "Message is required";
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

  const handleReportClick = () => {
    if (isLogin()) {
      setShowReportModal(true);
    } else {
      setShowLoginErrorModal(true);
    }
  };

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
    } else {
      setShowLoginErrorModal(true);
    }
  };
  const [showAll, setShowAll] = useState(false);

  return (
    <aside className="col-xl-3 col-12">
      <div className="sticky-top_ mb-4">
        {!propertyDetails?.is_my_property && (
          <>
            <div className="card border-0 shadow-1 mb-4">
              <div className="card-body">
                <div className="user-profile align-items-center">
                  <div className="mb-3">
                    <img
                      alt="Agent image"
                      height="84"
                      width="84"
                      className="rounded-circle"
                      src={`${
                        propertyDetails?.user_details?.image ||
                        "/assets/images/user.jpg"
                      }`}
                    />
                  </div>
                  <div>
                    <h4>
                      {propertyDetails?.user_details?.name ||
                        `${
                          translation?.not_available ||
                          `${translation?.not_available || "Not Available"}`
                        }`}
                      <i
                        className="icon-img-check ms-2"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        aria-label="Certified Agent"
                        data-bs-original-title="Certified Agent"
                      ></i>
                    </h4>
                    <p className="mb-0">
                      <i>
                        {propertyDetails?.user_details?.totalProperty ||
                          `${
                            translation?.not_available ||
                            `${translation?.not_available || "Not Available"}`
                          }`}{" "}
                        {translation?.buyer_served || "Buyer served"}
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
                          <span
                            key={i + fullStars}
                            className="star empty"
                          ></span>
                        ))}
                    </div>
                    <p className="text-muted">
                      {translation?.real_estate || "Real Estate"}{" "}
                      {propertyDetails?.user_details?.user_type === "A"
                        ? `${translation?.agent || "Agent"}`
                        : propertyDetails?.user_details?.user_type === "O"
                        ? `${translation?.owner || "Owner"}`
                        : propertyDetails?.user_details?.user_type === "B"
                        ? `${translation?.builder || "Builder"}`
                        : `${
                            translation?.not_available ||
                            `${translation?.not_available || "Not Available"}`
                          }`}
                    </p>

                    <p>
                      <i className="icon-feather-map-pin text-site"></i>
                      {propertyDetails?.user_details?.address ||
                        `${
                          translation?.not_available ||
                          `${translation?.not_available || "Not Available"}`
                        }`}
                    </p>
                    <ul className="p-0">
                      <li className="d-flex justify-content-between mb-1">
                        <span className="text-muted">
                          {" "}
                          {translation?.properties_for_sale ||
                            "Properties For Sale:"}
                        </span>
                        <span>
                          {propertyDetails?.user_details?.PropertyInSell ||
                            `${translation?.not_available || "Not Available"}`}
                        </span>
                      </li>
                      <li className="d-flex justify-content-between">
                        <span className="text-muted">
                          {translation?.property_for_rent ||
                            "Properties For Rent:"}
                        </span>
                        <span>
                          {propertyDetails?.user_details?.PropertyInRent ||
                            `${translation?.not_available || "Not Available"}`}
                        </span>
                      </li>
                    </ul>
                    <div className="d-grid">
                      {propertyDetails?.user_details?.phone && (
                        <button
                          className="btn btn-primary mb-2"
                          onClick={() => setShowCommunicationModal(true)}
                        >
                          {showPhoneNumber
                            ? propertyDetails?.user_details?.phone_code +
                              propertyDetails?.user_details?.phone
                            : `${
                                translation?.get_phone_number ||
                                "Get Phone Number"
                              }`}
                        </button>
                      )}
                      <button
                        className="btn btn-primary"
                        onClick={() => setShowCommunicationModal(true)}
                      >
                        {translation?.contact_now || "Contact Now"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card border-0 shadow-1 mb-4">
              <div className="card-body">
                <h4 className="mb-3 text-primary">
                  {translation?.looking_for_a_property ||
                    "Looking For A Property"}
                </h4>

                {/* Formik Form */}
                <form onSubmit={handleSubmit}>
                  {/* Name Field */}
                  <FloatingLabel
                    controlId="name"
                    label={translation?.name || "Name"}
                    className="mb-3"
                  >
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder=" "
                    />
                    {errors.name && (
                      <div className="text-danger small">{errors.name}</div>
                    )}
                  </FloatingLabel>

                  {/* Email Field */}
                  <FloatingLabel
                    controlId="email"
                    label={translation?.email_address || "Email Address"}
                    className="mb-3"
                  >
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder=" "
                    />
                    {errors.email && (
                      <div className="text-danger small">{errors.email}</div>
                    )}
                  </FloatingLabel>

                  {/* Phone Field */}
                  <div className="input-group mb-3">
                    <BootstrapForm.Select
                      value={formData.countryCode}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          countryCode: e.target.value,
                        })
                      }
                      style={{ maxWidth: "110px" }}
                    >
                      {countryCodes.map((code, index) => (
                        <option key={index} value={code}>
                          {code}
                        </option>
                      ))}
                    </BootstrapForm.Select>
                    <FloatingLabel
                      controlId="phone"
                      label={translation?.phone || "Phone Number"}
                    >
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
                  {errors.phone && (
                    <div className="text-danger small">{errors.phone}</div>
                  )}

                  {/* Message Field */}
                  <FloatingLabel
                    controlId="message"
                    label={translation?.message || "Message"}
                    className="mb-3"
                  >
                    <textarea
                      className="form-control"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder=" "
                      style={{ minHeight: "100px" }}
                    />
                    {errors.message && (
                      <div className="text-danger small">{errors.message}</div>
                    )}
                  </FloatingLabel>

                  {/* Submit Button */}
                  <Button variant="primary" type="submit" className="btn-block">
                    {translation?.contact_now || "Contact Now"}
                  </Button>
                </form>
              </div>
            </div>
          </>
        )}

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

        {propertyDetails?.property_brochure_pdf && (
          <div className="cardbox shadow-1 d-flex align-items-center justify-content-between">
            <h4 className="mb-0">
              {" "}
              {translation?.download_brochure || "Download Brochure"}
            </h4>
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
        <div className="sort-by mb-3">
          {propertyDetails?.project_reviews?.total_reviews > 0 && (
            <div className="rateStar me-2">
              <i className="icon-line-awesome-star text-warning"></i>{" "}
              <span>
                {propertyDetails?.project_reviews?.total_reviews ||
                  `${
                    translation?.not_available ||
                    `${translation?.not_available || "Not Available"}`
                  }`}
                {"/5"}
              </span>
            </div>
          )}

          {!propertyDetails?.is_my_property && (
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
          )}
          {!propertyDetails?.is_my_property &&
            !(memberId === propertyDetails?.user_details?.id) && (
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
            <i className="icon-feather-share-2"></i>
            {translation?.share || "Share"}
          </Link>
        </div>
        {propertyDetails?.top_agents?.length > 0 && (
          <div className="card border-0 shadow-1 mb-4">
            <div className="card-body">
              <h4 className="mb-3 text-primary">
                {translation?.top_agents_in_this_locality ||
                  "Top Agents In This Locality"}
              </h4>
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
                        {agent.average_rating} {translation?.rating || "Rating"}
                      </span>
                    </p>
                  </div>
                </div>
              ))}

              <a role="button" onClick={() => handleAgentShow()}>
                {translation?.view_all_agents || "View All Agents"}{" "}
                <i className="bi bi-arrow-right"></i>
              </a>
            </div>
          </div>
        )}
        <div className="card border-0 shadow-1 mb-4" id="features">
          <div className="card-body">
            <h4 className="mb-3 text-primary">
              {translation?.why_buy_real_estate ||
                "Why Buy In Real Estate Property"}
            </h4>
            <ul className="list list-1 list-get">
              {property_features
                .slice(0, showAll ? property_features.length : 5)
                .map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
            </ul>
            {!showAll && (
              <a
                role="button"
                className="ms-3"
                onClick={() => setShowAll(true)}
              >
                {translation?.view_more || "View More "}
                <i className="bi bi-plus-lg"></i>
              </a>
            )}
          </div>
        </div>

        <div className="text-center mb-4">
          {adsData.length > 0 ? (
            adsData.map((ad) => (
              <a
                key={ad.advertisement_id}
                role="button"
                onClick={(e) => {
                  e.preventDefault();
                  logAdClick(ad.advertisement_id, ad.ad_url);
                }}
              >
                <img src={ad.ad_image} alt="Ad" />
              </a>
            ))
          ) : (
            <img
              alt="Advertisement"
              src="/assets/images/ads/8c178a3ead69fc4c042ecb0e550c2579.png"
              className="img-fluid"
            />
          )}
        </div>
      </div>

      <Modal
        show={showCommunicationModal}
        onHide={() => setShowCommunicationModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {" "}
            {translation?.communication || "Communication"}
          </Modal.Title>
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
          <Modal.Title>
            {translation?.report_advertisement || "Report This Advertisement"}
          </Modal.Title>
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
            <Offcanvas.Title>
              {translation?.review_for_this_property ||
                "Review for this property"}
            </Offcanvas.Title>
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
