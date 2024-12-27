import React from 'react';

const GalleryComponent = ({ propertyDetails, setVisible }) => {
  const openImageViewer = (imageIndex, images) => {
    console.log(`Open image viewer for image ${imageIndex} in gallery`, images);
  };

  return (
    <div className="row gx-3 mb-4">
      {propertyDetails?.galleries?.map((gallery, galleryIndex) => (
        <article key={galleryIndex} className="col-md-4 col-6">
          <div className="row gx-3">
            {gallery.images.slice(0, 4).map((image, imageIndex) => (
              <article
                key={imageIndex}
                className={`col-md-12 ${
                  imageIndex === 1 ? 'col-6' : 'col-12'
                }`}
              >
                <a
                  className={`d-block ${
                    imageIndex === 3 && gallery.images.length > 4 ? 'more-photos' : ''
                  }`}
                  href="#"
                  onClick={(e) => {
                    setVisible(true);
                    e.preventDefault();
                    openImageViewer(imageIndex, gallery.images);
                  }}
                >
                  <img
                    src={image}
                    alt={gallery.gallery_caption}
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
            ))}
          </div>
        </article>
      ))}
    </div>
  );
};

export default GalleryComponent;
