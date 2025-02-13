import Link from 'next/link';
import React from 'react';

const AdviceSection = () => {
  return (
    <section className="section">
      <div className="container-fluid">
        <div className="section-headline text-center">
          <h5>
            <img src="/assets/images/icons/house-sm-1.png" alt="New Project Icon" height="20" width="20" /> New Project
          </h5>
          <h3>Advice &amp; Tools</h3>
          <p>
          Access expert advice and useful tools to guide you through every step of your real estate journey with confidence.
          </p>
        </div>
        <div className="row gx-3">
          <article className="col-lg-3 col-sm-6 col-6">
            <div className="card mb-3">
              <div className="card-body">
                <div className="d-flex align-items-center mb-2">
                  <img src="/assets/images/icons/property-value-1.png" alt="Property Valuation" height="48" width="48" />
                  <div className="flex-grow-1 ps-3">
                    <h4>Property Valuation</h4>
                  </div>
                </div>
                <p>Maecenas gravida, urna non posuere mi efficitur mauris, vulputate soda nunc.</p>
                <Link href="/property-valuation" className="btn btn-primary">Know More</Link>
              </div>
            </div>
          </article>
          <article className="col-lg-3 col-sm-6 col-6">
            <div className="card mb-3">
              <div className="card-body">
                <div className="d-flex align-items-center mb-2">
                  <img src="/assets/images/icons/award.png" alt="Legal Title Check" height="48" width="48" />
                  <div className="flex-grow-1 ps-3">
                    <h4>Legal Title Check</h4>
                  </div>
                </div>
                <p>Maecenas gravida, urna non posuere mi efficitur mauris, vulputate soda nunc.</p>
                <a className="btn btn-primary">Know More</a>
              </div>
            </div>
          </article>
          <article className="col-lg-3 col-sm-6 col-6">
            <div className="card mb-3">
              <div className="card-body">
                <div className="d-flex align-items-center mb-2">
                  <img src="/assets/images/icons/interest.png" alt="Rates &amp; Trends" height="48" width="48" />
                  <div className="flex-grow-1 ps-3">
                    <h4>Rates &amp; Trends</h4>
                  </div>
                </div>
                <p>Maecenas gravida, urna non posuere mi efficitur mauris, vulputate soda nunc.</p>
                <a className="btn btn-primary">Know More</a>
              </div>
            </div>
          </article>
          <article className="col-lg-3 col-sm-6 col-6">
            <div className="card mb-3">
              <div className="card-body">
                <div className="d-flex align-items-center mb-2">
                  <img src="/assets/images/icons/emi-calculator.png" alt="EMI Calculator" height="48" width="48" />
                  <div className="flex-grow-1 ps-3">
                    <h4>EMI Calculator</h4>
                  </div>
                </div>
                <p>Maecenas gravida, urna non posuere mi efficitur mauris, vulputate soda nunc.</p>
                <a className="btn btn-primary">Know More</a>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};

export default AdviceSection;
