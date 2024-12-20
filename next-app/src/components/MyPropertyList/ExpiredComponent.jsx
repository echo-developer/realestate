"use client";
import React, { useState } from "react";

const ExpiredComponent = ({ propertiesData }) => {
    const [properties, setProperties] = useState(
        propertiesData?.expired_properties?.data || []
    );
    const [currentPage, setCurrentPage] = useState(
        propertiesData?.expired_properties?.current_page || 1
    );
    const [totalPages, setTotalPages] = useState(
        propertiesData?.expired_properties?.total || 0
    );
    const [isModalOpen, setIsModalOpen] = useState(false);

    const loadMoreProperties = () => {
        const newProperties = propertiesData.expired_properties.data;
        setProperties((prevProperties) => [
            ...prevProperties,
            ...newProperties,
        ]);
        setCurrentPage((prevPage) => prevPage + 1);
    };

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
                                                {property?.galleries?.map(
                                                    (gallery, galleryIndex) =>
                                                        gallery?.images?.map(
                                                            (
                                                                image,
                                                                imageIndex
                                                            ) => (
                                                                <div
                                                                    key={`${galleryIndex}-${imageIndex}`}
                                                                    className={`carousel-item ${
                                                                        galleryIndex ===
                                                                            0 &&
                                                                        imageIndex ===
                                                                            0
                                                                            ? "active"
                                                                            : ""
                                                                    }`}
                                                                >
                                                                    <img
                                                                        src={
                                                                            image
                                                                        }
                                                                        alt={
                                                                            gallery.gallery_caption ||
                                                                            "Image"
                                                                        }
                                                                        className="card-img-top"
                                                                    />
                                                                </div>
                                                            )
                                                        )
                                                )}
                                            </div>
                                            <button
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
                                            </button>
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
                                            <a href="#">
                                                {property.property_name}
                                            </a>
                                        </h4>
                                        <p className="mb-1">
                                            <i className="bi bi-geo-alt"></i>{" "}
                                            {property.address}
                                        </p>
                                        <ul className="list-info mb-2">
                                            <li>
                                                <i className="icon-img-flat"></i>{" "}
                                                {property.property_type_for}
                                            </li>
                                            <li>
                                                <i className="icon-img-bed"></i>{" "}
                                                Bedrooms:{" "}
                                                <span>{property.bedrooms}</span>
                                            </li>
                                            <li>
                                                <i className="icon-img-tub"></i>{" "}
                                                Bathrooms:{" "}
                                                <span>{property.bathroom}</span>
                                            </li>
                                        </ul>
                                        <p className="ad-post-date mb-2">
                                            <i className="bi bi-calendar4"></i>{" "}
                                            {property.created_at}
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
                                                    setIsModalOpen(true)
                                                }
                                                className="btn btn-sm btn-warning me-2"
                                            >
                                                Add Amenity
                                            </a>
                                            <a
                                                href="#"
                                                className="btn btn-sm btn-outline-primary me-2 ms-auto"
                                            >
                                                <i className="bi bi-pencil-square"></i>
                                            </a>
                                            <a
                                                href="#"
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
                {currentPage < totalPages && properties.length > 0 && (
                    <button
                        className="btn btn-primary"
                        onClick={loadMoreProperties}
                    >
                        Load More
                    </button>
                )}
            </div>
        </>
    );
};

export default ExpiredComponent;
