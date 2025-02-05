"use client";
import React, { useState } from "react";
import AuthUser from "../Authentication/AuthUser";
import { toast } from "react-toastify";
import Modal from "react-bootstrap/Modal"; // Ensure you have this import

const ProjectSidebar = ({ projectId }) => {
  const { callApi ,GetMemberId} = AuthUser();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    countryCode: "IND +91",
    projectID: projectId,
  });

  const memberId = GetMemberId();

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
          api: `/dddd`,
          method: "UPLOAD",
          data: formData,
        });
        if (response && response.status === 1) {
          toast.success(response.message || "Enquiry Sent Successfully");
        } else {
          toast.error(response.message || "Enquiry Send Failed");
        }
      } catch (error) {
        toast.error("Something went wrong. Please try again later.");
      }
    }
  };

  const handleLoginErrorClose = () => setShowLoginErrorModal(false);

  return (
    <aside className="col-xl-3 col-12">
      <div className="sticky-top_ mb-4">
        <div className="sort-by mb-3">
          <div className="rateStar me-2">
            <i className="icon-line-awesome-star text-warning"></i>
            <span>3.5/5</span>
          </div>
          <a href="#" className="btn me-2 ads-fav" title="Save for Later">
            <i className="icon-line-awesome-heart-o"></i>
          </a>
          <a href="#" className="btn me-2" title="Add to Compare">
            <i className="icon-img-compare m-0"></i>
          </a>
          <a href="#" className="btn me-2" title="Report this Ad">
            <i className="icon-feather-flag"></i>
          </a>
          <a href="#" className="btn me-2" title="Print">
            <i className="icon-feather-printer"></i>
          </a>
          <a href="#" className="btn btn-sm btn-outline-primary w-auto">
            <i className="icon-feather-share-2"></i> Share
          </a>
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
            <h4 className="mb-3 text-primary">Looking For A Property</h4>
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
    </aside>
  );
};

export default ProjectSidebar;
