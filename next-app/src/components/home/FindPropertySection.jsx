import React from "react";
import PropertyRequirementForm from "./PropertyRequirementForm";

const FindPropertySection = () => {

  

  return (
    <section
      className="section post-req"
      style={{ backgroundImage: "url('assets/images/building.jpg')" }}
    >
      <div className="container-fluid position-relative">
        <div className="section-headline text-center text-white">
          <h3 className="text-white">Find Your Perfect Property!</h3>
          <p>
            At [Real Estate Marketplace Name], we’re here to help you find the
            property that perfectly matches your requirements. Fill out the form
            below to let us know what you're looking for, and we’ll do the rest.
          </p>
        </div>
        <div className="row align-items-center">
          <aside className="col-lg-6 col-12">
            <div className="row justify-content-center align-items-center mb-4">
              <article className="col-lg col-sm-6 col-12">
                <div className="post-info text-center">
                  <h3>01</h3>
                  <img
                    src="assets/images/icons/icon-search.png"
                    alt="Search and Explore"
                    height="48"
                    width="48"
                    className="mb-2"
                  />
                  <h4>Search and Explore</h4>
                  <p>Discover a Wide Range of Properties</p>
                </div>
              </article>
              <article className="col-auto text-center">
                <img
                  src="assets/images/icons/icon-direction.png"
                  alt="Arrow Direction"
                  height="34"
                  width="58"
                />
              </article>
              <article className="col-lg col-sm-6 col-12">
                <div className="post-info text-center">
                  <h3>02</h3>
                  <img
                    src="assets/images/icons/icon-file-transfer.png"
                    alt="Evaluate and Compare"
                    height="48"
                    width="48"
                    className="mb-2"
                  />
                  <h4>Evaluate and Compare</h4>
                  <p>Compare Properties to Find the Best Fit</p>
                </div>
              </article>
            </div>

            <div className="row justify-content-center align-items-center mb-4">
              <article className="col-lg-auto text-center">
                <img
                  src="assets/images/icons/dream.png"
                  alt="Dream"
                  height="163"
                  width="163"
                />
              </article>
              <article className="col-lg-auto text-center">
                <img
                  src="assets/images/icons/icon-direction.png"
                  alt="Arrow Direction"
                  height="34"
                  width="58"
                  style={{ transform: "rotate(90deg)" }}
                />
              </article>
            </div>

            <div className="row justify-content-center align-items-center">
              <article className="col-lg col-sm-6 col-12">
                <div className="post-info text-center">
                  <h3>04</h3>
                  <img
                    src="assets/images/icons/icon-share.png"
                    alt="Make Your Move"
                    height="48"
                    width="48"
                    className="mb-2"
                  />
                  <h4>Make Your Move</h4>
                  <p>Take the Final Steps Toward Your Dream Property</p>
                </div>
              </article>
              <article className="col-auto text-center">
                <img
                  src="assets/images/icons/icon-direction.png"
                  alt="Arrow Direction"
                  height="34"
                  width="58"
                  style={{ transform: "rotate(180deg)" }}
                />
              </article>
              <article className="col-lg col-sm-6 col-12">
                <div className="post-info text-center">
                  <h3>03</h3>
                  <img
                    src="assets/images/icons/icon-startup.png"
                    alt="Connect with Experts"
                    height="48"
                    width="48"
                    className="mb-2"
                  />
                  <h4>Connect with Experts</h4>
                  <p>Get Professional Guidance Every Step of the Way</p>
                </div>
              </article>
            </div>
          </aside>

          <PropertyRequirementForm/>
        </div>
      </div>
    </section>
  );
};

export default FindPropertySection;
