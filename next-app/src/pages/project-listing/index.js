"use client";
import React, { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import ProjectFilterPage from "@/components/projectFilter/ProjectFilterPage";
import AuthUser from "@/components/Authentication/AuthUser";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import ResidentialProjectList from "@/components/postproject/ResidentialProjectList";
import { ShimmerContentBlock } from "react-shimmer-effects";
import { Helmet } from "react-helmet-async";
import useTranslation from "@/hooks/useTranslation";
import useIsMobile from "@/hooks/useIsMobile";
import { AuthProvider, useAuth } from "@/context/AuthProvider";
import useAdvertisement from "@/hooks/useAdvertisement";
import {
  Form,
  Row,
  Col,
  Button,
  ListGroup,
  Nav,
  ProgressBar,
  FloatingLabel,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";
import { GeoAlt, Search } from "react-bootstrap-icons";
import ProjectMobileFilters from "@/components/addtional/ProjectMobileFilter";
import ProjectListingMapView from "@/components/MapData/ProjectListingMapView";
import Head from "next/head";

const Index = () => {
  const [showMapView, setShowMapView] = useState(false);
  const { callApi, GetMemberId } = AuthUser();
  const router = useRouter();
  const { defaultCity } = useAuth();
  const translation = useTranslation();
  const [selectedOption, setSelectedOption] = useState("Sort By");
  const [projectListData, setProjectListData] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const [showDrop, setShowDrop] = useState(false);
  const memberId = GetMemberId();
  const [perPage, setPerPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPages, setCurrentPages] = useState(0);
  const isMobile = useIsMobile();
  const { adsData, logAdClick } = useAdvertisement(
    "project-listing-page",
    "right",
    defaultCity?.city_id
  );
  const PostFor = searchParams.get("post_for");
  const projectType = searchParams.get("project_type");
  const projectFor = searchParams.get("project_for");
  const cityName = searchParams.get("city_id");
  const Budget = searchParams.get("project_budget");
  const Size = searchParams.get("project_size");
  const sortKey = searchParams.get("sort_key");
  const sortOrder = searchParams.get("sort_order");
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [dropdownState, setDropdownState] = useState({});


  const toggleDropdown = (key) => {
    setDropdownState(prevState => {
      const newState = { ...prevState };
      if (!newState[key]) {
        newState[key] = true;
        setIsOverlayVisible(true);
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
    // if (!e.target.closest('.dropdown') && !e.target.closest('.overlay')) {
    setDropdownState({});
    setIsOverlayVisible(false);
    // }
  };


  const cleanJsonData = (jsonData) => {
    return Object.fromEntries(
      Object.entries(jsonData).map(([key, value]) => {
        try {
          return [key, JSON.parse(value)];
        } catch {
          return [key, value];
        }
      })
    );
  };


  const FetchProjectListData = async (loadMore, page) => {
    if (!loadMore) {
      setLoading(true);
    }
    let params = { ...router?.query };
    if (params?.locality) {
      const locality = JSON.parse(params?.locality)
      if (locality) {
        params.locality = locality?.locality_id
      }
    }
    if (sortKey) params.sort_key = sortKey;
    if (sortOrder) params.sort_order = sortOrder;
    if (memberId) params.user_id = memberId;
    delete params.address;
    if (router?.query?.address) {
      params.locality = router?.query?.address;
    }
    if (showMapView) {
      params.hasLatLng = 1;
    } else {
      params.hasLatLng = 0;
    }
    try {
      const response = await callApi({
        api: `/get-searchedprojects?currentpage=${page || 1}&city_id=${defaultCity?.city_id}`,
        method: "GET",
        data: cleanJsonData(params),
      });
      if (response && response?.status === 1) {
        if (!loadMore) {
          setProjectListData(response?.data?.searched_projects || []);
          setTotalPages(response?.data?.pagination?.total_pages || 0);
          setCurrentPages(response?.data?.pagination?.current_page || 0);
        } else {
          setProjectListData((prev) => {
            return [...prev, ...response?.data?.searched_projects];
          });
        }

        setTotalPages(response?.data?.pagination?.total_pages || 0);
        setCurrentPages(response?.data?.pagination?.current_page || 0);
      } else if (response?.status === 0) {
        setProjectListData(response?.data || []);
        setTotalPages(response?.data?.pagination?.total_pages || 0);
        setCurrentPages(response?.data?.pagination?.current_page || 0);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
      if (!loadMore) {
        setPerPage(1);
      }
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
      newSortKey = "expected_price";
      newSortOrder = "asc";
    } else if (sortOption === "Price - High to Low") {
      newSortKey = "expected_price";
      newSortOrder = "desc";
    } else if (sortOption === "Size - Low to High") {
      newSortKey = "project_size";
      newSortOrder = "asc";
    } else if (sortOption === "Size - High to Low") {
      newSortKey = "project_size";
      newSortOrder = "desc";
    }

    router.push(
      {
        pathname: "/project-listing",
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


  useEffect(() => {
    if (router?.isReady && defaultCity) {
      FetchProjectListData();
    }
  }, [
    PostFor,
    projectType,
    projectFor,
    cityName,
    Budget,
    Size,
    sortKey,
    sortOrder,
    router?.isReady,
    router?.query,
    memberId,
    defaultCity,
    showMapView
  ]);

  useEffect(() => {
    if (router?.isReady) {
      const sortKey = searchParams.get("sort_key");
      const sortOrder = searchParams.get("sort_order");
      const sortValue = generateSortValue(sortKey, sortOrder);
      setSelectedOption(sortValue);
    }
  }, [router?.query]);

  const noRecordsStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "300px",
    textAlign: "center",
  };

  const handleLoadMoreClick = (nextPage) => {
    setPerPage(nextPage);
    FetchProjectListData(true, nextPage);
  };

  const metaTitle = `Find top residential projects in ${defaultCity?.name} including new launch, under construction, and ready-to-move properties. Compare amenities, prices, and locations to choose the best project for your needs.`
  const metaDescription = `Discover a wide range of projects in ${defaultCity?.name}, including newly launched, under-construction, and ready-to-move properties by top builders. Whether you're looking for 1, 2, 3, or 4 BHK flats, explore verified project listings with detailed information on floor plans, amenities, possession dates, and location insights. Compare prices, view real images, and make informed decisions when buying property in ${defaultCity?.name}`

  return (
    <>
      {isOverlayVisible && (
        <div
          className="page-overlay"
          onClick={handleClickOutside}
        ></div>
      )}
      <MainLayout>
        <Head>
          <title>{metaTitle}</title>
          <meta name="description" content={metaDescription} />
        </Head>

        {isMobile ? (
          <>
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

            <ProjectMobileFilters
              showDrop={showDrop}
              setShowDrop={setShowDrop}
              selectedOption={selectedOption}
              handleSortSelection={handleSortSelection}
              toggleDropdown={toggleDropdown}
            />
          </>
        ) : (
          <div className="short-banner pt-4">
            <div className="container-fluid">
              <ProjectFilterPage
                setPerPage={setPerPage}
                toggleDropdown={toggleDropdown}
                handleClickOutside={handleClickOutside}
                dropdownState={dropdownState}
                setIsOverlayVisible={setIsOverlayVisible}
                showMapView={showMapView}
                setShowMapView={setShowMapView} />
            </div>
          </div>
        )}

        <section className="section pb-0">
          <div className="container-fluid">
            <div className="row">
              <aside
                   className={showMapView ? 'col-12' : 'col-lg-9'}
                   >
                    <div className="d-sm-flex justify-content-between align-items-center mb-3">
                  <h4 className="mb-3 mb-sm-0">
                    {translation?.total || "Total"}{" "}
                    <span className="text-primary">{projectListData.length}</span>{" "}
                    {translation?.projects_found || "Projects Found"}
                  </h4>
                  <div className="d-flex gap-2">
                    <div className="sort-by d-none d-md-block">
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
                    <Button
                      variant="outline-primary"
                      size='sm'
                      className={`${!showMapView ? 'active' : ''}`}
                      onClick={() => setShowMapView(false)}
                    >
                      <i className="bi bi-list-ul me-1"></i> List View
                    </Button>
                    <Button
                      variant="outline-primary"
                      size='sm'
                      className={`${showMapView ? 'active' : ''}`}
                      onClick={() => setShowMapView(true)}
                    >
                      <i className="bi bi-map me-1"></i> Map View
                    </Button>
                  </div>                  
                </div>
              </aside>
            </div>
            
            {showMapView ? (<>
              <>
                
                <ProjectListingMapView loading={loading} projectList={projectListData} />
              </>
            </>) : (<>
              <div className="row main-row">
                <aside className="col-xl-9 col-lg-9 col-12">
                  

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
                  ) : projectListData.length > 0 ? (
                    <ResidentialProjectList
                      projectListData={projectListData}
                      setProjectListData={setProjectListData}
                    />
                  ) : (
                    <div style={noRecordsStyle}>
                      <h2>
                        {" "}
                        {translation?.no_records_found || "No Records Found"}
                      </h2>
                    </div>
                  )}
                  {!loading && currentPages < totalPages && (
                    <button
                      className="btn btn-primary d-block mx-auto mt-4"
                      onClick={() => handleLoadMoreClick(perPage + 1)}
                    >
                      {translation?.load_more || "Load More"}
                    </button>
                  )}
                </aside>
                <aside className="col-xl-3 col-lg-3 col-12">
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
                    <img
                      alt="Advertisement"
                      src="/assets/images/ads/real-estate-poster.jpg"
                      className="img-fluid"
                    />
                  )}
                </aside>
              </div>
            </>)}
          </div>
        </section>
      </MainLayout>
    </>

  );
};

export default Index;

const generateSortValue = (sortKey, sortOrder) => {
  if (sortKey === "project_size") {
    if (sortOrder === "asc") {
      return "Size - Low to High";
    } else if (sortOrder === "desc") {
      return "Size - High to High";
    } else {
    }
  } else if (sortKey === "expected_price") {
    if (sortOrder === "asc") {
      return "Price - Low to High";
    } else if (sortOrder === "desc") {
      return "Price - High to High";
    }
  } else if (sortKey === "created_at") {
    return "Recent";
  } else {
    return "Sort By";
  }
};
