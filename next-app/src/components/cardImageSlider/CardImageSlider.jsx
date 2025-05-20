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
  showFavIcon=true,
  showImgCount=true
}) => {
  const translation = useTranslation();
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
                className={`carousel-item ${i === currentIndex ? "active" : ""}`}
              >
                <img
                  alt=""
                  className="card-img-top"
                  src={img || "/assets/images/property/default-property-1.jpg"}
                  loading="lazy"
                />
                
              </div>
            ))
          ) : (
            <div className="carousel-item active">
              <img
                alt=""
                className="card-img-top"
                src="/assets/images/property/default-property-1.jpg"
                loading="lazy"
              />
            </div>
          )}
        </div>

        {allImages?.length > 1 ? (
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
        ) : (<></>)}
      </div>

      {data?.post_for ? (
        <span className={`ads-type ${data?.post_for}`}>
          for {data?.post_for || `${translation?.not_available || "Not available"}`}
        </span>
      ) : (<></>)}

      {
        showFavIcon ? (
          <span
        className={`ads-fav ${
          data?.is_favorite || data?.is_fav || data?.is_favourite ? "active" : ""
        }`}
        onClick={() => addRemoveFav(data?.[id], mainType, listKey)}
      >
        <i className="icon-line-awesome-heart-o"></i>
      </span>
        ) : (<></>)
      }
      {showImgCount && data.image_count && (
        <span className="total-ad-pic">
        <i className="bi bi-camera"></i>{data.image_count}
      </span>
      ) || (<></>)}
    </div>
  );
};

export default CardImageSlider;
