import React, { useState } from "react";
import useMetersToKilometers from "@/hooks/useMetersToKilometers";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const LandMarkDetails = ({ propertyDetails, translation }) => {
  const landmarks = propertyDetails?.landmarks || {};
  const [expanded, setExpanded] = useState({});
  const { convert } = useMetersToKilometers();

  const toggleExpand = (key, e) => {
    e.preventDefault();
    setExpanded((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Carousel responsive breakpoints
  const responsive = {
    superLargeDesktop: {
      // 4k
      breakpoint: { max: 4000, min: 1024 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 1024, min: 768 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 768, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  return (
    <section id="locality">
      <div className="card border-0 shadow-1 mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between">
            <h4 className="mb-3 text-primary">
              {translation?.landmarks_near || "Landmarks near"}{" "}
              {propertyDetails?.locality || `${translation?.not_available || "Not available"}`}
            </h4>
          </div>

          <div className="facilities alfjld">
            <Carousel
              responsive={responsive}
              infinite={true}
              autoPlay={true}
              autoPlaySpeed={3000}
              arrows={true} // You can enable arrows if needed
            >
              {Object.entries(landmarks).map(([key, items]) => {
                const isExpanded = expanded[key];
                const itemsToShow = isExpanded ? items : items.slice(0, 3);

                return (
                  <article key={key} className="carousel-item">
                    <div className="cardbox bg-primary-subtle">
                      <div className="d-flex align-items-center mb-2">
                        <img
                          src={`/assets/images/icons/${key}.png`}
                          alt={key}
                          height="32"
                          width="32"
                        />
                        <div className="flex-grow-1 ps-3">
                          <h5 className="text-primary mb-0">
                            {key
                              .replace(/_/g, " ")
                              .replace(/\b\w/g, (l) => l.toUpperCase())}
                          </h5>
                        </div>
                      </div>
                      <ul className="mb-0">
                        {itemsToShow.map((item, i) => (
                          <li key={i}>
                            {item.name} - {item?.distance ? `${convert(Number(item?.distance))}` : ""}
                          </li>
                        ))}
                      </ul>
                      {items.length > 3 && !isExpanded && (
                        <div className="d-flex justify-content-center">
                          <a
                            role="button"
                            className="show-more"
                            onClick={(e) => toggleExpand(key, e)}
                          >
                            +{items.length - 3} {translation?.more || "more"}
                          </a>
                        </div>
                      )}

                      {isExpanded && (
                        <div className="d-flex justify-content-center">
                          <a
                            role="button"
                            className="show-more"
                            onClick={(e) => toggleExpand(key, e)}
                          >
                            {translation?.show_less || "Show less"}
                          </a>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandMarkDetails;
