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
import CardImageSlider from "@/components/cardImageSlider/CardImageSlider";
import useTranslation from "@/hooks/useTranslation";

const Index = () => {
  const { callApi, GetMemberId } = AuthUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [favList, setFavList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const memberId = GetMemberId();
  const [propertyIdToDelete, setPropertyIdToDelete] = useState(null);
  const [propertyId, serPropertyId] = useState();
  const [perPage, setPerPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPages, setCurrentPages] = useState(0);
  const translation = useTranslation();
  useEffect(() => {
    if (memberId) FetchFavList(memberId);
  }, [memberId, propertyId]);

  const FetchFavList = async (memberId, loadMore, nextPage) => {
    if (!loadMore) {
      setIsLoading(true);
    }
    try {
      const response = await callApi({
        api: `/my_fav_property_list`,
        method: "GET",
        data: { user_id: memberId, current_page: nextPage || 1 },
      });

      if (response && response.status === 1) {
        if (!loadMore) {
          setFavList(response?.data?.favorite_properties || []);
        } else {
          setFavList((prev) => {
            return [...prev, ...(response?.data?.favorite_properties || [])];
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

  const handleRemoveProperty = async (propertyIdToDelete) => {
    try {
      const response = await callApi({
        api: `/property_favorite_delete`,
        method: "UPLOAD",
        data: {
          property_id: propertyIdToDelete,
          user_id: memberId,
        },
      });

      if (response && response.status === 1) {
        toast.success("Property deleted successfully");
        setFavList((prevProperties) =>
          prevProperties.filter(
            (property) => property.property_id !== propertyIdToDelete
          )
        );
      } else {
        toast.error("Failed to delete property");
      }
    } catch (error) {
      console.error("Error while deleting property:", error);
      toast.error("An error occurred while deleting the property");
    }
  };

  const handleDeleteClick = (propertyId) => {
    setPropertyIdToDelete(propertyId);
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
        handleRemoveProperty(propertyId);
      }
    });
  };

  const handleShowModal = (propId) => {
    serPropertyId(propId);
    setIsModalOpen(true);
  };

  const handleLoadMoreClick = (nextPage) => {
    setPerPage(nextPage);

    // FetchProjectListData(true, nextPage);
    FetchFavList(memberId, true, nextPage);
  };

  return (
    <DashboardLayout>
      <aside className="col-lg col-12">
        <div className="p-4">
          <h1 className="h4 text-primary">
            {" "}
            {translation?.my_favourite_list || "My Favourite List"}{" "}
          </h1>
          <div className="list-display">
            {isLoading ? (
              <div className="loading-spinner">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">
                    {translation?.loading || "Loading...."}
                  </span>
                </div>
              </div>
            ) : favList.length > 0 ? (
              favList.map((property) => (
                <div className="card card-ads" key={property.property_id}>
                  <div className="row g-0">
                    <div className="col-sm-4">
                     
                      <CardImageSlider data={property} icons={false} />
                    </div>
                    <div className="col-sm-8 position-relative">
                      <div className="card-body">
                        <h4>
                          <Link href={`/property-details/${property.slug}`}>
                            {property.property_name}
                          </Link>
                        </h4>
                        <p className="mb-1">
                          <i className="bi bi-geo-alt"></i> {property.address}
                        </p>
                        <ul className="list-info mb-2">
                          <li>
                            <i className="icon-img-flat"></i>{" "}
                            {property.property_type_for}
                          </li>
                          <li>
                            <i className="icon-img-bed"></i>{" "}
                            {translation?.bedrooms || "Bedrooms"}{" "}
                            {property.bedrooms || "N/A"}
                          </li>
                          <li>
                            <i className="icon-img-tub"></i>{" "}
                            {translation?.bathrooms || "Bathrooms"}{" "}
                            {property.bathroom || "N/A"}
                          </li>
                        </ul>
                        <p className="ad-post-date mb-2">
                          <i className="bi bi-calendar4"></i>{" "}
                          {useDateFormat(property.created_at)}
                        </p>
                        <div className="d-sm-flex">
                          <button className="btn btn-sm btn-primary me-2">
                            {translation?.view_enquiry || "View Enquiry"}
                          </button>
                          <button
                            onClick={() =>
                              handleShowModal(property.property_id)
                            }
                            className="btn btn-sm btn-warning me-2"
                          >
                            {translation?.add_amenity || "Add Amenity"}
                          </button>
                          <Link
                            href={`/property-edit/${property.property_id}`}
                            className="btn btn-sm btn-outline-primary me-2 ms-auto"
                          >
                            <i className="bi bi-pencil-square"></i>
                          </Link>
                          <button
                            onClick={() =>
                              handleDeleteClick(property.property_id)
                            }
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
                    <p className="text-muted">
                      {translation?.no_record_founds || "No Record Founds"}
                    </p>
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
            {/* {favList.length > 9 && (
                            <button
                                className="btn btn-primary"
                                onClick={loadMoreProperties}
                            >
                                Load More
                            </button>
                        )} */}
          </div>
          {isModalOpen && (
            <AddAmenity
              show={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              propertyId={propertyId}
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
