"use client"
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import useTranslation from '@/hooks/useTranslation';
import MobileFooter from '../addtional/MobileFooter';
import AuthUser from '../Authentication/AuthUser';
import { useAuth } from '@/context/AuthProvider';
import useIsMobile from '@/hooks/useIsMobile';

const Footer = () => {
  const { callApi } = AuthUser();
  const { adminDetails } = useAuth();
  const isMobile = useIsMobile();
  const [adminData, setAdminData] = useState({
    address: "",
    phone: "",
    email: "",
  })
  const [dropDowns, setDropDowns] = useState({
    propertyByCity: false,
    propertyTypes: false,
    aboutUs: false,
    contactUs: false,
  });

  useEffect(() => {
    if (adminDetails) {
      setAdminData({
        address: adminDetails?.admin_address,
        phone: adminDetails?.admin_whatsapp_number,
        email: adminDetails?.admin_email
      })
    }
  }, [adminDetails])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const admin = localStorage.getItem("admin");
      if (admin) {
        const adminDetails = JSON.parse(admin);
        setAdminData({
          address: adminDetails?.admin_address,
          phone: adminDetails?.admin_whatsapp_number,
          email: adminDetails?.admin_email
        })
      }
    }
  }, [])


  const translation = useTranslation();

  // useEffect(() => {
  //   getAdminPhone();
  //   getAdminEmail();
  //   getAdminAddress();
  // }, [])

  const openCloseDropDowns = (key) => {
    setDropDowns((prev) => {
      const isAlreadyOpen = prev[key]; // Check if the key is already true
      return {
        ...Object.keys(prev).reduce((acc, k) => ({ ...acc, [k]: false }), {}), // Set all to false
        [key]: !isAlreadyOpen, // Toggle the clicked key
      };
    });
  };

  // const getAdminPhone = async () => {
  //   try {
  //     const res = await callApi({
  //       api: `/get-settings-value/admin-whatsapp-number`,
  //       method: "GET",
  //     })
  //     if(res && res.status == 1) {
  //       setAdminData(prev => {
  //         return {
  //           ...prev,
  //           phone: res.value
  //         }
  //       })
  //     }
  //   } catch (error) {
  //     console.error(error.message)
  //   }
  // }

  // const getAdminEmail = async () => {
  //   try {
  //     const res = await callApi({
  //       api: `/get-settings-value/admin-email`,
  //       method: "GET"
  //     })
  //     if(res && res.status == 1) {
  //       setAdminData(prev => {
  //         return {
  //           ...prev,
  //           email: res.value
  //         }
  //       })
  //     }
  //   } catch (error) {
  //     console.error(error.message)
  //   }
  // }

  // const getAdminAddress = async () => {
  //   try {
  //     const res = await callApi({
  //       api: `/get-settings-value/admin-email`,
  //       method: "GET"
  //     })
  //     if(res && res.status == 1) {
  //       setAdminData(prev => {
  //         return {
  //           ...prev,
  //           address: res?.value
  //         }
  //       })
  //     }
  //   } catch (error) {
  //     console.error(error.message)
  //   }
  // }


  return (

    <>
      {isMobile && (
        <MobileFooter />
      )}
      <footer className='large-footer'>
        <div className="container">
          <div className="footer-top">
            <div className="row">
              {/* Property By City Section */}
              <div className="col-lg-3 col-sm-6 col-12">
                <div className="footer-links">
                  <h4>
                    {translation?.property_type || "Property Type"} <a role='button' className={`icon-line-awesome-angle-${dropDowns?.propertyByCity ? "up" : "down"}`} onClick={() => openCloseDropDowns("propertyByCity")}></a>
                  </h4>
                  <ul className="foot-nav" style={{ display: dropDowns?.propertyByCity ? "block" : "" }}>
                    <li><Link href="/property-listing?property_type=1">{translation?.residential || "Residential"} </Link></li>
                    <li><Link href="/property-listing?property_type=2">{translation?.commercial || "Residential"}</Link></li>
                    <li><Link href="/property-listing?property_type=4">{translation?.agricultural || "Agricultural"}</Link></li>
                  </ul>
                </div>
              </div>

              {/* Property Type Section */}
              <div className="col-lg-3 col-sm-6 col-12">
                <div className="footer-links">
                  <h4>
                    {translation?.property_for || "Property For "}<a role="button" className={`icon-line-awesome-angle-${dropDowns?.propertyTypes ? "up" : "down"}`} onClick={() => openCloseDropDowns("propertyTypes")}></a>
                  </h4>

                  <ul className="foot-nav" style={{ display: dropDowns?.propertyTypes ? "block" : "" }}>
                    <li><Link href="/property-listing?property_type=1&property_for=1">{translation?.flats || "Flats"}</Link></li>
                    <li><Link href="/property-listing?property_type=1&property_for=2">{translation?.house_villa || "House/Villa"}</Link></li>
                    <li><Link href="/property-listing?property_type=1&property_for=9">{translation?.penthouse || "Penthouse"}</Link></li>
                    <li><Link href="/property-listing?property_type=1&property_for=8">{translation?.residential_plots || "Residential Plots"}</Link></li>
                    <li><Link href="/property-listing?property_type=2&property_for=3">{translation?.office_space || "Office Space"}</Link></li>
                    <li><Link href="/property-listing?property_type=2&property_for=13">{translation?.shop_showroom || "Shop/Showroom"}</Link></li>
                    <li><Link href="/property-listing?property_type=2&property_for=15">{translation?.commercial_plot || "Commercial Plot"}</Link></li>
                    {/* <li><Link href="#">Hotels</Link></li> */}
                  </ul>
                </div>
              </div>

              {/* About Us Section */}
              <div className="col-lg-3 col-sm-6 col-12">
                <div className="footer-links">
                  <h4>
                    {translation?.about_us || "About Us"}  <a role="button" className={`icon-line-awesome-angle-${dropDowns?.aboutUs ? "up" : "down"}`} onClick={() => openCloseDropDowns("aboutUs")}></a>
                  </h4>

                  <ul className="foot-nav" style={{ display: dropDowns?.aboutUs ? "block" : "" }} >
                    <li><Link href="/about-us">{translation?.about_us || "About Us"}</Link></li>
                    {/* <li><Link href="#">Blog</Link></li> */}
                    {/* <li><Link href="#">Careers</Link></li> */}
                    <li><Link href="/contact-us">{translation?.contact_us || "Contact Us"}</Link></li>
                    <li><Link href="feedback">{translation?.feedback || "Feedback"}</Link></li>
                    {/* <li><Link href="/help-center">{translation?.help_center || "Help Center"}</Link></li> */}
                    <li><Link href="/privacy-policy">{translation?.privacy_policy || "Privacy Policy"}</Link></li>
                    <li><Link href="/faq">{translation?.faqs || "FAQs"}</Link></li>
                    <li><Link href="/term-conditions">{translation?.terms_condition || "Terms & Conditions"}</Link></li>
                    <li><Link href="/data-deletion-policy">{translation?.data_deletion_policy || "Data Deletion Policy"}</Link></li>
                  </ul>
                </div>
              </div>

              {/* Contact Us Section */}
              <div className="col-lg-3 col-sm-6 col-12">
                <div className="footer-links mb-4">
                  <h4>
                    {translation?.contact_us || "Contact Us"}<a role="button" className={`icon-line-awesome-angle-${dropDowns?.contactUs ? "up" : "down"}`} onClick={() => openCloseDropDowns("contactUs")}></a>
                  </h4>
                  <ul className="foot-nav" style={{ display: dropDowns?.contactUs ? "block" : "" }}>
                    <a className="d-inline-block mb-3" href="index.php">
                      <img src="/assets/images/logo.png" alt="Logo" className="d-none d-md-block" loading="lazy" />
                      <img src="/assets/images/logo-mobile.png" alt="Logo" className="d-md-none" loading="lazy" />
                    </a>
                    <address>
                      <p><i className="icon-feather-map-pin"></i> {adminData?.address ? adminData.address : ""}</p>
                      <p><i className="icon-feather-smartphone"></i> {adminData?.phone ? adminData.phone : ''}</p>
                      <p><i className="icon-feather-mail"></i> {adminData?.email ? adminData.email : ''}</p>
                    </address>
                  </ul>
                </div>

                {/* Social Media Links */}
                <div className="footer-links mb-3">
                  <ul className="social-links footer-social-links">
                    <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer" title="Facebook"><i className="icon-brand-facebook-f"></i></a></li>
                    <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" title="LinkedIn"><i className="icon-brand-linkedin-in"></i></a></li>
                    <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" title="Instagram"><i className="icon-brand-instagram"></i></a></li>
                    <li><a href="https://youtube.com" target="_blank" rel="noopener noreferrer" title="Youtube"><i className="icon-brand-youtube"></i></a></li>
                  </ul>
                </div>

                {/* Download App Section */}
                {/* <div className="download-app">
                <a href="" className="ms-2"><img src="/assets/images/google-play.png" alt="Google Play" height="40" width="133" loading="lazy"/></a>
                <a href="" className="ms-2"><img src="/assets/images/app-store.png" alt="App Store" height="40" width="133" loading="lazy"/></a>
              </div> */}
              </div>
            </div>
          </div>

          {/* Copyright Section */}
          <div className="copyright">
            <p>© Copyright 2022 Originatesoft.com Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
