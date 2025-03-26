"use client";
import React, { useEffect, useState, useRef } from "react";
import MainLayout from "@/components/layout/MainLayout";
import "react-multi-carousel/lib/styles.css";
import AuthUser from "@/components/Authentication/AuthUser";
import { useRouter } from "next/router";
import Link from "next/link";
import { toast } from "react-toastify";
import { Offcanvas } from "react-bootstrap";
import AgentReview from "@/components/userReview/AgentReview";
import useTranslation from "@/hooks/useTranslation";
import EnquiryForm from "@/components/charts/EnquiryForm";
import {
  GeoAlt,
  EnvelopeFill,
  PhoneFill,
  Whatsapp,
} from "react-bootstrap-icons";
import CardImageSlider from "@/components/cardImageSlider/CardImageSlider";
import { Row, Col, Button, Modal } from "react-bootstrap";
import AgentEnquiryForm from "@/components/addtional/AgentEnquiryForm";

const Index = () => {
  const router = useRouter();
  const translation = useTranslation();
  const { callApi, GetMemberId, isLogin } = AuthUser();
  const { agent_id } = router.query;
  const formRef = useRef(null);
  const [showLoginErrorModal, setShowLoginErrorModal] = useState(false);
  const memberId = GetMemberId();
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [agentDetailsData, setAgentDetailsData] = useState();
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [propertyId, setPropertyId] = useState(null);
  const [page, setpage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [contactDetails, setContactDetails] = useState({
    name: "",
    email: "",
    contact: "",
    message: "",
  });

  const handleClick = (property_id) => {
    setPropertyId(property_id);
    setShowContactModal(true);
  };

  useEffect(() => {
    if (agent_id) {
      fetchAgentDetails(agent_id);
    }
    setContactDetails((prevDetails) => ({
      ...prevDetails,
      user_id: memberId,
    }));
  }, [agent_id, memberId, page]);

  const fetchAgentDetails = async (agent_id) => {
    setIsLoading(true);
    try {
      const response = await callApi({
        api: `/agent_details_page`,
        method: "GET",
        data: {
          agent_id: agent_id,
          current_page: page || 1,
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
    } finally {
      setIsLoading(false);
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

  const SaveFavouriteProperty = async (PropertyId) => {
    if (isLogin()) {
      try {
        const res = await callApi({
          api: `/add_my_fav_property`,
          method: "UPLOAD",
          data: {
            user_id: memberId,
            property_id: PropertyId,
          },
        });

        if (res && res.status === 1) {
          toast.success(res.message);
          favStateUpdater(PropertyId);
        } else {
          toast.error(res?.message || "An error occurred. Please try again.");
        }
      } catch (error) {
        toast.error("Failed to save the property. Please try again.");
      }
    } else {
      setShowLoginErrorModal(true);
    }
  };

  const favStateUpdater = (id) => {
    const newList = agentDetailsData?.properties?.map((item) => {
      if (item?.property_id === id) {
        return {
          ...item,
          is_favourite: !item.is_favourite,
        };
      }
      return item;
    });

    setAgentDetailsData((prevState) => ({
      ...prevState,
      properties: newList,
    }));
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

  const handleContactClose = () => setShowContactModal(false);
  const handleEnquiryClose = () => setShowEnquiryModal(false);

  const handleShowEnquiryModal = () => {
    setShowEnquiryModal(!showEnquiryModal);
  };

  const handleLoginErrorClose = () => setShowLoginErrorModal(false);

  const handleLoadMoreClick = (newPage) => {
    setpage(newPage);
  };

  return (
    <MainLayout>
      <div className="short-banner">
        <div className="container">
          <h1>{translation?.agent_details || "Agent Details"}</h1>
        </div>
      </div>

      <section className="section profile">
        <div className="container-fluid">
          <Row>
            <Col className="col-lg-8 col-12">
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-body">
                  <Row className="gx-3 text-center text-sm-start">
                    <Col className="col-sm-auto col-12 mb-3 mb-sm-0">
                      <img
                        src={
                          agentDetailsData?.image || "/assets/images/user.jpg"
                        }
                        alt="Agent Logo"
                        height={"180"}
                      />
                    </Col>
                    <Col className="col-sm col-12">
                      <h4 className="mb-1">
                        {agentDetailsData?.name}{" "}
                        <i className="icon-img-check ms-1"></i>
                      </h4>
                      <p className="mb-2 ">
                        <i className="icon-img-company"></i>
                        {agentDetailsData?.company_name || "Not Available"}
                      </p>
                      <p className="mb-2">
                        <i className="icon-feather-mail text-primary"></i>{" "}
                        {agentDetailsData?.email ||
                          `${translation?.not_available || "Not available"}`}
                      </p>
                      <p>
                        <i className="icon-feather-phone text-primary"></i>{" "}
                        {agentDetailsData?.phone ||
                          `${translation?.not_available || "Not available"}`}
                      </p>
                      <Row className="">
                        <Col className="col-xl col-12">
                          <div className="d-flex gap-2 mb-3 mb-xl-0">
                            <Button
                              variant=""
                              className="bg-warning-subtle"
                              size="sm"
                            >
                              <img
                                src="/assets/images/icons/badge-award.png"
                                alt="Badges"
                                height={20}
                                width={20}
                              />{" "}
                              TruBroker
                            </Button>
                            <Button
                              variant=""
                              className="bg-primary-subtle"
                              size="sm"
                            >
                              <img
                                src="/assets/images/icons/408472.png"
                                alt="Badges"
                                height={20}
                                width={20}
                              />{" "}
                              Quality Listner
                            </Button>
                            <Button
                              variant=""
                              className="bg-success-subtle"
                              size="sm"
                            >
                              <img
                                src="/assets/images/icons/7644063.png"
                                alt="Badges"
                                height={20}
                                width={20}
                              />{" "}
                              Responsive Broker
                            </Button>
                          </div>
                        </Col>
                        <Col className="col-xl-auto col-12">
                          <div className="d-grid d-sm-flex gap-2">
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => setShowEnquiryModal(true)}
                            >
                              <EnvelopeFill color="white" size={16} /> Email
                            </Button>
                            <Button
                              variant="info"
                              size="sm"
                              className="text-white"
                              onClick={() => setShowEnquiryModal(true)}
                            >
                              <PhoneFill color="white" size={16} /> {"Call"}
                            </Button>
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => setShowEnquiryModal(true)}
                            >
                              <Whatsapp color="white" size={16} />{" "}
                              {translation?.whatsapp || "whatsapp"}
                            </Button>
                          </div>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </div>
              </div>

              <div className="card border-0 shadow-sm d-lg-none mb-4">
                <div className="card-body">
                  <h4>About</h4>
                  <p>
                    <span className="text-muted">Broker Type:</span>
                    {agentDetailsData?.broker_type === "I"
                      ? "Indepedent"
                      : agentDetailsData?.broker_type === "F"
                      ? "Franchise"
                      : agentDetailsData?.broker_type === "A"
                      ? "Agent"
                      : "Not Available"}
                  </p>
                  <p>
                    <span className="text-muted">Expertise:</span>{" "}
                    {agentDetailsData?.specialization || "Not Available"}
                  </p>
                  <p>
                    <span className="text-muted">Address:</span>{" "}
                    {agentDetailsData?.address || "Not Available"}
                  </p>
                  <p>
                    <span className="text-muted">Service Areas: </span>
                    {[
                      ...new Set(
                        agentDetailsData?.service_area?.map((area) => area.city)
                      ),
                    ].join(", ")}
                  </p>
                  <p>
                    <span className="text-muted">Social Media: </span>
                    {[
                      ...new Set(
                        agentDetailsData?.social?.map(
                          (area) => area.platform_name
                        )
                      ),
                    ].join(", ")}
                  </p>
                  <p>
                    <span className="text-muted">Properties:</span> For Sale (
                    {agentDetailsData?.forSell}), For Rent (
                    {agentDetailsData?.forRent})
                  </p>
                  <p>
                    <span className="text-muted">Licence Number:</span>{" "}
                    {agentDetailsData?.license_no || "Not Available"}
                  </p>
                  <p>
                    <span className="text-muted">Business Phone:</span>{" "}
                    {agentDetailsData?.bussiness_phone || "Not Available"}
                  </p>
                  <p>
                    <span className="text-muted">Business Email:</span>{" "}
                    {agentDetailsData?.bussiness_email || "Not Available"}
                  </p>
                  <p>
                    <span className="text-muted">Company Name:</span>{" "}
                    {agentDetailsData?.company_name || "Not Available"}
                  </p>
                  <p>
                    <span className="text-muted">Working Hours:</span>{" "}
                    {agentDetailsData?.opening_hours} -{" "}
                    {agentDetailsData?.closing_hours}
                  </p>
                  <p>
                    <span className="text-muted d-block">Description:</span>
                    {agentDetailsData?.description || "Not Available"}
                  </p>
                  <p>
                    <span className="text-muted">Experience:</span>{" "}
                    {agentDetailsData?.experience_yr || "Not Available"}
                    {agentDetailsData?.experience_yr && "Years"}
                  </p>
                </div>
              </div>

              <div className="list-display">
                {isLoading ? (
                  <div className="loading-spinner">
                    <div
                      className="spinner-border"
                      role="status"
                      color="current"
                    >
                      <span className="visually-hidden">
                        {translation?.loading || "Loading...."}
                      </span>
                    </div>
                  </div>
                ) : agentDetailsData?.properties?.length > 0 ? (
                  agentDetailsData?.properties?.map((property, i) => {
                    return (
                      <div key={property.property_id} className="card card-ads">
                        <div className="row g-0">
                          <div className="col-lg-3 col-sm-3">
                            <CardImageSlider
                              data={property}
                              showSq={true}
                              icons={true}
                              addRemoveFav={() =>
                                SaveFavouriteProperty(property.property_id)
                              }
                            />
                          </div>

                          <div className="col-lg-9 col-sm-9 position-relative">
                            <div className="card-body">
                              <h4 className="mb-1">
                                <Link
                                  href={`/property-details/${property.slug}`}
                                >
                                  {property.property_name}
                                </Link>
                              </h4>
                              <h5 className="mb-0">
                                {property?.price_currency && property?.exp_price
                                  ? `${
                                      property.price_currency
                                    } ${new Intl.NumberFormat("en-US").format(
                                      property.exp_price
                                    )}`
                                  : "Price not available"}
                              </h5>

                              <p className="mb-1">
                                <small>
                                  Average Price:{" "}
                                  {property?.price_currency ||
                                    property?.currency ||
                                    ""}{" "}
                                  {property?.area_in_sqft || ""}
                                  {" sq/ft"}
                                </small>{" "}
                              </p>
                              <ul className="list-info mb-2">
                                <li>
                                  <i
                                    className="icon-img-bed"
                                    title="Bedrooms:"
                                  ></i>
                                  <span>
                                    {property?.bedrooms || "Not Available"}
                                  </span>{" "}
                                  {property?.bedrooms && "Beds"}
                                </li>
                                <li>
                                  <i
                                    className="icon-img-tub"
                                    title="Bathrooms:"
                                  ></i>
                                  <span>
                                    {property?.bathroom || "Not Available"}
                                  </span>{" "}
                                  {property?.bedrooms && "Bath"}
                                </li>
                                <li>
                                  <i
                                    className="icon-img-ratio"
                                    title="Carpet Area:"
                                  ></i>
                                  <span>
                                    {property?.carpet_area || "Not Available"}
                                    {property?.carpet_area &&
                                      property?.unit_type}
                                  </span>{" "}
                                  {property?.carpet_area && "Carpet Area"}
                                </li>
                                <li>
                                  <i
                                    className="icon-img-check"
                                    title="Possession Status"
                                  ></i>
                                  <span>
                                    {translation?.possession_status ||
                                      "Possession Status:"}{" "}
                                    {property?.possession_status ||
                                      "Not Available"}
                                  </span>
                                </li>
                              </ul>
                              <p>
                                <span className="text-primary">
                                  <GeoAlt color="currentColor" size={14} />
                                </span>{" "}
                                {property.property_address || "Not Available"}
                              </p>
                            </div>
                            <div className="card-footer d-flex justify-content-between align-items-center">
                              <div className="d-flex">
                                <img
                                  className="rounded-circle"
                                  src={`${
                                    property?.user_image ||
                                    "/assets/images/user.jpg"
                                  }`}
                                  alt="Company"
                                  height={36}
                                  width={36}
                                />
                                <div className="ps-2">
                                  <h6 className="mb-0">
                                    {property?.user_name || "User"}
                                  </h6>
                                  <p className="small text-muted">
                                    {property?.user_type === "A"
                                      ? "Agent"
                                      : property?.user_type === "/"
                                      ? "Builder"
                                      : property?.user_type === "O"
                                      ? "Owner"
                                      : "Not Available"}
                                  </p>
                                </div>
                              </div>
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() =>
                                  handleClick(property.property_id)
                                }
                              >
                                {translation?.contact_now || "Contact Now"}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <>
                    <div className="card border-0 text-center">
                      <div className="card-body">
                        <img
                          src="/assets/images/icons/9939447.png"
                          alt="Icon"
                          height={48}
                          width={48}
                          className="mb-2"
                        />
                        <p className="text-muted">
                          {translation?.no_record_founds || "No Record Founds"}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* LOAD MORE  */}
              {!isLoading && currentPage < totalPage &&  (
                <button
                  className="btn btn-primary d-block mx-auto mt-4"
                  onClick={() => handleLoadMoreClick(page + 1)}
                >
                  {translation?.load_more || "Load More"}
                </button>
              )}
            </Col>
            <Col className="col-lg-4 col-12">
              <div className="d-none d-lg-block mb-2">
                <h4>About</h4>
                <p>
                  <span className="text-muted">Broker Type:</span>
                  {agentDetailsData?.broker_type === "I"
                    ? "Indepedent"
                    : agentDetailsData?.broker_type === "F"
                    ? "Franchise"
                    : agentDetailsData?.broker_type === "A"
                    ? "Agent"
                    : "Not Available"}
                </p>
                <p>
                  <span className="text-muted">Expertise:</span>{" "}
                  {agentDetailsData?.specialization || "Not Available"}
                </p>
                <p>
                  <span className="text-muted">Address:</span>{" "}
                  {agentDetailsData?.address || "Not Available"}
                </p>
                <p>
                  <span className="text-muted">Service Areas: </span>
                  {[
                    ...new Set(
                      agentDetailsData?.service_area?.map((area) => area.city)
                    ),
                  ].join(", ")}
                </p>
                <p>
                  <span className="text-muted">Social Media: </span>
                  {[
                    ...new Set(
                      agentDetailsData?.social?.map(
                        (area) => area.platform_name
                      )
                    ),
                  ].join(", ")}
                </p>
                <p>
                  <span className="text-muted">Properties:</span> For Sale (
                  {agentDetailsData?.forSell}), For Rent (
                  {agentDetailsData?.forRent})
                </p>
                <p>
                  <span className="text-muted">Licence Number:</span>{" "}
                  {agentDetailsData?.license_no || "Not Available"}
                </p>
                <p>
                  <span className="text-muted">Business Phone:</span>{" "}
                  {agentDetailsData?.bussiness_phone || "Not Available"}
                </p>
                <p>
                  <span className="text-muted">Business Email:</span>{" "}
                  {agentDetailsData?.bussiness_email || "Not Available"}
                </p>
                <p>
                  <span className="text-muted">Company Name:</span>{" "}
                  {agentDetailsData?.company_name || "Not Available"}
                </p>
                <p>
                  <span className="text-muted">Working Hours:</span>{" "}
                  {agentDetailsData?.opening_hours} -{" "}
                  {agentDetailsData?.closing_hours}
                </p>
                <p>
                  <span className="text-muted d-block">Description:</span>
                  {agentDetailsData?.description || "Not Available"}
                </p>
                <p>
                  <span className="text-muted">Experience:</span>{" "}
                  {agentDetailsData?.experience_yr || "Not Available"}
                  {agentDetailsData?.experience_yr && "Years"}
                </p>
              </div>
              <img
                src="/assets/images/ads/houseSaleFlyerGREEN.jpg"
                alt="Advertisement"
                className="img-fluid"
              />
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

      <Modal show={showContactModal} onHide={handleContactClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {translation?.contact_owner || "Contact Owner"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EnquiryForm
            propertyId={propertyId}
            handleClose={handleContactClose}
          />
        </Modal.Body>
      </Modal>

      <Modal show={showEnquiryModal} onHide={handleEnquiryClose}>
        <Modal.Header closeButton>
          <Modal.Title>Contact Agent</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AgentEnquiryForm
            agentId={agent_id}
            handleClose={handleEnquiryClose}
          />
        </Modal.Body>
      </Modal>

      {/* Modal for login error */}
      <Modal
        show={showLoginErrorModal}
        onHide={handleLoginErrorClose}
        centered
        size="lg"
      >
        <Modal.Header>
          <button
            className="btn btn-secondary"
            onClick={handleLoginErrorClose}
            style={{ position: "absolute", left: "15px" }}
          >
            {translation?.cancel || "Cancel"}
          </button>
          <Modal.Title className="mx-auto">
            {" "}
            {translation?.login_required || "Login Required"}
          </Modal.Title>
          <button
            className="btn btn-danger"
            onClick={() => {
              handleLoginErrorClose();
              router?.push("/login");
            }}
            style={{ position: "absolute", right: "15px" }}
          >
            {translation?.login || "Login"}
          </button>
        </Modal.Header>
        <Modal.Body>
          <p className="text-center">
            {translation?.please_log_in_to_perform_this_action ||
              "Please log in to perform this action."}
          </p>
        </Modal.Body>
      </Modal>
    </MainLayout>
  );
};

export default Index;
