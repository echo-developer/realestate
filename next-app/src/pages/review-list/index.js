import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { toast } from "react-toastify";
import AuthUser from "@/components/Authentication/AuthUser";
import withAuth from "@/utils/withAuth";

const Index = () => {
  const { callApi, GetMemberId } = AuthUser();
  const [activeTab, setActiveTab] = useState("property");
  const [propertyReviews, setPropertyReviews] = useState([]);
  const [projectReviews, setProjectReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const memberId = GetMemberId();

  const fetchReviews = async (apiUrl, setReviews) => {
    if (!memberId) return;
    setIsLoading(true);
    try {
      const response = await callApi({
        api: apiUrl,
        method: "GET",
        data: {
          user_id: memberId,
        },
      });

      if (response.status === 1) {
        setReviews(response.data);
      } else {
        toast.error(response.message);
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
        fetchReviews("/get_users_property_review", setPropertyReviews);
      } else if (activeTab === "project") {
        fetchReviews("/get_project_review", setProjectReviews);
      }
    }
  }, [activeTab, memberId]);

  const reviews = activeTab === "property" ? propertyReviews : projectReviews;

  return (
    <DashboardLayout>
      <aside className="col-lg col-12  ms-4">
        {/* Tabs for Property and Project */}
        <div className="tabs mb-1 p-2">
          <button
            className={`btn btn-primary tab-btn ${activeTab === "property" ? "active" : ""}`}
            onClick={() => setActiveTab("property")}
          >
            Property
          </button>
          <button
            className={`btn btn-secondary tab-btn ms-2 ${activeTab === "project" ? "active" : ""}`}
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
          ) : reviews.length > 0 ? (
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
        </ul>
      </aside>
    </DashboardLayout>
  );
};

export default withAuth(Index);
