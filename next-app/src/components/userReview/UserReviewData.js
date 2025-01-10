"use client";
import { useState } from "react";
import styles from "./reviewdata.module.css";

// Star Rating Component
const StarRating = ({ rating, onRatingChange }) => {
  return (
    <div className={styles.starGroup}>
      {[1, 2, 3, 4, 5].map((value) => (
        <span
          key={value}
          className={value <= rating ? styles.starActive : styles.star}
          onClick={() => onRatingChange(value)}
        >
          {value <= rating ? "★" : "☆"}
        </span>
      ))}
    </div>
  );
};

const UserReviewData = () => {
  const [formData, setFormData] = useState({
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
      formErrors.user_relation_error = "Please select your relation to the property.";
    if (!formData.review_title)
      formErrors.review_title_error = "Please add a title.";
    if (!formData.review_description)
      formErrors.review_description_error = "Please write a review.";

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Submitted Data:", formData);

      try {
        const response = await fetch("/api/submitReview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          console.log("Review submitted successfully!");
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
        } else {
          console.error("Failed to submit review");
        }
      } catch (error) {
        console.error("Error submitting review:", error);
      }
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
        <div className={styles.title}>Write Your Review</div>
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.subheading}>Add Rating</div>
        <div className={styles.ratingWrap}>
          {ratingFields.map((rating) => (
            <div key={rating.field} className={styles.ratingBox}>
              <div className={styles.ratingLabel}>{rating.label}</div>
              <StarRating
                rating={formData[rating.field]}
                onRatingChange={(value) => handleStarRatingChange(rating.field, value)}
              />
            </div>
          ))}
        </div>

        <div className={styles.subheading}>Tell Us More About Your Review</div>
        <div>
          <label>
            <input
              type="radio"
              name="user_relation"
              value="Owner"
              checked={formData.user_relation === "Owner"}
              onChange={handleInputChange}
            />
            Owner
          </label>
          <label>
            <input
              type="radio"
              name="user_relation"
              value="Tenant"
              checked={formData.user_relation === "Tenant"}
              onChange={handleInputChange}
            />
            Tenant
          </label>
          {errors.user_relation_error && <div className={styles.error}>{errors.user_relation_error}</div>}
        </div>

        <div>
          <input
            type="text"
            name="review_title"
            placeholder="Review Title"
            value={formData.review_title}
            onChange={handleInputChange}
          />
          {errors.review_title_error && <div className={styles.error}>{errors.review_title_error}</div>}
        </div>
        <div className="mt-2">
          <textarea
            name="review_description"
            placeholder="Write your review"
            value={formData.review_description}
            onChange={handleInputChange}
          ></textarea>
          {errors.review_description_error && <div className={styles.error}>{errors.review_description_error}</div>}
        </div>
        <button type="submit" className='btn btn-primary'>
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default UserReviewData;
