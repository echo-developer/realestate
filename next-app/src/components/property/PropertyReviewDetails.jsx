import React, { useState } from "react";
import ReviewOffcanvas from "./ReviewOffcanvas";
import useDateFormat from "@/hooks/useDateFormat";
import useTranslation from "@/hooks/useTranslation";
import { Row, Col, Button } from "react-bootstrap";
import { StarFill, Calendar } from 'react-bootstrap-icons';
import TextComponent from "@/components/addtional/AreaExpand";

const PropertyReviewDetails = ({ property_reviews, handleShowCanvas, isMyProperty }) => {
  const { rating = 0, total_reviews = 0, reviews = [], has_user_reviewed = false } = property_reviews || {};
  const [showOffcanvas, setShowOffcanvas] = useState(false);


  const handleShow = () => setShowOffcanvas(true);
  const handleClose = () => setShowOffcanvas(false);
  const translation = useTranslation();

  return (
    <>
      <section id="property_review">
        <div className="card border-0 shadow-1 mb-4">
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <h4 className="mb-3 text-primary">{translation?.reviews_ratings || "Reviews & Ratings"}</h4>
              {!has_user_reviewed && (
                <h5>
                  <Button variant="primary" onClick={handleShowCanvas}>{translation?.write_a_review || "Write A Review"}  <i className="bi bi-arrow-right"></i></Button>
                </h5>
              )}
            </div>

            <div className="row">
              <article className="col-lg-4 col-sm-6">
                <div className="d-flex align-items-center mb-3">
                  <div className="star-rating align-items-end">
                    <StarFill color="#ffc107" size={24} className="me-2" />
                    <span className="h4 mb-0">{rating}</span>
                  </div>
                  <div className="ps-4">
                    <p className="text-muted">
                      {rating} {translation?.ratings || "ratings"} <br />
                      {/* {total_reviews}  {translation?.reviews || "Reviews"} */}
                    </p>
                  </div>
                </div>
              </article>
            </div>

            {reviews?.length > 0 ? (
              <div className="row">
                {reviews?.slice(0, 2)?.map((review, index) => (
                  <article key={index} className="col-lg-6 col-12">
                    <div className="user-review mb-3">
                      <div className="d-flex mb-2 w-100">
                        <div className="flex-shrink-0">
                          <div className="star-rating" data-rating={review.overall_rating}>
                            {[...Array(5)].map((_, starIndex) => {
                              const starValue = starIndex + 1;
                              const rating = parseFloat(review.overall_rating);
                              if (starValue <= Math.floor(rating)) {
                                return <span key={starIndex} className="star"></span>;
                              }
                              if (starValue === Math.ceil(rating)) {
                                return <span key={starIndex} className="star half"></span>;
                              }
                              return <span key={starIndex} className="star empty"></span>;
                            })}
                          </div>
                        </div>
                        <span className="text-muted ps-4"><Calendar color="gray" size={14} /> {useDateFormat(review.created_at)}</span>
                      </div>
                      <h4><small>{review.review_title}</small></h4>

                      <TextComponent text={review.review_description} />
                      <div className="d-flex user-review-footer">
                        <img src={`${review?.review_image || "/assets/images/user.jpg"}`} alt="User" height="40" width="40" className="rounded-circle flex-shrink-0" />
                        <div className="flex-grow-1 ps-2">
                          <h5 className="mb-0">{review.name}</h5>
                          <p className="text-muted">{review.user_relation}</p>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-5">
                <p className="text-muted mb-3">
                  {translation?.no_reviews_yet || "No reviews yet. Be the first to review this property!"}
                </p>
                <Button variant="outline-primary" onClick={handleShowCanvas}>
                  {translation?.write_a_review || "Write A Review"}
                </Button>
              </div>
            )}

            {reviews?.length > 2 && (
              <>
                <div className="d-grid d-sm-block">
                  <button onClick={handleShow} className="btn btn-outline-primary">
                    {translation?.view_more_reviews || "View More Reviews"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Offcanvas for More Reviews */}
      <ReviewOffcanvas show={showOffcanvas} handleClose={handleClose} projectReviews={property_reviews} />
    </>
  );
};

export default PropertyReviewDetails;
