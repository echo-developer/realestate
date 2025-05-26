import React, { useState } from "react";
import useMetersToKilometers from "@/hooks/useMetersToKilometers";
import useTranslation from "@/hooks/useTranslation";

const PropertyLandmarkData = ({ detailsData }) => {
  const landmarks = detailsData?.landmarks || {};
  const [expanded, setExpanded] = useState({});
  const { convert } = useMetersToKilometers();

  const toggleExpand = (key, e) => {
    e.preventDefault();
    setExpanded((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }; 
  const translation = useTranslation();
  if(!detailsData?.landmarks) {
    return null;
  } else {
    return (
      <section id="landmark">
        <div className="card border-0 shadow-1 mb-4">
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <h4 className="mb-3 text-primary">
                {translation?.landmarks_near || "Landmarks near"} {detailsData.locality}
              </h4>
            </div>
  
            <div className="row -mb-3 facilities">
              {Object.entries(landmarks).map(([key, items]) => {
                const isExpanded = expanded[key];
                const itemsToShow = isExpanded ? items : items.slice(0, 3);
                return (
                  <article key={key} className="col-lg-4 col-sm-6">
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
                      <ul className="list-none mb-0">
                        {itemsToShow.map((item, i) => (
                          <li key={i}>
                           {item.name} - {item?.distance ? `${convert(Number(item?.distance))}` : ""}
                          </li>
                        ))}
                        {items.length > 3 && !isExpanded && (
                          <li>
                            <a
                              role="button"
                              className="show-more"
                              onClick={(e) => toggleExpand(key, e)}
                            >
                              +{items.length - 3} {translation?.more || "more"}
                            </a>
                          </li>
                        )}
                        {isExpanded && (
                          <li>
                            <a
                              role="button"
                              className="show-more"
                              onClick={(e) => toggleExpand(key, e)}
                            >
                              {translation?.show_less || "Show less"}
                            </a>
                          </li>
                        )}
                      </ul>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    );
  }
};

export default PropertyLandmarkData;
