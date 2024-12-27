import React from 'react';

const GalleryComponent = ({ propertyDetails, setVisible }) => {
  const openImageViewer = (imageIndex, images) => {
    console.log(`Open image viewer for image ${imageIndex} in gallery`, images);
  };

  const defaultImage = `/assets/images/property/default_property.jpg`;

  return (
    <div className="row gx-3 mb-4">
      {propertyDetails?.galleries?.length > 0 ? (
        propertyDetails.galleries.map((gallery, galleryIndex) => (
          <article key={galleryIndex} className="col-md-4 col-6">
            <div className="row gx-3">
              {gallery.images && gallery.images.length > 0 ? (
                gallery.images.slice(0, 4).map((image, imageIndex) => (
                  <article
                    key={imageIndex}
                    className={`col-md-12 ${
                      imageIndex === 1 ? 'col-6' : 'col-12'
                    }`}
                  >
                    <a
                      className={`d-block ${
                        imageIndex === 3 && gallery.images.length > 4
                          ? 'more-photos'
                          : ''
                      }`}
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setVisible(true);
                        openImageViewer(imageIndex, gallery.images);
                      }}
                    >
                      <img
                        src={image || defaultImage}
                        alt={gallery.gallery_caption || 'Gallery Image'}
                        className="rounded-2 w-100"
                      />
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
