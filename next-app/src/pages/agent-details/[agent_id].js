"use client";
import React, { useEffect, useState, useRef } from "react";
import MainLayout from "@/components/layout/MainLayout";
import "react-multi-carousel/lib/styles.css";
import AuthUser from "@/components/Authentication/AuthUser";
import { useRouter } from "next/router";
import Link from "next/link";
import NextImage from "next/image";
import { toast } from "react-toastify";
import { Offcanvas } from "react-bootstrap";
import AgentReview from "@/components/userReview/AgentReview";
import useTranslation from "@/hooks/useTranslation";
import EnquiryForm from "@/components/charts/EnquiryForm";
import {
  Mic,
  GeoAlt,
  EnvelopeFill,
  PhoneFill,
  Whatsapp,
} from "react-bootstrap-icons";
import CardImageSlider from "@/components/cardImageSlider/CardImageSlider";
import { Row, Col, Card, Button, Modal, Dropdown, ButtonGroup, Badge, Form, Nav } from "react-bootstrap";
import AgentEnquiryForm from "@/components/addtional/AgentEnquiryForm";
import { useAuth } from "@/context/AuthProvider";
import useAdvertisement from "@/hooks/useAdvertisement";
import Locality from "@/components/Locality/Locality";

const Index = () => {
  const router = useRouter();
  const translation = useTranslation();
  const { defaultCity, currency, getBadgeButtonClass } = useAuth();
  const { callApi, GetMemberId, isLogin } = AuthUser();
  const { id: agent_id } = router.query;
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
  const [propertyTypeList, setPropertyTypeList] = useState([]);
  const [subPropertyList, setSubPropertyList] = useState([]);
  const [selectedPropertyType, setSelectedPropertyType] = useState("");
  const [selectedProeprtyFor, setSelectedProeprtyFor] = useState("");
  const [contactDetails, setContactDetails] = useState({
    name: "",
    email: "",
    contact: "",
    message: "",
  });
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [propertyForLoading, setPropertyForLoading] = useState(false);
  const [property_loading, setPropertyLoading] = useState(true);
  const [propertyList, setPropertyList] = useState([]);
  const [dropdownState, setDropdownState] = useState({});
  const [error, setError] = useState("");
  const { adsData, logAdClick } = useAdvertisement(
    "agent-detail-page",
    "right",
    defaultCity?.city_id
  );


  const [filters, setFilters] = useState({
    post_for: "",
    property_type: "",
    property_for: "",
    locality: "",
    min_budget: "",
    max_budget: ""
  })

  const handleClick = (property_id) => {
    setPropertyId(property_id);
    setShowContactModal(true);
  };
  useEffect(() => {
    if (agent_id) {
      fetchAgentDetails(agent_id, page);
    }
    setContactDetails((prevDetails) => ({
      ...prevDetails,
      user_id: memberId,
    }));
  }, [agent_id, memberId, defaultCity]);

  useEffect(() => {
    if (agent_id) {
      fetchAgentPropertyList(agent_id, 1, false);
    }
  }, [agent_id, filters]);

  useEffect(() => {
    const fetchPropertyTypeList = async () => {
      try {
        const res = await callApi({
          api: "/get_property_type",
          method: "GET",
        });
        if (res && res?.status === 1) {
          setPropertyTypeList(res?.data || []);
          // setSelectedPropertyType(res?.data?.[0]?.category_id);
        }
      } catch (error) {
        console.error(error?.message || "Error fetching property types");
      }
    };
    fetchPropertyTypeList();
  }, [])


  useEffect(() => {
    if (selectedPropertyType) {
      const getSubPropertyType = async () => {
        setPropertyForLoading(true);
        try {
          const res = await callApi({
            api: `/get_property_for/${selectedPropertyType}`,
            method: "GET",
          });
          if (res && res?.status === 1) {
            setSubPropertyList(res?.data || []);
          }
        } catch (error) {
          console.error(res?.message || "Error fetching property for options");
        } finally {
          setPropertyForLoading(false);
        }
      };

      getSubPropertyType();
    }
  }, [selectedPropertyType]);

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

  const fetchAgentDetails = async (agent_id, page) => {
    setIsLoading(true);

    try {
      const response = await callApi({
        api: `/agent_details_page`,
        method: "GET",
        data: {
          agent_id: agent_id,
          current_page: page,
        },
      });
      if (response && response.status === 1) {
        setAgentDetailsData(response.data);
      }
    } catch (error) {
      console.error(error?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAgentPropertyList = async (agent_id, page, loadMore) => {
    if (!loadMore) {
      setPropertyLoading(true);
    }

    try {
      const res = await callApi({
        api: "/agent_property_list",
        method: "GET",
        data: {
          agent_id: agent_id,
          currentPage: page,
          ...filters
        },
      });
      if (res && res?.status === 1) {
        if (!loadMore) {
          setPropertyList(res?.data);
          setCurrentPage(res?.pagination?.current_page || 0);
          setTotalPage(res?.pagination?.total_pages || 0);
        } else {
          setPropertyList((prev) => {
            return [...prev, res?.data];
          });
          setCurrentPage(0);
          setTotalPage(0);
        }
      }
    } catch (error) {
      console.error(error.message || "Something went wrong");
    } finally {
      setPropertyLoading(false);
    }
  };

  const displayBudget = () => {
    if (minBudget && maxBudget) return `${currency}${minBudget} - ${currency}${maxBudget}`;
    if (minBudget) return `Min: ${currency}${minBudget}`;
    if (maxBudget) return `Max: ${currency}${maxBudget}`;
    return `${translation?.select_budget || "Select Budget"}`;
  };


  const handleMinChange = (e) => {
    const value = e.target.value;
    setMinBudget(value);
    if (maxBudget && Number(value) > Number(maxBudget)) {
      setError("Min budget cannot be greater than max budget.");
    } else {
      setError("");
    }
  };

  const handleMaxBudgetChange = (e) => {
    const value = e.target.value;
    setMaxBudget(value);
    if (minBudget && Number(value) < Number(minBudget)) {
      setError("Max budget cannot be less than min budget.");
    } else {
      setError("");
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
          console.error(res?.message || "An error occurred. Please try again.");
        }
      } catch (error) {
        console.error("Failed to save the property. Please try again.");
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

  const handleFilterChange = (key, value) => {
    setFilters(prev => {
      return {
        ...prev,
        [key]: value
      }
    })
  }

  const displayPropertyTyep = () => {
    let str = "";
    if (selectedPropertyType) {
      const category = propertyTypeList.find(
        (item) => item.category_id === Number(selectedPropertyType)
      );
      if (category) {
        str = category.category_name;
      }
    }
    if (selectedProeprtyFor) {
      const subCategory = subPropertyList?.find(
        (item) => item?.sub_category_id === Number(selectedProeprtyFor)
      );
      if (subCategory) {
        str += str ? ` - ${subCategory.sub_category_name}` : subCategory.sub_category_name;
      }
    }
    return str || "Select a Property Type";
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
        console?.error(res?.message || "An error occurred. Please try again.");
      }
    } catch (error) {
      console?.error(error?.message);
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

  const handleClickOutside = (e) => {
    // If clicked outside the dropdown and overlay, close all dropdowns
    if (!e.target.closest('.dropdown') && !e.target.closest('.overlay')) {
      setDropdownState({});
      setIsOverlayVisible(false);
    }
  };

  const handleLoginErrorClose = () => setShowLoginErrorModal(false);

  const handleLoadMoreClick = (newPage) => {
    setCurrentPage(newPage);
    fetchAgentPropertyList(agent_id, newPage, true);
  };


  const resetBudget = () => {
    setMinBudget("");
    setMaxBudget("");
    setFilters(prev => {
      return {
        ...prev,
        max_budget: "",
        min_budget: ""
      }
    })
    setError("");
  };

  const handlePropertyForReset = () => {
    setSelectedProeprtyFor("");
    setSelectedPropertyType("")
    setFilters(prev => {
      return {
        ...prev,
        property_type: "",
        property_for: ""
      }
    })
  }

  const onSelectLocality = (locality) => {
    setFilters(prev => {
      return {
        ...prev,
        locality: locality.locality_id || ""
      }
    })
  }

  return (
    <>
      {isOverlayVisible && (
        <div
          className="page-overlay"
          onClick={handleClickOutside}
        ></div>
      )}
      <MainLayout>
        {/* <div className="short-banner">
        <div className="container">
          <h1>{translation?.agent_details || "Agent Details"}</h1>
        </div>
        </div> */}
        <div className="coverPhoto" style={{ backgroundImage: "url('/assets/images/tasker-cover-photo.jpg')" }}></div>          
        <div className="container-fluid">
          <Card className="card-agent card-agent-page h-auto mb-0">  
                    
            <Row className="gx-0 position-relative">
              <Col xxl={2} lg='auto' sm={3} xs={12}>
                <div className="card-image">
                  <Card.Img src={
                      agentDetailsData?.image || "/assets/images/user.jpg"
                    }
                    variant="top"
                    alt="Agent Logo"
                    height={"250"}
                  />                    
                  <div className="rent-sale">
                    <Badge bg="warning" text="black" className="rounded-0 me-2">
                      {agentDetailsData?.forSell} {translation?.sale || "SALE"}
                    </Badge>

                    <Badge bg="success" className="rounded-0 me-2">
                      {agentDetailsData?.forRent} {translation?.rent || "RENT"}
                    </Badge>
                  </div>
                </div>
              </Col>
              <Col lg sm={9} xs={12}>
                <Card.Body className="p-0">
                  <div className="onCover">
                    <Card.Title as='h4' className="mb-2 text-sm-white">
                      {agentDetailsData?.name}{" "}
                      <i className="icon-img-check ms-1"></i>
                    </Card.Title>
                    <div className="d-flex gap-2">
                      {agentDetailsData?.userbadges && agentDetailsData?.userbadges?.map((badge, i) => {
                        return (

                          <Badge
                            className={getBadgeButtonClass(badge.name)}
                          >
                            <img
                              src={badge.icon}
                              alt="Badges"
                              height={18}
                              width={18}
                            />{" "}
                            {badge.name}
                          </Badge>
                        )
                      })}
                    </div>
                  </div>
                  <div className="outCover">                      
                    <Row className="align-items-end">
                      <Col className="col-lg col-12">
                        <p className="mb-2 ">
                          <i className="icon-img-company"></i>
                          {agentDetailsData?.company_name || "Not Available"}
                        </p>
                        <p className="mb-2"><Mic color="#1365CF" size={18} /> Speak: <span className="text-muted">{agentDetailsData?.languages ?agentDetailsData.languages.replace(/,/g, ', ') : ''}</span></p>
                        {/* Service Area */}

                        {agentDetailsData?.service_area?.length > 0 && (
                          <p className="mb-2">
                            <GeoAlt color="#1365CF" size={18} /> {translation?.serve_in || "Serve in"}{": "}
                            <span className="text-muted">
                              {[...new Set(agentDetailsData?.service_area?.map(area => area.locality?.locality_name))].join(", ")}
                            </span>
                          </p>
                        )}
                        <div className="d-flex gap-2">
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
                            style={{ minWidth: '72px' }}
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
                        </div>
                      </Col>
                      <Col lg='auto' className="pe-3 text-lg-end bg-white">
                        {agentDetailsData?.company_logo && (
                          <NextImage
                            src={agentDetailsData.company_logo}
                            alt="Company Logo"
                            width={64}
                            height={48}
                            className="c-logo"
                            priority
                          />
                        )}
                      </Col>
                    </Row>
                  </div>
                </Card.Body>
              </Col>                
            </Row>            
          </Card>
        </div>        
        
        <section className="section profile">
          <div className="container-fluid">
            <Row>
              <Col xl={9} lg={9} xs={12}>                                
                <Card className="card-agent h-auto border-0 shadow-sm mb-4">
                  <Card.Body>                    
                    <div className="about-tasker">
                      <h4>{translation?.about || "About"}</h4>
                      <Row>
                        <Col lg={6} >
                          <p className="mb-2">
                            <span>{translation?.broker_type || "Broker Type:"}{': '}</span>
                            <span className="text-muted">
                              {agentDetailsData?.broker_type === "I"
                                ? "Indepedent"
                                : agentDetailsData?.broker_type === "F"
                                  ? "Franchise"
                                  : agentDetailsData?.broker_type === "A"
                                    ? "Agent"
                                    : "Not Available"}
                            </span>
                          </p>
                          <p className="mb-2">
                            <span>{translation?.address || "Address:"}{': '}</span>
                            <span className="text-muted">{agentDetailsData?.address || "Not Available"}</span>
                          </p>
                          <p className="mb-2">
                            <span>{translation?.social_media || "Social Media:"}{': '}</span>
                            <span className="text-muted">
                              {[
                                ...new Set(
                                  agentDetailsData?.social?.map(
                                    (area) => area.platform_name
                                  )
                                ),
                              ].join(", ")}
                            </span>
                          </p>
                          <p className="mb-2">
                            <span>{translation?.licence_number || "Licence Number:"}{': '}</span>
                            <span className="text-muted">{agentDetailsData?.license_no || "Not Available"}</span>
                          </p>
                          {/* <p className="mb-2">
                            <span>{translation?.business_phone || "Business Phone:"}{': '}</span>
                            <span className="text-muted">{agentDetailsData?.bussiness_phone || "Not Available"}</span>
                          </p> */}
                          <p className="mb-2">
                            <span>{translation?.company_name || "Company Name:"}{': '}</span>
                            <span className="text-muted">{agentDetailsData?.company_name || "Not Available"}</span>
                          </p>
                        </Col>
                        <Col lg={6}>
                          <p className="mb-2">
                            <span>{translation?.expertise || "Expertise:"}{': '}</span>
                            <span className="text-muted">{agentDetailsData?.specialization || "Not Available"}</span>
                          </p>
                          <p className="mb-2">
                            <span>{translation?.service_areas || "Service Areas:"}{': '}</span>
                            <span className="text-muted">
                              {[
                                ...new Set(
                                  agentDetailsData?.service_area?.map((area) => area.city)
                                ),
                              ].join(", ")}
                            </span>
                          </p>
                          <p className="mb-2">
                            <span>{translation?.properties_for_sale || "Properties For Sale"}{': '}</span>
                            <span className="text-muted">
                              
                              {translation?.for_sale || "For Sale"} ({agentDetailsData?.forSell}),{' '} 
                              {translation?.for_rent || "For Rent"} ({agentDetailsData?.forRent})
                            </span>
                          </p>
                          {/* <p className="mb-2">
                            <span>{translation?.business_email || "Business Email:"}{': '}</span>
                            <span className="text-muted">{agentDetailsData?.bussiness_email || "Not Available"}</span>
                          </p> */}
                          <p className="mb-2">
                            <span>{translation?.working_hours || "Working Hours:"}{': '}</span>
                            <span className="text-muted">
                              {agentDetailsData?.opening_hours} -{" "}
                              {agentDetailsData?.closing_hours}
                            </span>
                          </p>
                          <p className="mb-2">
                            <span>{translation?.experience || "Experience:"}{': '}</span>
                            <span className="text-muted">
                              {agentDetailsData?.experience_yr || "Not Available"}{' '}
                              {agentDetailsData?.experience_yr && "Years"}
                            </span>
                          </p>
                        </Col>
                      </Row>
                      <p className="mb-2">{translation?.description || "Description:"}</p>
                      <p className="text-muted">
                        {agentDetailsData?.description || "Not Available"}
                      </p>
                    </div>
                  </Card.Body>
                </Card>
                <div className="search-form">
                  <form id="">
                    <Row className="gx-3">
                      <Col lg='auto' xs='auto' onClick={() => toggleDropdown('buy_sell')}>
                        <Dropdown className="mb-2" show={dropdownState?.buy_sell}>
                          <Dropdown.Toggle
                            variant="outline-secondary"
                            className="btn-form-control bg-white border"
                          >
                            {filters.post_for ? filters.post_for == 'sale' ? 'Buy' : 'Rent' : "Select"}
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item onClick={() => handleFilterChange("post_for", "")}>Select</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleFilterChange("post_for", "sale")}>Buy</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleFilterChange("post_for", "rent")}>Rent</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </Col>
                      <Col lg xs>
                        <Locality onSelectLocality={onSelectLocality} />
                      </Col>
                      <Col className="col-lg col-sm-4 col-12" onClick={() => toggleDropdown('property_type')}>
                        <Dropdown className="select-dropdown mb-3 d-grid" show={dropdownState?.property_type}>
                          <Dropdown.Toggle className="btn-form-control">
                            {displayPropertyTyep()}
                          </Dropdown.Toggle>
                          <Dropdown.Menu className="p-3">
                            <div className="form-field">
                              <Nav
                                variant="underline"
                                activeKey={selectedPropertyType}
                              >
                                {propertyTypeList.map((type) => (
                                  <Nav.Item key={type.category_id} >
                                    <Nav.Link
                                      role="button"
                                      eventKey={type.category_id}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setSelectedPropertyType(type.category_id)
                                      }}
                                    >
                                      {type.category_name}
                                    </Nav.Link>
                                  </Nav.Item>
                                ))}
                              </Nav>
                            </div>

                            <div className="mt-3">
                              <div className="form-field">
                                <ButtonGroup className="btn-group-light d-flex flex-wrap">
                                  {subPropertyList?.length === 0 &&
                                    propertyForLoading && (
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "center",
                                          alignItems: "center",
                                          height: "200px",
                                          width: "100%", // Ensure full width
                                        }}
                                        className="d-flex justify-content-center align-items-center w-100"
                                      >
                                        <div
                                          className="spinner-border text-primary"
                                          role="status"
                                        >
                                          <span className="visually-hidden">
                                            {translation?.loading ||
                                              "Loading...."}{" "}
                                          </span>
                                        </div>
                                      </div>
                                    )}
                                  {subPropertyList.map((property, index) => (
                                    <div
                                      key={property.sub_category_id}
                                      className="me-2 mb-2"
                                    >
                                      <input
                                        type="radio"
                                        className="btn-check"
                                        name="propertyForGroup"
                                        id={`propertyFor-${index}`}
                                        value={property.sub_category_id}
                                        checked={
                                          selectedProeprtyFor ==
                                          property.sub_category_id
                                        }
                                        // checked={property.sub_category_id === 1}
                                        onChange={() => setSelectedProeprtyFor(property.sub_category_id)}
                                      />
                                      <label
                                        className="btn btn-outline-light btn-sm"
                                        htmlFor={`propertyFor-${index}`}
                                      >
                                        {property.sub_category_name}
                                      </label>
                                    </div>
                                  ))}
                                  {subPropertyList?.length == 0 && !propertyForLoading && (
                                    <div>Choose a property Type</div>
                                  )}
                                </ButtonGroup>
                              </div>

                            </div>

                            <div className="d-flex justify-content-between mt-3">
                              <Button variant="outline-secondary" onClick={handlePropertyForReset}>Reset</Button>
                              <Button variant="primary" onClick={() => {
                                setFilters(prev => {
                                  return {
                                    ...prev,
                                    property_type: selectedPropertyType || "",
                                    property_for: selectedProeprtyFor || ""
                                  }
                                })
                              }}>Done</Button>
                            </div>
                          </Dropdown.Menu>
                        </Dropdown>
                      </Col>

                      <Col className="col-lg col-sm-4 col-12" onClick={() => toggleDropdown('budget')}>
                        <Dropdown className="select-dropdown d-grid mb-3" show={dropdownState?.budget}>
                          <Dropdown.Toggle className="btn-form-control">
                            {displayBudget()}
                          </Dropdown.Toggle>

                          <Dropdown.Menu className="p-3 shadow bg-white rounded">
                            <Row className="gx-2">
                              <Col className="col-6">
                                <Form.Group className="dropdown minMax">
                                  <Form.Label>Min</Form.Label>
                                  <input
                                    type="number"
                                    className="form-control"
                                    placeholder="00"
                                    value={minBudget}
                                    onChange={handleMinChange}
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </Form.Group>
                              </Col>
                              <Col className="col-6">
                                <Form.Group className="dropdown minMax">
                                  <Form.Label>Max</Form.Label>
                                  <input
                                    type="number"
                                    className="form-control"
                                    placeholder="00"
                                    value={maxBudget}
                                    onChange={handleMaxBudgetChange}
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </Form.Group>
                              </Col>
                            </Row>

                            <div className="d-flex justify-content-between mt-3">
                              <Button variant="outline-secondary" onClick={resetBudget}>Reset</Button>
                              <Button variant="primary" onClick={(e) => {
                                setFilters(prev => {
                                  return {
                                    ...prev,
                                    max_budget: maxBudget || "",
                                    min_budget: minBudget || ""
                                  }
                                })
                                handleClickOutside(e);
                              }}>Done</Button>
                            </div>
                          </Dropdown.Menu>
                        </Dropdown>
                      </Col>
                    </Row>
                  </form>
                </div>                

                <div className="list-display">
                  {property_loading ? (
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
                  ) : propertyList?.length > 0 ? (
                    propertyList?.map((property, i) => {
                      return (
                        <div key={property.property_id} className="card card-ads">
                          <div className="row g-0">
                            <div className="col-lg-3 col-sm-3">
                              <CardImageSlider
                                data={property}
                                showSq={true}
                                icons={true}
                                showFavIcon={false}
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
                                  {translation?.price || "Price:"}
                                  {" "}
                                  {property?.price_currency &&
                                    property?.expected_price
                                    ? `${property.price_currency
                                    } ${new Intl.NumberFormat("en-US").format(
                                      property.expected_price
                                    )}`
                                    : "Not Available"}
                                </h5>

                                <p className="mb-1">
                                  <small>
                                    {translation?.average_price || "Average Price:"}{" "}
                                    {property?.price_per_sqft ? (
                                      <>
                                        {property?.price_currency ||
                                          property?.currency ||
                                          ""}{" "}
                                        {property?.price_per_sqft} {translation?.sq_ft || "sq/ft"}

                                      </>
                                    ) : (
                                      "Not Available"
                                    )}
                                  </small>
                                </p>

                                <ul className="list-info mb-2">
                                  {property?.bedrooms && (
                                    <li>
                                      <i className="icon-img-bed" title="Bedrooms:" />
                                      <span>{property.bedrooms}</span> Beds
                                    </li>
                                  )}

                                  {property?.bathroom && (
                                    <li>
                                      <i className="icon-img-tub" title="Bathrooms:" />
                                      <span>{property.bathroom}</span> Bath
                                    </li>
                                  )}

                                  {property?.carpet_area && (
                                    <li>
                                      <i className="icon-img-ratio" title="Carpet Area:" />
                                      <span>
                                        {property.carpet_area}
                                        {property.unit_type || " sqft"}
                                      </span>{" "}
                                    </li>
                                  )}

                                  {property?.possession_status && (
                                    <li>
                                      <i className="icon-img-check" title="Possession Status" />
                                      <span>
                                        {translation?.possession_status || "Possession Status:"}{" "}
                                        {property.possession_status}
                                      </span>
                                    </li>
                                  )}
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
                                    src={`${agentDetailsData?.image ||
                                      "/assets/images/user.jpg"
                                      }`}
                                    alt="Company"
                                    height={36}
                                    width={36}
                                  />
                                  <div className="ps-2">
                                    <h6 className="mb-0">
                                      {agentDetailsData?.name || "User"}
                                    </h6>
                                    <p className="small text-muted">
                                      {/* {property?.user_type === "A"
                                      ? "Agent"
                                      : property?.user_type === "/"
                                      ? "Builder"
                                      : property?.user_type === "O"
                                      ? "Owner"
                                      : "Not Available"} */}
                                      Agent
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
                {!property_loading && currentPage < totalPage && (
                  <button
                    className="btn btn-primary d-block mx-auto mt-4"
                    onClick={() => handleLoadMoreClick(currentPage + 1)}
                  >
                    {translation?.load_more || "Load More"}
                  </button>
                )}
                {/* )} */}
              </Col>
              <Col xl={3} lg={3} xs={12}>

                <>
                  {adsData.length > 0 ? (
                    adsData.map((ad) => (
                      <a
                        key={ad.advertisement_id}
                        role="button"
                        onClick={(e) => {
                          e.preventDefault();
                          logAdClick(ad.advertisement_id, ad.ad_url);
                        }}
                      >
                        <img src={ad.ad_image} alt="Ad" />
                      </a>
                    ))
                  ) : (
                    <></>
                  )}
                </>
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
            <Modal.Title>{translation?.contact_agent || "Contact Agent"}
            </Modal.Title>
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
    </>
  );
};

export default Index;
