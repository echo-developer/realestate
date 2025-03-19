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
} from "react-bootstrap";
import ProjectMobileFilters from "@/components/addtional/ProjectMobileFilter";

const Index = () => {
  const { callApi, GetMemberId } = AuthUser();
  const router = useRouter();
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

  const PostFor = searchParams.get("post_for");
  const projectType = searchParams.get("project_type");
  const projectFor = searchParams.get("project_for");
  const cityName = searchParams.get("city_id");
  const Budget = searchParams.get("project_budget");
  const Size = searchParams.get("project_size");
  const sortKey = searchParams.get("sort_key");
  const sortOrder = searchParams.get("sort_order");

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
    if (sortKey) params.sort_key = sortKey;
    if (sortOrder) params.sort_order = sortOrder;
    if (memberId) params.user_id = memberId;
    delete params.address;
    if (router?.query?.address) {
      params.locality = router?.query?.address;
    }
    try {
      const response = await callApi({
        api: `/get-searchedprojects?currentpage=${page || 1}`,
        method: "GET",
        data: cleanJsonData(params),
      });
      if (response && response?.status === 1) {
        if (!loadMore) {
          setProjectListData(response?.data?.searched_properties || []);
          setTotalPages(response?.data?.pagination?.total_pages || 0);
          setCurrentPages(response?.data?.pagination?.current_page || 0);
        } else {
          setProjectListData((prev) => {
            return [...prev, ...response?.data?.searched_properties];
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
    if (router?.isReady) {
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

  return (
    <MainLayout>
      <Helmet>
        <title>
          {translation?.explore_property_listings ||
            "Explore Property Listings | Buy, Rent, or Invest with RealEstate"}
        </title>
        <meta
          name="description"
          content="Browse the best real estate projects, including residential and commercial properties. Compare prices, amenities, and locations to find your perfect investment or dream home."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>
      {isMobile ? (
        <ProjectMobileFilters />
      ) : (
        <div className="short-banner pt-4">
          <div className="container-fluid">
            <ProjectFilterPage setPerPage={setPerPage} />
          </div>
        </div>
      )}

      <section className="section">
        <div className="container-fluid">
          <div className="row main-row">
            <aside className="col-xl-9 col-lg-9 col-12">
              <div className="d-sm-flex justify-content-between align-items-center mb-2">
                <h4 className="mb-3 mb-sm-0">
                  {translation?.total || "Total"}{" "}
                  <span className="text-primary">{projectListData.length}</span>{" "}
                  {translation?.projects_found || "Projects Found"}
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

              {loading ? (
                <ShimmerContentBlock
                  title
                  text
                  cta
                  thumbnailWidth={350}
                  thumbnailHeight={50}
                />
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
              <img
                alt="Advertisement"
                src="/assets/images/ads/real-estate-poster.jpg"
                className="img-fluid"
              />
            </aside>
          </div>
        </div>
      </section>
    </MainLayout>
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
