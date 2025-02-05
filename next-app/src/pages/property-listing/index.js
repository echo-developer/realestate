"use client";
import React, { useEffect, useState } from "react";
import ResidentialType from "@/components/property/ResidentialType";
import MainLayout from "@/components/layout/MainLayout";
import SearchForm from "@/components/SearchCategory/SearchForm";
import AuthUser from "@/components/Authentication/AuthUser";
import { useSearchParams, useRouter } from "next/navigation";
import CommercialType from "@/components/property/CommercialType";
import { Helmet } from "react-helmet-async";

const Index = () => {
  const { callApi, GetMemberId } = AuthUser();
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState("Sort By");
  const [propertyListData, setPropertyListData] = useState([]);
  const searchParams = useSearchParams();
  const [showDrop, setShowDrop] = useState(false);
  const memberId = GetMemberId();
  const [isAdvanceSearch, setIsAdvanceSearch] = useState(false);
  const [advanceSearchLoadMore, setAdvanceSearchLoadMore] = useState(false);
  const [advanceSearchRecentPage, setAdvanceSearchRecentPage] = useState(1);
  const [recent_page, setRecentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPages, setCurrentPages] = useState(1);

  const PostFor = searchParams.get("post_for");
  const propertyType = searchParams.get("property_type");
  const propertyFor = searchParams.get("property_for");
  const bedrooms = searchParams.get("bedrooms");
  const parking = searchParams.get("parking");
  const cityName = searchParams.get("city_id");
  const Budget = searchParams.get("property_budget");
  const Size = searchParams.get("property_size");
  const sortKey = searchParams.get("sort_key");
  const sortOrder = searchParams.get("sort_order");
  const gender = searchParams?.get("gender")

  const FetchPropertyListData = async (loadMore, per_page) => {
    let params = {
      post_for: PostFor || "rent",
      currentpage: per_page || recent_page,
    };

    if (sortKey) params.sort_key = sortKey;
    if (sortOrder) params.sort_order = sortOrder;

    if (propertyType) params.property_type = propertyType;
    if (propertyFor) params.property_for = propertyFor;
    if (bedrooms) params.bedrooms = bedrooms;
    if (parking) params.parking = parking;
    if (cityName) params.city_id = cityName;
    if (Budget) params.property_budget = Budget;
    if (Size) params.property_size = Size;
    if(gender) params.gender = gender;
    if(memberId) params.user_id = memberId;

    try {
      const response = await callApi({
        api: "/get_search_result",
        method: "GET",
        data: params,
      });

      if (response && response.status === 1) {
        const data = response?.data?.searched_properties || [];
        if (loadMore) {
          setPropertyListData((prev) => {
            return [...prev, ...data];
          });
        } else {
          setPropertyListData(data);
        }
        setTotalPages(response?.data?.pagination?.total_pages || 0);
        setCurrentPages(response?.data?.pagination?.current_page || 0)
      } else if (response && response?.status === 0) {
        setPropertyListData(response?.data);
        setTotalPages(response?.data?.pagination?.total_pages || 0);
        setCurrentPages(response?.data?.pagination?.current_page || 0)
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
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

  const favStateUpdater = (id) => {
    const newArr = propertyListData?.map((item) => {
      if (item?.property_id === id) {
        return {
          ...item,
          is_favorite: !item?.is_favorite,
        };
      } else {
        return item;
      }
    });
    setPropertyListData(newArr);
  };

  useEffect(() => {
    FetchPropertyListData();
  }, [
    PostFor,
    propertyType,
    propertyFor,
    bedrooms,
    parking,
    cityName,
    Budget,
    Size,
    sortKey,
    sortOrder,
    searchParams
  ]);

  const noRecordsStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "300px",
    textAlign: "center",
  };

  const setAdvanceSearchData = (response, loadMore) => {
    if (response?.status === 1) {
      if (!Array?.isArray(response?.data)) {
        if (loadMore) {
          setPropertyListData((prev) => {
            return [...prev, ...response?.data?.searched_properties];
          });
        } else {
          setPropertyListData(response?.data?.searched_properties);
        }
      } else {
        setPropertyListData(response?.data);
      }
    } else {
      setPropertyListData(response?.data || []);
    }
  };

  const handleLoadMoreClick = (advanceLoadMore, newPage) => {
    if (advanceLoadMore) {
      setAdvanceSearchLoadMore(true);
      setAdvanceSearchRecentPage(newPage);
    } else {
      setRecentPage(newPage);
      FetchPropertyListData(true, newPage);
    }
  };


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
      <React.Fragment>
        <div className="clearfix"></div>
        <div className="short-banner" style={{ minHeight: "120px" }}>
          <SearchForm
            setIsAdvanceSearch={setIsAdvanceSearch}
            setAdvanceSearchData={setAdvanceSearchData}
            loadMore={advanceSearchLoadMore}
            recent_page={advanceSearchRecentPage}
            setTotalPages={setTotalPages}
            setCurrentPages={setCurrentPages}
            postFor={PostFor}
            memberId={memberId}
          />
        </div>
        <section className="section">
          <div className="container-fluid">
            <div className="row main-row">
              <aside className="col-xl-9 col-lg-9 col-12">
                <div className="d-sm-flex justify-content-between align-items-center mb-2">
                  <h4 className="mb-3 mb-sm-0">
                    Total{" "}
                    <span className="text-primary">
                      {propertyListData?.length}
                    </span>{" "}
                    Properties Found
                  </h4>
                  <div className="sort-by">
                    <div className="dropdown">
                      <button
                        className={`btn btn-light dropdown-toggle w-100 ${
                          showDrop ? "show" : ""
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
                {propertyListData?.length > 0 ? (
                  <>
                    {propertyType === 1 ? (
                      <ResidentialType
                        favStateUpdater={favStateUpdater}
                        propertyListData={propertyListData}
                      />
                    ) : propertyType === 2 ? (
                      <CommercialType
                        favStateUpdater={favStateUpdater}
                        propertyListData={propertyListData}
                      />
                    ) : (
                      <ResidentialType
                        favStateUpdater={favStateUpdater}
                        propertyListData={propertyListData}
                      />
                    )}
                  </>
                ) : (
                  <div style={noRecordsStyle}>
                    <h2>No Records Found</h2>
                  </div>
                )}
                {currentPages < totalPages &&
                  (isAdvanceSearch ? (
                    <>
                      <button
                        class="btn btn-primary btn-lg d-block mx-auto mt-4"
                        onClick={() =>
                          handleLoadMoreClick(true, advanceSearchRecentPage + 1)
                        }
                      >
                        Load More
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        class="btn btn-primary btn-lg d-block mx-auto mt-4"
                        onClick={() =>
                          handleLoadMoreClick(null, recent_page + 1)
                        }
                      >
                        Load More
                      </button>
                    </>
                  ))
                  }
              </aside>
              <aside className="col-xl-3 col-lg-3 col-12 mr-2">
                <img
                  src="/assets/images/ads/real-estate-poster.jpg"
                  alt="Advertisement"
                />
              </aside>
            </div>
          </div>
        </section>
      </React.Fragment>
    </MainLayout>
  );
};

export default Index;
