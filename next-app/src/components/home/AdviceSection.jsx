"use client";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const AdviceSection = ({ translation }) => {
  const adviceTools = [
    {
      title: translation?.property_valuation || "Property Valuation",
      description:
        translation?.property_valuation_description ||
        "Maecenas gravida, urna non posuere mi efficitur mauris, vulputate soda nunc.",
      link: "/property-valuation",
      icon: "/assets/images/icons/property-value-1.png",
    },
    {
      title: translation?.legal_title_check || "Legal Title Check",
      description:
        translation?.property_valuation_description_1 ||
        "Legal title check verifies property ownership, disputes, liens, encumbrances, authenticity, and compliance with legal regulations.",
      link: "/property-legal-check",
      icon: "/assets/images/icons/award.png",
    },
    {
      title: translation?.create_advertisement || "Create Advertisement",
      description:
        translation?.create_advertisement_description ||
        "Create an eye-catching advertisement to promote your property, attract more buyers, and maximize visibility across our platform.",
      link: "/create-advertisement",
      icon: "/assets/images/icons/commercial.png",
    },    
    {
      title: translation?.emi_calculator || "EMI Calculator",
      description:
        translation?.property_valuation_description_4 ||
        "An EMI calculator computes monthly loan payments based on principal, interest rate, tenure, and repayment schedule.",
      link: "/loan-emi-calculator",
      icon: "/assets/images/icons/emi-calculator.png",
    },
    {
      title: translation?.rates_trends || "Rates Trends",
      description:
        translation?.property_valuation_description_2 ||
        "Rate trends analyze price fluctuations, market demand, economic factors, interest rates, inflation, and real estate cycles.",
      link: "/trending-rates",
      icon: "/assets/images/icons/interest.png",
    },
    {
      title: translation?.emi_eligibility || "EMI Eligibility",
      description:
        translation?.property_valuation_description_5 ||
        "EMI eligibility determines how much loan you qualify for based on your income, existing liabilities, credit score, job stability, and bank-specific criteria.",
      link: "/loan-eligibility",
      icon: "/assets/images/icons/emi-calculator.png",
    },
  ];

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 1200 },
      items: 4,
    },
    desktop: {
      breakpoint: { max: 1200, min: 992 },
      items: 4,
    },
    tablet: {
      breakpoint: { max: 992, min: 768 },
      items: 3,
    },
    mobile: {
      breakpoint: { max: 768, min: 0 },
      items: 1,
    },
  };

  return (
    <section className="section">
      <div className="container-fluid">
        <div className="section-headline text-center">
          <h5>
            <Image
              src="/assets/images/icons/house-sm-1.png"
              alt="New Project Icon"
              height="20"
              width="20"
            />{" "}
            {translation?.new_project || "New Project"}
          </h5>
          <h3>{translation?.advice_tools || "Advice Tools"}</h3>
          <p>
            {translation?.advice_tools_description ||
              "Access expert advice and useful tools to guide you through every step of your real estate journey with confidence."}
          </p>
        </div>
        <Carousel
          responsive={responsive}
          infinite
          autoPlay
          autoPlaySpeed={3000}
        >
          {adviceTools.map((tool, index) => (
            <div key={index} className="card mb-3 mx-2">
              <div className="card-body">
                <div className="d-flex align-items-center mb-2">
                  <Image
                    src={tool.icon}
                    alt={tool.title}
                    height="48"
                    width="48"
                  />
                  <div className="flex-grow-1 ps-3">
                    <h4>{tool.title}</h4>
                  </div>
                </div>
                <p>{tool.description}</p>
                <Link href={tool.link} className="btn btn-primary">
                  {translation?.know_more || "Know More"}
                </Link>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </section>
  );
};

export default AdviceSection;
