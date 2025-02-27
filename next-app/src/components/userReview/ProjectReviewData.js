"use client";
import { useEffect, useState } from "react";
import styles from "./reviewdata.module.css";
import { toast } from "react-toastify";
import AuthUser from "../Authentication/AuthUser";
import { Modal } from "react-bootstrap";
import { useRouter } from "next/navigation";
import useTranslation from "@/hooks/useTranslation";

// Star Rating Component
const StarRating = ({ rating, onRatingChange }) => {
  return (
    <div className={styles.starGroup}>
      {[1, 2, 3, 4, 5].map((value) => (
        <span
          key={value}
          className={value <= rating ? styles.starActive : styles.star}
          onClick={() => onRatingChange(value)}
          href="#"
          aria-label={`Rate ${value} star${value > 1 ? "s" : ""}`}
        >
          {value <= rating ? "★" : "☆"}
        </span>
      ))}
    </div>
  );
};

const ProjectReviewData = ({ projectId, closeButton }) => {
  const { callApi, GetMemberId ,isLogin } = AuthUser();
  const memberId = GetMemberId();
  const router = useRouter();
  const [showLoginErrorModal, setShowLoginErrorModal] = useState(false);
  const translation = useTranslation();
  const handleLoginErrorClose = () => setShowLoginErrorModal(false);

  useEffect(() => {
    if (memberId) {
      setFormData((prevData) => ({ ...prevData, user_id: memberId }));
    }
  }, [memberId]);

  const [formData, setFormData] = useState({
    user_id: memberId,
    project_id: projectId,
    neighborhood_rate: 0,
    roads_rate: 0,
    safety_rate: 0,
    cleanliness_rate: 0,
    public_transport_rate: 0,
    parking_rate: 0,
    connectivity_rate: 0,
    traffic_rate: 0,
    market_rate: 0,
    schools_rate: 0,
    restaurants_rate: 0,
    hospital_rate: 0,
    user_relation: "",
    review_title: "",
    review_description: "",
  });

  const [errors, setErrors] = useState({});

  const handleStarRatingChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    let formErrors = {};

    if (!formData.user_relation)
      formErrors.user_relation_error =
        "Please select your relation to the property.";
    if (!formData.review_title.trim())
      formErrors.review_title_error = "Please add a title.";
    if (!formData.review_description.trim())
      formErrors.review_description_error = "Please write a review.";

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      neighborhood_rate: 0,
      roads_rate: 0,
      safety_rate: 0,
      cleanliness_rate: 0,
      public_transport_rate: 0,
      parking_rate: 0,
      connectivity_rate: 0,
      traffic_rate: 0,
      market_rate: 0,
      schools_rate: 0,
      restaurants_rate: 0,
      hospital_rate: 0,
      user_relation: "",
      review_title: "",
      review_description: "",
    });
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin()) {
      if (validateForm()) {
        try {
          const response = await callApi({
            api: `/post_project_review`,
            method: "UPLOAD",
            data: formData,
          });

          if (response && response.status === 1) {
            toast.success(response.message);
            resetForm();
            closeButton();
          } else {
            toast.error(response?.message || "Failed to submit review");
          }
        } catch (error) {
          console.error("Error submitting review:", error);
          toast.error(
            "An error occurred while submitting your review. Please try again."
          );
        }
      }
    } else {
      setShowLoginErrorModal(true);
    }
  };

  const ratingFields = [
    { label: "Neighborhood", field: "neighborhood_rate" },
    { label: "Roads", field: "roads_rate" },
    { label: "Safety", field: "safety_rate" },
    { label: "Cleanliness", field: "cleanliness_rate" },
    { label: "Public Transport", field: "public_transport_rate" },
    { label: "Parking", field: "parking_rate" },
    { label: "Connectivity", field: "connectivity_rate" },
    { label: "Traffic", field: "traffic_rate" },
    { label: "Market", field: "market_rate" },
    { label: "Schools", field: "schools_rate" },
    { label: "Restaurants", field: "restaurants_rate" },
    { label: "Hospitals", field: "hospital_rate" },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>{translation?.write_your_review || "Write your review"}</div>
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.subheading}>{translation?.add_rating || "Add Rating"}</div>
        <div className={styles.ratingWrap}>
          {ratingFields.map((rating) => (
            <div key={rating.field} className={styles.ratingBox}>
              <div className={styles.ratingLabel}>{rating.label}</div>
              <StarRating
                rating={formData[rating.field]}
                onRatingChange={(value) =>
                  handleStarRatingChange(rating.field, value)
                }
              />
            </div>
          ))}
        </div>

        <div className={styles.subheading}>{translation?.tell_us_more_about_your_review || "Tell Us More About Your Review"}</div>
        <div>
          <label>
            <input
              type="radio"
              name="user_relation"
              value="Owner"
              checked={formData.user_relation === "Owner"}
              onChange={handleInputChange}
            />
              {translation?.owner || "Owner"}
          </label>
          <label>
            <input
              type="radio"
              name="user_relation"
              value="Tenant"
              checked={formData.user_relation === "Tenant"}
              onChange={handleInputChange}
            />
             {translation?.tenant || "Tenant"}
          </label>
          {errors.user_relation_error && (
            <div className={styles.error}>{errors.user_relation_error}</div>
          )}
          <label>
            <input
              type="radio"
              name="user_relation"
              value="Agent"
              checked={formData.user_relation === "Agent"}
              onChange={handleInputChange}
            />
            {translation?.agent || "Agent"}
          </label>
          {errors.user_relation_error && (
            <div className={styles.error}>{errors.user_relation_error}</div>
          )}
          <label>
            <input
              type="radio"
              name="user_relation"
              value="Builder"
              checked={formData.user_relation === "Builder"}
              onChange={handleInputChange}
            />
           {translation?.builder || "Builder"}
          </label>
          {errors.user_relation_error && (
            <div className={styles.error}>{errors.user_relation_error}</div>
          )}
        </div>

        <div>
          <input
            type="text"
            name="review_title"
            placeholder={translation?.review_title || "Review Title"}
            value={formData.review_title}
            onChange={handleInputChange}
          />
          {errors.review_title_error && (
            <div className={styles.error}>{errors.review_title_error}</div>
          )}
        </div>
        <div className="mt-2">
          <textarea
            name="review_description"
            placeholder={translation?.write_your_review || "Write your review"}
            value={formData.review_description}
            onChange={handleInputChange}
          ></textarea>
          {errors.review_description_error && (
            <div className={styles.error}>
              {errors.review_description_error}
            </div>
          )}
        </div>
        <button type="submit" className="btn btn-primary">
        {translation?.submit_review || "Submit Review"} 
        </button>
      </form>

      {/* Login Error Modal */}
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
          <Modal.Title className="mx-auto">{translation?.login_required || "Login Required"}</Modal.Title>

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
          <p className="text-center">{translation?.please_log_in || "Please log in to perform this action."}</p>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ProjectReviewData;
