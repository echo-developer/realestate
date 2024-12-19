import React, { useState } from "react";

const PublishComponent = ({ propertiesData }) => {
  const [properties, setProperties] = useState(propertiesData?.pending_properties?.data || []);
  const [currentPage, setCurrentPage] = useState(propertiesData?.pending_properties?.current_page || 1);
  const [totalPages, setTotalPages] = useState(propertiesData?.pending_properties?.total || 1);

  const loadMoreProperties = () => {
    // Simulating a load more by fetching new data based on the current page
    // Ideally, this would be an API call to fetch the next set of properties based on `currentPage`.
    if (currentPage < totalPages) {
      // Fetch the next page data (this should ideally be done via an API request)
      const nextPage = currentPage + 1;
      const newProperties = propertiesData?.pending_properties?.data || []; // Replace this with actual data fetching logic
      setProperties((prevProperties) => [...prevProperties, ...newProperties]);
      setCurrentPage(nextPage);
    }
  };

  return (
    <>
      <div className="list-display">
        {properties.map((property) => (
          <div className="card card-ads" key={property.property_id}>
            <div className="row g-0">
              <div className="col-sm-4">
                <div className="card-image">
                  <div
                    id={`carouselExampleIndicators-${property.property_id}`}
                    className="carousel slide ads-carousel"
                  >
                    <div className="carousel-inner">
                      {property.galleries.map((gallery, index) => (
                        <div
                          key={index}
                          className={`carousel-item ${index === 0 ? "active" : ""}`}
                        >
                          <img
                            src={gallery.images[0]} // Assuming single image in the gallery for now
                            alt={gallery.gallery_caption}
                            className="card-img-top"
                          />
                        </div>
                      ))}
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
                      <span className="visually-hidden">Previous</span>
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
                      <span className="visually-hidden">Next</span>
                    </button>
                  </div>
                  <span
                    className={`ads-type ${property.status === 0 ? "pending" : ""}`}
                  >
                    for {property.status === 0 ? "Pending" : "Other"}
                  </span>
                  <h4 className="ads-price">{property.price}</h4>
                </div>
              </div>
              <div className="col-sm-8 position-relative">
                <div className="card-body">
                  <h4>
                    <a href="#">{property.property_name}</a>
                  </h4>
                  <p className="mb-1">
                    <i className="bi bi-geo-alt"></i> {property.address}
                  </p>
                  <ul className="list-info mb-2">
                    <li>
                      <i className="icon-img-flat"></i> {property.property_type_for}
                    </li>
                    <li>
                      <i className="icon-img-bed"></i> Bedrooms:{" "}
                      <span>{property.bedrooms}</span>
                    </li>
                    <li>
                      <i className="icon-img-tub"></i> Bathrooms:{" "}
                      <span>{property.bathroom}</span>
                    </li>
                  </ul>
                  <p className="ad-post-date mb-2">
                    <i className="bi bi-calendar4"></i> {property.created_at}
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

      <div className="text-center">
        {currentPage < totalPages && (
          <button className="btn btn-primary" onClick={loadMoreProperties}>
            Load More
          </button>
        )}
      </div>
    </>
  );
};

export default PublishComponent;
