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
          <h3>{translation?.top_most || "Top Most"}Varified Agents in Kolkata</h3>
          <p>Top agents are experienced professionals offering expert guidance, market insights, and personalized services to help you find the perfect property</p>
        </div>
      </aside>
      <aside className="col-md-auto">
        <Link target='_blank' href="/agent-list" className="btn btn-link">View More <i className="bi bi-arrow-right"></i></Link>
      </aside>
    </div>

    <div className="row gx-3">
    <article className="col-xl-3 col-lg-4 col-sm-6 col-12">
        <div className="card card-v-agent">
          <div className="card-body">
            <div className="d-flex">
              <img src="/assets/images/favicon.png" alt="Home" height="32" width="32" className="icon"/>
              <div className="flex-grow-1 ps-3">
                <h4><a href="">Dervin Projects</a></h4>
                <p className="mb-1">Operating Since: 2006</p>
                <p className="mb-2">Buyer Served: 4500+</p>
                <div className="user-details">
                  <div className="user-avatar"> <img src="/assets/images/agents/agent-4.jpg" alt="" height="32" width="32" className="rounded-circle"/> </div>
                  <div className="user-name">
                    <h5 className="mb-0">Masic Decoda</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card-footer">
            <h4 className="mb-0"><span className="text-primary">136</span> Properties For Sale</h4>
          </div>
        </div>
      </article>
      <article className="col-xl-3 col-lg-4 col-sm-6 col-12">
        <div className="card card-v-agent">
          <div className="card-body">
            <div className="d-flex">
              <img src="/assets/images/favicon.png" alt="Home" height="32" width="32" className="icon"/>
              <div className="flex-grow-1 ps-3">
                <h4><a href="">Surya Projects</a></h4>
                <p className="mb-1">Operating Since: 1986</p>
                <p className="mb-2">Buyer Served: 8000+</p>
                <div className="user-details">
                  <div className="user-avatar"> <img src="/assets/images/agents/agent-1.jpg" alt="" height="32" width="32" className="rounded-circle"/> </div>
                  <div className="user-name">
                    <h5 className="mb-0">Lama Sant</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card-footer">
            <h4 className="mb-0"><span className="text-primary">102</span> Properties For Sale</h4>
          </div>
        </div>
      </article>
      <article className="col-xl-3 col-lg-4 col-sm-6 col-12">
        <div className="card card-v-agent">
          <div className="card-body">
            <div className="d-flex">
              <img src="/assets/images/favicon.png" alt="Home" height="32" width="32" className="icon"/>
              <div className="flex-grow-1 ps-3">
                <h4><a href="">Namo Projects</a></h4>
                <p className="mb-1">Operating Since: 2003</p>
                <p className="mb-2">Buyer Served: 6500+</p>
                <div className="user-details">
                  <div className="user-avatar"> <img src="/assets/images/agents/agent-4.jpg" alt="" height="32" width="32" className="rounded-circle"/> </div>
                  <div className="user-name">
                    <h5 className="mb-0">Macc Millan</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card-footer">
            <h4 className="mb-0"><span className="text-primary">96</span> Properties For Sale</h4>
          </div>
        </div>
      </article>
      <article className="col-xl-3 col-lg-4 col-sm-6 col-12">
        <div className="card card-v-agent">
          <div className="card-body">
            <div className="d-flex">
              <img src="/assets/images/favicon.png" alt="Home" height="32" width="32" className="icon"/>
              <div className="flex-grow-1 ps-3">
                <h4><a href="">Mittal Projects</a></h4>
                <p className="mb-1">Operating Since: 1999</p>
                <p className="mb-2">Buyer Served: 3500+</p>
                <div className="user-details">
                  <div className="user-avatar"> <img src="/assets/images/agents/agent-7.jpg" alt="" height="32" width="32" className="rounded-circle"/> </div>
                  <div className="user-name">
                    <h5 className="mb-0">Suchi Sujan</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card-footer">
            <h4 className="mb-0"><span className="text-primary">320</span> Properties For Sale</h4>
          </div>
        </div>
      </article>

    </div>
  </div>
</section>
  )
}

export default VerifiedAgent
