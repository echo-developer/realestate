import React from "react";
import MainLayout from "@/components/layout/MainLayout";

const PrivacyPolicy = () => {
  return (
    <MainLayout>
      <div className="container my-5">
        <div className="text-center">
          <h1 className="fw-bold">Privacy Policy</h1>
          <p className="text-muted">Last updated: February 28, 2025</p>
        </div>

        <div className="mt-4">
          {/* Introduction */}
          <section className="mb-4">
            <h4 className="fw-bold">1. Introduction</h4>
            <p>
              Welcome to <strong>[Your Company Name]</strong>. We respect your privacy and are committed to
              protecting your personal information. This policy explains how we collect, use, and safeguard your data.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="mb-4">
            <h4 className="fw-bold">2. Information We Collect</h4>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">Personal Information: Name, email, phone number, etc.</li>
              <li className="list-group-item">Property Preferences: Searches, saved listings, inquiries.</li>
              <li className="list-group-item">Usage Data: IP address, browser type, device info.</li>
            </ul>
          </section>

          {/* How We Use Your Information */}
          <section className="mb-4">
            <h4 className="fw-bold">3. How We Use Your Information</h4>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">Provide real estate services and recommendations.</li>
              <li className="list-group-item">Respond to inquiries and customer support requests.</li>
              <li className="list-group-item">Improve our website and user experience.</li>
              <li className="list-group-item">Send promotional emails (you can opt out anytime).</li>
            </ul>
          </section>

          {/* Data Sharing & Third Parties */}
          <section className="mb-4">
            <h4 className="fw-bold">4. Data Sharing & Third Parties</h4>
            <p>We do not sell your data. However, we may share your information with:</p>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">Trusted real estate agents and brokers.</li>
              <li className="list-group-item">Service providers (hosting, analytics, marketing).</li>
              <li className="list-group-item">Legal authorities if required by law.</li>
            </ul>
          </section>

          {/* Security Measures */}
          <section className="mb-4">
            <h4 className="fw-bold">5. Security Measures</h4>
            <p>
              We implement security protocols to protect your data, but no system is 100% secure. Please use strong
              passwords and be cautious when sharing personal information online.
            </p>
          </section>

          {/* Your Rights & Choices */}
          <section className="mb-4">
            <h4 className="fw-bold">6. Your Rights & Choices</h4>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">Access, update, or delete your personal information.</li>
              <li className="list-group-item">Opt out of marketing emails.</li>
              <li className="list-group-item">Request a copy of your data.</li>
            </ul>
          </section>

          {/* Changes to This Policy */}
          <section className="mb-4">
            <h4 className="fw-bold">7. Changes to This Policy</h4>
            <p>
              We may update this Privacy Policy from time to time. Any changes will be posted on this page with an
              updated revision date.
            </p>
          </section>
        </div>
      </div>
    </MainLayout>
  );
};

export default PrivacyPolicy;
