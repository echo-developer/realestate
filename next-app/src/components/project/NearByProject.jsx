import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";

const PrevArrow = (props) => {
  const { className, onClick } = props;
  return (
    <button
      className={`slick-prev ${className}`}
      onClick={onClick}
      style={{ position: "absolute", top: "50%", left: "10px", zIndex: 1 }}
    >
      <i className="bi bi-chevron-left" style={{ fontSize: "24px" }}></i>
    </button>
  );
};

const NextArrow = (props) => {
  const { className, onClick } = props;
  return (
    <button
      className={`slick-next ${className}`}
      onClick={onClick}
      style={{ position: "absolute", top: "50%", right: "10px", zIndex: 1 }}
    >
      <i className="bi bi-chevron-right" style={{ fontSize: "24px" }}></i>
    </button>
  );
};

const NearbyProjects = ({ nearbyProjects }) => {
  const settings = {
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    dots: false,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
  };

  const displayedProjects = nearbyProjects?.slice(0, 3) || [];

  return (
    <>
      {nearbyProjects?.length > 0 && (
        <div className="card border-0 shadow-1 mb-4">
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <h4 className="mb-3 text-primary">Nearby Projects</h4>
              <h5>
                <Link href="/nearby-project-listing">
                    Explore Nearby Projects <i className="bi bi-arrow-right"></i>
                </Link>
              </h5>
            </div>
            <div className="row gx-3 -mb-3">
              {displayedProjects.map((project, index) => (
                <article key={index} className="col-lg-4 col-sm-6 mb-3">
                  <div className="card card-ads">
                    <div className="card-image">
                      {project.gallery &&
                      project.gallery.length > 0 &&
                      project.gallery[0].images &&
                      project.gallery[0].images.length > 0 ? (
                        <Slider {...settings}>
                          {project.gallery[0].images.map((image, imgIndex) => (
                            <div key={imgIndex}>
                              <img
                                src={image}
                                alt={`Property ${imgIndex}`}
                                className="card-img-top"
                              />
                            </div>
                          ))}
                        </Slider>
                      ) : (
                        <div className="fallback-image">No images available</div>
                      )}
                      <span
                        className={`ads-fav ${project.is_fav ? "active" : ""}`}
                      >
                        <i className="icon-line-awesome-heart-o"></i>
                      </span>
                      <h4 className="ads-price">
                        {project.project_is_featured
                          ? "Featured"
                          : "Not Featured"}
                      </h4>
                    </div>
                    <div className="card-body">
                      <h4>
                          <Link href="#">{project.project_name}</Link>
                      </h4>
                      <p className="mb-1">
                        <i className="icon-feather-map-pin"></i>{" "}
                        {project.address}
                      </p>
                      <p className="text-muted mb-2">
                        {project.possession_status}
                      </p>
                      <Link href="#">
                          Contact Agent <i className="bi bi-arrow-right"></i>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NearbyProjects;
