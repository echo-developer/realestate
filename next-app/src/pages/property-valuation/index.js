"use client"
import React, { useState } from "react"
import { Container, Row, Col, Card, Form, Button, ListGroup, FloatingLabel } from "react-bootstrap"
import { CheckCircle, Check, ArrowRight } from "lucide-react"
import Image from "next/image"
import MainLayout from "@/components/layout/MainLayout"
import useTranslation from "@/hooks/useTranslation"
import PropertyValuationForm from "@/components/property/PropertyValuationForm"

export default function PropertyValuation() {
  const [activeTab, setActiveTab] = useState("role")
  const translation = useTranslation();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  // Content mapping for the tabs
  const tabContent = {
    role: {
      title: `${translation?.property_valuer_role || "What's the role of Property Valuers?"}`
      ,
      content:
        `${translation?.property_valuer_role_answer || "Property Valuers are experts who carry out a detailed inspection of a property and then present a report with an estimation of the property’s value."}
`,
      image: "/assets/images/mortgage-1.jpg",
    },
    help: {
      title: `${translation?.how_valuer_helps || "How does a Property Valuer help?"}
`,
      content:
        `${translation?.how_valuer_helps_answer || "A property valuer helps in assessing the market value of a property based on various factors like location, condition, and market trends."}
`,
      image: "/assets/images/twostory-house.jpg",
    },
    when: {
      title: `${translation?.when_to_avail_valuation || "When should you avail Property Valuation?"}
`,
      content:
        `${translation?.when_to_avail_valuation_answer || "Property valuation should be availed before buying, selling, or mortgaging a property to ensure a fair market value."}
`,
      image: "/assets/images/mortgage-1.jpg",
    },
    process: {
      title: `${translation?.valuation_process || "What is the process of Property Valuation?"}
`,
      content:
        `${translation?.valuation_process_answer || "The valuation process includes an inspection, market analysis, and final report preparation detailing the estimated value."}
`,
      image: "/assets/images/mortgage-1.jpg",
    },
    report: {
      title: `${translation?.valuation_report_meaning || "What is a Property Valuation report and how is it important?"}
`,
      content:
        `${translation?.valuation_report_meaning_answer || "A valuation report provides a detailed analysis of a property’s worth, helping buyers and sellers make informed decisions."}
`,
      image: "/assets/images/mortgage-1.jpg",
    },
  }

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="section bg-primary-subtle">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <h1 className="display-5 fw-bold mb-3">{translation?.all_about_valuation || 'All You Need to Know About Property Valuation'}
              </h1>
              <p className="lead mb-4">{translation?.discover_real_value || 'Discover the real value of your property'}
              </p>
              <p className="text-muted mb-4">{translation?.valuation_range || 'Get ₹5 crore to ₹50 lakh for your property'}
              </p>
              <Button variant="primary" onClick={() => setShow(true)}>
                {translation?.request_valuation || 'Request Valuation'}
                <ArrowRight className="ms-2" size={20} />
              </Button>
            </Col>
            <Col md={6} className="d-none d-md-block">
              <Image
                src={`/assets/images/young-man-with-mortgage.png`}
                alt="Property Valuation Illustration"
                width={600}
                height={600}
                className="img-fluid"
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Benefits Section */}
      <section className="section">
        <Container>
          <Row className="-mb-3">
            <Col md={6}>
              <Card className="mb-3">
                <Card.Body>
                  <h3>{translation?.benefits_for_buyers || 'Benefits for Buyers'}</h3>
                  <ListGroup variant="flush">
                    <ListGroup.Item className="d-flex align-items-center border-0 mb-2 p-0">
                      <Check className="text-success me-2 flex-shrink-0" size={20} />
                      <span>{translation?.buyers_know_price || 'Know the right price before making an offer'}
                      </span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex align-items-center border-0 mb-2 p-0">
                      <Check className="text-success me-2 flex-shrink-0" size={20} />
                      <span>{translation?.buyers_negotiate_better || 'Negotiate better with the seller'}
                      </span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex align-items-center border-0 mb-2 p-0">
                      <Check className="text-success me-2 flex-shrink-0" size={20} />
                      <span>{translation?.buyers_know_price || 'Know the right price before making an offer'}
                      </span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex align-items-center border-0 p-0">
                      <Check className="text-success me-2 flex-shrink-0" size={20} />
                      <span>{translation?.buyers_negotiate_better || 'Negotiate better with the seller'}
                      </span>
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="mb-3">
                <Card.Body>
                  <h3>{translation?.benefits_for_sellers || 'Benefits for Sellers'}</h3>
                  <ListGroup variant="flush">
                    <ListGroup.Item className="d-flex align-items-center border-0 mb-2 p-0">
                      <Check className="text-success me-2 flex-shrink-0" size={20} />
                      <span>{translation?.sellers_right_price || 'Get the right price for your property'}
                      </span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex align-items-center border-0 mb-2 p-0">
                      <Check className="text-success me-2 flex-shrink-0" size={20} />
                      <span>{translation?.sellers_attract_buyers || 'Attract genuine buyers with the right price'}
                      </span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex align-items-center border-0 mb-2 p-0">
                      <Check className="text-success me-2 flex-shrink-0" size={20} />
                      <span>{translation?.sellers_right_price || 'Get the right price for your property'}
                      </span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex align-items-center border-0 p-0">
                      <Check className="text-success me-2 flex-shrink-0" size={20} />
                      <span>{translation?.sellers_attract_buyers || 'Attract genuine buyers with the right price'}
                      </span>
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Pricing Section */}
      <section className="section bg-white">
        <Container>          
          <Row className="-mb-3">
            <Col lg={6}>
              <Card className="mb-3">
                <Card.Body>
                  <h3 className="mb-3">{translation?.sellers_know_price || 'Know the right price of your property'}</h3>
                  <Row>
                    <Col lg className="mb-3">
                      <div className="d-flex align-items-center mb-2">
                        <Check className="text-success me-2" size={20} />
                        <span>{translation?.online_verification || 'Online Verification'}
                        </span>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <Check className="text-success me-2" size={20} />
                        <span>{translation?.refund_registered_properties || '100% Refund for Govt. registered properties'}
                        </span>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <Check className="text-success me-2" size={20} />
                        <span>{translation?.expert_checks || '24 Checks by Expert Valuers'}
                        </span>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <Check className="text-success me-2" size={20} />
                        <span>{translation?.expert_checks || '24 Checks by Expert Valuers'}
                        </span>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <Check className="text-success me-2" size={20} />
                        <span>{translation?.expert_checks || '24 Checks by Expert Valuers'}
                        </span>
                      </div>
                      <div className="d-flex align-items-center">
                        <Check className="text-success me-2" size={20} />
                        <span>{translation?.expert_checks || '24 Checks by Expert Valuers'}
                        </span>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="section">
        <Container>
          <h2 className="text-center mb-4">{translation?.magicbricks_valuation || 'Property Valuation from MagicBricks'}
          </h2>
          <Row className="-mb-3">
            <Col md={3} sm={6} className="text-center mb-3">
              <Image src="/assets/images/icons/govt.png" alt="Govt. Registered Valuers" width={64} height={64} className="mb-3" />
              <h5>{translation?.govt_registered_valuers || 'Govt. Registered Valuers'}
              </h5>
              <p className="text-muted">{translation?.ibbi_registered_valuers || 'IBBI Registered Valuers'}
              </p>
            </Col>
            <Col md={3} sm={6} className="text-center mb-3">
              <Image src="/assets/images/icons/property-value-2.png" alt="Reasonable Charges" width={64} height={64} className="mb-3" />
              <h5>{translation?.reasonable_charges || 'Reasonable Charges'}
              </h5>
              <p className="text-muted">{translation?.discount_mrp || '20% Discount on MRP'}
              </p>
            </Col>
            <Col md={3} sm={6} className="text-center mb-3">
              <Image src="/assets/images/icons/inspection.png" alt="Property Inspection" width={64} height={64} className="mb-3" />
              <h5>{translation?.property_inspection || 'Property Inspection'}
              </h5>
              <p className="text-muted">{translation?.on_site_inspection || 'On-site Inspection Available'}
              </p>
            </Col>
            <Col md={3} sm={6} className="text-center mb-3">
              <Image src="/assets/images/icons/detailed-report.png" alt="Detailed Report" width={64} height={64} className="mb-3" />
              <h5>{translation?.detailed_report || 'Detailed Report'}
              </h5>
              <p className="text-muted">{translation?.comprehensive_valuation_report || 'Comprehensive Valuation Report'}
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* How it works */}
      <section className="section bg-white">
        <Container>
          <h2 className="text-center mb-4">{translation?.how_it_works || 'How it works'}</h2>
          <Row className="-mb-3">
            <Col md={4}>
              <Card className="text-center mb-3"
              >
                <Card.Body>
                <Image src="/assets/images/icons/15164840.png" alt="Choose a Service" width={64} height={64} className="mb-3" />              
                <h5>{translation?.choose_service || 'Choose a Service'}                
                </h5>
                <p className="text-muted">{translation?.choose_service_description || 'Select the valuation service that meets your needs'}
                </p>
              </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="text-center mb-3"
              >
                <Card.Body>
                <Image src="/assets/images/icons/15164806.png" alt="Share details of property" width={64} height={64} className="mb-3" />              
                <h5>{translation?.share_property_details || 'Share details of property'}                
                </h5>
                <p className="text-muted">{translation?.share_property_description || 'Provide your property information'}
                </p>
              </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="text-center mb-3"
              >
                <Card.Body>
                  <Image src="/assets/images/icons/15164729.png" alt="Get valuation report" width={64} height={64} className="mb-3" />                
                  <h5>{translation?.get_valuation_report || 'Get valuation report'}                
                  </h5>
                  <p className="text-muted">{translation?.get_valuation_description || 'Receive detailed valuation analysis'}
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="section bg-light">
        <Container>
          <h2 className="text-center mb-4">{translation?.all_about_valuation || 'All You Need to Know About Property Valuation'}</h2>
          <Row>
            {/* Sidebar Navigation */}
            <Col md={4}>
              <ListGroup>
                {Object.keys(tabContent).map((key) => (
                  <ListGroup.Item
                    key={key}
                    active={activeTab === key}
                    onClick={() => setActiveTab(key)}
                    className="fw-medium"
                    style={{ cursor: "pointer" }}
                  >
                    {tabContent[key].title}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Col>

            {/* Dynamic Content Section */}
            <Col md={8}>
              <Card className="border-0 shadow-sm">
                <Card.Body>
                  <h3>{tabContent[activeTab].title}</h3>
                  <p>{tabContent[activeTab].content}</p>
                  <Image
                    src={tabContent[activeTab].image}
                    alt={tabContent[activeTab].title}
                    width={400}
                    height={250}
                    className="img-fluid mt-3"
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>    
      {show && (
        <PropertyValuationForm translation={translation} show={show} onHide={handleClose} />
      )}  
    </MainLayout>
  )
}

