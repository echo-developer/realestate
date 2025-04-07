"use client";
import React, { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import AuthUser from "@/components/Authentication/AuthUser";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";
import LocalitySearch from "@/components/MapData/LocalitySearch";
import LocalityOption from "@/components/MapData/LocalitySelector";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthProvider";
import useTranslation from "@/hooks/useTranslation";
import { Search } from "react-bootstrap-icons";
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
  const [locality, setLocality] = useState();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [localityData, setLocalityData] = useState(null);
  const { defaultCity } = useAuth();
  const [brokerType, setBrokerType] = useState("A");
  const [postFor, setPostFor] = useState("sale");
  const [propertyType, setPropertyType] = useState("");
  const [propertyTypeDropDown, setPropertyTypeDropDown] = useState(false);
  const [selectedTab, setSelectedTab] = useState("sale");
  const [selectedPropertyType, setSelectedPropertyType] = useState("");

  useEffect(() => {
    FetchPropertyTypeData();
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
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(response.message);
    }
  };

  useEffect(() => {
    if (router?.isReady) {
      const {
        name,
        broker_type,
        post_for,
        property_type,
        is_verified_agent,
        locality,
      } = router?.query || {};

      if (name) setName(name);
      if (broker_type) setBrokerType(broker_type);
      if (post_for) setPostFor(post_for);
      if (property_type) setPropertyType(property_type);
      if (is_verified_agent) setIsVerified(JSON.parse(is_verified_agent));

      if (locality) {
        try {
          const localityObj = JSON.parse(locality);
          setLocality(localityObj);
        } catch (error) {
          console.error("Invalid locality data:", error);
        }
      }
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
      locality,
      is_verified_agent,
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
      try {
        const localityObj = JSON.parse(locality);
        setLocality(localityObj);
        if (localityObj?.locality) {
          const localityStr = localityObj.locality
            .split(", ")
            .slice(0, 2)
            .join(", ");
          data.locality = localityStr;
        }
      } catch (e) {
        console.error("Invalid locality data:", e);
      }
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
        toast.error(response?.message || "Failed to fetch agents");
      }
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
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
    if (locality) {
      url = `${url}&locality=${JSON.stringify(locality)}`;
    }
    if (brokerType) {
      url = `${url}&broker_type=${brokerType}`;
    }
    if (selectedTab) {
      url = `${url}&post_for=${selectedTab}`;
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

  return (
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
                    <Col className="col-lg-auto col-sm-2 col-auto">
                      <Dropdown className="d-grid select-dropdown">
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
                    <Col
                      className="col-lg col-sm-4 col-12"
                      data-id="parent"
                      onClick={handlePropertyTypeDropDown}
                    >
                      <Dropdown
                        className="select-dropdown mb-3 d-grid"
                        show={propertyTypeDropDown}
                      >
                        <Dropdown.Toggle className="btn-form-control">
                          {displayPropertyType()}
                        </Dropdown.Toggle>
                        <Dropdown.Menu
                          className="p-3"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {/* Purpose Tabs */}
                          <Form.Label className="fw-bold">Purpose</Form.Label>
                          <div className="form-field">
                            <Nav variant="underline" activeKey={selectedTab}>
                              <Nav.Item>
                                <Nav.Link
                                  role="button"
                                  eventKey="sale"
                                  onClick={() => handleTab("sale")}
                                >
                                  {translation?.buy || "Buy"}
                                </Nav.Link>
                              </Nav.Item>
                              <Nav.Item>
                                <Nav.Link
                                  role="button"
                                  eventKey="rent"
                                  onClick={() => handleTab("rent")}
                                >
                                  {translation?.rent || "Rent"}
                                </Nav.Link>
                              </Nav.Item>
                            </Nav>
                          </div>

                          {/* Property Type Selection */}
                          <Form.Label className="fw-bold mt-3">{translation?.type || "Type"}</Form.Label>
                          <div className="form-field">
                            <ButtonGroup className="btn-group-light d-flex flex-wrap">
                              {PropertyTypeData?.map((type) => (
                                <React.Fragment key={type.category_id}>
                                  <input
                                    type="radio"
                                    className="btn-check"
                                    name="propertyForGroup"
                                    id={`buy_${type.category_id}`}
                                    value={type.category_id}
                                    checked={
                                      selectedPropertyType === type.category_id
                                    }
                                    onChange={() =>
                                      handleSelectPropertyType(type.category_id)
                                    }
                                  />
                                  <label
                                    className="btn btn-outline-light"
                                    htmlFor={`buy_${type.category_id}`}
                                  >
                                    {type.category_name}
                                  </label>
                                </React.Fragment>
                              ))}
                            </ButtonGroup>
                          </div>

                          {/* Action Buttons */}
                          <div className="d-flex justify-content-between mt-3">
                            <Button
                              variant="outline-secondary"
                              onClick={resetSelection}
                            >
                              {translation?.reset || "Reset"}

                            </Button>
                            <Button
                              variant="primary"
                              onClick={() => setPropertyTypeDropDown(false)}
                            >
                              {translation?.done || "Done"}
                            </Button>
                          </div>
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
                      <LocalityOption
                        locality={localityData}
                        setLocalityData={setLocalityData}
                      />
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
        <div className="p-4">
          <Row>
            <Col className="col-xl-9 col-lg-8 col-12">
              {/* Main Content */}
              <div className="d-sm-flex justify-content-between align-items-center mb-2">
                <h4 className="mb-3 mb-sm-0">
                  {translation?.agent_list || "Agent List"} (
                  {agentList.length ||
                    `${translation?.not_available || "Not available"}`}
                  )
                </h4>
                <div>
                  <span>
                    {translation?.verified_agents || "Verified agents"}{" "}
                  </span>
                  <Form.Check
                    type="switch"
                    id="custom-switch"
                    label={
                      isVerified
                        ? `${translation?.on || "ON"}`
                        : `${translation?.off || "OFF"}`
                    }
                    checked={isVerified}
                    onChange={handleVerifiedAgentChange}
                  />
                </div>
              </div>
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
                    <Col className="col-lg-6 col-12">
                      <div key={agent.id} className="card card-agent">
                        <div className="card-body">
                          <Row className="gx-3">
                            <div className="col-sm-auto col-3">
                              <div className="card-image">
                                <a>
                                  <img
                                    src={
                                      agent?.image ||
                                      "/assets/images/agents/user.jpg"
                                    }
                                    alt={agent?.name || "User"}
                                    className="img-fluid"
                                  />
                                </a>
                              </div>
                            </div>
                            <div className="col-sm col-9">
                              <div className="">
                                <div className="card-title">
                                  <h4>
                                    <a>{agent?.name || "Not Available"}</a>
                                    {agent?.is_verified_agent && (
                                      <span title="Verified">
                                        <i className="icon-img-check ms-1"></i>
                                      </span>
                                    )}
                                  </h4>
                                  {/* <span className="badge badge-outline-secondary text-dark">
                                    {translation?.properties || "Properties"}
                                  </span> */}
                                </div>
                                <p className="mb-1">
                                  <i className="icon-img-company"></i>{" "}
                                  {agent?.company_name ||
                                    "Originate Soft Pvt Ltd"}
                                </p>

                                <p className="mb-2">
                                  <i className="icon-feather-phone"></i>{" "}
                                  {agent.phone || "Not Available"}
                                </p>

                                <p className="mb-2">
                                  <i className="icon-feather-mail"></i>{" "}
                                  {agent.email || "Not Available"}
                                </p>
                                {agent?.service_area?.length > 0 && (
                                  <p className="mb-1">
                                    <span className="text-muted ">
                                      {translation?.serve_in || "Serve in"}
                                    </span>{" "}
                                    {[
                                      ...new Set(
                                        agent?.service_area?.map(
                                          (area) => area.city
                                        )
                                      ),
                                    ].join(", ")}
                                  </p>
                                )}

                                <div className="d-flex card-group-btn">
                                  <div>
                                    {!agent?.forSell === 0 && (
                                      <span className="badge badge-outline-secondary text-dark me-2">
                                        {agent?.forSell} {translation?.sale || "SALE"}

                                      </span>
                                    )}
                                    {!agent?.forRent === 0 && (
                                      <span className="badge badge-outline-secondary text-dark">
                                        {agent?.forRent}{translation?.rent || "RENT"}

                                      </span>
                                    )}
                                  </div>

                                  {agent?.user_id && (
                                    <a
                                      className="btn btn-primary btn-sm ms-auto"
                                      href={`/agent-details/${agent.user_id}`}
                                    >
                                      {translation?.view_profile ||
                                        "View Profile"}
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Row>
                        </div>
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

                  <h5>
                    <img
                      src="/assets/images/icons/badge-award.png"
                      alt="Badges"
                      className="mb-2"
                      height={32}
                      width={32}
                    />{" "}
                    {translation?.trubroker || "TruBroker"}

                  </h5>

                  <p className="text-italic text-muted small">
                    {translation?.trubroker_desc || "Exclusive badge awarded to agents who are highly responsive and advertise genuine properties."}

                  </p>

                  <h5>
                    <img
                      src="/assets/images/icons/408472.png"
                      alt="Badges"
                      className="mb-2"
                      height={32}
                      width={32}
                    />{" "}
                    {translation?.quality_lister || "Quality Lister"}

                  </h5>

                  <p className="text-italic text-muted small">
                    {translation?.quality_lister_desc || "Exclusive badge awarded to agents who authenticate their listings using badges."}

                  </p>

                  <h5>
                    <img
                      src="/assets/images/icons/7644063.png"
                      alt="Badges"
                      className="mb-2"
                      height={32}
                      width={32}
                    />{" "}
                    {translation?.responsive_broker || "Responsive Broker"}

                  </h5>
                  <p className="text-italic text-muted small">
                    {translation?.responsive_broker_desc || "Exclusive badge awarded to agents who are highly reachable and responsive."}

                  </p>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </aside>
    </MainLayout>
  );
};

export default Index;
