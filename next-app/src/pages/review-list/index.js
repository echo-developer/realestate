import DashboardLayout from "@/components/layout/DashboardLayout";
import React from "react";

const reviews = [
  {
    id: 1,
    name: "Hawkins Marow",
    time: "4 min ago",
    image: "/assets/images/agents/agent-1.jpg",
    rating: 3.5,
    review:
      "I viewed a number of properties with Just Property and found them to be professional, efficient, patient, courteous and helpful every time.",
  },
  {
    id: 2,
    name: "Hawkins Marow",
    time: "4 min ago",
    image: "/assets/images/agents/agent-3.jpg",
    rating: 4.5,
    review:
      "I viewed a number of properties with Just Property and found them to be professional, efficient, patient, courteous and helpful every time.",
  },
];

const Index = () => {
  return (
    <DashboardLayout>
        <aside className="col-lg col-12">

      <ul className="card-listing">
        <h3 className="p-2">Review List </h3>
        {reviews.map((review) => (
          <li key={review.id}>
            <div className="d-flex">
              <img
                alt={review.name}
                height="40"
                width="40"
                className="rounded-2"
                src={review.image}
              />
              <div className="flex-grow-1 ps-3">
                <h5 className="mb-0">{review.name}</h5>
                <p className="text-muted">{review.time}</p>
              </div>
              <div className="flex-shrink-0">
                <div className="star-rating" data-rating={review.rating}>
                  {[...Array(5)].map((_, index) => {
                    const starValue = index + 1;
                    if (starValue <= Math.floor(review.rating)) {
                      return <span key={index} className="star"></span>;
                    }
                    if (starValue === Math.ceil(review.rating)) {
                      return <span key={index} className="star half"></span>;
                    }
                    return <span key={index} className="star empty"></span>;
                  })}
                </div>
              </div>
            </div>
            <p>{review.review}</p>
          </li>
        ))}
      </ul>
      </aside>
    </DashboardLayout>
  );
};

export default Index;
