"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import MainLayout from "@/components/layout/MainLayout";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import AuthUser from "@/components/Authentication/AuthUser";
import { useRouter } from "next/router";
import useDateFormat from "@/hooks/useDateFormat";
import { useSearchParams } from "next/navigation";
import LocalitySearch from "@/components/MapData/LocalitySearch";
import CardImageSlider from "@/components/cardImageSlider/CardImageSlider";
import EnquiryForm from "@/components/charts/EnquiryForm";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import { useAuth } from "@/context/AuthProvider";
import useTranslation from "@/hooks/useTranslation";
import {
  filterOptions,
  CommercialFilterOptions,
  subfilterOptions,
} from "@/components/post/PropertyData";
import {
  Form,
  Row,
  Col,
  ListGroup,
  Nav,
  ProgressBar,
  FloatingLabel,
  Dropdown,
  DropdownButton,
  Modal,
  ButtonGroup, 
  Button
} from "react-bootstrap";
import { Calendar, GeoAlt, Heart } from 'react-bootstrap-icons';
import { Divide, MapPin } from "lucide-react";

const budgets = [
  { key: 1, name: "$99 - $199" },
  { key: 2, name: "$200 - $300" },
  { key: 3, name: "$301 - $499" },
  { key: 4, name: "$500 - $999" },
  { key: 5, name: "Above $1000" },
];

const index = () => {
  const { defaultCity } = useAuth();
  const translation = useTranslation();
  const { callApi, isLogin, GetMemberId } = AuthUser();
  const memberId = GetMemberId();
  const [loading, setLoading] = useState(true);
  const [locationData, setLocationData] = useState([]);
  const [postFor, setPostFor] = useState("sell");
  const [selectedLoacation, setSelectedLocation] = useState("");
  const [selectedPropertyType, setSelectedPropertyType] = useState("");
  const [selectedProeprtyFor, setSelectedProeprtyFor] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showDrop, setShowDrop] = useState(false);
  const [selectedOption, setSelectedOption] = useState(translation?.sort_by || "Sort By");
  const [localityData, setLocalityData] = useState(null);
  const [advanceFilter, setAdvanceFilter] = useState(false);
  const [selectedAdvanceFilter, setSelectedAdvanceFilter] = useState("");
  const [activeDynamicKey, setActiveDynamicKey] = useState("");
  const [dynamicFieldLoading, setDynamicFieldLoading] = useState(true);
  const [dynamicList, setDynamicList] = useState([]);
  const [selectedGender, setSelectedGender] = useState("");
  const [budget, setBudget] = useState("");
  const [totalPropertyCount, setTotalPropertyCount] = useState(0);
  const [selectedBedrooms, setSelectedBedrooms] = useState("");
  const [selectedParking, setSelectedParking] = useState("");

  const bedrooms = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const parkingOptions = [
    { slug: "available", name: "Available" },
    { slug: "not-available", name: `${translation?.not_available || "Not available"}` },
  ];
  const [selectedSubFilters, setSelectedSubFilters] = useState([]);
  const [showLoginErrorModal, setShowLoginErrorModal] = useState(false);
  const [SearchData, setSearchData] = useState({
    carpet_area: "",
    possession_status: [],
    sale_type: [],
    posted_by: [],
    ownership: [],
    furnishing: [],
    amenities: [],
    verify_properties: [],
    facing: [],
    floor: [],
    bathroom: [],
    mb_exclusive_properties: [],
    posted_by_certified_agents: [],
    rera_registered_properties: [],
    rera_registered_agents: [],
    min_budget: 0,
    max_budget: 100000000,
  });

  const [propertyList, setPropertyList] = useState(null);
  const [propertyTypeList, setPropertyTypeList] = useState([]);
  const [subPropertyList, setSubPropertyList] = useState([]);

  const [page, setpage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [propertyId, setPropertyId] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);

  useEffect(() => {
    const fetchPropertyTypeList = async () => {
      try {
        const res = await callApi({
          api: "/get_property_type",
          method: "GET",
        });
        if (res && res?.status === 1) {
          setPropertyTypeList(res?.data || []);
        } else {
          toast.error(res?.message || "Error fetching property types");
        }
      } catch (error) {
        toast.error(error?.message || "Error fetching property types");
      }
    };
    fetchPropertyTypeList();
  }, []);


  useEffect(() => {
    if (router?.isReady) {
      const queryObject = getSearchParamsData();
      // SET THE STATES
      if (queryObject?.post_for) {
        setPostFor(queryObject.post_for);
      }
      if (queryObject?.property_type) {
        setSelectedPropertyType(queryObject.property_type);
      }
      if (queryObject?.property_for) {
        setSelectedProeprtyFor(queryObject.property_for);
      }
      if (queryObject?.sort_key && queryObject?.sort_order) {
        setSelectedSort(queryObject.sort_key, queryObject.sort_order);
      }

      let data = { ...SearchData };
      if (router?.query?.searchData) {
        data = {
          ...SearchData,
          ...JSON.parse(router?.query?.searchData),
        };

        if (data?.carpet_area) {
          const carpetObject = subfilterOptions?.carpet_area?.find(
            (item, i) => item?.id == data?.carpet_area
          );
          if (carpetObject) {
            const newObjcet = JSON.parse(carpetObject?.key);
            if (newObjcet) {
              data = {
                ...data,
                ...newObjcet,
              };
            }
          }
        }
        delete data.carpet_area;
        setSearchData((prev) => {
          return {
            ...prev,
            ...JSON.parse(router?.query?.searchData),
          };
        });
      }
      if (page > 1) {
        getAdvanceSearch(true, page, data)
      } else {
        getAdvanceSearch(null, page, data);
      }

    }
  }, [router?.query, memberId, page, defaultCity?.city_id]);

  useEffect(() => {
    if (filterOptions?.length > 0) {
      setSelectedAdvanceFilter(filterOptions[0]?.key);
    }
  }, [filterOptions]);

  useEffect(() => {
    if (selectedPropertyType) {
      const getSubPropertyType = async () => {
        try {
          const res = await callApi({
            api: `/get_property_for/${selectedPropertyType}`,
            method: "GET",
          });
          if (res && res?.status === 1) {
            setSubPropertyList(res?.data || []);
          } else {
            toast.error(res?.message || "Error fetching property for options");
          }
        } catch (error) {
          toast.error(res?.message || "Error fetching property for options");
        }
      };

      getSubPropertyType();
    }
  }, [selectedPropertyType]);

  useEffect(() => {
    if (selectedAdvanceFilter) {
      let url;
      switch (selectedAdvanceFilter) {
        case "furnishing":
          url = "/get_property_furnish";
          break;
        case "amenities":
          url = "/get_property_amnity";
          break;
        case "possession_status":
          url = "/get_property_status";
          break;
        default:
          url = null;
      }
      if (url) {
        setActiveDynamicKey(selectedAdvanceFilter);
        const getList = async () => {
          setDynamicFieldLoading(true);
          try {
            const args = {
              api: url,
              method: "GET",
            };

            const res = await callApi(args);
            if (res && res?.status === 1) {
              setDynamicList(res?.data);
            }
          } catch (error) {
            console.log(error?.message || "Something went wrong");
          } finally {
            setDynamicFieldLoading(false);
          }
        };
        getList();
      }
    }
  }, [selectedAdvanceFilter]);

  const handlePostForTabChange = (tab) => {
    if (tab) {
      setPostFor(tab);
    }
  };
  const handleClick = (property_id) => {
    setPropertyId(property_id);
    setShowContactModal(true);
  };
  const handleContactClose = () => setShowContactModal(false);

  const handlePropertyTypeChange = (e) => {
    setSelectedPropertyType(e.target.value);
  };
  const handleLoginErrorClose = () => setShowLoginErrorModal(false);

  const handleSearchClick = () => {
    const queryObject = getSearchParamsData();
    if (postFor) {
      queryObject.post_for = postFor;
    }
    if (selectedPropertyType) {
      queryObject.property_type = selectedPropertyType;
    }
    if (selectedProeprtyFor) {
      queryObject.property_for = selectedProeprtyFor;
    }
    if (localityData) {
      queryObject.location_data = JSON.stringify(localityData);
    }
    const searchParams = new URLSearchParams(queryObject).toString();
    router.push(`/property-listing?${searchParams}`);
  };

  const getSearchParamsData = () => {
    let queryObject = {};
    if (router?.query?.post_for) queryObject.post_for = router.query.post_for;
    if (router?.query?.property_type)
      queryObject.property_type = router.query.property_type;
    if (router?.query?.property_for)
      queryObject.property_for = router.query.property_for;
    if (router?.query?.property_budget)
      queryObject.property_budget = router.query.property_budget;
    if (router?.query?.property_size)
      queryObject.property_size = router.query.property_size;
    if (router?.query?.bedrooms) queryObject.bedrooms = router.query.bedrooms;
    if (router?.query?.parking) queryObject.parking = router.query.parking;
    if (router?.query?.sort_key) queryObject.sort_key = router.query.sort_key;
    if (router?.query?.sort_order)
      queryObject.sort_order = router.query.sort_order;

    return queryObject;
  };



  const handleLoadMoreClick = (newPage) => {
    setpage(newPage);
  };

  const setSelectedSort = (sortKey, sortOrder) => {
    let option = null;

    if (sortKey === "created_at" && sortOrder === "desc") {
      option = "Recent";
    } else if (sortKey === "exp_price" && sortOrder === "asc") {
      option = "Price - Low to High";
    } else if (sortKey === "exp_price" && sortOrder === "desc") {
      option = "Price - High to Low";
    } else if (sortKey === "property_size" && sortOrder === "asc") {
      option = "size/sqft - Low to High";
    } else if (sortKey === "property_size" && sortOrder === "desc") {
      option = "size/sqft - High to Low";
    }

    setSelectedOption(option || "Recent");
  };

  const handleSortSelection = (sortOption) => {
    setShowDrop(false);
    setSelectedOption(sortOption);

    let newSortKey = null;
    let newSortOrder = null;

    if (sortOption === "Recent") {
      newSortKey = "created_at";
      newSortOrder = "desc";
    } else if (sortOption === "Price - Low to High") {
      newSortKey = "exp_price";
      newSortOrder = "asc";
    } else if (sortOption === "Price - High to Low") {
      newSortKey = "exp_price";
      newSortOrder = "desc";
    } else if (sortOption === "size/sqft - Low to High") {
      newSortKey = "property_size";
      newSortOrder = "asc";
    } else if (sortOption === "size/sqft - High to Low") {
      newSortKey = "property_size";
      newSortOrder = "desc";
    }

    router.push(
      {
        pathname: "/property-listing",
        query: {
          ...Object.fromEntries(searchParams.entries()),
          sort_key: newSortKey,
          sort_order: newSortOrder,
        },
      },
      undefined,
      { shallow: true }
    );
  };

  const handleDynamicValueChange = (name, value) => {
    setSearchData((prevState) => {
      const currentValues = prevState[name] || [];

      if (Array.isArray(currentValues)) {
        if (currentValues.includes(value)) {
          return {
            ...prevState,
            [name]: currentValues.filter((item) => item !== value),
          };
        } else {
          return {
            ...prevState,
            [name]: [...currentValues, value],
          };
        }
      } else {
        return {
          ...prevState,
          [name]: [value],
        };
      }
    });
  };
  const handleSubFilterSelection = (categoryKey, subFilterKey) => {
    setSelectedSubFilters((prev) => {
      const newSelectedFilters = prev.includes(subFilterKey)
        ? prev.filter((key) => key !== subFilterKey)
        : [...prev, subFilterKey];

      setSearchData((prevState) => {
        return {
          ...prevState,
          [categoryKey]: newSelectedFilters,
        };
      });

      return newSelectedFilters;
    });
  };


  const handleViewProperty = () => {
    const existingParams = new URLSearchParams();
    if (selectedPropertyType)
      existingParams.set("property_type", selectedPropertyType);
    if (selectedProeprtyFor)
      existingParams.set("property_for", selectedProeprtyFor);
    if (postFor) existingParams.set("post_for", postFor);
    if (localityData && localityData !== null)
      existingParams.set(
        "location_data",
        JSON.stringify(localityData)
      );

    const stringifiedSearchData = JSON.stringify(SearchData);
    const url = `/property-listing?${existingParams?.toString()}&searchData=${stringifiedSearchData}`;
    router.push(url);
    setAdvanceFilter(false);
  };

  const getAdvanceSearch = async (loadMore, recent_page, SearchData) => {
    if (!loadMore) {
      setLoading(true);
    }
    // let city_id;
    // const city = localStorage?.getItem("city");
    // if(city) {
    //   const cityObj = JSON.parse(city);
    //   city_id = cityObj?.city_id;
    // }
    const existingParams = new URLSearchParams();
    if (router?.query?.property_for)
      existingParams.set("property_type", router?.query?.property_type || "1");
    if (router?.query?.property_type)
      existingParams.set("property_for", router?.query?.property_for || "1");
    if (router?.query?.post_for)
      existingParams.set("post_for", router?.query?.post_for || "sell");

    existingParams.set("city_id", defaultCity?.city_id)


    const payloadSearch = Object.fromEntries(existingParams.entries());
    const { sort_key, sort_order } = router?.query;
    let queryParams = `recent_page=${recent_page || 1}&user_id=${memberId}`

    if (sort_key) queryParams += `&sort_key=${sort_key}`;
    if (sort_order) queryParams += `&sort_order=${sort_order}`;

    if (router?.query?.location_data) {
      const localityObj = JSON.parse(router?.query?.location_data);
      payloadSearch.locality = localityObj?.locality;
    }

    try {
      const res = await callApi({
        api: `/advance_search_result?${queryParams}`,
        method: "POST",
        data: {
          SearchData: JSON.stringify(SearchData),
          searchPayload: JSON.stringify(payloadSearch),
        },
      });

      if (res && res?.status === 1) {
        if (loadMore) {
          setAdvanceSearchResponse(res?.data, true);
        } else {
          setAdvanceSearchResponse(res?.data);
        }
      }
    } catch (error) {
      console.error(error?.message || "Something Went wrong");
      setCurrentPage(0);
      setTotalPage(0);
    } finally {
      setLoading(false);
    }
  };

  const setAdvanceSearchResponse = (data, loadMore) => {
    if (Array.isArray(data)) {
      setPropertyList(data || []);
      setTotalPropertyCount(0);
      setCurrentPage(0);
      setTotalPage(0);
    } else {
      if (loadMore) {
        setPropertyList((prev) => {
          return [...prev, ...data?.searched_properties];
        });
        setTotalPropertyCount(data?.pagination?.total_properties || 0);
      } else {
        setPropertyList(data?.searched_properties);
        setTotalPropertyCount(data?.pagination?.total_properties || 0);
      }
      setTotalPage(data?.pagination?.total_pages);
      setCurrentPage(data?.pagination?.current_page)
    }
  };

  const handleGenderChange = (e) => {
    setSelectedGender(e?.target?.value);
  };
  const handleBudgetChange = (e) => {
    setBudget(e?.target?.value);
  };

  const handleCarpetAreaChange = (e) => {
    const value = e?.target?.value;
    setSearchData((prev) => {
      return {
        ...prev,
        carpet_area: value,
      };
    });
  };

  console.log("loading", loading);
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
    const newList = propertyList?.map((item) => {
      if (item?.property_id == id) {
        return {
          ...item,
          is_favorite: !item.is_favorite,
        };
      } else {
        return item;
      }
    });

    setPropertyList(newList);
  };

  const handleMinMaxBudgetChange = (data) => {
    if (Array.isArray(data) && data?.length > 0) {
      setSearchData((prev) => {
        return {
          ...prev,
          min_budget: data[0],
          max_budget: data[1],
        };
      });
    }
  };
  const advanceFilters =
    selectedPropertyType == "1" ? filterOptions : CommercialFilterOptions;

  return (
    <MainLayout>
      <Helmet>
        <title>
          {translation?.explore_property_listings || "Explore Property Listings | Buy, Rent, or Invest with RealEstate"}
        </title>
        <meta
          name="description"
          content="Browse thousands of properties for sale or rent, including houses, apartments, and commercial spaces. Find the perfect property that matches your needs and budget."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>

      {/* SEARCH SECTION  */}
      <div className="short-banner">
        <div className="container">
          <h1>{translation?.property_list || "Property List"}</h1>
        </div>
      </div>

      {/* LIST SECTION  */}
      <section className="section">
        <div className="container-fluid">
          <div className="search-form">

          </div>
          {/* SEARCH FORM  */}
          <form id="searchfilter">
            <div className="row gx-3">
              <Col className="col-lg-auto col-sm-2 col-auto">
                {/*<ul className="nav nav-pills justify-content-center mb-3">
                  <li
                    className="nav-item"
                    onClick={() => handlePostForTabChange("sell")}
                  >
                    <a
                      className={`nav-link ${
                        postFor === "sell" ? "active" : ""
                      }`}
                    >
                      {translation?.buy || "Buy"}
                    </a>
                  </li>
                  <li
                    className="nav-item"
                    onClick={() => handlePostForTabChange("rent")}
                  >
                    <a
                      className={`nav-link ${
                        postFor === "rent" ? "active" : ""
                      }`}
                    >
                        {translation?.rent || "Rent"}
                    </a>
                  </li>
                   <li
                    className="nav-item"
                    onClick={() => handlePostForTabChange("pg_hostel")}
                  >
                    <a
                      className={`nav-link ${
                        postFor === "pg_hostel" ? "active" : ""
                      }`}
                    >
                      {translation?.pg_hostel || "PG/Hostel"}
                    </a>
                  </li>
                </ul> */}

                <Dropdown className="d-grid">
                  <Dropdown.Toggle variant="outline-primary" id="dropdown-basic">
                    Buy
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => handlePostForTabChange("sell")}>{translation?.buy || "Buy"}</Dropdown.Item>
                    <Dropdown.Item onClick={() => handlePostForTabChange("rent")}>{translation?.rent || "Rent"}</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>

              </Col>
              <Col className="col-lg col-sm-10"><LocalitySearch setLocalityData={setLocalityData} /></Col>

              {postFor !== "pg_hostel" && (
                <>
                  <div className="col-lg col-sm-6 col-12">
                    {/* <FloatingLabel label="Property Type" className="mb-3">
                      <Form.Select
                        value={selectedPropertyType}
                        onChange={handlePropertyTypeChange}
                      >
                        <option value="" disabled>
                          {translation?.select_property_type || "Select Property Type"}
                        </option>
                        {propertyTypeList?.map((type) => {
                          return (
                            <option
                              key={type.category_id}
                              value={type.category_id}
                            >
                              {type.category_name}
                            </option>
                          );
                        })}
                      </Form.Select>
                    </FloatingLabel> */}
                    <Dropdown className="select-dropdown d-grid">
                      <Dropdown.Toggle className="btn-form-control" id="dropdown-basic">
                        Residential
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="p-3">
                        <Nav variant="underline" className="mb-3">
                          <Nav.Item>
                            <Nav.Link role="button" className="active">Residential</Nav.Link>
                          </Nav.Item>
                          <Nav.Item>
                            <Nav.Link role="button">Commercial</Nav.Link>
                          </Nav.Item>
                        </Nav>
                        
                          {['radio'].map((type) => (
                            <ButtonGroup className="btn-group-light">
                              <input
                                type="radio"
                                className="btn-check"
                                name="group1"
                                id={`inline-${type}-1`}
                              />
                              <label
                              className="btn btn-outline-light"
                              htmlFor={`inline-${type}-1`}
                              >Appartment</label>
                              <input
                                type="radio"
                                className="btn-check"
                                name="group1"
                                id={`inline-${type}-2`}
                              />
                              <label
                              className="btn btn-outline-light"
                              htmlFor={`inline-${type}-2`}
                              >Flat</label>
                              <input
                                type="radio"
                                className="btn-check"
                                id={`inline-${type}-3`}
                              />
                              <label
                              className="btn btn-outline-light"
                              htmlFor={`inline-${type}-3`}
                              >Villa</label>
                              <input
                                type="radio"
                                className="btn-check"
                                id={`inline-${type}-4`}
                              />
                              <label
                              className="btn btn-outline-light"
                              htmlFor={`inline-${type}-4`}
                              >Penthouse</label>
                              <input
                                type="radio"
                                className="btn-check"
                                id={`inline-${type}-5`}
                              />
                              <label
                              className="btn btn-outline-light"
                              htmlFor={`inline-${type}-5`}
                              >Plot</label>
                            </ButtonGroup>
                          ))}
                        
                      </Dropdown.Menu>                      
                    </Dropdown>
                  </div>
                  <div className="col-lg col-sm-6 col-12">
                    <FloatingLabel label="Property For" className="mb-3">
                      <Form.Select
                        value={selectedProeprtyFor}
                        onChange={(e) => setSelectedProeprtyFor(e?.target?.value)}
                      >
                        <option value="">{translation?.select_property_for || "Select Property For"}</option>
                        {subPropertyList?.map((option) => (
                          <option
                            key={option.sub_category_id}
                            value={option.sub_category_id}
                          >
                            {option.sub_category_name}
                          </option>
                        ))}
                      </Form.Select>
                    </FloatingLabel>
                  </div>
                </>
              )}
              {postFor === "pg_hostel" && (
                <>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <FloatingLabel label={translation?.gender || "Gender"}>
                      <Form.Select
                        value={selectedGender}
                        onChange={handleGenderChange}
                      >
                        <option value=""> {translation?.gender || "Gender"}</option>
                        <option value="M">{translation?.boys || "Boys"}</option>
                        <option value="F">{translation?.girls || "Girls"}</option>
                      </Form.Select>
                    </FloatingLabel>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <FloatingLabel label="Budget">
                      <Form.Select
                        value={budget}
                        onChange={handleBudgetChange}
                      >
                        <option value=""> {translation?.budget || "Budget"}</option>
                        {budgets.map((budget) => (
                          <option key={budget.key} value={budget.key}>
                            {budget.name}
                          </option>
                        ))}
                      </Form.Select>
                    </FloatingLabel>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12 mt-2 mb-2">
                    <FloatingLabel label="Bedrooms">
                      <Form.Select
                        value={selectedBedrooms}
                        onChange={(e) => setSelectedBedrooms(e?.target?.value)}
                      >
                        <option value=""> {translation?.bedrooms || "Bedrooms"}</option>
                        <option value="">{translation?.select_bedrooms || "Select Bedrooms"}</option>
                        {bedrooms.map((bedroom, index) => (
                          <option key={index} value={bedroom}>
                            {bedroom}
                          </option>
                        ))}
                      </Form.Select>
                    </FloatingLabel>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12 mt-2 mb-2">
                    <FloatingLabel label="Parking">
                      <Form.Select
                        value={selectedParking}
                        onChange={(e) => setSelectedParking(e?.target?.value)}
                      >
                        <option value="">{translation?.select_parking || "Select Parking"}</option>
                        {parkingOptions.map((option) => (
                          <option key={option.slug} value={option.slug}>
                            {option.name}
                          </option>
                        ))}
                      </Form.Select>
                    </FloatingLabel>
                  </div>
                </>
              )}
              <div
                className={`col-lg-auto col-6 mb-3 ${postFor === "pg_hostel" ? "mt-2" : ""
                  }`}
              >
                <div className="d-grid">
                  <Button variant="primary"
                    onClick={handleSearchClick}
                  >
                    {translation?.search || "Search"}
                  </Button>
                </div>
              </div>
              {postFor !== "pg_hostel" && (
                <div className="col-lg-auto col-6 mb-3">
                  <div className="d-grid">
                    <Button variant="primary"
                      onClick={() => setAdvanceFilter((prev) => !prev)}
                      disabled={selectedPropertyType ? false : true}
                    >
                      {advanceFilter ? (translation?.hide_advanced || "Hide Advanced") : (translation?.advanced || "Advanced")}

                    </Button>
                  </div>
                </div>
              )}

            </div>

            {/* ADVANCE FILTER  */}
            {selectedPropertyType &&
              postFor !== "pg_hostel" &&
              advanceFilter && (
                <div
                  style={{
                    display: "inline-flex",
                    background: "white",
                    padding: "1rem",
                    marginTop: "2px",
                    position: "absolute",
                    right: "0px",
                    width: "700px",
                    border: "1px solid rgb(221, 221, 221)",
                    columnGap: "1rem",
                  }}
                >
                  <div>
                    <ul className="list-group">
                      {advanceFilters?.map((item, i) => {
                        return (
                          <li
                            className="list-group-item"
                            style={{
                              cursor: "pointer",
                              fontWeight:
                                selectedAdvanceFilter === item?.key
                                  ? "bold"
                                  : "",
                            }}
                            onClick={() => {
                              setSelectedAdvanceFilter(item?.key);
                              setSelectedSubFilters([])
                            }}
                          >
                            {item?.name || `${translation?.not_available || "Not available"}`}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  <div style={{ width: "100%" }}>
                    {selectedAdvanceFilter &&
                      (selectedAdvanceFilter === "furnishing" ||
                        selectedAdvanceFilter === "amenities" ||
                        selectedAdvanceFilter === "possession_status") ? (
                      <div>
                        <h4>
                          {translation?.sub_filters_for || "Sub Filters for"}{" "}
                          {
                            filterOptions.find(
                              (f) => f.key === selectedAdvanceFilter
                            ).name
                          }
                        </h4>
                        <div>
                          {dynamicFieldLoading && (
                            <>
                              <div
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  border: "4px solid #3498db",
                                  borderTop: "4px solid transparent",
                                  borderRadius: "50%",
                                  animation: "spin 1s linear infinite",
                                  marginLeft: "150px",
                                  marginTop: "100px",
                                }}
                              ></div>

                              <style>
                                {`
                                 @keyframes spin {
                                     0% {
                                         transform: rotate(0deg);
                                     }
                                     100% {
                                         transform: rotate(360deg);
                                     }
                                 }
                             `}
                              </style>
                            </>
                          )}
                          {!dynamicFieldLoading &&
                            dynamicList?.map((item, i) => {
                              if (selectedAdvanceFilter === "furnishing") {
                                return (
                                  <div key={item?.furnish_id || i}>
                                    <input
                                      type="checkbox"
                                      onChange={() =>
                                        handleDynamicValueChange(
                                          selectedAdvanceFilter,
                                          item?.furnish_id
                                        )
                                      }
                                      checked={SearchData[
                                        selectedAdvanceFilter
                                      ]?.includes(item?.furnish_id)}
                                    />
                                    {item?.furnish_name}
                                  </div>
                                );
                              } else if (
                                selectedAdvanceFilter === "amenities"
                              ) {
                                return (
                                  <div key={item?.amenity_id || i}>
                                    <input
                                      type="checkbox"
                                      onChange={() =>
                                        handleDynamicValueChange(
                                          selectedAdvanceFilter,
                                          item?.amenity_id
                                        )
                                      }
                                      checked={SearchData[
                                        selectedAdvanceFilter
                                      ]?.includes(item?.amenity_id)}
                                    />
                                    {item?.amenity_name}
                                  </div>
                                );
                              } else if (
                                selectedAdvanceFilter === "possession_status"
                              ) {
                                return (
                                  <div key={item?.status_id || i}>
                                    <input
                                      type="checkbox"
                                      onChange={() =>
                                        handleDynamicValueChange(
                                          selectedAdvanceFilter,
                                          item?.status_id
                                        )
                                      }
                                      checked={SearchData[
                                        selectedAdvanceFilter
                                      ]?.includes(item?.status_id)}
                                    />
                                    {item?.status_name}
                                  </div>
                                );
                              }
                            })}
                        </div>
                      </div>
                    ) : selectedAdvanceFilter === "carpet_area" ? (
                      <>
                        <div style={{}}>
                          <h4> {translation?.sub_filters_for_carpet_area || "sub filters for Carpet Area"}</h4>
                          <div>
                            {subfilterOptions[selectedAdvanceFilter]?.map(
                              (item, i) => {
                                return (
                                  <div style={{ marginBottom: "8px" }}>
                                    <input
                                      type="radio"
                                      name="carpet_area"
                                      value={item?.id}
                                      checked={
                                        item?.id == SearchData?.carpet_area
                                      }
                                      onChange={handleCarpetAreaChange}
                                    />{" "}
                                    {item?.name}
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </div>
                      </>
                    ) : subfilterOptions[selectedAdvanceFilter] ? (
                      <div>
                        <h4>
                          {translation?.sub_filters_for || "sub filters for"}{" "}
                          {
                            advanceFilters?.find(
                              (item) => item?.key === selectedAdvanceFilter
                            )?.name
                          }
                        </h4>
                        <div>
                          {subfilterOptions[selectedAdvanceFilter]?.map(
                            (subFilter, i) => {
                              return (
                                <div
                                  key={subFilter.key}
                                  style={{
                                    marginBottom: "8px",
                                  }}
                                >
                                  <input
                                    type="checkbox"
                                    onChange={() =>
                                      handleSubFilterSelection(
                                        selectedAdvanceFilter,
                                        subFilter.key
                                      )
                                    }
                                    checked={SearchData[
                                      selectedAdvanceFilter
                                    ]?.includes(subFilter?.key)}
                                  />
                                  {` ${subFilter.name}` || `${translation?.not_available || "Not available"}`}
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    ) : (
                      selectedAdvanceFilter === "price_range" && (
                        <>
                          <div
                            style={{
                              marginBottom: "8px",
                            }}
                          >
                            <div style={{ width: "100%" }}>
                              <h3>{translation?.price || "Price"}</h3>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  gap: "5px",
                                  alignItems: "center",
                                  marginTop: "20px",
                                }}
                              >
                                <span>0</span>
                                <RangeSlider
                                  value={[
                                    SearchData?.min_budget || 0,
                                    SearchData?.max_budget || 10000000,
                                  ]}
                                  min={0}
                                  max={10000000}
                                  step={1}
                                  onInput={handleMinMaxBudgetChange}
                                  className="w-64"
                                />
                                <span>10000000</span>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  gap: "100px",
                                  justifyContent: "center",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                  }}
                                >
                                  <span>{translation?.min || "min"}</span>
                                  <input
                                    type="text"
                                    value={SearchData?.min_budget}
                                    onChange={(e) =>
                                      setSearchData((prev) => ({
                                        ...prev,
                                        min_budget: e?.target?.value,
                                      }))
                                    }
                                    style={{ minWidth: "60px" }}
                                  />
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                  }}
                                >
                                  <span>{translation?.max || "max"}</span>
                                  <input
                                    type="text"
                                    value={SearchData?.max_budget}
                                    onChange={(e) =>
                                      setSearchData((prev) => ({
                                        ...prev,
                                        max_budget: e?.target?.value,
                                      }))
                                    }
                                    style={{ minWidth: "60px" }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )
                    )}
                  </div>
                  <button
                    type="button"
                    className="btn btn-success"
                    style={{
                      height: "40px",
                      position: "absolute",
                      bottom: "20px",
                      right: "20px",
                    }}
                    onClick={() => handleViewProperty()}
                  >
                    {translation?.view_property || "View Property"}
                  </button>
                </div>
              )}
          </form>
          <div className="row main-row">
            <aside className="col-xl-9 col-lg-9 col-12">
              <div className="d-sm-flex justify-content-between align-items-center mb-2">
                <h4 className="mb-3 mb-sm-0">
                  {translation?.total || "Total"} {" "}
                  <span className="text-primary">{totalPropertyCount}</span>{" "}
                  {translation?.properties_in || "Properties in"} {defaultCity?.name || "Kolkata"}
                  {/* {translation?.properties_found || "Properties Found"} */}
                </h4>
                <div className="sort-by">
                  <DropdownButton
                    align="end"
                    title={selectedOption}
                    id="dropdown-menu-align-end"
                    onClick={() => setShowDrop(!showDrop)}
                    aria-expanded={showDrop ? "true" : "false"}
                  >
                    {[
                      "Recent",
                      "Price - Low to High",
                      "Price - High to Low",
                      "Size - Low to High",
                      "Size - High to Low",
                    ].map((option) => (
                      <Dropdown.Item eventKey="1" key={option}
                        onClick={() => handleSortSelection(option)}
                      >
                        {option}
                      </Dropdown.Item>
                    ))}
                  </DropdownButton>
                </div>
              </div>
              <div className="list-display">
                {(propertyList?.length === 0 && !loading) && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "50vh",
                      textAlign: "center",
                      fontSize: "28px",
                      fontWeight: "bold",
                      color: "#555",
                    }}
                  >
                    <p>{translation?.no_result_found || "No result found"}</p>
                  </div>
                )}

                {propertyList?.length > 0 &&
                  propertyList?.map((property, i) => {
                    return (
                      <div key={property.property_id} className="card card-ads">
                        <div className="row g-0">
                          <div className="col-lg-3 col-sm-3">
                            <CardImageSlider
                              data={property}
                              showSq={true}
                              icons={true}
                              addRemoveFav={() => SaveFavouriteProperty(property.property_id)}
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
                                {property?.price_currency &&
                                  property?.exp_price
                                  ? `${property.price_currency
                                  } ${new Intl.NumberFormat("en-US").format(
                                    property.exp_price
                                  )}`
                                  : "Price not available"}
                              </h5>
                              
                              <p className="mb-1"><small>Average Price: {property?.price_currency || property?.currency || ""}{" "} {property?.area_in_sqft || ""}{" sq/ft"}</small> </p>
                              <ul className="list-info mb-2">
                                <li>
                                  <i
                                    className="icon-img-bed"
                                    title="Bedrooms:"
                                  ></i>
                                  <span>{property?.bedrooms || "Not Available"}</span> {property?.bedrooms &&('Beds')} 
                                </li>
                                <li>
                                  <i
                                    className="icon-img-tub"
                                    title="Bathrooms:"
                                  ></i>
                                  <span>{property?.bathroom || "Not Available"}</span> {property?.bedrooms &&('Bath')}  
                                </li>
                                <li>
                                  <i
                                    className="icon-img-ratio"
                                    title="Carpet Area:"
                                  ></i>
                                  <span>{property?.carpet_area || "Not Available"}</span> {property?.carpet_area &&('Carpet Area')}  
                                </li>
                                <li>
                                <i className="icon-img-ratio"
                                        title="Ready to move"
                                      ></i> <span>Ready to move</span>
                                </li>
                              </ul>
                              <p>
                                <span className="text-primary"><GeoAlt color="currentColor" size={14} /></span> {property.address}
                              </p>                                                          
                            </div>
                            <div className="card-footer d-flex justify-content-between align-items-center">
                              
                                {/* <div className="ad-post-date flex-grow-1">
                                  <span className="text-primary"><Calendar color="currentColor" size={12} /></span> {useDateFormat(property.created_at)}
                                </div> */}
                                <div className="d-flex">
                                  <img src="./assets/images/company/company-1.png" alt="Company" height={36} width={36} />
                                  <div className="ps-2">
                                    <h6 className="mb-0">Urban Homes</h6>
                                    <p className="small text-muted">Developer</p>
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

                          {/* Contact and Favorite Buttons */}
                          {/* <div className="col-lg-2 col-sm-2">
                            <div className="contact-box">
                              
                              
                                <button
                                  className={`btn ads-fav ${
                                    property?.is_favorite === true
                                      ? "active"
                                      : ""
                                  } msg-send mb-2`}
                                  title={property?.is_favorite === true? "Remove Fav.": `${translation?.add_fav || "Add Fav."}`}
                                  onClick={() =>
                                    SaveFavouriteProperty(property.property_id)
                                  }
                                >
                                  <Heart size={16} />                                  
                                </button>
                              
                            </div>
                          </div> */}
                        </div>
                      </div>
                    );
                  })}
              </div>
              {/* LOAD MORE  */}
              {(!loading && currentPage < totalPage) && (
                <button
                  className="btn btn-primary d-block mx-auto mt-4"
                  onClick={() => handleLoadMoreClick(page + 1)}
                >
                  {translation?.load_more || "Load More"}
                </button>
              )}
            </aside>
            <aside className="col-xl-3 col-lg-3 col-12 mr-2">
              <img
                alt="Advertisement"
                src="/assets/images/ads/real-estate-poster.jpg"
                className="img-fluid"
              />
            </aside>
          </div>
        </div>
        <Modal show={showContactModal} onHide={handleContactClose}>
          <Modal.Header closeButton>
            <Modal.Title>{translation?.contact_owner || "Contact Owner"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <EnquiryForm
              propertyId={propertyId}
              handleClose={handleContactClose}
            />
          </Modal.Body>
        </Modal>
      </section>

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
          <Modal.Title className="mx-auto"> {translation?.login_required || "Login Required"}</Modal.Title>
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
          <p className="text-center">{translation?.please_log_in_to_perform_this_action || "Please log in to perform this action."}</p>
        </Modal.Body>
      </Modal>
    </MainLayout>
  );
};

export default index;
