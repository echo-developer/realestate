"use client";
import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Accordion } from "react-bootstrap";
import { useRouter } from "next/navigation";
import withAuth from "@/utils/withAuth";
import useTranslation from "@/hooks/useTranslation";
import AuthUser from "@/components/Authentication/AuthUser";

const steps = [
  {
    title: "Know the Value of Your Home",
    description: "Get the best value! Ensure your home sells for top price.",
    icon: "bar-chart-1.png",
  },
  {
    title: "Quick Steps to Post Online",
    description: "Follow 5 simple steps to post and manage your property online.",
    icon: "timing-1.png",
  },
  {
    title: "Sell/Rent Your Property",
    description: "Maximize your home's value! Secure the highest price when selling.",
    icon: "transaction-1.png",
  },
  {
    title: "Help Center",
    description: "Check your package status using the tracking number or courier's website.",
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
  const { callApi } = AuthUser();
  const transaction = useTranslation();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [plans, setPlans] = useState([])
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getMembershipPlans = async () => {
      setLoading(true);
      try {
        const res = await callApi({
          api: `/membership_pakages`,
          method: "GET",
        })
        if (res && res?.status === 1) {
          const convertedData = convertPlans(res?.data);
          setPlans(convertedData);
        }
      } catch (error) {
        console.error(error?.message || "Something went wrong")
      } finally {
        setLoading(false);
      }
    }

    getMembershipPlans();
  }, [])


  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    localStorage.setItem('planId', plan?.plan_id);
    localStorage.setItem('plan_price', plan?.price?.discounted);
    router.push('/membership/credit')

  };

  const convertPlans = (data) => {
    return data?.map((plan) => ({
      plan_id: plan?.id,
      name: plan?.name?.toUpperCase(),
      price: {
        original: parseFloat(plan?.price) || 0,
        discounted: parseFloat(plan?.discounted_price) || 0,
      },
      features: [
        {
          label: "No. of Owners you can contact",
          basic: 15,
          gold: 30,
          platinum: 60,
        },
        {
          label: "Unlock Owner Properties reserved for Prime Members",
          basic: false,
          gold: plan?.slug === "gold" || plan?.slug === "platinum",
          platinum: plan?.slug === "platinum",
        },
        {
          label: "Assistance from Relationship Manager",
          basic: false,
          gold: plan?.slug === "gold" || plan?.slug === "platinum",
          platinum: plan?.slug === "platinum",
        },
        {
          label: "3-Day Early access to New Owner Properties",
          basic: false,
          gold: plan?.slug === "gold" || plan?.slug === "platinum",
          platinum: plan?.slug === "platinum",
        },
        {
          label: "Validity (Days)",
          basic: 30,
          gold: 60,
          platinum: 90,
        },
        {
          label: "Prime Tag to get more attention from owner",
          basic: false,
          gold: plan?.slug === "gold" || plan?.slug === "platinum",
          platinum: plan?.slug === "platinum",
        },
        {
          label: "Get home guaranteed or 100% refund",
          basic: false,
          gold: plan?.slug === "gold" || plan?.slug === "platinum",
          platinum: plan?.slug === "platinum",
        },
      ],
    })) || [];
  };


  return (
    <DashboardLayout>

      <div className="col-lg col-12">
        <div className="p-4">
          <h3 className="text-primary mb-3">{transaction?.membership || "Membership"}</h3>
          <div className="ul-table-responsive membership d-none d-lg-block">
            {loading && <PlansLoadingSkeleton />}
            {!loading && plans?.length > 0 && (
              <div className="ul-table">
              <ul className="head">
                <li>&nbsp;</li>
                {plans.map((plan) => (
                  <li
                    key={plan.name}
                    className={
                      plan?.name?.toLowerCase() === "gold"
                        ? "bg-warning"
                        : plan?.name?.toLowerCase() === "platinum"
                          ? "bg-primary text-white"
                          : "bg-purple text-white"
                    }
                  >
                    {plan?.name}
                    {plan?.name === "GOLD" && (
                      <span
                        className="material-icons-outlined"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        style={{ verticalAlign: "sub", cursor: "default" }}
                        data-bs-original-title="Recommended"
                      >
                      </span>
                    )}
                  </li>
                ))}
              </ul>
              {["PRICE", ...(plans[0]?.features?.map((f) => f.label) || [])]?.map((header, index) => (
                <ul key={index}>
                  <li>{header}</li>
                  {plans.map((plan) => (
                    <li key={plan?.name}>
                      {header === "PRICE" ? (
                        <>
                          <strike>
                            {transaction?.aed || "AED"}{plan?.price?.original}
                          </strike>
                          <span className="badge bg-green ms-1">
                            {transaction?.off || "50% OFF"}
                          </span>
                          <br />
                          <span className="text-price">
                            {transaction?.aed || "AED"}{plan?.price?.discounted}
                          </span>
                        </>
                      ) : (
                        <>
                          {plan?.features?.find((f) => f.label === header)?.[plan?.name?.toLowerCase()] === true ? (
                            <i className="material-icons-outlined text-green">check</i>
                          ) : plan?.features?.find((f) => f.label === header)?.[plan?.name?.toLowerCase()] === false ? (
                            <i className="material-icons-outlined text-danger">close</i>
                          ) : (
                            plan?.features?.find((f) => f.label === header)?.[plan?.name?.toLowerCase()] || "-"
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
                      className={`btn btn-sm btn-success btn-outline-${plan.name?.toLowerCase()} w-75`}
                    >
                      {transaction?.select || "SELECT"}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            )}
          </div>


          <div className="row d-lg-none">
            <article className="col-12 col-sm-6 col-md-4">
              {plans?.map((plan) => {
                return (
                  <div className="card border-0 mb-3" key={plan?.name}>
                    <div className="card-body p-0">
                      <ul className="list-group">
                        <li
                          className={`card-header ${plan?.name?.toLowerCase() === "gold"
                              ? "bg-warning"
                              : plan?.name?.toLowerCase() === "platinum"
                                ? "bg-primary text-white"
                                : "bg-purple text-white"
                            }`}
                        >
                          <h4 className="text-center">{plan.name}

                            {/* Only display "Recommended" for Gold plan */}
                            {plan?.name === "GOLD" && (
                              <span
                                className="material-icons-outlined ms-2"
                                data-bs-toggle="tooltip"
                                data-bs-placement="top"
                                style={{ cursor: "default" }}
                                data-bs-original-title="Recommended"
                              >
                                {transaction?.recommend || "recommend"}
                              </span>
                            )}</h4>
                        </li>

                        {/* Feature List */}

                        {/* Price */}
                        <li className="list-group-item d-flex justify-content-between align-items-center" key="price">
                          <strike>{transaction?.aed || "AED"}{plan?.price?.original}</strike>
                          <span className="badge bg-green ms-1">{transaction?.off || "50% OFF"}</span>
                          <span className="text-price">{transaction?.aed || "AED"}{plan?.price?.discounted}</span>
                        </li>

                        {/* Features */}
                        {plan.features.map((feature, index) => (
                          <li className="list-group-item d-flex justify-content-between align-items-center" key={index}>
                            <span>{feature.label}:</span>
                            {feature[plan?.name?.toLowerCase()] === true ? (
                              <i className="material-icons-outlined text-green">{transaction?.check || "check"}</i>
                            ) : feature[plan?.name?.toLowerCase()] === false ? (
                              <i className="material-icons-outlined text-danger"> {transaction?.close || "close"}</i>
                            ) : (
                              feature[plan?.name?.toLowerCase()]
                            )}
                          </li>
                        ))}
                        {/* Select button for each plan */}
                        <li className="list-group-item p-3">
                          <a
                            onClick={() => handleSelectPlan(plan)}
                            className={`btn btn-sm btn-outline-primary btn-outline-${plan?.name?.toLowerCase()} w-100`}
                          >
                            {transaction?.select || "SELECT"}
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                );
              })}

            </article>
          </div>

          <section className="section banner-box-4 mt-0 pb-0">
            <h3 className="text-primary mb-3"> {transaction?.how_it_works || "How it works"}</h3>
            <div className="row gx-3 -mb-3">
              {steps?.map((step, index) => (
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
          </section>

          <section className="section">
            <h3 className="text-primary mb-3">{transaction?.frequently_asked_questions || "Frequently Asked Questions"}</h3>
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

          </section>

        </div>
      </div>
    </DashboardLayout>
  );
};

const PlansLoadingSkeleton = () => {
  return (
    <div className="ul-table">
      <ul className="head">
        <li>&nbsp;</li>
        {Array(3).fill(null).map((_, index) => (
          <li
            key={index}
            className={`bg-${["purple", "warning", "primary"][index]} text-white`}
          >
            <div className="shimmer" style={{ height: "20px", width: "40px" }}></div>
          </li>
        ))}
      </ul>

      {Array(7).fill(null).map((_, rowIndex) => (
        <ul key={rowIndex}>
          <li>
            <div className="shimmer" style={{ height: "24px", width: "200px" }}></div>
          </li>
          {Array(3).fill(null).map((_, colIndex) => (
            <li key={colIndex}>
              <div className="shimmer" style={{ height: "20px", width: "40px" }}></div>
            </li>
          ))}
        </ul>
      ))}

      <ul>
        <li>&nbsp;</li>
        {Array(3).fill(null).map((_, index) => (
          <li key={index}>
            <div className="shimmer" style={{ height: "40px", width: "40px" }}></div>
          </li>
        ))}
      </ul>

      <style jsx>{`
        .shimmer {
          background: #f6f7f8;
          background-image: linear-gradient(
            to right,
            #f6f7f8 0%,
            #edeef1 20%,
            #f6f7f8 40%,
            #f6f7f8 100%
          );
          background-repeat: no-repeat;
          background-size: 200% 100%;
          display: inline-block;
          animation: shimmer 1.5s infinite linear;
          border-radius: 4px;
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </div>
  );
};




export default withAuth(Membership);





