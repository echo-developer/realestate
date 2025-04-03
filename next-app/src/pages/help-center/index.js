"use client"
import React from "react";
import { Accordion, Form, InputGroup, Button, Row, Col } from "react-bootstrap";
import MainLayout from "@/components/layout/MainLayout";
import useTranslation from "@/hooks/useTranslation";
import { House, Person } from "react-bootstrap-icons";
import Link from "next/link";

const HelpCenter = () => {
  const translation = useTranslation();
  return (
    <MainLayout>
      {/* Header Section */}
      <div className="short-banner" style={{minHeight: '150px'}}>
      <div className="container">
        <h2 className="fw-bold">{translation?.have_questions || "Have Questions? We've Got All the Answers"}</h2>
        <InputGroup className="mt-3 mx-auto p-1  bg-white rounded-3" style={{ maxWidth: "600px" }}>
          <Form.Control placeholder={translation?.type_your_question || "Type your question here..."}
          />
          <Button variant="primary">
            {translation?.search || "Search"}
          </Button>
        </InputGroup>
      </div></div>

      {/* Help Topics & FAQs */}
      <div className="py-5">
        <div className="container">
          <div className="row">
            {/* Explore Help Topics */}
            <adide className="col-lg-8">
              <h3 className="fw-bold">{translation?.explore_help_topics || "Explore Help Topics"}</h3>

              <Row className="row gx-3">
                {/* User Profile Section */}
                <Col className="col-lg-6 col-12">
                  <div className="card h-100-mb-3">
                    <div className="card-body">
                      <h4 className="mb-3">
                        <span className="text-primary">
                          <Person color="currentColor" size={24} className="me-2" />
                        </span>
                        {translation?.user_profile || "User Profile"}
                      </h4>
                      <ul className="list list-3 ps-2">
                        <li>
                          <Link href="/new-registration">
                            {translation?.new_registration_login || "New Registration & Login"}
                          </Link>
                        </li>
                        <li>
                          <Link href="/">
                            {translation?.my_activity || "My Activity"}
                          </Link>
                        </li>
                        <li>
                          <Link href="/">{translation?.my_profile || "My Profile"}</Link>
                        </li>
                        <li>
                          <Link href="/">{translation?.my_requirement || "My Requirement"}</Link>
                        </li>
                        <li>
                          <Link href="/">{translation?.my_recommendations || "My Recommendations"}</Link>
                        </li>
                      </ul>
                      <Link href="/" className="btn btn-outline-primary btn-sm">{translation?.explore_more || "Explore More"}</Link>

                    </div>
                  </div>
                </Col>

                {/* MB Features Section */}
                <Col className="col-lg-6 col-12">
                  <div className="card h-100-mb-3">
                    <div className="card-body">
                      <h4 className="mb-3">
                        <span className="text-primary">
                          <House color="currentColor" size={24} className="me-2" />
                        </span>
                        {translation?.mb_features || "RE Features"}
                      </h4>
                      <ul className="list list-3 ps-2">
                        <li>
                          <Link href="/">{translation?.what_is_propworth || "What is Propworth?"}</Link>
                        </li>
                        <li>
                          <Link href="/">{translation?.all_about_property_auctions || "All About Property Auctions"}</Link>
                        </li>
                        <li><Link href="/">{translation?.certified_agents_info || "Want to Know About Certified Agents?"}</Link>
                        </li>
                      </ul>
                      <Link href="/" className="btn btn-outline-primary btn-sm">{translation?.explore_more || "Explore More"}</Link>
                    </div>
                  </div>
                </Col>
              </Row>
            </adide>

            {/* Frequently Asked Questions */}
            <adide className="col-lg-4">
              <h3 className="fw-bold">{translation?.faq || "FAQs"}
              </h3>
              <Accordion className="help-center mb-3">
                <Accordion.Item eventKey="0">
                  <Accordion.Header as="h5"><i class="bi bi-question-diamond me-2"></i> {translation?.search_on_realestate || "What all can I search on RealEstate?"}
                  </Accordion.Header>
                  <Accordion.Body>
                    <p className="ps-4">{translation?.realestate_search_info || "RealEstate allows users to search for residential, commercial, and rental properties across various locations."}</p>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                  <Accordion.Header><i class="bi bi-question-diamond me-2"></i> {translation?.unsubscribe_emails || "I am getting too many emails, how can I unsubscribe?"}
                  </Accordion.Header>
                  <Accordion.Body>
                    <p className="ps-4">{translation?.unsubscribe_info || "You can adjust your email preferences in your account settings to reduce the number of promotional emails."}</p>

                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                  <Accordion.Header><i class="bi bi-question-diamond me-2"></i> {translation?.complaint_status || "I had raised a complaint. How to know the status?"}
                  </Accordion.Header>
                  <Accordion.Body>
                    <p className="ps-4">{translation?.complaint_status_answer || "You can check your complaint status in the Support section of your profile."}</p>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="3">
                  <Accordion.Header><i class="bi bi-question-diamond me-2"></i> {translation?.complaint_status || "I had raised a complaint. How to know the status?"}
                  </Accordion.Header>
                  <Accordion.Body>
                    <p className="ps-4">{translation?.change_user_type || "I wish to change my User Type. How can I do that?"}</p>

                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="4">
                  <Accordion.Header><i class="bi bi-question-diamond me-2"></i> {translation?.brokerage_info || "How much brokerage is charged by RealEstate?"}
                  </Accordion.Header>
                  <Accordion.Body>
                    <p className="ps-4">{translation?.realestate_brokerage_details || "RealEstate does not charge a brokerage fee but connects users with agents who may have their own fee structure."}</p>

                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
              <div className="text-center"><Button variant="primary">{translation?.view_more || "View More"}</Button></div>
            </adide>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default HelpCenter;
