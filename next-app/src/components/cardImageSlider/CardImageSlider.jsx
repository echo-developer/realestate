import React, { useEffect, useState } from "react";

const CardImageSlider = ({ data }) => {
const [allImages, setAllImages] = useState([])


  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? allImages.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === allImages.length - 1 ? 0 : prevIndex + 1));
  };

  useEffect(() => {
    if(data) {
        const allImages = data.gallery.flatMap((category) =>
            category.images.map((img) => img.file)
          );

          setAllImages(allImages);
    }
  }, [data])


  return (
    <div className="card-image">
      <div className="carousel slide ads-carousel">
        <div className="carousel-inner">
          {allImages?.map((img, i) => (
            <div key={i} className={`carousel-item ${i === currentIndex ? "active" : ""}`}>
              <img alt="" className="card-img-top" src={img} />
            </div>
          ))}
        </div>
        <button className="carousel-control-prev" type="button" onClick={handlePrev}>
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" onClick={handleNext}>
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
      <span className={`ads-type ${data.type}`}>for {data?.type}</span>
      <span className="ads-fav">
        <i className="icon-line-awesome-heart-o"></i>
      </span>
      <span className="total-ad-pic">
        <i className="bi bi-camera"></i> {data?.images?.length}
      </span>
      <h4 className="ads-price">{data?.price}</h4>
    </div>
  );
};

export default CardImageSlider;
