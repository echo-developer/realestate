import React from "react";
import CardImageSlider from "../cardImageSlider/CardImageSlider";

const properties = [
  {
    id: 1,
    "gallery": [
      {
        "id": 1,
        "image_type": "interior",
        "images": [
            {
                "caption": "",
                "file": "assets/images/uploads/dcca5e27a298d97263e9a05da3b9f5cf.jpg"
            },
            {
                "caption": "",
                "file": "assets/images/uploads/property-2.jpg"
            },
            {
                "caption": "",
                "file": "assets/images/uploads/property-3.jpg"
            },
        ]
    },
    {
      "id": 1,
      "image_type": "interior",
      "images": [
          {
              "caption": "",
              "file": "assets/images/uploads/dcca5e27a298d97263e9a05da3b9f5cf.jpg"
          },
          {
              "caption": "",
              "file": "assets/images/uploads/property-2.jpg"
          },
          {
              "caption": "",
              "file": "assets/images/uploads/property-3.jpg"
          },
      ]
  },
  {
    "id": 1,
    "image_type": "interior",
    "images": [
        {
            "caption": "",
            "file": "assets/images/uploads/dcca5e27a298d97263e9a05da3b9f5cf.jpg"
        },
        {
            "caption": "",
            "file": "assets/images/uploads/property-2.jpg"
        },
        {
            "caption": "",
            "file": "assets/images/uploads/property-3.jpg"
        },
    ]
},
    ],
    type: "rent",
    price: "$649",
    title: "Desirable Family Home- Near School",
    location: "Al Hamra Village, Ras Al Khaimah, UAE",
    details: {
      propertyType: "House/Villa",
      rooms: 6,
      bedrooms: 4,
      area: 550,
      bathrooms: 8,
    },
    agent: {
      name: "Hayat Hamza",
      avatar: "assets/images/agents/agent-7.jpg",
    },
    date: "10 Jan, 2022",
  },
];

const RecentPropertySection = () => {
  return (
    <section className="section">
      <div className="container-fluid">
        <div className="section-headline text-center">
          <h5>
            <img src="assets/images/icons/house-sm-1.png" alt="Icon" height="20" width="20" /> Most Recent
          </h5>
          <h3>Recent Property</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
            magna aliqua
          </p>
        </div>
        <div className="row gx-3">
          {properties.map((property, i) => (
            <article key={i} className="col-xl-3 col-lg-4 col-sm-6 col-12">
              <div className="card card-ads">
                {/* <div className="card-image">
                  <div id={`carousel-${property.id}`} className="carousel slide ads-carousel">
                    <div className="carousel-inner">
                      {property.images.map((image, index) => (
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
                      data-bs-target={`#carousel-${property.id}`}
                      data-bs-slide="prev"
                    >
                      <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                      <span className="visually-hidden">Previous</span>
                    </button>
                    <button
                      className="carousel-control-next"
                      type="button"
                      data-bs-target={`#carousel-${property.id}`}
                      data-bs-slide="next"
                    >
                      <span className="carousel-control-next-icon" aria-hidden="true"></span>
                      <span className="visually-hidden">Next</span>
                    </button>
                  </div>
                  <span className={`ads-type ${property.type}`}>for {property.type}</span>
                  <span className="ads-fav">
                    <i className="icon-line-awesome-heart-o"></i>
                  </span>
                  <span className="total-ad-pic">
                    <i className="bi bi-camera"></i> {property.images.length}
                  </span>
                  <h4 className="ads-price">{property.price}</h4>
                </div> */}
                <CardImageSlider data={property} />
                <div className="card-body">
                  <h4>
                    <a href="#">{property.title}</a>
                  </h4>
                  <p className="mb-1">
                    <i className="icon-feather-map-pin"></i> {property.location}
                  </p>
                  <ul className="list-info">
                    <li>
                      <i className="icon-img-flat"></i> {property.details.type}
                    </li>
                    <li>
                      <i className="icon-img-room"></i> Rooms: <span>{property.details.rooms}</span>
                    </li>
                    <li>
                      <i className="icon-img-bed"></i> Bedrooms: <span>{property.details.bedrooms}</span>
                    </li>
                    <li>
                      <i className="icon-img-ratio"></i> <span>{property.details.area}</span>
                    </li>
                    <li>
                      <i className="icon-img-tub"></i> Bathrooms: <span>{property.details.bathrooms}</span>
                    </li>
                  </ul>
                </div>
                <div className="card-footer">
                  <div className="user-details">
                    <div className="user-avatar">
                      <img
                        src={property.agent.avatar}
                        alt=""
                        height="32"
                        width="32"
                        className="rounded-circle"
                      />
                    </div>
                    <div className="user-name">
                      <span>{property.agent.name}</span>
                    </div>
                  </div>
                  <span className="ad-post-date ms-3">
                    <i className="icon-feather-calendar"></i> {property.date}
                  </span>
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

export default RecentPropertySection;
