"use client";

import React from "react";


const CardShimmer = () => {
    return (
        <div className="owl-item">
            <style>
                {
                    `
                                    .shimmer-overlay {
  position: relative;
  overflow: hidden;
}

.shimmer-overlay::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to right,
    #f0f0f0 0%,
    #e0e0e0 20%,
    #f0f0f0 40%,
    #f0f0f0 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite linear;
  z-index: 10;
}

/* Optional: Hide inner content while shimmer is active */
.shimmer-overlay * {
  visibility: hidden;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

                                    `
                }
            </style>
            <article className="item">
                <div className="card card-ads card-overlay mb-3 mb-sm-0 shimmer-overlay">
                    <div className="card-image shimmer-wrapper" style={{ position: "relative" }}>
                        <div className="shimmer"></div>
                        <a href="https://example.com/property/sample-slug" target="_blank" rel="noopener noreferrer">
                            <img
                                alt="Sample Property"
                                height="300"
                                width="300"
                                className="card-img"
                                src="https://via.placeholder.com/300x300?text=Property+Image"
                                loading="lazy"
                            />
                        </a>
                        <span className="ads-type rent">for Rent</span>
                        <span className="ads-fav active">
                            <i className="icon-line-awesome-heart-o"></i>
                        </span>
                    </div>
                    <div className="card-img-overlay">
                        <h4>
                            <a href="https://example.com/property/sample-slug" target="_blank" rel="noopener noreferrer">
                                Modern Apartment in City Center
                            </a>
                        </h4>
                        <ul className="list-info">
                            <li>
                                <i className="icon-img-flat"></i> Apartment
                            </li>
                            <li>
                                <i className="icon-img-bed"></i> Bedrooms <span>3</span>
                            </li>
                            <li>
                                <i className="icon-img-ratio"></i> <span>1200 sqft</span>
                            </li>
                            <li>
                                <i className="icon-img-tub"></i> Bathrooms <span>2</span>
                            </li>
                        </ul>
                        <p className="mb-1">
                            <i className="icon-feather-map-pin text-white me-1"></i>
                            123 Main Street, Downtown, Cityname
                        </p>
                        <div className="d-flex align-items-center">
                            <h4 className="mb-0 flex-grow-1">$1,200/month</h4>
                            <a
                                href="https://example.com/property/sample-slug"
                                className="btn btn-primary"
                                style={{ zIndex: "11" }}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Book Now
                            </a>
                        </div>
                    </div>
                </div>
            </article>
        </div>
    )
}

export default CardShimmer;