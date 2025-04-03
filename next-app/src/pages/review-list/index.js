import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { toast } from "react-toastify";
import AuthUser from "@/components/Authentication/AuthUser";
import withAuth from "@/utils/withAuth";
import useTranslation from "@/hooks/useTranslation";
import TextComponent from "@/components/addtional/AreaExpand";
import {
  Form,
  Row,
  Col,
  ListGroup,
  Nav,
  ProgressBar,
  FloatingLabel,
} from "react-bootstrap";
import { Calendar } from "react-bootstrap-icons";

const Index = () => {
  const { callApi, GetMemberId } = AuthUser();
  const [activeTab, setActiveTab] = useState("property");
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const memberId = GetMemberId();
  const [page, setPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);

  const translation = useTranslation();
  const fetchReviews = async (apiUrl, loadMore, page) => {
    if (!memberId) return;
    if (!loadMore) {
      setIsLoading(true);
    }
    try {
      const response = await callApi({
        api: apiUrl,
        method: "GET",
        data: {
          user_id: memberId,
          currentpage: page || 1,
        },
      });

      if (response.status === 1) {
        const type =
          activeTab === "property" ? "property_reviews" : "project_reviews";
        if (!loadMore) {
          setReviews(response?.data?.[type]);
          setCurrentPage(response?.data?.pagination?.current_page);
          setTotalPage(response?.data?.pagination?.total_pages);
        } else {
          updateLoadMoreState(response);
        }
      } else {
        toast.error(response.message);
        setPage(1);
        setCurrentPage(0);
        setTotalPage(0);
      }
    } catch (error) {
      console.error("Failed to fetch reviews", error);
      toast.error("Failed to load reviews");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleText = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    if (memberId) {
      if (activeTab === "property") {
        fetchReviews("/get_users_property_review");
      } else if (activeTab === "project") {
        fetchReviews("/get_project_review");
      }
    }
  }, [activeTab, memberId]);

  // const reviews = activeTab === "property" ? propertyReviews : projectReviews;

  const handleLoadMoreClick = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    if (memberId) {
      if (activeTab === "property") {
        fetchReviews("/get_users_property_review", true, nextPage);
      } else if (activeTab === "project") {
        fetchReviews("/get_project_review", true, nextPage);
      }
    }
  };

  const updateLoadMoreState = (res) => {
    setCurrentPage(response?.data?.pagination?.current_page);
    setTotalPage(response?.data?.pagination?.total_pages);
    const type =
      activeTab === "property" ? "property_reviews" : "project_reviews";
    setReviews((prev) => {
      return [...prev, ...res?.data?.[type]];
    });
  };

  return (
    <DashboardLayout>
      <aside className="col-lg col-12">
        <div className="p-lg-4 p-3">
          {/* Tabs for Property and Project */}
          <Nav variant="underline" className="mb-3">
            <Nav.Item>
              <Nav.Link
                onClick={() => setActiveTab("property")}
                className={`${activeTab === "property" ? "active" : ""}`}
              >
                {translation?.property_reviews || "Property Reviews"}
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                onClick={() => setActiveTab("project")}
                className={`${activeTab === "project" ? "active" : ""}`}
              >
                {translation?.project_reviews || "Project Reviews"}
              </Nav.Link>
            </Nav.Item>
          </Nav>

          {/* Reviews List */}
          <div className="dashboard-listing mb-4">
            <ul className="card-listing">
              {isLoading ? (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                </div>
              ) : reviews?.length > 0 ? (
                reviews.map((review) => (
                  <li key={review["review-id"]}>
                    <div className="d-flex">
                      {/* Image or default */}
                      <div className="flex-shrink-0">
                        <img
                          alt={review.name || review.user_name}
                          height="64"
                          width="64"
                          className="rounded-2"
                          src={review.image || "/assets/images/agents/user.jpg"}
                        />
                      </div>
                      <div className="flex-grow-1 ps-3">
                        <h5 className="mb-0">
                          {review.name || review.user_name} ({review.user_relation})
                        </h5>
                        <p className="text-muted mb-1">
                          <Calendar color="primary" size={12} />{" "}
                          {new Date(review.created_at).toLocaleString()}
                        </p>
                        <p className="text-muted mb-1">{review.review_title}</p>

                        <TextComponent text={review.review_description} />
                      </div>
                      <div className="flex-shrink-0">
                        {/* Star rating */}
                        <div
                          className="star-rating"
                          data-rating={review.overall_rating}
                        >
                          {[...Array(5)].map((_, index) => {
                            const starValue = index + 1;
                            const rating = parseFloat(review.overall_rating);
                            if (starValue <= Math.floor(rating)) {
                              return <span key={index} className="star"></span>;
                            }
                            if (starValue === Math.ceil(rating)) {
                              return (
                                <span key={index} className="star half"></span>
                              );
                            }
                            return (
                              <span key={index} className="star empty"></span>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <>
                  <div className="card border-0 text-center">
                    <div className="card-body">
                      <img
                        src="/assets/images/icons/9939447.png"
                        alt="Icon"
                        height={48}
                        width={48}
                        className="mb-2"
                      />
                      <p className="text-muted">
                        {translation?.no_record_founds || "No Record Founds"}
                      </p>
                    </div>
                  </div>
                </>
              )}
              {currentPage < totalPage && (
                <button
                  className="btn btn-primary btn-lg d-block mx-auto mt-4"
                  onClick={handleLoadMoreClick}
                >
                  Load More
                </button>
              )}
            </ul>
          </div>
        </div>
      </aside>
    </DashboardLayout>
  );
};

export default withAuth(Index);
