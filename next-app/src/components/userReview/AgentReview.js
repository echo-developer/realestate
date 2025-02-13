import React, { useState } from "react";
import AuthUser from "../Authentication/AuthUser";
import { toast } from "react-toastify";

const AgentReview = ({onClose }) => {
    const {callApi}=AuthUser();
  const [review, setReview] = useState({
    rating: "",
    comment: "",
  });

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReview((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await callApi({
        api: "/save_agent_review",
        method: "UPLOAD",
        data: review,
      });
  
      if (response && response.status === 1) {
        toast.success(response.message || "Review Added Successfully");
      } else {
        toast.error(response.message || "Failed to add review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("An error occurred while submitting the review");
    }
    
    onClose();
  };
  
 
  return (
    <form onSubmit={handleReviewSubmit}>
      <div className="mb-3">
        <label className="form-label">Rating</label>
        <select
          name="rating"
          className="form-select"
          required
          value={review.rating}
          onChange={handleReviewChange}
        >
          <option value="">Select Rating</option>
          <option value="5">⭐⭐⭐⭐⭐ - Excellent</option>
          <option value="4">⭐⭐⭐⭐ - Good</option>
          <option value="3">⭐⭐⭐ - Average</option>
          <option value="2">⭐⭐ - Below Average</option>
          <option value="1">⭐ - Poor</option>
        </select>
      </div>
      <div className="mb-3">
        <label className="form-label">Comment</label>
        <textarea
          name="comment"
          className="form-control"
          rows="3"
          required
          value={review.comment}
          onChange={handleReviewChange}
        ></textarea>
      </div>
      <button type="submit" className="btn btn-primary">
        Submit Review
      </button>
    </form>
  );
};

export default AgentReview;
