import React from "react";
import MainLayout from "@/components/layout/MainLayout";

const AboutUs = () => {
  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl font-bold text-center mb-6">About Us</h2>
        
        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Who We Are</h3>
          <p className="text-gray-600">
            Welcome to [Your Company Name], your trusted partner in real estate. 
            With years of experience, we specialize in helping individuals and families 
            find their dream homes and investment properties.
          </p>
        </section>

        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
          <p className="text-gray-600">
            Our mission is to provide exceptional real estate services with integrity, 
            transparency, and customer satisfaction at the core of everything we do.
          </p>
        </section>

        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Our Vision</h3>
          <p className="text-gray-600">
            We envision a world where finding a home is a seamless, stress-free experience. 
            We aim to leverage technology and personalized service to revolutionize real estate transactions.
          </p>
        </section>

        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Why Choose Us?</h3>
          <ul className="list-disc pl-6 text-gray-600">
            <li>Expert guidance through every step of the buying and selling process.</li>
            <li>Access to a vast network of properties and market insights.</li>
            <li>Personalized service tailored to your unique needs.</li>
            <li>Commitment to honesty, trust, and professionalism.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Meet Our Team</h3>
          <p className="text-gray-600">
            Our dedicated team of real estate professionals is here to assist you. 
            Whether you're looking to buy, sell, or invest, we have the expertise 
            to make your journey smooth and successful.
          </p>
        </section>

        <section className="text-center mt-6">
          <h3 className="text-xl font-semibold mb-2">Get in Touch</h3>
          <p className="text-gray-600">
            Have questions? Contact us today and let’s find your perfect property together!
          </p>
          <p className="text-gray-600 font-semibold mt-2">
            📧 Email: info@[yourcompany].com <br />
            📞 Phone: +1 234 567 890
          </p>
        </section>
      </div>
    </MainLayout>
  );
};

export default AboutUs;
