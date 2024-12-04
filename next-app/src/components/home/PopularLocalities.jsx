import React from 'react';

const PopularLocalities = () => {
  const localities = [
    { name: 'Rajarhat', image: 'assets/images/company/company-10.jpg', priceRange: '$34,999 - $39,999', reviews: 204 },
    { name: 'Newtown', image: 'assets/images/city/abu-dhabi.jpg', priceRange: '$30,000 - $35,000', reviews: 150 },
    { name: 'EM Bypass', image: 'assets/images/city/abu-dhabi.jpg', priceRange: '$25,000 - $30,000', reviews: 120 },
  ];

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
                <div className="owl-carousel owl-theme owl-carousel-city owl-loaded owl-drag">
                  <div className="owl-stage-outer">
                    <div className="owl-stage" style={{ transform: 'translate3d(0px, 0px, 0px)', transition: 'all', width: '1660px' }}>
                      {localities.map((locality, index) => (
                        <div className="owl-item" key={index} style={{ width: '312px', marginRight: '20px' }}>
                          <article className="item">
                            <div className="card card-city">
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
                          </article>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="owl-nav">
                    <button type="button" role="presentation" className="owl-prev disabled">
                      <span aria-label="Previous" className="icon-line-awesome-angle-left"></span>
                    </button>
                    <button type="button" role="presentation" className="owl-next">
                      <span aria-label="Next" className="icon-line-awesome-angle-right"></span>
                    </button>
                  </div>
                  <div className="owl-dots disabled"></div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default PopularLocalities;
