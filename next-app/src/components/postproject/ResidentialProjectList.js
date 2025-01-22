import React, { useEffect, useState } from "react";
import Link from "next/link";
import Modal from "react-bootstrap/Modal";
import EnquiryForm from "../charts/EnquiryForm";
import AuthUser from "../Authentication/AuthUser";
import useDateFormat from "@/hooks/useDateFormat";

const ResidentialProjectList = ({ projectListData, FetchProjectListData }) => {
    const [show, setShow] = useState(false);
    const { GetMemberId, isLogin } = AuthUser();
    const [projectId, setProjectId] = useState(null);

    const handleClose = () => setShow(false);

    useEffect(() => {
        FetchProjectListData(projectId);
    }, [projectId]);

    const handleClick = (project_id) => {
        setProjectId(project_id);
        setShow(true);
    };

    const memberId = GetMemberId();

    const SaveFavouriteProject = async (projectId) => {
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
                    project_id: projectId,
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
                <div key={project.project_id} className="card card-ads">
                    <div className="row g-0">
                        <div className="col-lg-3 col-sm-3">
                            <div className="card-image">
                                {project?.gallery?.length > 0 ? (
                                    <div
                                        id={`carousel${project.project_id}`}
                                        className="carousel slide ads-carousel"
                                        data-bs-ride="carousel"
                                    >
                                        <div className="carousel-inner">
                                            {project?.gallery?.some(
                                                (gallery) =>
                                                    gallery?.images?.length > 0
                                            ) ? (
                                                project?.gallery?.map(
                                                    (gallery) =>
                                                        gallery?.images?.map(
                                                            (image, index) => (
                                                                <div
                                                                    key={
                                                                        image.file
                                                                    }
                                                                    className={`carousel-item ${
                                                                        index ===
                                                                        0
                                                                            ? "active"
                                                                            : ""
                                                                    }`}
                                                                >
                                                                    <img
                                                                        src={
                                                                            image.file
                                                                        }
                                                                        alt={
                                                                            image.caption ||
                                                                            "Project Image"
                                                                        }
                                                                        className="card-img-top"
                                                                    />
                                                                </div>
                                                            )
                                                        )
                                                )
                                            ) : (
                                                <div className="carousel-item active">
                                                    <img
                                                        src="assets/images/project/default-project-1.jpg"
                                                        alt="Default Project Image"
                                                        className="card-img-top"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <img
                                        src="assets/images/project/default-project-2.jpg"
                                        alt="Default project"
                                        className="card-img-top"
                                    />
                                )}

                                <div className="ads-price">
                                    <h4>{project.project_size} sq/ft</h4>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-7 col-sm-7 position-relative">
                            <div className="card-body">
                                <h4>
                                    <Link
                                        href={`/project-details/${project.slug}`}
                                    >
                                        {project.project_name}
                                    </Link>
                                </h4>
                                <p className="mb-1">
                                    <i className="icon-feather-map-pin"></i>
                                    {project.address}
                                </p>
                                <ul className="list-info mb-2">
                                    <li>
                                        <i
                                            className="icon-img-bed"
                                            title="Bedrooms:"
                                        ></i>
                                        <span>
                                            {project?.bedrooms || "N/A"}
                                        </span>
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
                        <div className="col-lg-2 col-sm-2">
                            <div className="contact-box">
                                <div className="mb-2">
                                    <h4 className="mb-0">{project.price}</h4>
                                </div>
                                <div className="d-grid">
                                    <button
                                        className="btn btn-primary btn-sm msg-send mb-2"
                                        onClick={() =>
                                            handleClick(project.project_id)
                                        }
                                    >
                                        Contact Now
                                    </button>
                                    <button
                                        className="btn btn-primary btn-sm msg-send mb-2"
                                        onClick={() =>
                                            SaveFavouriteProject(
                                                project.project_id
                                            )
                                        }
                                    >
                                        Favourite
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Modal for Contact Owner */}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Contact Owner</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <EnquiryForm
                        projectId={projectId}
                        handleClose={handleClose}
                    />
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default ResidentialProjectList;
