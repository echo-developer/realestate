import React from "react";
import MainLayout from "@/components/layout/MainLayout";

const AboutUs = () => {
  return (
    <MainLayout>
      <div className="container mt-5">
        <h2 className="text-center fw-bold mb-4">About Us</h2>

        <div className="row">
          <div className="col-md-8 mx-auto">
            <h4 className="fw-bold">Who We Are</h4>
            <p>Welcome to <strong>[Your Company Name]</strong>, your trusted partner in real estate. We specialize in helping individuals and families find their dream homes and investment properties.</p>

            <h4 className="fw-bold">Our Mission</h4>
            <p>We provide exceptional real estate services with integrity, transparency, and customer satisfaction at the core of everything we do.</p>

            <h4 className="fw-bold">Our Vision</h4>
            <p>We aim to make finding a home a seamless, stress-free experience by leveraging technology and personalized services.</p>

            <h4 className="fw-bold">Why Choose Us?</h4>
            <ul>
              <li>Expert guidance through the buying and selling process.</li>
              <li>Access to a vast network of properties and market insights.</li>
              <li>Personalized service tailored to your needs.</li>
              <li>Commitment to honesty, trust, and professionalism.</li>
            </ul>

            <h4 className="fw-bold">Get in Touch</h4>
            <p>Have questions? Contact us today and let’s find your perfect property together!</p>
            <p><strong>Email:</strong> originatesoft@gmail.com</p>
            <p><strong>Phone:</strong>+913340016469 </p> 
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AboutUs;
