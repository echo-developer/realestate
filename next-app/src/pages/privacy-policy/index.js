"use client";
import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import useTranslation from "@/hooks/useTranslation";
import AuthUser from "@/components/Authentication/AuthUser";
import { Spinner } from "react-bootstrap";  // <-- import Spinner

const PrivacyPolicy = () => {
  const { callApi } = AuthUser();
  const translation = useTranslation();
  const [contentView, setContentView] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTermConditionView = async () => {
      try {
        const res = await callApi({
          api: "/cms/privacy-policy",
          method: "GET",
        });

        const DOMPurify = (await import("dompurify")).default;

        if (res?.status === 1) {
          setContentView(
            DOMPurify.sanitize(res?.data?.content || '<p class="text-muted fst-italic">No content available</p>')
          );
        } else {
          setContentView(
            DOMPurify.sanitize('<p class="text-muted fst-italic">No content available</p>')
          );
        }
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTermConditionView();
  }, []);

  return (
    <MainLayout>
      <div className="short-banner">
        <div className="container">
          <h1 className="mb-0 fw-bold">{translation?.privacy_policy || "Privacy Policy"}</h1>
        </div>
      </div>

      <section className="section">
        <div className="container text-center">
          {loading ? (
            <Spinner 
              animation="border" 
              role="status"
              style={{
                width: "3rem",
                height: "3rem",
                borderColor: "rgba(0, 123, 255, 0.5)",         // light blue transparent
                borderRightColor: "transparent",                // for the rotating effect
                filter: "blur(0.3px)"                           // subtle blur
              }}
            >
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: contentView }} />
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default PrivacyPolicy;
