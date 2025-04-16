"use client";
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import MainLayout from "@/components/layout/MainLayout";
import useTranslation from "@/hooks/useTranslation";
import AuthUser from "@/components/Authentication/AuthUser";
import DOMPurify from "dompurify";

const TermsAndConditions = () => {
  const { callApi } = AuthUser();
  const [contentView, setContentView] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTermConditionView = async () => {
      try {
        const res = await callApi({
          api: "/cms/term-conditions",
          method: "GET",
        });

        if (res && res?.status === 1) {
          setContentView(res?.data?.content);
        } else {
          setContentView('<p class="text-muted fst-italic">No content available</p>');
        }
      } catch (error) {
        console.error(error.message);
        setContentView('<p class="text-muted fst-italic">No content available</p>');
      } finally {
        setLoading(false);
      }
    };

    fetchTermConditionView();
  }, []);

  const translation = useTranslation();

  return (
    <MainLayout>
      {/* Header Section */}
      <div className="container-fluid text-center mt-3">
        <h2 className="fw-bold">
          {translation?.terms_conditions || "Terms & Conditions"}
        </h2>
        <p className="text-muted">
          {translation?.last_updated || "Last updated: March 2025"}
        </p>
      </div>

      {/* Terms & Conditions Content */}
      <div className="container-fluid text-dark">
        <Container>
          <Row>
            <Col md={12}>
              <Card className="p-4 text-dark mb-3 mt-3 text-center">
                {loading ? (
                  <Spinner
                    animation="border"
                    role="status"
                    style={{
                      width: "3rem",
                      height: "3rem",
                      borderColor: "rgba(0, 123, 255, 0.5)", // Bootstrap blue with transparency
                      borderRightColor: "transparent",
                      filter: "blur(0.3px)",
                    }}
                  >
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                ) : (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(contentView),
                    }}
                  />
                )}
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </MainLayout>
  );
};

export default TermsAndConditions;
