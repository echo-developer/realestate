"use client";
import React, { useState } from "react";
import { Modal, Form, FloatingLabel, Button } from "react-bootstrap";
import AuthUser from "../Authentication/AuthUser";
import { toast } from "react-toastify";
import ProjectEnquiryForm from "../postproject/ProjectEnquiryForm";
import ProjectReportModal from "../ReportData/ProjectReportModal";
import Offcanvas from "react-bootstrap/Offcanvas";
import TopAgentList from "../userReview/TopAgent";
import Link from "next/link";
import useTranslation from "@/hooks/useTranslation";
  
import {
  featureList,
} from "../post/PropertyData";



const ProjectSidebar = ({
  userDetails,
  projectId,
  addRemoveFav,
  projectDetails,
  setShowLoginErrorModal,
}) => {

  const [showAll, setShowAll] = useState(false);
  const { callApi, isLogin, GetMemberId } = AuthUser();
  const [showCommunicationModal, setShowCommunicationModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    countryCode: "IND +91",
    projectID: projectId,
  });
  const [showPhoneNumber, setShowPhoneNumber] = useState(false);
  const handleClose = () => setShowCommunicationModal(false);
  const memberId = GetMemberId();
  const [showReportModal, setShowReportModal] = useState(false);
  const [showAgentModal, setShowAgentModal] = useState(false);
  const translation = useTranslation();
  const handleReportClick = () => {
    if (isLogin()) {
      setShowReportModal(true);
    } else {
      setShowLoginErrorModal(true);
    }
  };

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validate = () => {
    let valid = true;
    const newErrors = { name: "", email: "", phone: "", message: "" };

    if (!formData.name) {
      newErrors.name = "Name is required";
      valid = false;
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Valid email is required";
      valid = false;
    }
    if (!formData.phone || !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Valid phone number is required (10 digits)";
      valid = false;
    }
    if (!formData.message) {
      newErrors.message = "Message is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!memberId) {
      setShowLoginErrorModal(true);
      return;
    }

    if (validate()) {
      try {
        const response = await callApi({
          api: `/add_project_enquery`,
          method: "UPLOAD",
          data: formData,
        });
        if (response && response.status === 1) {
          toast.success(response.message || "Enquiry Sent Successfully");
          setFormData({
            name: "",
            email: "",
            phone: "",
            message: "",
            countryCode: "IND +91",
          });
        } else {
          toast.error(response.message || "Enquiry Send Failed");
        }
      } catch (error) {
        toast.error("Something went wrong. Please try again later.");
      }
    }
  };

  const handleAgentClose = () => setShowAgentModal(false);
  const handleAgentShow = () => setShowAgentModal(true);

  const rating = projectDetails?.user_details?.rating || 0;

  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;

  const defaultLatitude = 22.5726;
  const defaultLongitude = 88.3639;

  const latitude = projectDetails?.latitude ?? defaultLatitude;
  const longitude = projectDetails?.longitude ?? defaultLongitude;

  return (
    <aside className="col-xl-3 col-12">
      <div className="sticky-top_ mb-4">
        <div className="sort-by mb-3">
          {projectDetails?.project_reviews?.total_reviews > 0 && (
            <div className="rateStar me-2">
              <i className="icon-line-awesome-star text-warning"></i>{" "}
              <span>
                {projectDetails?.project_reviews?.total_reviews ||
                  `${translation?.not_available ||"Not available"}`}
                {"/5"}
              </span>
            </div>
          )}
          {
            !projectDetails?.is_my_project && (
              <a
                role="button"
                className={`btn me-2 ads-fav ${projectDetails?.is_favourite ? "active" : ""
                  }`}
                title="Save for Later"
                onClick={() => addRemoveFav(projectId)}
              >
                <i className="icon-line-awesome-heart-o"></i>
              </a>
           )
          }
          {/* {!(memberId === projectDetails?.user_details?.id) && (
            <a
              role="button"
              className="btn me-2"
              title="Report this Ad"
              onClick={() => handleReportClick()}
            >
              <i className="icon-feather-flag"></i>
            </a>
          )} */}

          {!projectDetails?.is_my_project && 
          !(memberId === projectDetails?.user_details?.id) && (
            <a
              role="button"
              className="btn me-2"
              title="Report this Ad"
              onClick={() => handleReportClick()}
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
            <i className="icon-feather-share-2"></i> {translation?.share || "Share"}
          </Link>
        </div>
        {!projectDetails?.is_my_project && (
          <div className="card border-0 shadow-1 mb-4">
          <div className="card-body">
            <div className="user-profile align-items-center">
              <div className="mb-3">
                <img
                  alt="Agent image"
                  height="84"
                  width="84"
                  className="rounded-circle"
                  src={`${projectDetails?.user_details?.image ||
                    "/assets/images/agents/user.jpg"
                    }`}
                />
              </div>
              <div>
                <h4>
                  {projectDetails?.user_details?.name || `${translation?.not_available ||"Not available"}`}
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
                    {projectDetails?.user_details?.totalProJect ||
                      `${translation?.not_available ||"Not available"}`}{" "}
                      {translation?.real_estate || "Buyer served"}
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
                <p className="text-muted">
                {translation?.real_estate || "Real Estate"}{" "}
                  {projectDetails?.user_details?.user_type === "A"
                    ? "Agent"
                    : projectDetails?.user_details?.user_type === "O"
                      ? "Owner"
                      : projectDetails?.user_details?.user_type === "B"
                        ? "Builder"
                        : `${translation?.not_available ||"Not available"}`}
                </p>

                <p>
                  <i className="icon-feather-map-pin text-site"></i>
                  {projectDetails?.user_details?.address || `${translation?.not_avaialble ||"Not Avaialble"}`}
                </p>
                <ul className="p-0">
                  {/* <li className="d-flex justify-content-between mb-1">
                    <span className="text-muted">Operating Since:</span>
                    <span>2010</span>
                  </li> */}
                  <li className="d-flex justify-content-between mb-1">
                    <span className="text-muted">{translation?.properties_for_sale || "Properties For Sale"}</span>
                    <span>
                      {projectDetails?.user_details?.ProjectInSell ||
                         `${translation?.not_avaialble ||"Not Avaialble"}`}
                    </span>
                  </li>
                  <li className="d-flex justify-content-between">
                    <span className="text-muted">{translation?.property_for_rent || "Properties For Rent:"}</span>
                    <span>
                      {projectDetails?.user_details?.ProjectInRent ||
                        `${translation?.not_avaialble ||"Not Avaialble"}`}
                    </span>
                  </li>
                </ul>
                <div className="d-grid">
                  {projectDetails?.user_details?.phone && (
                    <button
                      className="btn btn-primary mb-1"
                      onClick={() => setShowPhoneNumber(!showPhoneNumber)}
                    >
                      {showPhoneNumber
                        ? projectDetails?.user_details?.phone_code +
                        projectDetails?.user_details?.phone
                        : `${translation?.not_avaialble ||"Not Avaialble"}`}
                    </button>
                  )}

                  <button
                    className="btn btn-primary"
                    onClick={() => setShowCommunicationModal(true)}
                  >
                     {translation?.contact_agent || "Contact Agent"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
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
        ;
        {projectDetails?.project_brochure_pdf && (
          <div className="cardbox shadow-1 d-flex align-items-center justify-content-between">
            <h4 className="mb-0"> {translation?.download_brochure || "Download Brochure"}</h4>
            <Link
              target="_blank"
              href={`${projectDetails?.project_brochure_pdf}`}
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
        <div className="card border-0 shadow-1 mb-4">
          <div className="card-body">
            <h4 className="mb-3 text-primary">{translation?.looking_for_a_project || "Looking For A Project"}</h4>
            <form onSubmit={handleSubmit}>
              <FloatingLabel
                controlId="floatingInput"
                label={translation?.name || "Name"}
                className="mb-3"
              >
                <Form.Control
                  id="name"
                  name="name"
                  placeholder=" "
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && (
                  <small className="text-danger">{errors.name}</small>
                )}
              </FloatingLabel>
              <FloatingLabel
                controlId="floatingInput"
                label={translation?.email_address || "Email Address"}
                className="mb-3"
              >
                <Form.Control
                  id="email"
                  name="email"
                  placeholder="name@example.com"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <small className="text-danger">{errors.email}</small>
                )}
              </FloatingLabel>
              <div className="input-group mb-3">
                <Form.Select
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                  style={{maxWidth:'110px'}}
                >
                  <option value="IND +91">IND +91</option>
                  <option value="+81">+81</option>
                  <option value="+71">+71</option>
                  <option value="+61">+61</option>
                  <option value="+51">+51</option>
                </Form.Select>
                <FloatingLabel 
                  label={"Phone Number"}
                >
                  <Form.Control
                    type="number"
                    id="phone"
                    name="phone"
                    placeholder=" "

                    value={formData.phone}
                    onChange={handleChange}
                  />
                  
                </FloatingLabel>
              </div>
              {errors.phone && (
                <small className="text-danger">{errors.phone}</small>
              )}
              <FloatingLabel 
                className="mb-3"
                >
                <Form.Control
                  as="textarea"
                  name="message"
                  id="message"
                  placeholder="Write your message"
                  value={formData.message}
                  onChange={handleChange}
                />
                <label htmlFor="message">{translation?.message || "Message"}</label>
                {errors.message && (
                  <small className="text-danger">{errors.message}</small>
                )}
              </FloatingLabel>
              <Button
                variant="primary"
                  type="submit" className="btn-block">
              {translation?.send || "Send"}
              </Button>
            </form>
          </div>
        </div>
        <div className="card border-0 shadow-1 mb-4">
          <div className="card-body">
            <h4 className="mb-3 text-primary">{translation?.top_agents_in_this_locality || "Top Agents In This Locality"}</h4>
            {projectDetails?.top_agents?.slice(0, 3).map((agent, index) => (
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
                      {agent.average_rating}{translation?.rating || "Rating"} 
                    </span>
                  </p>
                </div>
              </div>
            ))}

            <a role="button" onClick={() => handleAgentShow()}>
            {translation?.view_all_agents || "View All Agents"}  <i className="bi bi-arrow-right"></i>
            </a>
          </div>
        </div>
        <h4 className="text-primary">{translation?.project_locality_video || "Project Locality Video"}</h4>
        <div className="property-video mb-4">
          <iframe
            style={{ borderRadius: "10px", width: "100%" }}
            height="240"
            src="https://www.youtube.com/embed/ViH5U3zzTfw?controls=0"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        <div className="card border-0 shadow-1 mb-4" id="features">
          <div className="card-body">
            <h4 className="mb-3 text-primary">
              {translation?.why_buy_real_estate_projects ||
                "Why Buy In Real Estate Projects"}
            </h4>
            <ul className="list list-1 list-get">
              {featureList
                .slice(0, showAll ? featureList.length : 5)
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
          <Modal.Title> {translation?.communication || "Communication"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ProjectEnquiryForm projectId={projectId} handleClose={handleClose} />
        </Modal.Body>
      </Modal>

      <Modal
        show={showReportModal}
        onHide={() => setShowReportModal(false)}
        // size={'lg'}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{translation?.report_advertisement || "Report This Advertisement"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ProjectReportModal
            projectId={projectId}
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
            <Offcanvas.Title>{translation?.top_agents_list || "Top Agents List"}</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <TopAgentList agents={projectDetails?.top_agents} />
          </Offcanvas.Body>
        </Offcanvas>
      </>
    </aside>
  );
};

export default ProjectSidebar;
