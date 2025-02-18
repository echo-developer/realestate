import React from "react";

const TopAgentList = ({ agents }) => {
  return (
    <>
      {agents?.map((agent, index) => (
        <div className="d-flex align-items-center mb-3" key={agent?.id || index}>
          <img
            src={agent.image || "/assets/images/user.jpg"}
            alt="Agent image"
            height="64"
            width="64"
            className="rounded-circle"
          />
          <div className="flex-grow-1 ps-3">
            <h5 className="mb-0">
              <a href="#">{agent?.name}</a>{" "}
              <i
                className="icon-img-check ms-2"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                aria-label="Certified Agent"
                data-bs-original-title="Certified Agent"
              ></i>
            </h5>
            <p className="mb-0 text-muted">{agent?.email}</p>
            <p className="mb-2">
              <i className="icon-line-awesome-star text-warning"></i>{" "}
              <span className="text-muted">{agent?.average_rating} Rating</span>
            </p>
          </div>
        </div>
      ))}
    </>
  );
};

export default TopAgentList;
