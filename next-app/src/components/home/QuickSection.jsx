"use client"
import React from 'react'
import Image from 'next/image'

const QuickSection = () => {
  return (
    <section className="section banner-box-4 pb-0">
      <div className="container-fluid">
        <div className="row gx-3">
          <article className="col-lg-3 col-sm-6 col-12">
            <div className="card card-info">
              <div className="card-body">
                <Image src="/assets/images/icons/bar-chart-1.png" alt="Icon" height={46} width={46} />
                <h4>Know the Value of Your Home</h4>
                <p>Don't sell for less! Get the right price of your home</p>
              </div>
            </div>
          </article>
          <article className="col-lg-3 col-sm-6 col-12">
            <div className="card card-info">
              <div className="card-body">
                <Image src="/assets/images/icons/timing-1.png" alt="Icon" height={46} width={46} />
                <h4>Quick Steps to Post Online</h4>
                <p>Checkout 5 easy steps to post and manage your property online</p>
              </div>
            </div>
          </article>
          <article className="col-lg-3 col-sm-6 col-12">
            <div className="card card-info">
              <div className="card-body">
                <Image src="/assets/images/icons/transaction-1.png" alt="Icon" height={46} width={46} />
                <h4>Sell/Rent Your Property</h4>
                <p>Don't sell for less! Get the right price of your home</p>
              </div>
            </div>
          </article>
          <article className="col-lg-3 col-sm-6 col-12">
            <div className="card card-info">
              <div className="card-body">
                <Image src="/assets/images/icons/technical-support-1.png" alt="Icon" height={46} width={46} />
                <h4>Help Center</h4>
                <p>How can I know the status or validity of my package?</p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}

export default QuickSection
