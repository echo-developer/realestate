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
import CardImageSlider from "@/components/cardImageSlider/CardImageSlider";
import useTranslation from "@/hooks/useTranslation";
import { Row, Col } from "react-bootstrap";

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
  const translation = useTranslation();
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
        setTotalPages(response?.data?.pagination?.total_pages || 0);
        setCurrentPages(response?.data?.pagination?.current_page || 0);
      }
    } catch (error) {
      console.error("An error occurred while fetching properties");
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
        // toast.success("project deleted successfully");
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
        <div className="page-fluid-container">
          <div className="pageTitle">
            <h1>
              {translation?.my_project_favourite_list || "My Project Favourite List"}
            </h1>
          </div>
          <div className="list-display">
            {isLoading ? (
              <div className="loading-spinner">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden"> {translation?.loading || "Loading...."} </span>
                </div>
              </div>
            ) : favList.length > 0 ? (
              favList.map((project) => (
                <div className="card card-ads" key={project.project_id}>
                  <Row className="g-0">
                    <Col xxl={3} sm={4} xs={12}>
                      <CardImageSlider data={project} keyword="gallery" icons={false} showFavIcon={false} />
                    </Col>
                    <Col xxl={9} sm={8} xs={12} className="position-relative">
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
                            {project.property_type_for && <i className="icon-img-flat"></i>}{" "}
                            {project.property_type_for || "Not Available"}
                          </li>
                          <li>
                            {project.total_units && <i className="icon-img-size"></i>}{" "}
                            {translation?.total_units || "Total Units:"} {project.total_units || "Not Available"}
                          </li>
                          <li>
                            {project.occupied_area && <i className="icon-img-size"></i>}{" "}
                            {translation?.occupied_area || "Occupied Area:"} {project.occupied_area || "Not Available"}
                          </li>
                        </ul>

                        <p className="ad-post-date mb-2">
                          <i className="bi bi-calendar4"></i>{" "}
                          {useDateFormat(project.created_at)}
                        </p>
                        <div className="d-flex gap-2 justify-content-end">
                          {/* <button className="btn btn-sm btn-primary">
                            {translation?.view_enquiry || "View Enquiry"}
                          </button>
                          <button
                            onClick={() => handleShowModal(project.id)}
                            className="btn btn-sm btn-warning"
                          >
                            {translation?.add_amenity || "Add Amenity"}
                          </button>
                          <Link
                            href={`/project-edit/${project.id}`}
                            className="btn btn-sm btn-outline-primary ms-auto"
                          >
                            <i className="bi bi-pencil-square"></i>
                          </Link> */}
                          <button
                            onClick={() => handleDeleteClick(project.id)}
                            className="btn btn-sm btn-outline-danger"
                          >
                            <i className="bi bi-trash3"></i>
                          </button>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
              ))
            ) : (
              <>
                <div className="card border-0 text-center">
                  <div className="card-body">
                    <img
                      src="/assets/images/icons/9939447.png"
                      alt="Icon"
                      height={48}
                      width={48}
                      className="mb-2"
                      loading="lazy"
                    />
                    <p className="text-muted">{translation?.no_record_founds || "No Record Founds"}</p>
                  </div>
                </div>
              </>
            )}
            {currentPages < totalPages && (
              <button
                className="btn btn-primary btn-lg d-block mx-auto mt-4"
                onClick={() => handleLoadMoreClick(perPage + 1)}
              >
                {translation?.load_more || "Load More"}
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
