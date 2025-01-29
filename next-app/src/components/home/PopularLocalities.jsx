import React from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

const PopularLocalities = () => {
  const localities = [
    { name: 'Rajarhat', image: 'assets/images/company/company-10.jpg', priceRange: '$34,999 - $39,999', reviews: 204 },
    { name: 'Newtown', image: 'assets/images/city/abu-dhabi.jpg', priceRange: '$30,000 - $35,000', reviews: 150 },
    { name: 'EM Bypass', image: 'assets/images/city/abu-dhabi.jpg', priceRange: '$25,000 - $30,000', reviews: 120 },
  ];

  const responsive = {
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 3, slidesToSlide: 1 },
    tablet: { breakpoint: { max: 1024, min: 768 }, items: 2, slidesToSlide: 1 },
    mobile: { breakpoint: { max: 768, min: 0 }, items: 1, slidesToSlide: 1 },
  };

  return (
    <section className="section">
      <div className="container-fluid">
        <div className="row gx-3">
          <aside className="col-xl-3 col-lg-4 col-12">
            <div className="card card-v-agent h-100">
              <div className="card-body d-flex align-items-center">
                <div className="Name">
                  <h2>Explore</h2>
                  <h3 className="mb-0">Popular Localities in Kolkata</h3>
                </div>
              </div>
            </div>
          </aside>
          <aside className="col-xl-9 col-lg-8 col-12">
            <div className="card h-100">
              <div className="card-header p-0">
                <ul className="nav nav-underline nav-fill">
                  {localities.map((locality, index) => (
                    <li className="nav-item" key={index}>
                      <a className="nav-link" href="#">
                        {locality.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="card-body">
                <Carousel
                  responsive={responsive}
                  swipeable={true}
                  draggable={true}
                  showDots={false}
                  arrows={false}
                  infinite={true}
                  keyBoardControl={true}
                  containerClass="carousel-container"
                  itemClass="px-3"
                >
                  {localities.map((locality, index) => (
                    <div key={index} className="card card-city">
                      <div className="card-body">
                        <div className="d-flex">
                          <img
                            src={locality.image}
                            alt={locality.name}
                            height="64"
                            width="64"
                            className="rounded-circle"
                          />
                          <div className="flex-grow-1 ps-3">
                            <h4>
                              {locality.name}, Block C02, Apartment <a href=""><i className="bi bi-box-arrow-up-right"></i></a>
                            </h4>
                            <h5>{locality.priceRange}</h5>
                            <p>
                              <i className="bi bi-star-fill text-warning"></i> 4.0 &nbsp; | &nbsp; {locality.reviews} Reviews
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </Carousel>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default PopularLocalities;
