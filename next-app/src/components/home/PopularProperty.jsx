import React from 'react';

const PopularProperty = () => {
  const properties = [
    {
      id: 1,
      imgSrc: 'assets/images/uploads/d0d74748da69d1067d797427796723c5.jpg',
      type: 'rent',
      price: '$499',
      title: 'Urban Living at its best in Dubai Marina',
      location: 'Dubai Marina, Dubai, UAE',
    },
    {
      id: 2,
      imgSrc: 'assets/images/uploads/6ee9ad0b592712d02a9c315c87812155.jpg',
      type: 'sale',
      price: '$36,500',
      title: 'Executive Suite with Premium Finishes | Vacant Now',
      location: 'Mohamed Bin Zayed City, Abu Dhabi, UAE',
    },
    {
      id: 3,
      imgSrc: 'assets/images/uploads/c7cd59ed1814ede83bff8bf5eed14c67.jpg',
      type: 'rent',
      price: '$1,875/mo',
      title: 'Stunning 4 Bedroom Penthouse',
      location: 'Oceana Caribbean, Fujairah, UAE',
    },
    {
      id: 4,
      imgSrc: 'assets/images/uploads/property-1.jpg',
      type: 'rent',
      price: '$499',
      title: 'Urban Living at its best in Dubai Marina',
      location: 'Dubai Marina, Dubai, UAE',
    },
    {
      id: 5,
      imgSrc: 'assets/images/uploads/property-2.jpg',
      type: 'sale',
      price: '$36,500',
      title: 'Executive Suite with Premium Finishes | Vacant Now',
      location: 'Mohamed Bin Zayed City, Abu Dhabi, UAE',
    },
    {
      id: 6,
      imgSrc: 'assets/images/uploads/property-3.jpg',
      type: 'rent',
      price: '$1,875/mo',
      title: 'Stunning 4 Bedroom Penthouse',
      location: 'Oceana Caribbean, Fujairah, UAE',
    },
  ];

  return (
    <section className="section pb-0">
      <div className="container-fluid">
        <div className="section-headline text-center">
          <h5>
            <img
              src="/assets/images/icons/house-sm-1.png"
              alt="Icon"
              height="20"
              width="20"
            />{' '}
            Popular Property
          </h5>
          <h3>Popular Property</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua
          </p>
        </div>

        <div className="owl-carousel owl-theme owl-carousel-popular owl-loaded owl-drag">
          <div className="owl-stage-outer">
            <div
              className="owl-stage"
              style={{
                transform: 'translate3d(0px, 0px, 0px)',
                transition: 'all',
                width: '2058px',
              }}
            >
              {properties.map((property) => (
                <div
                  key={property.id}
                  className="owl-item active"
                  style={{ width: '323px', marginRight: '20px' }}
                >
                  <article className="item">
                    <div className="card card-ads card-overlay">
                      <div className="card-image">
                        <img
                          src={property.imgSrc}
                          alt="Property"
                          className="card-img"
                        />
                        <span className={`ads-type ${property.type}`}>
                          {property.type === 'rent' ? 'for rent' : 'for Sale'}
                        </span>
                        <span className="ads-fav">
                          <i className="icon-line-awesome-heart-o"></i>
                        </span>
                      </div>
                      <div className="card-img-overlay">
                        <div>
                          <h4>{property.price}</h4>
                          <h4>
                            <a href="">{property.title}</a>
                          </h4>
                          <p>
                            <i className="icon-feather-map-pin"></i> {property.location}
                          </p>
                        </div>
                      </div>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>
          <div className="owl-nav">
            <button
              type="button"
              role="presentation"
              className="owl-prev disabled"
            >
              <span aria-label="Previous" className="icon-line-awesome-angle-left"></span>
            </button>
            <button type="button" role="presentation" className="owl-next">
              <span aria-label="Next" className="icon-line-awesome-angle-right"></span>
            </button>
          </div>
          <div className="owl-dots">
            <button role="button" className="owl-dot active">
              <span></span>
            </button>
            <button role="button" className="owl-dot">
              <span></span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PopularProperty;
