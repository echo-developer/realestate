"use client"
import React, { useState, useEffect } from 'react'
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "./normalSlide.css";
import CardImageSlider from '../cardImageSlider/CardImageSlider'
import Link from 'next/link';


const MainSlider = ({ data, title, miniTitle, subTitle, logo, type, url, addRemoveFav, mainType, listKey }) => {


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
                            <CardTypeComponent isMobile={isMobile} data={data} url={url} addRemoveFav={addRemoveFav} mainType={mainType} listKey={listKey} />
                        )}
                        {type === "normal" && (
                            <NormarTypeComponent isMobile={isMobile} data={data} url={url} addRemoveFav={addRemoveFav} mainType={mainType} listKey={listKey} />
                        )}
                        {type === "project card" && (
                            <ProjectCardComponent isMobile={isMobile} data={data} url={url} addRemoveFav={addRemoveFav} mainType={mainType} listKey={listKey} />
                        )}
                        {type === "project galary" && (
                            <NewProjectGalary isMobile={isMobile} data={data} url={url} addRemoveFav={addRemoveFav} mainType={mainType} listKey={listKey} />
                        )}

                    </div>
                </section>
            )}
        </>
    )
}

export default MainSlider


const NormarTypeComponent = ({ isMobile, data, url, handleRouteClick, addRemoveFav, mainType, listKey }) => {
    // State to track the current slide index
    const [currentSlide, setCurrentSlide] = useState(0);

    // Function to move to the next slide
    const goToNextSlide = () => {
        if (currentSlide < (data?.length || 0) - 1) {
            setCurrentSlide((prev) => prev + 1);
        }
    };

    // Function to move to the previous slide
    const goToPrevSlide = () => {
        setCurrentSlide((prev) => (prev > 0 ? prev - 1 : prev));
    };

    // Function to jump to a specific slide when clicking a dot
    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    return (
        <div className="custom-carousel-container">
            {data?.length > 4 && (
                <div className="carousel-controls" style={{ top: "150px" }}>
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
                        const firstImage = item?.galleries?.[0]?.images?.[0]?.image_url || "assets/images/uploads/d0d74748da69d1067d797427796723c5.jpg";
                        const id = mainType === "property" ? "property_id" : "project_id";
                        return (
                            // <Link key={i} href={`${url}/${item?.slug}`}>
                            <div className="owl-item" style={{
                                width: '430px',
                                marginRight: '20px',
                                flexShrink: 0,
                            }} key={i}>
                                <article className="item">
                                    <div className="card card-ads card-overlay" style={{ backgroundColor: 'rgba(0, 0, 0, 0.65)' }}>

                                        <div className="card-image" style={{ height: "336px" }} target="_blank">
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
                                                <h4>{item?.property_name || "Not available"}</h4>
                                            </a>
                                            <ul className="list-info">
                                                {item?.property_type_for && (
                                                    <li>
                                                        <i className="icon-img-flat"></i>{item?.property_type_for}
                                                    </li>
                                                )}
                                                {item?.bedrooms && (
                                                    <li>
                                                        <i className="icon-img-bed"></i> Bedrooms: <span>{item?.bedrooms}</span>
                                                    </li>
                                                )}
                                                {item?.carpet_area && (
                                                    <li>
                                                        <i className="icon-img-ratio"></i> <span>{item?.carpet_area}</span> {item?.bedrooms}
                                                    </li>
                                                )}
                                                {item?.bathrooms && (
                                                    <li>
                                                        <i className="icon-img-tub"></i> Bathrooms: <span>{item?.bathrooms}</span>
                                                    </li>
                                                )}
                                            </ul>
                                            {item?.address && (
                                                <p className="mb-1">
                                                    <i className="icon-feather-map-pin"></i>{item?.address}
                                                </p>
                                            )}
                                            <div className="d-flex align-items-center">
                                                <h4 className="mb-0 flex-grow-1">{item?.price}</h4>
                                                <a href={`${url}/${item?.slug}`} style={{ textDecoration: 'none', color: 'inherit' }} target="_blank">
                                                    Book Now
                                                </a>

                                            </div>
                                        </div>
                                    </div>
                                </article>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Dots (Pagination Indicators) */}
            {isMobile && (
                <div className="carousel-dots">
                    {data?.map((_, index) => (
                        <span
                            key={index}
                            className={`dot ${currentSlide === index ? "active" : ""}`}
                            onClick={() => goToSlide(index)}
                        ></span>
                    ))}
                </div>
            )}
        </div>
    );
};
const CardTypeComponent = ({ isMobile, data, url, addRemoveFav, mainType, listKey }) => {
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
                                <a href={`${url}/${item?.slug}`} target='_blank'>{item?.property_name || "Not available"}</a>
                            </h4>
                            <p className="mb-1">
                                <i className="icon-feather-map-pin"></i> {item?.address}
                            </p>
                            <ul className="list-info">
                                {item?.property_type_for && (
                                    <li><i className="icon-img-flat"></i> {item.property_type_for}</li>
                                )}

                                {item?.rooms && (
                                    <li><i className="icon-img-room"></i> Rooms: <span>{item.rooms}</span></li>
                                )}

                                {item?.bedrooms && (
                                    <li><i className="icon-img-bed"></i> Bedrooms: <span>{item.bedrooms}</span></li>
                                )}

                                {item?.carpet_area && (
                                    <li><i className="icon-img-ratio"></i> <span>{item.carpet_area}</span></li>
                                )}

                                {item?.bathrooms && (
                                    <li><i className="icon-img-tub"></i> Bathrooms: <span>{item.bathrooms}</span></li>
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
                                <i className="icon-feather-calendar"></i> {formatDate(item?.created_at)}
                            </span>
                        </div>
                    </div>
                )
            })}
        </Carousel>
    );
};


const ProjectCardComponent = ({ isMobile, data, url, addRemoveFav, mainType, listKey }) => {
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
  {project?.project_name || "Not available"}
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
                                    <li><i className="icon-img-room"></i> Rooms: <span>{project.rooms}</span></li>
                                )}

                                {project?.bedrooms && (
                                    <li><i className="icon-img-bed"></i> Bedrooms: <span>{project.bedrooms}</span></li>
                                )}

                                {project?.carpet_area && (
                                    <li><i className="icon-img-ratio"></i> <span>550</span> {project.carpet_area}</li>
                                )}

                                {project?.bathrooms && (
                                    <li><i className="icon-img-tub"></i> Bathrooms: <span>{project.bathrooms}</span></li>
                                )}

                            </ul>
                            <div className="d-flex align-items-center">
                                {price && <h4 className="mb-0 flex-grow-1">{price}</h4>}
                                <a href={`${url}/${project?.slug}`} className="btn btn-primary">View Details</a>
                            </div>
                        </div>
                    </div>
                )
            })}
        </Carousel>
    );
};

const NewProjectGalary = ({ isMobile, data, url, addRemoveFav, mainType, listKey }) => {
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
                        <CardImageSlider data={item} keyword="gallery" id={id} addRemoveFav={addRemoveFav} mainType={mainType} listKey={listKey} />
                        <div className="card-body">
                            <h4>
                                <a href={`${url}/${item?.slug}`} target="_blank">{item?.project_name || "Not available"}</a>
                            </h4>
                            <p className="mb-1">
                                <i className="icon-feather-map-pin"></i> Al Hamra Village, Ras Al Khaimah, UAE
                            </p>
                            <ul className="list-info">
                                {item?.property_type_for && (
                                    <li><i className="icon-img-flat"></i> {item.property_type_for}</li>
                                )}

                                {item?.rooms && (
                                    <li><i className="icon-img-room"></i> Rooms: <span>{item.rooms}</span></li>
                                )}

                                {item?.bedrooms && (
                                    <li><i className="icon-img-bed"></i> Bedrooms: <span>{item.bedrooms}</span></li>
                                )}

                                {item?.carpet_area && (
                                    <li><i className="icon-img-ratio"></i> <span>{item.carpet_area}</span> sq m</li>
                                )}

                                {item?.bathrooms && (
                                    <li><i className="icon-img-tub"></i> Bathrooms: <span>{item.bathrooms}</span></li>
                                )}

                            </ul>
                        </div>
                    </div>
                )
            })}
        </Carousel>
    );
};

function formatDate(dateString) {
    const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

    const date = dateString ? new Date(dateString) : null;
    if (!date || isNaN(date?.getTime?.())) {
        return dateString; // Return original string if it's an invalid date
    }

    const day = date?.getDate?.();
    const month = months?.[date?.getMonth?.()] ?? "";
    const year = date?.getFullYear?.();

    return day && month && year ? `${day}${month} ${year}` : dateString;
}


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
  
  