import React from 'react';


const properties = [
  {
    id: 1,
    type: "rent",
    image: "assets/images/uploads/d0d74748da69d1067d797427796723c5.jpg",
    title: "Urban Living at its best in Dubai Marina",
    location: "Dubai Marina, Dubai, UAE",
    rooms: 6,
    bedrooms: 4,
    area: 550,
    bathrooms: 8,
    price: "$499",
    buttonText: "Book Now",
  },
  {
    id: 2,
    type: "sale",
    image: "assets/images/uploads/6ee9ad0b592712d02a9c315c87812155.jpg",
    title: "Executive Suite with Premium Finishes | Vacant Now",
    location: "Mohamed Bin Zayed City, Abu Dhabi, UAE",
    rooms: 6,
    bedrooms: 4,
    area: 550,
    bathrooms: 8,
    price: "$36,500",
    buttonText: "Book Now",
  },
  {
    id: 3,
    type: "rent",
    image: "assets/images/uploads/c7cd59ed1814ede83bff8bf5eed14c67.jpg",
    title: "Stunning 4 Bedroom Penthouse",
    location: "Oceana Caribbean, Fujairah, UAE",
    rooms: 6,
    bedrooms: 4,
    area: 550,
    bathrooms: 8,
    price: "$1,875/mo",
    buttonText: "Book Now",
  },
  {
    id: 4,
    type: "rent",
    image: "assets/images/uploads/property-1.jpg",
    title: "Urban Living at its best in Dubai Marina",
    location: "Dubai Marina, Dubai, UAE",
    rooms: 6,
    bedrooms: 4,
    area: 550,
    bathrooms: 8,
    price: "$499",
    buttonText: "Book Now",
  },
  {
    id: 5,
    type: "sale",
    image: "assets/images/uploads/property-2.jpg",
    title: "Executive Suite with Premium Finishes | Vacant Now",
    location: "Mohamed Bin Zayed City, Abu Dhabi, UAE",
    rooms: 6,
    bedrooms: 4,
    area: 550,
    bathrooms: 8,
    price: "$36,500",
    buttonText: "Book Now",
  },
  {
    id: 6,
    type: "rent",
    image: "assets/images/uploads/property-3.jpg",
    title: "Stunning 4 Bedroom Penthouse",
    location: "Oceana Caribbean, Fujairah, UAE",
    rooms: 6,
    bedrooms: 4,
    area: 550,
    bathrooms: 8,
    price: "$1,875/mo",
    buttonText: "Book Now",
  },
];

const FeatureProperty = () => {

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024, // For tablets and smaller desktops
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768, // For mobile devices
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480, // For small screens
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };


  return (
    <section className="section pb-0">
      <div className="container-fluid">
        <div className="section-headline text-center">
          <h5>
            <img src="/assets/images/icons/house-sm-1.png" alt="Icon" height="20" width="20" /> Featured Homes
          </h5>
          <h3>Discover Our Featured Listings</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</p>
        </div>
        <div className="owl-carousel owl-theme owl-carousel-featured owl-loaded owl-drag">
          <div className="owl-stage-outer">
            <div className="owl-stage" style={{ transform: "translate3d(0px, 0px, 0px)", transition: "all", width: "2700px" }}>
            {properties.map(property => (
                <div className="owl-item" key={property.id} style={{ width: "430px", marginRight: "20px" }}>
                  <article className="item">
                    <div className="card card-ads card-overlay" style={{ backgroundColor: 'rgba(0, 0, 0, 0.65)' }}>
                      <div className="card-image">
                        <img src={property.image} alt="" className="card-img" />
                        <span className={`ads-type ${property.type}`}>{property.type === "rent" ? "for rent" : "for Sale"}</span>
                        <span className="ads-fav"><i className="icon-line-awesome-heart-o"></i></span>
                      </div>
                      <div className="card-img-overlay">
                        <h4><a href="">{property.title}</a></h4>
                        <ul className="list-info">
                          <li><i className="icon-img-flat"></i> House/Villa</li>
                          <li><i className="icon-img-room"></i> Rooms: <span>{property.rooms}</span></li>
                          <li><i className="icon-img-bed"></i> Bedrooms: <span>{property.bedrooms}</span></li>
                          <li><i className="icon-img-ratio"></i> <span>{property.area}</span> sq m</li>
                          <li><i className="icon-img-tub"></i> Bathrooms: <span>{property.bathrooms}</span></li>
                        </ul>
                        <p className="mb-1"><i className="icon-feather-map-pin"></i> {property.location}</p>
                        <div className="d-flex align-items-center">
                          <h4 className="mb-0 flex-grow-1">{property.price}</h4>
                          <a href="" className="btn btn-primary">{property.buttonText}</a>
                        </div>
                      </div>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeatureProperty;


