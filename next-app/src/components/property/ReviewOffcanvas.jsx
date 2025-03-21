import React from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import useTranslation from "@/hooks/useTranslation";
import { Calendar, StarFill } from 'react-bootstrap-icons';
import { format } from 'date-fns'; // For date formatting

const ReviewOffcanvas = ({ show, handleClose, projectReviews }) => {
  const translation = useTranslation();

  // Convert reviews object into an array
  const reviewsArray = projectReviews?.reviews
    ? Object.values(projectReviews.reviews)
    : [];

  return (
    <Offcanvas show={show} onHide={handleClose} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title as="h4">
          {translation?.property_reviews || "Property Reviews"}
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {reviewsArray.length === 0 ? (
          <p>{translation?.no_reviews_available || "No reviews available"}</p>
        ) : (
          reviewsArray.map((review, index) => (
            <div key={review.review_id} className="user-review mb-3">
              <div className="d-flex">
                <div className="star-rating">
                  <StarFill color="#ffc107" size={18} className="me-2" />
                  <span>{parseFloat(review.overall_rating).toFixed(1)}</span>
                </div>
                <span className="text-muted ps-3">
                  <Calendar color="gray" size={14} /> 
                  {format(new Date(review.created_at), 'MMM dd, yyyy')} {/* Formatting the date */}
                </span>
              </div>
              <h4>
                <small>{review.review_title}</small>
              </h4>
              <p>{review.review_description}</p>
              <div className="d-flex user-review-footer">
                <img
                  src={review.review_image || "/assets/images/user.jpg"} // Fallback image
                  alt="User"
                  height="40"
                  width="40"
                  className="rounded-circle"
                />
                <div className="flex-grow-1 ps-2">
                  <h5 className="mb-0">{review.name}</h5>
                  <p className="text-muted">{review.user_relation}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default ReviewOffcanvas;
