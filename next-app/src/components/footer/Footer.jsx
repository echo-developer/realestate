"use client"
import React from 'react';

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="footer-top">
          <div className="row">
            {/* Property By City Section */}
            <div className="col-lg-3 col-sm-6 col-12">
              <div className="footer-links">
                <h4>
                  Property By City <a href="#" className="icon-line-awesome-angle-down"></a>
                </h4>
                <ul className="foot-nav">
                  <li><a href="">Property in Abu Dhabi</a></li>
                  <li><a href="">Property in Ajman</a></li>
                  <li><a href="">Property in Dubai</a></li>
                  <li><a href="">Property in Fujairah</a></li>
                  <li><a href="">Property in Ras Al Khaimah</a></li>
                  <li><a href="">Property in Sharjah</a></li>
                  <li><a href="">Property in Umm Al-Quwain</a></li>
                </ul>
              </div>
            </div>

            {/* Property Type Section */}
            <div className="col-lg-3 col-sm-6 col-12">
              <div className="footer-links">
                <h4>
                  Property Type <a href="#" className="icon-line-awesome-angle-down"></a>
                </h4>
                <ul className="foot-nav">
                  <li><a href="#">Flats</a></li>
                  <li><a href="#">House/Villa</a></li>
                  <li><a href="#">Penthouse</a></li>
                  <li><a href="#">Residential Plots</a></li>
                  <li><a href="#">Office Space</a></li>
                  <li><a href="#">Shop/Showroom</a></li>
                  <li><a href="#">Commercial Plot</a></li>
                  <li><a href="#">Hotels</a></li>
                </ul>
              </div>
            </div>

            {/* About Us Section */}
            <div className="col-lg-3 col-sm-6 col-12">
              <div className="footer-links">
                <h4>
                  About Us <a href="#" className="icon-line-awesome-angle-down"></a>
                </h4>
                <ul className="foot-nav">
                  <li><a href="#">About Us </a></li>
                  <li><a href="#">Blog</a></li>
                  <li><a href="#">Careers</a></li>
                  <li><a href="#">Contact Us</a></li>
                  <li><a href="#">Feedback</a></li>
                  <li><a href="#">Help Center</a></li>
                  <li><a href="#">Privacy Policy</a></li>
                  <li><a href="#">FAQs</a></li>
                  <li><a href="#">Terms & Conditions</a></li>
                </ul>
              </div>
            </div>

            {/* Contact Us Section */}
            <div className="col-lg-3 col-sm-6 col-12">
              <div className="footer-links mb-4">
                <h4>
                  Contact Us <a href="#" className="icon-line-awesome-angle-down"></a>
                </h4>
                <ul className="foot-nav">
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
