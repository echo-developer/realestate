import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import useTranslation from '../../hooks/useTranslation'
import AuthUser from '../Authentication/AuthUser'


const VerifiedAgent = () => {
  const translation = useTranslation();
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
    <section className="section">
      <div className="container-fluid">
        <div className="row align-items-center">
          <aside className="col-md">
            <div className="section-headline">
              <h5><img src="/assets/images/icons/house-sm-1.png" alt="Icon" height="20" width="20" /> {translation?.top_most || "Top Most"}</h5>
              <h3>{translation?.verified_agents_kolkata || "Varified Agents in Kolkata"}</h3>
              <p>{translation?.top_agents_description || "Top agents are experienced professionals offering expert guidance, market insights, and personalized services to help you find the perfect property"}</p>
            </div>
          </aside>
          <aside className="col-md-auto">
            <Link target='_blank' href="/agent-list" className="btn btn-link">{translation?.view_more || "View More"} <i className="bi bi-arrow-right"></i></Link>
          </aside>
        </div>

        <div className="row gx-3">
          {verifiedAgentList?.length > 0 && verifiedAgentList?.map((agent, i) => {
            return (
              <article className="col-xl-3 col-lg-4 col-sm-6 col-12" key={i}>
                <div className="card card-v-agent">
                  <div className="card-body">
                    <div className="d-flex">
                      <img src="/assets/images/favicon.png" alt="Home" height="32" width="32" className="icon" />
                      <div className="flex-grow-1 ps-3">
                        <h4><a role="button">{agent?.company_name || "Not available"} </a></h4>
                        <p className="mb-1">{translation?.operating_since || "Operating Since"} {agent?.operating_since || "Not available"}</p>
                        <p className="mb-2">{translation?.total_properties || "Total Properties:"} {agent?.total_properties || 0}</p>
                        <p className="mb-2">{translation?.total_projects || "Total Projects:"} {agent?.total_projects || 0}</p>
                        <div className="user-details">
                          <div className="user-avatar"> <img src={agent?.image || "/assets/images/user.jpg"} alt="" height="32" width="32" className="rounded-circle" /> </div>
                          <div className="user-name">
                            <h5 className="mb-0">{agent?.name || "Not available"}</h5>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-footer">
                    <h4 className="mb-0"><span className="text-primary">{agent?.property_for_sale || 0}</span> {translation?.properties_for_sale || "Properties For Sale"}</h4>
                  </div>
                </div>
              </article>
            )
          })}

        </div>
      </div>
    </section>
  )
}

export default VerifiedAgent
