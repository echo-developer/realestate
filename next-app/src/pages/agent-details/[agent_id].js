"use client";

import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const agentDetails = {
    name: "Moin",
    email: "moin1@mail.com",
    contact: "9525952621",
    logo: "/assets/images/user.jpg",
    address: "UA, UAE",
};

const propertiesForRent = [
    {
        id: 1,
        image: "http://localhost/realestate-live/public/upload/properties/thumb420/1669810966_50c99ead1d21e02aff1c.jpg",
        type: "Flats",
        location: "Location 3",
        rooms: 1,
        bathrooms: 1,
        beds: 1,
    },
    {
      id: 1,
      image: "http://localhost/realestate-live/public/upload/properties/thumb420/1669810966_50c99ead1d21e02aff1c.jpg",
      type: "Flats",
      location: "Location 3",
      rooms: 1,
      bathrooms: 1,
      beds: 1,
  }, {
    id: 1,
    image: "http://localhost/realestate-live/public/upload/properties/thumb420/1669810966_50c99ead1d21e02aff1c.jpg",
    type: "Flats",
    location: "Location 3",
    rooms: 1,
    bathrooms: 1,
    beds: 1,
}, {
  id: 1,
  image: "http://localhost/realestate-live/public/upload/properties/thumb420/1669810966_50c99ead1d21e02aff1c.jpg",
  type: "Flats",
  location: "Location 3",
  rooms: 1,
  bathrooms: 1,
  beds: 1,
}, {
  id: 1,
  image: "http://localhost/realestate-live/public/upload/properties/thumb420/1669810966_50c99ead1d21e02aff1c.jpg",
  type: "Flats",
  location: "Location 3",
  rooms: 1,
  bathrooms: 1,
  beds: 1,
}, {
  id: 1,
  image: "http://localhost/realestate-live/public/upload/properties/thumb420/1669810966_50c99ead1d21e02aff1c.jpg",
  type: "Flats",
  location: "Location 3",
  rooms: 1,
  bathrooms: 1,
  beds: 1,
},
    {
        id: 2,
        image: "http://localhost/realestate-live/public/upload/properties/thumb420/1669810966_50c99ead1d21e02aff1c.jpg",
        type: "Studio",
        location: "Location 4",
        rooms: 1,
        bathrooms: 1,
        beds: 2,
    },
];

const propertiesForSale = [
    {
        id: 1,
        image: "http://localhost/realestate-live/public/upload/properties/thumb420/1669810966_50c99ead1d21e02aff1c.jpg",
        type: "Sell",
        location: "Ranchi, Lalpur",
        rooms: 1,
        bathrooms: 2,
        beds: 3,
    },
    {
        id: 2,
        image: "http://localhost/realestate-live/public/upload/properties/thumb420/1669810966_50c99ead1d21e02aff1c.jpg",
        type: "Villa",
        location: "Location 5",
        rooms: 3,
        bathrooms: 2,
        beds: 4,
    },
];

const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 5 },
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 3 },
    tablet: { breakpoint: { max: 1024, min: 464 }, items: 2 },
    mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
};

const PropertyCard = ({ property }) => (
    <div className="card">
        <img src={property.image} alt={`${property.type}`} className="card-img-top" />
        <div className="card-body">
            <h4>{property.type}</h4>
            <p>
                <i className="icon-feather-map-pin"></i> {property.location}
            </p>
            <ul>
                <li>{property.rooms} Room(s)</li>
                <li>{property.bathrooms} Bathroom(s)</li>
                <li>{property.beds} Bed(s)</li>
            </ul>
        </div>
    </div>
);

const Index = () => {
    return (
        <MainLayout>
            <div className="banner">
                <div className="container">
                    <h1>Agent Details</h1>
                </div>
            </div>

            <section className="profile">
                <div className="container-fluid">
                    <div className="row">
                        {/* Main Content */}
                        <div className="col-xl-8 col-lg-8 col-12">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item"><a href="#">Home</a></li>
                                    <li className="breadcrumb-item active" aria-current="page">My Profile</li>
                                </ol>
                            </nav>

                            <div className="card mb-4">
                                <div className="row g-0">
                                    <div className="col-sm-auto col-4">
                                        <img
                                            src={agentDetails.logo}
                                            alt="Agent Logo"
                                            className="img-fluid"
                                        />
                                    </div>
                                    <div className="col-sm col-8">
                                        <div className="card-body">
                                            <h4 className="mb-1">
                                                {agentDetails.name} <i className="icon-img-check ms-1"></i>
                                            </h4>
                                            <p><i className="icon-feather-map-pin text-primary"></i> Email: {agentDetails.email}</p>
                                            <p><i className="icon-feather-user text-primary"></i> Contact: {agentDetails.contact}</p>
                                            <div className="d-flex">
                                                <a href="#" className="btn btn-primary btn-sm me-2">Contact Owner</a>
                                                <a href="#" className="btn btn-outline-primary btn-sm">Phone Number</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <h4>Property on Rent</h4>
                                <Carousel responsive={responsive}>
                                    {propertiesForRent.map((property) => (
                                        <PropertyCard key={property.id} property={property} />
                                    ))}
                                </Carousel>
                            </div>

                            <div>
                                <h4>Property on Sale</h4>
                                <Carousel responsive={responsive}>
                                    {propertiesForSale.map((property) => (
                                        <PropertyCard key={property.id} property={property} />
                                    ))}
                                </Carousel>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <aside className="col-xl-4 col-lg-4 col-12">
                            <div className="card mb-4">
                                <div className="card-header">
                                    <h4>Contact Agent</h4>
                                </div>
                                <div className="card-body">
                                    <form>
                                        <div className="mb-3">
                                            <label>Name</label>
                                            <input type="text" className="form-control" required />
                                        </div>
                                        <div className="mb-3">
                                            <label>Email</label>
                                            <input type="email" className="form-control" required />
                                        </div>
                                        <div className="mb-3">
                                            <label>Message</label>
                                            <textarea className="form-control" rows="3" required></textarea>
                                        </div>
                                        <button type="submit" className="btn btn-primary">Send</button>
                                    </form>
                                </div>
                            </div>
                            <img
                                    src="/assets/images/ads/houseSaleFlyerGREEN.jpg"
                                    alt="Advertisement"
                                />
                        </aside>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
};

export default Index;
