// Example Next.js Component
import DashboardLayout from "@/components/layout/DashboardLayout";
import React from "react";

const properties = [
    {
        id: 1,
        title: "4 BHK Flat Sale, 2241 Sq-ft 4 BHK Flat For Sale in Rajarhat, Kolkata",
        location: "Orchid Plaza, Rajarhat, North 24 Parganas, Kolkata - 700135",
        type: "House/Villa",
        bedrooms: 4,
        sqMeter: 550,
        bathrooms: 8,
        garage: 1,
        price: "$499/mo",
        status: "rent",
        date: "10 Jan, 2024",
        images: [
            "assets/images/uploads/property-1.jpg",
            "assets/images/uploads/property-2.jpg",
            "assets/images/uploads/property-3.jpg",
        ],
        agent: {
            name: "Farooq Basir",
            avatar: "assets/images/agents/agent-1.jpg",
        },
    },
    {
        id: 2,
        title: "Executive Suite with Premium Finishes | Vacant Now",
        location: "2436 SW 8th St, Miami, FL 33135, USA",
        type: "Apartment",
        bedrooms: 4,
        sqMeter: 550,
        bathrooms: 8,
        garage: 1,
        price: "$36,500",
        status: "sale",
        date: "10 Jan, 2024",
        images: [
            "assets/images/uploads/property-2.jpg",
            "assets/images/uploads/property-3.jpg",
            "assets/images/uploads/property-4.jpg",
        ],
        agent: {
            name: "Farooq Basir",
            avatar: "assets/images/agents/agent-2.jpg",
        },
    },
    // Add more properties as needed...
];

const index = () => {
    return (
        <DashboardLayout>
            <aside className="col-lg col-12">
                <div className="p-4">
                    <h1 className="h4 text-primary">My Property Listing</h1>

                    <ul className="nav nav-underline mb-3 gap-4">
                        <li className="nav-item">
                            <a className="nav-link active" href="#">
                                Publish
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">
                                Pending
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">
                                Expired
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">
                                Draft
                            </a>
                        </li>
                    </ul>

                    <div className="list-display">
                        {properties.map((property) => (
                            <div className="card card-ads" key={property.id}>
                                <div className="row g-0">
                                    <div className="col-sm-4">
                                        <div className="card-image">
                                            <div
                                                id={`carouselExampleIndicators-${property.id}`}
                                                className="carousel slide ads-carousel"
                                            >
                                                <div className="carousel-inner">
                                                    {property.images.map(
                                                        (image, index) => (
                                                            <div
                                                                key={index}
                                                                className={`carousel-item ${
                                                                    index === 0
                                                                        ? "active"
                                                                        : ""
                                                                }`}
                                                            >
                                                                <img
                                                                    src={image}
                                                                    alt=""
                                                                    className="card-img-top"
                                                                />
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                                <button
                                                    className="carousel-control-prev"
                                                    type="button"
                                                    data-bs-target={`#carouselExampleIndicators-${property.id}`}
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
                                                    data-bs-target={`#carouselExampleIndicators-${property.id}`}
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
                                                className={`ads-type ${property.status}`}
                                            >
                                                for {property.status}
                                            </span>
                                            <span className="ads-fav">
                                                <i className="icon-line-awesome-heart-o"></i>
                                            </span>
                                            <h4 className="ads-price">
                                                {property.price}
                                            </h4>
                                        </div>
                                    </div>
                                    <div className="col-sm-8 position-relative">
                                        <div className="card-body">
                                            <h4>
                                                <a href="property-details.php">
                                                    {property.title}
                                                </a>
                                            </h4>
                                            <p className="mb-1">
                                                <i className="bi bi-geo-alt"></i>{" "}
                                                {property.location}
                                            </p>
                                            <ul className="list-info mb-2">
                                                <li>
                                                    <i className="icon-img-flat"></i>{" "}
                                                    {property.type}
                                                </li>
                                                <li>
                                                    <i className="icon-img-bed"></i>{" "}
                                                    Bedrooms:{" "}
                                                    <span>
                                                        {property.bedrooms}
                                                    </span>
                                                </li>
                                                <li>
                                                    <i className="icon-img-ratio"></i>{" "}
                                                    <span>
                                                        {property.sqMeter}
                                                    </span>{" "}
                                                    sq m
                                                </li>
                                                <li>
                                                    <i className="icon-img-tub"></i>{" "}
                                                    Bathrooms:{" "}
                                                    <span>
                                                        {property.bathrooms}
                                                    </span>
                                                </li>
                                                <li>
                                                    <i className="icon-img-garage"></i>{" "}
                                                    Garage:{" "}
                                                    <span>
                                                        {property.garage}
                                                    </span>
                                                </li>
                                            </ul>
                                            <p className="ad-post-date mb-2">
                                                <i className="bi bi-calendar4"></i>{" "}
                                                {property.date}
                                            </p>
                                            <div className="d-sm-flex">
                                                <a
                                                    href="javascript:void(0)"
                                                    className="btn btn-sm btn-success me-2"
                                                >
                                                    View Enquiry
                                                </a>
                                                <a
                                                    href="javascript:void(0)"
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

                    <div className="grid-display">
                        <div className="row">
                            {properties.map((property) => (
                                <article
                                    key={property.id}
                                    className="col-lg-4 col-sm-6 col-12"
                                >
                                    <div className="card card-ads">
                                        <div className="card-image">
                                            <div
                                                id={`carouselExampleIndicators-${property.id}-grid`}
                                                className="carousel slide ads-carousel"
                                            >
                                                <div className="carousel-inner">
                                                    {property.images.map(
                                                        (image, index) => (
                                                            <div
                                                                key={index}
                                                                className={`carousel-item ${
                                                                    index === 0
                                                                        ? "active"
                                                                        : ""
                                                                }`}
                                                            >
                                                                <img
                                                                    src={image}
                                                                    alt=""
                                                                    className="card-img-top"
                                                                />
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                                <button
                                                    className="carousel-control-prev"
                                                    type="button"
                                                    data-bs-target={`#carouselExampleIndicators-${property.id}-grid`}
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
                                                    data-bs-target={`#carouselExampleIndicators-${property.id}-grid`}
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
                                                className={`ads-type ${property.status}`}
                                            >
                                                for {property.status}
                                            </span>
                                            <span className="ads-fav">
                                                <i className="icon-line-awesome-heart-o"></i>
                                            </span>
                                            <h2 className="ads-price">
                                                {property.price}
                                            </h2>
                                        </div>
                                        <div className="card-body">
                                            <h4>
                                                <a href="">{property.title}</a>
                                            </h4>
                                            <p className="mb-1">
                                                <i className="bi bi-geo-alt"></i>{" "}
                                                {property.location}
                                            </p>
                                            <ul className="list-info">
                                                <li>
                                                    <i className="icon-img-flat"></i>{" "}
                                                    {property.type}
                                                </li>
                                                <li>
                                                    <i className="icon-img-room"></i>{" "}
                                                    Rooms: <span>6</span>
                                                </li>
                                                <li>
                                                    <i className="icon-img-bed"></i>{" "}
                                                    Bedrooms:{" "}
                                                    <span>
                                                        {property.bedrooms}
                                                    </span>
                                                </li>
                                                <li>
                                                    <i className="icon-img-ratio"></i>{" "}
                                                    <span>
                                                        {property.sqMeter}
                                                    </span>{" "}
                                                    sq m
                                                </li>
                                                <li>
                                                    <i className="icon-img-tub"></i>{" "}
                                                    Bathrooms:{" "}
                                                    <span>
                                                        {property.bathrooms}
                                                    </span>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="card-footer">
                                            <div className="user-details">
                                                <div className="user-avatar">
                                                    <img
                                                        src={
                                                            property.agent
                                                                .avatar
                                                        }
                                                        alt=""
                                                        height="32"
                                                        width="32"
                                                        className="rounded-circle"
                                                    />
                                                </div>
                                                <div className="user-name">
                                                    <span>
                                                        {property.agent.name}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className="ad-post-date ms-3">
                                                <i className="bi bi-calendar4"></i>{" "}
                                                {property.date}
                                            </span>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>

                    <div className="text-center">
                        <nav>
                            <ul className="pagination justify-content-center">
                                <li className="page-item">
                                    <a className="page-link" href="#">
                                        <i className="bi bi-chevron-double-left"></i>
                                    </a>
                                </li>
                                <li className="page-item active">
                                    <a className="page-link" href="#">
                                        1
                                    </a>
                                </li>
                                <li className="page-item">
                                    <a className="page-link" href="#">
                                        2
                                    </a>
                                </li>
                                <li className="page-item">
                                    <a className="page-link" href="#">
                                        3
                                    </a>
                                </li>
                                <li className="page-item">
                                    <a className="page-link" href="#">
                                        <i className="bi bi-chevron-double-right"></i>
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </aside>

            <aside class="col-xl-auto col-12">
          <div class="text-center mt-4">
            <img src="assets/images/ads/8c178a3ead69fc4c042ecb0e550c2579.png" alt="ads" className="img-fluid"/>
          </div>
        </aside>
        </DashboardLayout>
    );
};

export default index;
