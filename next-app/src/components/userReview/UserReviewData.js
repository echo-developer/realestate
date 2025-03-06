"use client";
import { useEffect, useState } from "react";
import styles from "./reviewdata.module.css";
import { toast } from "react-toastify";
import { Modal } from "react-bootstrap";
import AuthUser from "../Authentication/AuthUser";
import { useRouter } from "next/navigation";
import useTranslation from "@/hooks/useTranslation";
import {
  Form,
  Row,
  Col,
  ListGroup,
  Nav,
  ProgressBar,
  FloatingLabel,
} from "react-bootstrap";

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

const UserReviewData = ({ propertyId, closeButton }) => {
  const [showLoginErrorModal, setShowLoginErrorModal] = useState(false);
  const { callApi, GetMemberId, isLogin } = AuthUser();
  const memberId = GetMemberId();
  const router = useRouter();
const translation = useTranslation();
  useEffect(() => {
    if (memberId) {
      setFormData((prevData) => ({ ...prevData, user_id: memberId }));
    }
  }, [memberId]);

  const handleLoginErrorClose = () => setShowLoginErrorModal(false);

  const [formData, setFormData] = useState({
    user_id: memberId,
    property_id: propertyId,
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
            api: `/post_property_review`,
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

        {['radio'].map((type) => (
        <div key={`inline-${type}`} className="mb-4">
          <Form.Check
            inline
            type="radio"
            label={translation?.owner || "Owner"}
            name="user_relation"
            value="Owner"
            id={`inline-${type}-1`}
            checked={formData.user_relation === "Owner"}
            onChange={handleInputChange}
          />

          <Form.Check
            inline
            type="radio"
            label={translation?.tenant || "Tenant"}
            name="user_relation"
            value="Tenant"
            id={`inline-${type}-2`}
            checked={formData.user_relation === "Tenant"}
            onChange={handleInputChange}
          />             
          {errors.user_relation_error && (
            <div className={styles.error}>{errors.user_relation_error}</div>
          )}
          <Form.Check
            inline
            type="radio"
            label={translation?.agent || "Agent"}
            name="user_relation"
            value="Agent"
            id={`inline-${type}-3`}
            checked={formData.user_relation === "Agent"}
            onChange={handleInputChange}
          />              
          {errors.user_relation_error && (
            <div className={styles.error}>{errors.user_relation_error}</div>
          )}
          <Form.Check
            inline
            type="radio"
            label={translation?.builder || "Builder"}
            name="user_relation"
            value="Builder"
            id={`inline-${type}-4`}
            checked={formData.user_relation === "Builder"}
            onChange={handleInputChange}
          />            
          
          {errors.user_relation_error && (
            <div className={styles.error}>{errors.user_relation_error}</div>
          )}
        </div>
      ))}

      <FloatingLabel className="mb-4" label={translation?.review_title || "Review Title"}>
        <Form.Control
          type="text"
          name="review_title"
          placeholder=""
          value={formData.review_title}
          onChange={handleInputChange}
        />
        {errors.review_title_error && (
          <div className={styles.error}>{errors.review_title_error}</div>
        )}
      </FloatingLabel>

      <FloatingLabel className="mb-4" label="Comments">
        <Form.Control
          as="textarea"
          name="review_description"
          placeholder={translation?.write_your_review || "Write your review"}
          value={formData.review_description}
          onChange={handleInputChange}
          style={{ height: '100px' }}
        />
        {errors.review_description_error && (
          <div className={styles.error}>
            {errors.review_description_error}
          </div>
        )}
      </FloatingLabel>

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
          <Modal.Title className="mx-auto"> {translation?.login_required || "Login Required"} </Modal.Title>

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

export default UserReviewData;
