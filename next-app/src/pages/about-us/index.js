"use client";
import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import useTranslation from "@/hooks/useTranslation";
import AuthUser from "@/components/Authentication/AuthUser";
import { Spinner } from "react-bootstrap";

const AboutUs = () => {
  const { callApi } = AuthUser();
  const translation = useTranslation();
  const [sanitizedHTML, setSanitizedHTML] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutUsView = async () => {
      try {
        const res = await callApi({
          api: "/cms/about-us",
          method: "GET",
        });

        const DOMPurify = (await import("dompurify")).default;

        if (res?.status === 1) {
          setSanitizedHTML(
            DOMPurify.sanitize(res?.data?.content || '<p class="text-muted">No content available</p>')
          );
        } else {
          setSanitizedHTML(
            DOMPurify.sanitize('<p class="text-muted">No content available</p>')
          );
        }
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutUsView();
  }, []);

  return (
    <MainLayout>
      <div className="short-banner">
        <div className="container">
          <h1 className="mb-0 text-center fw-bold">
            {translation?.about_us || "About Us"}
          </h1>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {loading ? (
            <Spinner
              animation="border"
              role="status"
              style={{
                width: "3rem",
                height: "3rem",
                borderColor: "rgba(0, 123, 255, 0.5)",      // blue transparent
                borderRightColor: "transparent",
                filter: "blur(0.3px)"
              }}
            >
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default AboutUs;
