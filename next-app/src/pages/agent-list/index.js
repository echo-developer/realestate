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
  const { defaultCity } = useAuth();
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [dropdownState, setDropdownState] = useState({});
  const [brokerType, setBrokerType] = useState("A");
  const [postFor, setPostFor] = useState("sale");
  const [propertyType, setPropertyType] = useState("");
  const [propertyTypeDropDown, setPropertyTypeDropDown] = useState(false);
  const [selectedTab, setSelectedTab] = useState("sale");
  const [selectedPropertyType, setSelectedPropertyType] = useState("");
  const [badgeList, setBadgeList] = useState([]);

  useEffect(() => {
    FetchPropertyTypeData();
    getBagesDetails();
  }, []);

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

  console.log("bages list", badgeList)

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
      if (post_for) setPostFor(post_for);
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
                            <Dropdown.Item onClick={() => handleSelect("F")}>
                              {"Franchise"}
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
                        <div className="card card-agent">                          
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
                                  {/* Static Company Logo Image Only */}
                                    
                                </div>
                              </Col>
                              <Col lg xs={9}>
                                <div className="card-body">
                                  <div className="card-title">
                                    <h4>
                                      <a href={`/agent-details/${agent.user_id}`}>{agent?.name || "Not Available"}</a>
                                      {agent?.is_verified_agent && (
                                        <span title="Verified">
                                          <i className="icon-img-check ms-1"></i>
                                        </span>
                                      )}
                                    </h4>

                                    {/* 🏅 Badges Section */}
                                    {agent?.userbadges?.length > 0 && (
                                      <div className="d-flex flex-wrap gap-2 mb-2">
                                        {agent.userbadges.map((badge) => (
                                          <>                                          
                                          <Button
                                            variant=""
                                            className="bg-info-subtle"
                                            size="sm"
                                            title={badge.description}
                                            key={badge.badge_id}
                                          >
                                            <img
                                              src={badge.icon}
                                              alt={badge.name}
                                              className="me-1"
                                              height={20}
                                              width={20}
                                            />{" "}{badge.name}
                                          </Button>                                          
                                          </>
                                        ))}
                                      </div>
                                    )}
                                  </div>

                                  {/* Company Name */}
                                  <p className="mb-1 d-flex align-items-center gap-2">
                                    <i className="icon-img-company"></i>
                                    <span>{agent?.company_name || "Originate Soft Pvt Ltd"}</span>
                                  </p>
                                  <p className="mb-2"><Mic color="#1365CF" size={18} /> Speak: <span className="text-muted">English, Arabic, French, Italian</span></p>

                                  <div className="mb-2">
                                    <span className="badge badge-outline-secondary text-dark me-2">
                                      {agent?.forSell} {translation?.sale || "SALE"}
                                    </span>
                                    
                                    <span className="badge badge-outline-secondary text-dark me-2">
                                        {agent?.forRent} {translation?.rent || "RENT"}
                                      </span>
                                  </div>
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
                                    <p className="mb-3">
                                     <GeoAlt color="#1365CF" size={18} /> {translation?.serve_in || "Serve in"}{": "}
                                      <span className="text-muted">
                                        {[...new Set(agent?.service_area?.map((area) => area.city))].join(", ")}
                                      </span>                                      
                                    </p>
                                  )}
                                  <div className="d-grid d-sm-flex gap-2 mb-3">
                                    
                                      <Button
                                      variant="outline-primary"
                                      size="sm"
                                      onClick={() => setShowEnquiryModal(true)}
                                    >
                                      <EnvelopeFill color="#1365CF" size={16} /> {translation?.email || "Email"}
                                    </Button>
                                    <Button
                                      variant="outline-info"
                                      size="sm"
                                      onClick={() => setShowEnquiryModal(true)}
                                      style={{minWidth: '72px'}}
                                    >
                                      <PhoneFill color="#0dcaf0" size={16} /> {translation?.call || "Call"}
                                    </Button>
                                    <Button
                                      variant="outline-success"
                                      size="sm"
                                      onClick={() => setShowEnquiryModal(true)}
                                    >
                                      <Whatsapp color="#198754" size={16} />{" "}
                                      {translation?.whatsapp || "whatsapp"}
                                    </Button>                                    

                                    {/* {agent?.user_id && (
                                      <a
                                        className="btn btn-primary btn-sm ms-auto"
                                        href={`/agent-details/${agent.user_id}`}
                                      >
                                        {translation?.view_profile || "View Profile"}
                                      </a>
                                    )} */}
                                    
                                  </div>
                                  
                                </div>
                              </Col>
                              <Col lg='auto' className="p-3 align-self-end">
                              <NextImage
                                    src="/assets/images/company-logo.png"
                                    alt="Company Logo"
                                    width={48}
                                    height={48}
                                    className="ms-auto"                                    
                                    priority
                                  />
                              </Col>
                            </Row>                          
                        </div>
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
    </>
  );
};

export default Index;
