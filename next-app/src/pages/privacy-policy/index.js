import React from "react";
import MainLayout from "@/components/layout/MainLayout";

const PrivacyPolicy = () => {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl font-bold text-center mb-6">Privacy Policy</h2>
        <p className="text-gray-600 mb-4">
          Last updated: February 28, 2025
        </p>

        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-2">1. Introduction</h3>
          <p className="text-gray-600">
            Welcome to [Your Company Name]. We respect your privacy and are committed 
            to protecting your personal information. This policy explains how we collect, 
            use, and safeguard your data.
          </p>
        </section>

        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-2">2. Information We Collect</h3>
          <ul className="list-disc pl-6 text-gray-600">
            <li>Personal Information: Name, email, phone number, etc.</li>
            <li>Property Preferences: Searches, saved listings, inquiries.</li>
            <li>Usage Data: IP address, browser type, device info.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-2">3. How We Use Your Information</h3>
          <p className="text-gray-600">We use your data to:</p>
          <ul className="list-disc pl-6 text-gray-600">
            <li>Provide real estate services and recommendations.</li>
            <li>Respond to inquiries and customer support requests.</li>
            <li>Improve our website and user experience.</li>
            <li>Send promotional emails (you can opt-out anytime).</li>
          </ul>
        </section>

        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-2">4. Data Sharing & Third Parties</h3>
          <p className="text-gray-600">
            We do not sell your data. However, we may share your information with:
          </p>
          <ul className="list-disc pl-6 text-gray-600">
            <li>Trusted real estate agents and brokers.</li>
            <li>Service providers (hosting, analytics, marketing).</li>
            <li>Legal authorities if required by law.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-2">5. Security Measures</h3>
          <p className="text-gray-600">
            We implement security protocols to protect your data, but no system is 
            100% secure. Please use strong passwords and be cautious when sharing 
            personal information online.
          </p>
        </section>

        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-2">6. Your Rights & Choices</h3>
          <p className="text-gray-600">You have the right to:</p>
          <ul className="list-disc pl-6 text-gray-600">
            <li>Access, update, or delete your personal information.</li>
            <li>Opt out of marketing emails.</li>
            <li>Request a copy of your data.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-2">7. Changes to This Policy</h3>
          <p className="text-gray-600">
            We may update this policy from time to time. The latest version will 
            always be available on our website.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-2">8. Contact Us</h3>
          <p className="text-gray-600">
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <p className="text-gray-600 font-semibold mt-2">
            Email: privacy@[yourcompany].com <br />
            Phone: +1 234 567 890
          </p>
        </section>
      </div>
    </MainLayout>
  );
};

export default PrivacyPolicy;
