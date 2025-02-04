import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";

const projects = [
  {
    title: "Executive Suite with Premium Finishes | Vacant Now",
    location: "Mohamed Bin Zayed City, Abu Dhabi, UAE",
    status: "Under Construction",
    price: "36,500",
    isFavorite: true,
    images: [
      "/assets/images/uploads/property-2.jpg",
      "/assets/images/uploads/property-3.jpg",
      "/assets/images/uploads/property-4.jpg",
    ],
  },
  {
    title: "Limited Offer | Luxurious Villa | Hot Deal",
    location: "Salam Street, Abu Dhabi, UAE",
    status: "Ready To move",
    price: "24,999",
    isFavorite: false,
    images: [
      "/assets/images/uploads/property-4.jpg",
      "/assets/images/uploads/property-5.jpg",
      "/assets/images/uploads/property-6.jpg",
    ],
  },
  {
    title: "Building for Sale with Good ROI",
    location: "Al Nuaimia 1, Ajman, UAE",
    status: "Under Construction",
    price: "10,000",
    isFavorite: false,
    images: [
      "/assets/images/uploads/property-6.jpg",
      "/assets/images/uploads/property-7.jpg",
      "/assets/images/uploads/property-8.jpg",
    ],
  },
  // Other projects can be added here
];

// Custom Arrow components
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

const SimilarProjects = () => {
  const settings = {
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    dots: false,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
  };

  // Display only the first 3 projects
  const displayedProjects = projects.slice(0, 3);

  return (
    <div className="card border-0 shadow-1 mb-4">
      <div className="card-body">
        <div className="d-flex justify-content-between">
          <h4 className="mb-3 text-primary">Nearby Projects</h4>
          <h5>
            <Link href="/project-listing">
              Explore All Projects <i className="bi bi-arrow-right"></i>
            </Link>
          </h5>
        </div>
        <div className="row gx-3 -mb-3">
          {displayedProjects.map((project, index) => (
            <article key={index} className="col-lg-4 col-sm-6 mb-3">
              <div className="card card-ads">
                <div className="card-image">
                  <Slider {...settings}>
                    {project.images.map((image, imgIndex) => (
                      <div key={imgIndex}>
                        <img
                          src={image}
                          alt={`Property ${imgIndex}`}
                          className="card-img-top"
                        />
                      </div>
                    ))}
                  </Slider>
                  <span
                    className={`ads-fav ${project.isFavorite ? "active" : ""}`}
                  >
                    <i className="icon-line-awesome-heart-o"></i>
                  </span>
                  <span className="total-ad-pic">
                    <i className="bi bi-camera"></i> {project.images.length}
                  </span>
                  <h4 className="ads-price">${project.price}</h4>
                </div>
                <div className="card-body">
                  <h4>
                    <a href="#">{project.title}</a>
                  </h4>
                  <p className="mb-1">
                    <i className="icon-feather-map-pin"></i> {project.location}
                  </p>
                  <p className="text-muted mb-2">{project.status}</p>
                  <a href="#">
                    Contact Agent <i className="bi bi-arrow-right"></i>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SimilarProjects;
