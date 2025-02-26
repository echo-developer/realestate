import React from 'react'
import Link from 'next/link'
import useTranslation from '../../hooks/useTranslation'


const VerifiedAgent = () => {
  const translation = useTranslation();

  return (
   <section className="section">
  <div className="container-fluid">
    <div className="row align-items-center">
      <aside className="col-md">
        <div className="section-headline">
          <h5><img src="/assets/images/icons/house-sm-1.png" alt="Icon" height="20" width="20"/> {translation?.top_most || "Top Most"}</h5>
          <h3>{translation?.verified_agents_kolkata || "Varified Agents in Kolkata"}</h3>
          <p>{translation?.top_agents_description || "Top agents are experienced professionals offering expert guidance, market insights, and personalized services to help you find the perfect property"}</p>
        </div>
      </aside>
      <aside className="col-md-auto">
        <Link target='_blank' href="/agent-list" className="btn btn-link">{translation?.view_more || "View More"} <i className="bi bi-arrow-right"></i></Link>
      </aside>
    </div>

    <div className="row gx-3">
    <article className="col-xl-3 col-lg-4 col-sm-6 col-12">
        <div className="card card-v-agent">
          <div className="card-body">
            <div className="d-flex">
              <img src="/assets/images/favicon.png" alt="Home" height="32" width="32" className="icon"/>
              <div className="flex-grow-1 ps-3">
                <h4><a href="">{translation?.dervin_projects || "Dervin Projects"} </a></h4>
                <p className="mb-1">{translation?.operating_since || "Operating Since: 2006"}</p>
                <p className="mb-2">{translation?.buyer_served || "Buyer Served: 4500+"}</p>
                <div className="user-details">
                  <div className="user-avatar"> <img src="/assets/images/agents/agent-4.jpg" alt="" height="32" width="32" className="rounded-circle"/> </div>
                  <div className="user-name">
                    <h5 className="mb-0">{translation?.masic_decoda || "Masic Decoda"}</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card-footer">
            <h4 className="mb-0"><span className="text-primary">136</span> {translation?.properties_for_sale || "Properties For Sale"}</h4>
          </div>
        </div>
      </article>
      <article className="col-xl-3 col-lg-4 col-sm-6 col-12">
        <div className="card card-v-agent">
          <div className="card-body">
            <div className="d-flex">
              <img src="/assets/images/favicon.png" alt="Home" height="32" width="32" className="icon"/>
              <div className="flex-grow-1 ps-3">
                <h4><a href=""> {translation?.surya_projects || "Surya Projects"}</a></h4>
                <p className="mb-1">{translation?.operating_since || "Operating Since: 2006"}</p>
                <p className="mb-2">{translation?.buyer_served || "Buyer Served: 4500+"}</p>
                <div className="user-details">
                  <div className="user-avatar"> <img src="/assets/images/agents/agent-1.jpg" alt="" height="32" width="32" className="rounded-circle"/> </div>
                  <div className="user-name">
                    <h5 className="mb-0">{translation?.lama_sant || "Lama Sant"}</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card-footer">
            <h4 className="mb-0"><span className="text-primary">102</span> {translation?.properties_for_sale || "Properties For Sale"}</h4>
          </div>
        </div>
      </article>
      <article className="col-xl-3 col-lg-4 col-sm-6 col-12">
        <div className="card card-v-agent">
          <div className="card-body">
            <div className="d-flex">
              <img src="/assets/images/favicon.png" alt="Home" height="32" width="32" className="icon"/>
              <div className="flex-grow-1 ps-3">
                <h4><a href="">{translation?.namo_projects || "Namo Projects"}</a></h4>
                <p className="mb-1">{translation?.operating_since || "Operating Since: 2006"}</p>
                <p className="mb-2">{translation?.buyer_served || "Buyer Served: 4500+"}</p>
                <div className="user-details">
                  <div className="user-avatar"> <img src="/assets/images/agents/agent-4.jpg" alt="" height="32" width="32" className="rounded-circle"/> </div>
                  <div className="user-name">
                    <h5 className="mb-0">{translation?.macc_millan || "Macc Millan"}</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card-footer">
            <h4 className="mb-0"><span className="text-primary">96</span> {translation?.properties_for_sale || "Properties For Sale"}</h4>
          </div>
        </div>
      </article>
      <article className="col-xl-3 col-lg-4 col-sm-6 col-12">
        <div className="card card-v-agent">
          <div className="card-body">
            <div className="d-flex">
              <img src="/assets/images/favicon.png" alt="Home" height="32" width="32" className="icon"/>
              <div className="flex-grow-1 ps-3">
                <h4><a href="">{translation?.mittal_projects || "Mittal Projects"}</a></h4>
                <p className="mb-1">{translation?.operating_since || "Operating Since: 2006"}</p>
                <p className="mb-2">{translation?.buyer_served || "Buyer Served: 4500+"}</p>
                <div className="user-details">
                  <div className="user-avatar"> <img src="/assets/images/agents/agent-7.jpg" alt="" height="32" width="32" className="rounded-circle"/> </div>
                  <div className="user-name">
                    <h5 className="mb-0">{translation?.suchi_sujan || "Suchi Sujan"}</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card-footer">
            <h4 className="mb-0"><span className="text-primary">320</span> {translation?.properties_for_sale || "Properties For Sale"}</h4>
          </div>
        </div>
      </article>

    </div>
  </div>
</section>
  )
}

export default VerifiedAgent
