import React, {useState, useEffect} from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import AuthUser from '../Authentication/AuthUser';
import useTranslation from '../../hooks/useTranslation'


const Feedback = () => {
  const translation = useTranslation();

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

  const responsive = {
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 2, slidesToSlide: 1 },
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
                <h2 className="text-white">{translation?.take_a_look_what_our_client_say || "Take A Look What Our Client Say"}</h2>
                <p>{translation?.clients_testimonials_description || "Read what our clients have to say about their experiences, showcasing trust, satisfaction, and exceptional service."}</p>
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
                itemClass="px-2"
              >
                {testimonialData?.map((testimonial, index) => (
                  <div
                    key={index}
                    className="card"
                  >
                    <div className="card-image">
                      <img
                        src={testimonial?.image || "/assets/images/user.jpg"}
                        alt="Feedback"
                        height="200"
                        width="300"
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
                <h2 style={{color: 'white', textAlign: 'center', fontSize: '16px' }}>
                  {translation?.no_testimonials_available || "No Testimonials Available."}<br /> {translation?.be_first_to_share_experience || "Be the first to share your experience!."}
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
