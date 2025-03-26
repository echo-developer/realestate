import React, { useEffect, useState } from "react";
import useTranslation from "@/hooks/useTranslation";
import "./favourite.css";

const CardImageSlider = ({
  data,
  keyword,
  id,
  addRemoveFav,
  mainType,
  listKey,
}) => {
  const translation = useTranslation();
  const [allImages, setAllImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState([]);

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

  const handleImageLoad = (index) => {
    setImageLoading((prev) => {
      const updatedLoading = [...prev];
      updatedLoading[index] = false;
      return updatedLoading;
    });
  };

  useEffect(() => {
    setLoading(true);
    if (data) {
      let images = [];
      if (keyword) {
        images = data[keyword]?.flatMap((category) =>
          category?.images?.map((img) => img.file)
        );
      } else {
        images = data?.galleries?.flatMap((category) =>
          category?.images?.map((img) => img.image_url)
        );
      }
      setAllImages(images);
      setImageLoading(new Array(images.length).fill(true)); // Initialize loaders for all images
      setLoading(false);
    }
  }, [data]);

  return (
    <div className="card-image">
      {loading ? (
        <div className="image-loader">
          <svg
            width="48"
            height="48"
            viewBox="0 0 50 50"
            className="spinner"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              className="path"
              cx="25"
              cy="25"
              r="20"
              fill="none"
              strokeWidth="5"
            />
          </svg>
        </div>
      ) : (
        <div className="carousel slide ads-carousel">
          <div className="carousel-inner">
            {allImages && allImages.length > 0 ? (
              allImages.map((img, i) => (
                <div
                  key={i}
                  className={`carousel-item ${i === currentIndex ? "active" : ""}`}
                >
                  {imageLoading[i] && (
                    <div className="image-loader">
                      <svg
                        width="48"
                        height="48"
                        viewBox="0 0 50 50"
                        className="spinner"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          className="path"
                          cx="25"
                          cy="25"
                          r="20"
                          fill="none"
                          strokeWidth="5"
                        />
                      </svg>
                    </div>
                  )}
                  <img
                    alt=""
                    className="card-img-top"
                    src={img || "/assets/images/property/default-property-1.jpg"}
                    onLoad={() => handleImageLoad(i)}
                    style={{
                      display: imageLoading[i] ? "none" : "block",
                    }}
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

          {allImages?.length > 1 && (
            <>
              <button className="carousel-control-prev" type="button" onClick={handlePrev}>
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">
                  {translation?.previous || "Previous"}
                </span>
              </button>
              <button className="carousel-control-next" type="button" onClick={handleNext}>
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">
                  {translation?.next || "Next"}
                </span>
              </button>
            </>
          )}
        </div>
      )}

      {data?.post_for && (
        <span className={`ads-type ${data?.post_for}`}>
          for {data?.post_for || `${translation?.not_available || "Not available"}`}
        </span>
      )}

      <span
        className={`ads-fav ${
          data?.is_favorite || data?.is_fav || data?.is_favourite ? "active" : ""
        }`}
        onClick={() => addRemoveFav(data?.[id], mainType, listKey)}
      >
        <i className="icon-line-awesome-heart-o"></i>
      </span>
      <span className="total-ad-pic">
        <i className="bi bi-camera"></i> {allImages?.length}
      </span>
    </div>
  );
};

export default CardImageSlider;
