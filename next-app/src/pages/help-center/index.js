import React from "react";
import { Accordion, Form, InputGroup, Button } from "react-bootstrap";
import MainLayout from "@/components/layout/MainLayout";

const HelpCenter = () => {
  return (
    <MainLayout>
      {/* Header Section */}
      <div className="container-fluid bg-light text-center py-4">
        <h2 className="fw-bold">Have Questions? We've Got All the Answers</h2>
        <InputGroup className="mt-3 mx-auto" style={{ maxWidth: "600px" }}>
          <Form.Control placeholder="Type your question here..." />
          <Button variant="primary">
            <i className="fas fa-search">Search</i>
          </Button>
        </InputGroup>
      </div>

      {/* Help Topics & FAQs */}
      <div className="container-fluid text-light py-5">
        <div className="container">
          <div className="row">
            {/* Explore Help Topics */}
            <div className="col-md-6">
              <h3 className="fw-bold">Explore Help Topics</h3>

              {/* User Profile Section */}
              <div className="mb-3 p-3 bg-secondary rounded">
                <h5 className="text-white">User Profile</h5>
                <ul className="list-unstyled">
                  <li>New Registration & Login</li>
                  <li>My Activity</li>
                  <li>My Profile</li>
                  <li>My Requirement</li>
                  <li>My Recommendations</li>
                </ul>
                <a role="button" className="text-primary ">Explore More</a>
              </div>

              {/* MB Features Section */}
              <div className="p-3 bg-secondary rounded">
                <h5 className="text-white">MB Features</h5>
                <ul className="list-unstyled">
                  <li>What is Propworth?</li>
                  <li>All About Property Auctions</li>
                  <li>Want to Know About Certified Agents?</li>
                </ul>
                <a role="button" className="text-primary">Explore More</a>
              </div>
            </div>

            {/* Frequently Asked Questions */}
            <div className="col-md-6">
              <h3 className="fw-bold">Frequently Asked Questions</h3>
              <Accordion>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>What all can I search on RealEstate?</Accordion.Header>
                  <Accordion.Body>
                  RealEstate allows users to search for residential, commercial, and rental properties across various locations.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                  <Accordion.Header>I am getting too many emails, how can I unsubscribe?</Accordion.Header>
                  <Accordion.Body>
                    You can adjust your email preferences in your account settings to reduce the number of promotional emails.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                  <Accordion.Header>I had raised a complaint. How to know the status?</Accordion.Header>
                  <Accordion.Body>
                    You can check your complaint status in the "Support" section of your profile.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="3">
                  <Accordion.Header>I wish to change my User Type. How can I do that?</Accordion.Header>
                  <Accordion.Body>
                    You can modify your user type by visiting the account settings section in your profile.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="4">
                  <Accordion.Header>How much brokerage is charged by RealEstate?</Accordion.Header>
                  <Accordion.Body>
                  RealEstate does not charge a brokerage fee but connects users with agents who may have their own fee structure.
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
              <a role="button" className="d-block mt-3 text-primary">View More</a>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default HelpCenter;
