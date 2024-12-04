import React from 'react';

const ProjectSection = () => {
  const projects = [
    {
      id: 1,
      images: [
        "assets/images/uploads/14e7cdc596fb3c310f841e8a54c03017.jpg",
        "assets/images/uploads/property-6.jpg",
        "assets/images/uploads/property-7.jpg",
      ],
      title: "Skyline Imperia",
      location: "Al Muwaiji, Al Ain, UAE",
      details: {
        type: "House/Villa",
        rooms: 6,
        bedrooms: 4,
        size: 550,
        bathrooms: 8,
      },
      price: "AED320",
    },
    {
      id: 2,
      images: [
        "assets/images/uploads/449e0da0b8113ed16377662c255fe855.jpg",
        "assets/images/uploads/property-6.jpg",
        "assets/images/uploads/property-7.jpg",
      ],
      title: "Skyline Imperia",
      location: "Al Muwaiji, Al Ain, UAE",
      details: {
        type: "House/Villa",
        rooms: 6,
        bedrooms: 4,
        size: 550,
        bathrooms: 8,
      },
      price: "AED840",
    },
    {
      id: 3,
      images: [
        "assets/images/uploads/complex-1.jpg",
        "assets/images/uploads/property-6.jpg",
        "assets/images/uploads/property-7.jpg",
      ],
      title: "Skyline Imperia",
      location: "Al Muwaiji, Al Ain, UAE",
      details: {
        type: "House/Villa",
        rooms: 6,
        bedrooms: 4,
        size: 550,
        bathrooms: 8,
      },
      price: "$17,499",
    },
    {
      id: 4,
      images: [
        "assets/images/uploads/09892b687f6d52b945c14a0f02b7acd7.jpg",
        "assets/images/uploads/property-6.jpg",
        "assets/images/uploads/property-7.jpg",
      ],
      title: "Commercial Rent",
      location: "Al Muwaiji, Al Ain, UAE",
      details: {
        type: "House/Villa",
        rooms: 6,
        bedrooms: 4,
        size: 550,
        bathrooms: 8,
      },
      price: "$17,499",
    },
  ];

  return (
    <section className="section">
      <div className="container-fluid">
        <div className="section-headline text-center">
          <h5>
            <img
              src="assets/images/icons/house-sm-1.png"
              alt="Icon"
              height="20"
              width="20"
            />{" "}
            Featured Projects
          </h5>
          <h3>Featured Projects</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua
          </p>
        </div>
        <div className="row gx-3">
          {projects.map((project) => (
            <article key={project.id} className="col-xl-3 col-lg-4 col-sm-6 col-12">
              <div className="card card-ads">
                <div className="card-image">
                  <div
                    id={`featuredProject-${project.id}`}
                    className="carousel slide ads-carousel"
                  >
                    <div className="carousel-inner">
                      {project.images.map((image, index) => (
                        <div
                          key={index}
                          className={`carousel-item ${index === 0 ? "active" : ""}`}
                        >
                          <img src={image} alt="" className="card-img-top" />
                        </div>
                      ))}
                    </div>
                    <button
                      className="carousel-control-prev"
                      type="button"
                      data-bs-target={`#featuredProject-${project.id}`}
                      data-bs-slide="prev"
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
                      data-bs-target={`#featuredProject-${project.id}`}
                      data-bs-slide="next"
                    >
                      <span
                        className="carousel-control-next-icon"
                        aria-hidden="true"
                      ></span>
                      <span className="visually-hidden">Next</span>
                    </button>
                  </div>
                  <span className="ads-fav">
                    <i className="icon-line-awesome-heart-o"></i>
                  </span>
                  <span className="total-ad-pic">
                    <i className="bi bi-camera"></i> {project.images.length}
                  </span>
                </div>
                <div className="card-body">
                  <h4>
                    <a href="">{project.title}</a>
                  </h4>
                  <p className="mb-1">
                    <i className="icon-feather-map-pin"></i> {project.location}
                  </p>
                  <ul className="list-info mb-3">
                    <li>
                      <i className="icon-img-flat"></i> {project.details.type}
                    </li>
                    <li>
                      <i className="icon-img-room"></i> Rooms:{" "}
                      <span>{project.details.rooms}</span>
                    </li>
                    <li>
                      <i className="icon-img-bed"></i> Bedrooms:{" "}
                      <span>{project.details.bedrooms}</span>
                    </li>
                    <li>
                      <i className="icon-img-ratio"></i>{" "}
                      <span>{project.details.size}</span> sq m
                    </li>
                    <li>
                      <i className="icon-img-tub"></i> Bathrooms:{" "}
                      <span>{project.details.bathrooms}</span>
                    </li>
                  </ul>

                  <div className="d-flex align-items-center">
                    <h4 className="mb-0 flex-grow-1">{project.price}</h4>
                    <a href="" className="btn btn-primary">
                      View Details
                    </a>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="text-center">
          <a href="#" className="btn btn-outline-primary">
            View More
          </a>
        </div>
      </div>
    </section>
  );
};

export default ProjectSection;
