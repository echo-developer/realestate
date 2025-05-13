"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
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
import { ShimmerContentBlock } from "react-shimmer-effects";
import useAdvertisement from "@/hooks/useAdvertisement";

// import ListingMapView from "@/components/MapData/ListingMapView";
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
import Locality from "@/components/Locality/Locality";
import Head from "next/head";
const ListingMapView = dynamic(() => import('../../components/MapData/ListingMapView'), {
  ssr: false, loading: () => <>
    <ShimmerContentBlock
      title
      text
      cta
      thumbnailWidth={350}
      thumbnailHeight={50}
    />
    <ShimmerContentBlock
      title
      text
      cta
      thumbnailWidth={350}
      thumbnailHeight={50}
    />
  </>
})

const index = () => {
  const [showMapView, setShowMapView] = useState(false);
  const { defaultCity, currency, currencyCode, formatPrice, } = useAuth();
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
  const [metaData, setMetadata] = useState(null);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [dropdownState, setDropdownState] = useState({});


  const { adsData, logAdClick } = useAdvertisement("listing-page", "right", defaultCity?.city_id, selectedPropertyType);

  const [locality, setLocality] = useState(null);
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
  const [bedroom, setBedroom] = useState([]);
  const [bathroom, setBathroom] = useState([]);
  const [kitchens, setKitchens] = useState([]);
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
  const [propertyList, setPropertyList] = useState([]);
  const [propertyTypeList, setPropertyTypeList] = useState([]);
  const [subPropertyList, setSubPropertyList] = useState([]);
  const [page, setpage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [propertyId, setPropertyId] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [BudgetDropdown, setBudgetDropdown] = useState(false);
  const [error, setError] = useState("");
  const [propertyForLoading, setPropertyForLoading] = useState(false);
  const toggleBudgetDropdown = () => setBudgetDropdown((prev) => !prev);
  const [propertyTypeDropDown, setPropertyTypeDropDown] = useState(false);
  const [bedBathDropDown, setBedBathDropDown] = useState(false);

  const isMobile = useIsMobile();


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

  const handleBedDropDown = (e) => {
    if (e.currentTarget.getAttribute("data-id") === "parent") {
      setBedBathDropDown(!bedBathDropDown);
    }
  };



  useEffect(() => {
    const parseArrayFromQuery = (param, setState) => {
      try {
        const decoded = router?.query?.[param]
          ? JSON.parse(decodeURIComponent(router.query[param]))
          : [];

        setState(Array.isArray(decoded) ? decoded : []);
      } catch (error) {
        console.error(`Error parsing ${param}:`, error);
        setState([]);
      }
    };

    parseArrayFromQuery("bedrooms", setBedroom);
    parseArrayFromQuery("kitchens", setKitchens);
    parseArrayFromQuery("bathroom", setBathroom);
  }, [router.query]);

  const handleBedRoomChange = (value) => {
    setBedroom((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };


  const handleBathChange = (value) => {
    const state = SearchData.bathroom || [];

    // Check if value exists in the array
    const updatedBathrooms = state.includes(value)
      ? state.filter((item) => item !== value) // Remove if exists
      : [...state, value]; // Add if not exists

    setBathroom(updatedBathrooms);

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

    setKitchens(updatedkitchens);

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
          // setSelectedPropertyType(res?.data?.[0]?.category_id);
        }
      } catch (error) {
        console.error(error?.message || "Error fetching property types");
      }
    };
    fetchPropertyTypeList();
  }, []);

  useEffect(() => {
    if (router?.isReady && defaultCity) {
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
      if (queryObject?.min_budget) {
        setMinBudget(Number(queryObject.min_budget));
      }
      if (queryObject?.max_budget) {
        setMaxBudget(Number(queryObject.max_budget));
      }
      if (queryObject?.sort_key && queryObject?.sort_order) {
        setSelectedSort(queryObject.sort_key, queryObject.sort_order);
      }

      if (queryObject?.locality) {
        setLocality(JSON.parse(queryObject.locality));
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
  }, [router?.query, memberId, page, defaultCity?.city_id, showMapView]);

  useEffect(() => {
    if (filterOptions?.length > 0) {
      setSelectedAdvanceFilter(filterOptions[0]?.key);
    }
  }, [filterOptions]);

  // useEffect(() => {
  //   if(router.isReady) {
  //     let metaObject = {};
  //     if(defaultCity) {
  //       metaObject.defaultCity = defaultCity.name;
  //     }
  //     metaObject = {
  //       ...metaObject,
  //       ...router.query
  //     }
  //     console.log("metaObject", metaObject)
  //   }
  // }, [router.query, defaultCity?.city_id])

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



  const displayBudget = () => {
    if (minBudget && maxBudget) return `${currency}${minBudget} - ${currency}${maxBudget}`;
    if (minBudget) return `Min: ${currency}${minBudget}`;
    if (maxBudget) return `Max: ${currency}${maxBudget}`;
    return `${translation?.select_budget || "Select Budget"}`;
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
            console.error(error?.message || "Something went wrong");
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
    // handleViewProperty();
    const queryObject = getSearchParamsData();

    if (postFor) {
      queryObject.post_for = postFor;
    }


    if (selectedPropertyType) {
      queryObject.property_type = selectedPropertyType;
    } else {
      delete queryObject.property_type;
    }
    if (selectedProeprtyFor) {
      queryObject.property_for = selectedProeprtyFor;
    } else {
      delete queryObject.property_for;
    }

    if (locality?.locality_id) {
      queryObject.locality = JSON.stringify(locality)
    }

    // Directly add minBudget and maxBudget
    if (minBudget) {
      queryObject.min_budget = minBudget;
    } else {
      delete queryObject.min_budget;
    }
    if (maxBudget) {
      queryObject.max_budget = maxBudget;
    } else {
      delete queryObject.max_budget;
    }

    if (bedroom?.length > 0) {
      queryObject.bedrooms = JSON.stringify(bedroom);
    } else {
      delete queryObject.bedrooms;
    }
    if (bathroom?.length > 0) {
      queryObject.bathroom = JSON.stringify(bathroom);
    } else {
      delete queryObject.bathroom;
    }

    if (kitchens?.length > 0) {
      queryObject.kitchens = JSON.stringify(kitchens);
    } else {
      delete queryObject.kitchens;
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

    if (router?.query?.locality) queryObject.locality = router.query.locality;
    if (router?.query?.min_budget)
      queryObject.min_budget = router.query.min_budget;
    if (router?.query?.max_budget)
      queryObject.max_budget = router.query.max_budget;

    return queryObject;
  };

  const handleLoadMoreClick = (newPage) => {
    setpage(newPage);
  };

  const setSelectedSort = (sortKey, sortOrder) => {
    let option = null;

    if (sortKey === "created_at" && sortOrder === "desc") {
      option = `${translation?.recent || "Recent"}`;
    } else if (sortKey === "exp_price" && sortOrder === "asc") {
      option = `${translation?.price_low_high || "Price - Low to High"}`;
    } else if (sortKey === "exp_price" && sortOrder === "desc") {
      option = `${translation?.price_high_low || "Price - High to Low"}`;
    } else if (sortKey === "property_size" && sortOrder === "asc") {
      option = `${translation?.size_low_high || "size/sqft - Low to High"}`;
    } else if (sortKey === "property_size" && sortOrder === "desc") {
      option = `${translation?.size_high_low || "size/sqft - High to Low"}`;
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
    if (minBudget && maxBudget) {
      existingParams.set("min_budget", minBudget);
      existingParams.set("max_budget", maxBudget);
    }

    if (locality) {
      existingParams.set('locality', JSON.stringify(locality));
    }
    // ✅ Add these three lines:
    if (bedroom) existingParams.set("bedrooms", JSON.stringify(bedroom));
    if (bathroom) existingParams.set("bathroom", JSON.stringify(bathroom));
    if (kitchens) existingParams.set("kitchens", JSON.stringify(kitchens));

    const stringifiedSearchData = JSON.stringify(SearchData);
    const url = `/property-listing?${existingParams?.toString()}&searchData=${stringifiedSearchData}`;
    router.push(url);
    // setAdvanceFilter(false);
    setDropdownState(prev => {
      return {
        ...prev,
        advanceFilter: false
      }
    })
    setIsOverlayVisible(false);
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
    if (router?.query?.property_type)
      existingParams.set("property_type", router?.query?.property_type || "1");
    if (router?.query?.property_for)
      existingParams.set("property_for", router?.query?.property_for || "1");
    if (router?.query?.post_for)
      existingParams.set("post_for", router?.query?.post_for || "sell");

    if (defaultCity?.city_id) {
      existingParams.set("city_id", defaultCity.city_id);
    }

    if (router?.query?.locality) {
      const locality = JSON.parse(router.query.locality);
      existingParams.set('locality', locality?.locality_id)
    }
    if (showMapView) {
      existingParams.set('hasLatlang', 1)
    } else {
      existingParams.set('hasLatlang', 0)
    }

    const payloadSearch = Object.fromEntries(existingParams.entries());
    const { sort_key, sort_order } = router?.query;
    let queryParams = `recent_page=${recent_page || 1}&user_id=${memberId}`;

    if (sort_key) queryParams += `&sort_key=${sort_key}`;
    if (sort_order) queryParams += `&sort_order=${sort_order}`;


    if (router?.query?.min_budget) {
      const min_budget = router.query.min_budget;
      SearchData.min_budget = min_budget;
    }

    if (router?.query?.max_budget) {
      const max_budget = router.query.max_budget;
      SearchData.max_budget = max_budget;
    }

    if (router?.query?.bedrooms) {
      try {
        const decodedBedrooms = JSON.parse(
          decodeURIComponent(router.query.bedrooms)
        );

        if (Array.isArray(decodedBedrooms)) {
          setBedroom(decodedBedrooms);
          SearchData.bedrooms = decodedBedrooms;
        } else {
          console.error("Bedrooms data is not in array format.");
        }
      } catch (error) {
        console.error("Error decoding bedrooms:", error);
      }
    }

    if (router?.query?.bathroom) {
      try {
        const decodedBathrooms = JSON.parse(
          decodeURIComponent(router.query.bathroom)
        );

        if (Array.isArray(decodedBathrooms)) {
          setBathroom(decodedBathrooms);
          SearchData.bathroom = decodedBathrooms;
        } else {
          console.error("Bedrooms data is not in array format.");
        }
      } catch (error) {
        console.error("Error decoding bedrooms:", error);
      }
    }

    if (router?.query?.kitchens) {
      try {
        const decodedKitchens = JSON.parse(
          decodeURIComponent(router.query.kitchens)
        );

        if (Array.isArray(decodedKitchens)) {
          setKitchens(decodedKitchens);
          SearchData.kitchens = decodedKitchens;
        } else {
          console.error("Bedrooms data is not in array format.");
        }
      } catch (error) {
        console.error("Error decoding bedrooms:", error);
      }
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
    setSelectedPropertyType("");
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

  const onSelectLocality = (locality) => {
    setLocality(locality)
  }

  const advanceFilters =
    selectedPropertyType == "1" ? filterOptions : CommercialFilterOptions;

  const bedrooms = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const displayBedsBathKitchen = () => {
    const beds = bedroom || [];
    const baths = bathroom || [];
    const kits = kitchens || [];

    // Convert arrays to a comma-separated string if they have values
    const bedsText = beds.length > 0 ? `${beds.join(", ")} Beds` : "";
    const bathsText = baths.length > 0 ? `${baths.join(", ")} Baths` : "";
    const kitchensText = kits.length > 0 ? `${kits.join(", ")} Kits` : "";

    // Combine all values with a separator
    const selections = [bedsText, bathsText, kitchensText]
      .filter(Boolean)
      .join(" / ");

    return (
      selections ||
      `${translation?.beds_baths_kitchens || "Select Beds, Baths & Kitchens"}`
    );
  };




  const resetSelection = () => {
    setBedroom([]);
    setBathroom([]);
    setKitchens([]);
  };

  const applySelection = () => { };

  const resetBudget = () => {
    setMinBudget("");
    setMaxBudget("");
    setError("");
    setBudgetDropdown(false);
  };

  const applyBudget = () => {
    if (!error) {
      setBudgetDropdown(false);
    }
  };

  let metaTitle = `Explore ${selectedPropertyType} Properties in ${defaultCity?.name} – New Launch, Under Construction & Ready to Move`;
  let metaDescription = `Explore ${totalPropertyCount}+ verified properties available for sale/rent in ${defaultCity?.name}, only on realestate.scriptlisting.com. Discover apartments with real photos, map views, and complete details to help you make the right choice`;


  return (
    <>
      {isOverlayVisible && (
        <div
          className="page-overlay"
          onClick={handleClickOutside}
        ></div>
      )}
      <MainLayout>
        {/* <Helmet>
          <title>
            {metaTitle}
          </title>
          <meta
            name="description"
            content={metaDescription}
          />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Helmet> */}
        <Head>
          <title>{metaTitle}</title>
          <meta name="description" content={metaDescription} />
        </Head>

        {isMobile ? (
          <React.Fragment>
            <div className="d-md-none bg-primary p-3">
              <div className="position-relative">
                <input
                  type="text"
                  placeholder={translation?.search_locality || "Search Locality"}
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
                      <Col className="col-lg-auto col-sm-2 col-auto" onClick={() => toggleDropdown('buy_sell')}>
                        <Dropdown className="d-grid select-dropdown" show={dropdownState?.buy_sell}>
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
                      {/* <Col className="col-lg col-sm-10">
                        <select className="form-select" id="exampleSelect" value={localityData} onChange={(e) => handleLocalityDataChange(e.target.value)} >
                          <option value="">Select a locality</option>
                          {localityList?.length > 0 && localityList.map((locality, i) => {
                            return (
                              <option key={i} value={locality?.locality_id}>{locality?.locality_name || "Not Abailable"}</option>
                            )
                          })}
                        </select>
                      </Col> */}
                      <Col className="col-lg col-10">
                        <Locality onSelectLocality={onSelectLocality} />
                      </Col>
                      {/* {postFor === "sell" ||
                  postFor === "rent" && ( */}
                      <>
                        <Col
                          className="col-lg col-sm-4 col-12"
                          data-id="parent"
                          // onClick={handlePropertyTypeDropDown}
                          onClick={() => toggleDropdown('property_type')}
                        >
                          <Dropdown
                            className="select-dropdown mb-3 d-grid"
                            show={dropdownState?.property_type}
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
                            // onClick={handleBedDropDown}
                            onClick={() => toggleDropdown('bath_beds')}
                          >
                            <Dropdown
                              className="select-dropdown d-grid mb-3"
                              // show={bedBathDropDown}
                              show={dropdownState?.bath_beds}
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
                                    {bedrooms.map((bedroomItem, index) => (
                                      <div key={`bedroom-${index}`}>
                                        <input
                                          type="checkbox"
                                          id={`bedroom-${index}`}
                                          className="btn-check"
                                          value={bedroomItem}
                                          onChange={() =>
                                            handleBedRoomChange(bedroomItem)
                                          }
                                          checked={bedroom.includes(bedroomItem)}
                                        />
                                        <label
                                          className="btn btn-outline-light btn-sm"
                                          htmlFor={`bedroom-${index}`}
                                        >
                                          {bedroomItem}
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
                                            checked={bathroom?.includes(bath)}
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
                                          checked={kitchens?.includes(kitchen)}
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
                                    onClick={resetSelection}
                                  >
                                    {translation?.reset || "Reset"}
                                  </Button>
                                  <Button
                                    variant="primary"
                                    onClick={applySelection}
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
                          // onClick={openBudgetDropDown}
                          onClick={() => toggleDropdown('budget')}
                        >
                          <Dropdown
                            className="select-dropdown d-grid mb-3"
                            // show={BudgetDropdown}
                            show={dropdownState?.budget}
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
                                      value={minBudget}
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
                                      value={maxBudget}
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
                                  onClick={resetBudget}
                                >
                                  {translation?.reset || "Reset"}
                                </Button>
                                <Button
                                  variant="primary"
                                  onClick={() => {
                                    applyBudget();
                                    setBudgetDropdown(false);
                                  }}
                                  disabled={!!error}
                                >
                                  {translation?.done || "Done"}
                                </Button>
                              </div>
                            </Dropdown.Menu>
                          </Dropdown>
                        </Col>
                      </>
                      {/* )} */}
                      {/* <Col className="col-lg-auto col-sm-2 col-auto">
                        <Button variant="primary" onClick={() => setShowMapView(!showMapView)}>
                          {showMapView ? (
                            <>
                              <i className="bi bi-list-ul"></i> List View
                            </>6
                          ) : (
                            <>
                              <i className="bi bi-geo-alt"></i> Map View
                            </>
                          )}
                        </Button>
                      </Col> */}
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
                            // onClick={() => setAdvanceFilter((prev) => !prev)}
                            onClick={() => toggleDropdown('advanceFilter')}
                            disabled={selectedPropertyType ? false : true}
                          >
                            {translation?.advanced || "Advance"}
                          </Button>
                        </div>
                      </Col>
                    </div>

                    {selectedPropertyType &&
                      postFor !== "pg_hostel" &&
                      dropdownState?.advanceFilter && (
                        <div
                          className="more-filter-dropdown"
                          style={{
                            display: "flex",
                          }}
                        >

                          <ListGroup
                            style={{ height: "350px", minWidth: "200px", overflowY: "auto" }}
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
                                    `${translation?.not_available ||
                                    "Not available"
                                    }`}
                                </ListGroup.Item>
                              );
                            })}
                          </ListGroup>

                          <div className="flex-grow-1 p-3 scroll-part">
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
                                <Row className="mb-3">
                                  {dynamicFieldLoading && (
                                    <>
                                      <Col xs={12}>
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
                                      </Col>
                                    </>
                                  )}
                                  {!dynamicFieldLoading &&
                                    dynamicList?.map((item, i) => {
                                      if (
                                        selectedAdvanceFilter === "furnishing"
                                      ) {
                                        return (
                                          <>
                                            <Col xs={6}>
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
                                            </Col>
                                          </>
                                        );
                                      } else if (
                                        selectedAdvanceFilter === "amenities"
                                      ) {
                                        return (
                                          <>
                                            <Col xs={6}>
                                              <Form.Check
                                                key={item?.amenity_id}
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
                                            </Col>
                                          </>
                                        );
                                      } else if (
                                        selectedAdvanceFilter ===
                                        "possession_status"
                                      ) {
                                        return (
                                          <>
                                            <Col xs={6}>
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
                                            </Col>
                                          </>
                                        );
                                      }
                                    })}
                                </Row>
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
                                <Row className="mb-3">
                                  {subfilterOptions[selectedAdvanceFilter]?.map(
                                    (subFilter, i) => {
                                      return (
                                        <>
                                          <Col xs={6}>
                                            <Form.Check
                                              key={subFilter.key}
                                              inline
                                              type="checkbox"
                                              label={
                                                ` ${subFilter.name}` ||
                                                `${translation?.not_available ||
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
                                          </Col>
                                        </>
                                      );
                                    }
                                  )}
                                </Row>
                              </div>
                            ) : (
                              selectedAdvanceFilter === "price_range" && <></>
                            )}

                            <div className="text-end">
                              <Button
                                variant="primary"
                                onClick={() => handleViewProperty()}
                              >
                                {translation?.view_property || "View Property"}
                              </Button>
                            </div>
                          </div>
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

        <section className="section pb-0">
          <div className="container-fluid">
            <div className="row">
                  <aside
                   className={showMapView ? 'col-12' : 'col-lg-9'}
                   >
                    <div className="d-md-flex justify-content-between align-items-center mb-3">
                      <h4 className="mb-3 mb-md-0">
                        {translation?.total || "Total"}{" "}
                        <span className="text-primary">{totalPropertyCount}</span>{" "}
                        {translation?.properties_in || "Properties in"}{" "}
                        {defaultCity?.name || "Kolkata"}
                      </h4>
                      <div className="d-flex gap-2">
                      <div className="sort-by">
                        <DropdownButton
                          align="end"
                          size='sm'
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
                        <Button variant="outline-primary"
                          className={`${!showMapView ? 'active' : ''}`}
                          size='sm'
                          onClick={() => setShowMapView(false)}
                        >
                          <i className="bi bi-list-ul me-1"></i> List View
                        </Button>
                        <Button variant="outline-primary"
                          className={`${showMapView ? 'active' : ''}`}
                          size='sm'
                          onClick={() => setShowMapView(true)}
                        >
                          <i className="bi bi-map me-1"></i> Map View
                        </Button>
                        </div>
                    </div>
                  </aside>
            </div>
            {showMapView ? (
              <>
                
                <ListingMapView propertyList={propertyList} loading={loading} />
              </>
            ) : (
              <>
                <div className="row main-row">
                  <aside className="col-lg-9 col-12">
                  
                    <div className="list-display">
                      {/* Show shimmer when loading */}
                      {loading ? (
                        <>
                          <ShimmerContentBlock
                            title
                            text
                            cta
                            thumbnailWidth={350}
                            thumbnailHeight={50}
                          />
                          <ShimmerContentBlock
                            title
                            text
                            cta
                            thumbnailWidth={350}
                            thumbnailHeight={50}
                          />
                        </>
                      ) : !loading && propertyList?.length === 0 ? (
                        // Show No Result Found only when loading is false and no data is present
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
                      ) : (
                        // Render Property Cards
                        propertyList?.map((property, i) => (
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
                                    <Link href={`/property-details/${property.slug}`}>
                                      {property.property_name}
                                    </Link>
                                  </h4>
                                  <h5 className="mb-0">
                                    {formatPrice(property?.exp_price) || "Price not Available"}
                                  </h5>
                                  <p className="mb-1">
                                  </p>
                                  <ul className="list-info mb-2">
                                    {property?.bedrooms && (
                                      <>
                                        <li>
                                          <i
                                            className="icon-img-bed"
                                            title="Bedrooms:"
                                          ></i>
                                          <span>
                                            {property?.bedrooms ? property.bedrooms : <span className="text-muted">Not Available</span>}
                                          </span>
                                          {property?.bedrooms && " Beds"}
                                        </li>
                                      </>
                                    )}
                                    {property?.bathroom && (
                                      <>
                                        <li>
                                          <i
                                            className="icon-img-tub"
                                            title="Bathrooms:"
                                          ></i>
                                          <span>
                                            {property?.bathroom ? property.bathroom : <span className="text-muted">Not Available</span>}
                                          </span>
                                          {property?.bathroom && " Bath"}
                                        </li>
                                      </>
                                    )}
                                    <li>
                                      {property?.area_in_sqft && (
                                        <i
                                          className="icon-img-ratio"
                                          title="Carpet Area:"
                                        ></i>
                                      )}
                                      <span>
                                        {property?.area_in_sqft ? `${property?.area_in_sqft} sqft` : "Not Available"}{" "}
                                      </span>
                                      {property?.carpet_area && " Carpet Area"}
                                    </li>
                                    {property?.possession_status && (
                                      <li>
                                        <i
                                          className="icon-img-check"
                                          title="Possession Status"
                                        ></i>
                                        <span>{property.possession_status}</span>
                                      </li>
                                    )}

                                  </ul>
                                  <p>
                                    <span className="text-primary">
                                      <GeoAlt color="currentColor" size={14} />
                                    </span>{" "}
                                    {property.address || ""}
                                  </p>
                                </div>
                                <div className="card-footer d-flex justify-content-between align-items-center">
                                  <div className="d-flex">
                                    <img
                                      className="rounded-circle"
                                      src={`${property?.user_image ||
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
                                  <Button
                                    className="btn btn-primary btn-sm"
                                    onClick={() => handleClick(property.property_id)}
                                  >
                                    {translation?.contact_now || "Contact Now"}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
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
                  </aside>
                </div>
              </>
            )}
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
    </>
  );
};

export default index;
