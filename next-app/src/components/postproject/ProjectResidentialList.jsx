import React, { useEffect, useState } from "react";
import Link from "next/link";
import Modal from "react-bootstrap/Modal";
import EnquiryForm from "../charts/EnquiryForm";
import { toast } from "react-toastify";
import AuthUser from "../Authentication/AuthUser";
import useDateFormat from "@/hooks/useDateFormat";
import Router from "next/router";

const ProjectList = ({ projectListData, FetchProjectListData }) => {
    const { callApi, GetMemberId, isLogin } = AuthUser();
    const [showContactModal, setShowContactModal] = useState(false);
    const [showLoginErrorModal, setShowLoginErrorModal] = useState(false);
    const [projectId, setProjectId] = useState(null);

    const memberId = GetMemberId();

    useEffect(() => {
        FetchProjectListData(projectId);
    }, [projectId]);

    const handleContactClose = () => setShowContactModal(false);
    const handleLoginErrorClose = () => setShowLoginErrorModal(false);

    const handleClick = (project_id) => {
        setProjectId(project_id);
        setShowContactModal(true);
    };

    const SaveFavouriteProject = async (ProjectId) => {
        if (!isLogin()) {
            setShowLoginErrorModal(true);
            return;
        }

        try {
            const res = await callApi({
                api: `/add_my_fav_project`,
                method: "UPLOAD",
                data: {
                    user_id: memberId,
                    project_id: ProjectId,
                },
            });

            if (res && res.status === 1) {
                toast.success(res.message);
                FetchProjectListData(res);
            } else {
                toast.error(
                    res?.message || "An error occurred. Please try again."
                );
            }
        } catch (error) {
            toast.error("Failed to save the project. Please try again.");
        }
    };

    return (
        <div className="list-display">
            {projectListData?.map((project) => (
                <div key={project.id} className="card card-ads">
                    <div className="row g-0">
                        {/* Project Details */}
                        <div className="col-lg-3 col-sm-3">
                            {/* Project Image */}
                            <div className="card-image">
                                {project.gallery.length > 0 ? (
                                    <div
                                        id={`carousel${project.id}`}
                                        className="carousel slide ads-carousel"
                                        data-bs-ride="carousel"
                                    >
                                        <div className="carousel-inner">
                                            {project?.gallery?.map((gallery) =>
                                                gallery?.images?.map((image, index) => (
                                                    <div
                                                        key={image.id}
                                                        className={`carousel-item ${
                                                            index === 0 ? "active" : ""
                                                        }`}
                                                    >
                                                        <img
                                                            src={image?.filename}
                                                            alt={image?.caption || "Project Image"}
                                                            className="card-img-top"
                                                        />
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <img
                                        src="assets/images/project/default-project.jpg"
                                        alt="Default Project"
                                        className="card-img-top"
                                    />
                                )}

                                <span
                                    className="ads-type"
                                    style={{
                                        backgroundColor:
                                            project.status === 1
                                                ? "green"
                                                : "orange",
                                    }}
                                >
                                    {project.possession_status}
                                </span>
                                <div className="ads-price">
                                    <h4>{project.super_area} sq/ft</h4>
                                    {project.currency} {new Intl.NumberFormat("en-US").format(project.expected_price)}
                                </div>
                            </div>
                        </div>

                        {/* Project Info */}
                        <div className="col-lg-7 col-sm-7 position-relative">
                            <div className="card-body">
                                <h4>
                                    <Link href={`/project-details/${project.slug}`}>
                                        {project.project_name}
                                    </Link>
                                </h4>
                                <p className="mb-1">
                                    <i className="icon-feather-map-pin"></i>
                                    {project.address}
                                </p>
                                <ul className="list-info mb-2">
                                    <li>
                                        <i className="icon-img-building" title="Floor:"></i>
                                        <span>{project.floor || "N/A"}</span>
                                    </li>
                                    <li>
                                        <i className="icon-img-bed" title="Total Units:"></i>
                                        <span>{project.total_units || "N/A"}</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="card-footer">
                                <div>
                                    <span className="ad-post-date">
                                        <i className="icon-feather-calendar"></i>
                                        {useDateFormat(project.created_at)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Contact and Favorite Buttons */}
                        <div className="col-lg-2 col-sm-2">
                            <div className="contact-box">
                                <div className="mb-2">
                                    <h4 className="mb-0">
                                        {project.currency && project.expected_price
                                            ? `${project.currency} ${new Intl.NumberFormat("en-US").format(project.expected_price)}`
                                            : "Price not available"}
                                    </h4>
                                </div>
                                <div className="d-grid">
                                    <button
                                        className="btn btn-primary btn-sm msg-send mb-2"
                                        onClick={() => handleClick(project.id)}
                                    >
                                        Contact Now
                                    </button>
                                    <button
                                        className={`btn ${
                                            project?.is_favorite ? "btn-danger" : "btn-primary"
                                        } btn-sm msg-send mb-2`}
                                        onClick={() => SaveFavouriteProject(project.id)}
                                    >
                                        {project?.is_favorite ? "Remove Fav." : "Add Fav."}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Contact Owner Modal */}
            <Modal show={showContactModal} onHide={handleContactClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Contact Project Owner</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <EnquiryForm projectId={projectId} handleClose={handleContactClose} />
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
                    {/* Left-aligned Cancel button */}
                    <button
                        className="btn btn-secondary"
                        onClick={handleLoginErrorClose}
                        style={{ position: "absolute", left: "15px" }}
                    >
                        Cancel
                    </button>

                    {/* Centered Error Message */}
                    <Modal.Title className="mx-auto">
                        Login Required
                    </Modal.Title>

                    {/* Right-aligned Login button */}
                    <button
                        className="btn btn-danger"
                        onClick={() => {
                            handleLoginErrorClose();
                            Router.push("/login");
                        }}
                        style={{ position: "absolute", right: "15px" }}
                    >
                        Login
                    </button>
                </Modal.Header>

                <Modal.Body>
                    <p className="text-center">Please log in to perform this action.</p>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default ProjectList;
