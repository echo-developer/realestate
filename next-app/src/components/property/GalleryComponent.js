import React, { useState, useEffect } from 'react';
import { ShimmerFeaturedGallery } from "react-shimmer-effects";

const GalleryComponent = ({ propertyDetails, setVisible }) => {
  const [loading, setLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState(false); // Track if images are loaded
  const [displayImages, setDisplayImages] = useState([]);
  const [totalImage, setTotalImage] = useState(0);

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


  useEffect(() => {
    if(propertyDetails?.galleries?.length > 0) {
      let imgArr;
      if(propertyDetails?.galleries?.length < 3) {
        imgArr = propertyDetails?.galleries.flatMap((item) => item?.images);
      } else {
        imgArr = propertyDetails?.galleries?.slice(0, 3).map((item) => item?.images[0]);
      }
      
      setDisplayImages(imgArr);
      const noOfImages = propertyDetails?.galleries.reduce((total, item) => total + item.images.length, 0);
      setTotalImage(noOfImages);

    }
  }, [propertyDetails?.galleries])


  return (
    <div className="row gx-3 mb-4" onClick={(e) => {
      e.preventDefault();
      setVisible(true);
    }}>
      {loading ? (
        <ShimmerFeaturedGallery row={2} col={2} card frameHeight={600} />
      ) : propertyDetails?.galleries?.length > 0 ? (
        <>
        <article className="col-md-8" >
            <a className="d-block mb-3" href="#" data-bs-toggle="modal" data-bs-target="#galleryModal">
              <img src={displayImages[0].image_url} alt="Property Image" className="rounded-2 w-100" /></a>
          </article>
          {displayImages?.length > 1 && (
            <article className="col-md-4">
            <div className="row gx-3">
              <article className="col-md-12 col-6">
                <a className="d-block mb-3" href="#" data-bs-toggle="modal" data-bs-target="#galleryModal">
                  <img src={displayImages[1].image_url} alt="Property Image" className="rounded-2 w-100" /></a>            
              </article>
              {displayImages?.length > 2 && (
                <article className="col-md-12 col-6">
                <a className="d-block more-photos" href="#" data-bs-toggle="modal" data-bs-target="#galleryModal">
                  <img src={displayImages[1].image_url} alt="Property Image" className="rounded-2 w-100" />
                  {totalImage > 3 && (
                    <span className="photo-overlay">
                    <h4><i className="bi bi-plus-lg"></i> {totalImage - 3} Photos</h4>
                  </span>
                  )}
                </a>
              </article>
              )}
            </div>
          </article>
          )}
          
        </>
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
