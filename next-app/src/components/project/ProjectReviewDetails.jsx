import React, { useState } from "react";
import ReviewOffcanvas from "../property/ReviewOffcanvas";
import useDateFormat from "@/hooks/useDateFormat";
import useTranslation from "@/hooks/useTranslation";
import { Row, Col, Button } from "react-bootstrap";
import { StarFill, Calendar } from 'react-bootstrap-icons';
import TextComponent from "@/components/addtional/AreaExpand";

const ProjectReviewDetails = ({ project_reviews,ShowReviewModal, is_my_project }) => {
  const { rating, total_reviews, reviews } = project_reviews || {};
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  

  const handleShow = () => setShowOffcanvas(true);
  const handleClose = () => setShowOffcanvas(false);
  const translation = useTranslation();

  return (
    <>
      <section id="review">
        <div className="card border-0 shadow-1 mb-4">
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <h4 className="mb-3 text-primary">{translation?.next || "Project Reviews & Ratings"} </h4>
              {!is_my_project && (
                <h5>
                  <Button variant="primary" onClick={ShowReviewModal}>{translation?.write_a_review || "Write A Review"} <i className="bi bi-arrow-right"></i></Button>
                </h5>
              )}
            </div>

            <div className="row">
              <article className="col-lg-4 col-sm-6">
                <div className="d-flex mb-3">
                  <div className="star-rating">
                    <StarFill color="#ffc107" size={24} className="me-2" />
                    <span className="h4">{rating}</span>
                  </div>
                  <div className="ps-4">
                    <p className="text-muted">
                      {rating}{translation?.ratings || "ratings"}<br />
                      {total_reviews} {translation?.reviews || "Reviews"}
                    </p>
                  </div>
                </div>
              </article>
            </div>

            <div className="row">
              {reviews?.length > 0 && reviews.slice(0, 2).map((review, index) => (
                <article key={index} className="col-lg-6 col-12">
                  <div className="user-review mb-3">
                    <div className="d-flex">
                      <div className="star-rating me-2">
                        <span className="star">{review.overall_rating} ⭐</span>
                      </div>
                      <span className="text-muted">{useDateFormat(review.created_at)}</span>
                    </div>
                    <h4>{review.review_title}</h4>
                    <p>{review.review_description}</p>
                    <div className="d-flex user-review-footer">
                    <img src={`${review?.review_image ||"/assets/images/user.jpg"}`} alt="User" height="40" width="40" className="rounded-circle"/>
                      <div className="flex-grow-1">
                        <h5 className="mb-0">{review.name}</h5>
                        <p className="text-muted">{review.user_relation}</p>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="d-grid d-sm-block">
              <button onClick={handleShow} className="btn btn-outline-primary">
              {translation?.view_more_reviews || "View More Reviews"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Offcanvas for More Reviews */}
      <ReviewOffcanvas show={showOffcanvas} handleClose={handleClose} reviews={reviews} />
    </>
  );
};

export default ProjectReviewDetails;
