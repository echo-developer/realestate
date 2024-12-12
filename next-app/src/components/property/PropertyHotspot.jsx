import React, { useState } from "react";

const PropertyHotspot = () => {
    // Sample data for the properties
    const properties = [
        {
            id: 1,
            image: "assets/images/company/company-10.jpg",
            title: "Rajarhat, Block C02, Apartment",
            price: "$34,999 - $39,999",
            reviews: 204,
            rating: 4.0,
        },
        {
            id: 2,
            image: "assets/images/company/company-1.png",
            title: "Rajarhat, Block C02, Apartment",
            price: "$34,999 - $39,999",
            reviews: 204,
            rating: 4.0,
        },
       
    ];

    const locations = [
        { id: 1, name: "Rajarhat" },
        { id: 2, name: "Newtown" },
        { id: 3, name: "EM Bypass" },
        { id: 4, name: "Howrah" },
        { id: 5, name: "Park Street" },
        { id: 6, name: "Behala" },
        { id: 7, name: "Joka" },
        { id: 8, name: "Garia" },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedLocation, setSelectedLocation] = useState(1);

    // Handler to change the current index
    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % properties.length);
    };

    const handlePrev = () => {
        setCurrentIndex(
            (prevIndex) =>
                (prevIndex - 1 + properties.length) % properties.length
        );
    };

    // Handler for selecting a location tab
    const handleLocationChange = (id) => {
        setSelectedLocation(id);
    };

    return (
        <section id="floor-plan" className="mb-4">
            <div className="card border-0 shadow-1 mb-4">
                <div className="card-body">
                    <div className="d-flex justify-content-between">
                        <h4 className="mb-3 text-primary">
                            Hotspot In Kolkata
                        </h4>
                        <h5>
                            <a href="">
                                View All Photos{" "}
                                <i className="bi bi-arrow-right"></i>
                            </a>
                        </h5>
                    </div>

                    <ul
                        className="nav nav-underline nav-fill border-bottom mb-3"
                        role="tablist"
                    >
                        {locations.map((location) => (
                            <li
                                className="nav-item"
                                role="presentation"
                                key={location.id}
                            >
                                <a
                                    className={`nav-link ${
                                        selectedLocation === location.id
                                            ? "active"
                                            : ""
                                    }`}
                                    href="#"
                                    onClick={() => handleLocationChange(location.id)}
                                    id={`location-${location.id}-tab`}
                                    data-bs-toggle="tab"
                                    data-bs-target={`#location-${location.id}-tab-pane`}
                                    aria-selected={selectedLocation === location.id ? "true" : "false"}
                                    role="tab"
                                >
                                    {location.name}
                                </a>
                            </li>
                        ))}
                    </ul>

                    <div className="tab-content" id="myTabContent">
                        <div
                            className={`tab-pane fade show ${
                                selectedLocation === 1 ? "active" : ""
                            }`}
                            id={`location-${selectedLocation}-tab-pane`}
                            role="tabpanel"
                            aria-labelledby={`location-${selectedLocation}-tab`}
                        >
                            <div className="owl-carousel owl-theme advertiser-carousel">
                                <div className="owl-stage-outer">
                                    <div className="owl-stage" style={{ display: 'flex' }}>
                                        {properties.map((property) => (
                                            <div
                                                key={property.id}
                                                className="owl-item"
                                                style={{
                                                    width: "290.5px",
                                                    marginRight: "20px",
                                                }}
                                            >
                                                <article className="item">
                                                    <div className="card card-city">
                                                        <div className="card-body">
                                                            <div className="d-flex">
                                                                <img
                                                                    src={property.image}
                                                                    alt={property.title}
                                                                    height="64"
                                                                    width="64"
                                                                    className="rounded-circle"
                                                                />
                                                                <div className="flex-grow-1 ps-3">
                                                                    <h4>
                                                                        {property.title}{" "}
                                                                        <a href="">
                                                                            <i className="bi bi-box-arrow-up-right"></i>
                                                                        </a>
                                                                    </h4>
                                                                    <h5>{property.price}</h5>
                                                                    <p>
                                                                        <i className="bi bi-star-fill text-warning"></i>{" "}
                                                                        {property.rating} &nbsp; | &nbsp;{" "}
                                                                        {property.reviews}{" "}
                                                                        Reviews
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </article>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="owl-nav">
                                    <button
                                        type="button"
                                        role="presentation"
                                        className="owl-prev"
                                        onClick={handlePrev}
                                    >
                                        <span
                                            aria-label="Previous"
                                            className="icon-line-awesome-angle-left"
                                        ></span>
                                    </button>
                                    <button
                                        type="button"
                                        role="presentation"
                                        className="owl-next"
                                        onClick={handleNext}
                                    >
                                        <span
                                            aria-label="Next"
                                            className="icon-line-awesome-angle-right"
                                        ></span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PropertyHotspot;
