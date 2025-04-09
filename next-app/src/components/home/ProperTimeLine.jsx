"use client";
import React, { useEffect } from "react";
import Aos from "aos";
import "aos/dist/aos.css";
import Link from "next/link";
import Image from "next/image";

const ProperTimeLine = ({ translation }) => {
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
              <div className="section-headline text-center text-lg-end">
                <h3>{translation?.for_buyers || "For Buyers"}</h3>
                <p className="mw-100">
                  {translation?.buyers_description ||
                    "Searching for your dream property? Follow these easy steps to find the perfect home or investment opportunity."}
                </p>
              </div>
              <div className="row gx-3 flex-row-reverse">
                <article className="col-lg-4 col-sm-6 col-12">
                  <div className="card card-how-box">
                    <div className="card-body">
                      <Image
                        src="/assets/images/icons/icon-calendar.png"
                        alt="Schedule property viewings"
                        height="32"
                        width="32"
                        className="mb-2"
                        loading="lazy"
                      />
                      <h4>
                        {translation?.schedule_viewings || "Schedule Viewings"}
                      </h4>
                    </div>
                  </div>
                </article>
                <article className="col-lg-4 col-sm-6 col-12">
                  <div className="card card-how-box">
                    <div className="card-body">
                      <Image
                        src="/assets/images/icons/icon-listing.png"
                        alt="View detailed listings"
                        height="32"
                        width="32"
                        className="mb-2"
                        loading="lazy"
                      />
                      <h4>
                        {translation?.get_detailed_listings ||
                          "Get Detailed Listings"}
                      </h4>
                    </div>
                  </div>
                </article>
                <article className="col-lg-4 col-sm-6 col-12">
                  <div className="card card-how-box">
                    <div className="card-body">
                      <Image
                        src="/assets/images/icons/icon-search.png"
                        alt="Search for available properties"
                        height="32"
                        width="32"
                        className="mb-2"
                        loading="lazy"
                      />
                      <h4>
                        {translation?.search_properties ||
                          "Search for Properties"}
                      </h4>
                    </div>
                  </div>
                </article>
                <article className="col-lg-4 col-sm-6 col-12">
                  <div className="card card-how-box">
                    <div className="card-body">
                      <Image
                        src="/assets/images/icons/icon-deal.png"
                        alt="Finalize the deal"
                        height="32"
                        width="32"
                        className="mb-2"
                        loading="lazy"
                      />
                      <h4>{translation?.close_deal || "Close the Deal"}</h4>
                    </div>
                  </div>
                </article>
                <article className="col-lg-4 col-sm-6 col-12">
                  <div className="card card-how-box">
                    <div className="card-body">
                      <Image
                        src="/assets/images/icons/icon-offer.png"
                        alt="Make offers confidently"
                        height="32"
                        width="32"
                        className="mb-2"
                        loading="lazy"
                      />
                      <h4>
                        {translation?.make_offers_with_confidence ||
                          "Make Offers with Confidence"}
                      </h4>
                    </div>
                  </div>
                </article>
                <article className="col-lg-4 col-sm-6 col-12">
                  <div className="card card-how-box bg-white">
                    <div className="card-body">
                      <Link
                        target="_blank"
                        href="/property-listing"
                        className="btn btn-primary"
                      >
                        {translation?.know_more || "Know More"}
                      </Link>
                    </div>
                  </div>
                </article>
              </div>
            </aside>
            <aside
              className="col-lg col-12 d-none d-lg-block"
              data-aos="fade-left"
            >
              <Image
                src="/assets/images/icons/buyer.png"
                alt="Buyer image"
                className="img-fluid"
                height="128"
                width="128"
                loading="lazy"
              />
            </aside>
          </div>
          <div className="row gx-lg-5 align-items-center timeline">
            <aside
              className="col-lg col-12 d-none d-lg-block text-lg-end"
              data-aos="fade-right"
            >
              <Image
                src="/assets/images/icons/seller.png"
                alt="Seller image"
                className="img-fluid"
                height="128"
                width="128"
                loading="lazy"
              />
            </aside>
            <aside className="col-lg col-12" data-aos="fade-up">
              <div className="section-headline text-center text-lg-end">
                <h3>{translation?.for_sellers || "For Sellers"}</h3>
                <p className="mw-100">
                  {translation?.sellers_description ||
                    "Ready to sell your property? Our platform streamlines the selling process, making it smooth, efficient, and hassle-free."}
                </p>
              </div>
              <div className="row gx-3">
                <article className="col-lg-4 col-sm-6 col-12">
                  <div className="card card-how-box">
                    <div className="card-body">
                      <Image
                        src="/assets/images/icons/icon-calendar.png"
                        alt="Create a listing for your property"
                        height="32"
                        width="32"
                        className="mb-2"
                        loading="lazy"
                      />
                      <h4>
                        {translation?.create_listing || "Create a Listing"}
                      </h4>
                    </div>
                  </div>
                </article>
                <article className="col-lg-4 col-sm-6 col-12">
                  <div className="card card-how-box">
                    <div className="card-body">
                      <Image
                        src="/assets/images/icons/icon-listing.png"
                        alt="Get maximum exposure for your listing"
                        height="32"
                        width="32"
                        className="mb-2"
                        loading="lazy"
                      />
                      <h4>
                        {translation?.get_maximum_exposure ||
                          "Get Maximum Exposure"}
                      </h4>
                    </div>
                  </div>
                </article>
              </div>
            </aside>
          </div>
          <div className="row gx-lg-5 align-items-center timeline">
            <aside className="col-lg col-12" data-aos="fade-right">
              <div className="section-headline text-center text-lg-end">
                <h3>{translation?.for_renters || "For Renters"}</h3>
                <p className="mw-100">
                  {translation?.renters_description ||
                    "Discover your next rental with ease. Our platform makes finding the perfect rental property simpler and faster than ever."}
                </p>
              </div>
              <div className="row gx-3 flex-row-reverse">
                <article className="col-lg-4 col-sm-6 col-12">
                  <div className="card card-how-box">
                    <div className="card-body">
                      <Image
                        src="/assets/images/icons/icon-calendar.png"
                        alt="Contact landlords or agents"
                        height="32"
                        width="32"
                        className="mb-2"
                        loading="lazy"
                      />
                      <h4>
                        {translation?.contact_owner_agents ||
                          "Contact Owner or Agents"}
                      </h4>
                    </div>
                  </div>
                </article>
              </div>
            </aside>
            <aside
              className="col-lg col-12 d-none d-lg-block"
              data-aos="fade-down"
            >
              <Image
                src="/assets/images/icons/renters.png"
                alt="Renters image"
                className="img-fluid"
                height="128"
                width="128"
                loading="lazy"
              />
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProperTimeLine;
