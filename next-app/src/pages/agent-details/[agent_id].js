"use client";
import React, { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import AuthUser from "@/components/Authentication/AuthUser";
import { useRouter } from "next/router";
import Link from "next/link";
import { toast } from "react-toastify";
import { Offcanvas } from "react-bootstrap";
import AgentReview from "@/components/userReview/AgentReview";

const countryCode = ["IND +91", "+81", "+71", "+61", "+51"];

const responsive = {
  superLargeDesktop: { breakpoint: { max: 4000, min: 1440 }, items: 3 },
  desktop: { breakpoint: { max: 1440, min: 1024 }, items: 3 },
  tablet: { breakpoint: { max: 1024, min: 768 }, items: 2 },
  mobile: { breakpoint: { max: 768, min: 0 }, items: 1 },
};

const PropertyCard = ({ property }) => {
  const firstImage = property?.galleries?.[0];

  return (
    <Link href={`/property-details/${property?.slug}`}>
      <div
        className="owl-item"
        style={{ width: "320px", marginRight: "15px", flexShrink: "0" }}
      >
        <article className="item">
          <div
            className="card card-ads card-overlay"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.65)" }}
          >
            <div className="card-image" style={{ height: "280px" }}>
              <img
                alt=""
                className="card-img"
                src={firstImage?.image_url || property?.image}
              />
              <span className="ads-type rent">for {property?.post_for}</span>
              <span className="ads-fav">
                <i className="icon-line-awesome-heart-o"></i>
              </span>
            </div>
            <div className="card-img-overlay">
              <h4>{property.title}</h4>
              <ul className="list-info">
                <li>
                  <i className="icon-img-flat"></i> {property.type}
                </li>
                <li>
                  <i className="icon-img-room"></i> Rooms:{" "}
                  <span>{property?.rooms}</span>
                </li>
                <li>
                  <i className="icon-img-bed"></i> Bedrooms:{" "}
                  <span>{property?.bedrooms}</span>
                </li>
                <li>
                  <i className="icon-img-ratio"></i>{" "}
                  <span>{property?.area}</span> sq m
                </li>
                <li>
                  <i className="icon-img-tub"></i> Bathrooms:{" "}
                  <span>{property?.bathrooms}</span>
                </li>
              </ul>
              <p className="mb-1">
                <i className="icon-feather-map-pin"></i> {property.location}
              </p>
              <div className="d-flex align-items-center">
                <h4 className="mb-0 flex-grow-1">
                  ${property?.expected_price}
                </h4>
                Book Now
              </div>
            </div>
          </div>
        </article>
      </div>
    </Link>
  );
};

const Index = () => {
  const { callApi } = AuthUser();
  const router = useRouter();
  const { agent_id } = router.query;
  const [agentDetailsData, setAgentDetailsData] = useState();
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [contactDetails, setContactDetails] = useState({
    agent_id: agent_id,
    name: "",
    email: "",
    contact: "",
    message: "",
  });

  useEffect(() => {
    if (agent_id) {
      fetchAgentDetails(agent_id);
    }
  }, [agent_id]);

  const fetchAgentDetails = async (agent_id) => {
    try {
      const response = await callApi({
        api: `/agent_details_page`,
        method: "GET",
        data: {
          agent_id: agent_id,
        },
      });
      if (response && response.status === 1) {
        setAgentDetailsData(response.data);
        setContactDetails({
          name: "",
          email: "",
          contact: "",
          message: "",
        });
      }
    } catch (error) {
      console.error(error?.message || "Something went wrong");
    }
  };

  const handleContactDetailsChange = (e) => {
    const { name, value } = e?.target;
    setContactDetails((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const response = await callApi({
        api: "/save_contact_agent",
        method: "UPLOAD",
        data: contactDetails,
      });

      if (response && response.status === 1) {
        toast.success(response.message || "Enquiry Send Successfully");
      } else {
        toast.error(response.message || "Enquiry Send Failed");
      }
    } catch (error) {
      console.error(error?.message || "Something went wrong");
    }
  };

  return (
    <MainLayout>
      <div className="short-banner">
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
                  <li className="breadcrumb-item">
                    <Link href="/">Home</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    My Profile
                  </li>
                </ol>
              </nav>

              <div className="card mb-4">
                <div className="row g-0">
                  <div className="col-sm-auto col-4">
                    <img
                      src={agentDetailsData?.image}
                      alt="Agent Logo"
                      height={"154px"}
                    />
                  </div>
                  <div className="col-sm col-8">
                    <div className="card-body">
                      <h4 className="mb-1">
                        {agentDetailsData?.name}{" "}
                        <i className="icon-img-check ms-1"></i>
                      </h4>
                      <p>
                        <i className="icon-feather-map-pin text-primary"></i>{" "}
                        Email: {agentDetailsData?.email}
                      </p>
                      <p>
                        <i className="icon-feather-user text-primary"></i>{" "}
                        Contact: {agentDetailsData?.contact}
                      </p>
                      <div className="d-flex">
                        <a
                          role="button"
                          className="btn btn-outline-primary btn-sm"
                        >
                          whatsapp Number
                        </a>
                        <a
                          role="button"
                          className="btn btn-outline-primary btn-sm"
                        >
                          Phone Number
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-end">
                <a
                  onClick={() => setShowOffcanvas(true)}
                  className="btn btn-primary"
                >
                  Write A Review
                </a>
              </div>

              <div className="mb-4">
                <h4>Property on Rent</h4>
                <div className="custom-carousel-container">
                  {agentDetailsData?.rent?.length > 0 && (
                    <Carousel
                      responsive={responsive}
                      infinite={true}
                      autoPlay={true}
                      autoPlaySpeed={3000}
                      keyBoardControl={true}
                      removeArrowOnDeviceType={["tablet", "mobile"]}
                      itemClass="px-3"
                    >
                      {agentDetailsData?.rent?.map((property) => (
                        <PropertyCard key={property.id} property={property} />
                      ))}
                    </Carousel>
                  )}
                </div>
              </div>

              {agentDetailsData?.sale?.length > 0 && (
                <div>
                  <h4>Property on Sale</h4>
                  <div className="custom-carousel-container">
                    <Carousel
                      responsive={responsive}
                      infinite={true}
                      autoPlay={true}
                      autoPlaySpeed={3000}
                      keyBoardControl={true}
                      removeArrowOnDeviceType={["tablet", "mobile"]}
                      itemClass="px-3"
                    >
                      {agentDetailsData?.sale?.map((property) => (
                        <PropertyCard key={property.id} property={property} />
                      ))}
                    </Carousel>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="col-xl-4 col-lg-4 col-12">
              <div className="card mb-4">
                <div className="card-header">
                  <h4>Contact Agent</h4>
                </div>
                <div className="card-body">
                  <form onSubmit={handleSave}>
                    <div className="mb-3">
                      <label>Name</label>
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        required
                        onChange={handleContactDetailsChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        required
                        onChange={handleContactDetailsChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label>Phone Number</label>
                      <div className="d-flex">
                        <select
                          name="country_code"
                          className="form-select me-2"
                          defaultValue="+91"
                          onChange={handleContactDetailsChange}
                          style={{ maxWidth: "120px" }} // Adjust width as needed
                        >
                          {countryCode.map((code, index) => (
                            <option key={index} value={code}>
                              {code}
                            </option>
                          ))}
                        </select>
                        <input
                          type="number"
                          name="contact"
                          className="form-control"
                          required
                          onChange={handleContactDetailsChange}
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label>Message</label>
                      <textarea
                        onChange={handleContactDetailsChange}
                        className="form-control"
                        rows="3"
                        name="message"
                        required
                      ></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary">
                      Send
                    </button>
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
      <Offcanvas
        show={showOffcanvas}
        placement="end"
        onHide={() => setShowOffcanvas(false)}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Review for this Agent</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <AgentReview
            onSubmit={'handleReviewSubmit'}
            onClose={() => setShowOffcanvas(false)}
          />
        </Offcanvas.Body>
      </Offcanvas>
    </MainLayout>
  );
};

export default Index;
