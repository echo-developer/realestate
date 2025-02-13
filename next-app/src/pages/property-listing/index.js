"use client";
import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout'
import { Helmet } from "react-helmet-async";
import Modal from "react-bootstrap/Modal";
import Select from "react-select";
import { toast } from "react-toastify";
import AuthUser from '@/components/Authentication/AuthUser';
import { useRouter } from 'next/router';
import useDateFormat from '@/hooks/useDateFormat';
import { useSearchParams } from 'next/navigation';
import LocalitySearch from "@/components/MapData/LocalitySearch"
import CardImageSlider from '@/components/cardImageSlider/CardImageSlider';
import EnquiryForm from '@/components/charts/EnquiryForm';
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';
// import "./sliderStyles.css"; 
import { filterOptions, CommercialFilterOptions, subfilterOptions } from '@/components/post/PropertyData';


const budgets = [
  { key: 1, name: "$99 - $199" },
  { key: 2, name: "$200 - $300" },
  { key: 3, name: "$301 - $499" },
  { key: 4, name: "$500 - $999" },
  { key: 5, name: "Above $1000" },
];



const index = () => {
  const [locationData, setLocationData] = useState([]);
  const [postFor, setPostFor] = useState("sell");
  const [selectedLoacation, setSelectedLocation] = useState("");
  const [selectedPropertyType, setSelectedPropertyType] = useState("");
  const [selectedProeprtyFor, setSelectedProeprtyFor] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showDrop, setShowDrop] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Sort By");
  const [localityData, setLocalityData] = useState(null);
  const [advanceFilter, setAdvanceFilter] = useState(false);
  const [selectedAdvanceFilter, setSelectedAdvanceFilter] = useState("")
  const [activeDynamicKey, setActiveDynamicKey] = useState("")
  const [dynamicFieldLoading, setDynamicFieldLoading] = useState(true);
  const [dynamicList, setDynamicList] = useState([])
  const [selectedGender, setSelectedGender] = useState("");
  const [budget, setBudget] = useState("");

  // ADVANCE SEARCH 
  const [selectedSubFilters, setSelectedSubFilters] = useState([]);
  const [SearchData, setSearchData] = useState({
    carpet_area: [],
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
  });


  const [range, setRange] = useState([200, 12000])

  // LIST 
  const [propertyList, setPropertyList] = useState([]);
  const [propertyTypeList, setPropertyTypeList] = useState([]);
  const [subPropertyList, setSubPropertyList] = useState([])

  const { callApi, GetMemberId } = AuthUser();

  const [page, setpage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [propertyId, setPropertyId] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);

  const memberId = GetMemberId();


useEffect(() => {
  setSearchData(prev => {
    return {
      ...prev,
      min_budget: range?.[0] || 0,
      max_budget: range?.[1] || 0
    }
  })
}, [range])

  useEffect(() => {


    const fetchPropertyTypeList = async () => {
      try {
        const res = await callApi({
          api: "/get_property_type",
          method: "GET"
        })
        if (res && res?.status === 1) {
          setPropertyTypeList(res?.data || []);
        } else {
          toast.error(res?.message || "Error fetching property types")
        }
      } catch (error) {
        toast.error(error?.message || "Error fetching property types")
      }
    }
    // fetchLocationData();
    fetchPropertyTypeList();
  }, []);


  useEffect(() => {
    const memberId = GetMemberId();
    if (router?.isReady) {
      const queryObject = getSearchParamsData();
      // SET THE STATES 
      if (queryObject?.post_for) {
        setPostFor(queryObject.post_for)
      }
      if (queryObject?.property_type) {
        setSelectedPropertyType(queryObject.property_type)
      }
      if (queryObject?.property_for) {
        setSelectedProeprtyFor(queryObject.property_for);
      }
      if (queryObject?.sort_key && queryObject?.sort_order) {
        setSelectedSort(queryObject.sort_key, queryObject.sort_order);
      }
      if (queryObject?.location_data) {
        const locality = JSON.parse(decodeURIComponent(queryObject.location_data))
        if (Array.isArray(locality)) {
          const firstValue = locality?.[0]?.locality?.split(",")?.[0];
          queryObject.locality = firstValue;
        } else {
          const firstValue = locality.locality?.split(", ")?.[0];
          queryObject.locality = firstValue;
        }

        delete queryObject.location_data
      }
      if(!router?.query?.is_advance) {
        getPropertyList(queryObject);
      }
       else {
        getAdvanceSearch();
      }

    }
  }, [router])


  useEffect(() => {
    if (selectedPropertyType) {
      const getSubPropertyType = async () => {
        try {
          const res = await callApi({
            api: `/get_property_for/${selectedPropertyType}`,
            method: "GET"
          })
          if (res && res?.status === 1) {
            setSubPropertyList(res?.data || [])
          } else {
            toast.error(res?.message || "Error fetching property for options")
          }
        } catch (error) {
          toast.error(res?.message || "Error fetching property for options")
        }
      }

      getSubPropertyType();
    }
  }, [selectedPropertyType])

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
          url = null; // Optional: Set url to null if no cases match
      }
      if (url) {
        setActiveDynamicKey(selectedAdvanceFilter);
        const getList = async () => {
          setDynamicFieldLoading(true);
          try {
            const args = {
              api: url,
              method: "GET"
            }

            const res = await callApi(args);
            if (res && res?.status === 1) {
              setDynamicList(res?.data);
            }
          } catch (error) {
            console.log(error?.message || "Something went wrong")
          } finally {
            setDynamicFieldLoading(false);
          }
        }
        getList();
      }
    }
  }, [selectedAdvanceFilter])


  const handlePostForTabChange = (tab) => {
    if (tab) {
      setPostFor(tab);
    }
  }

  const handleLocationChange = (data) => {
    setSelectedLocation(data || []);
  }

  const handleClick = (property_id) => {
    setPropertyId(property_id);
    setShowContactModal(true);
};
const handleContactClose = () => setShowContactModal(false);


  const handlePropertyTypeChange = (e) => {
    setSelectedPropertyType(e.target.value);
  }

  const getPropertyList = async (queryObject, loadMore, page) => {
    const memberId = GetMemberId();
    try {
      const res = await callApi({
        api: '/get_search_result',
        method: "GET",
        data: {
          ...queryObject,
          user_id: memberId,
          currentpage: page || 1
        }
      })
      if (res && res?.status === 1) {
        const data = res?.data?.searched_properties || [];
        if (!loadMore) {
          setPropertyList(data);

        } else {
          setPropertyList((prev) => {
            return [...prev, ...data];
          })
        }
        setTotalPage(res?.data?.pagination?.total_pages || 0);
        setCurrentPage(res?.data?.pagination?.current_page || 0);
      } else if (res && res?.status === 0) {
        setPropertyList(res?.data);
        setTotalPage(res?.data?.pagination?.total_pages || 0);
        setCurrentPage(res?.data?.pagination?.current_page || 0);
      }
    } catch (error) {
      console.error(error?.message || "Something went wrong")
    }
  }


  const handleSearchClick = () => {
    const queryObject = getSearchParamsData();
    if (postFor) {
      queryObject.post_for = postFor
    }
    if (selectedPropertyType) {
      queryObject.property_type = selectedPropertyType
    }
    if (selectedProeprtyFor) {
      queryObject.property_for = selectedProeprtyFor
    }
    if (localityData) {
      queryObject.location_data = JSON.stringify(localityData)
    }
    const searchParams = new URLSearchParams(queryObject).toString();
    router.push(`/property-listing?${searchParams}`)
  }


  const getSearchParamsData = () => {
    let queryObject = {};

    if (router?.query?.post_for) queryObject.post_for = router.query.post_for;
    if (router?.query?.property_type) queryObject.property_type = router.query.property_type;
    if (router?.query?.property_for) queryObject.property_for = router.query.property_for;
    if (router?.query?.property_budget) queryObject.property_budget = router.query.property_budget;
    if (router?.query?.property_size) queryObject.property_size = router.query.property_size;
    if (router?.query?.bedrooms) queryObject.bedrooms = router.query.bedrooms;
    if (router?.query?.parking) queryObject.parking = router.query.parking;
    if (router?.query?.sort_key) queryObject.sort_key = router.query.sort_key;
    if (router?.query?.sort_order) queryObject.sort_order = router.query.sort_order;
    if (router?.query?.location_data) queryObject.location_data = router.query.location_data;

    return queryObject;
  };

  const handleLoadMoreClick = (newPage) => {
    setpage(newPage);
    const queryObject = getSearchParamsData();
    getPropertyList(queryObject, true, newPage)
  }


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
        // Get the current value for the given name
        const currentValues = prevState[name] || [];

        // Check if the value exists in the array
        if (Array.isArray(currentValues)) {
            if (currentValues.includes(value)) {
                // If the value exists, remove it
                return {
                    ...prevState,
                    [name]: currentValues.filter((item) => item !== value),
                };
            } else {
                // If the value does not exist, add it
                return {
                    ...prevState,
                    [name]: [...currentValues, value],
                };
            }
        } else {
            // If the current value is not an array, initialize it as an array with the new value
            return {
                ...prevState,
                [name]: [value],
            };
        }
    });
}

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
  if(selectedPropertyType) existingParams.set("property_type", selectedPropertyType);
  if(selectedProeprtyFor) existingParams.set("property_for", selectedProeprtyFor);
  if(postFor) existingParams.set("post_for", postFor);
  if(localityData && localityData !== null) existingParams.set("location_data", encodeURIComponent(JSON.stringify(localityData))); 
  existingParams.set("is_advance", true);

  const url = `/property-listing?${existingParams?.toString()}`
  router.push(url);
  // getAdvanceSearch();
  setAdvanceFilter(false);
}

const getAdvanceSearch = async (loadMore, recent_page) => {
  const existingParams = new URLSearchParams();
  if(selectedPropertyType) existingParams.set("property_type", selectedPropertyType);
  if(selectedProeprtyFor) existingParams.set("property_for", selectedProeprtyFor);
  if(postFor) existingParams.set("post_for", postFor);
  
  existingParams.set("is_advance", true);
  const payloadSearch = Object.fromEntries(existingParams.entries());
  if(localityData && localityData !== null) {
    const locality = localityData?.locality?.split(", ")?.[0];
    payloadSearch.locality = locality
  }

  const getAdvanceSearch = async (loadMore, recent_page) => {
    const existingParams = new URLSearchParams();
    if (selectedPropertyType) existingParams.set("property_type", selectedPropertyType);
    if (selectedProeprtyFor) existingParams.set("property_for", selectedProeprtyFor);
    if (postFor) existingParams.set("post_for", postFor);

    existingParams.set("is_advance", true);
    const payloadSearch = Object.fromEntries(existingParams.entries());
    if (localityData && localityData !== null) {
      const locality = localityData?.locality?.split(", ")?.[0];
      payloadSearch.locality = locality
    }
    try {
      const res = await callApi({
        api: `/advance_search_result?recent_page=${recent_page || 1}&user_id=${memberId}`,
        method: "POST",
        data: {
          SearchData: JSON.stringify(SearchData),
          searchPayload: JSON.stringify(payloadSearch)
        }
      })

      if (res && res?.status === 1) {
        if (loadMore) {
          setAdvanceSearchResponse(res?.data, true);
        } else {
          setAdvanceSearchResponse(res?.data);
        }
      }
    } catch (error) {
      console.error(error?.message || "Something Went wrong")
    }
  }

  const setAdvanceSearchResponse = (data, loadMore) => {
    if (Array.isArray(data)) {
      setPropertyList(data);
    } else {
      if (loadMore) {
        setPropertyList(prev => {
          return [...prev, ...data?.searched_properties]
        })
      } else {
        setPropertyList(data?.searched_properties)
      }
    }
  }

  const handlePriceRangeValueCange = (e, type) => {
    let rangeArr = range;
    if(type === "min") {
      setRange(prev => {
        return [e.target.value, prev[1]]
      })
    } else if(type === "max") {
      setRange(prev => {
        return [prev[0], e.target.value]
      })
    }

    setRange(rangeArr);
  }

  const handleGenderChange = (e) => {
    setSelectedGender(e?.target?.value);
  }
  const handleBudgetChange = (e) => {
    setBudget(e?.target?.value)
  }


  const SaveFavouriteProperty = async (PropertyId) => {
    if (!memberId) {
      setShowLoginErrorModal(true);
      return;
    }

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
        // FetchPropertyListData(res);
        favStateUpdater(PropertyId);

      } else {
        toast.error(
          res?.message || "An error occurred. Please try again."
        );
      }
    } catch (error) {
      toast.error("Failed to save the property. Please try again.");
    }
  };

//   const favStateUpdater = (id) => {
//     const newList = propertyList?.map(item => {
//       if (item?.property_id == id) {
//         return {
//           ...item,
//           is_favorite: !item.is_favorite
//         }
//       } else {
//         return item;
//       }
//     })

//     if(res && res?.status === 1) {
//       if(loadMore) {
//         setAdvanceSearchResponse(res?.data, true);
//       } else {
//         setAdvanceSearchResponse(res?.data);
//       }
//     }
//   } catch (error) {
//     console.error(error?.message || "Something Went wrong")
//   }
// }

// const setAdvanceSearchResponse = (data, loadMore) => {
//   if(Array.isArray(data)) {
//     setPropertyList(data);
//   } else {
//     if(loadMore) {
//       setPropertyList(prev => {
//         return [...prev, ...data?.searched_properties]
//       })
//     } else {
//       setPropertyList(data?.searched_properties)
//     }
//   }
// }


// const handleGenderChange = (e) => {
//   setSelectedGender(e?.target?.value);
// }
// const handleBudgetChange = (e) => {
//   setBudget(e?.target?.value)
// }


// const SaveFavouriteProperty = async (PropertyId) => {
//         if (!memberId) {
//             setShowLoginErrorModal(true);
//             return;
//         }

//         try {
//             const res = await callApi({
//                 api: `/add_my_fav_property`,
//                 method: "UPLOAD",
//                 data: {
//                     user_id: memberId,
//                     property_id: PropertyId,
//                 },
//             });

//             if (res && res.status === 1) {
//                 toast.success(res.message);
//                 // FetchPropertyListData(res);
//                 favStateUpdater(PropertyId);

//             } else {
//                 toast.error(
//                     res?.message || "An error occurred. Please try again."
//                 );
//             }
//         } catch (error) {
//             toast.error("Failed to save the property. Please try again.");
//         }
//     };

    const favStateUpdater = (id) => {
      const newList = propertyList?.map(item => {
        if(item?.property_id == id) {
          return {
            ...item,
            is_favorite: !item.is_favorite
          }
        } else {
          return item;
        }
      })

      setPropertyList(newList);
    }

  const advanceFilters = selectedPropertyType == "1" ? filterOptions : CommercialFilterOptions;


  return (
    <MainLayout>
      <Helmet>
        <title>Explore Property Listings | Buy, Rent, or Invest with RealEstate</title>
        <meta
          name="description"
          content="Browse thousands of properties for sale or rent, including houses, apartments, and commercial spaces. Find the perfect property that matches your needs and budget."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>

      {/* SEARCH SECTION  */}
      <div className="clearfix"></div>
      <div className="short-banner" style={{ minHeight: "120px" }}>
        <div className='container-fluid mt-3'>
          <div className='row'>
            <div className="col-12">
              <div className="search-form">
                <ul className="nav nav-pills justify-content-center mb-3">
                  <li className="nav-item" onClick={() => handlePostForTabChange("sell")}><a className={`nav-link ${postFor === "sell" ? "active" : ""}`}>Buy</a></li>
                  <li className="nav-item" onClick={() => handlePostForTabChange("rent")}><a className={`nav-link ${postFor === "rent" ? "active" : ""}`}>Rent</a></li>
                  <li className="nav-item" onClick={() => handlePostForTabChange("pg_hostel")}><a className={`nav-link ${postFor === "pg_hostel" ? "active" : ""}`}>PG/Hostel</a></li>
                </ul>
              </div>
            </div>
          </div>
          {/* SEARCH FORM  */}
          <form id='searchfilter'>
            <div className='row gx-2'>
              {/* <div className="col-lg col-12">
                <Select
                isMulti
                name='locations'
                onChange={handleLocationChange}
                value={selectedLoacation}
                options={locationData} />
              </div> */}
              <LocalitySearch setLocalityData={setLocalityData} />
              {/* <LocalitySearchedData setLocalityData={setLocalityData} /> */}
              {postFor !== "pg_hostel" && (
                <>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <select className="form-control" value={selectedPropertyType} onChange={handlePropertyTypeChange}>
                      <option value="" disabled>Select Property Type</option>
                      {propertyTypeList?.map((type) => {
                        return (
                          <option
                          key={type.category_id}
                          value={type.category_id}
                        >
                          {type.category_name}
                        </option>
                        )
                      })}
                    </select>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <select className="form-control" value={selectedProeprtyFor} onChange={(e) => setSelectedProeprtyFor(e?.target?.value)}>
                      <option value="" >Select Property For</option>
                      {subPropertyList?.map((option) => (
                        <option
                          key={option.sub_category_id}
                          value={option.sub_category_id}
                        >
                          {option.sub_category_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}
              {postFor === "pg_hostel" && (
                <>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <select className="form-control" value={selectedGender} onChange={handleGenderChange}>
                      <option value="" >
                        Gender
                      </option>
                      <option value="M">Boys</option>
                      <option value="F">Girls</option>
                    </select>
                  </div>
                  <div className="col-lg-3 col-sm-6 col-12">
                    <select className="form-control" value={budget} onChange={handleBudgetChange}>
                      <option value="" >
                        Budget
                      </option>
                      {budgets.map((budget) => (
                        <option key={budget.key} value={budget.key}>
                          {budget.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}
              {postFor !== "pg_hostel" && (
                <div className="col-lg-auto col-sm-6 col-12">
                  <button type="button" className="btn btn-light" onClick={() => setAdvanceFilter(prev => !prev)} disabled={selectedPropertyType ? false : true}>
                    {advanceFilter ? "Hide Advanced" : "Advanced"}
                  </button>
                </div>
              )}
              <div className="col-lg-auto col-sm-6 col-12">
                <button type="button" className="btn btn-light" onClick={handleSearchClick}>Search</button>
              </div>


            </div>

            {/* ADVANCE FILTER  */}
            {selectedPropertyType && postFor !== "pg_hostel" && advanceFilter && (
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
                  <ul className='list-group'>
                    {advanceFilters?.map((item, i) => {
                      return <li class="list-group-item" style={{ cursor: "pointer", fontWeight: selectedAdvanceFilter === item?.key ? "bold" : "" }} onClick={() => setSelectedAdvanceFilter(item?.key)}>{item?.name || "Not available"}</li>
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
                        Sub Filters for{" "}
                        {
                          filterOptions.find(
                            (f) =>
                              f.key ===
                              selectedAdvanceFilter
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
                                marginTop: "100px"
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
                        {!dynamicFieldLoading && dynamicList?.map((item, i) => {
                          if (selectedAdvanceFilter === "furnishing") {
                            return (
                              <div key={item?.furnish_id || i}>
                                <input type="checkbox"
                                  onChange={() =>
                                    handleDynamicValueChange(
                                      selectedAdvanceFilter,
                                      item?.furnish_id
                                    )}
                                  checked={SearchData[selectedAdvanceFilter]?.includes(item?.furnish_id)} />
                                {item?.furnish_name}

                              </div>
                            );
                          } else if (selectedAdvanceFilter === "amenities") {
                            return (
                              <div key={item?.amenity_id || i}>
                                <input type="checkbox"
                                  onChange={() =>
                                    handleDynamicValueChange(
                                      selectedAdvanceFilter,
                                      item?.amenity_id
                                    )}
                                  checked={SearchData[selectedAdvanceFilter]?.includes(item?.amenity_id)} />
                                {item?.amenity_name}
                              </div>
                            );
                          } else if (selectedAdvanceFilter === "possession_status") {
                            return (
                              <div key={item?.status_id || i}>
                                <input type="checkbox"
                                  onChange={() =>
                                    handleDynamicValueChange(
                                      selectedAdvanceFilter,
                                      item?.status_id
                                    )}
                                  checked={SearchData[selectedAdvanceFilter]?.includes(item?.status_id)} />
                                {item?.status_name}
                              </div>
                            );
                          }
                        })}
                      </div>
                    </div>
                  ) : subfilterOptions[selectedAdvanceFilter] ? (
                    <div>
                      <h4>{filterOptions[selectedAdvanceFilter] || ""}</h4>
                      <div>
                        {subfilterOptions[selectedAdvanceFilter]?.map((subFilter, i) => {
                          return (
                            <div
                              key={subFilter.key}
                              style={{
                                marginBottom: "8px",
                              }}
                            >
                              <input type="checkbox"
                              onChange={() =>
                                handleSubFilterSelection(
                                    selectedAdvanceFilter,
                                    subFilter.key
                                )
                            } />
                              {subFilter.name || "Not available"}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : selectedAdvanceFilter === "price_range" && (
                    <>
                      <div
                        style={{
                          marginBottom: "8px",
                        }}
                      >
                        <div style={{ width: "100%" }}>
                          <h3>price</h3>
                          <div style={{display: "flex", justifyContent: "center", gap: "5px", alignItems: 'center', marginTop: "20px"}}>
                          <span>0</span>
                          <RangeSlider
                            value={range}
                            min={0}
                            max={100000}
                            step={1}
                            onInput={setRange}
                            className="w-64"
                          />
                          <span>100000</span>
                          </div>
                          <div style={{display: "flex", gap: "100px", justifyContent: "center"}}>
                            <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                              <span>min</span>
                              <input type="text" value={range[0]} onChange={(e) => setRange(prev => [e.target.value, prev[1]])} style={{maxWidth: "50px"}} />
                            </div>
                            <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                              <span>max</span>
                              <input type="text" value={range[1]} onChange={(e) => setRange(prev => [prev[0], e.target.value])} style={{maxWidth: "50px"}} />
                            </div>
                          </div>
                        </div>
                      </div>

                    </>
                  )}

                </div>
                <button
                  type="button"
                  className="btn btn-success"
                  style={{ height: "40px", position: "absolute", bottom: "20px", right: "20px" }}
                  onClick={() => handleViewProperty()}
                >
                  View Property
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* LIST SECTION  */}
      <section className='section'>
        <div className='container-fluid'>
          <div className='row main-row'>
            <aside className='col-xl-9 col-lg-9 col-12'>
              <div className="d-sm-flex justify-content-between align-items-center mb-2">
                <h4 className="mb-3 mb-sm-0">
                  Total <span className="text-primary">10</span> Properties Found
                </h4>
                <div className="sort-by">
                  <div className="dropdown">
                    <button
                      className={`btn btn-light dropdown-toggle w-100 ${showDrop ? "show" : ""
                        }`}
                      type="button"
                      onClick={() => setShowDrop(!showDrop)}
                      aria-expanded={showDrop ? "true" : "false"}
                    >
                      {selectedOption}
                    </button>
                    <ul
                      className={`dropdown-menu ${showDrop ? "show" : ""}`}
                      style={{
                        position: "absolute",
                        inset: "0px auto auto 0px",
                        margin: "0px",
                        transform: showDrop ? "translate(0px, 34px)" : "none",
                      }}
                    >
                      {[
                        "Recent",
                        "Price - Low to High",
                        "Price - High to Low",
                        "size/sqft - Low to High",
                        "size/sqft - High to Low",
                      ].map((option) => (
                        <li key={option}>
                          <button
                            className="dropdown-item"
                            onClick={() => handleSortSelection(option)}
                          >
                            {option}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className='list-display'>
                {propertyList?.length > 0 && propertyList?.map((property, i) => {

                  return (
                    <div key={property.property_id} className="card card-ads">
                    <div className="row g-0">
                        <div className="col-lg-3 col-sm-3">
                            <CardImageSlider data={property} showSq={true} icons={false} />
                        </div>

                        <div className="col-lg-7 col-sm-7 position-relative">
                            <div className="card-body">
                                <h4>
                                    <Link
                                        href={`/property-details/${property.slug}`}
                                    >
                                        {property.property_name}
                                    </Link>
                                </h4>
                                <p className="mb-1">
                                    <i className="icon-feather-map-pin"></i>
                                    {property.address}
                                </p>
                                <ul className="list-info mb-2">
                                    <li>
                                        <i
                                            className="icon-img-bed"
                                            title="Bedrooms:"
                                        ></i>
                                        <span>
                                            {property?.bedrooms || "N/A"}
                                        </span>
                                    </li>
                                    <li>
                                        <i
                                            className="icon-img-tub"
                                            title="Bathrooms:"
                                        ></i>
                                        <span>
                                            {property?.bathroom || "N/A"}
                                        </span>
                                    </li>
                                </ul>
                            </div>
                            <div className="card-footer">
                                <div>
                                    <span className="ad-post-date">
                                        <i className="icon-feather-calendar"></i>
                                        {useDateFormat(property.created_at)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Contact and Favorite Buttons */}
                        <div className="col-lg-2 col-sm-2">
                            <div className="contact-box">
                                <div className="mb-2">
                                    <h4 className="mb-0">
                                        {property?.price_currency &&
                                        property?.exp_price
                                            ? `${
                                                  property.price_currency
                                              } ${new Intl.NumberFormat(
                                                  "en-US"
                                              ).format(property.exp_price)}`
                                            : "Price not available"}
                                    </h4>
                                </div>
                                <div className="d-grid">
                                    <button
                                        className="btn btn-primary btn-sm msg-send mb-2"
                                        onClick={() =>
                                            handleClick(property.property_id)
                                        }
                                    >
                                        Contact Now
                                    </button>
                                    <button
                                        className={`btn ${
                                            property?.is_favorite === true
                                                ? "btn-danger"
                                                : "btn-primary"
                                        } btn-sm msg-send mb-2`}
                                        onClick={() =>
                                            SaveFavouriteProperty(
                                                property.property_id
                                            )
                                        }
                                    >
                                        {property?.is_favorite === true
                                            ? "Remove Fav."
                                            : "Add Fav."}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                  )
                })}
              </div>
              {/* LOAD MORE  */}
              {currentPage < totalPage && (
                <button className="btn btn-primary btn-lg d-block mx-auto mt-4" onClick={() => handleLoadMoreClick(page + 1)}>Load More</button>
              )}
            </aside>
            <aside className="col-xl-3 col-lg-3 col-12 mr-2">
              <img alt="Advertisement" src="/assets/images/ads/real-estate-poster.jpg" />
            </aside>

          </div>
        </div>
        <Modal show={showContactModal} onHide={handleContactClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Contact Owner</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <EnquiryForm
                        propertyId={propertyId}
                        handleClose={handleContactClose}
                    />
                </Modal.Body>
            </Modal>
      </section>
    </MainLayout>
  )
}}

export default index;
