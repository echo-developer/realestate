"use client";
import React, { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import AuthUser from "@/components/Authentication/AuthUser";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";
import Locality from "@/components/Locality/Locality";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthProvider";
import useTranslation from "@/hooks/useTranslation";
import AgentEnquiryForm from "@/components/addtional/AgentEnquiryForm";
import {
  Search,
  GeoAlt,
  EnvelopeFill,
  PhoneFill,
  Whatsapp,
  Mic,
} from "react-bootstrap-icons";
import NextImage from "next/image";
import {
  Form,
  Row,
  Col,
  Card,
  ListGroup,
  Button,
  Dropdown,
  ButtonGroup,
  Nav,
  ProgressBar,
  FloatingLabel,
  Badge,
  Modal
} from "react-bootstrap";
const Index = () => {
  const translation = useTranslation();
  const [isVerified, setIsVerified] = useState(false);
  const { callApi } = AuthUser();
  const router = useRouter();
  const [PropertyTypeData, setPropertyTypeData] = useState([]);
  const [agentList, setAgentList] = useState([]);
  const [perPage, setPerPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPages, setCurrentPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [locality, setLocality] = useState(null);
  const { defaultCity, getBadgeButtonClass, buildAgentUrl } = useAuth();
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [dropdownState, setDropdownState] = useState({});
  const [brokerType, setBrokerType] = useState("A");
  const [propertyType, setPropertyType] = useState("");
  const [propertyTypeDropDown, setPropertyTypeDropDown] = useState(false);
  const [selectedTab, setSelectedTab] = useState("sale");
  const [selectedPropertyType, setSelectedPropertyType] = useState("");
  const [badgeList, setBadgeList] = useState([]);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState("");
  const [adminWhatsapp, setAdminWhatsapp] = useState("");

  useEffect(() => {
    FetchPropertyTypeData();
    getBagesDetails();
    fetchAdminWhatsapp();
  }, []);


  const fetchAdminWhatsapp = async () => {
    try {
      const res = await callApi({
        api: `/get-settings-value/admin-whatsapp-number`,
        method: "GET",
      })
      if(res && res?.status == 1) {
        setAdminWhatsapp(res.value || "")
      }
    } catch (error) {
      console.error(error.message || "Something went wrong")
    }
  }

  const FetchPropertyTypeData = async () => {
    let response;
    try {
      response = await callApi({
        api: `/get_property_type`,
        method: "GET",
      });
      if (response && response.data) {
        setPropertyTypeData(response.data);
      }
    } catch (error) {
      console.error(response.message);
    }
  };

  const getBagesDetails = async () => {
    try {
      const res = await callApi({
        api: `/badge-list`,
        method: 'GET'
      })
      if (res && res.status == 1) {
        setBadgeList(res?.data || [])
      }

    } catch (error) {
      console.error(error.message || "Something went wrong")
    }
  }


  useEffect(() => {
    if (router?.isReady) {
      const {
        name,
        broker_type,
        post_for,
        property_type,
        is_verified_agent,
        locality
      } = router?.query || {};

      if (name) setName(name);
      if (broker_type) setBrokerType(broker_type);
      if (property_type) setPropertyType(property_type);
      if (is_verified_agent) setIsVerified(JSON.parse(is_verified_agent));
      if (locality) setLocality(JSON.parse(locality))

    }
  }, [router?.isReady, router?.query]);

  const displayPropertyType = () => {
    const selectedType = PropertyTypeData?.find(
      (type) => String(type.category_id) === String(propertyType)
    );
    return selectedType ? selectedType.category_name : "Select Property Type";
  };

  useEffect(() => {
    if (router?.isReady && defaultCity) {
      FetchAgentList();
    }
  }, [router?.query, defaultCity]);

  const FetchAgentList = async (loadMore = false, newPage = 1) => {
    const {
      page = newPage,
      name,
      broker_type,
      property_type,
      post_for,
      is_verified_agent,
      locality
    } = router?.query || {};

    if (!loadMore) setLoading(true);

    // Construct data object
    const data = { page, city_id: defaultCity?.city_id };

    if (name) {
      data.name = name;
      setSearchQuery(name);
    }
    if (broker_type) {
      data.broker_type = broker_type;
      setSearchQuery(broker_type);
    }
    if (post_for) {
      data.post_for = post_for;
      setSearchQuery(post_for);
    }
    if (property_type) {
      data.property_type = property_type;
      setSearchQuery(property_type);
    }
    if (is_verified_agent) {
      data.is_verified_agent = JSON.parse(is_verified_agent);
      setIsVerified(data.is_verified_agent);
    }
    if (locality) {
      const parsedLocality = JSON.parse(locality);
      data.locality = parsedLocality.locality_id;
    }


    // API call
    try {
      const response = await callApi({
        api: "/agent_list",
        method: "GET",
        data,
      });

      if (response?.status === 1) {
        if (loadMore) {
          setAgentList((prev) => [...prev, ...response?.data]);
        } else {
          setAgentList(response?.data);
          if (response?.data?.length === 0) {
            console.error(response?.message || "No agent found");
          }
        }
        setTotalPages(response?.pagination?.total_pages || 0);
        setCurrentPages(response?.pagination?.current_page || 0);
      } else {
        console.error(response?.message || "Failed to fetch agents");
      }
    } catch (error) {
      console.error(error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMoreClick = (nextPage) => {
    setPerPage(nextPage);
    FetchAgentList(true, nextPage);
  };

  const handleSearchChange = (e) => {
    setName(e.target.value);
  };

  const onSelectLocality = (locality) => {
    setLocality(locality)
  }

  const handleVerifiedAgentChange = () => {
    const params = new URLSearchParams(window.location.search);
    params.set("is_verified_agent", !isVerified);
    const newUrl = `${window.location?.pathname}?${params.toString()}`;
    router.push(newUrl);
  };

  const handleEnquiryClose = () => setShowEnquiryModal(false);

  const handleSelect = (agent) => {
    setBrokerType(agent);
  };
  const handlePropertyType = (type) => {
    setPropertyType(type);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    let url = `/agent-list?page=${perPage}`;
    if (name) {
      url = `${url}&name=${name}`;
    }
    if (brokerType) {
      url = `${url}&broker_type=${brokerType}`;
    }
    if (selectedTab) {
      url = `${url}&post_for=${selectedTab}`;
    }
    if (locality) {
      url = `${url}&locality=${JSON.stringify(locality)}`
    }
    if (propertyType) {
      url = `${url}&property_type=${propertyType}`;
    }
    router.push(url);
  };
  const handlePropertyTypeDropDown = (e) => {
    if (e.currentTarget.getAttribute("data-id") === "parent") {
      setPropertyTypeDropDown((prev) => !prev);
    }
  };
  const handleTab = (tab) => {
    setSelectedTab(tab);
    setSelectedPropertyType("");
  };
  const handleSelectPropertyType = (id) => {
    setSelectedPropertyType(id);
    handlePropertyType(id);
  };
  const resetSelection = () => {
    setSelectedPropertyType("");
    setPropertyTypeDropDown(false);
  };

  const toggleDropdown = (key) => {
    setDropdownState(prevState => {
      const newState = { ...prevState };
      if (!newState[key]) {
        newState[key] = true;
        setIsOverlayVisible(true); // Show overlay when dropdown is open
      } else {
        newState[key] = false;
        setIsOverlayVisible(false); // Hide overlay when dropdown is closed
      }

      // Close other dropdowns when one is opened
      Object.keys(newState).forEach(k => {
        if (k !== key) newState[k] = false;
      });

      return newState;
    });
  };

  const handleClickOutside = (e) => {
    // If clicked outside the dropdown and overlay, close all dropdowns
    if (!e.target.closest('.dropdown') && !e.target.closest('.overlay')) {
      setDropdownState({});
      setIsOverlayVisible(false);
    }
  };

  const handleWhatsappClick = (agent) => {
    const phoneNumber = adminWhatsapp;
    const message = `Agent Name = ${agent.name} \nAgent Id = ${agent.user_id}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    window.open(whatsappURL, '_blank');
  };


  return (
    <>
      {isOverlayVisible && (
        <div
          className="page-overlay"
          onClick={handleClickOutside}
        ></div>
      )}
      <MainLayout>
        <Helmet>
          <title>
            {translation?.trusted_property_experts_near_you ||
              "Find Real Estate Agents | Trusted Property Experts Near You"}
          </title>
          <meta
            name="description"
            content="Browse a list of experienced real estate agents ready to help you buy, sell, or rent properties. Find the perfect agent to assist with your property journey today!"
          />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Helmet>

        <aside className="col-lg col-12">
          <div className="short-banner pt-3">
            <div className="container-fluid">
              <div className="filterHeader d-lg-none">
                <h4> {translation?.filters || "Filters"}</h4>
                <a className="float-end" title="Filter">
                  <i className="icon-feather-filter f20"></i>
                </a>
              </div>
              <div className="filter">
                <div className="card-header filterHeader d-lg-none mb-4">
                  <div className="row d-flex">
                    <div className="col text-left">
                      <h4> {translation?.filters || "Filters"}</h4>
                    </div>
                    <div className="col">
                      <a className="close_filter" title="Filter">
                        <i className="icon-feather-x f20"></i>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="acc-panel">
                  <form data-filter="n" onSubmit={handleSubmit}>
                    <Row className="gx-3">
                      <Col className="col-lg-auto col-sm-2 col-auto" onClick={() => toggleDropdown('agent_type')}>
                        <Dropdown className="d-grid select-dropdown" show={dropdownState?.agent_type}>
                          <Dropdown.Toggle
                            variant="light"
                            className="btn-form-control"
                          >
                            {brokerType === "A"
                              ? "Agency"
                              : brokerType === "F"
                                ? "Francise"
                                : "Independent"}
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item onClick={() => handleSelect("I")}>
                              {"Independent"}
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleSelect("A")}>
                              {"Agency"}
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </Col>

                      {/* Name Search */}
                      <Col className="col-lg col-sm-6 col-12">
                        <Form.Group className="form-field with-icon-start">
                          <Search color="gray" size={14} />
                          <Form.Control
                            type="text"
                            name="nameSearch"
                            id="nameSearch"
                            className="address-box"
                            placeholder={
                              translation?.search_by_name || "Search by Name"
                            }
                            autoComplete="off"
                            value={name || ""}
                            onChange={handleSearchChange}
                          />
                        </Form.Group>
                      </Col>

                      <Col className="col-lg col-sm-6 col-12">
                        <Locality onSelectLocality={onSelectLocality} />
                      </Col>

                      {/* Submit Button */}
                      <Col className="col-lg-auto col-sm-6 col-12">
                        <div className="d-grid">
                          <button type="submit" className="btn btn-light">
                            {translation?.search || "Search"}
                          </button>
                        </div>
                      </Col>
                    </Row>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="p-lg-4 p-3">
            <Row>
              <Col className="col-xl-9 col-lg-8 col-12">
                <div className="d-sm-flex justify-content-between align-items-center mb-3">
                  <h4 className="flex-grow-1 mb-3 mb-sm-0">
                    {translation?.agent_list || "Agent List"} (
                    {agentList.length ||
                      `${translation?.not_available || "Not available"}`}
                    )
                  </h4>
                  <div className="flex-shrink-0">
                    <div className="d-flex">
                      <span className="me-3">
                        {translation?.verified_agents || "Verified agents"}{" "}
                      </span>
                      <Form.Check
                        type="switch"
                        id="custom-switch"

                        checked={isVerified}
                        onChange={handleVerifiedAgentChange}
                      />
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col className="col-xl-9 col-lg-8 col-12">
                {/* Main Content */}

                {loading && (
                  <div className="loading-spinner">
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">
                        {" "}
                        {translation?.loading || "Loading...."}{" "}
                      </span>
                    </div>
                  </div>
                )}
                {!loading && agentList?.length > 0 && (
                  <Row className="list-display ">
                    {agentList.map((agent) => (
                      <Col className="col-12" key={agent.id}>
                        <Card className="card-agent">
                          <Row className="gx-0">
                            <Col xs={3}>
                              <div className="card-image">
                                <a>
                                  <img
                                    src={agent?.image || "/assets/images/agents/user.jpg"}
                                    alt={agent?.name || "User"}
                                    className="img-fluid"
                                  />
                                </a>
                                <div className="rent-sale">
                                  <Badge bg="warning" text="black" className="rounded-0 me-2">
                                    {agent?.forSell} {translation?.sale || "SALE"}
                                  </Badge>

                                  <Badge bg="success" className="rounded-0 me-2">
                                    {agent?.forRent} {translation?.rent || "RENT"}
                                  </Badge>
                                </div>
                              </div>
                            </Col>
                            <Col lg xs={9}>
                              <Card.Body>
                                <Card.Title as='h4' className="mb-2">
                                  <a href={buildAgentUrl(agent)}>{agent?.name || "Not Available"}</a>
                                  {agent?.is_verified_agent && (
                                    <span title="Verified">
                                      <i className="icon-img-check ms-1"></i>
                                    </span>
                                  )}
                                </Card.Title>

                                {/* 🏅 Badges Section */}
                                {agent?.userbadges?.length > 0 && (
                                  <div className="d-flex flex-wrap gap-2 mb-2">
                                    {agent.userbadges.map((badge) => (
                                      <>
                                        <Badge
                                          variant=""
                                          className={getBadgeButtonClass(badge.name)}
                                          size="sm"
                                          title={badge.description}
                                          key={badge.badge_id}
                                        >
                                          <img
                                            src={badge.icon}
                                            alt={badge.name}
                                            className="me-1"
                                            height={18}
                                            width={18}
                                          />{" "}{badge.name}
                                        </Badge>
                                      </>
                                    ))}
                                  </div>
                                )}


                                {/* Company Name */}

                                {agent?.company_name && (
                                  <>
                                    <p className="mb-1 d-flex align-items-center gap-2">
                                      <i className="icon-img-company"></i>
                                      <span>{agent?.company_name || ""}</span>
                                    </p>
                                  </>
                                )}

                                <p className="mb-2"><Mic color="#1365CF" size={18} /> Speak: <span className="text-muted">{agent?.languages ? agent.languages.replace(/,/g, ', ') : ''}</span></p>
                                {/* Phone
                                  <p className="mb-2">
                                    <i className="icon-feather-phone"></i>{" "}
                                    {agent.phone || "Not Available"}
                                  </p> */}

                                {/* Email
                                  <p className="mb-2">
                                    <i className="icon-feather-mail"></i>{" "}
                                    {agent.email || "Not Available"}
                                  </p> */}

                                {/* Service Area */}
                                {agent?.service_area?.length > 0 && (
                                  <p className="mb-2">
                                    <GeoAlt color="#1365CF" size={18} /> {translation?.serve_in || "Serve in"}{": "}
                                    <span className="text-muted">
                                      {[...new Set(agent?.service_area?.map(area => area.locality?.locality_name))].join(", ")}
                                    </span>
                                  </p>
                                )}

                                <div className="d-flex gap-2">
                                  <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedAgentId(agent.user_id)
                                      setShowEnquiryModal(true)
                                    } 
                                    }
                                  >
                                    <EnvelopeFill color="#1365CF" size={16} /> {translation?.email || "Email"}
                                  </Button>
                                  <Button
                                    variant="outline-info"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedAgentId(agent.user_id)
                                      setShowEnquiryModal(true)
                                    } }
                                    style={{ minWidth: '72px' }}
                                  >
                                    <PhoneFill color="#0dcaf0" size={16} /> {translation?.call || "Call"}
                                  </Button>
                                  <Button
                                    variant="outline-success"
                                    size="sm"
                                    onClick={() => {
                                      handleWhatsappClick(agent)
                                    }}
                                  >
                                    <Whatsapp color="#198754" size={16} />{" "}
                                    {translation?.whatsapp || "whatsapp"}
                                  </Button>


                                </div>
                              </Card.Body>
                            </Col>
                            <Col lg='auto' className="p-3 align-self-end text-lg-end">
                            {agent?.company_logo && (
                              <NextImage
                                src={agent?.company_logo}
                                alt="Company Logo"
                                width={48}
                                height={48}
                                className="mb-3"
                                priority
                              />
                            )}
                              {agent?.user_id && (
                                <div>
                                  <a
                                    className="btn btn-primary btn-sm ms-auto"
                                    href={buildAgentUrl(agent)}
                                  >
                                    {translation?.view_profile || "View Profile"}
                                  </a>
                                </div>
                              )}
                            </Col>
                          </Row>
                        </Card>
                      </Col>
                    ))}

                  </Row>
                )}
                {!loading && agentList?.length === 0 && (
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
                {currentPages < totalPages && (
                  <button
                    className="btn btn-primary btn-lg d-block mx-auto mt-4"
                    onClick={() => handleLoadMoreClick(perPage + 1)}
                  >
                    {translation?.load_more || "Load More"}
                  </button>
                )}
              </Col>
              <Col className="col-xl-3 col-lg-4 col-12">
                <div className="card text-center border-0 shadow-1">
                  <div className="card-body">
                    <img
                      src="/assets/images/icons/award.png"
                      alt="Badges"
                      className="mb-2"
                      height={64}
                      width={64}
                    />
                    <h4>{translation?.how_do_agents_earn_badges || "How do agents earn badges?"}
                    </h4>
                    <p>
                      {translation?.badge_info || "To highlight great performance, we reward agents with customised badges on Realestate."}

                    </p>
                    {badgeList?.length > 0 && badgeList?.map((badge, i) => {
                      return (
                        <>
                          <h5 key={i}>
                            <img
                              src={badge?.icon || '/assets/images/icons/badge-award.png'}
                              alt="Badges"
                              className="mb-2"
                              height={32}
                              width={32}
                            />{" "}
                            {badge?.name}

                          </h5>
                          <p className="text-italic text-muted small">
                            {badge?.description}

                          </p>
                        </>
                      )
                    })}
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </aside>
      </MainLayout>

      <Modal show={showEnquiryModal} onHide={handleEnquiryClose}>
        <Modal.Header closeButton>
          <Modal.Title>{translation?.contact_agent || "Contact Agent"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AgentEnquiryForm
            agentId={selectedAgentId}
            handleClose={handleEnquiryClose}
          />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Index;

