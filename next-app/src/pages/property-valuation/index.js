"use client"
import React,{useState} from "react"
import { Container, Row, Col, Card, Form, Button, ListGroup } from "react-bootstrap"
import { CheckCircle, ArrowRight } from "lucide-react"
import Image from "next/image"
import MainLayout from "@/components/layout/MainLayout"

export default function PropertyValuation() {
  const [activeTab, setActiveTab] = useState("role")

  // Content mapping for the tabs
  const tabContent = {
    role: {
      title: "What's the role of Property Valuers?",
      content:
        "Property Valuers are experts who carry out a detailed inspection of a property and then present a report with an estimation of the property’s value.",
      image: "/assets/images/agents/user.jpg",
    },
    help: {
      title: "How does a Property Valuer help?",
      content:
        "A property valuer helps in assessing the market value of a property based on various factors like location, condition, and market trends.",
      image: "/assets/images/agents/user.jpg",
    },
    when: {
      title: "When should you avail Property Valuation?",
      content:
        "Property valuation should be availed before buying, selling, or mortgaging a property to ensure a fair market value.",
      image: "/assets/images/agents/user.jpg",
    },
    process: {
      title: "What is the process of Property Valuation?",
      content:
        "The valuation process includes an inspection, market analysis, and final report preparation detailing the estimated value.",
      image: "/assets/images/agents/user.jpg",
    },
    report: {
      title: "What is a Property Valuation report and how is it important?",
      content:
        "A valuation report provides a detailed analysis of a property’s worth, helping buyers and sellers make informed decisions.",
      image: "/assets/images/agents/user.jpg",
    },
  }

  return (
    <MainLayout>
    <div className="bg-light">
      {/* Hero Section */}
      <section className="bg-white py-4">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <h1 className="display-5 fw-bold mb-3">Property Valuation</h1>
              <p className="lead mb-4">Discover the real value of your property</p>
              <p className="text-muted mb-4">Get ₹5 crore to ₹50 lakh for your property</p>
              <Button variant="primary" size="lg">
                Request Valuation <ArrowRight className="ms-2" size={20} />
              </Button>
            </Col>
            <Col md={6}>
              <Image
                src={`/assets/images/agents/user.jpg`}
                alt="Property Valuation Illustration"
                width={500}
                height={300}
                className="img-fluid"
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Benefits Section */}
      <section className="py-5">
        <Container>
          <Row className="g-4">
            <Col md={6}>
              <Card>
                <Card.Body>
                  <h2 className="h4 mb-4">Benefits for Buyers</h2>
                  <ListGroup variant="flush">
                    <ListGroup.Item className="d-flex align-items-center border-0 ps-0">
                      <CheckCircle className="text-success me-2 flex-shrink-0" size={20} />
                      <span>Know the right price before making an offer</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex align-items-center border-0 ps-0">
                      <CheckCircle className="text-success me-2 flex-shrink-0" size={20} />
                      <span>Negotiate better with the seller</span>
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card>
                <Card.Body>
                  <h2 className="h4 mb-4">Benefits for Sellers</h2>
                  <ListGroup variant="flush">
                    <ListGroup.Item className="d-flex align-items-center border-0 ps-0">
                      <CheckCircle className="text-success me-2 flex-shrink-0" size={20} />
                      <span>Get the right price for your property</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex align-items-center border-0 ps-0">
                      <CheckCircle className="text-success me-2 flex-shrink-0" size={20} />
                      <span>Attract genuine buyers with the right price</span>
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Pricing Section */}
      <section className="py-5 bg-white">
        <Container>
          <h2 className="text-center mb-5">Know the right price of your property</h2>
          <Row className="justify-content-center">
            <Col md={8} lg={6}>
              <Card className="border-0 shadow">
                <Card.Body className="p-4">
                  <Row className="align-items-center mb-4">
                    <Col>
                      <div className="d-flex align-items-center mb-2">
                        <CheckCircle className="text-success me-2" size={20} />
                        <span>Online Verification</span>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <CheckCircle className="text-success me-2" size={20} />
                        <span>100% Refund for Govt. registered properties</span>
                      </div>
                      <div className="d-flex align-items-center">
                        <CheckCircle className="text-success me-2" size={20} />
                        <span>24 Checks by Expert Valuers</span>
                      </div>
                    </Col>
                    <Col className="text-end">
                      <small className="text-muted d-block">Starting from</small>
                      <span className="h2 fw-bold">₹2399</span>
                      <small className="text-muted d-block">20% OFF</small>
                    </Col>
                  </Row>
                  <Button variant="priamry" size="lg" className="w-100">
                    Get Now
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Contact Form */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="justify-content-center">
            <Col md={6}>
              <Card className="border-0 shadow">
                <Card.Body className="p-4">
                  <h2 className="h4 text-center mb-4">Get Free Advice on your Property Valuation requirement</h2>
                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Control type="text" placeholder="Name" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Control type="tel" placeholder="Mobile" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Control type="email" placeholder="Email" />
                    </Form.Group>
                    <Button variant="primary" size="lg" className="w-100">
                      Get FREE Valuation
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-white">
        <Container>
          <h2 className="text-center mb-5">Property Valuation from MagicBricks</h2>
          <Row className="g-4">
            <Col md={3} className="text-center">
              <Image src="/assets/images/agents/user.jpg" alt="Govt. Registered Valuers" width={64} height={64} className="mb-3" />
              <h3 className="h5">Govt. Registered Valuers</h3>
              <p className="text-muted">IBBI Registered Valuers</p>
            </Col>
            <Col md={3} className="text-center">
              <Image src="/assets/images/agents/user.jpg" alt="Reasonable Charges" width={64} height={64} className="mb-3" />
              <h3 className="h5">Reasonable Charges</h3>
              <p className="text-muted">20% Discount on MRP</p>
            </Col>
            <Col md={3} className="text-center">
              <Image src="/assets/images/agents/user.jpg" alt="Property Inspection" width={64} height={64} className="mb-3" />
              <h3 className="h5">Property Inspection</h3>
              <p className="text-muted">On-site Inspection Available</p>
            </Col>
            <Col md={3} className="text-center">
              <Image src="/assets/images/agents/user.jpg" alt="Detailed Report" width={64} height={64} className="mb-3" />
              <h3 className="h5">Detailed Report</h3>
              <p className="text-muted">Comprehensive Valuation Report</p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* How it works */}
      <section className="py-5 bg-light">
        <Container>
          <h2 className="text-center mb-5">How it works</h2>
          <Row className="justify-content-center g-4">
            <Col md={4} className="text-center">
              <div
                className="bg-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                style={{ width: "80px", height: "80px" }}
              >
                <Image src="/assets/images/agents/user.jpg" alt="Choose a Service" width={40} height={40} />
              </div>
              <h3 className="h5 mb-2">Choose a Service</h3>
              <p className="text-muted">Select the valuation service that meets your needs</p>
            </Col>
            <Col md={4} className="text-center">
              <div
                className="bg-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                style={{ width: "80px", height: "80px" }}
              >
                <Image src="/assets/images/agents/user.jpg" alt="Share details of property" width={40} height={40} />
              </div>
              <h3 className="h5 mb-2">Share details of property</h3>
              <p className="text-muted">Provide your property information</p>
            </Col>
            <Col md={4} className="text-center">
              <div
                className="bg-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                style={{ width: "80px", height: "80px" }}
              >
                <Image src="/assets/images/agents/user.jpg" alt="Get valuation report" width={40} height={40} />
              </div>
              <h3 className="h5 mb-2">Get valuation report</h3>
              <p className="text-muted">Receive detailed valuation analysis</p>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="py-5 bg-white mt-3">
          <Container>
            <h2 className="text-center mb-5">All You Need to Know About Property Valuation</h2>
            <Row>
              {/* Sidebar Navigation */}
              <Col md={4}>
                <ListGroup>
                  {Object.keys(tabContent).map((key) => (
                    <ListGroup.Item
                      key={key}
                      active={activeTab === key}
                      onClick={() => setActiveTab(key)}
                      style={{ cursor: "pointer" }}
                    >
                      {tabContent[key].title}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Col>

              {/* Dynamic Content Section */}
              <Col md={8}>
                <Card className="border-0 shadow p-4">
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
    </div>
    </MainLayout>
  )
}

