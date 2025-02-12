"use client";
import React, { useState } from "react";
import ProjectAmenities from "../postproject/ProjectAmenities";
import Link from "next/link";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import AuthUser from "../Authentication/AuthUser";
import AddPropertyData from "../postproject/AddPropertyData";
import { toast } from "react-toastify";
import useDateFormat from "@/hooks/useDateFormat";
import AddFloorData from "../postproject/AddFloorData";
import UploadProjectBrochure from "../BrochureData/UploadProjectBrochure";

const ProjectPendingComponent = ({ projectData }) => {
  const { callApi } = AuthUser();
  const [propId, setPropId] = useState();
  const [projectName, setProjectName] = useState();
  const [projectLocation, setProjectLocation] = useState();
  const [projectTower, setProjectTower] = useState();
  const [properties, setProperties] = useState(projectData || []);
  const [currentPage, setCurrentPage] = useState(
    projectData?.current_page || 1
  );
  const [totalPages, setTotalPages] = useState(projectData?.total || 1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalProperty, setIsModalProperty] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showBrochModal, setShowBrochModal] = useState(false);

  const handleShowFloorModal = (id) => {
    setShowModal(true);
    setPropId(id);
  };
  const handleCloseFloorModal = () => setShowModal(false);

  const loadMoreProperties = () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      const newProperties = projectData || [];
      setProperties((prevProperties) => [...prevProperties, ...newProperties]);
      setCurrentPage(nextPage);
    }
  };

  const handleRemoveProject = async (projectId) => {
    try {
      const response = await callApi({
        api: `/project_delete`,
        method: "UPLOAD",
        data: { project_id: projectId },
      });

      if (response && response.status === 1) {
        toast.success("Project deleted successfully");
        setProperties((prevProperties) =>
          prevProperties.filter((project) => project.id !== projectId)
        );
      } else {
        toast.error("Failed to delete project");
      }
    } catch (error) {
      console.error("Error while deleting project:", error);
      toast.error("An error occurred while deleting the project");
    }
  };

  const handleDeleteClick = (projectId) => {
    console.log(projectId);
    Swal.fire({
      title: "Confirm Deletion",
      text: "Are you sure you want to delete this project?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#aaa",
    }).then((result) => {
      if (result.isConfirmed) {
        handleRemoveProject(projectId);
      }
    });
  };

  const handleShowModal = (id) => {
    setPropId(id);
    setIsModalOpen(true);
  };

  const handleShowPropertyModal = (id, name, location, tower) => {
    setPropId(id);
    setProjectName(name);
    setProjectLocation(location);
    setIsModalProperty(true);
    setProjectTower(tower);
  };

  const handleShowBrochueModal = (id) => {
    setShowBrochModal(true);
    setPropId(id);
  };

  return (
    <>
      <div className="list-display">
        {projectData.length > 0 ? (
          projectData.map((project) => (
            <div className="card card-ads" key={project.id}>
              <div className="row g-0">
                <div className="col-sm-4">
                  <div className="card-image">
                    <div
                      id={`carousel-${project.id}`}
                      className="carousel slide ads-carousel"
                    >
                      <div className="carousel-inner">
                        {project?.gallery?.some(
                          (gallery) => gallery?.images?.length > 0
                        ) ? (
                          project?.gallery?.map((gallery) =>
                            gallery?.images?.map((image, index) => (
                              <div
                                key={image.image_id}
                                className={`carousel-item ${
                                  index === 0 ? "active" : ""
                                }`}
                              >
                                <img
                                  src={image?.file}
                                  alt={image?.caption || "Project Image"}
                                  className="card-img-top"
                                />
                              </div>
                            ))
                          )
                        ) : (
                          <div className="carousel-item active">
                            <img
                              src="/assets/images/project/default-project-1.jpg"
                              alt="Default project Image"
                              className="card-img-top"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <span
                      className={`ads-type ${
                        project.status === 0 ? "pending" : ""
                      }`}
                    >
                      {project.status === 0 ? "Pending" : "Other"}
                    </span>
                    <h4 className="ads-price">
                      {project?.currency || "AED"}{" "}
                      {project?.expected_price || "Price"}
                    </h4>
                  </div>
                </div>
                <div className="col-sm-8 position-relative">
                  <div className="card-body">
                    <h4>
                      <Link href={`/project-details/${project.slug}`}>
                        {project.project_name}
                      </Link>
                    </h4>
                    <p className="mb-1">
                      <i className="bi bi-geo-alt"></i> {project.address}
                    </p>
                    <ul className="list-info mb-2">
                      <li>
                        <i className="icon-img-flat"></i> Carpet Area:{" "}
                        {project.carpet_area}
                      </li>
                      <li>
                        <i className="icon-img-bed"></i> Super Area:{" "}
                        {project.super_area}
                      </li>
                      <li>
                        <i className="icon-img-tub"></i> Total Units:{" "}
                        {project.total_units}
                      </li>
                    </ul>
                    <p className="ad-post-date mb-2">
                      <i className="bi bi-calendar4"></i>{" "}
                      {useDateFormat(project.created_at)}
                    </p>
                    <div className="d-sm-flex">
                      <button
                        onClick={() => handleShowBrochueModal(project.id)}
                        className="btn btn-sm btn-warning me-2"
                      >
                        Upload Brochure
                      </button>
                      <button
                        onClick={() => handleShowModal(project.id)}
                        className="btn btn-sm btn-warning me-2"
                      >
                        Add Amenity
                      </button>
                      <button
                        onClick={() =>
                          handleShowPropertyModal(
                            project.id,
                            project?.project_name,
                            project?.locality,
                            project?.total_towers
                          )
                        }
                        className="btn btn-sm btn-info me-2"
                      >
                        Add Property
                      </button>
                      <button
                        onClick={() => handleShowFloorModal(project.id)}
                        className="btn btn-sm btn-success me-2"
                      >
                        Add Floor Data
                      </button>
                      <Link
                        href={`/project-edit/${project.id}`}
                        className="btn btn-sm btn-outline-primary me-2 ms-auto"
                      >
                        <i className="bi bi-pencil-square"></i>
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(project.id)}
                        className="btn btn-sm btn-outline-danger"
                      >
                        <i className="bi bi-trash3"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No records found.</p>
        )}
      </div>

      <div className="text-center">
        {currentPage < totalPages && properties.length > 10 && (
          <button className="btn btn-primary" onClick={loadMoreProperties}>
            Load More
          </button>
        )}
      </div>

      {isModalOpen && (
        <ProjectAmenities
          show={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          projectId={propId}
        />
      )}
      {isModalProperty && (
        <AddPropertyData
          show={isModalProperty}
          onClose={() => setIsModalProperty(false)}
          projectId={propId}
          projectName={projectName}
          projectLocation={projectLocation}
          totalTowers={projectTower}
        />
      )}

      {showModal && (
        <AddFloorData
          show={showModal}
          handleClose={handleCloseFloorModal}
          propId={propId}
        />
      )}

      <UploadProjectBrochure
        show={showBrochModal}
        handleClose={() => setShowBrochModal(false)}
        projectId={propId}
      />
    </>
  );
};

export default ProjectPendingComponent;
