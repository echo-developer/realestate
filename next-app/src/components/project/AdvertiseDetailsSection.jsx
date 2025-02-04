import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css"; // Import styles for React Multi Carousel

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

const AdvertiserSection = () => {
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      slidesToSlide: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  return (
    <section id="advertiser" className="mb-4">
      <div className="card border-0 shadow-1 mb-4">
        <div className="card-body">
          <h4 className="mb-3 text-primary">Top Advertisers</h4>
          <Carousel responsive={responsive} infinite={true} arrows={true}>
            {advertisers.map((advertiser, index) => (
              <div key={index} className="item">
                <div className="card card-advertiser">
                  <div className="card-body">
                    <div className="d-flex">
                      <img
                        src={advertiser.logo}
                        alt="Logo"
                        height="40"
                        width="40"
                        className="rounded-3"
                      />
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
                      <img
                        src={advertiser.agent.photo}
                        alt="Agent"
                        height="36"
                        width="36"
                        className="rounded-circle"
                      />
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
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default AdvertiserSection;
