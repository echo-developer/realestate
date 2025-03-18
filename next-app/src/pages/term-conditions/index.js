"use client"
import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import MainLayout from "@/components/layout/MainLayout";
import Link from "next/link";
import useTranslation from "@/hooks/useTranslation";

const TermsAndConditions = () => {
  const translation = useTranslation();
  return (
    <MainLayout>
      {/* Header Section */}
      <div className="container-fluid text-center mt-3 ">
        <h2 className="fw-bold">{translation?.terms_conditions || "Terms & Conditions"}
        </h2>
        <p className="text-muted">{translation?.last_updated || "Last updated: March 2025"}
        </p>
      </div>

      {/* Terms & Conditions Content */}
      <div className="container-fluid  text-dark">
        <Container>
          <Row>
            <Col md={12}>
              <Card className="p-4 text-dark mb-3 mt-3">
                <Card.Body>
                  <h3 className="fw-bold">{translation?.agreement_to_terms || "1. Agreement to Terms"}
                  </h3>
                  <p>
                  {translation?.agreement_to_terms_text || "By accessing or using our real estate platform, you agree to abide by these terms and conditions. If you do not agree, please discontinue use."}

                  </p>

                  <h3 className="fw-bold mt-4">{translation?.user_responsibilities || "2. User Responsibilities"}
                  </h3>
                  <p>
                  {translation?.user_responsibilities_text || "Users must provide accurate information and follow all legal guidelines when listing or searching for properties. Misuse of the platform may result in suspension."}

                  </p>

                  <h3 className="fw-bold mt-4">{translation?.privacy_policy || "3. Privacy Policy"}
                  </h3>
                  <p>
                  {translation?.privacy_policy_text || "Your data privacy is important to us. We collect and store personal data in accordance with our privacy policy."}
                  <Link href="/privacy-policy" className="text-danger"> </Link>.
                  </p>

                  <h3 className="fw-bold mt-4">{translation?.property_listings || "4. Property Listings"}
                  </h3>
                  <p>
                  {translation?.property_listings_text || "All property listings must be truthful and comply with real estate regulations. We reserve the right to remove any misleading or fraudulent listings."}

                  </p>

                  <h3 className="fw-bold mt-4">{translation?.payment_terms || "5. Payment Terms"}
                  </h3>
                  <p>
                  {translation?.payment_terms_text || "Some services may require payment. By purchasing, you agree to our billing terms. We do not offer refunds unless stated otherwise."}

                  </p>

                  <h3 className="fw-bold mt-4">{translation?.limitation_of_liability || "6. Limitation of Liability"}
                  </h3>
                  <p>
                  {translation?.limitation_of_liability_text || "We are not responsible for any disputes between buyers and sellers. Transactions are at users' own risk."}
                  </p>

                  <h3 className="fw-bold mt-4">{translation?.changes_to_terms || "7. Changes to Terms"}
                  </h3>
                  <p>
                  {translation?.changes_to_terms_text || "We may update these terms from time to time. Continued use of our platform constitutes acceptance of any modifications."}

                  </p>

                  <h3 className="fw-bold mt-4">{translation?.contact_us_1 || "8. Contact Us"}
                  </h3>
                  <p>
                  {translation?.contact_us_text || "If you have any questions, feel free to contact us."} <Link href="/contact-us" className="text-danger"></Link>.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </MainLayout>
  );
};

export default TermsAndConditions;
