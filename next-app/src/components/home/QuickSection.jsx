"use client"
import React from 'react'
import Image from 'next/image'

const QuickSection = ({translation}) => {

  return (
    <section className="section banner-box-4 pb-0">
      <div className="container-fluid">
        <div className="row gx-3">
          <article className="col-lg-3 col-sm-6 col-12">
            <div className="card card-info">
              <div className="card-body">
                <Image src="/assets/images/icons/bar-chart-1.png" alt="Icon" height={46} width={46} loading="lazy"/>
                <h4>{translation?.know_value_of_home || "Know the Value of Your Home"}</h4>
                <p>{translation?.dont_sell_for_less || "Don't sell for less! Get the right price of your home"}</p>
              </div>
            </div>
          </article>
          <article className="col-lg-3 col-sm-6 col-12">
            <div className="card card-info">
              <div className="card-body">
                <Image src="/assets/images/icons/timing-1.png" alt="Icon" height={46} width={46} loading="lazy"/>
                <h4>{translation?.quick_steps_post_online || "Quick Steps to Post Online"}</h4>
                <p>{translation?.checkout_easy_steps || "Follow 5 simple steps to post and manage your property online."}</p>
              </div>
            </div>
          </article>
          <article className="col-lg-3 col-sm-6 col-12">
            <div className="card card-info">
              <div className="card-body">
                <Image src="/assets/images/icons/transaction-1.png" alt="Icon" height={46} width={46} loading="lazy"/>
                <h4>{translation?.sell_rent_property || "Sell/Rent Your Property"}</h4>
                <p>{translation?.dont_sell_for_less || "Maximize your home's value! Secure the highest price when selling."}</p>
              </div>
            </div>
          </article>
          <article className="col-lg-3 col-sm-6 col-12">
            <div className="card card-info">
              <div className="card-body">
                <Image src="/assets/images/icons/technical-support-1.png" alt="Icon" height={46} width={46} loading="lazy"/>
                <h4>{translation?.help_center || "Help Center"}</h4>
                <p>{translation?.know_status_validity || "Check your package status using the tracking number or courier's website."}</p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}

export default QuickSection
