import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { toast } from "react-toastify";
import AuthUser from "@/components/Authentication/AuthUser";
import withAuth from "@/utils/withAuth";

const propertyResponse = {
  "status": 1,
  "message": "Review retrived successfully",
  "data": {
      "property_reviews": [
          {
              "property_id": 3,
              "overall_rating": "3.5",
              "created_at": "2025-01-21 07:18:20",
              "updated_at": "2025-01-21 07:18:20",
              "review-id": 2,
              "review_title": "review2",
              "review_description": "this is my 2nd review",
              "user_relation": "owner",
              "name": "moin"
          },
          {
              "property_id": 4,
              "overall_rating": "0.0",
              "created_at": "2025-01-21 07:36:36",
              "updated_at": "2025-01-21 07:36:36",
              "review-id": 5,
              "review_title": "ss",
              "review_description": "sss",
              "user_relation": "Owner",
              "name": "moin"
          }
      ],
      "pagination": {
          "total_reviews": 2,
          "total_pages": 1,
          "current_page": 1
      }
  }
}

const projectResponse = {
  "status": 1,
  "message": "Review retrived successfully",
  "data": {
      "project_reviews": [
          {
              "project_id": 16,
              "overall_rating": "1.2",
              "created_at": "2025-02-14 09:11:09",
              "updated_at": "2025-02-14 09:11:09",
              "review_id": 1,
              "review_title": "Ok",
              "review_description": "Good and best project",
              "user_relation": "Owner",
              "user_name": "moin"
          },
          {
              "project_id": 15,
              "overall_rating": "0.5",
              "created_at": "2025-02-17 15:51:44",
              "updated_at": "2025-02-17 15:51:44",
              "review_id": 2,
              "review_title": "ssasa",
              "review_description": "sasa",
              "user_relation": "Owner",
              "user_name": "moin"
          }
      ],
      "pagination": {
          "total_reviews": 2,
          "total_pages": 1,
          "current_page": 1
      }
  }
}

const Index = () => {
  const { callApi, GetMemberId } = AuthUser();
  const [activeTab, setActiveTab] = useState("property");
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const memberId = GetMemberId();
  const [page, setPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0)

  const fetchReviews = async (apiUrl, loadMore, page) => {
    if (!memberId) return;
    if(!loadMore) {
      setIsLoading(true);
    }
    try {
      const response = await callApi({
        api: apiUrl,
        method: "GET",
        data: {
          user_id: memberId,
          currentpage: page || 1
        },
      });

      if (response.status === 1) {
        const type = activeTab === "property" ? "property_reviews" : "project_reviews";
        if(!loadMore) {

          setReviews(response?.data?.[type]);
          setCurrentPage(response?.data?.pagination?.current_page);
          setTotalPage(response?.data?.pagination?.total_pages)
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
  }

  const updateLoadMoreState = (res) => {
    setCurrentPage(response?.data?.pagination?.current_page);
    setTotalPage(response?.data?.pagination?.total_pages)
    const type = activeTab === "property" ? "property_reviews" : "project_reviews";
    setReviews(prev => {
      return [
        ...prev,
        ...res?.data?.[type]
      ]
    })
  }

  return (
    <DashboardLayout>
      <aside className="col-lg col-12  ms-4">
        {/* Tabs for Property and Project */}
        <div className="tabs mb-1 p-2">
          <button
            className={`${activeTab === "property" ? "btn btn-primary tab-btn" : "btn btn-secondary tab-btn"}`}
            onClick={() => setActiveTab("property")}
          >
            Property
          </button>
          <button
            className={`ms-2 ${activeTab === "project" ? "btn btn-primary tab-btn" : "btn btn-secondary tab-btn"}`}
            onClick={() => setActiveTab("project")}
          >
            Project
          </button>
        </div>

        {/* Reviews List */}
        <ul className="card-listing">
          <h3 className="p-2">{activeTab === "property" ? "Property Reviews" : "Project Reviews"}</h3>
          {isLoading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          ) : reviews?.length > 0 ? (
            reviews.map((review) => (
              <li key={review["review-id"]}>
                <div className="d-flex">
                  {/* Image or default */}
                  <img
                    alt={review.name}
                    height="40"
                    width="40"
                    className="rounded-2"
                    src={review.image || "/assets/images/agents/user.jpg"}
                  />
                  <div className="flex-grow-1 ps-3">
                    <h5 className="mb-0">{review.name}</h5>
                    <p className="text-muted">{new Date(review.created_at).toLocaleString()}</p>
                  </div>
                  <div className="flex-shrink-0">
                    {/* Star rating */}
                    <div className="star-rating" data-rating={review.overall_rating}>
                      {[...Array(5)].map((_, index) => {
                        const starValue = index + 1;
                        const rating = parseFloat(review.overall_rating);
                        if (starValue <= Math.floor(rating)) {
                          return <span key={index} className="star"></span>;
                        }
                        if (starValue === Math.ceil(rating)) {
                          return <span key={index} className="star half"></span>;
                        }
                        return <span key={index} className="star empty"></span>;
                      })}
                    </div>
                  </div>
                </div>
                <p>{review.review_description}</p>
              </li>
            ))
          ) : (
            <div className="text-center">
              <h5>No reviews found</h5>
            </div>
          )}
          {currentPage < totalPage && (
            <button
              className="btn btn-primary btn-lg d-block mx-auto mt-4"
              onClick={handleLoadMoreClick}>
              Load More
            </button>
          )}
        </ul>
      </aside>
    </DashboardLayout>
  );
};

export default withAuth(Index);
