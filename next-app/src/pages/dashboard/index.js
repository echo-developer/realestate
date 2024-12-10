"use client";
import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ChartsRow from "@/components/charts/ChartShow";
import Image from "next/image";

const facts = [
  {
    bgColor: "rgba(137, 178, 231, 0.2)",
    iconBgColor: "rgb(19, 101, 207)",
    iconSrc: "assets/images/icons/home-2.png",
    number: "550",
    title: "All Property",
  },
  {
    bgColor: "rgba(139, 202, 153, 0.2)",
    iconBgColor: "rgb(24, 150, 52)",
    iconSrc: "assets/images/icons/sale-2.png",
    number: "230",
    title: "Property for Sale",
  },
  {
    bgColor: "rgba(243, 168, 189, 0.2)",
    iconBgColor: "rgb(232, 82, 124)",
    iconSrc: "assets/images/icons/rent-3.png",
    number: "320",
    title: "Property for Rent",
  },
  {
    bgColor: "rgba(208, 168, 243, 0.2)",
    iconBgColor: "rgb(162, 82, 232)",
    iconSrc: "assets/images/icons/wallet.png",
    number: "$12599.00",
    title: "Total Earning",
  },
  {
    bgColor: "rgba(144, 220, 222, 0.2)",
    iconBgColor: "rgb(34, 185, 190)",
    iconSrc: "assets/images/icons/favourite-property.png",
    number: "16",
    title: "Favourite Property",
  },
  {
    bgColor: "rgba(239, 195, 141, 0.2)",
    iconBgColor: "rgb(224, 135, 28)",
    iconSrc: "assets/images/icons/home-2.png",
    number: "550",
    title: "All Property",
  },
];

const customerReviews = [
  {
    id: 1,
    name: "Hawkins Marow",
    timeAgo: "4 min ago",
    rating: 3.5,
    comment:
      "I viewed a number of properties with Just Property and found them to be professional, efficient, patient, courteous and helpful every time.",
    avatar: "assets/images/agents/agent-1.jpg",
  },
  {
    id: 2,
    name: "Hawkins Marow",
    timeAgo: "4 min ago",
    rating: 4.5,
    comment:
      "I viewed a number of properties with Just Property and found them to be professional, efficient, patient, courteous and helpful every time.",
    avatar: "assets/images/agents/agent-3.jpg",
  },
];

const propertyData = [
  {
    orderNo: "#841590",
    customer: "Farooq Basir",
    property: "Dubai Marina, Dubai, UAE",
    date: "15/03/2022",
    type: "Flats",
    status: "On Rent",
    badgeClass: "bg-success",
  },
  {
    orderNo: "#978456",
    customer: "Mohammad Taqi",
    property: "Mohamed Bin Zayed City, Abu Dhabi, UAE",
    date: "24/01/2022",
    type: "Apartment",
    status: "On Sale",
    badgeClass: "bg-warning",
  },
  {
    orderNo: "#454871",
    customer: "Selma Haq",
    property: "Oceana Caribbean, Fujairah, UAE",
    date: "06/10/2021",
    type: "Plots",
    status: "On Rent",
    badgeClass: "bg-success",
  },
  {
    orderNo: "#348451",
    customer: "Ahmed Tijani",
    property: "Salam Street, Abu Dhabi, UAE",
    date: "12/08/2021",
    type: "House/Villa",
    status: "On Rent",
    badgeClass: "bg-success",
  },
  {
    orderNo: "#348451",
    customer: "Aisha Rahman",
    property: "Al Muwaiji, Al Ain, UAE",
    date: "03/05/2021",
    type: "Hotels",
    status: "On Sale",
    badgeClass: "bg-warning",
  },
  {
    orderNo: "#978456",
    customer: "Jamal Razzaq",
    property: "Al Nuaimia 1, Ajman, UAE",
    date: "23/12/2020",
    type: "Penthouse",
    status: "On Sale",
    badgeClass: "bg-warning",
  },
];

const data = {
  bestSellers: [
    {
      imgSrc: "/assets/images/uploads/property-1.jpg",
      description: "Lorem ipsum dolor sit amet, ur adipiscing elit.",
      sold: 318,
      price: 320,
      earnings: 9800,
    },
    {
      imgSrc: "/assets/images/uploads/property-2.jpg",
      description: "Lorem ipsum dolor sit amet, ur adipiscing elit.",
      sold: 450,
      price: 800,
      earnings: 1278.3,
    },
    {
      imgSrc: "/assets/images/uploads/property-3.jpg",
      description: "Lorem ipsum dolor sit amet, ur adipiscing elit.",
      sold: 510,
      price: 750,
      earnings: 1249,
    },
  ],
  topClients: [
    {
      imgSrc: "/assets/images/uploads/property-1.jpg",
      description: "Lorem ipsum dolor sit amet, ur adipiscing elit.",
      location: "USA",
      status: "Online",
      amount: 9800,
    },
    {
      imgSrc: "/assets/images/uploads/property-2.jpg",
      description: "Lorem ipsum dolor sit amet, ur adipiscing elit.",
      location: "India",
      status: "Offline",
      amount: 1278.3,
    },
    {
      imgSrc: "/assets/images/uploads/property-3.jpg",
      description: "Lorem ipsum dolor sit amet, ur adipiscing elit.",
      location: "Saudi Arabia",
      status: "Online",
      amount: 1249,
    },
  ],
};

const Index = () => {
  return (
    <DashboardLayout>
      <aside className="col-lg col-12">
        <div className="p-4">
          <div className="row">
            {facts.map((fact, index) => (
              <article className="col-md-4 col-sm-6 col-12" key={index}>
                <a
                  href="#"
                  className="fun-fact"
                  style={{ backgroundColor: fact.bgColor }}
                >
                  <div
                    className="fun-fact-icon"
                    style={{ backgroundColor: fact.iconBgColor }}
                  >
                    <img
                      src={fact.iconSrc}
                      alt={`${fact.title} Icon`}
                      height="40"
                      width="40"
                    />
                  </div>
                  <div className="fun-fact-text">
                    <h3>{fact.number}</h3>
                    <h5>{fact.title}</h5>
                  </div>
                </a>
              </article>
            ))}
          </div>
          {/* Chart Row */}
          <ChartsRow />
          <div className="row mb-4">
            {/* Active Listings Card */}
            <article className="col-lg-3 col-md-4 col-sm-6 col-12">
              <div className="card card-summary">
                <div className="card-body d-flex align-items-center">
                  <div className="iconx">
                    <img
                      src="assets/images/icons/listing.png"
                      alt="Icon"
                      height="48"
                      width="48"
                    />
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <h5>Active Listings</h5>
                    <h3>124</h3>
                  </div>
                  <a href="#" className="">
                    <i className="bi bi-box-arrow-up-right"></i>
                  </a>
                </div>
              </div>
            </article>

            {/* Listing Views Card */}
            <article className="col-lg-3 col-md-4 col-sm-6 col-12">
              <div className="card card-summary">
                <div className="card-body d-flex align-items-center">
                  <div className="iconx">
                    <img
                      src="assets/images/icons/report.png"
                      alt="Icon"
                      height="48"
                      width="48"
                    />
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <h5>Listing Views</h5>
                    <h3>
                      1056{" "}
                      <small>
                        (<span className="text-site">+356</span> this week)
                      </small>
                    </h3>
                  </div>
                  <a href="#" className="">
                    <i className="bi bi-box-arrow-up-right"></i>
                  </a>
                </div>
              </div>
            </article>

            {/* Your Reviews Card */}
            <article className="col-lg-3 col-md-4 col-sm-6 col-12">
              <div className="card card-summary">
                <div className="card-body d-flex align-items-center">
                  <div className="iconx">
                    <img
                      src="assets/images/icons/review.png"
                      alt="Icon"
                      height="48"
                      width="48"
                    />
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <h5>Your Reviews</h5>
                    <h3>
                      357{" "}
                      <small>
                        (<span className="text-site">+12</span> this week)
                      </small>
                    </h3>
                  </div>
                  <a href="#" className="">
                    <i className="bi bi-box-arrow-up-right"></i>
                  </a>
                </div>
              </div>
            </article>

            {/* Bookmarked Card */}
            <article className="col-lg-3 col-md-4 col-sm-6 col-12">
              <div className="card card-summary">
                <div className="card-body d-flex align-items-center">
                  <div className="iconx">
                    <img
                      src="assets/images/icons/bookmark.png"
                      alt="Icon"
                      height="48"
                      width="48"
                    />
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <h5>Bookmarked</h5>
                    <h3>
                      2329{" "}
                      <small>
                        (<span className="text-site">+234</span> this week)
                      </small>
                    </h3>
                  </div>
                  <a href="#" className="">
                    <i className="bi bi-box-arrow-up-right"></i>
                  </a>
                </div>
              </div>
            </article>
          </div>

          {/* Customer Reviews Section */}
          <div className="card border-0 mb-4">
            <div className="card-header d-flex">
              <h4 className="text-primary">Customer Reviews</h4>
              <div className="dropdown dots-only">
                <a
                  className="btn btn-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-three-dots-vertical"></i>
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <a className="dropdown-item" href="#">
                      Action
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Another action
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Something else here
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div data-simplebar="init">
              <div
                className="simplebar-track horizontal"
                style={{ visibility: "visible" }}
              >
                <div
                  className="simplebar-scrollbar"
                  style={{ visibility: "visible", left: "0px", width: "25px" }}
                ></div>
              </div>
              <div
                className="simplebar-scroll-content"
                style={{ paddingRight: "17px", marginBottom: "-34px" }}
              >
                <div
                  className="simplebar-content"
                  style={{ paddingBottom: "17px", marginRight: "-17px" }}
                >
                  <ul className="card-listing">
                    {customerReviews.map((review) => (
                      <li key={review.id}>
                        <div className="d-flex">
                          <img
                            src={review.avatar}
                            alt=""
                            height="40"
                            width="40"
                            className="rounded-2"
                          />
                          <div className="flex-grow-1 ps-3">
                            <h5 className="mb-0">{review.name}</h5>
                            <p className="text-muted">{review.timeAgo}</p>
                          </div>
                          <div className="flex-shrink-0">
                            <div
                              className="star-rating"
                              data-rating={review.rating}
                            >
                              {[...Array(5)].map((_, index) => {
                                return index < Math.floor(review.rating) ? (
                                  <span key={index} className="star"></span>
                                ) : index < Math.ceil(review.rating) ? (
                                  <span
                                    key={index}
                                    className="star half"
                                  ></span>
                                ) : (
                                  <span
                                    key={index}
                                    className="star empty"
                                  ></span>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                        <p>{review.comment}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="text-end">
              <a className="btn btn-link text-decoration-none">
                View More Reviews <i className="bi bi-arrow-right"></i>
              </a>
            </div>
          </div>

          <div className="row">
            {/* Best Sellers */}
            <aside className="col-lg-6">
              <div className="card border-0 mb-4">
                <div className="card-header">
                  <h4 className="text-primary">Best Sellers</h4>
                </div>
                <div className="ul-table">
                  <ul className="head">
                    <li>Product Name</li>
                    <li>Sold</li>
                    <li>Price</li>
                    <li>Earnings</li>
                  </ul>
                  {data.bestSellers.map((item, index) => (
                    <ul key={index}>
                      <li>
                        <div className="d-flex align-items-center">
                          <Image
                            src={item.imgSrc}
                            alt="product"
                            height={40}
                            width={40}
                            className="rounded-2"
                          />
                          <div className="flex-grow-1 ps-2">
                            <p>{item.description}</p>
                          </div>
                        </div>
                      </li>
                      <li>{item.sold}</li>
                      <li>${item.price}</li>
                      <li>${item.earnings.toFixed(2)}</li>
                    </ul>
                  ))}
                </div>
              </div>
            </aside>

            {/* Top Clients */}
            <aside className="col-lg-6">
              <div className="card border-0 mb-4">
                <div className="card-header">
                  <h4 className="text-primary">Top Clients</h4>
                </div>
                <div className="ul-table" style={{ height: "210px" }}>
                  <ul className="head">
                    <li>Product Name</li>
                    <li>Location</li>
                    <li>Status</li>
                    <li>Amount</li>
                  </ul>
                  {data.topClients.map((item, index) => (
                    <ul key={index}>
                      <li>
                        <div className="d-flex align-items-center">
                          <Image
                            src={item.imgSrc}
                            alt="client"
                            height={40}
                            width={40}
                            className="rounded-2"
                          />
                          <div className="flex-grow-1 ps-2">
                            <p>{item.description}</p>
                          </div>
                        </div>
                      </li>
                      <li>{item.location}</li>
                      <li>
                        <span
                          className={`status ${item.status.toLowerCase()}`}
                        ></span>{" "}
                        {item.status}
                      </li>
                      <li>${item.amount.toFixed(2)}</li>
                    </ul>
                  ))}
                </div>
              </div>
            </aside>
          </div>

          <div className="card border-0">
            <div className="card-header d-flex justify-content-between">
              <h4 className="text-primary">Property Overview</h4>
              <a href="#" className="btn btn-link text-decoration-none">
                See All Properties <i className="bi bi-arrow-right"></i>
              </a>
            </div>
            <div className="ul-table-responsive">
              <div className="ul-table">
                {/* Table Head */}
                <ul className="head">
                  <li>Order No.</li>
                  <li>Customer</li>
                  <li>Property</li>
                  <li>Date</li>
                  <li>Type</li>
                  <li>Status</li>
                </ul>

                {/* Table Body */}
                {propertyData.map((property, index) => (
                  <ul key={index} className="property-row">
                    <li>{property.orderNo}</li>
                    <li>{property.customer}</li>
                    <li>{property.property}</li>
                    <li>{property.date}</li>
                    <li>{property.type}</li>
                    <li>
                      <span className={`badge ${property.badgeClass}`}>
                        {property.status}
                      </span>
                    </li>
                  </ul>
                ))}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </DashboardLayout>
  );
};

export default Index;
