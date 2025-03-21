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
import { Search, EnvelopeFill, PhoneFill, Whatsapp, PersonFill } from 'react-bootstrap-icons';
import {
  Form,
  Row,
  Col,
  ListGroup,
  Button,
  Dropdown,
  ButtonGroup,
  Nav,
  ProgressBar,
  FloatingLabel,
} from "react-bootstrap";

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

      <section className="section profile">
        <div className="container-fluid">
          
        {/*             
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link href="/"> {translation?.home || "Home"}</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {translation?.my_profile || "My Profile"}
              </li>
            </ol>
          </nav> */}
          <Row>
            <Col className="col-lg-8 col-12">
              
              <div className="card border-0 shadow-sm mb-4">
                  <div className="card-body">
                    <Row className="gx-3 text-center text-sm-start">
                      <Col className="col-sm-auto col-12 mb-3 mb-sm-0">
                        <img
                          src={agentDetailsData?.image || "/assets/images/user.jpg"}
                          alt="Agent Logo"
                          height={"180"}
                        />
                      </Col>
                      <Col className="col-sm col-12">                      
                          <h4 className="mb-1">
                            {agentDetailsData?.name}{" "}
                            <i className="icon-img-check ms-1"></i>
                          </h4>
                          <p className="mb-2">Equity Real Estates L. L. C.</p>
                          <p className="mb-2">
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
                          <Row className="">
                            <Col className="col-xl col-12">                        
                              <div className="d-flex gap-2 mb-3 mb-xl-0">
                                <Button variant="" className="bg-warning-subtle" size="sm"> 
                                  <img src="/assets/images/icons/badge-award.png" alt="Badges" height={20} width={20} /> TruBroker
                                </Button>
                                <Button variant="" className="bg-primary-subtle" size="sm"> 
                                  <img src="/assets/images/icons/408472.png" alt="Badges" height={20} width={20} /> Quality Listner
                                </Button>
                                <Button variant="" className="bg-success-subtle" size="sm">
                                  <img src="/assets/images/icons/7644063.png" alt="Badges" height={20} width={20} /> Responsive Broker
                                </Button>                      
                              </div>
                            </Col>
                            <Col className="col-xl-auto col-12">
                              <div className="d-grid d-sm-flex gap-2">
                                  <Button variant="primary" size="sm">
                                    <EnvelopeFill color="white" size={16} /> Email
                                  </Button>
                                  <Button variant="info" size="sm" className="text-white">
                                    <PhoneFill color="white" size={16} /> {"Call"}
                                  </Button>
                                  <Button variant="success" size="sm">
                                    <Whatsapp color="white" size={16} /> {translation?.whatsapp || "whatsapp"}
                                  </Button>
                              </div>
                            </Col>
                          </Row>

                      </Col>
                    </Row>
                  </div>
              </div>

              {/* <div className="d-flex justify-content-end">
                <a
                  onClick={() => setShowOffcanvas(true)}
                  className="btn btn-primary"
                >
                  {translation?.write_a_review || "Write A Review"}
                </a>
              </div> */}

              <div className="card border-0 shadow-sm d-lg-none mb-4">
                <div className="card-body">
                  <h4>About</h4>
                  <p><span className="text-muted">Language(s):</span>Hindi, English, Bengali</p>
                  <p><span className="text-muted">Expertise:</span> Commercial Sales, Commercial Leasing</p>
                  <p><span className="text-muted">Service Areas:</span> Kolkata, Delhi, Pune</p>
                  <p><span className="text-muted">Properties:</span> For Sale (3), For Rent (12)</p>
                  <p><span className="text-muted d-block">Description:</span>
                  Meet Sophie a seasoned professional with extensive experience in both customer service and commercial sales 
                  </p>
                  <p><span className="text-muted">Experience:</span> 5 years</p>
                </div>
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
                                  className={`carousel-item ${index === 0 ? "active" : ""
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
                            className={`ads-fav ${property.is_favourite ? "active" : ""
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
            </Col>
            <Col className="col-lg-4 col-12">
            {/* Sidebar 
              <div className="card mb-4">
                <div className="card-header">
                  <h4>{translation?.contact_agent || "Contact Agent"}</h4>
                </div>
                <div className="card-body">
                  <form onSubmit={handleSave} ref={formRef}>
                    <FloatingLabel
                      label={translation?.name || "Name"}
                      className="mb-3"
                    >
                      <Form.Control
                        type="text"
                        name="name"
                        placeholder=""
                        required
                        onChange={handleContactDetailsChange}
                      />
                    </FloatingLabel>
                    <FloatingLabel
                      label={translation?.email || "Email"}
                      className="mb-3"
                    >
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder=""
                        required
                        onChange={handleContactDetailsChange}
                      />
                    </FloatingLabel>
                    <div className="input-group mb-3">
                      <Form.Select
                        name="country_code"
                        defaultValue="+91"
                        onChange={handleContactDetailsChange}
                        style={{ maxWidth: "120px" }}
                      >
                        {countryCode.map((code, index) => (
                          <option key={index} value={code}>
                            {code}
                          </option>
                        ))}
                      </Form.Select>
                      <FloatingLabel
                        label={translation?.phone_number || "Phone Number"}
                      >
                        <Form.Control
                          type="number"
                          name="contact"
                          placeholder=""
                          required
                          onChange={handleContactDetailsChange}
                        />
                      </FloatingLabel>
                    </div>

                    <FloatingLabel 
                      label={translation?.message || "Message"}
                      className="mb-3"
                    >
                      <Form.Control
                        as="textarea"
                        placeholder="Leave a comment here"
                        onChange={handleContactDetailsChange}
                        rows="3"
                        name="message"
                        required
                        style={{ height: '100px' }}
                      />
                    </FloatingLabel>
                    
                    <Button type="submit" variant="primary">
                      {translation?.send || "Send"}
                    </Button>
                  </form>
                </div>
              </div>
              <img
                src="/assets/images/ads/houseSaleFlyerGREEN.jpg"
                alt="Advertisement"
                className="img-fluid"
            /> */}

              <div className="d-none d-lg-block">
                <h4>About</h4>
                <p><span className="text-muted">Language(s):</span>Hindi, English, Bengali</p>
                <p><span className="text-muted">Expertise:</span> Commercial Sales, Commercial Leasing</p>
                <p><span className="text-muted">Service Areas:</span> Kolkata, Delhi, Pune</p>
                <p><span className="text-muted">Properties:</span> For Sale (3), For Rent (12)</p>
                <p><span className="text-muted d-block">Description:</span>
                Meet Sophie a seasoned professional with extensive experience in both customer service and commercial sales 
                </p>
                <p><span className="text-muted">Experience:</span> 5 years</p>
              </div>
            </Col>
          </Row>

          
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
