"use client"
import React, { useState, useEffect } from 'react'
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "./normalSlide.css";
import CardImageSlider from '../cardImageSlider/CardImageSlider'
import Link from 'next/link';
const randomData = [
    {
        "property_id": 6,
        "user": "Bappaditya sing",
        "property_size": 0,
        "property_name": "Residential House FOR Rent",
        "slug": "Residential-House-FOR-Rent&id=362D362D52656E74",
        "views": 7,
        "is_featured": 1,
        "is_populer": 0,
        "is_top": 1,
        "parking_ability": null,
        "property_type_for": "Residential House",
        "bedrooms": null,
        "bathroom": null,
        "price": "EURO 434",
        "created_at": "2025-01-24 12:05:55",
        "address": "dfdfd",
        "galleries": [
            {
                "gallery": "exterior",
                "images": [
                    {
                        "image_id": 86,
                        "image_name": "1737700549-Screenshot (7).png",
                        "image_url": "http://localhost/realestate/hackground/public/user_upload/property_images/1737700549-Screenshot (7).png",
                        "caption": null
                    },
                    {
                        "image_id": 107,
                        "image_name": "1737710964-Screenshot (14).png",
                        "image_url": "http://localhost/realestate/hackground/public/user_upload/property_images/1737710964-Screenshot (14).png",
                        "caption": "ldjfldjfll"
                    },
                    {
                        "image_id": 109,
                        "image_name": "1737711781-Screenshot (7).png",
                        "image_url": "http://localhost/realestate/hackground/public/user_upload/property_images/1737711781-Screenshot (7).png",
                        "caption": null
                    },
                    {
                        "image_id": 110,
                        "image_name": "1737711835-Screenshot (1) - Copy.png",
                        "image_url": "http://localhost/realestate/hackground/public/user_upload/property_images/1737711835-Screenshot (1) - Copy.png",
                        "caption": null
                    }
                ]
            }
        ]
    },
    {
        "property_id": 6,
        "user": "Bappaditya sing",
        "property_size": 0,
        "property_name": "Residential House FOR Rent",
        "slug": "Residential-House-FOR-Rent&id=362D362D52656E74",
        "views": 7,
        "is_featured": 1,
        "is_populer": 0,
        "is_top": 1,
        "parking_ability": null,
        "property_type_for": "Residential House",
        "bedrooms": null,
        "bathroom": null,
        "price": "EURO 434",
        "created_at": "2025-01-24 12:05:55",
        "address": "dfdfd",
        "galleries": [
            {
                "gallery": "exterior",
                "images": [
                    {
                        "image_id": 86,
                        "image_name": "1737700549-Screenshot (7).png",
                        "image_url": "http://localhost/realestate/hackground/public/user_upload/property_images/1737700549-Screenshot (7).png",
                        "caption": null
                    },
                    {
                        "image_id": 107,
                        "image_name": "1737710964-Screenshot (14).png",
                        "image_url": "http://localhost/realestate/hackground/public/user_upload/property_images/1737710964-Screenshot (14).png",
                        "caption": "ldjfldjfll"
                    },
                    {
                        "image_id": 109,
                        "image_name": "1737711781-Screenshot (7).png",
                        "image_url": "http://localhost/realestate/hackground/public/user_upload/property_images/1737711781-Screenshot (7).png",
                        "caption": null
                    },
                    {
                        "image_id": 110,
                        "image_name": "1737711835-Screenshot (1) - Copy.png",
                        "image_url": "http://localhost/realestate/hackground/public/user_upload/property_images/1737711835-Screenshot (1) - Copy.png",
                        "caption": null
                    }
                ]
            }
        ]
    },
    {
        "property_id": 6,
        "user": "Bappaditya sing",
        "property_size": 0,
        "property_name": "Residential House FOR Rent",
        "slug": "Residential-House-FOR-Rent&id=362D362D52656E74",
        "views": 7,
        "is_featured": 1,
        "is_populer": 0,
        "is_top": 1,
        "parking_ability": null,
        "property_type_for": "Residential House",
        "bedrooms": null,
        "bathroom": null,
        "price": "EURO 434",
        "created_at": "2025-01-24 12:05:55",
        "address": "dfdfd",
        "galleries": [
            {
                "gallery": "exterior",
                "images": [
                    {
                        "image_id": 86,
                        "image_name": "1737700549-Screenshot (7).png",
                        "image_url": "http://localhost/realestate/hackground/public/user_upload/property_images/1737700549-Screenshot (7).png",
                        "caption": null
                    },
                    {
                        "image_id": 107,
                        "image_name": "1737710964-Screenshot (14).png",
                        "image_url": "http://localhost/realestate/hackground/public/user_upload/property_images/1737710964-Screenshot (14).png",
                        "caption": "ldjfldjfll"
                    },
                    {
                        "image_id": 109,
                        "image_name": "1737711781-Screenshot (7).png",
                        "image_url": "http://localhost/realestate/hackground/public/user_upload/property_images/1737711781-Screenshot (7).png",
                        "caption": null
                    },
                    {
                        "image_id": 110,
                        "image_name": "1737711835-Screenshot (1) - Copy.png",
                        "image_url": "http://localhost/realestate/hackground/public/user_upload/property_images/1737711835-Screenshot (1) - Copy.png",
                        "caption": null
                    }
                ]
            }
        ]
    },
    {
        "property_id": 6,
        "user": "Bappaditya sing",
        "property_size": 0,
        "property_name": "Residential House FOR Rent",
        "slug": "Residential-House-FOR-Rent&id=362D362D52656E74",
        "views": 7,
        "is_featured": 1,
        "is_populer": 0,
        "is_top": 1,
        "parking_ability": null,
        "property_type_for": "Residential House",
        "bedrooms": null,
        "bathroom": null,
        "price": "EURO 434",
        "created_at": "2025-01-24 12:05:55",
        "address": "dfdfd",
        "galleries": [
            {
                "gallery": "exterior",
                "images": [
                    {
                        "image_id": 86,
                        "image_name": "1737700549-Screenshot (7).png",
                        "image_url": "http://localhost/realestate/hackground/public/user_upload/property_images/1737700549-Screenshot (7).png",
                        "caption": null
                    },
                    {
                        "image_id": 107,
                        "image_name": "1737710964-Screenshot (14).png",
                        "image_url": "http://localhost/realestate/hackground/public/user_upload/property_images/1737710964-Screenshot (14).png",
                        "caption": "ldjfldjfll"
                    },
                    {
                        "image_id": 109,
                        "image_name": "1737711781-Screenshot (7).png",
                        "image_url": "http://localhost/realestate/hackground/public/user_upload/property_images/1737711781-Screenshot (7).png",
                        "caption": null
                    },
                    {
                        "image_id": 110,
                        "image_name": "1737711835-Screenshot (1) - Copy.png",
                        "image_url": "http://localhost/realestate/hackground/public/user_upload/property_images/1737711835-Screenshot (1) - Copy.png",
                        "caption": null
                    }
                ]
            }
        ]
    },
    {
        "property_id": 6,
        "user": "Bappaditya sing",
        "property_size": 0,
        "property_name": "Residential House FOR Rent",
        "slug": "Residential-House-FOR-Rent&id=362D362D52656E74",
        "views": 7,
        "is_featured": 1,
        "is_populer": 0,
        "is_top": 1,
        "parking_ability": null,
        "property_type_for": "Residential House",
        "bedrooms": null,
        "bathroom": null,
        "price": "EURO 434",
        "created_at": "2025-01-24 12:05:55",
        "address": "dfdfd",
        "galleries": [
            {
                "gallery": "exterior",
                "images": [
                    {
                        "image_id": 86,
                        "image_name": "1737700549-Screenshot (7).png",
                        "image_url": "http://localhost/realestate/hackground/public/user_upload/property_images/1737700549-Screenshot (7).png",
                        "caption": null
                    },
                    {
                        "image_id": 107,
                        "image_name": "1737710964-Screenshot (14).png",
                        "image_url": "http://localhost/realestate/hackground/public/user_upload/property_images/1737710964-Screenshot (14).png",
                        "caption": "ldjfldjfll"
                    },
                    {
                        "image_id": 109,
                        "image_name": "1737711781-Screenshot (7).png",
                        "image_url": "http://localhost/realestate/hackground/public/user_upload/property_images/1737711781-Screenshot (7).png",
                        "caption": null
                    },
                    {
                        "image_id": 110,
                        "image_name": "1737711835-Screenshot (1) - Copy.png",
                        "image_url": "http://localhost/realestate/hackground/public/user_upload/property_images/1737711835-Screenshot (1) - Copy.png",
                        "caption": null
                    }
                ]
            }
        ]
    },
    {
        "property_id": 6,
        "user": "Bappaditya sing",
        "property_size": 0,
        "property_name": "Residential House FOR Rent",
        "slug": "Residential-House-FOR-Rent&id=362D362D52656E74",
        "views": 7,
        "is_featured": 1,
        "is_populer": 0,
        "is_top": 1,
        "parking_ability": null,
        "property_type_for": "Residential House",
        "bedrooms": null,
        "bathroom": null,
        "price": "EURO 434",
        "created_at": "2025-01-24 12:05:55",
        "address": "dfdfd",
        "galleries": [
            {
                "gallery": "exterior",
                "images": [
                    {
                        "image_id": 86,
                        "image_name": "1737700549-Screenshot (7).png",
                        "image_url": "http://localhost/realestate/hackground/public/user_upload/property_images/1737700549-Screenshot (7).png",
                        "caption": null
                    },
                    {
                        "image_id": 107,
                        "image_name": "1737710964-Screenshot (14).png",
                        "image_url": "http://localhost/realestate/hackground/public/user_upload/property_images/1737710964-Screenshot (14).png",
                        "caption": "ldjfldjfll"
                    },
                    {
                        "image_id": 109,
                        "image_name": "1737711781-Screenshot (7).png",
                        "image_url": "http://localhost/realestate/hackground/public/user_upload/property_images/1737711781-Screenshot (7).png",
                        "caption": null
                    },
                    {
                        "image_id": 110,
                        "image_name": "1737711835-Screenshot (1) - Copy.png",
                        "image_url": "http://localhost/realestate/hackground/public/user_upload/property_images/1737711835-Screenshot (1) - Copy.png",
                        "caption": null
                    }
                ]
            }
        ]
    },
    {
        "property_id": 6,
        "user": "Bappaditya sing",
        "property_size": 0,
        "property_name": "Residential House FOR Rent",
        "slug": "Residential-House-FOR-Rent&id=362D362D52656E74",
        "views": 7,
        "is_featured": 1,
        "is_populer": 0,
        "is_top": 1,
        "parking_ability": null,
        "property_type_for": "Residential House",
        "bedrooms": null,
        "bathroom": null,
        "price": "EURO 434",
        "created_at": "2025-01-24 12:05:55",
        "address": "dfdfd",
        "galleries": [
            {
                "gallery": "exterior",
                "images": [
                    {
                        "image_id": 86,
                        "image_name": "1737700549-Screenshot (7).png",
                        "image_url": "http://localhost/realestate/hackground/public/user_upload/property_images/1737700549-Screenshot (7).png",
                        "caption": null
                    },
                    {
                        "image_id": 107,
                        "image_name": "1737710964-Screenshot (14).png",
                        "image_url": "http://localhost/realestate/hackground/public/user_upload/property_images/1737710964-Screenshot (14).png",
                        "caption": "ldjfldjfll"
                    },
                    {
                        "image_id": 109,
                        "image_name": "1737711781-Screenshot (7).png",
                        "image_url": "http://localhost/realestate/hackground/public/user_upload/property_images/1737711781-Screenshot (7).png",
                        "caption": null
                    },
                    {
                        "image_id": 110,
                        "image_name": "1737711835-Screenshot (1) - Copy.png",
                        "image_url": "http://localhost/realestate/hackground/public/user_upload/property_images/1737711835-Screenshot (1) - Copy.png",
                        "caption": null
                    }
                ]
            }
        ]
    },
    {
        "property_id": 6,
        "user": "Bappaditya sing",
        "property_size": 0,
        "property_name": "Residential House FOR Rent",
        "slug": "Residential-House-FOR-Rent&id=362D362D52656E74",
        "views": 7,
        "is_featured": 1,
        "is_populer": 0,
        "is_top": 1,
        "parking_ability": null,
        "property_type_for": "Residential House",
        "bedrooms": null,
        "bathroom": null,
        "price": "EURO 434",
        "created_at": "2025-01-24 12:05:55",
        "address": "dfdfd",
        "galleries": [
            {
                "gallery": "exterior",
                "images": [
                    {
                        "image_id": 86,
                        "image_name": "1737700549-Screenshot (7).png",
                        "image_url": "http://localhost/realestate/hackground/public/user_upload/property_images/1737700549-Screenshot (7).png",
                        "caption": null
                    },
                    {
                        "image_id": 107,
                        "image_name": "1737710964-Screenshot (14).png",
                        "image_url": "http://localhost/realestate/hackground/public/user_upload/property_images/1737710964-Screenshot (14).png",
                        "caption": "ldjfldjfll"
                    },
                    {
                        "image_id": 109,
                        "image_name": "1737711781-Screenshot (7).png",
                        "image_url": "http://localhost/realestate/hackground/public/user_upload/property_images/1737711781-Screenshot (7).png",
                        "caption": null
                    },
                    {
                        "image_id": 110,
                        "image_name": "1737711835-Screenshot (1) - Copy.png",
                        "image_url": "http://localhost/realestate/hackground/public/user_upload/property_images/1737711835-Screenshot (1) - Copy.png",
                        "caption": null
                    }
                ]
            }
        ]
    },
    {
        "property_id": 6,
        "user": "Bappaditya sing",
        "property_size": 0,
        "property_name": "Residential House FOR Rent",
        "slug": "Residential-House-FOR-Rent&id=362D362D52656E74",
        "views": 7,
        "is_featured": 1,
        "is_populer": 0,
        "is_top": 1,
        "parking_ability": null,
        "property_type_for": "Residential House",
        "bedrooms": null,
        "bathroom": null,
        "price": "EURO 434",
        "created_at": "2025-01-24 12:05:55",
        "address": "dfdfd",
        "galleries": [
            {
                "gallery": "exterior",
                "images": [
                    {
                        "image_id": 86,
                        "image_name": "1737700549-Screenshot (7).png",
                        "image_url": "http://localhost/realestate/hackground/public/user_upload/property_images/1737700549-Screenshot (7).png",
                        "caption": null
                    },
                    {
                        "image_id": 107,
                        "image_name": "1737710964-Screenshot (14).png",
                        "image_url": "http://localhost/realestate/hackground/public/user_upload/property_images/1737710964-Screenshot (14).png",
                        "caption": "ldjfldjfll"
                    },
                    {
                        "image_id": 109,
                        "image_name": "1737711781-Screenshot (7).png",
                        "image_url": "http://localhost/realestate/hackground/public/user_upload/property_images/1737711781-Screenshot (7).png",
                        "caption": null
                    },
                    {
                        "image_id": 110,
                        "image_name": "1737711835-Screenshot (1) - Copy.png",
                        "image_url": "http://localhost/realestate/hackground/public/user_upload/property_images/1737711835-Screenshot (1) - Copy.png",
                        "caption": null
                    }
                ]
            }
        ]
    },
]

const MainSlider = ({ data, title, miniTitle, subTitle, logo, type, url }) => {

    const [isMobile, setIsMobile] = useState(false);

    // Check if the current screen is mobile (width <= 768px)
    const checkMobileView = () => {
        setIsMobile(window?.innerWidth <= 768);
    };

    // Set up event listener for resizing the window
    useEffect(() => {
        if (typeof window !== 'undefined') {
            checkMobileView(); // Check on mount
            window.addEventListener('resize', checkMobileView);
    
            // Clean up event listener on unmount
            return () => {
                window.removeEventListener('resize', checkMobileView);
            };
        }
    }, []);

    

    return (
        <>
        {data?.length > 0 && (
            <section className="section pb-0">
            <div className="container-fluid">
                <div className="section-headline text-center">
                    <h5>
                        <img src={logo || "assets/images/icons/house-sm-1.png"} alt="Icon" height="20" width="20" /> {miniTitle}
                    </h5>
                    <h3>{title || "Not available"}</h3>
                    <p>{subTitle || "Not available"}</p>
                </div>
                {type === "card" && (
                    <CardTypeComponent isMobile={isMobile} data={data} url={url} />
                )}
                {type === "normal" && (
                    <NormarTypeComponent isMobile={isMobile} data={data} url={url} />
                )}
                {type === "prject card" && (
                    <ProjectCardComponent isMobile={isMobile} data={data} url={url} />
                )}
                {type === "project galary" && (
                    <NewProjectGalary isMobile={isMobile} data={data} url={url} />
                )}

            </div>
        </section>
        )}
        </>
    )
}

export default MainSlider




// const NormarTypeComponent = ({isMobile, data}) => {
//     const responsive = {
//       desktop: { breakpoint: { max: 3000, min: 1024 }, items: 4, slidesToSlide: 1 },
//       tablet: { breakpoint: { max: 1024, min: 768 }, items: 2, slidesToSlide: 1 },
//       mobile: { breakpoint: { max: 768, min: 0 }, items: 1, slidesToSlide: 1 },
//     };


//     return (
//       <Carousel
//         responsive={responsive}
//         swipeable={true}
//         draggable={true}
//         showDots={isMobile ? true : false}
//         arrows={isMobile ? false : true}
//         infinite={true}
//         keyBoardControl={true}
//         containerClass="carousel-container"
//         itemClass="px-3"
//       >
//         {data?.length > 0 && data?.map((property, i) => (
//           <div key={i} className="card card-ads card-overlay" style={{ backgroundColor: "rgba(0, 0, 0, 0.65)" }}>
//             {/* <div className="card-image">
//               <img alt="" className="card-img" src="assets/images/uploads/6ee9ad0b592712d02a9c315c87812155.jpg" />
//               <span className="ads-type sale">for Sale</span>
//               <span className="ads-fav">
//                 <i className="icon-line-awesome-heart-o"></i>
//               </span>
//             </div> */}
//             <CardImageSlider data={property} />
//             <div className="card-img-overlay">
//               <h4>
//                 <a href="">{property?.property_name || "Not available"}</a>
//               </h4>
//               <ul className="list-info">
//                 <li>
//                   <i className="icon-img-flat"></i> House/Villa
//                 </li>
//                 <li>
//                   <i className="icon-img-room"></i> Rooms: <span>6</span>
//                 </li>
//                 <li>
//                   <i className="icon-img-bed"></i> Bedrooms: <span>4</span>
//                 </li>
//                 <li>
//                   <i className="icon-img-ratio"></i> <span>550</span> sq m
//                 </li>
//                 <li>
//                   <i className="icon-img-tub"></i> Bathrooms: <span>8</span>
//                 </li>
//               </ul>
//               <p className="mb-1">
//                 <i className="icon-feather-map-pin"></i> Mohamed Bin Zayed City, Abu Dhabi, UAE
//               </p>
//               <div className="d-flex align-items-center">
//                 <h4 className="mb-0 flex-grow-1">$36,500</h4>
//                 <a href="" className="btn btn-primary">
//                   Book Now
//                 </a>
//               </div>
//             </div>
//           </div>
//         ))}
//       </Carousel>
//     );
//   };

const NormarTypeComponent = ({isMobile, data, url, handleRouteClick}) => {
    // State to track the current slide index
    const [currentSlide, setCurrentSlide] = useState(0);
    
    // Total number of items in the slider
    const totalItems = 10;

    // Function to move to the next slide
    const goToNextSlide = () => {
        setCurrentSlide((prev) => (prev < totalItems - 1 ? prev + 1 : prev));
    };

    // Function to move to the previous slide
    const goToPrevSlide = () => {
        setCurrentSlide((prev) => (prev > 0 ? prev - 1 : prev));
    };


    return (
        <div className="custom-carousel-container">
            {data?.length > 4 && (
                <div className="carousel-controls">
                <button onClick={goToPrevSlide} className="prev-button">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    </button>
                    <button onClick={goToNextSlide} className="next-button">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    </button>
                </div>
            )}

            <div className="owl-stage-outer">
                <div className="owl-stage" style={{ 
                    transform: `translateX(-${currentSlide * 450}px)`,
                    transition: 'transform 0.5s ease-in-out', 
                    display: 'flex',
                }}>
                    {data?.length > 0 && data?.map((item, i) => {
                        const firstImage = item?.galleries[0]?.images[0]?.image_url;
                        return (
                            <Link key={i} href={`${url}/${item?.slug}`}>
                            <div
                            className="owl-item"
                            style={{
                                width: '430px',
                                marginRight: '20px',
                                flexShrink: 0, 
                            }}
                        >
                            <article className="item">
                                <div
                                    className="card card-ads card-overlay"
                                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.65)' }}
                                >
                                    <div className="card-image" style={{height: "346px"}}>
                                        <img
                                            alt=""
                                            className="card-img"
                                            src={firstImage || `assets/images/uploads/d0d74748da69d1067d797427796723c5.jpg`}
                                            // src="assets/images/uploads/d0d74748da69d1067d797427796723c5.jpg"
                                        />
                                        <span className={`ads-type ${item?.post_for}`}>for {item?.post_for}</span>
                                        <span className="ads-fav">
                                            <i className="icon-line-awesome-heart-o"></i>
                                        </span>
                                    </div>
                                    <div className="card-img-overlay">
                                        <h4>
                                        {item?.property_name || "Not available"}
                                        </h4>
                                        <ul className="list-info">
                                            <li>
                                                <i className="icon-img-flat"></i> House/Villa
                                            </li>
                                            <li>
                                                <i className="icon-img-room"></i> Rooms: <span>6</span>
                                            </li>
                                            <li>
                                                <i className="icon-img-bed"></i> Bedrooms: <span>4</span>
                                            </li>
                                            <li>
                                                <i className="icon-img-ratio"></i> <span>550</span> sq m
                                            </li>
                                            <li>
                                                <i className="icon-img-tub"></i> Bathrooms: <span>8</span>
                                            </li>
                                        </ul>
                                        <p className="mb-1">
                                            <i className="icon-feather-map-pin"></i> Dubai Marina, Dubai, UAE
                                        </p>
                                        <div className="d-flex align-items-center">
                                            <h4 className="mb-0 flex-grow-1">$499</h4>
                                            {/* <a href="" className="btn btn-primary"> */}
                                                Book Now
                                            
                                        </div>
                                    </div>
                                </div>
                            </article>
                        </div>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};
const CardTypeComponent = ({ isMobile, data, url}) => {
    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 1200 },
            items: 4,
        },
        desktop: {
            breakpoint: { max: 1200, min: 992 },
            items: 3,
        },
        tablet: {
            breakpoint: { max: 992, min: 768 },
            items: 2,
        },
        mobile: {
            breakpoint: { max: 768, min: 0 },
            items: 1,
        },
    };



    return (
        <Carousel
            responsive={responsive}
            infinite={false}
            autoPlay={false}
            autoPlaySpeed={3000}
            keyBoardControl={true}
            showDots={isMobile ? true : false}
            arrows={isMobile ? false : true}
            customTransition="all 0.5s"
            transitionDuration={500}
            itemClass="px-3"
        >
            {data?.length > 0 && data?.map((item, i) => (
                
                    <div className="card card-ads"  key={i}>
                    <CardImageSlider data={item} />
                    <div className="card-body">
                        <h4>
                        <Link href={`${url}/${item?.slug}`}>{item?.property_name || "Not available"}</Link>
                        </h4>
                        <p className="mb-1">
                            <i className="icon-feather-map-pin"></i> Al Hamra Village, Ras Al Khaimah, UAE
                        </p>
                        <ul className="list-info">
                            <li><i className="icon-img-flat"></i></li>
                            <li><i className="icon-img-room"></i> Rooms: <span>6</span></li>
                            <li><i className="icon-img-bed"></i> Bedrooms: <span>4</span></li>
                            <li><i className="icon-img-ratio"></i> <span>550</span></li>
                            <li><i className="icon-img-tub"></i> Bathrooms: <span>8</span></li>
                        </ul>
                    </div>
                    <div className="card-footer">
                        <div className="user-details">
                            <div className="user-avatar">
                                <img alt="" height="32" width="32" className="rounded-circle" src="assets/images/agents/agent-7.jpg" />
                            </div>
                            <div className="user-name">
                                <span>Hayat Hamza</span>
                            </div>
                        </div>
                        <span className="ad-post-date ms-3">
                            <i className="icon-feather-calendar"></i> 10 Jan, 2022
                        </span>
                    </div>
                </div>

            ))}
        </Carousel>
    );
};


const ProjectCardComponent = ({ isMobile, data, url }) => {
    const responsive = {
        desktop: { breakpoint: { max: 3000, min: 1024 }, items: 4, slidesToSlide: 1 },
        tablet: { breakpoint: { max: 1024, min: 768 }, items: 2, slidesToSlide: 1 },
        mobile: { breakpoint: { max: 768, min: 0 }, items: 1, slidesToSlide: 1 },
    };



    return (
        <Carousel
            responsive={responsive}
            swipeable={true}
            draggable={true}
            showDots={isMobile ? true : false}
            arrows={isMobile ? false : true}
            infinite={false}
            keyBoardControl={true}
            itemClass="px-3"
            containerClass="carousel-container"
        >
            {data?.length > 0 && data?.map((project, i) => (
                
                    <div className="card card-ads" key={i}>
                    <CardImageSlider data={project} keyword="gallery" />
                    <div className="card-body">
                        <h4>
                        <Link href={`${url}/${project?.slug}`}>{project?.project_name || "Not available"}</Link>
                        </h4>
                        <p className="mb-1">
                            <i className="icon-feather-map-pin"></i> Al Muwaiji, Al Ain, UAE
                        </p>
                        <ul className="list-info mb-3">
                            <li><i className="icon-img-flat"></i> House/Villa</li>
                            <li><i className="icon-img-room"></i> Rooms: <span>6</span></li>
                            <li><i className="icon-img-bed"></i> Bedrooms: <span>4</span></li>
                            <li><i className="icon-img-ratio"></i> <span>550</span> sq m</li>
                            <li><i className="icon-img-tub"></i> Bathrooms: <span>8</span></li>
                        </ul>
                        <div className="d-flex align-items-center">
                            <h4 className="mb-0 flex-grow-1">AED840</h4>
                            <a href="#" className="btn btn-primary">View Details</a>
                        </div>
                    </div>
                </div>
            ))}
        </Carousel>
    );
};

const NewProjectGalary = ({ isMobile, data, url }) => {
    const responsive = {
        desktop: { breakpoint: { max: 3000, min: 1024 }, items: 4, slidesToSlide: 1 },
        tablet: { breakpoint: { max: 1024, min: 768 }, items: 2, slidesToSlide: 1 },
        mobile: { breakpoint: { max: 768, min: 0 }, items: 1, slidesToSlide: 1 },
    };



    return (
        <Carousel
            responsive={responsive}
            swipeable={true}
            draggable={true}
            showDots={isMobile ? true : false}
            arrows={isMobile ? false : true}
            infinite={false}
            keyBoardControl={true}
            containerClass="carousel-container"
            itemClass="px-3"
        >
            {data?.length > 0 && data?.map((item, i) => (
                    <div key={i} className="card card-ads">
                    <CardImageSlider data={item} keyword="gallery" />
                    <div className="card-body">
                        <h4>
                        <Link  href={`${url}/${item?.slug}`}>{item?.project_name || "Not available"}</Link>
                        </h4>
                        <p className="mb-1">
                            <i className="icon-feather-map-pin"></i> Al Hamra Village, Ras Al Khaimah, UAE
                        </p>
                        <ul className="list-info">
                            <li><i className="icon-img-flat"></i></li>
                            <li><i className="icon-img-room"></i> Rooms: <span>6</span></li>
                            <li><i className="icon-img-bed"></i> Bedrooms: <span>4</span></li>
                            <li><i className="icon-img-ratio"></i> <span>550</span> sq m</li>
                            <li><i className="icon-img-tub"></i> Bathrooms: <span>8</span></li>
                        </ul>
                    </div>
                </div>
            ))}
        </Carousel>
    );
};
