import React, {useState, useEffect} from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

const Feedback = () => {
  const [isMobile, setIsMobile] = useState(false);

  // Check if the current screen is mobile (width <= 768px)
  const checkMobileView = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  // Set up event listener for resizing the window
  useEffect(() => {
    checkMobileView(); // Check on mount
    window.addEventListener('resize', checkMobileView);

    // Clean up event listener on unmount
    return () => {
      window.removeEventListener('resize', checkMobileView);
    };
  }, []);
  const testimonials = [
    {
      image: 'assets/images/testimonials/582129be14795.jpg',
      name: 'Michell',
      role: 'Apartment Buyer',
      feedback: 'Maecenas gravida, urna non posuere porttitor, elit mi effici mauris, vulputate sodales est augue vel nunc.'
    },
    {
      image: 'assets/images/testimonials/582129be14795.jpg',
      name: 'John',
      role: 'Home Seller',
      feedback: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tristique venenatis lorem.'
    },
    // Add more testimonials as needed
  ];

  const responsive = {
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 1, slidesToSlide: 1 },
    tablet: { breakpoint: { max: 1024, min: 768 }, items: 1, slidesToSlide: 1 },
    mobile: { breakpoint: { max: 768, min: 0 }, items: 1, slidesToSlide: 1 },
  };

  return (
    <section className="section feedback">
      <div className="container">
        <div className="bg-box">
          <div className="quote">
            <img src="/assets/images/icons/quote.png" alt="Quote" height="72" width="72" />
          </div>
          <div className="row gx-lg-5 align-items-center justify-content-between">
            <aside className="col-lg-4 col-12">
              <div className="section-headline text-white">
                <h2 className="text-white">Take A Look What Our Client Say</h2>
                <p>Morbi lacinia turpis justo, ac dapibus nisi auctor rutrum. Nullam dignissim eleifend aliquam. Praesent a cursus libero.</p>
              </div>
            </aside>
            <aside className="col-lg-7 col-12">
              <Carousel
                responsive={responsive}
                swipeable={true}
                draggable={true}
                showDots={isMobile ? true : false}  // Enable dots on all screens
                arrows={isMobile ? false : true}  // Enable arrows
                infinite={true}
                keyBoardControl={true}
                containerClass="carousel-container"
                itemClass="carousel-item-padding"
              >
                {testimonials.map((testimonial, index) => (
                  <div
                    key={index}
                    className="card"
                    style={{
                      width: '350px',  // Reduced the card width
                      margin: '0 auto', // Center the card
                    }}
                  >
                    <div className="card-image">
                      <img
                        src={testimonial.image}
                        alt="Feedback"
                        height="200"
                        width="347"
                        className="card-img-top"
                      />
                    </div>
                    <div className="card-body">
                      <p>{testimonial.feedback}</p>
                      <h4>{testimonial.name}</h4>
                      <p className="small">{testimonial.role}</p>
                    </div>
                  </div>
                ))}
              </Carousel>
            </aside>
          </div>
        </div>
      </div>

    </section>
  );
};

export default Feedback;
