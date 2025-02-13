import React from "react";

const ProjectLandmarkData = ({ detailsData }) => {
  const landmarks = detailsData?.landmarks || {};

  return (
    <section id="landmark-near">
      <div className="card border-0 shadow-1 mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between">
            <h4 className="mb-3 text-primary">
             {detailsData.project_name}
            </h4>
            <h5>
              <a href="">
                Explore <i className="bi bi-arrow-right"></i>
              </a>
            </h5>
          </div>

          <div className="row -mb-3 facilities">
            {/* Dynamically Render Landmark Cards */}
            {Object.entries(landmarks).map(([key, items], index) => (
              <article key={index} className="col-lg-4 col-sm-6">
                <div className="cardbox bg-primary-subtle">
                  <div className="d-flex align-items-center mb-2">
                    {/* Map category-specific images */}
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
                    {items.slice(0, 2).map((item, i) => (
                      <li key={i}>
                        {item.name} - {item.distance} km
                      </li>
                    ))}

                    {/* Show hidden items */}
                    {items.length > 2 && (
                      <li>
                        <a href="#" className="show-more">
                          +{items.length - 2} more
                        </a>
                      </li>
                    )}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectLandmarkData;
