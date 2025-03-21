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
  const [agentList, setAgentList] = useState([]);
  const [perPage, setPerPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPages, setCurrentPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [locality, setLocality] = useState();
  const [loading, setLoading] = useState(true);
  const [localityData, setLocalityData] = useState(null);
  const { defaultCity } = useAuth();
  const [showWhatsApp, setShowWhatsApp] = useState({
    user_id: null,
    active: false,
    number: "",
  });
  const [subPropertyList, setSubPropertyList] = useState([]);
  const [propertyTypeDropDown, setPropertyTypeDropDown] = useState(false);
  const [selectedPropertyType, setSelectedPropertyType] = useState("");
  const [selectedProeprtyFor, setSelectedProeprtyFor] = useState("");

  const displayPropertyTyep = () => {
    let str = "";
    if (selectedPropertyType) {
      const category = propertyTypeList?.find(
        (item) => item?.category_id == selectedPropertyType
      );
      str = category?.category_name;
    }
    if (selectedProeprtyFor) {
      const subCategory = subPropertyList?.find(
        (item) => item?.sub_category_id == selectedProeprtyFor
      );
      str = subCategory?.sub_category_name;
    }
    return str || "Residential";
  };

  useEffect(() => {
    if (router?.isReady && defaultCity) {
      FetchAgentList();
    }
  }, [router?.query, defaultCity]);

  const FetchAgentList = async (loadMore, newPage) => {
    const { page, name, locality, is_verified_agent } = router?.query || {};
    if (!loadMore) {
      setLoading(true);
    }

    let data = {
      page: page,
    };
    if (name) {
      data.name = name;
      setSearchQuery(name);
    }
    if (is_verified_agent) {
      data.is_verified_agent = is_verified_agent;
      setIsVerified(JSON.parse(is_verified_agent));
    }

    if (locality) {
      const localityObj = JSON.parse(locality);
      setLocality(localityObj);
      const localityStr = localityObj?.locality?.split(", ");
      data.locality = `${localityStr[0]}, ${localityStr[1]}`;
    }

    try {
      const response = await callApi({
        api: `/agent_list`,
        method: "GET",
        data: {
          ...data,
          city_id: defaultCity?.city_id,
        },
      });
      if (response && response.status === 1) {
        if (!loadMore) {
          setAgentList(response.data);
          if (response?.data?.length === 0) {
            console.error(response?.message || "no agent found");
          }
        } else {
          setAgentList((prev) => {
            return [...prev, ...response?.data];
          });
        }
        setTotalPages(response?.pagination?.total_pages || 0);
        setCurrentPages(response?.pagination?.current_page || 0);
      } else {
        toast.error(response.message);
        setTotalPages(response?.pagination?.total_pages || 0);
        setCurrentPages(response?.pagination?.current_page || 0);
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
    setSearchQuery(e.target.value);
  };

  const handleVerifiedAgentChange = () => {
    const params = new URLSearchParams(window.location.search);
    params.set("is_verified_agent", !isVerified);
    const newUrl = `${window.location?.pathname}?${params.toString()}`;
    router.push(newUrl);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let url = `/agent-list?page=${perPage}`;
    if (searchQuery) {
      url = `${url}&name=${searchQuery}`;
    }
    if (locality) {
      url = `${url}&locality=${JSON.stringify(locality)}`;
    }
    router.push(url);
  };
  const handlePropertyTypeDropDown = (e) => {
    if (e.currentTarget.getAttribute("data-id") === "parent") {
      setPropertyTypeDropDown(!propertyTypeDropDown);
    }
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
                          Agent
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => handleSelect("agent")}>
                            {"Agents"}
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => handleSelect("agency")}>
                            {"Agency"}
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
                          {displayPropertyTyep()}
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="p-3">
                          <Form.Label className="fw-bold">Purpose</Form.Label>
                          <div className="form-field">
                            <Nav variant="underline">
                              <Nav.Item>
                                <Nav.Link role="button" className="active">
                                  Buy
                                </Nav.Link>
                              </Nav.Item>
                              <Nav.Item>
                                <Nav.Link role="button">Rent</Nav.Link>
                              </Nav.Item>
                            </Nav>
                          </div>

                          <Form.Label className="fw-bold">Type</Form.Label>
                          <div className="form-field">
                            <ButtonGroup className="btn-group-light d-flex flex-wrap">
                              <input
                                type="radio"
                                className="btn-check"
                                name="propertyForGroup"
                                id="buy_1"
                                value="residential"
                              />
                              <label
                                className="btn btn-outline-light"
                                htmlFor="buy_1"
                              >
                                Residential
                              </label>
                              <input
                                type="radio"
                                className="btn-check"
                                name="propertyForGroup"
                                id="buy_2"
                                value="commercial"
                              />
                              <label
                                className="btn btn-outline-light"
                                htmlFor="buy_2"
                              >
                                Commercial
                              </label>
                            </ButtonGroup>
                          </div>

                          <div className="d-flex justify-content-between mt-3">
                            <Button variant="outline-secondary">Reset</Button>
                            <Button variant="primary">Done</Button>
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
                          value={searchQuery}
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
                                <i className="icon-img-company"></i>{" "}{agent?.company_name ||
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
                                <p className="mb-1">
                                  <span className="text-muted ">Serve in:</span>{" "}
                                  {[
                                    ...new Set(
                                      agent?.service_area?.map(
                                        (area) => area.city
                                      )
                                    ),
                                  ].join(", ")}
                                </p>
                                <div className="d-flex card-group-btn">
                                  <div>
                                    {!agent?.forSell === 0 && (
                                      <span className="badge badge-outline-secondary text-dark me-2">
                                        {agent?.forSell} SALE
                                      </span>
                                    )}
                                    {!agent?.forRent === 0 && (
                                      <span className="badge badge-outline-secondary text-dark">
                                        {agent?.forRent} RENT
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
                    src="./assets/images/icons/award.png"
                    alt="Badges"
                    className="mb-2"
                    height={64}
                    width={64}
                  />
                  <h4>How do agents earn badges?</h4>
                  <p>
                    To highlight great performance, we reward agents with
                    customised badges on Realestate.
                  </p>

                  <h5>
                    <img
                      src="./assets/images/icons/badge-award.png"
                      alt="Badges"
                      className="mb-2"
                      height={32}
                      width={32}
                    />{" "}
                    TruBroker
                  </h5>

                  <p className="text-italic text-muted small">
                    Exclusive badge awarded to agents who are highly responsive
                    and advertise genuine properties.
                  </p>

                  <h5>
                    <img
                      src="./assets/images/icons/408472.png"
                      alt="Badges"
                      className="mb-2"
                      height={32}
                      width={32}
                    />{" "}
                    Quality Lister
                  </h5>

                  <p className="text-italic text-muted small">
                    Exclusive badge awarded to agents who authenticate their
                    listings using badges.
                  </p>

                  <h5>
                    <img
                      src="./assets/images/icons/7644063.png"
                      alt="Badges"
                      className="mb-2"
                      height={32}
                      width={32}
                    />{" "}
                    Responsive Broker
                  </h5>
                  <p className="text-italic text-muted small">
                    Exclusive badge awarded to agents who are highly reachable
                    and responsive.
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
