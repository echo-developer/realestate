"use client"
import React, {useState, useEffect} from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import AuthUser from '../Authentication/AuthUser';

const Testimonials = ({translation}) => {

  const { callApi } = AuthUser();
  const [isMobile, setIsMobile] = useState(false);
  const [testimonialData, setTestimonialData] = useState([]);

  const checkMobileView = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  useEffect(() => {
    checkMobileView(); 
    window.addEventListener('resize', checkMobileView);

    return () => {
      window.removeEventListener('resize', checkMobileView);
    };
  }, []);

  const responsive = {
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 3, slidesToSlide: 1 },
    tablet: { breakpoint: { max: 1024, min: 768 }, items: 2, slidesToSlide: 1 },
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
        <div className="section-headline text-white mb-4">
          <h2 className="text-white">{translation?.take_a_look_what_our_client_say || "Take A Look What Our Client Say"}</h2>
          <p>{translation?.clients_testimonials_description || "See what our clients are saying about their experiences, highlighting trust, satisfaction, and our commitment to exceptional service."}</p>
        </div>
        <div className="bg-box">                    
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
            itemClass="px-3 mb-3"
          >
            {testimonialData?.map((testimonial, index) => (
              <div key={index} className="card">
                <div className="quote">
                  <img src="/assets/images/icons/quote.png" alt="Quote" height="64" width="64" loading="lazy"/>
                </div>
                <div className="card-body">
                  <div className="card-image text-center mb-3">
                    <img
                      src={testimonial?.image || "/assets/images/user.jpg"}
                      alt="Feedback"
                      height="120"
                      width="120"
                      className="rounded-circle"
                      loading="lazy"
                    />
                  </div>                    
                  <p>{testimonial?.description}</p>
                  <h4>{testimonial?.name}</h4>
                  <p className="small">{testimonial?.designation}</p>
                </div>
              </div>
            ))}
          </Carousel>
          
          )}
          {testimonialData?.length === 0 && (
            <h2 style={{color: 'white', textAlign: 'center', fontSize: '16px' }}>
              {translation?.no_testimonials_available || "No Testimonials Available."}<br /> {translation?.be_first_to_share_experience || "Be the first to share your experience!."}
            </h2>
          )}
            
        </div>
      </div>

    </section>
  );
};

export default Testimonials;