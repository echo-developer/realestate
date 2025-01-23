import React, { useState, useEffect } from 'react';
import { ShimmerFeaturedGallery } from "react-shimmer-effects";

const GalleryComponent = ({ propertyDetails, setVisible }) => {
  const [loading, setLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState(false); // Track if images are loaded

  const defaultImage = `/assets/images/property/default_property.jpg`;

  useEffect(() => {
    if (propertyDetails) {
      setLoading(true); // Start loading on new data
      setImagesLoaded(false); // Reset imagesLoaded to false before loading new images

      // Simulate a delay to see the loader
      setTimeout(() => {
        setLoading(false); // Stop loading after data is available
      }, 2000);
    }
  }, [propertyDetails]);

  // Function to handle when all images have loaded
  const handleImageLoad = () => {
    setImagesLoaded(true);
  };

  return (
    <div className="row gx-3 mb-4">
      {loading ? (
        <ShimmerFeaturedGallery row={2} col={2} card frameHeight={600} />
      ) : propertyDetails?.galleries?.length > 0 ? (
        propertyDetails.galleries.map((gallery, galleryIndex) => (
          <article key={galleryIndex} className="col-md-4 col-6">
            <div className="row gx-3">
              {gallery.images && gallery.images.length > 0 ? (
                gallery.images.slice(0, 4).map((image, imageIndex) => (
                  <article
                    key={imageIndex}
                    className={`col-md-12 ${imageIndex === 1 ? 'col-6' : 'col-12'}`}
                  >
                    <a
                      className={`d-block ${
                        imageIndex === 3 && gallery.images.length > 4
                          ? 'more-photos'
                          : ''
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        setVisible(true);
                      }}
                    >
                      <div className="image-container">
                        {/* Show loader or placeholder if image is not loaded */}
                        {!imagesLoaded && (
                          <div className="image-loader">Loading...</div>
                        )}
                        <img
                          src={image?.image_url || defaultImage}
                          alt={gallery.gallery_caption || 'Gallery Image'}
                          className="rounded-2 w-100"
                          onLoad={handleImageLoad} // Trigger image load handler
                        />
                      </div>
                      {imageIndex === 3 && gallery.images.length > 4 && (
                        <span className="photo-overlay">
                          <h4>
                            <i className="bi bi-plus-lg"></i> {gallery.images.length - 4} More
                          </h4>
                        </span>
                      )}
                    </a>
                  </article>
                ))
              ) : (
                <article className="col-md-12 col-12">
                  <a
                    className="d-block"
                    href="#"
                    onClick={(e) => e.preventDefault()}
                  >
                    <img
                      src={defaultImage}
                      alt="Default Gallery"
                      className="rounded-2 w-100"
                    />
                  </a>
                </article>
              )}
            </div>
          </article>
        ))
      ) : (
        <div className="col-md-6 text-center">
          <img
            src={defaultImage}
            alt="No data available"
            className="rounded-2 w-100 mb-3"
          />
          <p className="text-muted">No data available</p>
        </div>
      )}
    </div>
  );
};

export default GalleryComponent;
