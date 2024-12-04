"use client"
import React from "react";
import ErrorBoundary from "@/components/error/ErrorBoundary";

function ErrorPage({ statusCode }) {
  return (
    <ErrorBoundary>
      <div>
        <h1>{statusCode ? `An error ${statusCode} occurred` : "An error occurred"}</h1>
      </div>
    </ErrorBoundary>
  );
}

ErrorPage.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default ErrorPage;
