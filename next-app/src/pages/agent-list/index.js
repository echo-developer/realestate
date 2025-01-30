"use client";
import React, { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import AuthUser from "@/components/Authentication/AuthUser";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";
import defaultUser from "../../../public/assets/images/agents/user.jpg";

const filters = [
  {
    id: "city",
    type: "dropdown",
    label: "Select City",
    options: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"],
  },
  {
    id: "address",
    type: "text",
    label: "Address",
    placeholder: "Address",
    icon: "icon-feather-map-pin",
  },
];

const Index = () => {
  const { callApi } = AuthUser();
  const [agentList, setAgentList] = useState([]);
    const [perPage, setPerPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPages, setCurrentPages] = useState(0);

  useEffect(() => {
    FetchAgentList();
  }, []);

  const FetchAgentList = async (loadMore, newPage) => {
    try {
      const response = await callApi({
        api: `/agent_list?page=${newPage || 1}`,
        method: "GET",
      });
      if (response && response.status === 1) {
        if(!loadMore) {
          setAgentList(response.data);
        } else {
          setAgentList(prev => {
            return [
              ...prev,
              ...response?.data
            ]
          })
        }
        setTotalPages(response?.pagination?.total_pages || 0)
        setCurrentPages(response?.pagination?.current_page || 0)
      } else {
        toast.error(response.message);
        setTotalPages(response?.pagination?.total_pages || 0)
        setCurrentPages(response?.pagination?.current_page || 0)
      }
    } catch (error) {}
  };

  const handleLoadMoreClick = (nextPage) => {
    setPerPage(nextPage);
    FetchAgentList(true, nextPage);
  }

  console.log("total page", totalPages);
  console.log("current pages", currentPages);
  return (
    <MainLayout>
      <Helmet>
        <title>
          Find Real Estate Agents | Trusted Property Experts Near You
        </title>
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
            <div
              className="card-header filterHeader mb-4 filter-clear-area-wrap"
              style={{ display: "none" }}
            >
              <div className="row d-flex mt-2 filter-clear-area"></div>
            </div>
            <div className="acc-panel">
              <form data-filter="n">
                <div className="row -mb-3">
                  {filters.map((filter) => (
                    <div
                      key={filter.id}
                      className={
                        filter.type === "dropdown"
                          ? "col-lg-3 col-sm-6 col-12"
                          : "col-lg-9 col-sm-6 col-12"
                      }
                    >
                      <div className="form-field">
                        {filter.type === "dropdown" ? (
                          <div className="btn-group bootstrap-select hide-tick1 fit-width">
                            <button
                              type="button"
                              className="btn dropdown-toggle bs-placeholder btn-default"
                              data-toggle="dropdown"
                              role="button"
                              data-id={filter.id}
                              title={filter.label}
                            >
                              <span className="filter-option pull-left">
                                {filter.label}
                              </span>
                              &nbsp;
                              <span className="bs-caret">
                                <span className="caret"></span>
                              </span>
                            </button>
                            <ul className="dropdown-menu">
                              {filter.options.map((option, index) => (
                                <li key={index}>
                                  <a className="dropdown-item">{option}</a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <div className="form-field with-icon-start">
                            <i className={filter.icon}></i>
                            <input
                              type={filter.type}
                              name={filter.id}
                              id={filter.id}
                              className="form-control address-box"
                              placeholder={filter.placeholder}
                              autoComplete="off"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
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
                  Agent List ({agentList.length})
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
              {agentList?.length > 0 ? (
                <div className="list-display">
                  {agentList.map((agent) => (
                    <div key={agent.id} className="card card-agent">
                      <div className="row g-0">
                        <div className="col-sm-auto col-4">
                          <div className="card-image">
                            <a>
                              <img
                                src={
                                  agent?.image ||
                                  "/assets/images/agents/user.jpg"
                                }
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
                                <i className="icon-feather-phone"></i>{" "}
                                {agent.phone}
                              </p>
                            )}
                            {agent?.email && (
                              <p className="mb-2">
                                <i className="icon-feather-mail"></i>{" "}
                                {agent.email}
                              </p>
                            )}
                            <div className="d-flex card-group-btn">
                              {agent?.phone && (
                                <a
                                  href={`tel:${agent.phone}`}
                                  className="btn btn-sm btn-outline-site me-2"
                                >
                                  <i className="icon-feather-phone"></i> Call
                                </a>
                              )}
                              <a className="btn btn-sm btn-outline-site me-2">
                                <i className="icon-feather-mail"></i> Message
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
                class="btn btn-primary btn-lg d-block mx-auto mt-4"
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
                  src="assets/images/ads/real-estate-poster.jpg"
                  alt="ads"
                  className="img-fluid"
                />
              </div>
              <div className="text-center mb-4">
                <img
                  src="assets/images/ads/houseSaleFlyerGREEN.jpg"
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
