"use client";
import React, { useState } from "react";
import AddAmenity from "../ModalData/AddAmenity";
import Link from "next/link";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import AuthUser from "../Authentication/AuthUser";
import { toast } from "react-toastify";
import useDateFormat from "@/hooks/useDateFormat";

const PublishComponent = ({ propertiesData, handleLoadMoreClick }) => {
    const { callApi } = AuthUser();
    const [propId, setPropId] = useState();
    const [properties, setProperties] = useState(
        propertiesData?.published_properties?.data || []
    );
    const [currentPage, setCurrentPage] = useState(
        propertiesData?.published_properties?.current_page || 1
    );
    const [totalPages, setTotalPages] = useState(
        propertiesData?.published_properties?.total || 1
    );
    const [isModalOpen, setIsModalOpen] = useState(false);

    const loadMoreProperties = () => {
        if (currentPage < totalPages) {
            const nextPage = currentPage + 1;
            const newProperties =
                propertiesData?.published_properties?.data || [];
            setProperties((prevProperties) => [
                ...prevProperties,
                ...newProperties,
            ]);
            setCurrentPage(nextPage);
        }
    };

    const handleRemoveProperty = async (propertyId) => {
        try {
            const response = await callApi({
                api: `/propety_delete`,
                method: "POST",
                data: {
                    id: propertyId,
                },
            });

            if (response && response.status === 1) {
                toast.success("Property deleted successfully");
                setProperties((prevProperties) =>
                    prevProperties.filter(
                        (property) => property.property_id !== propertyId
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
        Swal.fire({
            title: "Confirm Deletion",
            text: "Are you sure you want to delete this property?",
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

    const handleShowModal = (id) => {
        setPropId(id);
        setIsModalOpen(true);
    };

    console.log("publish page property data", propertiesData)

    return (
        <>
            <div className="list-display">
                {properties.length > 0 ? (
                    properties.map((property) => (
                        <div
                            className="card card-ads"
                            key={property.property_id}
                        >
                            <div className="row g-0">
                                <div className="col-sm-4">
                                    <div className="card-image">
                                        <div
                                            id={`carouselExampleIndicators-${property.property_id}`}
                                            className="carousel slide ads-carousel"
                                        >
                                             <div className="carousel-inner">
                                                {property?.galleries?.some(
                                                    (gallery) =>
                                                        gallery?.images
                                                            ?.length > 0
                                                ) ? (
                                                    property?.galleries?.map(
                                                        (gallery) =>
                                                            gallery?.images?.map(
                                                                (
                                                                    image,
                                                                    index
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            image.image_id
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
                                                                                image?.image_url
                                                                            }
                                                                            alt={
                                                                                image?.caption ||
                                                                                "Property Image"
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
                                                            src="/assets/images/property/default-property-1.jpg"
                                                            alt="Default Property Image"
                                                            className="card-img-top"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                            {/* <button
                                                className="carousel-control-prev"
                                                type="button"
                                                data-bs-target={`#carouselExampleIndicators-${property.property_id}`}
                                                data-bs-slide="prev"
                                            >
                                                <span
                                                    className="carousel-control-prev-icon"
                                                    aria-hidden="true"
                                                ></span>
                                                <span className="visually-hidden">
                                                    Previous
                                                </span>
                                            </button>
                                            <button
                                                className="carousel-control-next"
                                                type="button"
                                                data-bs-target={`#carouselExampleIndicators-${property.property_id}`}
                                                data-bs-slide="next"
                                            >
                                                <span
                                                    className="carousel-control-next-icon"
                                                    aria-hidden="true"
                                                ></span>
                                                <span className="visually-hidden">
                                                    Next
                                                </span>
                                            </button> */}
                                        </div>
                                        <span
                                            className={`ads-type ${
                                                property.status === 0
                                                    ? "pending"
                                                    : ""
                                            }`}
                                        >
                                            for{" "}
                                            {property.status === 0
                                                ? "Pending"
                                                : "Other"}
                                        </span>
                                        <h4 className="ads-price">
                                            {property.price}
                                        </h4>
                                    </div>
                                </div>
                                <div className="col-sm-8 position-relative">
                                    <div className="card-body">
                                        <h4>
                                            <Link
                                                href={`/property-details/${property.slug}`}
                                            >
                                                {property.property_name}
                                            </Link>
                                        </h4>
                                        <p className="mb-1">
                                            <i className="bi bi-geo-alt"></i>{" "}
                                            {property.address}
                                        </p>
                                        <React.Fragment>
                                            {property.post_for ===
                                            "rent" ? (
                                                <ul className="list-info mb-2">
                                                    <li>
                                                        <i className="icon-img-flat"></i>{" "}
                                                        {
                                                            property.property_type_for
                                                        }
                                                    </li>
                                                    <li>
                                                        <i className="icon-img-bed"></i>{" "}
                                                        Bedrooms:{" "}
                                                        <span>
                                                            {property.bedrooms}
                                                        </span>
                                                    </li>
                                                    <li>
                                                        <i className="icon-img-tub"></i>{" "}
                                                        Bathrooms:{" "}
                                                        <span>
                                                            {property.bathroom}
                                                        </span>
                                                    </li>
                                                </ul>
                                            ) : (
                                                <ul className="list-info mb-2">
                                                    <li>
                                                        <i className="icon-img-flat"></i>{" "}
                                                        {
                                                            property.property_type_for
                                                        }
                                                    </li>
                                                    <li>
                                                        <i className="icon-img-bed"></i>{" "}
                                                        Cafeteria:{" "}
                                                        <span>
                                                            {property.cafeteria}
                                                        </span>
                                                    </li>
                                                    <li>
                                                        <i className="icon-img-tub"></i>{" "}
                                                       Personal Washroom:{" "}
                                                        <span>
                                                            {property.personal_washroom}
                                                        </span>
                                                    </li>
                                                </ul>
                                            )}
                                        </React.Fragment>

                                        <p className="ad-post-date mb-2">
                                            <i className="bi bi-calendar4"></i>{" "}
                                            {useDateFormat(property.created_at)}
                                        </p>
                                        <div className="d-sm-flex">
                                            <a
                                                href="#"
                                                className="btn btn-sm btn-success me-2"
                                            >
                                                View Enquiry
                                            </a>
                                            <a
                                                onClick={() =>
                                                    handleShowModal(
                                                        property?.property_id
                                                    )
                                                }
                                                className="btn btn-sm btn-warning me-2"
                                            >
                                                Add Amenity
                                            </a>
                                            <Link
                                                href={`/property-edit/${property?.property_id}`}
                                                className="btn btn-sm btn-outline-primary me-2 ms-auto"
                                            >
                                                <i className="bi bi-pencil-square"></i>
                                            </Link>
                                            <a
                                                onClick={() =>
                                                    handleDeleteClick(
                                                        property.property_id
                                                    )
                                                }
                                                className="btn btn-sm btn-outline-danger"
                                            >
                                                <i className="bi bi-trash3"></i>
                                            </a>
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
                {/* {currentPage < totalPages && properties.length > 0 && (
                    <button
                        className="btn btn-primary"
                        onClick={loadMoreProperties}
                    >
                        Load More
                    </button>
                )} */}
            </div>
            {/* <button
                                class="btn btn-primary btn-lg d-block mx-auto mt-4"
                                onClick={handleLoadMoreClick}
                            >
                                Load More
                            </button> */}

            {isModalOpen && (
                <AddAmenity
                    show={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    propertyId={propId}
                />
            )}
        </>
    );
};

export default PublishComponent;
