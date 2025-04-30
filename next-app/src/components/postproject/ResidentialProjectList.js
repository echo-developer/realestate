import React, { useEffect, useState } from "react";
import Link from "next/link";
import Router from "next/router";
import Modal from "react-bootstrap/Modal";
import ProjectEnquiryForm from "./ProjectEnquiryForm";
import AuthUser from "../Authentication/AuthUser";
import useDateFormat from "@/hooks/useDateFormat";
import { toast } from "react-toastify";
import CardImageSlider from "../cardImageSlider/CardImageSlider";
import useTranslation from "@/hooks/useTranslation";
import { useAuth } from "@/context/AuthProvider";

const ResidentialProjectList = ({ projectListData, setProjectListData }) => {
  const { currencyCode, formatPrice } = useAuth();
  const [showContactModal, setShowContactModal] = useState(false);
  const [showLoginErrorModal, setShowLoginErrorModal] = useState(false);
  const { GetMemberId, isLogin, callApi } = AuthUser();
  const [projectId, setProjectId] = useState(null);

  const handleContactModalClose = () => {
    setShowContactModal(false);
    setProjectId(null);
  };
  const translation = useTranslation();
  const handleLoginErrorClose = () => setShowLoginErrorModal(false);

  const handleContactClick = (id) => {
    setProjectId(id);
    setShowContactModal(true);
  };

  const memberId = GetMemberId();

  const saveFavouriteProject = async (projectId) => {
    if (!memberId) {
      setShowLoginErrorModal(true);
      return;
    }

    try {
      const res = await callApi({
        api: `/add_my_fav_project`,
        method: "UPLOAD",
        data: {
          user_id: memberId,
          project_id: projectId,
        },
      });

      if (res?.status === 1) {
        toast.success(res.message);
        updateFavState(projectId);
      } else {
        toast.error(res?.message || "An error occurred. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to save the project. Please try again.");
    }
  };

  const updateFavState = (projectId) => {
    const state = projectListData;
    const newState = state?.map((item, i) => {
      if (item?.id !== projectId) {
        return item;
      } else {
        return {
          ...item,
          is_fav: !item?.is_fav,
        };
      }
    });
    setProjectListData(newState);
  };

  return (
    <div className="list-display">
      {projectListData?.map((project) => (
        <div key={project.project_id} className="card card-ads">
          <div className="row g-0">
            <div className="col-lg-3 col-sm-3">
              <CardImageSlider
                data={project}
                keyword={"gallery"}
                showSq={true}
                icons={false}
                addRemoveFav={() => saveFavouriteProject(project.id)}
              />
            </div>
            <div className="col-lg-9 col-sm-9 position-relative">
              <div className="card-body">
                <h4>
                  <Link href={`/project-details/${project.slug}`}>
                    {project.project_name}
                  </Link>
                </h4>
                <h5 className="mb-0">
                  {formatPrice(project?.expected_price) || "Price not available"}
                  {/* {project?.expected_price ? `${currencyCode || ""} ${project?.expected_price}` : "Price not available"} */}
                  {/* {project?.currency && project?.expected_price
                    ? `${project.currency} ${new Intl.NumberFormat(
                        "en-US"
                      ).format(project.expected_price)}`
                    : "Price not available"} */}
                </h5>
                <p className="mb-1">
                  <small>
                  {translation?.price_per_sqft || "Price Per sqft:"}{" "}
                    {/* {project?.area_in_sqft ? (
                      <>
                        {project?.currency || project?.price_currency || ""}{" "}
                        {project?.area_in_sqft || ""} sq/ft
                      </>
                    ) : (
                      "Not Available"
                    )} */}
                    {project?.price_per_sqft ? (<>
                    {`${currencyCode} `} {project?.price_per_sqft}
                    </>) : ('Not Available')}
                  </small>
                </p>

                <ul className="list-info mb-2">
                  <li>
                    <i className="icon-img-ratio" title="Carpet Area"></i>
                    <span>
                      {translation?.occupied_area || "Occupied Area"}:{" "}
                      {project?.occupied_area || "Not Available"}{" "}
                      {project?.occupied_area && project?.unit_type}
                    </span>
                  </li>
                  <li>
                    <i className="icon-img-ratio" title="Total Area"></i>
                    <span>
                      {translation?.total_area || "Total Area"}:{" "}
                      {project?.project_size || "Not Available"}{" "}
                      {project?.project_size && project?.unit_type}
                    </span>
                  </li>
                  <li>
                    <i className="icon-img-check" title="Possession Status"></i>
                    <span>
                      {project?.possession_status || "Not Available"}
                    </span>
                  </li>
                  <li>
                    <i className="icon-img-tower" title="Total Tower"></i>
                    <span>
                      {translation?.total_tower || "Total Towers"}:{" "}
                      {project?.total_towers || "Not Available"}
                    </span>
                  </li>

                  <li>
                    <i className="icon-img-project" title="Total Unit"></i>
                    <span>
                      {translation?.total_units || "Total Unit:"}{" "}
                      {project?.total_units || "Not Available"}
                    </span>
                  </li>
                </ul>
                <p className="mb-1">
                  <i className="icon-feather-map-pin me-1"></i>
                  {project.address}
                </p>
              </div>
              <div className="card-footer d-flex justify-content-between align-items-center">
                <div className="d-flex">
                  <div className="ps-1">
                    <h6 className="mb-0">
                      {project?.developer_name || "Developer Name"}
                    </h6>
                    <p className="small text-muted">Developer</p>
                  </div>
                </div>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleContactClick(project.id)}
                >
                  {translation?.contact_now || "Contact Now"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Modal for Contact Owner */}
      <Modal show={showContactModal} onHide={handleContactModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {translation?.contact_owner || "Contact Owner"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ProjectEnquiryForm
            projectId={projectId}
            handleClose={handleContactModalClose}
          />
        </Modal.Body>
      </Modal>

      {/* Login Error Modal */}
      <Modal
        show={showLoginErrorModal}
        onHide={handleLoginErrorClose}
        centered
        size="lg"
      >
        <Modal.Header>
          <button
            className="btn btn-secondary"
            onClick={handleLoginErrorClose}
            style={{ position: "absolute", left: "15px" }}
          >
            {translation?.cancel || "Cancel"}
          </button>
          <Modal.Title className="mx-auto">
            {" "}
            {translation?.login_required || "Login Required"}{" "}
          </Modal.Title>
          <button
            className="btn btn-danger"
            onClick={() => {
              handleLoginErrorClose();
              Router.push("/login");
            }}
            style={{ position: "absolute", right: "15px" }}
          >
            {translation?.login || "Login"}
          </button>
        </Modal.Header>
        <Modal.Body>
          <p className="text-center">
            {" "}
            {translation?.please_log_in_to_perform_this_action ||
              "Please log in to perform this action."}{" "}
          </p>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ResidentialProjectList;
