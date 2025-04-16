"use client";
import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import useTranslation from "@/hooks/useTranslation";
import { Spinner } from "react-bootstrap";  // Import Spinner

const Index = () => {
  const translation = useTranslation();
  const [contentView, setContentView] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDataDeletionPolicy = async () => {
      try {
        const res = await fetch("/cms/data-deletion-policy");
        const data = await res.json();

        if (res.ok && data?.status === 1) {
          setContentView(data?.data?.content || '<p class="text-muted fst-italic">No content available</p>');
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

    fetchDataDeletionPolicy();
  }, []);

  return (
    <MainLayout>
      <div className="container py-5">
        <h1 className="mb-4 text-center">
          {translation?.data_deletion_policy || 'Data Deletion Policy'}
        </h1>
        {loading ? (
          <div className="text-center">
            <Spinner
              animation="border"
              role="status"
              style={{
                width: "3rem",
                height: "3rem",
                borderColor: "rgba(0, 123, 255, 0.5)",  // Blue transparent
                borderRightColor: "transparent",
                filter: "blur(0.3px)",
              }}
            >
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: contentView }} />
        )}
      </div>
    </MainLayout>
  );
};

export default Index;
