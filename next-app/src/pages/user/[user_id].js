import AuthUser from '@/components/Authentication/AuthUser';
import MainLayout from '@/components/layout/MainLayout';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AgentEnquiryForm from '@/components/addtional/AgentEnquiryForm';
import Loading from '@/components/LoadingSpinner/Loading';
import { Row, Col, Card, Button, Modal, Dropdown, ButtonGroup, Badge, Form, Nav } from "react-bootstrap";
import {
  Mic,
  GeoAlt,
  EnvelopeFill,
  PhoneFill,
  Whatsapp,
} from "react-bootstrap-icons";
import useTranslation from '@/hooks/useTranslation';
import Locality from '@/components/Locality/Locality';
import { useAuth } from '@/context/AuthProvider';
import EnquiryForm from '@/components/charts/EnquiryForm';
import CardImageSlider from '@/components/cardImageSlider/CardImageSlider';

const Index = () => {
  const { callApi } = AuthUser();
  const router = useRouter();
  const { currency, formatPrice } = useAuth();
  const { id: user_id } = router.query;
  const [data, setData] = useState(null);
  const [list, setList] = useState([]);
  const translation = useTranslation();
  const [showPhone, setShowPhone] = useState(null);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [dropdownState, setDropdownState] = useState({});
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [filters, setFilters] = useState({
    post_for: "",
    property_type: "",
    property_for: "",
    locality: "",
    min_budget: "",
    max_budget: ""
  })
  const [propertyId, setPropertyId] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [selectedPropertyType, setSelectedPropertyType] = useState("");
  const [selectedProeprtyFor, setSelectedProeprtyFor] = useState("");
  const [propertyTypeList, setPropertyTypeList] = useState([]);
  const [subPropertyList, setSubPropertyList] = useState([]);
  const [propertyForLoading, setPropertyForLoading] = useState(false);
  const [error, setError] = useState("");
  const [property_loading, setPropertyLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [showEmail, setShowEmail] = useState(null);
  const [selectedType, setSelectedType] = useState("");



  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await callApi({
          api: `/user_details?uid=${user_id}`,
          method: "GET",
        });

        if (res && res.status == 1) {
          setData(res.data?.user_details);
        }
      } catch (error) {
        console.error(error.message);
      }
    };


    if (user_id) {
      fetchData();
    }
  }, [user_id]);

  const fetchPropertyList = async (page = 1, loadMore) => {
    if (!loadMore) {
      setPropertyLoading(true);
    }
    try {
      const res = await callApi({
        api: `/user_proprties?uid=${user_id}`,
        method: "GET",
        data: {
          current_page: page,
          ...filters
        }
      });

      if (res && res.status == 1) {
        if (!loadMore) {
          setList(res.data?.user_properties);
          setPagination(res?.meta);
        } else {
          setList((prev) => {
            return [...prev, res.data?.user_properties]
          });
          setPagination(res?.meta);
        }
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      setPropertyLoading(false);
    }
  };
  useEffect(() => {


    if (user_id) {
      fetchPropertyList(1, false);
    }

  }, [user_id, filters])

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

  // Count sale and rent properties
  const countProperties = () => {
    if (!data?.user_properties) return { sale: 0, rent: 0 };

    const saleCount = data.user_properties.filter(
      property => property.name && property.name.includes('FOR Sale')
    ).length;

    const rentCount = data.user_properties.filter(
      property => property.name && property.name.includes('FOR Rent')
    ).length;

    return { sale: saleCount, rent: rentCount };
  };

  const handleContactClose = () => setShowContactModal(false);
  const handleEnquiryClose = () => setShowEnquiryModal(false);

  const onSelectLocality = (locality) => {
    setFilters(prev => {
      return {
        ...prev,
        locality: locality.locality_id || ""
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
  const propertyCounts = countProperties();

  const handleEmailPhoneClick = (type) => {
    setShowEnquiryModal(true);
    setSelectedType(type);
    if (type == 'phone') {
      setShowPhone({
        show: false,
        value: data?.phone
      })
    } else if (type == 'email') {
      setShowEmail({
        show: false,
        value: data?.email
      })
    }
  }

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
  const handleFilterChange = (key, value) => {
    setFilters(prev => {
      return {
        ...prev,
        [key]: value
      }
    })
  }

  const handleLoadMoreClick = (newPage) => {
    setPagination(prev => {
      return {
        ...prev,
        current_page: newPage
      }
    })
    fetchPropertyList(newPage, true);
  };

  const handleClick = (property_id) => {
    setPropertyId(property_id);
    setShowContactModal(true);
  };

  const handleWhatsappClick = (agent) => {
    const message = `Owner Name = ${agent.name} \nAgent Id = ${agent.id || agent.id}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${agent.whatsapp_no || agent.phone}?text=${encodedMessage}`;

    window.open(whatsappURL, '_blank');
  };

  const callEmailSuccessfunction = () => {
    if (selectedType == 'phone') {
      setShowPhone(prev => {
        return {
          ...prev,
          show: true,
        }
      })

    } else if (selectedType == 'email') {
      setShowEmail(prev => {
        return {
          ...prev,
          show: true
        }
      })
    }
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
        <div className="coverPhoto" style={{ backgroundImage: `url(${data?.agent_cover_photo || '/assets/images/tasker-cover-photo.jpg'})` }}></div>
        <div className='container-fluid'>
          <div className='card-agent card-agent-page h-auto mb-0'>
            <Row className='gx-0 position-relative'>
              <Col xxl={2} lg='auto' sm={3} xs={12} className="gx-0 position-relative">
                <div className='card-image'>
                  <Card.Img
                    src={data?.image || '/assets/images/user.jpg'}
                    variant="top"
                    alt="Agent Logo"
                    height={"250"}
                  />
                  <div className="rent-sale">
                    <Badge bg="warning" text="black" className="rounded-0 me-2">
                      {data?.property_sale} {translation?.sale || "SALE"}
                    </Badge>

                    <Badge bg="success" className="rounded-0 me-2">
                      {data?.property_rent} {translation?.rent || "RENT"}
                    </Badge>
                  </div>
                </div>
              </Col>
              <Col lg sm={9} xs={12}>
                <Card.Body className='p-0'>
                  <div className='onCover'>

                  </div>
                  <div className='outCover'>
                    <Card.Title as='h4' className='mb-2 agent-name text-sm-start text-center'>
                      {data?.name || ""}
                    </Card.Title>
                    {data?.address && (
                      <p className="text-muted">
                        <GeoAlt color="#1365CF" size={18} /> {data.address}
                      </p>
                    )}

                    <Row className='align-items-end'>
                      <Col className='col-lg col-12'>
                        <div className="d-flex gap-2">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleEmailPhoneClick('email')}
                          >
                            <EnvelopeFill color="#1365CF" size={16} /> {showEmail?.show && showEmail?.value ? showEmail.value : `${translation?.email || "Email"}`}
                          </Button>
                          <Button
                            variant="outline-info"
                            size="sm"
                            className={showPhone?.show && showPhone?.value ? 'text-info' : ''}
                            onClick={() => handleEmailPhoneClick('phone')}
                            disabled={showPhone?.show}
                            style={{ minWidth: '72px' }}
                          >
                            <PhoneFill color="#0dcaf0" size={16} /> {showPhone?.show && showPhone?.value ? showPhone.value : `${translation?.call || 'Call'}`}
                          </Button>
                          <Button
                            variant="outline-success"
                            size="sm"
                            onClick={() => handleWhatsappClick(data)}
                          >
                            <Whatsapp color="#198754" size={16} />{" "}
                            {translation?.whatsapp || "whatsapp"}
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Card.Body>
              </Col>
            </Row>
          </div>
        </div>

        <section className='section profile'>
          <div className='container-fluid'>
            <Row>
              <Col xl={9} lg={9} xs={12}>
                <div className="search-form">
                  <form id="">
                    <Row className="gx-3">
                      <Col lg='auto' xs='auto' onClick={() => toggleDropdown('buy_sell')}>
                        <Dropdown className="mb-2" show={dropdownState?.buy_sell}>
                          <Dropdown.Toggle
                            variant="outline-secondary"
                            className="btn-form-control bg-white border"
                          >
                            {filters.post_for ? filters.post_for == 'sale' ? 'Sale' : 'Rent' : "Select"}
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item onClick={() => handleFilterChange("post_for", "")}>Select</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleFilterChange("post_for", "sale")}>Sale</Dropdown.Item>
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
                  ) : list?.length > 0 ? (
                    list?.map((property, i) => {
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
                                    {property.name}
                                  </Link>
                                </h4>
                                <h5 className="mb-0">
                                  {translation?.price || "Price:"}
                                  {" "}
                                  {formatPrice(property?.property_price)}
                                </h5>

                                <ul className="list-info mb-2">
                                  {property?.bedrooms && (
                                    <li>
                                      <i className="icon-img-bed" title="Bedrooms:" />
                                      <span>{property.bedrooms}</span> Beds
                                    </li>
                                  )}

                                  {property?.bathrooms && (
                                    <li>
                                      <i className="icon-img-tub" title="Bathrooms:" />
                                      <span>{property.bathrooms}</span> Bath
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
                                    src={`${data?.image ||
                                      "/assets/images/user.jpg"
                                      }`}
                                    alt="Company"
                                    height={36}
                                    width={36}
                                  />
                                  <div className="ps-2">
                                    <h6 className="mb-0">
                                      {data?.name || "User"}
                                    </h6>
                                    <p className="small text-muted">
                                      {data?.user_type === "A"
                                        ? "Agent"
                                        : data?.user_type === "B"
                                          ? "Builder"
                                          : data?.user_type === "O"
                                            ? "Owner"
                                            : ""}
                                    </p>
                                  </div>
                                </div>
                                <button
                                  className="btn btn-primary btn-sm"
                                  onClick={() =>
                                    handleClick(property.id)
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

                {!property_loading && pagination && pagination?.current_page < pagination?.last_page && (
                  <>
                    <button
                      className="btn btn-primary d-block mx-auto mt-4"
                      onClick={() => handleLoadMoreClick(pagination?.current_page + 1)}
                    >
                      {translation?.load_more || "Load More"}
                    </button>
                  </>
                ) || null}
              </Col>
            </Row>
          </div>
        </section>
      </MainLayout>
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
            agentId={user_id}
            handleClose={handleEnquiryClose}
            callSuccessfuntion={callEmailSuccessfunction}
          />
        </Modal.Body>
      </Modal>
    </>

  );
};

export default Index;