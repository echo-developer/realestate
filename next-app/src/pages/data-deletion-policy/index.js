"use client"
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import useTranslation from "@/hooks/useTranslation";

const index = () => {
  const translation = useTranslation();
  return (
    <MainLayout>
      <div className="container py-5">
        <h1 className="mb-4 text-center">{translation?.data_deletion_policy || 'Data Deletion Policy'}</h1>
        <p className="lead text-center">
          {translation?.privacy_importance || 'Your privacy is important to us. This page explains how you can request the deletion of your personal data.'}
        </p>

        <div className="card shadow-sm mt-4">
          <div className="card-body">
            <h3 className="card-title">{translation?.stored_data || '1. What Data Do We Store?'}</h3>
            <p>
              {translation?.stored_data_text || 'We may collect and store your personal data, including but not limited to your name, email address, and user-generated content. This data helps us provide a better experience.'}
            </p>
          </div>
        </div>

        <div className="card shadow-sm mt-4">
          <div className="card-body">
            <h3 className="card-title">{translation?.request_data_deletion || '2. How to Request Data Deletion?'}</h3>
            <p>
              {translation?.request_data_deletion_text || 'If you wish to delete your data from our system, you can send us a request via email.'}
            </p>
            <p>
              <strong>{translation?.email || "Email:"}</strong>{" "}
              <a href="mailto:support@example.com">support@example.com</a>
            </p>
            <p>{translation?.email_instructions || 'Please include the following details in your request:'}</p>
            <ul>
              <li>{translation?.full_name || 'Your full name'}</li>
              <li>{translation?.associated_email || 'The email address associated with your account'}</li>
              <li>{translation?.deletion_reason || 'A brief reason for the deletion request (optional)'}</li>
            </ul>
          </div>
        </div>

        <div className="card shadow-sm mt-4">
          <div className="card-body">
            <h3 className="card-title">{translation?.processing_time || '3. Processing Time'}</h3>
            <p>
              {translation?.we_aim_to_process || "We aim to process data deletion requests within"}{" "}
              <strong></strong>. {translation?.processing_time_text || ' 7-14 business days. You will receive a confirmation email once your data has been deleted.'}
            </p>
          </div>
        </div>

        <div className="card shadow-sm mt-4">
          <div className="card-body">
            <h3 className="card-title">{translation?.important_notes || '4. Important Notes'}</h3>
            <p>
              {translation?.same_data_may || "Some data may be retained for legal or security reasons."} <br />-
              {translation?.important_notes_text || ' Deleting your data is irreversible, and you may lose access to services associated with your account.'}
            </p>
          </div>
        </div>

        <div className="text-center mt-5">
          <a href="/" className="btn btn-primary">
            {translation?.back_to_home || 'Back to Home'}
          </a>
        </div>
      </div>
    </MainLayout>
  );
};

export default index;
