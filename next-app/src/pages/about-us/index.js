"use client";
import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import useTranslation from "@/hooks/useTranslation";
import AuthUser from "@/components/Authentication/AuthUser";
import { Spinner } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import Loading from "@/components/LoadingSpinner/Loading";

const AboutUs = () => {
  const { callApi } = AuthUser();
  const translation = useTranslation();
  const [sanitizedHTML, setSanitizedHTML] = useState("");
  const [loading, setLoading] = useState(true);
  const [metaData, setMetaData] = useState(null);

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
    getAboutMeta();
  }, []);

  const getAboutMeta = async () => {
    try {
      const res = await callApi({
        api: `/get-meta-data/about_us`,
        method: "GET"
      })
      if(res && res?.status == 1) {
        setMetaData(res?.data);
      }
    } catch (error) {
      console.error(error.message || "Something went wrong")
    }
  }

  return (
    <MainLayout>
      <Helmet>
              <title>
                {metaData?.meta_title}
              </title>
              <meta
                name="description"
                content={metaData?.meta_description}
              />
              <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Helmet>
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
            <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh", // or 100% if inside a container
            }}
          >
            <Spinner
              animation="border"
              role="status"
              style={{
                width: "3rem",
                height: "3rem",
                borderColor: "rgba(0, 123, 255, 0.5)", 
                borderRightColor: "transparent",
                filter: "blur(0.3px)",
              }}
            >
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
          
          ) : (
            <div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default AboutUs;
