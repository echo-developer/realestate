"use client";
import React, { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import AuthUser from "@/components/Authentication/AuthUser";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";
import LocalitySearch from "@/components/MapData/LocalitySearch";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthProvider";
import DashboardLayout from "@/components/layout/DashboardLayout";
// import { useAuth } from "@/context/AuthProvider";
import { Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const Index = () => {
  const [isVerified, setIsVerified] = useState(false);
  const { callApi } = AuthUser();
  const router = useRouter();
  const [agentList, setAgentList] = useState([]);
  const [perPage, setPerPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPages, setCurrentPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [locality, setLocality] = useState()
  const [loading, setLoading] = useState(true);
  const { defaultCity } = useAuth();


  useEffect(() => {
    if (router?.isReady && defaultCity) {
      FetchAgentList();
    }
  }, [router, defaultCity, isVerified]);

  const FetchAgentList = async (loadMore, newPage) => {
    const { page, name, locality } = router?.query || {};
    if (!loadMore) {
      setLoading(true);
    }

    let data = {
      page: page,
    };
    if (name) {
      data.name = name;
      setSearchQuery(name);
    }

    if (locality) {
      const localityObj = JSON.parse(locality);
      setLocality(localityObj)
      const localityStr = localityObj?.locality?.split(", ")
      data.locality = `${localityStr[0]}, ${localityStr[1]}`
    }

    try {
      const response = await callApi({
        api: `/agent_list`,
        method: "GET",
        data: {
          ...data,
          city_id: defaultCity?.city_id,
          is_verified_agent : isVerified || false,
        }
      });
      if (response && response.status === 1) {
        if (!loadMore) {
          setAgentList(response.data);
          if (response?.data?.length === 0) {
            console.error(response?.message || "no agent found")
          }
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
      toast.error(error?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  };

  const handleLoadMoreClick = (nextPage) => {
    setPerPage(nextPage);
    FetchAgentList(true, nextPage);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let url = `/agent-list?page=${perPage}`;
    if (searchQuery) {
      url = `${url}&name=${searchQuery}`
    }
    if (locality) {
      url = `${url}&locality=${JSON.stringify(locality)}`
    }
    router.push(url);

  }

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


      <aside className="col-lg col-12">
        <div className="short-banner">
          <div className="container-fluid">
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
                <form data-filter="n" onSubmit={handleSubmit}>
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

                    <LocalitySearch locality={locality} setLocalityData={setLocality} />

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
        <div className="p-4">

          {/* Main Content */}
          <div className="d-sm-flex justify-content-between align-items-center mb-2">
            <h4 className="mb-3 mb-sm-0">
              Agent List ({agentList.length || "Not Available"})
            </h4>
            {/* <div className="sort-by">
            </div> */}
            {/* <Button
              variant={isOn ? "success" : "danger"}
              onClick={() => setIsOn(!isOn)}
            >
              {isOn ? "ON" : "OFF"}
            </Button> */}
            <div>
            <span>Verified Agents</span>
            <Form.Check
              type="switch"
              id="custom-switch"
              label={isVerified ? "ON" : "OFF"}
              checked={isVerified}
              onChange={() => setIsVerified(!isVerified)}
            />
            </div>
        </div>
        {agentList?.length > 0 && (
          <div className="list-display">
            {agentList.map((agent) => (
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
                        {/* <a c
                              \
                               */}
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
        )}
        {(!loading && agentList?.length === 0) && (
          <>
            <div className='card border-0 text-center'>
              <div className="card-body">
                <img src="/assets/images/icons/9939447.png" alt="Icon" height={48} width={48} className="mb-2" />
                <p className='text-muted'>No Record Founds</p>
              </div>
            </div>
          </>
        )}
        {currentPages < totalPages && (
          <button
            className="btn btn-primary btn-lg d-block mx-auto mt-4"
            onClick={() => handleLoadMoreClick(perPage + 1)}
          >
            Load More
          </button>
        )}

      </div>
    </aside>
    </MainLayout >
  );
};

export default Index;
