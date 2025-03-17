"use client"
import React, { useState, useEffect } from 'react'
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "./normalSlide.css";
import CardImageSlider from '../cardImageSlider/CardImageSlider'
import Link from 'next/link';
import Slider from 'react-slick';
import "./slick.css";
import useDateFormat from '@/hooks/useDateFormat';
import { useTransition } from 'react';
import useTranslation from '@/hooks/useTranslation';




const MainSlider = ({ data, title, miniTitle, subTitle, logo, type, url, addRemoveFav, mainType, listKey }) => {


    const translation = useTransition();

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
                            <h3>{title || `${translation?.not_available ||"Not available"}`}</h3>
                            <p>{subTitle || `${translation?.not_available ||"Not available"}`}</p>
                        </div>
                        {type === "card" && (
                            <CardTypeComponent isMobile={isMobile} data={data} url={url} addRemoveFav={addRemoveFav} mainType={mainType} listKey={listKey}  translation={translation}/>
                        )}
                        {type === "normal" && (
                            <NormarTypeComponent isMobile={isMobile} data={data} url={url} addRemoveFav={addRemoveFav} mainType={mainType} listKey={listKey} translation={translation} />
                        )}
                        {type === "project card" && (
                            <ProjectCardComponent isMobile={isMobile} data={data} url={url} addRemoveFav={addRemoveFav} mainType={mainType} listKey={listKey} translation={translation} />
                        )}
                        {type === "project galary" && (
                            <NewProjectGalary isMobile={isMobile} data={data} url={url} addRemoveFav={addRemoveFav} mainType={mainType} listKey={listKey} translation={translation}/>
                        )}

                    </div>
                </section>
            )}
        </>
    )
}

export default MainSlider;


const NormarTypeComponent = ({ isMobile, data, url, handleRouteClick, addRemoveFav, mainType, listKey, translation }) => {
    const [currentSlide, setCurrentSlide] = useState(0); // Add state for current slide


    // Slick carousel settings
    const settings = {
        infinite: false,
        slidesToShow: 4,
        slidesToScroll: 1,
        gap: 5,
        afterChange: (index) => setCurrentSlide(index),
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 768, // Small tablets and large phones
                settings: {
                    slidesToShow: 1, // Show 1 slide on smaller screens
                },
            },
            {
                breakpoint: 600, // Mobile
                settings: {
                    slidesToShow: 1, // Show 1 slide on mobile
                },
            },
            {
                breakpoint: 480, // Very small mobile screens
                settings: {
                    slidesToShow: 1, // Show 1 slide on very small screens
                },
            },
        ],
    };

    let sliderRef = React.createRef();

    const goToNextSlide = () => {
        if (sliderRef && sliderRef.current) {
            sliderRef.current.slickNext();
        }
    };

    const goToPrevSlide = () => {
        if (sliderRef && sliderRef.current) {
            sliderRef.current.slickPrev();
        }
    };

    return (
        <div className="custom-carousel-container">
            {!isMobile && data?.length > 4 && (
                <div className="carousel-controls" style={{ top: "150px" }}>
                    <button onClick={goToPrevSlide} className="prev-button">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    </button>
                    <button onClick={goToNextSlide} className="next-button">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    </button>
                </div>
            )}


            <Slider ref={sliderRef} {...settings}>
                {data?.length > 0 && data?.map((item, i) => {
                    const firstImage = item?.galleries?.[0]?.images?.[0]?.image_url || "/assets/images/uploads/d0d74748da69d1067d797427796723c5.jpg";
                    const id = mainType === "property" ? "property_id" : "project_id";
                    return (
                        <div className="owl-item" key={i} style={{ marginInline: '10px' }}>
                            <article className="item">
                                <div className="card card-ads card-overlay" style={{ backgroundColor: 'rgba(0, 0, 0, 0.65)' }}>
                                    <div className="card-image" style={{ height: "336px" }}>
                                        <a href={`${url}/${item?.slug}`} style={{ textDecoration: 'none', color: 'inherit' }} target='_blank'>
                                            <img alt="" className="card-img" src={firstImage} />
                                        </a>
                                        <span className={`ads-type ${item?.post_for}`}>for {item?.post_for}</span>
                                        <span className={`ads-fav ${item?.is_favourite ? "active" : ""}`} onClick={() => addRemoveFav(item?.[id], mainType, listKey)}>
                                            <i className="icon-line-awesome-heart-o"></i>
                                        </span>
                                    </div>
                                    <div className="card-img-overlay">
                                        <a href={`${url}/${item?.slug}`} style={{ textDecoration: 'none', color: 'inherit' }} target="_blank">
                                            <h4>{item?.property_name || `${translation?.not_available ||"Not available"}`}</h4>
                                        </a>
                                        <ul className="list-info">
                                            {item?.property_type_for && (
                                                <li>
                                                    <i className="icon-img-flat"></i>{item?.property_type_for}
                                                </li>
                                            )}
                                            {item?.bedrooms && (
                                                <li>
                                                    <i className="icon-img-bed"></i> {translation?.bedrooms || "Bedrooms"} <span>{item?.bedrooms}</span>
                                                </li>
                                            )}
                                            {item?.carpet_area && (
                                                <li>
                                                    <i className="icon-img-ratio"></i> <span>{item?.carpet_area}</span> {item?.bedrooms}
                                                </li>
                                            )}
                                            {item?.bathrooms && (
                                                <li>
                                                    <i className="icon-img-tub"></i> {translation?.bathrooms || "Bathrooms"} <span>{item?.bathrooms}</span>
                                                </li>
                                            )}
                                        </ul>
                                        {item?.address && (
                                            <p className="mb-1">
                                                <i className="icon-feather-map-pin"></i>{item?.address || `${translation?.not_available ||"Not available"}`}
                                            </p>
                                        )}
                                        <div className="d-flex align-items-center">
                                            <h4 className="mb-0 flex-grow-1">{item?.price}</h4>
                                            <a href={`${url}/${item?.slug}`} style={{ textDecoration: 'none', color: 'inherit' }} target="_blank">
                                                {translation?.book_now || "Book Now"}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        </div>
                    );
                })}
            </Slider>

            {/* Dots (Pagination Indicators) */}
            {isMobile && (
                <div className="carousel-dots">
                    {data?.map((_, index) => (
                        <span
                            key={index}
                            className={`dot ${currentSlide === index ? "active" : ""}`}
                            onClick={() => setCurrentSlide(index)}
                        ></span>
                    ))}
                </div>
            )}
        </div>
    );
};







const CardTypeComponent = ({ isMobile, data, url, addRemoveFav, mainType, listKey, translation }) => {
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
            {data?.length > 0 && data?.map((item, i) => {
                const id = mainType === "property" ? "property_id" : "project_id";
                return (
                    <div className="card card-ads" key={i}>
                        <CardImageSlider data={item} id={id} addRemoveFav={addRemoveFav} mainType={mainType} listKey={listKey} />
                        <div className="card-body">
                            <h4>
                                <a href={`${url}/${item?.slug}`} target='_blank'>{item?.property_name ||`${translation?.not_available ||"Not available"}`}</a>
                            </h4>
                            <p className="mb-1">
                                <i className="icon-feather-map-pin"></i> {item?.address}
                            </p>
                            <ul className="list-info">
                                {item?.property_type_for && (
                                    <li><i className="icon-img-flat"></i> {item.property_type_for}</li>
                                )}

                                {item?.rooms && (
                                    <li><i className="icon-img-room"></i>  {translation?.rooms || "Rooms"} <span>{item.rooms}</span></li>
                                )}

                                {item?.bedrooms && (
                                    <li><i className="icon-img-bed"></i> {translation?.bedrooms || "Bedrooms"} <span>{item.bedrooms}</span></li>
                                )}

                                {item?.carpet_area && (
                                    <li><i className="icon-img-ratio"></i> <span>{item.carpet_area}</span></li>
                                )}

                                {item?.bathrooms && (
                                    <li><i className="icon-img-tub"></i> {translation?.bathrooms || "Bathrooms"}<span>{item.bathrooms}</span></li>
                                )}

                            </ul>
                        </div>
                        <div className="card-footer">
                            <div className="user-details">
                                <div className="user-avatar">
                                    <img alt="" height="32" width="32" className="rounded-circle" src={item?.logo || "/assets/images/user.jpg"} />
                                </div>
                                <div className="user-name">
                                    <span>{item?.user}</span>
                                </div>
                            </div>
                            <span className="ad-post-date ms-3">
                                <i className="icon-feather-calendar"></i> {useDateFormat(item?.created_at)}
                            </span>
                        </div>
                    </div>
                )
            })}
        </Carousel>
    );
};


const ProjectCardComponent = ({ isMobile, data, url, addRemoveFav, mainType, listKey, translation }) => {
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
            {data?.length > 0 && data?.map((project, i) => {
                const id = mainType === "property" ? "property_id" : "id";
                const price = formatToLacCr(project?.expected_price);
                return (
                    <div className="card card-ads" key={i}>
                        <CardImageSlider data={project} keyword="gallery" id={id} addRemoveFav={addRemoveFav} mainType={mainType} listKey={listKey} />
                        <div className="card-body">
                            <h4>
                                <a href={`${url}/${project?.slug}`} target="_blank" rel="noopener noreferrer">
                                    {project?.project_name || `${translation?.not_available ||"Not available"}`}
                                </a>
                            </h4>
                            <p className="mb-1">
                                <i className="icon-feather-map-pin"></i> {project?.address}
                            </p>
                            <ul className="list-info mb-3">
                                {project?.property_type_for && (
                                    <li><i className="icon-img-flat"></i> {project.property_type_for}</li>
                                )}

                                {project?.rooms && (
                                    <li><i className="icon-img-room"></i>  {translation?.rooms || "Rooms"} <span>{project.rooms}</span></li>
                                )}

                                {project?.bedrooms && (
                                    <li><i className="icon-img-bed"></i>  {translation?.bedrooms || "Bedrooms"} <span>{project.bedrooms}</span></li>
                                )}

                                {project?.carpet_area && (
                                    <li><i className="icon-img-ratio"></i> <span>550</span> {project.carpet_area}</li>
                                )}

                                {project?.bathrooms && (
                                    <li><i className="icon-img-tub"></i> {translation?.bathrooms || "Bathrooms"}<span>{project.bathrooms}</span></li>
                                )}

                            </ul>
                            <div className="d-flex align-items-center">
                                {price && <h4 className="mb-0 flex-grow-1">{price}</h4>}
                                <a href={`${url}/${project?.slug}`} target="_blank" className="btn btn-primary"> {translation?.view_details || "View Details"}</a>
                            </div>
                        </div>
                    </div>
                )
            })}
        </Carousel>
    );
};

const NewProjectGalary = ({ isMobile, data, url, addRemoveFav, mainType, listKey,translation }) => {
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
            {data?.length > 0 && data?.map((item, i) => {
                const id = mainType === "property" ? "property_id" : "id";
                return (
                    <div key={i} className="card card-ads">
                        <CardImageSlider data={item} keyword="gallery" id={id} addRemoveFav={addRemoveFav} mainType={mainType} listKey={listKey} translation={translation} />
                        <div className="card-body">
                            <h4>
                                <a href={`${url}/${item?.slug}`} target="_blank">{item?.project_name || `${translation?.not_available ||"Not available"}`}</a>
                            </h4>
                            <p className="mb-1">
                                <i className="icon-feather-map-pin"></i> Al Hamra Village, Ras Al Khaimah, UAE
                            </p>
                            <ul className="list-info">
                                {item?.property_type_for && (
                                    <li><i className="icon-img-flat"></i> {item.property_type_for}</li>
                                )}

                                {item?.rooms && (
                                    <li><i className="icon-img-room"></i>  {translation?.rooms || "Rooms"} <span>{item.rooms}</span></li>
                                )}

                                {item?.bedrooms && (
                                    <li><i className="icon-img-bed"></i> {translation?.bedrooms || "Bedrooms"} <span>{item.bedrooms}</span></li>
                                )}

                                {item?.carpet_area && (
                                    <li><i className="icon-img-ratio"></i> <span>{item.carpet_area}</span> sq m</li>
                                )}

                                {item?.bathrooms && (
                                    <li><i className="icon-img-tub"></i> {translation?.bathrooms || "Bathrooms"} <span>{item.bathrooms}</span></li>
                                )}

                            </ul>
                        </div>
                    </div>
                )
            })}
        </Carousel>
    );
};


function formatToLacCr(range) {
    if (range === null || range === undefined) return "";

    // Convert to string if it's a number
    const rangeStr = typeof range === "number" ? range.toString() : range;

    // Check if it's a range or a single value
    const parts = rangeStr.split("-").map(Number);

    if (parts.some(isNaN)) return "Invalid Input";

    const formatNumber = (num) => {
        if (num >= 10000000) {
            return (num / 10000000).toFixed(1) + " Cr";
        } else if (num >= 100000) {
            return (num / 100000).toFixed(1) + " Lac";
        } else {
            return num.toLocaleString();
        }
    };

    if (parts.length === 1) {
        // Single value case
        return formatNumber(parts[0]);
    }

    const [min, max] = parts;

    return `${formatNumber(min)} - ${formatNumber(max)}`;
}

