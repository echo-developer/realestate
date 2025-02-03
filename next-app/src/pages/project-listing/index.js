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

const Index = () => {
  const { callApi, GetMemberId } = AuthUser();
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState("Sort By");
  const [projectListData, setProjectListData] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const [showDrop, setShowDrop] = useState(false);
  const memberId = GetMemberId();
  const [perPage, setPerPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPages, setCurrentPages] = useState(0);

  const PostFor = searchParams.get("post_for");
  const projectType = searchParams.get("project_type");
  const projectFor = searchParams.get("project_for");
  const cityName = searchParams.get("city_id");
  const Budget = searchParams.get("project_budget");
  const Size = searchParams.get("project_size");
  const sortKey = searchParams.get("sort_key");
  const sortOrder = searchParams.get("sort_order");

  const FetchProjectListData = async (loadMore, page) => {
    if(!loadMore) {
      setLoading(true);
    }
    let params = { ...router?.query };
    if (sortKey) params.sort_key = sortKey;
    if (sortOrder) params.sort_order = sortOrder;
    // if (projectType) params.project_type = projectType;
    // if (projectFor) params.project_for = projectFor;
    // if (cityName) params.city_id = cityName;
    // if (Budget) params.project_budget = Budget;
    // if (Size) params.project_size = Size;

    try {
      
      const response = await callApi({
        // api: "/get-allprojects",
        api: `/get-searchedprojects?currentpage=${page || 1}`,
        method: "GET",
        data: params,
        // data: router?.query || {}
      });
      console.log("response", response);
      if (response && response?.status === 1) {
        if(!loadMore) {
          setProjectListData(response?.data?.searched_properties || []);
        } else {
          setProjectListData(prev => {
            return [
              ...prev,
              ...response?.data?.searched_properties
            ]
          })
        }
        setTotalPages(response?.data?.pagination?.total_pages || 0);
        setCurrentPages(response?.data?.pagination?.current_page || 0)
      } else if(response?.status === 0) {
        setProjectListData(response?.data || [])
        setTotalPages(response?.data?.pagination?.total_pages || 0);
        setCurrentPages(response?.data?.pagination?.current_page || 0)
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false); // End loading
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
  } 


  return (
    <MainLayout>
      <Helmet>
        <title>
          Explore Top Real Estate Projects | Find Your Ideal Property
        </title>
        <meta
          name="description"
          content="Browse the best real estate projects, including residential and commercial properties. Compare prices, amenities, and locations to find your perfect investment or dream home."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>
      <div className="clearfix"></div>
      <div className="short-banner">
        <div className="container">
          <h1>Project List</h1>
        </div>
      </div>
      <section className="section">
        <div className="container-fluid">
          <div className="row main-row">
            <aside className="col-xl-3 col-lg-3 col-12">
              <ProjectFilterPage />
            </aside>
            <aside className="col-xl-9 col-lg-9 col-12">
              <div className="d-sm-flex justify-content-between align-items-center mb-2">
                <h4 className="mb-3 mb-sm-0">
                  Total{" "}
                  <span className="text-primary">{projectListData.length}</span>{" "}
                  Projects Found
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
                        "Size - Low to High",
                        "Size - High to Low",
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
                  FetchProjectListData={FetchProjectListData}
                />
              ) : (
                <div style={noRecordsStyle}>
                  <h2>No Records Found</h2>
                </div>
              )}
              {currentPages < totalPages && (
                <button
                class="btn btn-primary btn-lg d-block mx-auto mt-4"
                onClick={() => handleLoadMoreClick(perPage + 1)}
              >
                Load More
              </button>
              )}
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
