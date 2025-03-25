"use client"
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import useTranslation from "@/hooks/useTranslation";

const AboutUs = () => {
  const translation = useTranslation();
  return (
    <MainLayout>
      <div className="container mt-5">
        <h2 className="text-center fw-bold mb-4">{translation?.about_us || 'About Us'}</h2>

        <div className="row">
          <div className="col-md-8 mx-auto">
            <h4 className="fw-bold">{translation?.who_we_are || 'Who We Are'}</h4>
            <p>{translation?.welcome_to || 'Welcome to'} <strong>{translation?.company_name || 'Your Company Name'}</strong>{translation?.who_we_are_text || ', Your trusted partner in real estate. We specialize in helping individuals and families find their dream homes and investment properties.'}</p>

            <h4 className="fw-bold">{translation?.our_mission || 'Our Mission'}</h4>
            <p>{translation?.our_mission_text_1 || 'We provide exceptional real estate services with integrity, transparency, and customer satisfaction at the core of everything we do.'}</p>

            <h4 className="fw-bold">{translation?.our_vision || "Our Vision"}</h4>
            <p>{translation?.our_mission_text_2 || 'We aim to make finding a home a seamless, stress-free experience by leveraging technology and personalized services.'}</p>

            <h4 className="fw-bold">{translation?.why_choose_us || 'Why Choose Us?'}</h4>
            <ul>
              <li>{translation?.why_choose_us_text_1 || 'Expert guidance through the buying and selling process.'}</li>
              <li>{translation?.why_choose_us_text_2 || 'Access to a vast network of properties and market insights.'}</li>
              <li>{translation?.why_choose_us_text_3 || 'Personalized service tailored to your needs.'}</li>
              <li>{translation?.why_choose_us_text_4 || 'Commitment to honesty, trust, and professionalism.'}</li>
            </ul>

            <h4 className="fw-bold">{translation?.get_in_touch || 'Get in Touch'}</h4>
            <p>{translation?.get_in_touch_text || 'Have questions? Contact us today and let’s find your perfect property together!'}</p>
            <p><strong>{translation?.email || "Email:"}</strong> originatesoft@gmail.com</p>
            <p><strong>{translation?.phone || "Phone:"}</strong>+913340016469 </p> 
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AboutUs;
