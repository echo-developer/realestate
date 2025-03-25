"use client"
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import useTranslation from "@/hooks/useTranslation";

const PrivacyPolicy = () => {
  const translation = useTranslation();
  return (
    <MainLayout>
      <div className="container my-5">
        <div className="text-center">
          <h1 className="fw-bold">{translation?.privacy_policy || "Privacy Policy"}</h1>
          <p className="text-muted">{translation?.last_updated || "Last updated: February 28, 2025"}</p>
        </div>

        <div className="mt-4">
          {/* Introduction */}
          <section className="mb-4">
            <h4 className="fw-bold">{translation?.introduction || "1. Introduction"}</h4>
            <p>
              {translation?.welcome_to || "Welcome to "}<strong> {translation?.company_name || "[Your Company Name] "}</strong>.{translation?.privacy_commitment || "We respect your privacy and are committed to protecting your personal information. This policy explains how we collect, use, and safeguard your data."}
            </p>
          </section>

          {/* Information We Collect */}
          <section className="mb-4">
            <h4 className="fw-bold">{translation?.information_we_collect || "2. Information We Collect"}</h4>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">{translation?.personal_information || "Personal Information: Name, email, phone number, etc."}</li>
              <li className="list-group-item">{translation?.property_preferences || "Property Preferences: Searches, saved listings, inquiries."}</li>
              <li className="list-group-item">{translation?.usage_data || "Usage Data: IP address, browser type, device info."}</li>
            </ul>
          </section>

          {/* How We Use Your Information */}
          <section className="mb-4">
            <h4 className="fw-bold">{translation?.how_we_use_your_information || "3. How We Use Your Information"}</h4>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">{translation?.provide_services || "Provide real estate services and recommendations."}</li>
              <li className="list-group-item">{translation?.respond_inquiries || "Respond to inquiries and customer support requests."}</li>
              <li className="list-group-item">{translation?.improve_experience || "Improve our website and user experience."}</li>
              <li className="list-group-item">{translation?.send_promotional_emails || "Send promotional emails (you can opt out anytime)."}</li>
            </ul>
          </section>

          {/* Data Sharing & Third Parties */}
          <section className="mb-4">
            <h4 className="fw-bold">{translation?.data_sharing_third_parties || "4. Data Sharing & Third Parties"}</h4>
            <p>{translation?.data_not_sold || "We do not sell your data. However, we may share your information with:"}</p>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">{translation?.trusted_agents || "Trusted real estate agents and brokers."}</li>
              <li className="list-group-item">{translation?.service_providers || "Service providers (hosting, analytics, marketing)."}</li>
              <li className="list-group-item">{translation?.legal_authorities || "Legal authorities if required by law."}</li>
            </ul>
          </section>

          {/* Security Measures */}
          <section className="mb-4">
            <h4 className="fw-bold">{translation?.security_measures || "5. Security Measures"}</h4>
            <p>
              {translation?.security_protection || "We implement security protocols to protect your data, but no system is 100% secure. Please use strong passwords and be cautious when sharing personal information online."}
            </p>
          </section>

          {/* Your Rights & Choices */}
          <section className="mb-4">
            <h4 className="fw-bold">{translation?.your_rights_choices || "6. Your Rights & Choices"}</h4>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">{translation?.access_update_delete || "Access, update, or delete your personal information"}</li>
              <li className="list-group-item">{translation?.opt_out_marketing || "Opt out of marketing emails."}</li>
              <li className="list-group-item">{translation?.request_data_copy || "Request a copy of your data."}</li>
            </ul>
          </section>

          {/* Changes to This Policy */}
          <section className="mb-4">
            <h4 className="fw-bold">{translation?.changes_to_policy || "7. Changes to This Policy"}</h4>
            <p>
              {translation?.policy_updates || "We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date."}
            </p>
          </section>
        </div>
      </div>
    </MainLayout>
  );
};

export default PrivacyPolicy;
