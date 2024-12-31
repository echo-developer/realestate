import React, { useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AddAmenity from '@/components/ModalData/AddAmenity';
import useDateFormat from '@/hooks/useDateFormat';

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [properties, setProperties] = useState([
    // Example data; replace with your fetched data
    {
      property_id: 1,
      property_name: "Sample Property 1",
      address: "Sample Address 1",
      price: "AED 1,200,000",
      property_type_for: "Sale",
      bedrooms: 3,
      bathroom: 2,
      created_at: "2024-01-01",
      galleries: [
        { gallery_caption: "Gallery 1", images: ["/img1.jpg", "/img2.jpg"] },
      ],
      status: 0,
    },
    {
      property_id: 2,
      property_name: "Sample Property 2",
      address: "Sample Address 2",
      price: "AED 800,000",
      property_type_for: "Rent",
      bedrooms: 2,
      bathroom: 1,
      created_at: "2024-01-05",
      galleries: [
        { gallery_caption: "Gallery 2", images: ["/img3.jpg", "/img4.jpg"] },
      ],
      status: 1,
    },
  ]);

  const totalPages = 2; 

  const loadMoreProperties = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handleDeleteClick = (propertyId) => {
    setProperties((prevProperties) =>
      prevProperties.filter((property) => property.property_id !== propertyId)
    );
  };

  return (
    <DashboardLayout>
      <aside className="col-lg col-12">
        <div className="p-4">
          <h1 className="h4 text-primary">My Favourite Listing</h1>
          <div className="list-display">
            {properties.length > 0 ? (
              properties.map((property) => (
                <div className="card card-ads" key={property.property_id}>
                  <div className="row g-0">
                    <div className="col-sm-4">
                      <div className="card-image">
                        <div
                          id={`carousel-${property.property_id}`}
                          className="carousel slide ads-carousel"
                          data-bs-ride="carousel"
                        >
                          <div className="carousel-inner">
                            {property.galleries.map((gallery, galleryIndex) =>
                              gallery.images.map((image, imageIndex) => (
                                <div
                                  key={`${galleryIndex}-${imageIndex}`}
                                  className={`carousel-item ${
                                    galleryIndex === 0 && imageIndex === 0 ? "active" : ""
                                  }`}
                                >
                                  <img
                                    src={image}
                                    alt={gallery.gallery_caption || "Image"}
                                    className="card-img-top"
                                  />
                                </div>
                              ))
                            )}
                          </div>
                          <button
                            className="carousel-control-prev"
                            type="button"
                            data-bs-target={`#carousel-${property.property_id}`}
                            data-bs-slide="prev"
                          >
                            <span className="carousel-control-prev-icon"></span>
                          </button>
                          <button
                            className="carousel-control-next"
                            type="button"
                            data-bs-target={`#carousel-${property.property_id}`}
                            data-bs-slide="next"
                          >
                            <span className="carousel-control-next-icon"></span>
                          </button>
                        </div>
                        <span
                          className={`ads-type ${property.status === 0 ? "pending" : "active"}`}
                        >
                          {property.status === 0 ? "Pending" : "Active"}
                        </span>
                        <h4 className="ads-price">{property.price}</h4>
                      </div>
                    </div>
                    <div className="col-sm-8 position-relative">
                      <div className="card-body">
                        <h4>
                          <Link href={`/property-details/${property.property_id}`}>
                            {property.property_name}
                          </Link>
                        </h4>
                        <p className="mb-1">
                          <i className="bi bi-geo-alt"></i> {property.address}
                        </p>
                        <ul className="list-info mb-2">
                          <li>
                            <i className="icon-img-flat"></i> {property.property_type_for}
                          </li>
                          <li>
                            <i className="icon-img-bed"></i> Bedrooms: {property.bedrooms}
                          </li>
                          <li>
                            <i className="icon-img-tub"></i> Bathrooms: {property.bathroom}
                          </li>
                        </ul>
                        <p className="ad-post-date mb-2">
                          <i className="bi bi-calendar4"></i> {useDateFormat(property.created_at)}
                        </p>
                        <div className="d-sm-flex">
                          <a href="#" className="btn btn-sm btn-success me-2">
                            View Enquiry
                          </a>
                          <button
                            onClick={() => setIsModalOpen(true)}
                            className="btn btn-sm btn-warning me-2"
                          >
                            Add Amenity
                          </button>
                          <Link
                            href={`/property-edit/${property.property_id}`}
                            className="btn btn-sm btn-outline-primary me-2 ms-auto"
                          >
                            <i className="bi bi-pencil-square"></i>
                          </Link>
                          <button
                            onClick={() => handleDeleteClick(property.property_id)}
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
          </div>
          <div className="text-center">
            {currentPage < totalPages && properties.length > 9 && (
              <button className="btn btn-primary" onClick={loadMoreProperties}>
                Load More
              </button>
            )}
          </div>
          {isModalOpen && (
            <AddAmenity show={isModalOpen} onClose={() => setIsModalOpen(false)} />
          )}
        </div>
      </aside>
      <aside class="col-xl-auto col-12">
          <div class="text-center mt-4">
            <img src="assets/images/ads/8c178a3ead69fc4c042ecb0e550c2579.png" alt="ads" class="img-fluid" height={''} width={''}/>
          </div>
        </aside>
    </DashboardLayout>
  );
};

export default Index;
