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
import "bootstrap/dist/css/bootstrap.min.css";
import useTranslation from "@/hooks/useTranslation";
import {
  Form,
  Row,
  Col,
  ListGroup,
  Nav,
  ProgressBar,
  FloatingLabel,
} from "react-bootstrap";
const Index = () => {
  const translation = useTranslation();
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
  const [showWhatsApp, setShowWhatsApp] = useState({
    user_id: null,
    active: false,
    number: ""
  })


  useEffect(() => {
    if (router?.isReady && defaultCity) {
      FetchAgentList();
    }
  }, [router?.query, defaultCity]);

  const FetchAgentList = async (loadMore, newPage) => {
    const { page, name, locality, is_verified_agent } = router?.query || {};
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
    if (is_verified_agent) {
      data.is_verified_agent = is_verified_agent
      setIsVerified(JSON.parse(is_verified_agent));
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

  const handleVerifiedAgentChange = () => {
    const params = new URLSearchParams(window.location.search);
    params.set("is_verified_agent", !isVerified);
    const newUrl = `${window.location?.pathname}?${params.toString()}`
    router.push(newUrl);
  }

  const handleWhatsappNo = (user_id) => {
    const agent = agentList?.find(item => item?.user_id === user_id);
    if (agent) {
      setShowWhatsApp({
        user_id: agent?.user_id,
        active: true,
        number: agent?.whatsapp_no
      })
    }
  }

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
        <title>{translation?.trusted_property_experts_near_you || "Find Real Estate Agents | Trusted Property Experts Near You"}</title>
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
              <h4> {translation?.filters || "Filters"}</h4>
              <a className="float-end" title="Filter">
                <i className="icon-feather-filter f20"></i>
              </a>
            </div>
            <div className="filter">
              <div className="card-header filterHeader d-lg-none mb-4">
                <div className="row d-flex">
                  <div className="col text-left">
                    <h4>   {translation?.filters || "Filters"}</h4>
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
                          placeholder={translation?.search_by_name || "Search by Name"}
                          autoComplete="off"
                          value={searchQuery}
                          onChange={handleSearchChange}
                        />
                      </div>
                    </div>
                    <Col className="col-lg-4 col-sm-6">
                      <LocalitySearch locality={locality} setLocalityData={setLocality} />
                    </Col>

                    {/* Submit Button */}
                    <div className="col-lg-2 col-sm-4 col-12">
                      <button type="submit" className="btn btn-primary w-100">
                      {translation?.submit || "Submit"}
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
            {translation?.agent_list || "Agent List"} ({agentList.length || `${translation?.not_available ||"Not available"}`})
            </h4>
            <div>
              <span>{translation?.verified_agents || "Verified agents"} </span>
              <Form.Check
                type="switch"
                id="custom-switch"
                label={isVerified ? "ON" : "OFF"}
                checked={isVerified}
                onChange={handleVerifiedAgentChange}
              />
            </div>
          </div>
          {loading && (
            <div className="loading-spinner">
            <div className="spinner-border" role="status">
              <span className="visually-hidden"> {translation?.loading || "Loading...."} </span>
            </div>
          </div>
          )}
          {!loading && agentList?.length > 0 && (
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
                            <a>{agent?.name || "Not Available"}</a>
                            {agent?.is_verified_agent && (
                              <span title="Verified">
                                <i className="icon-img-check ms-1"></i>
                              </span>
                            )}

                            {/* <i className="icon-img-check ms-1"></i> */}
                          </h4>
                          <span className="badge badge-outline-secondary text-dark">
                          {translation?.properties || "Properties"} 
                          </span>
                        </div>
                        {agent?.phone && (
                          <p className="mb-2">
                            <i className="icon-feather-phone"></i> {agent.phone}
                          </p>
                        )}
                        {/* {agent?.email && ( */}
                        <p className="mb-2">
                          <i className="icon-feather-mail"></i> {agent.email || "agenet email"}
                        </p>
                        {/* // )} */}
                        <div className="d-flex card-group-btn">
                          {/* {agent?.phone && ( */}
                          {/* <a
                            href={`tel:${agent.phone}`}
                            className="btn btn-sm btn-outline-site me-2"
                          >
                            <i className="icon-feather-phone"></i>Call
                          </a> */}
                          {/* // )} */}
                          {showWhatsApp?.user_id !== agent?.user_id ? (
                            <>
                              <a className="btn btn-sm btn-outline-site me-2" role="button" onClick={() => handleWhatsappNo(agent?.user_id)}>
                                <i className="icon-brand-whatsapp"></i>  {translation?.whatsapp || "whatsapp"}
                              </a>
                            </>
                          ) : (
                            <>
                              <a className="btn btn-sm btn-outline-site me-2" role="button">
                                <i className="icon-brand-whatsapp"></i> {showWhatsApp?.number}
                              </a>
                            </>
                          )}
                          {agent?.user_id && (
                            <a
                              className="btn btn-primary ms-auto"
                              href={`/agent-details/${agent.user_id}`}
                            >
                              {translation?.view_profile || "View Profile"}
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
                  <p className='text-muted'>{translation?.no_record_founds || "No Record Founds"}</p>
                </div>
              </div>
            </>
          )}
          {currentPages < totalPages && (
            <button
              className="btn btn-primary btn-lg d-block mx-auto mt-4"
              onClick={() => handleLoadMoreClick(perPage + 1)}
            >
              {translation?.load_more || "Load More"}
            </button>
          )}

        </div>
      </aside>
    </MainLayout >
  );
};

export default Index;
