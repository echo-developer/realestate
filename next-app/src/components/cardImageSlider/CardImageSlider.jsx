import React, { useEffect, useState } from "react";

const CardImageSlider = ({ data, keyword, id, addRemoveFav, mainType, showSq, icons=true, listKey }) => {
  const [allImages, setAllImages] = useState([]);

  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? allImages.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === allImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  useEffect(() => {
    if (data) {
      if (keyword) {
        const allImages = data[keyword]?.flatMap((category) =>
          category.images.map((img) => img.file)
        );
        setAllImages(allImages);
      } else {
        const allImages = data?.galleries?.flatMap((category) =>
          category.images.map((img) => img.image_url)
        );
        setAllImages(allImages);
      }
    }
  }, [data]);

  return (
    <div className="card-image">
      <div className="carousel slide ads-carousel">
        <div className="carousel-inner">
          {allImages && allImages.length > 0 ? (
            allImages.map((img, i) => (
              <div
                key={i}
                className={`carousel-item ${
                  i === currentIndex ? "active" : ""
                }`}
              >
                <img
                  alt=""
                  className="card-img-top"
                  src={img || "/assets/images/property/default-property-1.jpg"}
                />
              </div>
            ))
          ) : (
            <div className="carousel-item active">
              <img
                alt=""
                className="card-img-top"
                src="/assets/images/property/default-property-1.jpg"
              />
            </div>
          )}
        </div>

        <button
          className="carousel-control-prev"
          type="button"
          onClick={handlePrev}
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
          onClick={handleNext}
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
      {data?.post_for && (
        <span className={`ads-type ${data?.post_for}`}>
          for {data?.post_for ||"Not Available"}
        </span>
      )}
      {showSq && (
        <div className="ads-price"><h4>66868 sq/ft</h4>rent</div>
      )}
      {icons && (
        <>
        <span className={`ads-fav ${data?.is_favrourite ? "active" : ""}`} onClick={() => addRemoveFav(data?.[id], mainType, listKey)}>
          <i className="icon-line-awesome-heart-o"></i>
        </span>
        <span className="total-ad-pic">
          <i className="bi bi-camera"></i> {allImages?.length}
        </span>
        </>
      )}
      <h4 className="ads-price">{data?.price}</h4>
    </div>
  );
};

export default CardImageSlider;
