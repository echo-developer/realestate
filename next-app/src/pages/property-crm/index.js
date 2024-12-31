import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal } from "react-bootstrap"; // Ensure you're using react-bootstrap

const properties = [
    {
        id: "5874569",
        imgSrc: "assets/images/uploads/property-1.jpg",
        type: "rent",
        title: "4 BHK Flat Sale, 2241 Sq-ft 4 BHK Flat For Sale in Rajarhat, Kolkata",
        address: "Orchid Plaza, Rajarhat, North 24 Parganas, Kolkata - 700135",
        features: { beds: 4, area: 550, baths: 8, garage: 1 },
        owner: {
            name: "Dev Sharma",
            phone: "+910215895201",
            email: "dev23@gmail.com",
            date: "3rd March, 2024 04:23 pm",
        },
        status: "LEAD",
        badgeClass: "bg-success",
    },
    // Add additional property data here for testing
];

const ITEMS_PER_PAGE = 2; // Number of items to display per load

const Index = () => {
    const [visibleProperties, setVisibleProperties] = useState(ITEMS_PER_PAGE);
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState({}); // Set initial state as an empty object

    const handleLoadMore = () => {
        setVisibleProperties((prev) => prev + ITEMS_PER_PAGE);
    };

    const handleShowModal = (property) => {
        setModalContent(property); // Set the property data as modal content
        setShowModal(true); // Show the modal
    };

    const handleCloseModal = () => {
        setShowModal(false); // Close the modal
    };

    return (
        <DashboardLayout>
            <aside className="col-lg col-12">
                <div className="p-4">
                    <h1 className="h4 text-primary mb-3">Property CRM</h1>

                    <div className="list-display">
                        {properties
                            .slice(0, visibleProperties)
                            .map((property, index) => (
                                <div className="card card-ads" key={index}>
                                    <div className="row g-0">
                                        <div className="col-lg-3 col-sm-4">
                                            <div className="card-image">
                                                <img
                                                    src={property.imgSrc}
                                                    alt=""
                                                    className="card-img-top"
                                                />
                                                <span
                                                    className={`ads-type ${property.type}`}
                                                >
                                                    #{property.id}
                                                </span>
                                                <div className="card-img-overlay">
                                                    <h5>{property.title}</h5>
                                                    <p className="mb-1">
                                                        <i className="bi bi-geo-alt text-white"></i>{" "}
                                                        {property.address}
                                                    </p>
                                                    <ul className="list-info mb-0">
                                                        <li>
                                                            <i className="icon-img-bed"></i>{" "}
                                                            <span>
                                                                {
                                                                    property
                                                                        .features
                                                                        .beds
                                                                }
                                                            </span>
                                                        </li>
                                                        <li>
                                                            <i className="icon-img-ratio"></i>{" "}
                                                            <span>
                                                                {
                                                                    property
                                                                        .features
                                                                        .area
                                                                }
                                                            </span>{" "}
                                                            sq m
                                                        </li>
                                                        <li>
                                                            <i className="icon-img-tub"></i>{" "}
                                                            <span>
                                                                {
                                                                    property
                                                                        .features
                                                                        .baths
                                                                }
                                                            </span>
                                                        </li>
                                                        <li>
                                                            <i className="icon-img-garage"></i>{" "}
                                                            <span>
                                                                {
                                                                    property
                                                                        .features
                                                                        .garage
                                                                }
                                                            </span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-9 col-sm-8 position-relative">
                                            <div className="card-body">
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <h4>
                                                        <a href="#">
                                                            {
                                                                property.owner
                                                                    .name
                                                            }
                                                        </a>
                                                    </h4>
                                                    <span
                                                        className={`badge ${property.badgeClass}`}
                                                    >
                                                        {property.status}
                                                    </span>
                                                </div>
                                                <p className="d-flex gap-3 mb-1">
                                                    <span>
                                                        <i className="bi bi-telephone"></i>{" "}
                                                        {property.owner.phone}
                                                    </span>{" "}
                                                    <span>
                                                        <i className="bi bi-envelope"></i>{" "}
                                                        {property.owner.email}
                                                    </span>{" "}
                                                    <span>
                                                        <i className="bi bi-clock"></i>{" "}
                                                        {property.owner.date}
                                                    </span>
                                                </p>
                                                <p className="text-wrap mb-2">
                                                    Lorem ipsum dolor sit amet,
                                                    consectetur adipisc elit...
                                                </p>
                                                <div className="d-sm-flex">
                                                    <button
                                                        className="btn btn-sm btn-primary me-2"
                                                        onClick={() =>
                                                            handleShowModal(
                                                                property
                                                            )
                                                        }
                                                    >
                                                        Read more
                                                    </button>
                                                    <a
                                                        href="property-crm-schedule.php"
                                                        className="btn btn-sm btn-outline-primary me-2 ms-auto"
                                                    >
                                                        <i className="bi bi-box-arrow-up-right"></i>
                                                    </a>
                                                    <a
                                                        href="javascript:void(0)"
                                                        className="btn btn-sm btn-outline-danger"
                                                    >
                                                        <i className="bi bi-trash3"></i>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>

                    {visibleProperties < properties.length && (
                        <div className="text-center mt-4">
                            <button
                                className="btn btn-primary"
                                onClick={handleLoadMore}
                            >
                                Load More
                            </button>
                        </div>
                    )}
                </div>
            </aside>

            {/* Modal */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <h4>
                            {modalContent?.owner?.name}{" "}
                            <span
                                className={`ads-type ${modalContent?.type}`}
                                style={{ position: "inherit" }}
                            >
                                #{modalContent?.id}
                            </span>
                        </h4>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="d-flex gap-3 mb-1">
                        <span>
                            <i className="bi bi-telephone text-primary"></i>{" "}
                            {modalContent?.owner?.phone}
                        </span>{" "}
                        <span>
                            <i className="bi bi-envelope text-primary"></i>{" "}
                            {modalContent?.owner?.email}
                        </span>
                    </p>
                    <hr />
                    <p>
                        {modalContent?.description ||
                            "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the industry's standard dummy text ever since the 1500s."}
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <button
                        className="btn btn-secondary"
                        onClick={handleCloseModal}
                    >
                        Close
                    </button>
                </Modal.Footer>
            </Modal>
        </DashboardLayout>
    );
};

export default Index;
