"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import AuthUser from '../Authentication/AuthUser'


const VerifiedAgent = ({ translation }) => {
  const { callApi } = AuthUser();
  const [verifiedAgentList, setVerifiedAgentList] = useState([]);

  useEffect(() => {
    const getVerifiedAgentList = async () => {
      try {
        const res = await callApi({
          api: "/verified_agents",
          method: "GET"
        })

        if (res && res?.status === 1) {
          setVerifiedAgentList(res?.data);
        }
      } catch (error) {
        console.error(error?.message || "Something went wrong")
      }
    }

    getVerifiedAgentList();
  }, [])

  return (
    <>
      {Array.isArray(verifiedAgentList) && verifiedAgentList.length > 0 && (
        <section className="section">
          <div className="container-fluid">            
            <div className="section-headline">
              <h5>
                <img src="/assets/images/icons/house-sm-1.png" alt="Icon" height="20" width="20" loading="lazy" />
                {translation?.top_most || "Top Most"}
              </h5>
              <h3>{translation?.verified_agents_kolkata || "Verified Agents in Kolkata"}</h3>
              <p>
                {translation?.top_agents_description ||
                  "Top agents are experienced professionals offering expert guidance, market insights, and personalized services to help you find the perfect property"}
              </p>
            </div>              

            <div className="row gx-3">
              {verifiedAgentList?.slice(0, 4)?.map((agent, i) => (
                <article className="col-xl-3 col-lg-4 col-sm-6 col-12" key={i}>
                  <div className="card card-agent card-v-agent">
                    <div className="card-body d-flex flex-column">
                      <div className="d-flex mb-3">
                        {/* Removed the home icon */}
                        <div className="flex-shrink-0">
                          <img
                            src={agent?.image || "/assets/images/user.jpg"}
                            alt={agent?.name || ""}
                            height="100"
                            width="100"
                            className="rounded-circle"
                            loading="lazy"
                          />
                        </div>
                        <div className="flex-grow-1 ps-3">                        
                          <h4>
                            <a role="button">
                            {agent?.name || "Not available"}
                            </a>
                          </h4>
                          <h5 className="text-muted">{agent?.company_name || "Not available"}</h5>
                          <p className="mb-1">
                            <i className="bi bi-calendar me-1"></i>
                            {translation?.operating_since || "Operating Since"}{" "}
                            {agent?.operating_since || "Not available"}
                          </p>

                          {/* Combined Properties */}
                          <p className="mb-1">
                            <i className="bi bi-building me-1"></i>
                            {translation?.total_properties || "Total Properties:"}{" "}
                            {(agent?.property_for_sell || 0) + (agent?.property_for_rent || 0)}
                          </p>

                          {/* Combined Projects */}
                          <p className="mb-1">
                          <i className="bi bi-pie-chart me-1"></i>
                            {translation?.total_projects || "Total Projects:"}{" "}
                            {(agent?.project_for_sell || 0) + (agent?.project_for_rent || 0)}
                          </p>

                          <p className="mb-1">
                            <i className="icon-feather-mail me-1"></i>
                            {agent?.bussiness_email || "Email not available"}
                          </p>
                          <p className="mb-2">
                            <i className="bi bi-geo-alt me-1"></i>
                            {agent?.city_name || agent?.address || "City not available"}
                          </p>
                          
                        </div>
                      </div>
                      <div className="mt-auto">
                        <a
                          href={`/agent-details/${agent?.id}`}
                          className="btn btn-outline-primary w-100"
                        >
                          {translation?.view_details || "View Details"}
                        </a>
                      </div>
                    </div>
                    {/* Removed Properties For Sale footer */}
                  </div>
                </article>

              ))}
            </div>
            <div className='text-center'>
              <Link target='_blank' href={`/agent-list?page=1&is_verified_agent=true`} className="btn btn-primary">
                {translation?.view_more || "View More"} <i className="bi bi-arrow-right"></i>
              </Link>
            </div>
            
          </div>
        </section>
      )}

    </>

  )
}

export default VerifiedAgent
