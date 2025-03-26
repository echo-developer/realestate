"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import MainLayout from "@/components/layout/MainLayout";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import AuthUser from "@/components/Authentication/AuthUser";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";
import CardImageSlider from "@/components/cardImageSlider/CardImageSlider";
import EnquiryForm from "@/components/charts/EnquiryForm";
import "react-range-slider-input/dist/style.css";
import { useAuth } from "@/context/AuthProvider";
import useTranslation from "@/hooks/useTranslation";
import LocalityOption from "@/components/MapData/LocalitySelector";
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
  Button,
} from "react-bootstrap";
import { GeoAlt, Search } from "react-bootstrap-icons";
import PropertyMobileFilters from "@/components/addtional/PropertyMobileFilter";
import useIsMobile from "@/hooks/useIsMobile";

const index = () => {
  const { defaultCity } = useAuth();
  const translation = useTranslation();
  const { callApi, isLogin, GetMemberId } = AuthUser();
  const memberId = GetMemberId();
  const [loading, setLoading] = useState(true);
  const [postFor, setPostFor] = useState("sale");
  const [selectedPropertyType, setSelectedPropertyType] = useState("");
  const [selectedProeprtyFor, setSelectedProeprtyFor] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showDrop, setShowDrop] = useState(false);
  const [selectedOption, setSelectedOption] = useState(
    translation?.sort_by || "Sort By"
  );
  const [localityData, setLocalityData] = useState(null);
  const [advanceFilter, setAdvanceFilter] = useState(false);
  const [selectedAdvanceFilter, setSelectedAdvanceFilter] = useState("");
  const [activeDynamicKey, setActiveDynamicKey] = useState("");
  const [dynamicFieldLoading, setDynamicFieldLoading] = useState(true);
  const [dynamicList, setDynamicList] = useState([]);
  const [selectedGender, setSelectedGender] = useState("");
  const [budget, setBudget] = useState("");
  const [totalPropertyCount, setTotalPropertyCount] = useState(0);
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
    bedrooms: [],
    kitchens: [],
    mb_exclusive_properties: [],
    posted_by_certified_agents: [],
    rera_registered_properties: [],
    rera_registered_agents: [],
    min_budget: "",
    max_budget: "",
  });
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [propertyList, setPropertyList] = useState(null);
  const [propertyTypeList, setPropertyTypeList] = useState([]);
  const [subPropertyList, setSubPropertyList] = useState([]);
  const [page, setpage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [propertyId, setPropertyId] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [BudgetDropdown, setBudgetDropdown] = useState(false);
  const [error, setError] = useState("");
  const [propertyForLoading, setPropertyForLoading] = useState(true);
  const toggleBudgetDropdown = () => setBudgetDropdown((prev) => !prev);
  const [propertyTypeDropDown, setPropertyTypeDropDown] = useState(false);
  const [bedBathDropDown, setBedBathDropDown] = useState(false);

  const isMobile = useIsMobile();

  const handleMinChange = (e) => {
    let value = e.target.value;
    if (value.length > 1 && value.startsWith("0")) {
      value = value.replace(/^0+/, "");
    }

    const numericValue = value === "" ? "" : Number(value);

    setSearchData((prev) => {
      if (prev.max_budget && numericValue > prev.max_budget) {
        setError("Min budget cannot be greater than max budget.");
        return prev;
      } else {
        setError("");
      }

      return {
        ...prev,
        min_budget: numericValue,
      };
    });
  };

  const handleMaxBudgetChange = (e) => {
    const value = Number(e.target.value);

    setSearchData((prev) => {
      if (prev.min_budget && value < prev.min_budget) {
        setError("Max budget cannot be less than min budget.");
        return prev; // Prevent updating state if invalid
      } else {
        setError("");
      }

      return {
        ...prev,
        max_budget: value,
      };
    });
  };

  const handleBedDropDown = (e) => {
    if (e.currentTarget.getAttribute("data-id") === "parent") {
      setBedBathDropDown(!bedBathDropDown);
    }
  };

  const handleBedRoomChange = (value) => {
    const state = SearchData.bedrooms || [];

    // Check if value exists in the array
    const updatedBedrooms = state.includes(value)
      ? state.filter((item) => item !== value) // Remove it if exists
      : [...state, value]; // Add it if not exists

    setSearchData((prev) => ({
      ...prev,
      bedrooms: updatedBedrooms,
    }));
  };

  const handleBathChange = (value) => {
    const state = SearchData.bathroom || [];

    // Check if value exists in the array
    const updatedBathrooms = state.includes(value)
      ? state.filter((item) => item !== value) // Remove if exists
      : [...state, value]; // Add if not exists

    setSearchData((prev) => ({
      ...prev,
      bathroom: updatedBathrooms,
    }));
  };
  const handleKitchenChange = (value) => {
    const state = SearchData.kitchens || [];
    const updatedkitchens = state.includes(value)
      ? state.filter((item) => item !== value)
      : [...state, value];

    setSearchData((prev) => ({
      ...prev,
      kitchens: updatedkitchens,
    }));
  };

  const handleMaxChange = (e) => {
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
    setError("");
    setShowDropdown(false); // Close dropdown
  };

  const applyBudget = () => {
    if (!error) {
      setShowDropdown(false); // Close dropdown
    }
  };

  const getDisplayText = () => {
    if (minBudget && maxBudget) return `$${minBudget} - $${maxBudget}`;
    if (minBudget) return `Min: $${minBudget}`;
    if (maxBudget) return `Max: $${maxBudget}`;
    return `${translation?.select_budget || "Select Budget"}`;
  };

  const handleCarpetSizeChange = (e) => {
    const { name, value } = e.target;
    setSearchData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  useEffect(() => {
    const fetchPropertyTypeList = async () => {
      try {
        const res = await callApi({
          api: "/get_property_type",
          method: "GET",
        });
        if (res && res?.status === 1) {
          setPropertyTypeList(res?.data || []);
          setSelectedPropertyType(res?.data?.[0]?.category_id);
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

      let data = {};
      if (router?.query?.searchData) {

        data = {
          // ...SearchData,
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
            // ...prev,
            ...JSON.parse(router?.query?.searchData),
          };
        });
      }
      if (page > 1) {
        getAdvanceSearch(true, page, data);
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

  const displayBedsBathKitchen = () => {
    const beds = SearchData?.bedrooms || [];
    const baths = SearchData?.bathroom || [];
    const kitchens = SearchData?.kitchens || [];

    // Convert arrays to a comma-separated string if they have values
    const bedsText = beds.length > 0 ? `${beds.join(", ")} Beds` : "";
    const bathsText = baths.length > 0 ? `${baths.join(", ")} Baths` : "";
    const kitchensText =
      kitchens.length > 0 ? `${kitchens.join(", ")} Kits` : "";

    // Combine all values with a separator
    const selections = [bedsText, bathsText, kitchensText]
      .filter(Boolean)
      .join(" / ");

    return (
      selections ||
      `${translation?.beds_baths_kitchens || "Select Beds, Baths & Kitchens"}`
    );
  };

  const displayBudget = () => {
    const min_budget = SearchData?.min_budget;
    const max_budget = SearchData?.max_budget;

    // If min_budget is 0 or "0", always return "Select Budget"
    if (min_budget === 0 || min_budget === "0") {
      return `${translation?.select_budget || "Select Budget"}`;
    }

    if (min_budget > 0 && max_budget > 0) {
      return `$${min_budget} - $${max_budget}`;
    }
    if (min_budget > 0) {
      return `$${min_budget}+`;
    }

    return `${translation?.select_budget || "Select Budget"}`; // Default case
  };

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
          } else {
            toast.error(res?.message || "Error fetching property for options");
          }
        } catch (error) {
          toast.error(res?.message || "Error fetching property for options");
        } finally {
          setPropertyForLoading(false);
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

  const handlePropertyTypeChange = (eventKey, e) => {
    setSubPropertyList([]);
    e.preventDefault();
    e.stopPropagation();
    setSelectedPropertyType(eventKey);

  };

  const handleLoginErrorClose = () => setShowLoginErrorModal(false);

  const handleSearchClick = () => {
    handleViewProperty();
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
    } else if (sortOption === "Size - Low to High") {
      newSortKey = "property_size";
      newSortOrder = "asc";
    } else if (sortOption === "Size - High to Low") {
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
      existingParams.set("location_data", JSON.stringify(localityData));

    const stringifiedSearchData = JSON.stringify(SearchData);
    const url = `/property-listing?${existingParams?.toString()}&searchData=${stringifiedSearchData}`;
    router.push(url);
    setAdvanceFilter(false);
  };

  const openBudgetDropDown = (e) => {
    if (e.currentTarget.getAttribute("data-id") === "parent") {
      setBudgetDropdown(!BudgetDropdown);
    }
  };

  const getAdvanceSearch = async (loadMore, recent_page, SearchData) => {
    if (!loadMore) {
      setLoading(true);
    }

    const existingParams = new URLSearchParams();
    if (router?.query?.property_for)
      existingParams.set("property_type", router?.query?.property_type || "1");
    if (router?.query?.property_type)
      existingParams.set("property_for", router?.query?.property_for || "1");
    if (router?.query?.post_for)
      existingParams.set("post_for", router?.query?.post_for || "sell");

    existingParams.set("city_id", defaultCity?.city_id);

    const payloadSearch = Object.fromEntries(existingParams.entries());
    const { sort_key, sort_order } = router?.query;
    let queryParams = `recent_page=${recent_page || 1}&user_id=${memberId}`;

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
      setCurrentPage(data?.pagination?.current_page);
    }
  };

  const handlePropertyTypeDropDown = (e) => {
    if (e.currentTarget.getAttribute("data-id") === "parent") {
      setPropertyTypeDropDown(!propertyTypeDropDown);
    }
  };

  const handlePropertyForChange = (e) => {
    setSelectedProeprtyFor(e?.target?.value);
  };

  const handlePropertyForReset = () => {
    setSelectedProeprtyFor("");
  };

  const handlePropertyForDone = () => {
    setPropertyTypeDropDown(false);
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


  const advanceFilters =
    selectedPropertyType == "1" ? filterOptions : CommercialFilterOptions;

  const bedrooms = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <MainLayout>
      <Helmet>
        <title>
          {translation?.explore_property_listings ||
            "Explore Property Listings | Buy, Rent, or Invest with RealEstate"}
        </title>
        <meta
          name="description"
          content="Browse thousands of properties for sale or rent, including houses, apartments, and commercial spaces. Find the perfect property that matches your needs and budget."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>

      {isMobile ? (
        <React.Fragment>
          <div className="d-md-none bg-primary p-3">
            <div className="position-relative">
              <input
                type="text"
                placeholder="Search Locality"
                className="form-control ps-5"
              />
              <Search
                size={18}
                className="position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary"
              />
            </div>
          </div>
        </React.Fragment>
      ) : (
        <React.Fragment>
          {/* SEARCH SECTION  */}
          <div className="short-banner pt-4">
            <div className="container-fluid">
              <div className="search-form">
                <form id="searchfilter">
                  <div className="row gx-3">
                    <Col className="col-lg-auto col-sm-2 col-auto">
                      <Dropdown className="d-grid select-dropdown">
                        <Dropdown.Toggle
                          variant="light"
                          className="btn-form-control"
                        >
                          {postFor === "sale"
                            ? translation?.buy || "Buy"
                            : translation?.rent || "Rent"}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item
                            onClick={() => handlePostForTabChange("sale")}
                          >
                            {translation?.buy || "Buy"}
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => handlePostForTabChange("rent")}
                          >
                            {translation?.rent || "Rent"}
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </Col>
                    <Col className="col-lg col-sm-10">
                      <LocalityOption setLocationData={setLocalityData} />
                    </Col>
                    {/* {postFor === "sell" ||
                  postFor === "rent" && ( */}
                    <>
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
                            <div className="form-field">
                              <Nav
                                variant="underline"
                                activeKey={selectedPropertyType}
                                onSelect={handlePropertyTypeChange}
                              >
                                {/* onClick={() => handlePropertyTypeTabChange(type?.category_id)} */}
                                {propertyTypeList.map((type) => (
                                  <Nav.Item key={type.category_id}>
                                    <Nav.Link
                                      role="button"
                                      eventKey={type.category_id}
                                    >
                                      {type.category_name}
                                    </Nav.Link>
                                  </Nav.Item>
                                ))}
                              </Nav>
                            </div>

                            <div className=" mt-3">
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
                                        onChange={handlePropertyForChange}
                                      />
                                      <label
                                        className="btn btn-outline-light"
                                        htmlFor={`propertyFor-${index}`}
                                      >
                                        {property.sub_category_name}
                                      </label>
                                    </div>
                                  ))}
                                </ButtonGroup>
                              </div>
                            </div>
                            <div className="d-flex justify-content-between mt-3">
                              <Button
                                variant="outline-secondary"
                                onClick={handlePropertyForReset}
                              >
                                {translation?.reset || "Reset"}
                              </Button>
                              <Button
                                variant="primary"
                                onClick={handlePropertyForDone}
                              >
                                {translation?.done || "Done"}
                              </Button>
                            </div>
                          </Dropdown.Menu>
                        </Dropdown>
                      </Col>
                      {selectedPropertyType !== "2" && (
                        <Col
                          className="col-lg col-sm-4 col-12"
                          data-id="parent"
                          onClick={handleBedDropDown}
                        >
                          <Dropdown
                            className="select-dropdown d-grid mb-3"
                            show={bedBathDropDown}
                          >
                            <Dropdown.Toggle className="btn-form-control">
                              {displayBedsBathKitchen()}
                            </Dropdown.Toggle>

                            <Dropdown.Menu className="p-3 shadow bg-white rounded">
                              {/* Bedrooms Selection */}
                              <div>
                                <label className="fw-bold mb-2">
                                  {translation?.beds || "Beds"}
                                </label>
                                <ButtonGroup className="btn-group-light d-flex gap-2">
                                  {[...bedrooms].map((bedroom, index) => (
                                    <div key={`bedroom-${index}`}>
                                      <input
                                        type="checkbox"
                                        id={`bedroom-${index}`}
                                        className="btn-check"
                                        value={bedroom}
                                        onChange={() =>
                                          handleBedRoomChange(bedroom)
                                        }
                                        checked={SearchData?.bedrooms?.includes(
                                          bedroom
                                        )}
                                      />
                                      <label
                                        className="btn btn-outline-light btn-sm"
                                        htmlFor={`bedroom-${index}`}
                                      >
                                        {bedroom}
                                      </label>
                                    </div>
                                  ))}
                                </ButtonGroup>
                              </div>

                              {/* Bathrooms Selection */}
                              <div className="mt-3">
                                <label className="fw-bold mb-2">
                                  {translation?.baths || "Baths"}
                                </label>
                                <ButtonGroup className="btn-group-light d-flex gap-2">
                                  {[1, 2, 3, 4, 5, 6, 7, "8+"].map(
                                    (bath, index) => (
                                      <div key={`bathroom-${index}`}>
                                        <input
                                          type="checkbox"
                                          id={`bathroom-${index}`}
                                          className="btn-check"
                                          value={bath}
                                          onChange={() =>
                                            handleBathChange(bath)
                                          }
                                          checked={SearchData?.bathroom?.includes(
                                            bath
                                          )}
                                        />
                                        <label
                                          className="btn btn-outline-light btn-sm"
                                          htmlFor={`bathroom-${index}`}
                                        >
                                          {bath}
                                        </label>
                                      </div>
                                    )
                                  )}
                                </ButtonGroup>
                              </div>

                              {/* Kitchens Selection */}
                              <div className="mt-3">
                                <label className="fw-bold mb-2">
                                  {translation?.kitchens || "Kitchens"}
                                </label>
                                <ButtonGroup className="btn-group-light d-flex gap-2">
                                  {[1, 2, 3, 4, 5].map((kitchen, index) => (
                                    <div key={`kitchen-${index}`}>
                                      <input
                                        type="checkbox"
                                        id={`kitchen-${index}`}
                                        className="btn-check"
                                        value={kitchen}
                                        onChange={() =>
                                          handleKitchenChange(kitchen)
                                        }
                                        checked={SearchData?.kitchens?.includes(
                                          kitchen
                                        )}
                                      />
                                      <label
                                        className="btn btn-outline-light btn-sm"
                                        htmlFor={`kitchen-${index}`}
                                      >
                                        {kitchen}
                                      </label>
                                    </div>
                                  ))}
                                </ButtonGroup>
                              </div>

                              <div className="d-flex justify-content-between mt-3">
                                <Button
                                  variant="outline-secondary"
                                  onClick={() =>
                                    setSearchData((prev) => ({
                                      ...prev,
                                      bedrooms: [],
                                      bathroom: [],
                                      kitchens: [],
                                    }))
                                  }
                                >
                                  {translation?.reset || "Reset"}
                                </Button>
                                <Button
                                  variant="primary"
                                  onClick={() => setBedBathDropDown(false)}
                                >
                                  {translation?.done || "Done"}
                                </Button>
                              </div>
                            </Dropdown.Menu>
                          </Dropdown>
                        </Col>
                      )}
                      <Col
                        className="col-lg col-sm-4 col-12"
                        data-id="parent"
                        onClick={openBudgetDropDown}
                      >
                        <Dropdown
                          className="select-dropdown d-grid mb-3"
                          show={BudgetDropdown}
                        >
                          <Dropdown.Toggle
                            className="btn-form-control"
                            id="budget-dropdown"
                          >
                            {displayBudget()}
                          </Dropdown.Toggle>

                          <Dropdown.Menu className="p-3 shadow bg-white rounded">
                            <Row className="gx-2">
                              <Col className="col-6">
                                <Form.Group className="dropdown minMax">
                                  <Form.Label>
                                    {translation?.min || "Min"}
                                  </Form.Label>
                                  <input
                                    type="number"
                                    className="form-control"
                                    placeholder="00"
                                    value={SearchData?.min_budget}
                                    onChange={handleMinChange}
                                    onClick={(e) => e.stopPropagation()} // Prevents parent click event
                                  />
                                </Form.Group>
                              </Col>
                              <Col className="col-6">
                                <Form.Group className="dropdown minMax">
                                  <Form.Label>
                                    {translation?.max || "Max"}
                                  </Form.Label>
                                  <input
                                    type="number"
                                    className="form-control"
                                    placeholder="00"
                                    value={SearchData?.max_budget}
                                    onChange={handleMaxBudgetChange}
                                    onClick={(e) => e.stopPropagation()} // Prevents parent click event
                                  />
                                </Form.Group>
                              </Col>
                            </Row>

                            {error && (
                              <div className="text-danger mt-2">{error}</div>
                            )}

                            <div className="d-flex justify-content-between mt-3">
                              <Button
                                variant="outline-secondary"
                                onClick={() =>
                                  setSearchData((prev) => {
                                    return {
                                      ...prev,
                                      min_budget: 0,
                                      max_budget: 10000000,
                                    };
                                  })
                                }
                              >
                                {translation?.reset || "Reset"}
                              </Button>
                              <Button
                                variant="primary"
                                onClick={() => setBudgetDropdown(false)}
                                // disabled={!!error}
                              >
                                {translation?.done || "Done"}
                              </Button>
                            </div>
                          </Dropdown.Menu>
                        </Dropdown>
                      </Col>
                    </>
                    {/* )} */}
                    <Col className="col-lg-auto col-6 mb-3">
                      <div className="d-grid">
                        <Button variant="primary" onClick={handleSearchClick}>
                          {translation?.search || "Search"}
                        </Button>
                      </div>
                    </Col>
                    <Col className="col-lg-auto col-6 mb-3">
                      <div className="d-grid">
                        <Button
                          variant="primary"
                          onClick={() => setAdvanceFilter((prev) => !prev)}
                          disabled={selectedPropertyType ? false : true}
                        >
                          {advanceFilter
                            ? translation?.hide_advanced || "Less Filter"
                            : translation?.advanced || "More Filter"}
                        </Button>
                      </div>
                    </Col>
                  </div>

                  {selectedPropertyType &&
                    postFor !== "pg_hostel" &&
                    advanceFilter && (
                      <div
                        className="more-filter-dropdown"
                        style={{
                          display: "flex",
                        }}
                      >
                        <div style={{ minWidth: "200px" }}>
                          <ListGroup
                            style={{ height: "350px", overflowY: "auto" }}
                          >
                            {advanceFilters?.map((item, i) => {
                              return (
                                <ListGroup.Item
                                  role="button"
                                  className={
                                    selectedAdvanceFilter === item?.key
                                      ? "active"
                                      : ""
                                  }
                                  onClick={() => {
                                    setSelectedAdvanceFilter(item?.key);
                                    setSelectedSubFilters([]);
                                  }}
                                >
                                  {item?.name ||
                                    `${
                                      translation?.not_available ||
                                      "Not available"
                                    }`}
                                </ListGroup.Item>
                              );
                            })}
                          </ListGroup>
                        </div>
                        <div className="flex-grow-1 p-3">
                          {selectedAdvanceFilter &&
                          (selectedAdvanceFilter === "furnishing" ||
                            selectedAdvanceFilter === "amenities" ||
                            selectedAdvanceFilter === "possession_status") ? (
                            <div>
                              <h5>
                                {translation?.sub_filters_for ||
                                  "Sub Filters for"}{" "}
                                {
                                  filterOptions.find(
                                    (f) => f.key === selectedAdvanceFilter
                                  ).name
                                }
                              </h5>
                              <div className="mb-3">
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
                                    if (
                                      selectedAdvanceFilter === "furnishing"
                                    ) {
                                      return (
                                        <>
                                          <Form.Check
                                            key={item?.furnish_id || i}
                                            inline
                                            type="checkbox"
                                            label={item?.furnish_name}
                                            id={item?.furnish_id}
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
                                        </>
                                      );
                                    } else if (
                                      selectedAdvanceFilter === "amenities"
                                    ) {
                                      return (
                                        <>
                                          <Form.Check
                                            key={item?.amenity_id || i}
                                            inline
                                            type="checkbox"
                                            label={item?.amenity_name}
                                            id={item?.amenity_id}
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
                                        </>
                                      );
                                    } else if (
                                      selectedAdvanceFilter ===
                                      "possession_status"
                                    ) {
                                      return (
                                        <>
                                          <Form.Check
                                            key={item?.status_id || i}
                                            inline
                                            type="checkbox"
                                            label={item?.status_name}
                                            id={item?.status_id}
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
                                        </>
                                      );
                                    }
                                  })}
                              </div>
                            </div>
                          ) : selectedAdvanceFilter === "carpet_area" ? (
                            <>
                              <Row className="gx-3">
                                <Col>
                                  <Form.Group className="mb-3">
                                    <Form.Label htmlFor="">
                                      {translation?.min || "Min"}
                                    </Form.Label>
                                    <Form.Control
                                      type="number"
                                      name="min_carpet"
                                      placeholder={translation?.min || "Min"}
                                      value={SearchData?.min_carpet}
                                      onChange={handleCarpetSizeChange}
                                    />
                                  </Form.Group>
                                </Col>
                                <Col>
                                  <Form.Group className="mb-3">
                                    <Form.Label htmlFor="">
                                      {translation?.max || "Max"}
                                    </Form.Label>
                                    <Form.Control
                                      type="number"
                                      name="max_carpet"
                                      placeholder={translation?.max || "Max"}
                                      value={SearchData?.max_carpet}
                                      onChange={handleCarpetSizeChange}
                                    />
                                  </Form.Group>
                                </Col>
                              </Row>

                              <div className="select-box d-grid mb-3 p-3 bg-white rounded"></div>
                            </>
                          ) : subfilterOptions[selectedAdvanceFilter] ? (
                            <div>
                              <h5>
                                {translation?.sub_filters_for ||
                                  "sub filters for"}{" "}
                                {
                                  advanceFilters?.find(
                                    (item) =>
                                      item?.key === selectedAdvanceFilter
                                  )?.name
                                }
                              </h5>
                              <div className="mb-3">
                                {subfilterOptions[selectedAdvanceFilter]?.map(
                                  (subFilter, i) => {
                                    return (
                                      <>
                                        <Form.Check
                                          key={subFilter.key}
                                          inline
                                          type="checkbox"
                                          label={
                                            ` ${subFilter.name}` ||
                                            `${
                                              translation?.not_available ||
                                              "Not available"
                                            }`
                                          }
                                          id={subFilter.key}
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
                                      </>
                                    );
                                  }
                                )}
                              </div>
                            </div>
                          ) : (
                            selectedAdvanceFilter === "price_range" && <></>
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
              </div>
            </div>
          </div>
        </React.Fragment>
      )}

      <div className="d-md-none mb-4">
        <PropertyMobileFilters
          showDrop={showDrop}
          setShowDrop={setShowDrop}
          selectedOption={selectedOption}
          handleSortSelection={handleSortSelection}
          propertyTypeList={propertyTypeList}
          subPropertyList={subPropertyList}
        />
      </div>

      <section className="section">
        <div className="container-fluid">
          <div className="row main-row">
            <aside className="col-xl-9 col-lg-9 col-12">
              <div className="d-sm-flex justify-content-between align-items-center mb-2">
                <h4 className="mb-3 mb-sm-0">
                  {translation?.total || "Total"}{" "}
                  <span className="text-primary">{totalPropertyCount}</span>{" "}
                  {translation?.properties_in || "Properties in"}{" "}
                  {defaultCity?.name || "Kolkata"}
                </h4>
                <div className="sort-by d-none d-md-block">
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
                      <Dropdown.Item
                        eventKey="1"
                        key={option}
                        onClick={() => handleSortSelection(option)}
                      >
                        {option}
                      </Dropdown.Item>
                    ))}
                  </DropdownButton>
                </div>
              </div>
              <div className="list-display">
                {propertyList?.length === 0 && !loading && (
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
                                    {property?.carpet_area || "Not Available"}{property?.carpet_area && property?.unit_type}
                                  </span>{" "}
                                  {property?.carpet_area  && "Carpet Area"}
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
                                {property.address}
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
                  })}
              </div>
              {/* LOAD MORE  */}
              {!loading && currentPage < totalPage && (
                <button
                  className="btn btn-primary d-block mx-auto mt-4"
                  onClick={() => handleLoadMoreClick(page + 1)}
                >
                  {translation?.load_more || "Load More"}
                </button>
              )}
            </aside>
            <aside className="col-xl-3 col-lg-3 col-12 mt-3 mt-lg-0">
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

export default index;
