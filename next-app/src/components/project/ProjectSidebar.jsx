"use client";
import React, { useState } from "react";
import AuthUser from "../Authentication/AuthUser";
import { toast } from "react-toastify";
import Modal from "react-bootstrap/Modal";
import ProjectEnquiryForm from "../postproject/ProjectEnquiryForm";
import ProjectReportModal from "../ReportData/ProjectReportModal";
import Offcanvas from "react-bootstrap/Offcanvas";
import TopAgentList from "../userReview/TopAgent";
import Link from "next/link";

const ProjectSidebar = ({
  userDetails,
  projectId,
  addRemoveFav,
  projectDetails,
}) => {
  const { callApi, GetMemberId } = AuthUser();
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

  const handleReportClick = () => {
    setShowReportModal(true);
  };

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [showLoginErrorModal, setShowLoginErrorModal] = useState(false);

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

  const handleLoginErrorClose = () => setShowLoginErrorModal(false);

  const handleAgentClose = () => setShowAgentModal(false);
  const handleAgentShow = () => setShowAgentModal(true);

  const defaultLatitude = 22.5726;
  const defaultLongitude = 88.3639;

  const latitude = projectDetails?.latitude ?? defaultLatitude;
  const longitude = projectDetails?.longitude ?? defaultLongitude;

  return (
    <aside className="col-xl-3 col-12">
      <div className="sticky-top_ mb-4">
        <div className="sort-by mb-3">
          {projectDetails?.project_reviews?.total_reviews && (
            <div className="rateStar me-2">
              <i className="icon-line-awesome-star text-warning"></i>{" "}
              <span>
                {projectDetails?.project_reviews?.total_reviews ||
                  "Not Available"}
                {"/5"}
              </span>
            </div>
          )}

          <a
            role="button"
            className={`btn me-2 ads-fav ${
              projectDetails?.is_favourite ? "active" : ""
            }`}
            title="Save for Later"
            onClick={() => addRemoveFav(projectId)}
          >
            <i className="icon-line-awesome-heart-o"></i>
          </a>
          <a
            role="button"
            className="btn me-2"
            title="Report this Ad"
            onClick={() => handleReportClick()}
          >
            <i className="icon-feather-flag"></i>
          </a>
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
                    userDetails?.image || "/assets/images/agents/user.jpg"
                  }`}
                />
              </div>
              <div>
                <h4>
                  {userDetails?.name || "Not Available"}
                  <i
                    class="icon-img-check ms-2"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    aria-label="Certified Agent"
                    data-bs-original-title="Certified Agent"
                  ></i>
                </h4>
                <p class="mb-0">
                  <i>{userDetails?.all_property || "100+"} Buyer served</i>
                </p>
                <div class="star-rating" data-rating="3.5">
                  <span class="star"></span>
                  <span class="star"></span>
                  <span class="star"></span>
                  <span class="star half"></span>
                  <span class="star empty"></span>
                </div>
                <p className="text-muted">
                  Real Estate{" "}
                  {userDetails?.user_type === "A"
                    ? "Agent"
                    : userDetails?.user_type === "O"
                    ? "Owner"
                    : "Builder"}
                </p>

                <p>
                  <i class="icon-feather-map-pin text-site"></i>
                  {userDetails?.addresss || "Not Avaialble"}
                </p>
                <ul class="p-0">
                  {/* <li class="d-flex justify-content-between mb-1">
                    <span class="text-muted">Operating Since:</span>
                    <span>2010</span>
                  </li> */}
                  <li class="d-flex justify-content-between mb-1">
                    <span class="text-muted">Properties For Sale:</span>
                    <span>{userDetails?.sale_property || "Not Avaialble"}</span>
                  </li>
                  <li class="d-flex justify-content-between">
                    <span class="text-muted">Properties For Rent:</span>
                    <span>{userDetails?.rent_property || "Not Avaialble"}</span>
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
                    Contact Agent
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
        <div className="cardbox shadow-1 d-flex align-items-center justify-content-between">
          <h4 className="mb-0">Download Brochure</h4>
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
        <div className="card border-0 shadow-1 mb-4">
          <div className="card-body">
            <h4 className="mb-3 text-primary">Top Agents In This Locality</h4>
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
        <h4 className="text-primary">Project Locality Video</h4>
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
        <div className="card border-0 shadow-1 mb-4">
          <div className="card-body">
            <h4 className="mb-3 text-primary">Looking For A Project</h4>
            <form onSubmit={handleSubmit}>
              <div className="form-floating mb-3">
                <input
                  id="name"
                  name="name"
                  placeholder=" "
                  className="form-control"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                />
                <label htmlFor="name">Name</label>
                {errors.name && (
                  <small className="text-danger">{errors.name}</small>
                )}
              </div>
              <div className="form-floating mb-3">
                <input
                  id="email"
                  name="email"
                  placeholder="name@example.com"
                  className="form-control"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                <label htmlFor="email">Email Address</label>
                {errors.email && (
                  <small className="text-danger">{errors.email}</small>
                )}
              </div>
              <div className="input-group mb-3">
                <select
                  name="countryCode"
                  className="btn-group bootstrap-select input-group-btn fit-width"
                  value={formData.countryCode}
                  onChange={handleChange}
                >
                  <option value="IND +91">IND +91</option>
                  <option value="+81">+81</option>
                  <option value="+71">+71</option>
                  <option value="+61">+61</option>
                  <option value="+51">+51</option>
                </select>
                <div className="form-floating">
                  <input
                    id="phone"
                    name="phone"
                    placeholder=" "
                    className="form-control"
                    type="text"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                  <label htmlFor="phone">Phone Number</label>
                  {errors.phone && (
                    <small className="text-danger">{errors.phone}</small>
                  )}
                </div>
              </div>
              <div className="form-floating mb-3">
                <textarea
                  name="message"
                  id="message"
                  placeholder="Write your message"
                  className="form-control"
                  value={formData.message}
                  onChange={handleChange}
                ></textarea>
                <label htmlFor="message">Message</label>
                {errors.message && (
                  <small className="text-danger">{errors.message}</small>
                )}
              </div>
              <button type="submit" className="btn btn-primary btn-block">
                Send
              </button>
            </form>
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

      {/* Modal for login error */}
      <Modal
        show={showLoginErrorModal}
        onHide={handleLoginErrorClose}
        centered
        size="lg"
      >
        <Modal.Header>
          <button
            className="btn btn-secondary"
            onClick={handleLoginErrorClose}
            style={{ position: "absolute", left: "15px" }}
          >
            Cancel
          </button>
          <Modal.Title className="mx-auto">Login Required</Modal.Title>
          <button
            className="btn btn-danger"
            onClick={() => {
              handleLoginErrorClose();
              Router.push("/login");
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
        show={showCommunicationModal}
        onHide={() => setShowCommunicationModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Communication</Modal.Title>
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
          <Modal.Title>Report </Modal.Title>
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
            <Offcanvas.Title>Top Agents List</Offcanvas.Title>
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
