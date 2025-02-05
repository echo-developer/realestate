import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";
import CardImageSlider from "../cardImageSlider/CardImageSlider";



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

const SimilarProperties = ({propertydata, heading}) => {
    const [showModal,setShowModal]=useState()
  const settings = {
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    dots: false,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />
  };

  const displayedProperties = propertydata.slice(0, 3);

  return (
    <div className="card border-0 shadow-1 mb-4">
      <div className="card-body">
        <div className="d-flex justify-content-between">
          <h4 className="mb-3 text-primary"> {heading || "Similar Properties"}</h4>
          <h5>
            <Link href="/property-listing">
              Explore All Properties <i className="bi bi-arrow-right"></i>
            </Link>
          </h5>
        </div>
        <div className="row gx-3 -mb-3">
          {displayedProperties.map((property, index) => {



            return (
              <article key={index} className="col-lg-4 col-sm-6 mb-3">
                <div className="card card-ads">

                  <CardImageSlider data={property} keyword="gallery" />
                  <div className="card-body">
                    <h4>
                      <a href="#">{property.property_name}</a>
                    </h4>
                    <p className="mb-1">
                      <i className="icon-feather-map-pin"></i> {property.address}
                    </p>
                    <p className="text-muted mb-2">{property.possession_status}</p>
                    <a onClick={()=>handleShowModal(property?.id)}>
                      Contact Agent <i className="bi bi-arrow-right"></i>
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SimilarProperties;
