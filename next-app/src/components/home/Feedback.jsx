import React, {useState, useEffect} from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import AuthUser from '../Authentication/AuthUser';

const Feedback = () => {
  const { callApi } = AuthUser();
  const [isMobile, setIsMobile] = useState(false);
  const [testimonialData, setTestimonialData] = useState([]);

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
  const testimonials =  [
    {
        "id": 1,
        "image": "http://localhost/realestate/hackground/public/user_upload/testimonial_image/1738678031-67.jpg",
        "name": "Mark Dowson",
        "designation": "Project Manager",
        "description": "OriginateSoft has been amazing to work with. Their team delivered high-quality software solutions on time, with great attention to detail and a customer-first approach. We highly recommend them for anyone seeking top-notch software development."
    },
    {
        "id": 2,
        "image": "http://localhost/realestate/hackground/public/user_upload/testimonial_image/1738739270-download (3).jfif",
        "name": "John Smith",
        "designation": "CEO",
        "description": "OriginateSoft exceeded our expectations. They delivered top-tier software solutions that significantly improved our operations. The team is professional, responsive, and truly understands client needs. Highly recommended"
    },
    {
        "id": 3,
        "image": "http://localhost/realestate/hackground/public/user_upload/testimonial_image/1738737803-67.jpg",
        "name": "Emily Brown",
        "designation": "Marketing Director",
        "description": "We’ve been working with OriginateSoft for over a year, and their support has been outstanding. From web development to mobile apps, they consistently provide us with innovative"
    }
]

  const responsive = {
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 1, slidesToSlide: 1 },
    tablet: { breakpoint: { max: 1024, min: 768 }, items: 1, slidesToSlide: 1 },
    mobile: { breakpoint: { max: 768, min: 0 }, items: 1, slidesToSlide: 1 },
  };


  const getTestimonials = async () => {
    try {
      const res = await callApi({
        api: "/get_testimonial_list",
        method: "GET"
      })

      if(res && res?.status === 1) {
        setTestimonialData(res?.data || []);
      }
    } catch (error) {
      console.error(error?.message || "Something went Wrong")
    }
  }

  useEffect(() => {
    getTestimonials();
  }, [])

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
              {testimonialData?.length > 0 && (
                <Carousel
                responsive={responsive}
                swipeable={true}
                draggable={true}
                showDots={isMobile ? true : false} 
                arrows={isMobile ? false : true}  
                infinite={true}
                keyBoardControl={true}
                containerClass="carousel-container"
                itemClass="carousel-item-padding"
              >
                {testimonialData?.map((testimonial, index) => (
                  <div
                    key={index}
                    className="card"
                    style={{
                      width: '350px', 
                      margin: '0 auto', 
                    }}
                  >
                    <div className="card-image">
                      <img
                        src={testimonial?.image || "/assets/images/user.jpg"}
                        alt="Feedback"
                        height="200"
                        width="347"
                        className="card-img-top"
                      />
                    </div>
                    <div className="card-body">
                      <p>{testimonial?.description}</p>
                      <h4>{testimonial?.name}</h4>
                      <p className="small">{testimonial?.designation}</p>
                    </div>
                  </div>
                ))}
                {/* {testimonialData?.map((testimonia))} */}
              </Carousel>
              )}
              {testimonialData?.length === 0 && (
                <h2 style={{ fontFamily: 'Arial, sans-serif', color: 'white', textAlign: 'center', fontSize: '16px' }}>
                  No Testimonials Available.<br />Be the first to share your experience!
                </h2>
              )}
            </aside>
          </div>
        </div>
      </div>

    </section>
  );
};

export default Feedback;
