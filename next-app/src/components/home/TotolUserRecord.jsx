import React from 'react';

const TotolUserRecord = () => {
  return (
    <section className="section">
      <div className="container">
        <div className="row">
          <article className="col-md-3 col-sm-3 col-6">
            <div className="facts">
              <img src="/assets/images/icons/sale.png" alt="For Sale" height="48" width="48" className="mb-2" />
              <h2>25,000</h2>
              <h4>For Sale</h4>
            </div>
          </article>
          <article className="col-md-3 col-sm-3 col-6">
            <div className="facts">
              <img src="/assets/images/icons/rent-2.png" alt="For Rent" height="48" width="48" className="mb-2" />
              <h2>50,000</h2>
              <h4>For Rent</h4>
            </div>
          </article>
          <article className="col-md-3 col-sm-3 col-6">
            <div className="facts">
              <img src="/assets/images/icons/land.png" alt="Land/Plots" height="48" width="48" className="mb-2" />
              <h2>10,000</h2>
              <h4>Land/Plots</h4>
            </div>
          </article>
          <article className="col-md-3 col-sm-3 col-6">
            <div className="facts">
              <img src="/assets/images/icons/commercial.png" alt="Commercial" height="48" width="48" className="mb-2" />
              <h2>5,000</h2>
              <h4>Commercial</h4>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};

export default TotolUserRecord;
