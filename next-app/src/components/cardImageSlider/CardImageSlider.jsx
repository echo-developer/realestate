import React, { useEffect, useState } from "react";
import useTranslation from "@/hooks/useTranslation";
import './favourite.css';

const CardImageSlider = ({ data, keyword, id, addRemoveFav, mainType, showSq=true, icons = true, listKey }) => {
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
                className={`carousel-item ${i === currentIndex ? "active" : ""
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
        {
          allImages?.length > 1 && (
            <>
              <button
                className="carousel-control-prev"
                type="button"
                onClick={handlePrev}
              >
                <span
                  className="carousel-control-prev-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">{translation?.previous || "Previous"}</span>
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
                <span className="visually-hidden">{translation?.next || "Next"}</span>
              </button>
            </>
          )
        }
      </div>
      {data?.post_for && (
        <span className={`ads-type ${data?.post_for}`}>
          for {data?.post_for || `${translation?.not_available ||"Not available"}`}
        </span>
      )}
      {/* {showSq  && data?.area_in_sqft && (
        <div className="ads-price"><h4>{data?.price_currency || data?.currency || ""}{" "} {data?.area_in_sqft || ""}{" sq/ft"}</h4></div>
      )} */}
      {icons && (
        <>
          {/* <span className={`ads-fav ${data?.is_favorite ? "active" : ""}`} onClick={() => addRemoveFav(data?.[id], mainType, listKey)}>
            <i className="icon-line-awesome-heart-o"></i>
          </span> */}
          <input type="checkbox" id="checkbox" />
          <label for="checkbox" className="ads-fav">
            <svg id="heart-svg" viewBox="467 392 58 57" xmlns="http://www.w3.org/2000/svg">
              <g id="Group" fill="none" fill-rule="evenodd" transform="translate(467 392)">
                <path d="M29.144 20.773c-.063-.13-4.227-8.67-11.44-2.59C7.63 28.795 28.94 43.256 29.143 43.394c.204-.138 21.513-14.6 11.44-25.213-7.214-6.08-11.377 2.46-11.44 2.59z" id="heart" fill="#AAB8C2"/>
                <circle id="main-circ" fill="#E2264D" opacity="0" cx="29.5" cy="29.5" r="1.5"/>

                <g id="grp7" opacity="0" transform="translate(7 6)">
                  <circle id="oval1" fill="#9CD8C3" cx="2" cy="6" r="2"/>
                  <circle id="oval2" fill="#8CE8C3" cx="5" cy="2" r="2"/>
                </g>

                <g id="grp6" opacity="0" transform="translate(0 28)">
                  <circle id="oval1" fill="#CC8EF5" cx="2" cy="7" r="2"/>
                  <circle id="oval2" fill="#91D2FA" cx="3" cy="2" r="2"/>
                </g>

                <g id="grp3" opacity="0" transform="translate(52 28)">
                  <circle id="oval2" fill="#9CD8C3" cx="2" cy="7" r="2"/>
                  <circle id="oval1" fill="#8CE8C3" cx="4" cy="2" r="2"/>
                </g>

                <g id="grp2" opacity="0" transform="translate(44 6)">
                  <circle id="oval2" fill="#CC8EF5" cx="5" cy="6" r="2"/>
                  <circle id="oval1" fill="#CC8EF5" cx="2" cy="2" r="2"/>
                </g>

                <g id="grp5" opacity="0" transform="translate(14 50)">
                  <circle id="oval1" fill="#91D2FA" cx="6" cy="5" r="2"/>
                  <circle id="oval2" fill="#91D2FA" cx="2" cy="2" r="2"/>
                </g>

                <g id="grp4" opacity="0" transform="translate(35 50)">
                  <circle id="oval1" fill="#F48EA7" cx="6" cy="5" r="2"/>
                  <circle id="oval2" fill="#F48EA7" cx="2" cy="2" r="2"/>
                </g>

                <g id="grp1" opacity="0" transform="translate(24)">
                  <circle id="oval1" fill="#9FC7FA" cx="2.5" cy="3" r="2"/>
                  <circle id="oval2" fill="#9FC7FA" cx="7.5" cy="2" r="2"/>
                </g>
              </g>
            </svg>
          </label>

          <span className="total-ad-pic">
            <i className="bi bi-camera"></i> {allImages?.length}
          </span>
        </>
      )}
    </div>
  );
};

export default CardImageSlider;
