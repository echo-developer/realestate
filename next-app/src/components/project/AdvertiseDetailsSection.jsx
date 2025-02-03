import { useState } from "react";

const advertisers = [
  {
    name: "Oslo Projects",
    operatingSince: 2014,
    buyersServed: 48000,
    agent: {
      name: "Devid Devan",
      role: "Builder",
      photo: "/assets/images/agents/agent-1.jpg",
    },
    logo: "/assets/images/favicon.png",
  },
  {
    name: "Surya Projects",
    operatingSince: 2014,
    buyersServed: 48000,
    agent: {
      name: "Macc Millan",
      role: "Agent",
      photo: "/assets/images/agents/agent-4.jpg",
    },
    logo: "/assets/images/favicon.png",
  },
  // Add more advertiser objects here
];

export default function AdvertiserSection() {
  return (
    <section id="advertiser" className="mb-4">
      <div className="card border-0 shadow-1 mb-4">
        <div className="card-body">
          <h4 className="mb-3 text-primary">Top Advertisers</h4>
          <div className="owl-carousel owl-theme advertiser-carousel owl-loaded owl-drag">
            <div className="owl-stage-outer">
              <div className="owl-stage" style={{ transform: "translate3d(0px, 0px, 0px)", transition: "all", width: "1594px" }}>
                {advertisers.map((advertiser, index) => (
                  <div className="owl-item" style={{ width: "298.75px", marginRight: "20px" }} key={index}>
                    <article className="item">
                      <div className="card card-advertiser">
                        <div className="card-body">
                          <div className="d-flex">
                            <img src={advertiser.logo} alt="Icon" height="40" width="40" className="rounded-3" />
                            <div className="flex-grow-1 ps-3">
                              <h5>{advertiser.name}</h5>
                              <p className="mb-1">
                                <span className="text-muted">Operating Since:</span> {advertiser.operatingSince}
                              </p>
                              <p>
                                <span className="text-muted">Buyer Served:</span> {advertiser.buyersServed}+
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="card-footer">
                          <div className="d-flex">
                            <img src={advertiser.agent.photo} alt="Icon" height="36" width="36" className="rounded-circle" />
                            <div className="flex-grow-1 ps-2">
                              <h5 className="mb-0">{advertiser.agent.role}</h5>
                              <p className="small">{advertiser.agent.name}</p>
                            </div>
                          </div>
                          <a href="#" className="btn btn-primary">
                            Contact Now
                          </a>
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
    </section>
  );
}
