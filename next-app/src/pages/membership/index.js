"use client";
import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Row, Col, Accordion } from "react-bootstrap";
import { useRouter } from "next/navigation";
import withAuth from "@/utils/withAuth";
import useTranslation from "@/hooks/useTranslation";
import AuthUser from "@/components/Authentication/AuthUser";
import MembershipBox from "@/components/membership/MembershipBox";
import { useAuth } from "@/context/AuthProvider";

const Membership = () => {
  const { callApi } = AuthUser();
  const { listingAllowed } = useAuth();
  const translation = useTranslation();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [plans, setPlans] = useState([])
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [mDetailsLoader, setMDetailsLoader] = useState(true);
  const [membershipDetails, setMembershipDetails] = useState(null);

  useEffect(() => {
    const getMembershipPlans = async () => {
      setLoading(true);
      try {
        const res = await callApi({
          api: `/membership_pakages`,
          method: "GET",
        })
        if (res && res?.status === 1) {
          // const convertedData = convertPlans(res?.data);
          // setPlans(convertedData);
          setPlans(res?.data);
        }
      } catch (error) {
        console.error(error?.message || "Something went wrong")
      } finally {
        setLoading(false);
      }
    }

    const getMembershipDetails = async () => {
      setMDetailsLoader(true);
      try {
        const res = await callApi({
          api: `/user_membership_details`,
          method: "GET"
        })

        if (res && res?.status == 1) {
          setMembershipDetails(res?.data || {});
        } else {
          setMembershipDetails(null);
        }
      } catch (error) {
        console.log(error.message || "Something went wrong")
      } finally {
        setMDetailsLoader(false);
      }
    }

    getMembershipPlans();
    getMembershipDetails();
  }, [])
  const faqs = [
    {
      question: `${translation?.what_is_gold_membership || "What is Gold Membership?"}
`,
      answer: `${translation?.collapse_info_text || "It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables."}`,
      id: "collapseOne",
    },
    {
      question: `${translation?.how_to_avail_membership_benefits || "How to avail membership benefits?"}
`,
      answer:
        `${translation?.collapse_info_text || "It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables."}
`,
      id: "collapseTwo",
    },
    {
      question: `${translation?.how_does_on_call_assistant_help || "How does the On-call Assistant help?"}
`,
      answer:
        `${translation?.collapse_info_text || "It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables."}
`,
      id: "collapseThree",
    },
    {
      question: `${translation?.how_does_on_call_assistant_help || "How does the On-call Assistant help?"}
`,
      answer:
        `${translation?.collapse_info_text || "It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables."}
`,
      id: "collapseFour",
    },
    {
      question: `${translation?.how_does_on_call_assistant_help || "How does the On-call Assistant help?"}
`,
      answer:
        `${translation?.collapse_info_text || "It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables."}
`,
      id: "collapseFive",
    },
  ];
  const steps = [
    {
      title: `${translation?.know_the_value_of_your_home || "Know the Value of Your Home"}
`,
      description: `${translation?.get_the_best_value || "Get the best value! Ensure your home sells for top price"}
`,
      icon: "bar-chart-1.png",
    },
    {
      title: `${translation?.quick_steps_to_post_online || "Quick Steps to Post Online"}
`,
      description: `${translation?.follow_5_simple_steps || "Follow 5 simple steps to post and manage your property online."}
`,
      icon: "timing-1.png",
    },
    {
      title: `${translation?.sell_rent_your_property || "Sell/Rent Your Property"}`,
      description: `${translation?.maximize_home_value || "Maximize your home's value! Secure the highest price when selling."}
`,
      icon: "transaction-1.png",
    },
    {
      title: `${translation?.help_center || "Help Center"}
`,
      description: `${translation?.check_package_status || "Check your package status using the tracking number or courier's website."}
`,
      icon: "technical-support-1.png",
    },
  ];
  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
    localStorage.setItem('planId', plan?.id);
    localStorage.setItem('plan_price', plan?.discounted_price || plan?.price);
    localStorage.setItem('plan_validate', plan?.validity_days);
    localStorage.setItem('plan_name', plan?.plan_name);

    router.push('/membership/credit')

    console.log(plan)
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

        {mDetailsLoader && (
          <>
            <div className="container mt-4">
              <div className="card shadow-sm">
                <div className="card-header bg-white border-bottom">
                  <h5 className="mb-0 placeholder-glow">
                    <span className="placeholder col-6"></span>
                  </h5>
                </div>
                <div className="card-body p-3">
                  <div className="row mb-2">
                    <div className="col-md-6">
                      <strong className="placeholder-glow">
                        <span className="placeholder col-4"></span>
                      </strong>
                      <span className="placeholder-glow ms-2">
                        <span className="placeholder col-4"></span>
                      </span>
                    </div>
                    <div className="col-md-6">
                      <strong className="placeholder-glow">
                        <span className="placeholder col-5"></span>
                      </strong>
                      <span className="placeholder-glow ms-2">
                        <span className="placeholder col-5"></span>
                      </span>
                    </div>
                  </div>

                  <div className="row mb-2">
                    <div className="col-md-6">
                      <strong className="placeholder-glow">
                        <span className="placeholder col-5"></span>
                      </strong>
                      <span className="placeholder-glow ms-2">
                        <span className="placeholder col-5"></span>
                      </span>
                    </div>
                    <div className="col-md-6">
                      <strong className="placeholder-glow">
                        <span className="placeholder col-3"></span>
                      </strong>
                      <span className="placeholder-glow ms-2">
                        <span className="placeholder col-3"></span>
                      </span>
                    </div>
                  </div>

                  <div className="row mb-2">
                    <div className="col-md-6">
                      <strong className="placeholder-glow">
                        <span className="placeholder col-4"></span>
                      </strong>
                      <span className="placeholder-glow ms-2">
                        <span className="placeholder col-4"></span>
                      </span>
                    </div>
                    <div className="col-md-6">
                      <strong className="placeholder-glow">
                        <span className="placeholder col-4"></span>
                      </strong>
                      <span className="placeholder-glow ms-2">
                        <span className="placeholder col-4"></span>
                      </span>
                    </div>
                  </div>

                  <div className="row mb-2">
                    <div className="col-md-6">
                      <strong className="placeholder-glow">
                        <span className="placeholder col-2"></span>
                      </strong>
                      <span className="placeholder-glow ms-2">
                        <span className="placeholder col-2"></span>
                      </span>
                    </div>
                    <div className="col-md-6">
                      <strong className="placeholder-glow">
                        <span className="placeholder col-4"></span>
                      </strong>
                      <span className="placeholder-glow ms-2">
                        <span className="placeholder col-4"></span>
                      </span>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <strong className="placeholder-glow">
                        <span className="placeholder col-3"></span>
                      </strong>
                      <span className="placeholder-glow ms-2">
                        <span className="placeholder col-3"></span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </>
        )}

        {membershipDetails && (
          <>
            <div className="container mt-4">
              <div className="card shadow-sm">
                <div className="card-header bg-white border-bottom">
                  <h5 className="mb-0">Your Current Membership Plan</h5>
                </div>
                <div className="card-body p-3">
                  <div className="row mb-2">
                    <div className="col-md-6">
                      <strong>Plan Name:</strong> <span className="text-muted">{membershipDetails?.plan_name}</span>
                    </div>
                    <div className="col-md-6">
                      <strong>Subscription Date:</strong> <span className="text-muted">{membershipDetails?.subcription_date}</span>
                    </div>
                  </div>
                  <div className="row mb-2">
                    <div className="col-md-6">
                      <strong>Expire Date:</strong> <span className="text-muted">{membershipDetails?.expire_date}</span>
                    </div>
                    <div className="col-md-6">
                      <strong>Relationship Manager:</strong>
                      {membershipDetails?.relationship_manager == "Y" ? (
                        <span className="badge bg-success ms-2">Available</span>
                      ) : (
                        <span className="badge bg-danger ms-2">Not Available</span>
                      )}

                    </div>
                  </div>
                  <div className="row mb-2">
                    <div className="col-md-6">
                      <strong>Leads:</strong> <span className="text-muted">
                        {membershipDetails?.leads || 0}
                      </span>
                    </div>
                    <div className="col-md-6">
                      <strong>Listings Allowed:</strong> <span className="text-muted">{listingAllowed || 0}/{membershipDetails?.listings_allowed}</span>
                    </div>
                  </div>
                  <div className="row mb-2">
                    <div className="col-md-6">
                      <strong>Verified Badge:</strong>
                      {membershipDetails?.verified_badge == 'Y' ? (
                        <span className="badge bg-success ms-2">Yes</span>
                      ) : (
                        <span className="badge bg-danger ms-2">No</span>
                      )}
                    </div>
                    <div className="col-md-6">
                      <strong>Listing Visibility:</strong> <span className="text-muted">{membershipDetails?.listing_visibility}</span>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <strong>Social Media Promotion:</strong>
                      {membershipDetails?.social_media_promotion ? (
                        <span className="badge bg-success ms-2">Enabled</span>
                      ) : (
                        <span className="badge bg-danger ms-2">Disabled</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {!mDetailsLoader && !membershipDetails && (
          <>
            <div className="container mt-4">
              <div className="card shadow-sm ">
                <div className="card-header bg-white border-bottom">
                  <h5 className="mb-0 text-dark font-weight-bold">Your Current Membership Plan</h5>
                </div>
                <div className="card-body text-center p-5">
                  <p className="mb-4 text-muted">
                    You currently don't have any active membership plans.
                  </p>
                </div>
              </div>
            </div>

          </>
        )}
        <div className="page-fluid-container">
          <div className="pageTitle">
            <h1>
              {translation?.membership || "Membership"}
            </h1>
          </div>
          {loading && (<PlansLoadingSkeleton />)}
          {plans?.length > 0 && <MembershipBox data={plans} handleSelectPlan={handleSelectPlan} />}


          <section className="section banner-box-4 mt-0 pb-0">
            <h4 className="text-primary mb-3"> {translation?.how_it_works || "How it works"}</h4>
            <Row className="gx-3 -mb-3">
              {steps?.map((step, index) => (
                <Col xl={3} sm={6} xs={12} key={index}>
                  <div className="card card-info">
                    <div className="card-body">
                      <img
                        src={`/assets/images/icons/${step.icon}`}
                        alt="Icon"
                        height="46"
                        width="46"
                      />
                      <h4>{step.title}</h4>
                      <p>{step.description}</p>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </section>

          <section className="section">
            <h4 className="text-primary mb-3">{translation?.frequently_asked_questions || "Frequently Asked Questions"}</h4>
            <Accordion flush>
              {faqs.map((faq, index) => (
                <Accordion.Item eventKey={index.toString()} key={index}>
                  <Accordion.Header>{faq.question}</Accordion.Header>
                  <Accordion.Body>
                    <p>{faq.answer}</p>
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
    <div className="pricing-table-shimmer">
      {/* Header row shimmer */}
      <div className="shimmer-row header">
        <div className="shimmer-cell"></div>
        <div className="shimmer-cell"></div>
        <div className="shimmer-cell"></div>
        <div className="shimmer-cell"></div>
        <div className="shimmer-cell"></div>
      </div>

      {/* Price row shimmer */}
      <div className="shimmer-row">
        <div className="shimmer-cell"></div>
        <div className="shimmer-cell"></div>
        <div className="shimmer-cell"></div>
        <div className="shimmer-cell"></div>
        <div className="shimmer-cell"></div>
      </div>

      {/* Feature rows shimmer */}
      {[...Array(6)].map((_, i) => (
        <div key={i} className="shimmer-row">
          <div className="shimmer-cell"></div>
          <div className="shimmer-cell"></div>
          <div className="shimmer-cell"></div>
          <div className="shimmer-cell"></div>
          <div className="shimmer-cell"></div>
        </div>
      ))}

      {/* Button row shimmer */}
      <div className="shimmer-row buttons">
        <div className="shimmer-button"></div>
        <div className="shimmer-button"></div>
        <div className="shimmer-button"></div>
        <div className="shimmer-button"></div>
      </div>

      <style jsx>{`
        .pricing-table-shimmer {
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
          overflow: hidden;
        }
        
        .shimmer-row {
          display: flex;
          padding: 12px 0;
          border-bottom: 1px solid #eee;
        }
        
        .shimmer-row.header {
          padding-bottom: 20px;
        }
        
        .shimmer-row.buttons {
          justify-content: space-around;
          padding: 20px 0;
          border: none;
        }
        
        .shimmer-cell {
          flex: 1;
          height: 20px;
          margin: 0 8px;
          background: #f6f7f8;
          background-image: linear-gradient(
            to right,
            #f6f7f8 0%,
            #edeef1 20%,
            #f6f7f8 40%,
            #f6f7f8 100%
          );
          background-size: 800px 104px;
          animation: shimmer 1.5s infinite linear;
          border-radius: 4px;
        }
        
        .shimmer-cell:first-child {
          flex: 2;
          max-width: 200px;
        }
        
        .shimmer-button {
          width: 100px;
          height: 40px;
          background: #f6f7f8;
          background-image: linear-gradient(
            to right,
            #f6f7f8 0%,
            #edeef1 20%,
            #f6f7f8 40%,
            #f6f7f8 100%
          );
          background-size: 800px 104px;
          animation: shimmer 1.5s infinite linear;
          border-radius: 20px;
        }
        
        @keyframes shimmer {
          0% {
            background-position: -400px 0;
          }
          100% {
            background-position: 400px 0;
          }
        }
      `}</style>
    </div>
  );
};




export default withAuth(Membership);





