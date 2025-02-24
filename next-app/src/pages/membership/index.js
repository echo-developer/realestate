"use client";
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Accordion } from "react-bootstrap";
import { useRouter } from "next/navigation";
import withAuth from "@/utils/withAuth";

const plans = [
  {
    plan_id: 1,
    name: "BASIC",
    price: { original: 95.89, discounted: 47.95 },
    features: [
      { label: "No. of Owners you can contact", basic: 15, gold: 30, platinum: 60 },
      { label: "Unlock Owner Properties reserved for Prime Members", basic: false, gold: true, platinum: true },
      { label: "Assistance from Relationship Manager", basic: false, gold: true, platinum: true },
      { label: "3-Day Early access to New Owner Properties", basic: false, gold: true, platinum: true },
      { label: "Validity (Days)", basic: 30, gold: 60, platinum: 90 },
      { label: "Prime Tag to get more attention from owner", basic: false, gold: true, platinum: true },
      { label: "Get home guaranteed or 100% refund", basic: false, gold: true, platinum: true },
    ],
  },
  {
    plan_id: 2,
    name: "GOLD",
    price: { original: 143.89, discounted: 71.94 },
    features: [
      { label: "No. of Owners you can contact", basic: 15, gold: 30, platinum: 60 },
      { label: "Unlock Owner Properties reserved for Prime Members", basic: false, gold: true, platinum: true },
      { label: "Assistance from Relationship Manager", basic: false, gold: true, platinum: true },
      { label: "3-Day Early access to New Owner Properties", basic: false, gold: true, platinum: true },
      { label: "Validity (Days)", basic: 30, gold: 60, platinum: 90 },
      { label: "Prime Tag to get more attention from owner", basic: false, gold: true, platinum: true },
      { label: "Get home guaranteed or 100% refund", basic: false, gold: true, platinum: true },
    ],
  },
  {
    plan_id: 3,
    name: "PLATINUM",
    price: { original: 191.88, discounted: 95.89 },
    features: [
      { label: "No. of Owners you can contact", basic: 15, gold: 30, platinum: 60 },
      { label: "Unlock Owner Properties reserved for Prime Members", basic: false, gold: true, platinum: true },
      { label: "Assistance from Relationship Manager", basic: false, gold: true, platinum: true },
      { label: "3-Day Early access to New Owner Properties", basic: false, gold: true, platinum: true },
      { label: "Validity (Days)", basic: 30, gold: 60, platinum: 90 },
      { label: "Prime Tag to get more attention from owner", basic: false, gold: true, platinum: true },
      { label: "Get home guaranteed or 100% refund", basic: false, gold: true, platinum: true },
    ],
  },
];

const steps = [
  {
    title: "Know the Value of Your Home",
    description: "Don't sell for less! Get the right price of your home",
    icon: "bar-chart-1.png",
  },
  {
    title: "Quick Steps to Post Online",
    description: "Checkout 5 easy steps to post and manage your property online",
    icon: "timing-1.png",
  },
  {
    title: "Sell/Rent Your Property",
    description: "Don't sell for less! Get the right price of your home",
    icon: "transaction-1.png",
  },
  {
    title: "Help Center",
    description: "How can I know the status or validity of my package?",
    icon: "technical-support-1.png",
  },
];

const faqs = [
  {
    question: "What is Gold Membership?",
    answer:
      "It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables.",
    id: "collapseOne",
  },
  {
    question: "How to avail membership benefits?",
    answer:
      "It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables.",
    id: "collapseTwo",
  },
  {
    question: "How does the On-call Assistant help?",
    answer:
      "It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables.",
    id: "collapseThree",
  },
  {
    question: "How does the On-call Assistant help?",
    answer:
      "It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables.",
    id: "collapseFour",
  },
  {
    question: "How does the On-call Assistant help?",
    answer:
      "It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables.",
    id: "collapseFive",
  },
];

const Membership = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const router = useRouter();

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    localStorage.setItem('planId', plan?.plan_id);
    localStorage.setItem('plan_price', plan?.price?.discounted);
    router.push('/membership/credit')

  };


  return (
    <MainLayout>
      <section className="section pb-0">
        <div className="container">
          <div className="ul-table-responsive membership">
            <div className="ul-table">
              <ul className="head">
                <li>&nbsp;</li>
                {plans?.map((plan) => (
                  <li
                    key={plan.name}
                    className={
                      plan.name.toLowerCase() === "gold"
                        ? "bg-warning"
                        : plan.name.toLowerCase() === "platinum"
                          ? "bg-primary text-white"
                          : "bg-purple text-white"
                    }
                  >
                    {plan.name}
                    {plan.name === "GOLD" && (
                      <span
                        className="material-icons-outlined"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        style={{ verticalAlign: "sub", cursor: "default" }}
                        data-bs-original-title="Recommended"
                      >
                        recommend
                      </span>
                    )}
                  </li>
                ))}
              </ul>
              {["PRICE", ...plans[0].features.map((f) => f.label)].map((header, index) => (
                <ul key={index}>
                  <li>{header}</li>
                  {plans.map((plan) => (
                    <li key={plan.name}>
                      {header === "PRICE" ? (
                        <>
                          <strike>AED{plan.price.original}</strike> <span className="badge bg-green ms-1">50% OFF</span>
                          <br />
                          <span className="text-price">AED{plan.price.discounted}</span>
                        </>
                      ) : (
                        <>
                          {plan.features.find((f) => f.label === header)?.[plan.name.toLowerCase()] === true ? (
                            <i className="material-icons-outlined text-green">check</i>
                          ) : plan.features.find((f) => f.label === header)?.[plan.name.toLowerCase()] === false ? (
                            <i className="material-icons-outlined text-danger">close</i>
                          ) : (
                            plan.features.find((f) => f.label === header)?.[plan.name.toLowerCase()]
                          )}
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              ))}
              <ul>
                <li>&nbsp;</li>
                {plans.map((plan) => (
                  <li key={plan.name}>
                    <a
                      onClick={() => handleSelectPlan(plan)}
                      className={`btn btn-sm btn-success btn-outline-${plan.name.toLowerCase()} w-75`}
                    >
                      SELECT
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>


          <div className="row">
            <article className="col-12 col-sm-6 col-md-4 col-lg-3">
              {plans?.map((plan) => {
                return (
                  <div className="card" key={plan.name}>
                    <div className="card-body">
                      <div
                        className={
                          plan.name.toLowerCase() === "gold"
                            ? "bg-warning"
                            : plan.name.toLowerCase() === "platinum"
                              ? "bg-primary text-white"
                              : "bg-purple text-white"
                        }
                      >
                        <h5>{plan.name}</h5>

                        {/* Only display "Recommended" for Gold plan */}
                        {plan.name === "GOLD" && (
                          <span
                            className="material-icons-outlined"
                            data-bs-toggle="tooltip"
                            data-bs-placement="top"
                            style={{ verticalAlign: "sub", cursor: "default" }}
                            data-bs-original-title="Recommended"
                          >
                            recommend
                          </span>
                        )}

                        {/* Feature List */}
                        <ul>
                          {/* Price */}
                          <li key="price">
                            <strike>AED{plan.price.original}</strike>
                            <span className="badge bg-green ms-1">50% OFF</span>
                            <br />
                            <span className="text-price">AED{plan.price.discounted}</span>
                          </li>

                          {/* Features */}
                          {plan.features.map((feature, index) => (
                            <li key={index}>
                              {feature.label}:
                              {feature[plan.name.toLowerCase()] === true ? (
                                <i className="material-icons-outlined text-green">check</i>
                              ) : feature[plan.name.toLowerCase()] === false ? (
                                <i className="material-icons-outlined text-danger">close</i>
                              ) : (
                                feature[plan.name.toLowerCase()]
                              )}
                            </li>
                          ))}
                        </ul>

                        {/* Select button for each plan */}
                        <div>
                          <a
                            onClick={() => handleSelectPlan(plan)}
                            className={`btn btn-sm btn-success btn-outline-${plan.name.toLowerCase()} w-100`}
                          >
                            SELECT
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

            </article>
          </div>


        </div>
      </section>



      <section className="section banner-box-4 mt-0 pb-0">
        <div className="container">
          <h3 className="text-primary mb-3">How it works</h3>
          <div className="row gx-3 -mb-3">
            {steps.map((step, index) => (
              <article key={index} className="col-lg-3 col-sm-6 col-12">
                <div className="card card-info">
                  <div className="card-body">
                    <img
                      src={`assets/images/icons/${step.icon}`}
                      alt="Icon"
                      height="46"
                      width="46"
                    />
                    <h4>{step.title}</h4>
                    <p>{step.description}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h3 className="text-primary mb-3">Frequently Asked Questions</h3>
          <Accordion flush>
            {faqs.map((faq, index) => (
              <Accordion.Item eventKey={index.toString()} key={index}>
                <Accordion.Header>{faq.question}</Accordion.Header>
                <Accordion.Body>
                  <small>{faq.answer}</small>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </div>
      </section>
    </MainLayout>
  );
};

export default withAuth(Membership);
