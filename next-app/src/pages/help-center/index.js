"use client"
import React from "react";
import { Accordion, Form, InputGroup, Button } from "react-bootstrap";
import MainLayout from "@/components/layout/MainLayout";
import useTranslation from "@/hooks/useTranslation";

const HelpCenter = () => {
  const translation = useTranslation();
  return (
    <MainLayout>
      {/* Header Section */}
      <div className="container-fluid bg-light text-center py-4">
        <h2 className="fw-bold">{translation?.have_questions || "Have Questions? We've Got All the Answers"}</h2>
        <InputGroup className="mt-3 mx-auto" style={{ maxWidth: "600px" }}>
          <Form.Control placeholder={translation?.type_your_question || "Type your question here..."}
          />
          <Button variant="primary">
            <i className="fas fa-search">{translation?.search || "Search"}
            </i>
          </Button>
        </InputGroup>
      </div>

      {/* Help Topics & FAQs */}
      <div className="container-fluid text-light py-5">
        <div className="container">
          <div className="row">
            {/* Explore Help Topics */}
            <div className="col-md-6">
              <h3 className="fw-bold">{translation?.explore_help_topics || "Explore Help Topics"}
              </h3>

              {/* User Profile Section */}
              <div className="mb-3 p-3 bg-secondary rounded">
                <h5 className="text-white">{translation?.user_profile || "User Profile"}
                </h5>
                <ul className="list-unstyled">
                  <li>{translation?.new_registration_login || "New Registration & Login"}
                  </li>
                  <li>{translation?.my_activity || "My Activity"}
                  </li>
                  <li>{translation?.my_profile || "My Profile"}
                  </li>
                  <li>{translation?.my_requirement || "My Requirement"}
                  </li>
                  <li>{translation?.my_recommendations || "My Recommendations"}
                  </li>
                </ul>
                <a role="button" className="text-primary ">{translation?.explore_more || "Explore More"}
                </a>
              </div>

              {/* MB Features Section */}
              <div className="p-3 bg-secondary rounded">
                <h5 className="text-white">{translation?.mb_features || "MB Features"}
                </h5>
                <ul className="list-unstyled">
                  <li>{translation?.what_is_propworth || "What is Propworth?"}
                  </li>
                  <li>{translation?.all_about_property_auctions || "All About Property Auctions"}
                  </li>
                  <li>{translation?.certified_agents_info || "Want to Know About Certified Agents?"}
                  </li>
                </ul>
                <a role="button" className="text-primary">{translation?.explore_more || "Explore More"}
                </a>
              </div>
            </div>

            {/* Frequently Asked Questions */}
            <div className="col-md-6">
              <h3 className="fw-bold">{translation?.frequently_asked_questions || "Frequently Asked Questions"}
              </h3>
              <Accordion>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>{translation?.search_on_realestate || "What all can I search on RealEstate?"}
                  </Accordion.Header>
                  <Accordion.Body>
                  {translation?.realestate_search_info || "RealEstate allows users to search for residential, commercial, and rental properties across various locations."}

                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                  <Accordion.Header>{translation?.unsubscribe_emails || "I am getting too many emails, how can I unsubscribe?"}
                  </Accordion.Header>
                  <Accordion.Body>
                  {translation?.unsubscribe_info || "You can adjust your email preferences in your account settings to reduce the number of promotional emails."}

                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                  <Accordion.Header>{translation?.complaint_status || "I had raised a complaint. How to know the status?"}
                  </Accordion.Header>
                  <Accordion.Body>
                   {translation?.complaint_status_answer || "You can check your complaint status in the Support section of your profile."} 
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="3">
                  <Accordion.Header>{translation?.complaint_status || "I had raised a complaint. How to know the status?"}
                  </Accordion.Header>
                  <Accordion.Body>
                  {translation?.change_user_type || "I wish to change my User Type. How can I do that?"}

                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="4">
                  <Accordion.Header>{translation?.brokerage_info || "How much brokerage is charged by RealEstate?"}
                  </Accordion.Header>
                  <Accordion.Body>
                  {translation?.realestate_brokerage_details || "RealEstate does not charge a brokerage fee but connects users with agents who may have their own fee structure."}

                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
              <a role="button" className="d-block mt-3 text-primary">{translation?.view_more || "View More"}
              </a>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default HelpCenter;
