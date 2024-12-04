import React from 'react';

const Feedback = () => {
  const testimonials = [
    {
      image: 'assets/images/testimonials/582129be14795.jpg',
      name: 'Michell',
      role: 'Apartment Buyer',
      feedback: 'Maecenas gravida, urna non posuere porttitor, elit mi effici mauris, vulputate sodales est augue vel nunc.'
    },
  ];

  return (
    <section className="section feedback">
      <div className="container">
        <div className="bg-box">
          <div className="quote">
            <img src="assets/images/icons/quote.png" alt="Quote" height="72" width="72" />
          </div>
          <div className="row gx-lg-5 align-items-center justify-content-between">
            <aside className="col-lg-4 col-12">
              <div className="section-headline text-white">
                <h2 className="text-white">Take A Look What Our Client Say</h2>
                <p>Morbi lacinia turpis justo, ac dapibus nisi auctor rutrum. Nullam dignissim eleifend aliquam. Praesent a cursus libero.</p>
              </div>
            </aside>
            <aside className="col-lg-7 col-12">
              <div className="owl-carousel owl-theme owl-carousel-feedback owl-loaded owl-drag">
                <div className="owl-stage-outer">
                  <div className="owl-stage">
                    {testimonials.map((testimonial, index) => (
                      <div key={index} className="owl-item" style={{ width: '344px', marginRight: '20px' }}>
                        <article className="item">
                          <div className="card">
                            <div className="card-image">
                              <img src={testimonial.image} alt="Feedback" height="200" width="347" className="card-img-top" />
                            </div>
                            <div className="card-body">
                              <p>{testimonial.feedback}</p>
                              <h4>{testimonial.name}</h4>
                              <p className="small">{testimonial.role}</p>
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
                <div className="owl-dots">
                  <button role="button" className="owl-dot active">
                    <span></span>
                  </button>
                  <button role="button" className="owl-dot">
                    <span></span>
                  </button>
                  <button role="button" className="owl-dot">
                    <span></span>
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Feedback;
