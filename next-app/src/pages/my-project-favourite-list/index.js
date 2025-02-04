import React, { useEffect, useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AddAmenity from "@/components/ModalData/AddAmenity";
import useDateFormat from "@/hooks/useDateFormat";
import AuthUser from "@/components/Authentication/AuthUser";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import withAuth from "@/utils/withAuth";
import ProjectAmenities from "@/components/postproject/ProjectAmenities";

const Index = () => {
  const { callApi, GetMemberId } = AuthUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [favList, setFavList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const memberId = GetMemberId();
  const [projectIdToDelete, setProjectIdToDelete] = useState(null);
  const [projectId, setProjectId] = useState();
  const [perPage, setPerPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPages, setCurrentPages] = useState(0);

  useEffect(() => {
    if (memberId) FetchFavList(memberId);
  }, [memberId, projectId]);

  const FetchFavList = async (memberId, loadMore, nextPage) => {
    if (!loadMore) {
      setIsLoading(true);
    }
    try {
      const response = await callApi({
        api: `/my_fav_project_list`,
        method: "GET",
        data: { user_id: memberId, current_page: nextPage || 1 },
      });

      if (response && response.status === 1) {
        if (!loadMore) {
          setFavList(response?.data?.favorite_projects || []);
        } else {
          setFavList((prev) => {
            return [
              ...prev,
              ...(Array.isArray(response?.data)
                ? []
                : response.data.favorite_projects),
            ];
          });
        }
        setTotalPages(response?.data?.pagination?.total_pages || 0);
        setCurrentPages(response?.data?.pagination?.current_page || 0);
      } else {
        toast.error(response?.message || "Failed to fetch properties");
        setTotalPages(response?.data?.pagination?.total_pages || 0);
        setCurrentPages(response?.data?.pagination?.current_page || 0);
      }
    } catch (error) {
      toast.error("An error occurred while fetching properties");
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreProperties = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handleRemoveProperty = async (projectIdToDelete) => {
    try {
      const response = await callApi({
        api: `/project_favorite_delete`,
        method: "UPLOAD",
        data: {
          project_id: projectIdToDelete,
          user_id: memberId,
        },
      });

      if (response && response.status === 1) {
        toast.success("project deleted successfully");
        setFavList((prevProperties) =>
          prevProperties.filter(
            (project) => project.id !== projectIdToDelete
          )
        );
      } else {
        toast.error("Failed to delete project");
      }
    } catch (error) {
      console.error("Error while deleting project:", error);
      toast.error("An error occurred while deleting the project");
    }
  };

  const handleDeleteClick = (id) => {
    setProjectIdToDelete(id);
    Swal.fire({
      title: "Confirm Deletion",
      text: "Are you sure you want to remove from favourite list?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#aaa",
    }).then((result) => {
      if (result.isConfirmed) {
        handleRemoveProperty(id);
      }
    });
  };

  const handleShowModal = (propId) => {
    setProjectId(propId);
    setIsModalOpen(true);
  };

  const handleLoadMoreClick = (nextPage) => {
    setPerPage(nextPage);
    FetchFavList(memberId, true, nextPage);
  };

  return (
    <DashboardLayout>
      <aside className="col-lg col-12">
        <div className="p-4">
          <h1 className="h4 text-primary">My Project Favourite List</h1>
          <div className="list-display">
            {isLoading ? (
              <div className="loading-spinner">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : favList.length > 0 ? (
              favList.map((project) => (
                <div className="card card-ads" key={project.project_id}>
                  <div className="row g-0">
                    <div className="col-sm-4">
                      <div className="card-image">
                        <div
                          id={`carousel-${project.project_id}`}
                          className="carousel slide ads-carousel"
                          data-bs-ride="carousel"
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
                                      alt={image?.caption || "project Image"}
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
                        <h4 className="ads-price">{project.price}</h4>
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
                            <i className="icon-img-flat"></i>{" "}
                            {project.property_type_for}
                          </li>
                          <li>
                            <i className="icon-img-size"></i> Total Units:{" "}
                            {project.total_units || "N/A"}
                          </li>
                          <li>
                            <i className="icon-img-size"></i> Occupied Area:{" "}
                            {project.occupied_area || "N/A"}
                          </li>
                        </ul>
                        <p className="ad-post-date mb-2">
                          <i className="bi bi-calendar4"></i>{" "}
                          {useDateFormat(project.created_at)}
                        </p>
                        <div className="d-sm-flex">
                          <button className="btn btn-sm btn-success me-2">
                            View Enquiry
                          </button>
                          <button
                            onClick={() => handleShowModal(project.id)}
                            className="btn btn-sm btn-warning me-2"
                          >
                            Add Amenity
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
            {currentPages < totalPages && (
              <button
                class="btn btn-primary btn-lg d-block mx-auto mt-4"
                onClick={() => handleLoadMoreClick(perPage + 1)}
              >
                Load More
              </button>
            )}
          </div>
          <div className="text-center">
           
          </div>
          {isModalOpen && (
            <ProjectAmenities
              show={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              projectId={projectId}
            />
          )}
        </div>
      </aside>

      {/* Add CSS for the custom spinner */}
      <style jsx>{`
        .loading-spinner {
          color: gray;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 200px;
        }

        .spinner-border {
          width: 3rem;
          height: 3rem;
          border-width: 0.25em;
        }
      `}</style>
    </DashboardLayout>
  );
};

export default withAuth(Index);
