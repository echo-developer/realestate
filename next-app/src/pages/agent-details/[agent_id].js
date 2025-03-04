"use client";
import React, { useEffect, useState, useRef } from "react";
import MainLayout from "@/components/layout/MainLayout";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import AuthUser from "@/components/Authentication/AuthUser";
import { useRouter } from "next/router";
import Link from "next/link";
import { toast } from "react-toastify";
import { Offcanvas } from "react-bootstrap";
import AgentReview from "@/components/userReview/AgentReview";
import useTranslation from "@/hooks/useTranslation";

const countryCode = ["IND +91", "+81", "+71", "+61", "+51"];

const responsive = {
  
  superLargeDesktop: { breakpoint: { max: 4000, min: 1440 }, items: 3 },
  desktop: { breakpoint: { max: 1440, min: 1024 }, items: 3 },
  tablet: { breakpoint: { max: 1024, min: 768 }, items: 2 },
  mobile: { breakpoint: { max: 768, min: 0 }, items: 1 },
};

const PropertyCard = ({ property, addRemoveFav, type }) => {
  
  const firstImage = property?.galleries?.[0];
  return (
    // <Link href={`/property-details/${property?.slug}`}>
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
            <Link href={`/property-details/${property?.slug}`}>
              <img
                alt=""
                className="card-img"
                src={firstImage?.image_url || property?.image}
              />
            </Link>
            <span className="ads-type rent">for {property?.post_for}</span>
            <span className={`ads-fav ${property?.is_favourite ? "active" : ""}`} onClick={() => addRemoveFav(property?.property_id, type)}>
              <i className="icon-line-awesome-heart-o"></i>
            </span>
          </div>
          <div className="card-img-overlay">
            <a
              href={`/property-details/${property?.slug}`}
              target="_blank"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <h4>{property?.property_name || `${translation?.not_available ||"Not available"}`}</h4>
            </a>

            <ul className="list-info">
              <li>
                <i className="icon-img-flat"></i> {property.type}
              </li>
              <li>
                <i className="icon-img-room"></i>{translation?.rooms || "Rooms:"}{" "}
                <span>{property?.rooms}</span>
              </li>
              <li>
                <i className="icon-img-bed"></i> {translation?.bedrooms || "Bedrooms:"}{" "}
                <span>{property?.bedrooms}</span>
              </li>
              <li>
                <i className="icon-img-ratio"></i>{" "}
                <span>{property?.area}</span> sq m
              </li>
              <li>
                <i className="icon-img-tub"></i>  {translation?.bathrooms || "Bathrooms:"}{" "}
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
              <a 
              href={`/property-details/${property?.slug}`}
              target="_blank" 
              style={{ textDecoration: "none", color: "inherit" }}
            >
              {translation?.book_now || "Book Now"}
            </a>

            </div>
          </div>
        </div>
      </article>
    </div>
    // </Link>
  );
};

const Index = () => {
  const { callApi, GetMemberId } = AuthUser();
  const router = useRouter();
  const { agent_id } = router.query;
  const formRef = useRef(null);

  const memberId = GetMemberId();

  const [agentDetailsData, setAgentDetailsData] = useState();
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [contactDetails, setContactDetails] = useState({
    name: "",
    email: "",
    contact: "",
    message: "",
  });
  const translation = useTranslation();

  useEffect(() => {
    if (agent_id) {
      fetchAgentDetails(agent_id);
    }
    setContactDetails((prevDetails) => ({
      ...prevDetails,
      user_id: memberId,
    }));
  }, [agent_id, memberId]);

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
        data: {
          ...contactDetails,
          agent_id: agent_id,
          user_id: memberId,
        },
      });

      if (response && response.status === 1) {
        toast.success(response.message || "Enquiry Send Successfully");
        setContactDetails({
          name: "",
          email: "",
          contact: "",
          message: "",
        })
        formRef?.current?.reset();
      } else {
        toast.error(response.message || "Enquiry Send Failed");
      }
    } catch (error) {
      console.error(error?.message || "Something went wrong");
    }
  };



  const addRemoveFav = async (id, type) => {
    stateFavUpdateFuncation(id, type);
    try {
      const res = await callApi({
        api: "/add_my_fav_property",
        method: "POST",
        data: {
          property_id: id,
          user_id: memberId
        }
      })

      if (res && res?.status === 1) {
        toast.success(res?.message || "Successfull");
        stateFavUpdateFuncation(id, type);
      } else {
        toast?.error(res?.message || "An error occurred. Please try again.")
      }
    } catch (error) {
      toast?.error(error?.message)
    }
  }


  const stateFavUpdateFuncation = (id, type) => {
    const list = agentDetailsData[type];
    const newList = list?.map((item, i) => {
      if (item?.property_id == id) {
        return {
          ...item,
          is_favourite: !item?.is_favourite
        }
      } else {
        return item;
      }
    })
    setAgentDetailsData(prev => {
      return {
        ...prev,
        [type]: newList
      }
    })
  }

  return (
    <MainLayout>
      <div className="short-banner">
        <div className="container">
          <h1>{translation?.agent_details || "Agent Details"}</h1>
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
                    <Link href="/">  {translation?.home || "Home"}</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                  {translation?.my_profile || "My Profile"}
                  </li>
                </ol>
              </nav>

              <div className="card mb-4">
                <div className="row g-0">
                  <div className="col-sm-auto col-4">
                    <img
                      src={agentDetailsData?.image || "/assets/images/user.jpg"}
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
                        {translation?.email || "Email:"} {agentDetailsData?.email || `${translation?.not_available ||"Not available"}`}
                      </p>
                      <p>
                        <i className="icon-feather-user text-primary"></i>{" "}
                        {translation?.contact || "Contact:"} {agentDetailsData?.contact || `${translation?.not_available ||"Not available"}`}
                      </p>
                      <div className="d-flex">
                        <a
                          role="button"
                          className="btn btn-outline-primary btn-sm me-2"
                        >
                          {translation?.whatsapp_number || "whatsapp Number"}
                        </a>
                        <a
                          role="button"
                          className="btn btn-outline-primary btn-sm"
                        >
                            {translation?.phone_number || "Phone Number"}
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
                  {translation?.write_a_review || "Write A Review"}
                </a>
              </div>

              <div className="mb-4">
                <h4>{translation?.property_on_rent || "Property on Rent"}</h4>
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
                        <PropertyCard key={property.id} property={property} addRemoveFav={addRemoveFav} type="rent" />
                      ))}
                    </Carousel>
                  )}
                </div>
              </div>

              {agentDetailsData?.sale?.length > 0 && (
                <div>
                  <h4>{translation?.property_on_sale || "Property on Sale"}</h4>
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
                        <PropertyCard key={property.id} property={property} addRemoveFav={addRemoveFav} type="sale" />
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
                  <h4>{translation?.contact_agent || "Contact Agent"}</h4>
                </div>
                <div className="card-body">
                  <form onSubmit={handleSave} ref={formRef}>
                    <div className="mb-3">
                      <label>{translation?.name || "Name"}</label>
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        required
                        onChange={handleContactDetailsChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label>{translation?.email || "Email"}</label>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        required
                        onChange={handleContactDetailsChange}
                      />
                    </div>
                    <div className="mb-3">
                      <label>{translation?.phone_number || "Phone Number"}</label>
                      <div className="d-flex">
                        <select
                          name="country_code"
                          className="form-select me-2"
                          defaultValue="+91"
                          onChange={handleContactDetailsChange}
                          style={{ maxWidth: "120px" }}
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
                      <label>{translation?.message || "Message"}</label>
                      <textarea
                        onChange={handleContactDetailsChange}
                        className="form-control"
                        rows="3"
                        name="message"
                        required
                      ></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary">
                    {translation?.send || "Send"}
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
          <Offcanvas.Title>{translation?.review_for_this_agent || "Review for this Agent"}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <AgentReview
            agentId={agent_id}
            onClose={() => setShowOffcanvas(false)}
            member_id={memberId}
          />
        </Offcanvas.Body>
      </Offcanvas>
    </MainLayout>
  );
};

export default Index;
