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
import AddExtraProjectData from "../addtional/AddExtraProjectData";
import CardImageSlider from "../cardImageSlider/CardImageSlider";
import useTranslation from '../../hooks/useTranslation'


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
  const [showExtraField, setShowExtraField] = useState(false);
  const [showBrochModal, setShowBrochModal] = useState(false);
  const translation = useTranslation();

  const handleShowFloorModal = (id) => {
    setShowModal(true);
    setPropId(id);
  };
  const showExtraProjectField = (id) => {
    setShowExtraField(true);
    setPropId(id);
  };
  const handleCloseFloorModal = () => setShowModal(false);
  const handleCloseExtraField = () => setShowExtraField(false);

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
                  {/* <div className="card-image">
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
                  </div> */}
                  <CardImageSlider data={project} keyword="gallery" icons={false} />
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
                        <i className="icon-img-flat"></i> {translation?.occupied_area || "Occupied Area:"}{" "}
                        {project.occupied_area}
                      </li>
                      <li>
                        <i className="icon-img-bed"></i> {translation?.total_area || "Total Area:"}{" "}
                        {project.total_area}
                      </li>
                      <li>
                        <i className="icon-img-tub"></i> {translation?.total_units || "Total Units:"}{" "}
                        {project.total_units}
                      </li>
                    </ul>
                    <p className="ad-post-date mb-2">
                      <i className="bi bi-calendar4"></i>{" "}
                      {useDateFormat(project.created_at)}
                    </p>
                    <div className="d-flex flex-wrap gap-2">
                      <button
                        onClick={() => handleShowBrochueModal(project.id)}
                        className="btn btn-sm btn-danger"
                      >
                        {translation?.upload_brochure || "Upload Brochure"}
                      </button>
                      <button
                        onClick={() => handleShowModal(project.id)}
                        className="btn btn-sm btn-warning"
                      >
                        {translation?.add_amenity || "Add Amenity"}
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
                        className="btn btn-sm btn-info"
                      >
                         {translation?.add_property || "Add Property"}
                      </button>
                      <button
                        onClick={() => handleShowFloorModal(project.id)}
                        className="btn btn-sm btn-success"
                      >
                        {translation?.add_floor_data || "Add Floor Data"}
                      </button>
                      <button
                        onClick={() => showExtraProjectField(project.id)}
                        className="btn btn-sm btn-secondary"
                      >
                        {translation?.add_extra_field || "Add Extra Feild"}
                      </button>
                      <Link
                        href={`/project-edit/${project.id}`}
                        className="btn btn-sm btn-outline-primary ms-auto"
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
          <>
            <div className='card border-0 text-center'>
              <div className="card-body">
                <img src="/assets/images/icons/9939447.png" alt="Icon" height={48} width={48} className="mb-2" />
                <p className='text-muted'>{translation?.no_record_founds || "No Record Founds"}</p>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="text-center">
        {currentPage < totalPages && properties.length > 10 && (
          <button className="btn btn-primary" onClick={loadMoreProperties}>
            {translation?.load_more || "Load More"}
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

      {showExtraField && (
        <AddExtraProjectData
          show={showExtraField}
          handleClose={handleCloseExtraField}
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
