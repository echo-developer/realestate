"use client"
import Link from 'next/link';
import React, { useState } from 'react';

const Footer = () => {
  const [dropDowns, setDropDowns] = useState({
    propertyByCity: false,
    propertyTypes: false,
    aboutUs: false,
    contactUs: false,
  });
  
  const openCloseDropDowns = (key) => {
    setDropDowns((prev) => {
      const isAlreadyOpen = prev[key]; // Check if the key is already true
      return {
        ...Object.keys(prev).reduce((acc, k) => ({ ...acc, [k]: false }), {}), // Set all to false
        [key]: !isAlreadyOpen, // Toggle the clicked key
      };
    });
  };
  
  return (
    <footer>
      <div className="container">
        <div className="footer-top">
          <div className="row">
            {/* Property By City Section */}
            <div className="col-lg-3 col-sm-6 col-12">
              <div className="footer-links">
                <h4>
                  Property By City <a role='button' className={`icon-line-awesome-angle-${dropDowns?.propertyByCity ? "up": "down"}`} onClick={() => openCloseDropDowns("propertyByCity")}></a>
                </h4>
                <ul className="foot-nav" style={{display: dropDowns?.propertyByCity ? "block": ""}}>
                  <li><Link href="">Property in Abu Dhabi</Link></li>
                  <li><Link href="">Property in Ajman</Link></li>
                  <li><Link href="">Property in Dubai</Link></li>
                  <li><Link href="">Property in Fujairah</Link></li>
                  <li><Link href="">Property in Ras Al Khaimah</Link></li>
                  <li><Link href="">Property in Sharjah</Link></li>
                  <li><Link href="">Property in Umm Al-Quwain</Link></li>
                </ul>
              </div>
            </div>

            {/* Property Type Section */}
            <div className="col-lg-3 col-sm-6 col-12">
              <div className="footer-links">
                <h4>
                  Property Type <a role="button" className={`icon-line-awesome-angle-${dropDowns?.propertyTypes ? "up": "down"}`} onClick={() => openCloseDropDowns("propertyTypes")}></a>
                </h4>

                <ul className="foot-nav" style={{display: dropDowns?.propertyTypes ? "block": ""}}>
                  <li><Link href="/property-listing?post_for=sell&property_type=1&property_for=1">Flats</Link></li>
                  <li><Link href="/property-listing?post_for=sell&property_type=1&property_for=2">House/Villa</Link></li>
                  <li><Link href="/property-listing?post_for=sell&property_type=1&property_for=9">Penthouse</Link></li>
                  <li><Link href="/property-listing?post_for=sell&property_type=1&property_for=8">Residential Plots</Link></li>
                  <li><Link href="/property-listing?post_for=sell&property_type=2&property_for=3">Office Space</Link></li>
                  <li><Link href="/property-listing?post_for=sell&property_type=2&property_for=13">Shop/Showroom</Link></li>
                  <li><Link href="/property-listing?post_for=sell&property_type=2&property_for=15">Commercial Plot</Link></li>
                  {/* <li><Link href="#">Hotels</Link></li> */}
                </ul>
              </div>
            </div>

            {/* About Us Section */}
            <div className="col-lg-3 col-sm-6 col-12">
              <div className="footer-links">
                <h4>
                  About Us <a role="button" className={`icon-line-awesome-angle-${dropDowns?.aboutUs ? "up": "down"}`} onClick={() => openCloseDropDowns("aboutUs")}></a>
                </h4>

                <ul className="foot-nav" style={{display: dropDowns?.aboutUs ? "block": ""}} >
                  <li><Link href="#">About Us</Link></li>
                  <li><Link href="#">Blog</Link></li>
                  <li><Link href="#">Careers</Link></li>
                  <li><Link href="#">Contact Us</Link></li>
                  <li><Link href="#">Feedback</Link></li>
                  <li><Link href="#">Help Center</Link></li>
                  <li><Link href="#">Privacy Policy</Link></li>
                  <li><Link href="#">FAQs</Link></li>
                  <li><Link href="#">Terms & Conditions</Link></li>
                </ul>
              </div>
            </div>

            {/* Contact Us Section */}
            <div className="col-lg-3 col-sm-6 col-12">
              <div className="footer-links mb-4">
                <h4>
                  Contact Us <a role="button" className={`icon-line-awesome-angle-${dropDowns?.contactUs ? "up": "down"}`} onClick={() => openCloseDropDowns("contactUs")}></a>
                </h4>
                <ul className="foot-nav" style={{display: dropDowns?.contactUs ? "block": ""}}>
                  <a className="d-inline-block mb-3" href="index.php">
                    <img src="/assets/images/logo.png" alt="Logo" className="d-none d-md-block" />
                    <img src="/assets/images/logo-mobile.png" alt="Logo" className="d-md-none" />
                  </a>
                  <address>
                    <p><i className="icon-feather-map-pin"></i> 112 Salam Street, Abu Dhabi, UAE</p>
                    <p><i className="icon-feather-smartphone"></i> 9714-8833744</p>
                    <p><i className="icon-feather-mail"></i> info@companyname.com</p>
                  </address>
                </ul>
              </div>

              {/* Social Media Links */}
              <div className="footer-links mb-3">
                <ul className="social-links footer-social-links">
                  <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer" title="Facebook"><i className="icon-brand-facebook-f"></i></a></li>
                  <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" title="Twitter"><i className="icon-brand-twitter"></i></a></li>
                  <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" title="LinkedIn"><i className="icon-brand-linkedin-in"></i></a></li>
                  <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" title="Instagram"><i className="icon-brand-instagram"></i></a></li>
                  <li><a href="https://youtube.com" target="_blank" rel="noopener noreferrer" title="Youtube"><i className="icon-brand-youtube"></i></a></li>
                </ul>
              </div>

              {/* Download App Section */}
              <div className="download-app">
                <a href="#" className="ms-2"><img src="/assets/images/google-play.png" alt="Google Play" height="40" width="133" /></a>
                <a href="#" className="ms-2"><img src="/assets/images/app-store.png" alt="App Store" height="40" width="133" /></a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="copyright">
          <p>© Copyright 2022 Originatesoft.com Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
