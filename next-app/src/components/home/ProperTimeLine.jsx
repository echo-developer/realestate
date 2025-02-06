import React, { useEffect } from "react";
import Aos from "aos";
import "aos/dist/aos.css";

const ProperTimeLine = () => {
  useEffect(() => {
    Aos.init({ duration: 500 });
    Aos.refresh();
  }, []);

  return (
    <section className="section">
      <div className="container">
        <div className="timeline-container">
          <div className="row gx-lg-5 align-items-center timeline">
            <aside className="col-lg col-12" data-aos="fade-right">
              <div className="section-headline text-end">
                <h3>For Buyers</h3>
                <p>
                  Looking for your dream property? Follow these simple steps to
                  find your ideal home or investment.
                </p>
              </div>
              <div className="row gx-3 flex-row-reverse">
                <article className="col-lg-4 col-sm-6 col-12">
                  <div className="card card-how-box">
                    <div className="card-body">
                      <img
                        src="/assets/images/icons/icon-calendar.png"
                        alt="Schedule property viewings"
                        height="32"
                        width="32"
                        className="mb-2"
                      />
                      <h4>Schedule Viewings</h4>
                    </div>
                  </div>
                </article>
                <article className="col-lg-4 col-sm-6 col-12">
                  <div className="card card-how-box">
                    <div className="card-body">
                      <img
                        src="/assets/images/icons/icon-listing.png"
                        alt="View detailed listings"
                        height="32"
                        width="32"
                        className="mb-2"
                      />
                      <h4>Get Detailed Listings</h4>
                    </div>
                  </div>
                </article>
                <article className="col-lg-4 col-sm-6 col-12">
                  <div className="card card-how-box">
                    <div className="card-body">
                      <img
                        src="/assets/images/icons/icon-search.png"
                        alt="Search for available properties"
                        height="32"
                        width="32"
                        className="mb-2"
                      />
                      <h4>Search for Properties</h4>
                    </div>
                  </div>
                </article>
                <article className="col-lg-4 col-sm-6 col-12">
                  <div className="card card-how-box">
                    <div className="card-body">
                      <img
                        src="/assets/images/icons/icon-deal.png"
                        alt="Finalize the deal"
                        height="32"
                        width="32"
                        className="mb-2"
                      />
                      <h4>Close the Deal</h4>
                    </div>
                  </div>
                </article>
                <article className="col-lg-4 col-sm-6 col-12">
                  <div className="card card-how-box">
                    <div className="card-body">
                      <img
                        src="/assets/images/icons/icon-offer.png"
                        alt="Make offers confidently"
                        height="32"
                        width="32"
                        className="mb-2"
                      />
                      <h4>Make Offers with Confidence</h4>
                    </div>
                  </div>
                </article>
                <article className="col-lg-4 col-sm-6 col-12">
                  <div className="card card-how-box bg-white">
                    <div className="card-body">
                      <a href="#" className="btn btn-primary">
                        Know More
                      </a>
                    </div>
                  </div>
                </article>
              </div>
            </aside>
            <aside className="col-lg col-12 d-none d-lg-block" data-aos="fade-left">
              <img
                src="/assets/images/icons/buyer.png"
                alt="Buyer image"
                className="img-fluid"
              />
            </aside>
          </div>
          <div className="row gx-lg-5 align-items-center timeline">
            <aside
              className="col-lg col-12 d-none d-lg-block text-end"
              data-aos="fade-right"
            >
              <img
                src="/assets/images/icons/seller.png"
                alt="Seller image"
                className="img-fluid"
              />
            </aside>
            <aside className="col-lg col-12" data-aos="fade-up">
              <div className="section-headline">
                <h3>For Sellers</h3>
                <p>
                  Ready to sell your property? Our platform makes the selling
                  process smooth and efficient.
                </p>
              </div>
              <div className="row gx-3">
                <article className="col-lg-4 col-sm-6 col-12">
                  <div className="card card-how-box">
                    <div className="card-body">
                      <img
                        src="/assets/images/icons/icon-calendar.png"
                        alt="Create a listing for your property"
                        height="32"
                        width="32"
                        className="mb-2"
                      />
                      <h4>Create a Listing</h4>
                    </div>
                  </div>
                </article>
                <article className="col-lg-4 col-sm-6 col-12">
                  <div className="card card-how-box">
                    <div className="card-body">
                      <img
                        src="/assets/images/icons/icon-listing.png"
                        alt="Get maximum exposure for your listing"
                        height="32"
                        width="32"
                        className="mb-2"
                      />
                      <h4>Get Maximum Exposure</h4>
                    </div>
                  </div>
                </article>
              </div>
            </aside>
          </div>
          <div className="row gx-lg-5 align-items-center timeline">
            <aside className="col-lg col-12" data-aos="fade-right">
              <div className="section-headline text-end">
                <h3>For Renters</h3>
                <p>Finding your next rental has never been easier.</p>
              </div>
              <div className="row gx-3 flex-row-reverse">
                <article className="col-lg-4 col-sm-6 col-12">
                  <div className="card card-how-box">
                    <div className="card-body">
                      <img
                        src="/assets/images/icons/icon-calendar.png"
                        alt="Contact landlords or agents"
                        height="32"
                        width="32"
                        className="mb-2"
                      />
                      <h4>Contact Landlords or Agents</h4>
                    </div>
                  </div>
                </article>
              </div>
            </aside>
            <aside className="col-lg col-12 d-none d-lg-block" data-aos="fade-down">
              <img
                src="/assets/images/icons/renters.png"
                alt="Renters image"
                className="img-fluid"
              />
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProperTimeLine;
