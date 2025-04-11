"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import AuthUser from '../Authentication/AuthUser'
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'

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

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 1440 },
      items: 4
    },
    desktop: {
      breakpoint: { max: 1440, min: 1024 },
      items: 3
    },
    tablet: {
      breakpoint: { max: 1024, min: 768 },
      items: 2
    },
    mobile: {
      breakpoint: { max: 768, min: 0 },
      items: 1
    }
  };

  return (
    <>
      {Array.isArray(verifiedAgentList) && verifiedAgentList.length > 0 && (
        <section className="section">
          <div className="container-fluid">
            <div className="section-headline text-center">
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

            <Carousel responsive={responsive} infinite autoPlay={false} arrows={true} keyBoardControl containerClass="py-4">
              {verifiedAgentList?.slice(0, 8)?.map((agent, i) => (
                <div className="p-2" key={i}>
                  <div className="card card-agent card-v-agent h-100">
                    <div className="card-body d-flex flex-column">
                      <div className="mb-3 text-center">
                        <img
                          src={agent?.image || "/assets/images/user.jpg"}
                          alt={agent?.name || ""}
                          height="120"
                          width="120"
                          className="rounded-circle"
                          loading="lazy"
                        />
                      </div>
                      <div className="mb-3 mx-auto">
                        <h4 className='text-center mb-1'>
                          <a role="button">{agent?.name || "Not available"}</a>
                        </h4>
                        <p className="text-center">{agent?.company_name || <span className="text-muted">Not available</span>}</p>
                        <p className="mb-1">
                          <i className="bi bi-calendar me-1"></i>
                          {translation?.operating_since || "Operating Since"}:{" "}
                          {agent?.operating_since || <span className="text-muted">Not available</span>}
                        </p>
                        <p className="mb-1">
                          <i className="bi bi-building me-1"></i>
                          {translation?.total_properties || "Total Properties:"}:{" "}
                          {(agent?.property_for_sell || 0) + (agent?.property_for_rent || 0)}
                        </p>
                        <p className="mb-1">
                          <i className="bi bi-pie-chart me-1"></i>
                          {translation?.total_projects || "Total Projects:"}:{" "}
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
                      <div className='mt-auto'>
                        <a
                          href={`/agent-details/${agent?.id}`}
                          className="btn btn-primary w-100"
                        >
                          {translation?.view_profile || "View Profile"}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Carousel>

            <div className='text-center mt-4'>
              <Link target='_blank' href={`/agent-list?page=1&is_verified_agent=true`} className="btn btn-outline-primary">
                {translation?.view_more || "View More"} <i className="bi bi-arrow-right"></i>
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  )
}

export default VerifiedAgent;
