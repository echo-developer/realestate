import React from 'react';

const propertiesForRent = [
  {
    id: 1,
    image: 'http://localhost/realestate-live/public/upload/properties/thumb420/1669810966_50c99ead1d21e02aff1c.jpg',
    type: 'Flats',
    location: 'Location 3',
    rooms: 1,
    bathrooms: 1,
    beds: 1,
  },
];

const propertiesForSale = [
  {
    id: 1,
    image: 'http://localhost/realestate-live/public/upload/properties/thumb420/1669810966_50c99ead1d21e02aff1c.jpg',
    type: 'Sell',
    location: 'Ranchi, Lalpur',
    rooms: 1,
    bathrooms: 2,
    beds: 3,
  },
];

const PropertyCard = ({ property }) => (
  <article className="card">
    <img src={property.image} alt={`${property.type} image`} className="card-img-top" />
    <div className="card-body">
      <h4>{property.type}</h4>
      <p>
        <i className="icon-feather-map-pin"></i> {property.location}
      </p>
      <ul>
        <li>{property.rooms} Room</li>
        <li>{property.bathrooms} Bathroom(s)</li>
        <li>{property.beds} Bed(s)</li>
      </ul>
    </div>
  </article>
);

const Index = () => {
  return (
      <main>
        <div className="banner">
          <div className="container">
            <h1>Agent Details</h1>
          </div>
        </div>

        <section className="profile">
          <div className="container-fluid">
            <div className="row">
              {/* Main Content Section */}
              <div className="col-xl-8 col-lg-8 col-12">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <a href="#">Home</a>
                    </li>
                    <li className="breadcrumb-item">
                      <a href="#">My Profile</a>
                    </li>
                  </ol>
                </nav>

                <div className="card mb-4">
                  <div className="row g-0">
                    <div className="col-sm-auto col-4">
                      <img
                        src="http://localhost/realestate/frontend-node/public/temp//1724136310560-download (3).jfif"
                        alt="Agent Logo"
                        className="img-fluid"
                      />
                    </div>
                    <div className="col-sm col-8">
                      <div className="card-body">
                        <h4 className="mb-1">
                          Moin <i className="icon-img-check ms-1"></i>
                        </h4>
                        <p>
                          <i className="icon-feather-map-pin text-primary"></i> Email: moin1@mail.com
                        </p>
                        <p>
                          <i className="icon-feather-user text-primary"></i> Contact: 9525952621
                        </p>
                        <div className="d-flex">
                          <a href="#" className="btn btn-primary btn-sm me-2">
                            Contact Owner
                          </a>
                          <a href="#" className="btn btn-outline-primary btn-sm me-2">
                            Phone Number
                          </a>
                          <div className="dropdown">
                            <button
                              className="btn btn-sm btn-outline-site dropdown-toggle"
                              type="button"
                              data-bs-toggle="dropdown"
                            >
                              Share
                            </button>
                            <ul className="dropdown-menu">
                              <li>
                                <a href="#" className="dropdown-item">
                                  Facebook
                                </a>
                              </li>
                              <li>
                                <a href="#" className="dropdown-item">
                                  Twitter
                                </a>
                              </li>
                              <li>
                                <a href="#" className="dropdown-item">
                                  LinkedIn
                                </a>
                              </li>
                              <li>
                                <a href="#" className="dropdown-item">
                                  WhatsApp
                                </a>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card mb-4">
                  <div className="card-header">
                    <h4>About Agent</h4>
                  </div>
                  <div className="card-body">
                    <p>No information available.</p>
                  </div>
                </div>

                <div>
                  <h4>Property on Rent</h4>
                  <div className="property-carousel">
                    {propertiesForRent.map((property) => (
                      <PropertyCard key={property.id} property={property} />
                    ))}
                  </div>
                </div>

                <div>
                  <h4>Property on Sell</h4>
                  <div className="property-carousel">
                    {propertiesForSale.map((property) => (
                      <PropertyCard key={property.id} property={property} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar Section */}
              <aside className="col-xl-4 col-lg-4 col-12">
                <div className="sticky-top">
                  <div className="action-buttons mb-3">
                    <a href="#" className="btn">
                      <i className="icon-line-awesome-heart-o"></i> Save
                    </a>
                    <a href="#" className="btn">
                      <i className="icon-feather-flag"></i> Report
                    </a>
                    <a href="#" className="btn">
                      <i className="icon-feather-printer"></i> Print
                    </a>
                  </div>

                  <div className="card mb-4">
                    <div className="card-header">
                      <h4>Contact Agent</h4>
                    </div>
                    <div className="card-body">
                      <form>
                        <div className="mb-3">
                          <label>Name</label>
                          <input type="text" className="form-control" required />
                        </div>
                        <div className="mb-3">
                          <label>Email</label>
                          <input type="email" className="form-control" required />
                        </div>
                        <div className="mb-3">
                          <label>Mobile</label>
                          <input type="text" className="form-control" />
                        </div>
                        <div className="mb-3">
                          <label>Message</label>
                          <textarea className="form-control" rows="3" required></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary">
                          Send
                        </button>
                      </form>
                    </div>
                  </div>

                  <div className="card">
                    <div className="card-body">
                      <h4>Office Address</h4>
                      <address>
                        <i className="icon-feather-map-pin"></i> UA, UAE
                      </address>
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d99512.80400724961!2d54.49250820162658!3d24.340538033250233!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5e476b238494e5%3A0xfd3db0486d6d68d6!2sMohamed%20Bin%20Zayed%20City%20-%20Abu%20Dhabi%20-%20United%20Arab%20Emirates!5e1!3m2!1sen!2sin!4v1650384953003!5m2!1sen!2sin"
                        width="100%"
                        height="315"
                        style={{ border: 0 }}
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>
  );
};

export default Index;
