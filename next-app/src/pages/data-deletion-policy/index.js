import React from "react";
import MainLayout from "@/components/layout/MainLayout";

const index = () => {
  return (
    <MainLayout>
    <div className="container py-5">
      <h1 className="mb-4 text-center">Data Deletion Policy</h1>
      <p className="lead text-center">
        Your privacy is important to us. This page explains how you can request
        the deletion of your personal data.
      </p>

      <div className="card shadow-sm mt-4">
        <div className="card-body">
          <h3 className="card-title">1. What Data Do We Store?</h3>
          <p>
            We may collect and store your personal data, including but not
            limited to your name, email address, and user-generated content.
            This data helps us provide a better experience.
          </p>
        </div>
      </div>

      <div className="card shadow-sm mt-4">
        <div className="card-body">
          <h3 className="card-title">2. How to Request Data Deletion?</h3>
          <p>
            If you wish to delete your data from our system, you can send us a
            request via email.
          </p>
          <p>
            <strong>Email:</strong>{" "}
            <a href="mailto:support@example.com">support@example.com</a>
          </p>
          <p>Please include the following details in your request:</p>
          <ul>
            <li>Your full name</li>
            <li>The email address associated with your account</li>
            <li>A brief reason for the deletion request (optional)</li>
          </ul>
        </div>
      </div>

      <div className="card shadow-sm mt-4">
        <div className="card-body">
          <h3 className="card-title">3. Processing Time</h3>
          <p>
            We aim to process data deletion requests within{" "}
            <strong>7-14 business days</strong>. You will receive a confirmation
            email once your data has been deleted.
          </p>
        </div>
      </div>

      <div className="card shadow-sm mt-4">
        <div className="card-body">
          <h3 className="card-title">4. Important Notes</h3>
          <p>
            - Some data may be retained for legal or security reasons. <br />-
            Deleting your data is irreversible, and you may lose access to
            services associated with your account.
          </p>
        </div>
      </div>

      <div className="text-center mt-5">
        <a href="/" className="btn btn-primary">
          Back to Home
        </a>
      </div>
    </div>
    </MainLayout>
  );
};

export default index;
