"use client";
import React, { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import AuthUser from "@/components/Authentication/AuthUser";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";
import LocalitySearch from "@/components/MapData/LocalitySearch";

const Index = () => {
  const { callApi } = AuthUser();
  const [agentList, setAgentList] = useState([]);
  const [filteredAgentList, setFilteredAgentList] = useState([]);
  const [perPage, setPerPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPages, setCurrentPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [locality,setLocality] = useState()

  useEffect(() => {
    FetchAgentList();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = agentList.filter((agent) =>
        agent.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredAgentList(filtered);
    } else {
      setFilteredAgentList(agentList);
    }
  }, [searchQuery, agentList]);

  const FetchAgentList = async (loadMore, newPage) => {
    try {
      const response = await callApi({
        api: `/agent_list`,
        method: "GET",
        data:{
          page:newPage,
          locality:locality
        }
      });
      if (response && response.status === 1) {
        if (!loadMore) {
          setAgentList(response.data);
        } else {
          setAgentList((prev) => {
            return [...prev, ...response?.data];
          });
        }
        setTotalPages(response?.pagination?.total_pages || 0);
        setCurrentPages(response?.pagination?.current_page || 0);
      } else {
        toast.error(response.message);
        setTotalPages(response?.pagination?.total_pages || 0);
        setCurrentPages(response?.pagination?.current_page || 0);
      }
    } catch (error) {
      toast.error("Error fetching agents");
    }
  };

  const handleLoadMoreClick = (nextPage) => {
    setPerPage(nextPage);
    FetchAgentList(true, nextPage);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <MainLayout>
      <Helmet>
        <title>Find Real Estate Agents | Trusted Property Experts Near You</title>
        <meta
          name="description"
          content="Browse a list of experienced real estate agents ready to help you buy, sell, or rent properties. Find the perfect agent to assist with your property journey today!"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>
      <div className="clearfix"></div>
      <div className="short-banner">
        <div className="container">
          <div className="filterHeader d-lg-none">
            <h4>Filters</h4>
            <a className="float-end" title="Filter">
              <i className="icon-feather-filter f20"></i>
            </a>
          </div>
          <div className="filter">
            <div className="card-header filterHeader d-lg-none mb-4">
              <div className="row d-flex">
                <div className="col text-left">
                  <h4>Filters</h4>
                </div>
                <div className="col">
                  <a className="close_filter" title="Filter">
                    <i className="icon-feather-x f20"></i>
                  </a>
                </div>
              </div>
            </div>
            <div className="acc-panel">
              <form data-filter="n">
                <div className="row align-items-center">
                  {/* Name Search */}
                  <div className="col-lg-4 mt-3 col-sm-4 col-12 ">
                    <div className="form-field with-icon-start">
                      <i className="icon-feather-search"></i>
                      <input
                        type="text"
                        name="nameSearch"
                        id="nameSearch"
                        className="form-control address-box"
                        placeholder="Search by Name"
                        autoComplete="off"
                        value={searchQuery}
                        onChange={handleSearchChange}
                      />
                    </div>
                  </div>

                  {/* Locality Input */}
                  {/* <div className="col-lg-5 col-sm-4 col-12 mb-3 mb-sm-0">
                    <div className="form-field">
                      <input
                        type="text"
                        name="locality"
                        id="locality"
                        className="form-control address-box"
                        placeholder="Enter Locality"
                        autoComplete="off"
                      />
                    </div>
                  </div> */}
                  <LocalitySearch setLocalityData={setLocality}/>

                  {/* Submit Button */}
                  <div className="col-lg-2 col-sm-4 col-12">
                    <button type="submit" className="btn btn-primary w-100">
                      Submit
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="container-fluid">
          <div className="row">
            {/* Main Content */}
            <aside className="col-xl-9 col-lg-9 col-12">
              <div className="d-sm-flex justify-content-between align-items-center mb-2">
                <h4 className="mb-3 mb-sm-0">
                  Agent List ({filteredAgentList.length})
                </h4>
                <div className="sort-by">
                  <button className="btn btn-list me-2 active">
                    <i className="icon-feather-list"></i>
                  </button>
                  <button className="btn btn-grid">
                    <i className="icon-feather-grid"></i>
                  </button>
                </div>
              </div>
              {filteredAgentList?.length > 0 ? (
                <div className="list-display">
                  {filteredAgentList.map((agent) => (
                    <div key={agent.id} className="card card-agent">
                      <div className="row g-0">
                        <div className="col-sm-auto col-4">
                          <div className="card-image">
                            <a>
                              <img
                                src={agent?.image || "/assets/images/agents/user.jpg"}
                                alt={agent?.name || "User"}
                                className="img-fluid"
                              />
                            </a>
                          </div>
                        </div>
                        <div className="col-sm col-8">
                          <div className="card-body">
                            <div className="card-title">
                              <h4>
                                <a>{agent?.name || "N/A"}</a>
                                <i className="icon-img-check ms-1"></i>
                              </h4>
                              <span className="badge badge-outline-secondary">
                                Properties
                              </span>
                            </div>
                            {agent?.phone && (
                              <p className="mb-2">
                                <i className="icon-feather-phone"></i> {agent.phone}
                              </p>
                            )}
                            {agent?.email && (
                              <p className="mb-2">
                                <i className="icon-feather-mail"></i> {agent.email}
                              </p>
                            )}
                            <div className="d-flex card-group-btn">
                              {agent?.phone && (
                                <a
                                  href={`tel:${agent.phone}`}
                                  className="btn btn-sm btn-outline-site me-2"
                                >
                                  <i className="icon-feather-phone"></i>Call
                                </a>
                              )}
                              <a className="btn btn-sm btn-outline-site me-2">
                                <i className="icon-feather-mail"></i>Message
                              </a>
                              <a className="btn btn-sm btn-outline-site me-2">
                                <i className="icon-brand-whatsapp"></i> WhatsApp
                              </a>
                              {agent?.user_id && (
                                <a
                                  className="btn btn-primary ms-auto"
                                  href={`/agent-details/${agent.user_id}`}
                                >
                                  View Profile
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center mb-4">
                  <p>No Record Found </p>
                </div>
              )}
              {currentPages < totalPages && (
                <button
                  className="btn btn-primary btn-lg d-block mx-auto mt-4"
                  onClick={() => handleLoadMoreClick(perPage + 1)}
                >
                  Load More
                </button>
              )}
            </aside>
            {/* Sidebar */}
            <aside className="col-xl-3 col-lg-3 col-12">
              <div className="text-center mb-4">
                <img
                  src="/assets/images/ads/real-estate-poster.jpg"
                  alt="ads"
                  className="img-fluid"
                />
              </div>
              <div className="text-center mb-4">
                <img
                  src="/assets/images/ads/houseSaleFlyerGREEN.jpg"
                  alt="ads"
                  className="img-fluid"
                />
              </div>
            </aside>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
