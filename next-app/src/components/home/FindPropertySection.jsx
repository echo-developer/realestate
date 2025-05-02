"use client"
import React, { useState, useEffect } from "react";
import PropertyRequirementForm from "./PropertyRequirementForm";
import Aos from "aos";
import "aos/dist/aos.css";

const FindPropertySection = ({translation}) => { 
 
  useEffect(() => {
    Aos.init({duration: 700});
    Aos.refresh();
  }, [])


  return (
    <>
    <section
      className="section post-req"
      style={{ backgroundImage: "url('assets/images/building.jpg')" }}
    >
      <div className="container-fluid position-relative">
        <div className="section-headline text-center text-white">
          <h3 className="text-white">{translation?.find_perfect_property || "Find Your Perfect Property!"}</h3>
          <p>
          {translation?.real_estate_marketplace_intro || "At [Real Estate Marketplace Name], we’re dedicated to helping you find your perfect property. Fill out the form below."}
          </p>
        </div>
        <div className="row align-items-center">
          <aside className="col-lg-6 col-12 d-none d-lg-block">
            <div className="row justify-content-center align-items-center mb-4">
              <article className="col-lg col-sm-6 col-12" data-aos="fade-right">
                <div className="post-info text-center">
                  <h3>01</h3>
                  <img
                    src="/assets/images/icons/icon-search.png"
                    alt="Search and Explore"
                    height="48"
                    width="48"
                    className="mb-2"
                    loading="lazy"
                  />
                  <h4>{translation?.search_and_explore || "Search and Explore"}</h4>
                  <p>{translation?.discover_wide_range || "Discover a Wide Range of Properties"}</p>
                </div>
              </article>
              <article className="col-auto text-center">
                <div className="arrowDir">
                  <img
                    src="/assets/images/icons/icon-direction.png"
                    alt="Arrow Direction"
                    height="34"
                    width="58"
                    loading="lazy"
                  />
                </div>
              </article>
              <article className="col-lg col-sm-6 col-12" data-aos="fade-down">
                <div className="post-info text-center">
                  <h3>02</h3>
                  <img
                    src="/assets/images/icons/icon-file-transfer.png"
                    alt="Evaluate and Compare"
                    height="48"
                    width="48"
                    className="mb-2"
                    loading="lazy"
                  />
                  <h4>{translation?.evaluate_and_compare || "Evaluate and Compare"}</h4>
                  <p>{translation?.compare_properties || "Compare Properties to Find the Best Fit"}</p>
                </div>
              </article>
            </div>

            <div className="row justify-content-center align-items-center mb-4">
              <article className="col-lg col-sm-6 col-12"></article>
              <article className="col-auto text-center"></article>
              <article className="col-lg col-sm-6 col-12 text-center">
                <div className="arrowDir">
                  <img
                    src="/assets/images/icons/icon-direction.png"
                    alt="Arrow Direction"
                    height="34"
                    width="58"
                    style={{ transform: "rotate(90deg)" }}
                    loading="lazy"
                  />
                </div>
              </article>
            </div>

            <div className="row justify-content-center align-items-center">
              <article className="col-lg col-sm-6 col-12" data-aos="fade-right">
                <div className="post-info text-center">
                  <h3>04</h3>
                  <img
                    src="/assets/images/icons/icon-share.png"
                    alt="Make Your Move"
                    height="48"
                    width="48"
                    className="mb-2"
                    loading="lazy"
                  />
                  <h4>{translation?.make_your_move || "Make Your Move"}</h4>
                  <p>{translation?.final_steps_dream_property || "Take the Final Steps Toward Your Dream Property"}</p>
                </div>
              </article>
              <article className="col-auto text-center">
                <div className="arrowDir">
                  <img
                    src="/assets/images/icons/icon-direction.png"
                    alt="Arrow Direction"
                    height="34"
                    width="58"
                    style={{ transform: "rotate(180deg)" }}
                    loading="lazy"
                  />
                </div>
              </article>
              <article className="col-lg col-sm-6 col-12" data-aos="fade-up">
                <div className="post-info text-center">
                  <h3>03</h3>
                  <img
                    src="/assets/images/icons/icon-startup.png"
                    alt="Connect with Experts"
                    height="48"
                    width="48"
                    className="mb-2"
                    loading="lazy"
                  />
                  <h4>{translation?.connect_with_experts || "Connect with Experts"}</h4>
                  <p>{translation?.professional_guidance || "Get Professional Guidance Every Step of the Way"}</p>
                </div>
              </article>
            </div>
          </aside>

          <PropertyRequirementForm/>
        </div>
      </div>
    </section>
    </>
  );
};

export default FindPropertySection;
