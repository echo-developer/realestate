import React from "react";
import CardImageSlider from "../cardImageSlider/CardImageSlider";

const properties = [
  {
    id: 1,
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
        ],
//     "gallery": [
//       {
//         "id": 1,
//         "image_type": "interior",
//         "images": [
//             {
//                 "caption": "",
//                 "file": "assets/images/uploads/dcca5e27a298d97263e9a05da3b9f5cf.jpg"
//             },
//             {
//                 "caption": "",
//                 "file": "assets/images/uploads/property-2.jpg"
//             },
//             {
//                 "caption": "",
//                 "file": "assets/images/uploads/property-3.jpg"
//             },
//         ]
//     },
//     {
//       "id": 1,
//       "image_type": "interior",
//       "images": [
//           {
//               "caption": "",
//               "file": "assets/images/uploads/dcca5e27a298d97263e9a05da3b9f5cf.jpg"
//           },
//           {
//               "caption": "",
//               "file": "assets/images/uploads/property-2.jpg"
//           },
//           {
//               "caption": "",
//               "file": "assets/images/uploads/property-3.jpg"
//           },
//       ]
//   },
//   {
//     "id": 1,
//     "image_type": "interior",
//     "images": [
//         {
//             "caption": "",
//             "file": "assets/images/uploads/dcca5e27a298d97263e9a05da3b9f5cf.jpg"
//         },
//         {
//             "caption": "",
//             "file": "assets/images/uploads/property-2.jpg"
//         },
//         {
//             "caption": "",
//             "file": "assets/images/uploads/property-3.jpg"
//         },
//     ]
// },
//     ],
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

const PropertyGallery = () => {
  return (
    <section className="section">
      <div className="container-fluid">
        <div className="section-headline text-center">
          <h5>
            <img
              src="/assets/images/icons/house-sm-1.png"
              alt="Icon"
              height="20"
              width="20"
            />{" "}
            New Project
          </h5>
          <h3>New Project Gallery</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua
          </p>
        </div>
        <div className="row gx-3">
          {properties.map((property, index) => (
            <article className="col-xl-3 col-lg-4 col-sm-6 col-12" key={index}>
              <div className="card card-ads">
              <div className="card-image">
  <div
    id={`carousel-${index}`}
    className="carousel slide ads-carousel"
  >
    <div className="carousel-inner">
      {property?.images?.map((image, imgIndex) => (
        <div
          key={imgIndex}
          className={`carousel-item ${imgIndex === 0 ? "active" : ""}`}
        >
          <img
            src={image}
            alt={`Property ${index + 1}`}
            className="card-img-top"
          />
        </div>
      ))}
    </div>
    <button
      className="carousel-control-prev"
      type="button"
      data-bs-target={`#carousel-${index}`}
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
      data-bs-target={`#carousel-${index}`}
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
    <i className="bi bi-camera"></i> {property?.images?.length}
  </span>
  <h4 className="ads-price">{property?.price}</h4>
</div>

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
                      <i className="icon-img-room"></i> Rooms:{" "}
                      <span>{property.details.rooms}</span>
                    </li>
                    <li>
                      <i className="icon-img-bed"></i> Bedrooms:{" "}
                      <span>{property.details.bedrooms}</span>
                    </li>
                    <li>
                      <i className="icon-img-ratio"></i>{" "}
                      <span>{property.details.area}</span> sq m
                    </li>
                    <li>
                      <i className="icon-img-tub"></i> Bathrooms:{" "}
                      <span>{property.details.bathrooms}</span>
                    </li>
                  </ul>
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

export default PropertyGallery;
