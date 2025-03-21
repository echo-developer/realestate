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
const countryCode = ["IND +91", "+81", "+71", "+61", "+51"];
import useTranslation from "@/hooks/useTranslation";

const Index = () => {
  const translation = useTranslation();
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
        });
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
          user_id: memberId,
        },
      });

      if (res && res?.status === 1) {
        toast.success(res?.message || "Successfull");
        stateFavUpdateFuncation(id, type);
      } else {
        toast?.error(res?.message || "An error occurred. Please try again.");
      }
    } catch (error) {
      toast?.error(error?.message);
    }
  };

  const stateFavUpdateFuncation = (id, type) => {
    const list = agentDetailsData[type];
    const newList = list?.map((item, i) => {
      if (item?.property_id == id) {
        return {
          ...item,
          is_favourite: !item?.is_favourite,
        };
      } else {
        return item;
      }
    });
    setAgentDetailsData((prev) => {
      return {
        ...prev,
        [type]: newList,
      };
    });
  };


  console.log(agentDetailsData)


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
                    <Link href="/"> {translation?.home || "Home"}</Link>
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
                        {translation?.email || "Email:"}{" "}
                        {agentDetailsData?.email ||
                          `${translation?.not_available || "Not available"}`}
                      </p>
                      <p>
                        <i className="icon-feather-user text-primary"></i>{" "}
                        {translation?.contact || "Contact:"}{" "}
                        {agentDetailsData?.contact ||
                          `${translation?.not_available || "Not available"}`}
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

              <div className="list-display">
                {agentDetailsData?.properties?.map((property) => (
                  <div className="card card-ads" key={property.property_id}>
                    <div className="row g-0">
                      <div className="col-lg-3 col-sm-3">
                        <div className="card-image">
                          <div className="carousel slide ads-carousel">
                            <div className="carousel-inner">
                              {property?.galleries?.map((gallery, index) => (
                                <div
                                  key={index}
                                  className={`carousel-item ${
                                    index === 0 ? "active" : ""
                                  }`}
                                >
                                  <img
                                    alt="Property"
                                    className="card-img-top"
                                    src={gallery.image_url}
                                  />
                                </div>
                              ))}
                            </div>
                            <button
                              className="carousel-control-prev"
                              type="button"
                            >
                              <span
                                className="carousel-control-prev-icon"
                                aria-hidden="true"
                              ></span>
                              <span className="visually-hidden">Previous</span>
                            </button>
                            <button
                              className="carousel-control-next"
                              type="button"
                            >
                              <span
                                className="carousel-control-next-icon"
                                aria-hidden="true"
                              ></span>
                              <span className="visually-hidden">Next</span>
                            </button>
                          </div>
                          <span className={`ads-type ${property.post_for}`}>
                            {property.post_for}
                          </span>
                          <span
                            className={`ads-fav ${
                              property.is_favourite ? "active" : ""
                            }`}
                          >
                            <i className="icon-line-awesome-heart-o"></i>
                          </span>
                          <span className="total-ad-pic">
                            <i className="bi bi-camera"></i>{" "}
                            {property?.galleries?.length}
                          </span>
                        </div>
                      </div>
                      <div className="col-lg-9 col-sm-9 position-relative">
                        <div className="card-body">
                          <h4 className="mb-1">
                            <a
                              href={`/property-details/${property.property_type_for}&id=${property.property_id}`}
                            >
                              {property.property_type_for} FOR{" "}
                              {property.post_for}
                            </a>
                          </h4>
                          <h5 className="mb-0">
                            {property.expected_price
                              ? `AED ${property.expected_price}`
                              : "Price not available"}
                          </h5>
                          <ul className="list-info mb-2">
                            <li>
                              <i className="icon-img-bed" title="Bedrooms"></i>
                              <span>{property.bedrooms}</span> Beds
                            </li>
                            <li>
                              <i className="icon-img-tub" title="Bathrooms"></i>
                              <span>{property.bathrooms}</span> Bath
                            </li>
                            <li>
                              <i
                                className="icon-img-ratio"
                                title="Carpet Area"
                              ></i>
                              <span>
                                {property.carpet_area || "Not Available"} sqft
                              </span>
                            </li>
                          </ul>
                          <p>
                            <span className="text-primary">
                              <i className="bi bi-geo-alt"></i>
                            </span>
                            {property.property_address ||
                              "Address not available"}
                          </p>
                        </div>
                        <div className="card-footer d-flex justify-content-between align-items-center">
                          <div className="d-flex">
                            <img
                              className="rounded-circle"
                              alt="User"
                              height="36"
                              width="36"
                              src="/assets/images/user.jpg"
                            />
                            <div className="ps-2">
                              <h6 className="mb-0">User</h6>
                              <p className="small text-muted">Not Available</p>
                            </div>
                          </div>
                          <button className="btn btn-primary btn-sm">
                            Contact Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
                      <label>
                        {translation?.phone_number || "Phone Number"}
                      </label>
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
          <Offcanvas.Title>
            {translation?.review_for_this_agent || "Review for this Agent"}
          </Offcanvas.Title>
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
