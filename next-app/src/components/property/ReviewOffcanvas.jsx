import React from "react";
import Offcanvas from "react-bootstrap/Offcanvas";

const ReviewOffcanvas = ({ show, handleClose, reviews }) => {
  return (
    <Offcanvas show={show} onHide={handleClose} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Property Reviews</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {reviews.length === 0 ? (
          <p>No reviews available.</p>
        ) : (
          reviews.map((review, index) => (
            <div key={index} className="user-review mb-3">
              <div className="d-flex">
                <div className="me-2">
                  <span className="star-rating">{review.overall_rating} ⭐</span>
                </div>
                <span className="text-muted">{review.created_at}</span>
              </div>
              <h4>{review.review_title}</h4>
              <p>{review.review_description}</p>
              <div className="d-flex user-review-footer">
                <div className="flex-grow-1">
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
