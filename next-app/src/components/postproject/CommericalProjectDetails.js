"use client";
import Link from "next/link";
import React, { useState } from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import UserReviewData from "@/components/userReview/UserReviewData";
import "react-image-gallery/styles/css/image-gallery.css";
import useDateFormat from "@/hooks/useDateFormat";
import ProjectGallery from "./ProjectGallery";

const CommercialProjectDetails = ({ detailsData }) => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const [visible, setVisible] = useState(false);
    const [projectId, setprojectId] = useState();

    const ShowGalleryList = (id) => {
        setVisible(true);
        setprojectId(id);
    };


    const imageList = detailsData?.gallery?.flatMap((item => item?.images));

    return (
        <>
            <div className="clearfix"></div>
            <section className="section">
                <div className="container-fluid">
                    <div className="row main-row">
                        <aside className="col-xl-7 col-lg-7 col-12">
                            <div className="row gx-3" onClick={() => ShowGalleryList(detailsData?.id)}>
                                {/* Main Property Image */}
                                <div className="col-12 mb-3">
                                    <img
                                        className="rounded w-100"
                                        src={detailsData?.gallery[0].images[0].file || "../../../public/assets/images/property/default-property-1.png"}
                                        alt="First Property Image"
                                    />
                                </div>
                                {/* Gallery Images */}
                                {/* {detailsData?.gallery[0].images
                                    .slice(1)
                                    .map((item, index) => (
                                        <div
                                            key={index}
                                            className="col-sm-3"
                                            style={{ cursor: "pointer" }}
                                        >
                                            <a
                                                href="#"
                                                className="gallery-item"
                                            >
                                                <img
                                                    className="rounded w-100"
                                                    src={item.file || "../../../public/assets/images/property/default-property-1.png"}
                                                    alt={`Gallery Image ${
                                                        index + 2
                                                    }`}
                                                />
                                            </a>
                                        </div>
                                    ))} */}
                                {!visible && imageList?.slice(1, 5).map((item, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className="col-sm-3"
                                            style={{ cursor: "pointer" }}
                                        >
                                            <a
                                                href="#"
                                                className="gallery-item"
                                                style={index === 3 ? {
                                                    position: "relative", // Make the parent relative for the overlay to work
                                                    display: "block",
                                                } : {}}
                                            >
                                                {/* Image */}
                                                <img
                                                    className="rounded w-100"
                                                    src={
                                                        item.file ||
                                                        "../../../public/assets/images/property/default-property-1.png"
                                                    }
                                                    alt={`Gallery Image ${index + 2}`}
                                                    style={index === 3 ? {
                                                        display: "block", // Prevents inline-level gaps
                                                    } : {}}
                                                />

                                                {/* Overlay */}
                                                <div
                                                    style={index === 3 ? {
                                                        position: "absolute",
                                                        top: 0,
                                                        left: 0,
                                                        width: "100%",
                                                        height: "100%",
                                                        backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
                                                        backdropFilter: "blur(8px)", // Apply blur effect
                                                        WebkitBackdropFilter: "blur(8px)", // Safari support
                                                        display: "flex", // Center content
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        color: "#fff", // Text color
                                                        zIndex: 1, // Ensure overlay is above the image
                                                    } : {}}
                                                >
                                                    {index === 3 && (
                                                        <h4>
                                                            <i className="bi bi-plus-lg"></i> {imageList?.length - 5} Photos
                                                        </h4>
                                                    )}
                                                </div>
                                            </a>

                                        </div>
                                    )
                                })}
                            </div>
                            {visible && (
                <ProjectGallery setVisible={setVisible} projectId={projectId} />
              )}
                        </aside>

                        {/* Property Location Map */}
                        <aside className="col-lg-4 col-12">
                            <div id="project-location">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1790.4118779119187!2d88.40008928590716!3d22.513565789886556!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a02758cf3b6a0ab%3A0x154c5e7f95e124b0!2sOriginate%20Soft%20Pvt.%20Ltd!5e0!3m2!1sen!2sin!4v1737525369746!5m2!1sen!2sin"
                                    width="100%"
                                    height="635"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Project Location"
                                ></iframe>
                            </div>
                        </aside>
                    </div>

                    <div className="one-page-menu mb-3 ">
                        <ul>
                            <li className="active">
                                <a href="#about">Overview</a>
                            </li>
                            <li>
                                <a href="#about-project">About Project</a>
                            </li>
                            <li>
                                <a href="#amenity">Amenities</a>
                            </li>
                            <li>
                                <a href="#floor-plan">Floor Plan & Units</a>
                            </li>
                            <li>
                                <a href="#locality">About Locality</a>
                            </li>
                            <li>
                                <a href="#price-trends">Price Trends</a>
                            </li>
                            <li>
                                <a href="#project-details">Project Details</a>
                            </li>
                            <li>
                                <a href="#about-developer">About Developer</a>
                            </li>
                            <li>
                                <a href="#project-video">Project Video</a>
                            </li>
                            <li>
                                <a href="#project-location">Project Location</a>
                            </li>
                        </ul>
                    </div>
                    <aside className="col-xl-9 col-12 mb-4 mb-xl-0">
                        <section id="about">
                            <div className="card border-0 shadow-1 mb-4">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between">
                                        <h4 className="mb-3 text-primary">
                                            More Details
                                        </h4>
                                    </div>
                                    <ul className="list list-property-details mb-4">
                                        {/* <li>
                                            <div className="d-flex">
                                                <img
                                                    alt="bhk"
                                                    height="48"
                                                    width="48"
                                                    src="/assets/images/icons/bed.png"
                                                />
                                                <div className="flex-grow-1 ps-2">
                                                    <span>BHK</span>
                                                    <h5></h5>
                                                </div>
                                            </div>
                                        </li> */}
                                        <li>
                                            <div className="d-flex">
                                                <img
                                                    alt="Property Size"
                                                    height="48"
                                                    width="48"
                                                    src="/assets/images/icons/size.png"
                                                />
                                                <div className="flex-grow-1 ps-2">
                                                    <span className="text-muted">
                                                        Property Size
                                                    </span>
                                                    <h5>120 sq ft</h5>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="d-flex">
                                                <img
                                                    alt="Total Units"
                                                    height="48"
                                                    width="48"
                                                    src="/assets/images/icons/key.png"
                                                />
                                                <div className="flex-grow-1 ps-2">
                                                    <span>Total Units</span>
                                                    <h5>{detailsData?.total_units || "Not Available"}</h5>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="d-flex">
                                                <img
                                                    alt="Total Towers"
                                                    height="48"
                                                    width="48"
                                                    src="/assets/images/icons/tower.png"
                                                />
                                                <div className="flex-grow-1 ps-2">
                                                    <span>Total Towers</span>
                                                    <h5>{detailsData?.floor || "Not Available"}</h5>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="d-flex">
                                                <img
                                                    alt="Garage Size"
                                                    height="48"
                                                    width="48"
                                                    src="/assets/images/icons/size.png"
                                                />
                                                <div className="flex-grow-1 ps-2">
                                                    <span>Carpet Area</span>
                                                    <h5>{detailsData?.carpet_area || "Not Available"}</h5>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="d-flex">
                                                <img
                                                    alt="Launch Date"
                                                    height="48"
                                                    width="48"
                                                    src="/assets/images/icons/calendar.png"
                                                />
                                                <div className="flex-grow-1 ps-2">
                                                    <span>Launch Date</span>
                                                    <h5>{useDateFormat(detailsData?.created_at) || "Not Available"}</h5>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="d-flex">
                                                <img
                                                    alt="Locatily"
                                                    height="48"
                                                    width="48"
                                                    src="/assets/images/icons/size.png"
                                                />
                                                <div className="flex-grow-1 ps-2">

                                                    <span> Super Area</span>
                                                    <h5>{detailsData?.super_area || "Not Available"}</h5>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="d-flex">
                                                <img
                                                    alt="Facing"
                                                    height="48"
                                                    width="48"
                                                    src="/assets/images/icons/8270179.png"
                                                />
                                                <div className="flex-grow-1 ps-2">
                                                    <span>Facing</span>
                                                    <h5>{detailsData?.facing || "Not Available"}</h5>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="d-flex">
                                                <img
                                                    alt="Booking Price"
                                                    height="48"
                                                    width="48"
                                                    src="/assets/images/icons/money.png"
                                                />
                                                <div className="flex-grow-1 ps-2">
                                                    <span className="text-muted">
                                                        Booking Price
                                                    </span>

                                                    <h5>{detailsData?.currency || "N/A"}{" "}{detailsData?.token_amount || "Not Available"}</h5>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                    <table className="table">
                                        <tbody>
                                            <tr>
                                                <td className="text-muted">
                                                    Price Breakup:
                                                </td>
                                                <td>{detailsData?.currency || "N/A"} {detailsData?.expected_price || "Not Available"}</td>
                                            </tr>
                                            <tr>
                                                <td className="text-muted">
                                                    Address:
                                                </td>
                                                <td>{detailsData?.address || "Not Available"}</td>
                                            </tr>
                                            <tr>
                                                <td className="text-muted">
                                                    Landmark:
                                                </td>
                                                <td>
                                                    Dakshineswar Dolpiri More
                                                    temple, Adyapith temple
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="text-muted">
                                                    Furnishing:
                                                </td>
                                                <td>{detailsData?.project_furnish || "Not Avaialable"}</td>
                                            </tr>
                                            <tr>
                                                <td className="text-muted">
                                                    Flooring:
                                                </td>
                                                <td>
                                                    <span>Wooden, </span>
                                                    <span>
                                                        Normal Tiles/Kotah
                                                        Stone,{" "}
                                                    </span>
                                                    <span>Vitrified, </span>
                                                    <span>Granite</span>
                                                </td>
                                            </tr>
                                            {/* <tr>
                                                <td className="text-muted">
                                                    Type of Ownership:
                                                </td>
                                                <td>Co-operative Society</td>
                                            </tr> */}
                                            <tr>
                                                <td className="text-muted">
                                                    Overlooking:
                                                </td>
                                                <td>
                                                    <span>Garden/Park, </span>
                                                    <span>Pool, </span>
                                                    <span>Main Road</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="text-muted">
                                                    Loan Offered:
                                                </td>
                                                <td>
                                                    <p>
                                                        Estimated EMI ₹3867{" "}
                                                        <img
                                                            alt="Axis Bank"
                                                            height="24"
                                                            width="106"
                                                            src="/assets/images/bank/axis-bank-logo.png"
                                                        />
                                                        <small>
                                                            <Link href="">
                                                                Apply for Home
                                                                loan
                                                            </Link>
                                                        </small>
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td
                                                    className="text-muted"
                                                    colSpan="2"
                                                >
                                                    <Link href="">
                                                        View More Details{" "}
                                                        <i className="bi bi-chevron-down"></i>
                                                    </Link>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <p>
                                        <b>Description:</b> {detailsData?.project_desc || "Not Available"}
                                    </p>
                                    <div className="d-grid d-sm-block">
                                        <a href="#" className="btn btn-primary">
                                            Contact Owner
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <section id="amenity">
                            <div className="card border-0 shadow-1 mb-4">
                                <div className="card-body">
                                    <h4 className="mb-3 text-primary">
                                        Amenities
                                    </h4>
                                    <ul className="list-info g-col-5 list-property-info mb-4"></ul>
                                    <div className="g-col-sm-6 g-col-12 d-md-block">
                                        <button className="btn btn-outline-primary me-md-3">
                                            View More Amenities
                                        </button>
                                        <a
                                            href="#"
                                            className="btn btn-outline-primary"
                                        >
                                            Download Brochure{" "}
                                            <img
                                                alt="Download Brochure"
                                                height="24"
                                                src="/assets/images/icons/brochure.png"
                                            />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section id="about-project">
                            <div className="card border-0 shadow-1 mb-4">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between">
                                        <h4 className="mb-3 text-primary">
                                            About Real Estate, Rajarhat
                                        </h4>
                                        <h5>
                                            <Link href="#">
                                                Explore Rajarhat{" "}
                                                <i className="bi bi-arrow-right"></i>
                                            </Link>
                                        </h5>
                                    </div>
                                    <div className="row">
                                        <article className="col-lg-4 col-sm-6">
                                            <div className="d-flex mb-3">
                                                <div>
                                                    <div
                                                        className="star-rating"
                                                        data-rating="3.5"
                                                    >
                                                        <span className="star"></span>
                                                        <span className="star"></span>
                                                        <span className="star"></span>
                                                        <span className="star half"></span>
                                                        <span className="star empty"></span>
                                                    </div>
                                                </div>
                                                <div className="ps-4">
                                                    <p className="text-muted">
                                                        4.3 ratings <br />
                                                        750 Reviews
                                                    </p>
                                                </div>
                                            </div>
                                        </article>
                                        <article className="col-lg-4 col-sm-6">
                                            <div className="d-flex mb-3">
                                                <div>
                                                    <h5>Rank 32</h5>
                                                </div>
                                                <div className="ps-4">
                                                    <p className="text-muted">
                                                        Out of Localities <br />
                                                        3682
                                                    </p>
                                                </div>
                                            </div>
                                        </article>
                                        <article className="col-lg-4 col-sm-6">
                                            <div className="mb-3">
                                                <h5>Locality Average Price</h5>
                                                <p className="text-muted">
                                                    ₹22547/Sqft +{" "}
                                                    <span className="text-green">
                                                        ₹881 (4.1%)
                                                    </span>{" "}
                                                    QoQ
                                                </p>
                                            </div>
                                        </article>
                                    </div>
                                    <div className="row mb-3">
                                        <article className="col-sm-4">
                                            <div className="d-flex align-items-center justify-content-between justify-content-sm-start gap-3 mb-2">
                                                <p className="mb-0">
                                                    Environment
                                                </p>
                                                <div
                                                    className="pie"
                                                    data-pie='{"percent":75}'
                                                    data-pie-index="1"
                                                    style={{
                                                        width: "50px",
                                                        height: "50px",
                                                    }}
                                                >
                                                    <svg
                                                        role="progressbar"
                                                        width="50"
                                                        height="50"
                                                        viewBox="0 0 100 100"
                                                        aria-valuemin="0"
                                                        aria-valuemax="100"
                                                        aria-valuenow="75"
                                                    >
                                                        <circle
                                                            cx="50%"
                                                            cy="50%"
                                                            r="42"
                                                            shape-rendering="geometricPrecision"
                                                            className="pie-circle-1"
                                                            fill="none"
                                                            strokeWidth="10"
                                                            strokeDashoffset="66"
                                                            strokeDasharray="264"
                                                            stroke="#189634"
                                                            style={{
                                                                transform:
                                                                    "rotate(0deg)",
                                                                transformOrigin:
                                                                    "50% 50%",
                                                            }}
                                                        ></circle>
                                                        <text
                                                            className="pie-text-1"
                                                            x="50%"
                                                            y="50%"
                                                            fill="#189634"
                                                            textAnchor="middle"
                                                            dy="0.35em"
                                                            fontSize="2rem"
                                                            fontWeight="600"
                                                        >
                                                            <tspan className="pie-percent-1">
                                                                75
                                                            </tspan>
                                                            <tspan className="pie-unit-1">
                                                                %
                                                            </tspan>
                                                        </text>
                                                    </svg>
                                                </div>
                                            </div>
                                        </article>
                                        <article className="col-sm-4">
                                            <div className="d-flex align-items-center justify-content-between justify-content-sm-start gap-3 mb-2">
                                                <p className="mb-0">
                                                    Place Of Interest
                                                </p>
                                                <div
                                                    className="pie"
                                                    data-pie='{"percent":85}'
                                                    data-pie-index="2"
                                                    style={{
                                                        width: "50px",
                                                        height: "50px",
                                                    }}
                                                >
                                                    <svg
                                                        role="progressbar"
                                                        width="50"
                                                        height="50"
                                                        viewBox="0 0 100 100"
                                                        aria-valuemin="0"
                                                        aria-valuemax="100"
                                                        aria-valuenow="85"
                                                    >
                                                        <circle
                                                            cx="50%"
                                                            cy="50%"
                                                            r="42"
                                                            shape-rendering="geometricPrecision"
                                                            className="pie-circle-2"
                                                            fill="none"
                                                            strokeWidth="10"
                                                            strokeDashoffset="39.6"
                                                            strokeDasharray="264"
                                                            stroke="#189634"
                                                            style={{
                                                                transform:
                                                                    "rotate(0deg)",
                                                                transformOrigin:
                                                                    "50% 50%",
                                                            }}
                                                        ></circle>
                                                        <text
                                                            className="pie-text-2"
                                                            x="50%"
                                                            y="50%"
                                                            fill="#189634"
                                                            textAnchor="middle"
                                                            dy="0.35em"
                                                            fontSize="2rem"
                                                            fontWeight="600"
                                                        >
                                                            <tspan className="pie-percent-2">
                                                                85
                                                            </tspan>
                                                            <tspan className="pie-unit-2">
                                                                %
                                                            </tspan>
                                                        </text>
                                                    </svg>
                                                </div>
                                            </div>
                                        </article>
                                        <article className="col-sm-4">
                                            <div className="d-flex align-items-center justify-content-between justify-content-sm-start gap-3 mb-2">
                                                <p className="mb-0">
                                                    Commuting
                                                </p>
                                                <div
                                                    className="pie"
                                                    data-pie='{"percent":60}'
                                                    data-pie-index="3"
                                                    style={{
                                                        width: "50px",
                                                        height: "50px",
                                                    }}
                                                >
                                                    <svg
                                                        role="progressbar"
                                                        width="50"
                                                        height="50"
                                                        viewBox="0 0 100 100"
                                                        aria-valuemin="0"
                                                        aria-valuemax="100"
                                                        aria-valuenow="60"
                                                    >
                                                        <circle
                                                            cx="50%"
                                                            cy="50%"
                                                            r="42"
                                                            shape-rendering="geometricPrecision"
                                                            className="pie-circle-3"
                                                            fill="none"
                                                            strokeWidth="10"
                                                            strokeDashoffset="105.6"
                                                            strokeDasharray="264"
                                                            stroke="#189634"
                                                            style={{
                                                                transform:
                                                                    "rotate(0deg)",
                                                                transformOrigin:
                                                                    "50% 50%",
                                                            }}
                                                        ></circle>
                                                        <text
                                                            className="pie-text-3"
                                                            x="50%"
                                                            y="50%"
                                                            fill="#189634"
                                                            textAnchor="middle"
                                                            dy="0.35em"
                                                            fontSize="2rem"
                                                            fontWeight="600"
                                                        >
                                                            <tspan className="pie-percent-3">
                                                                60
                                                            </tspan>
                                                            <tspan className="pie-unit-3">
                                                                %
                                                            </tspan>
                                                        </text>
                                                    </svg>
                                                </div>
                                            </div>
                                        </article>
                                    </div>
                                    <h5>
                                        Locality Introduction and Neighbourhood
                                    </h5>
                                    <p>
                                        Lorem ipsum dolor sit amet, consectetur
                                        adipiscing elit. In feugiat nulla eget
                                        nisl mattis euismod. Pellentesque nulla
                                        massa, tempus non ligula eu, elementum
                                        ultricies orci. Nam bibendum purus
                                        tortor, vel pretium ipsum efficitur
                                        varius. Maecenas sed leo magna. Aliquam
                                        non dapibus ligula. Proin eu cursus
                                        dui... <Link href="#">Read more</Link>
                                    </p>
                                    <h5 className="mb-3">Important Things</h5>
                                    <div className="row -mb-3 facilities">
                                        <article className="col-lg-4 col-sm-6">
                                            <div className="cardbox bg-primary-subtle">
                                                <div className="d-flex align-items-center mb-2">
                                                    <img
                                                        alt="Institution"
                                                        height="32"
                                                        width="32"
                                                        src="/assets/images/icons/institution.png"
                                                    />
                                                    <div className="flex-grow-1 ps-3">
                                                        <h5 className="text-primary mb-0">
                                                            Educational
                                                            Institute
                                                        </h5>
                                                    </div>
                                                </div>
                                                <ul className="mb-0">
                                                    <li>
                                                        National English School,
                                                        Rajarhat Campus
                                                    </li>
                                                    <li>
                                                        Devaki Memorial School
                                                    </li>
                                                    <li className="hide">
                                                        Children Park, Rajarhat
                                                    </li>
                                                    <li className="hide">
                                                        Children Zoo, Rajarhat
                                                    </li>
                                                    <li>
                                                        <Link
                                                            href="#"
                                                            className="show-more"
                                                        >
                                                            +2 more
                                                        </Link>
                                                    </li>
                                                </ul>
                                            </div>
                                        </article>
                                        <article className="col-lg-4 col-sm-6">
                                            <div className="cardbox bg-primary-subtle">
                                                <div className="d-flex align-items-center mb-2">
                                                    <img
                                                        alt="Transport"
                                                        height="32"
                                                        width="32"
                                                        src="/assets/images/icons/transport.png"
                                                    />
                                                    <div className="flex-grow-1 ps-3">
                                                        <h5 className="text-primary mb-0">
                                                            Transport Facilities
                                                        </h5>
                                                    </div>
                                                </div>
                                                <ul className="mb-0">
                                                    <li>
                                                        Nearest Railway Station
                                                        &amp; Metro Station
                                                    </li>
                                                    <li>Petrol Pump</li>
                                                    <li>
                                                        <Link
                                                            href="#"
                                                            className="show-more"
                                                        >
                                                            +2 more
                                                        </Link>
                                                    </li>
                                                </ul>
                                            </div>
                                        </article>
                                        <article className="col-lg-4 col-sm-6">
                                            <div className="cardbox bg-primary-subtle">
                                                <div className="d-flex align-items-center mb-2">
                                                    <img
                                                        alt="Airport"
                                                        height="32"
                                                        width="32"
                                                        src="/assets/images/icons/airport.png"
                                                    />
                                                    <div className="flex-grow-1 ps-3">
                                                        <h5 className="text-primary mb-0">
                                                            Airports
                                                        </h5>
                                                    </div>
                                                </div>
                                                <ul className="mb-0">
                                                    <li>Kolkata CCU Airport</li>
                                                    <li>
                                                        <Link
                                                            href="#"
                                                            className="show-more"
                                                        >
                                                            +2 more
                                                        </Link>
                                                    </li>
                                                </ul>
                                            </div>
                                        </article>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section id="about-developer" className="mb-4">
                            <div className="card border-0 shadow-1 mb-4">
                                <div className="card-body">
                                    <h4 className="mb-3 text-primary">
                                        About Developer
                                    </h4>
                                    <div className="row">
                                        {/* Developer Info */}
                                        <article className="col-xxl-4 col-lg-5 col-sm-7 mb-3">
                                            <h3>{detailsData?.developer_name || "Not Available"}</h3>
                                            <p>{detailsData?.developer_name || "Not Available"} </p>
                                            <div className="d-flex gap-3">
                                                <a
                                                    href="#"
                                                    className="btn btn-primary"
                                                >
                                                    Explore Builder
                                                </a>
                                                <a
                                                    href="#"
                                                    className="btn btn-outline-primary"
                                                >
                                                    Contact Now
                                                </a>
                                            </div>
                                        </article>

                                        {/* Operating In Info */}
                                        <article className="col-lg-auto col-sm-5">
                                            <h3>Operating In</h3>
                                            <p>Mumbai</p>
                                        </article>

                                        {/* Description */}
                                        <article className="col-lg">
                                            <p>
                                                {detailsData?.developer_details || "Not Available"}
                                                {/* <a>Read more</a> */}
                                            </p>
                                        </article>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </aside>
                    <aside className="col-xl-3 col-12"></aside>
                </div>
            </section>

            <Offcanvas show={show} placement="end" onHide={handleClose}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Review for this property</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <UserReviewData
                        propertyId={detailsData.project_id}
                        closeButton={handleClose}
                    />
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
};

export default CommercialProjectDetails;
