"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import "../../app/globals.css";
import AuthUser from "../Authentication/AuthUser";
import Offcanvas from "react-bootstrap/Offcanvas";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { Collapse } from "react-bootstrap";
import { toast } from "react-toastify";
import { useRouter, usePathname } from "next/navigation";
import useTranslation from '@/hooks/useTranslation';

const Header = () => {
  const { callApi, isLogin, logout, GetMemberId } = AuthUser();
  
  const [showLocationDrop, setShowLocationDrop] = useState(false);
  const [mobileView, setMobileView] = useState(false);
  const [menu, setMenu] = useState("");
  const [isMobileView, setIsMobileView] = useState(false);
  const [cityData, setCityData] = useState([]);
  const [selectedCity, setSelectedCity] = useState("Kolkata");
  const [cityId, setCityId] = useState(1);
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [scrollState, setScrollState] = useState("header-sticky");
  const [offCanvasPropertyCrm, setOffCanvasPropertyCrm] = useState(false);
  let lastScrollY = window.scrollY;
  const router = useRouter();
  const translation = useTranslation();

  const memberId = GetMemberId();
  const [currentLang, setCurrentLang] = useState("en");


  useEffect(() => {
    const storedLang = localStorage.getItem("lang") || "en";
    setCurrentLang(storedLang);
  }, []);

  useEffect(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  const handleScroll = () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY === 0) {
      setScrollState(
        isHomePage ? "header-sticky transparentH" : "header-sticky"
      );
    } else if (currentScrollY > lastScrollY) {
      setScrollState("header-sticky header-fixed hidden-menu");
    } else {
      setScrollState("header-sticky header-fixed");
    }

    lastScrollY = currentScrollY;
  };

  useEffect(() => {
    FetchCityData();
  }, [memberId]);

  useEffect(() => {
    const city = localStorage.getItem("city");
    if (city) {
      const cityName = city ? JSON.parse(city)?.name : 1;
      const cityId = city ? JSON.parse(city)?.city_id : 1;
      setSelectedCity(cityName);
      setCityId(cityId);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        if (window?.innerWidth < 1200) {
          setIsMobileView(true);
        } else {
          setIsMobileView(false);
        }
      };

      window?.addEventListener("resize", handleResize);
      handleResize();
      return () => window?.removeEventListener("resize", handleResize);
    }
  }, []);

  const validLogin = isLogin();

  const FetchCityData = async () => {
    try {
      const response = await callApi({
        api: `/get_property_cities`,
        method: "GET",
      });
      if (response && response.status === 1) {
        setCityData(response.data);
      } else {
        toast.error(response.message);
      }
    } catch (error) {}
  };

  const handleShowLocationDropDown = () => {
    setShowLocationDrop((prev) => !prev);
  };

  const handleRightClick = (e) => {
    setShowLocationDrop(false);
  };
  useEffect(() => {
    document.addEventListener("contextmenu", handleRightClick);
    return () => {
      document.removeEventListener("contextmenu", handleRightClick);
    };
  }, []);

  const handleClose = () => setMobileView(false);

  const handleShow = (type) => {
    setMobileView(true);
    setMenu(type);
  };

  const handleLogout = () => {
    logout();
    setMobileView(false);
  };

  const changeLanguage = (lang) => {
    localStorage.setItem("lang", lang);
    setCurrentLang(lang);
    window.location.reload();
  };

  const handleSelectCity = (city) => {
    setSelectedCity(city?.name);
    setCityId(city?.id);
    setShowLocationDrop(false);
    localStorage.setItem("city", JSON.stringify(city));
  };

  const renderLink = (link) => {
    const location_data = JSON.stringify({ locality: selectedCity });

    const isProjectLink = link.includes("/project-listing");
    if (isProjectLink) {
      router.push("/project-listing");
    } else {
      if (location_data) {
        const separator = link.includes("?") ? "&" : "?";
        router.push(`${link}${separator}location_data=${location_data}`);
      } else {
        router.push(link);
      }
    }
  };

  const handlePropertyCrmClick = (e) => {
    if (e.currentTarget.getAttribute("data-id") === "property-crm") {
      setOffCanvasPropertyCrm(!offCanvasPropertyCrm);
    }
  };

  return (
    <>
      <header id="header-container" className={scrollState}>
        <nav className="navbar navbar-expand-xl">
          <div className="container-fluid position-relative">
            <div className="d-flex align-items-center">
              <Link href="/" className="navbar-brand">
                <img
                  src="/assets/images/logo.png"
                  alt="Logo"
                  className="d-none d-md-block"
                />
                <img
                  src="/assets/images/logo-mobile.png"
                  alt="Logo"
                  className="d-md-none"
                />
              </Link>

              <div className="dropdown ms-4">
                <button
                  className="btn btn-link dropdown-toggle text-decoration-none"
                  data-bs-toggle="dropdown"
                  aria-expanded={showLocationDrop ? "true" : "false"}
                  onClick={handleShowLocationDropDown}
                >
                  {selectedCity}
                </button>

                <ul
                  className={`dropdown-menu ${showLocationDrop ? "show" : ""}`}
                >
                  {cityData?.map((city) => (
                    <li key={city.city_id}>
                      <button
                        className="dropdown-item"
                        onClick={() => handleSelectCity(city)}
                      >
                        {city.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="d-flex">
              <div id="navigation">
                <ul
                  id="desk-nav"
                  className="navbar-nav me-lg-auto mb-2 mb-lg-0"
                >
                  {/* for buy */}
                  <li className="nav-item mega-menu">
                    <a className="nav-link dropdown-toggle" role="button">
                      {translation?.buy || "Buy"}
                    </a>
                    <div className="dropdown-full">
                      <ul className="dropdown-nav">
                        <li>
                          <span>
                            <h5 className="mb-0"> {translation?.popular_choices || "Popular Choices"}</h5>
                          </span>
                        </li>
                        <li>
                          <a
                            role="button"
                            onClick={() =>
                              renderLink(
                                `/property-listing?post_for=sell&property_type=1&searchData=${JSON.stringify(
                                  { possession_status: [3] }
                                )}`
                              )
                            }
                          >
                             {translation?.ready_to_move || "Ready to Move"}
                          </a>
                        </li>
                        <li>
                          <a
                            role="button"
                            onClick={() =>
                              renderLink(
                                `/property-listing?post_for=sell&property_type=1&searchData=${JSON.stringify(
                                  { posted_by: ["O"] }
                                )}`
                              )
                            }
                          >
                             {translation?.owner_properties || "Owner Properties"}
                          </a>
                        </li>
                        <li>
                          <a
                            role="button"
                            onClick={() =>
                              renderLink(
                                "/property-listing?sort_key=exp_price&sort_order=asc"
                              )
                            }
                          >
                             {translation?.budget_homes || "Budget Homes"}
                          </a>
                        </li>
                        <li>
                          <Link href="/project-listing">{translation?.new_projects || "New Projects"}</Link>
                        </li>
                      </ul>
                      <ul className="dropdown-nav">
                        <li>
                          <span>
                            <h5 className="mb-0">{translation?.property_types || "Property Types"}</h5>
                          </span>
                        </li>
                        <li>
                          <a
                            role="button"
                            onClick={() =>
                              renderLink(
                                "/property-listing?property_type=1&property_for=1"
                              )
                            }
                          >
                            {translation?.flat_for || "Flat for in"}{selectedCity || ""}
                          </a>
                        </li>
                        <li>
                          <a
                            role="button"
                            onClick={() =>
                              renderLink(
                                "/property-listing?property_type=1&property_for=2"
                              )
                            }
                          >
                             {translation?.villa_for || "Villa for in"}{selectedCity || ""}
                          </a>
                        </li>
                        <li>
                          <a
                            role="button"
                            onClick={() =>
                              renderLink(
                                "/property-listing?property_type=1&property_for=6"
                              )
                            }
                          >
                             {translation?.residential_house || "Residential House in"}{selectedCity || ""}
                          </a>
                        </li>
                        <li>
                          <a
                            role="button"
                            onClick={() =>
                              renderLink(
                                "/property-listing?property_type=2&property_for=3"
                              )
                            }
                          >
                            {translation?.offices || "Offices in"}{selectedCity || ""}
                          </a>
                        </li>
                        <li>
                          <a
                            role="button"
                            onClick={() =>
                              renderLink(
                                "/property-listing?post_for=sell&property_type=2&property_for=11"
                              )
                            }
                          >
                            {translation?.commercial_office_space || "Commercial Office Space in"} {selectedCity || ""}
                          </a>
                        </li>
                        <li>
                          <a
                            role="button"
                            onClick={() =>
                              renderLink(
                                "/property-listing?property_type=1&property_for=7"
                              )
                            }
                          >
                             {translation?.builder_floor_apartment || "Builder Floor Apartment in"} {selectedCity || ""}
                          </a>
                        </li>
                        <li>
                          <a
                            role="button"
                            onClick={() =>
                              renderLink(
                                "/property-listing?property_type=2&property_for=12"
                              )
                            }
                          >
                           {translation?.office_in_it_park || "Office in IT Park\/ SEZ in"}  {selectedCity || ""}
                          </a>
                        </li>
                      </ul>
                      <ul className="dropdown-nav">
                        <li>
                          <span>
                            <h5 className="mb-0">{translation?.budget || "Budget"}  </h5>
                          </span>
                        </li>
                        <li>
                          {/* max_budget */}
                          <a
                            role="button"
                            onClick={() =>
                              renderLink(
                                `/property-listing?post_for=sell&property_type=1&searchData=${JSON.stringify(
                                  { max_budget: 399 }
                                )}`
                              )
                            }
                          >
                            {translation?.under_aed_399 || "Under AED 399.00"}
                          </a>
                        </li>
                        <li>
                          <a
                            role="button"
                            onClick={() =>
                              renderLink(
                                `/property-listing?post_for=sell&property_type=1&searchData=${JSON.stringify(
                                  { min_budget: 400, max_budget: 699 }
                                )}`
                              )
                            }
                          >
                            AED400.00 - AED699.00
                          </a>
                        </li>
                        <li>
                          <a
                            role="button"
                            onClick={() =>
                              renderLink(
                                `/property-listing?post_for=sell&property_type=1&searchData=${JSON.stringify(
                                  { min_budget: 700, max_budget: 1199 }
                                )}`
                              )
                            }
                          >
                            AED700.00 - AED1199.00
                          </a>
                        </li>
                        <li>
                          <a
                            role="button"
                            onClick={() =>
                              renderLink(
                                `/property-listing?post_for=sell&property_type=1&searchData=${JSON.stringify(
                                  { min_budget: 1200, max_budget: 1599 }
                                )}`
                              )
                            }
                          >
                            AED1200.00 - AED1599.00
                          </a>
                        </li>
                        <li>
                          <a
                            role="button"
                            onClick={() =>
                              renderLink(
                                `/property-listing?post_for=sell&property_type=1&searchData=${JSON.stringify(
                                  { min_budget: 1600 }
                                )}`
                              )
                            }
                          >
                            {translation?.above_aed_1600 || "Above AED1600.00"}
                          </a>
                        </li>
                      </ul>
                      <ul className="dropdown-nav">
                        <li>
                          <span>
                            <h5 className="mb-0">{translation?.explore || "Explore"}</h5>
                          </span>
                        </li>
                        <li>
                          <Link href="/agent-list">{translation?.find_an_agent || "Find an Agent"}</Link>
                        </li>
                        <li>
                          <Link href="/project-listing">
                          {translation?.projects_in || "Projects in"} {selectedCity || "Kolkata"}
                          </Link>
                        </li>
                        <li>
                          <Link href="#">
                          {translation?.popular_locality || "Popular Locaity in"}  {selectedCity || "Kolkata"}
                          </Link>
                        </li>
                        <li>
                          <Link href="/property-valuation">
                          {translation?.property_valuation || "Property Valuation in"}  {selectedCity || "Kolkata"}
                          </Link>
                        </li>
                        <li>
                          <Link href="#">
                          {translation?.top_agents || "Top Agents in"} {selectedCity || "Kolkata"}
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </li>
                  {/* for rent  */}
                  <li className="nav-item mega-menu">
                    <a className="nav-link dropdown-toggle" role="button">
                    {translation?.rent || "Rent"}
                    </a>
                    <div className="dropdown-full">
                      <ul className="dropdown-nav">
                        <li>
                          <span>
                            <h5 className="mb-0">  {translation?.popular_choices || "Popular Choices"}</h5>
                          </span>
                        </li>
                        <li>
                          <a
                            role="button"
                            onClick={() =>
                              renderLink(
                                `/property-listing?post_for=rent&property_type=1&searchData=${JSON.stringify(
                                  { posted_by: ["O"] }
                                )}`
                              )
                            }
                          >
                             {translation?.owner_properties || "Owner Properties"}
                          </a>
                        </li>
                        <li>
                          <a
                            role="button"
                            onClick={() =>
                              renderLink(
                                `/property-listing?post_for=rent&property_type=1&searchData=${JSON.stringify(
                                  { furnishing: [1] }
                                )}`
                              )
                            }
                          >
                            {translation?.furnished_properties || "Furnished Properties"}
                          </a>
                        </li>
                        <li>
                          <a
                            role="button"
                            onClick={() =>
                              renderLink(
                                `/property-listing?post_for=rent&property_type=1&searchData=${JSON.stringify(
                                  { furnishing: [2] }
                                )}`
                              )
                            }
                          >
                            {translation?.semi_furnished_properties || "Semi Furnished Properties"}
                          </a>
                        </li>
                        <li>
                          <a
                            role="button"
                            onClick={() =>
                              renderLink(
                                `/property-listing?post_for=rent&property_type=1&searchData=${JSON.stringify(
                                  { possession_status: [3] }
                                )}`
                              )
                            }
                          >
                            {translation?.immediately_available || "Immediately Available"}
                          </a>
                        </li>
                      </ul>
                      <ul className="dropdown-nav">
                        <li>
                          <span>
                            <h5 className="mb-0">{translation?.property_types || "Property Types"}</h5>
                          </span>
                        </li>
                        <li>
                          <a
                            role="button"
                            onClick={() =>
                              renderLink(
                                "/property-listing?post_for=rent&property_type=1&property_for=1"
                              )
                            }
                          >
                            {translation?.villa_for_rent || "Flat for rent in"} {selectedCity || ""}
                          </a>
                        </li>
                        <li>
                          <a
                            role="button"
                            onClick={() =>
                              renderLink(
                                "/property-listing?post_for=rent&property_type=1&property_for=2"
                              )
                            }
                          >
                             {translation?.flat_for_rent || "Villa for rent in"} {selectedCity || ""}
                          </a>
                        </li>
                        <li>
                          <a
                            role="button"
                            onClick={() =>
                              renderLink(
                                "/property-listing?post_for=rent&property_type=1&property_for=6"
                              )
                            }
                          >
                           {translation?.residential_house_rent || "Residential House for rent in"} {selectedCity || ""}
                          </a>
                        </li>
                        <li>
                          <a
                            role="button"
                            onClick={() =>
                              renderLink(
                                "/property-listing?post_for=rent&property_type=2&property_for=3"
                              )
                            }
                          >
                            {translation?.offices_for_rent || "Offices for rent in"} {selectedCity || ""}
                          </a>
                        </li>
                        <li>
                          <a
                            role="button"
                            onClick={() =>
                              renderLink(
                                "/property-listing?post_for=rent&property_type=2&property_for=11"
                              )
                            }
                          >
                            {translation?.commercial_office_space_rent || "Commercial Office Space for rent in"}{" "}
                            {selectedCity || ""}
                          </a>
                        </li>
                        <li>
                          <a
                            role="button"
                            onClick={() =>
                              renderLink(
                                "/property-listing?post_for=rent&property_type=1&property_for=7"
                              )
                            }
                          >
                            {translation?.builder_floor_apartment_rent || "Builder Floor Apartment for rent in"}{" "}
                            {selectedCity || ""}
                          </a>
                        </li>
                        <li>
                          <a
                            role="button"
                            onClick={() =>
                              renderLink(
                                "/property-listing?post_for=rent&property_type=2&property_for=12"
                              )
                            }
                          >
                            {translation?.builder_floor_apartment_rent || "Builder Floor Apartment for rent in"}{" "}
                            {selectedCity || ""}
                          </a>
                        </li>
                      </ul>
                      <ul className="dropdown-nav">
                        <li>
                          <span>
                            <h5 className="mb-0">{translation?.budget || "Budget"}</h5>
                          </span>
                        </li>
                        <li>
                          <a
                            role="button"
                            onClick={() =>
                              renderLink(
                                `/property-listing?post_for=rent&property_type=1&searchData=${JSON.stringify(
                                  { max_budget: 399 }
                                )}`
                              )
                            }
                          >
                           {translation?.under_aed_399 || "Under AED 399.00"}
                          </a>
                        </li>
                        <li>
                          <a
                            role="button"
                            onClick={() =>
                              renderLink(
                                `/property-listing?post_for=rent&property_type=1&searchData=${JSON.stringify(
                                  { min_budget: 400, max_budget: 699 }
                                )}`
                              )
                            }
                          >
                            AED400.00 - AED699.00
                          </a>
                        </li>
                        <li>
                          <a
                            role="button"
                            onClick={() =>
                              renderLink(
                                `/property-listing?post_for=rent&property_type=1&searchData=${JSON.stringify(
                                  { min_budget: 700, max_budget: 1199 }
                                )}`
                              )
                            }
                          >
                            AED700.00 - AED1199.00
                          </a>
                        </li>
                        <li>
                          <a
                            role="button"
                            onClick={() =>
                              renderLink(
                                `/property-listing?post_for=rent&property_type=1&searchData=${JSON.stringify(
                                  { min_budget: 1200, max_budget: 1599 }
                                )}`
                              )
                            }
                          >
                            AED1200.00 - AED1599.00
                          </a>
                        </li>
                        <li>
                          <a
                            role="button"
                            onClick={() =>
                              renderLink(
                                `/property-listing?post_for=rent&property_type=1&searchData=${JSON.stringify(
                                  { min_budget: 1600 }
                                )}`
                              )
                            }
                          >
                            {translation?.above_aed_1600 || "Above AED1600.00"}
                          </a>
                        </li>
                      </ul>
                      <ul className="dropdown-nav">
                        <li>
                          <span>
                            <h5 className="mb-0">{translation?.explore || "Explore"}</h5>
                          </span>
                        </li>
                        <li>
                          <Link href="/agent-list">{translation?.find_an_agent || "Find an Agent"}</Link>
                        </li>
                        <li>
                          <Link href="/rent-agreement">{translation?.rent_agreement || "Rent Agreement"}</Link>
                        </li>
                      </ul>
                    </div>
                  </li>
                  {/* for sell  */}
                  <li className="nav-item mega-menu">
                    <a className="nav-link dropdown-toggle" role="button">
                    {translation?.sell || "Sell"}
                    </a>
                    <div className="dropdown-full">
                      <ul className="dropdown-nav">
                        <li>
                          <span>
                            <h5 className="mb-0">{translation?.for_owner || "For Owner"}</h5>
                          </span>
                        </li>
                        <li>
                          <Link href="/postproperty">{translation?.post_property_free || "Post Property Free"}</Link>
                        </li>
                        <li>
                          <Link href="/dashboard">{translation?.my_dashboard || "My Dashboard"}</Link>
                        </li>
                        <li>
                          <Link href="#">{translation?.sell_rent_ad_packages || "Sell / Rent Ad Packages"}</Link>
                        </li>
                      </ul>
                      <ul className="dropdown-nav">
                        <li>
                          <span>
                            <h5 className="mb-0">{translation?.for_agent_builder || "For Agent & Builder"}</h5>
                          </span>
                        </li>
                        <li>
                          <Link href="/dashboard">{translation?.my_dashboard || "My Dashboard"}</Link>
                        </li>
                        <li>
                          <Link href="#">{translation?.ad_packages || "Ad Packages"}</Link>
                        </li>
                        <li>
                          <Link href="/sales-enquiry">{translation?.sales_enquiry || "Sales Enquiry"}</Link>
                        </li>
                      </ul>
                      <ul className="dropdown-nav">
                        <li>
                          <span>
                            <h5 className="mb-0">{translation?.selling_tools || "Selling Tools"}</h5>
                          </span>
                        </li>
                        <li>
                          <Link href="/property-valuation">
                          {translation?.property_valuation || "Property Valuation In"}
                          </Link>
                        </li>
                        <li>
                          <Link href="/agent-list">{translation?.find_an_agent || "Find an Agent"}</Link>
                        </li>
                      </ul>
                    </div>
                  </li>
                  {/* for agent  */}
                  <li className="nav-item">
                    <Link href="/agent-list" className="">
                    {translation?.agents || "Agents"}
                    </Link>
                  </li>

                  {validLogin || "1" ? (
                    <React.Fragment>
                      <li className="nav-item">
                        <a className="nav-link dropdown-toggle" href="#">
                        {translation?.help || "Help"}
                        </a>
                        <ul className="dropdown-single dropdown-nav">
                          <li>
                            <a href="/help-center">{translation?.help_center || "Help Center"}</a>
                          </li>
                          <li>
                            <a href="/sales-enquiry">{translation?.sales_enquiry || "Sales Enquiry"}</a>
                          </li>
                        </ul>
                      </li>
                      <li className="nav-item me-lg-3">
                        <a className="nav-link dropdown-toggle" href="#">
                          <i className="icon-feather-user"></i> {translation?.my_account || "My Account"}
                        </a>
                        <ul className="dropdown-single dropdown-nav account-menu">
                          <li>
                            <a href="/dashboard">{translation?.dashboard || "Dashboard"}</a>
                          </li>
                          <li>
                            <Link href="/my-profile">{translation?.my_profile || "My Profile"}</Link>
                          </li>
                          <li>
                            <Link href="/" onClick={logout}>
                            {translation?.logout || "Logout"}
                            </Link>
                          </li>
                        </ul>
                      </li>
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <li className="nav-item">
                        <Link
                          href="/login"
                          className="btn btn-outline-primary mt-3 ms-3"
                        >
                          {translation?.log_in || "Log In"}
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link
                          href="/register"
                          className="btn btn-outline-primary mt-3 ms-3"
                        >
                           {translation?.sign_up || "Sign Up"}
                        </Link>
                      </li>
                    </React.Fragment>
                  )}

                  <li className="nav-item mt-2 ms-3">
                    <Link
                      href="/postproperty"
                      className="btn btn-primary btn-post"
                    >
                      <i className="icon-line-awesome-mouse-pointer"></i> {translation?.post_property_free || "Post Property"}{" "}
                      <img
                        src="/assets/images/icons/free-badge.png"
                        alt="Free Badge"
                        height="28"
                        width="28"
                      />
                    </Link>
                  </li>
                  {/* language  */}
                  <li className="nav-item ms-3 setlang">
                    <a className="nav-link dropdown-toggle" role="button">
                      <img
                        src={`/assets/images/flags/${
                          currentLang === "ar"
                            ? "ae"
                            : currentLang === "de"
                            ? "de"
                            : "gb"
                        }.svg`}
                        alt={currentLang.toUpperCase()}
                        height="20"
                        width="20"
                      />{" "}
                      {currentLang === "ar"
                        ? "Arabic"
                        : currentLang === "de"
                        ? "German"
                        : "English"}
                    </a>
                    <ul className="dropdown-single dropdown-nav dropdown-menu-end">
                      <li className={currentLang === "en" ? "active" : ""}>
                        <a role="button" onClick={() => changeLanguage("en")}>
                          <img
                            src="/assets/images/flags/gb.svg"
                            alt="English"
                            height="16"
                            width="16"
                          />{" "}
                          English
                        </a>
                      </li>
                      <li className={currentLang === "ar" ? "active" : ""}>
                        <a role="button" onClick={() => changeLanguage("ar")}>
                          <img
                            src="/assets/images/flags/ae.svg"
                            alt="Arabic"
                            height="16"
                            width="16"
                          />{" "}
                          Arabic
                        </a>
                      </li>
                      <li className={currentLang === "de" ? "active" : ""}>
                        <a role="button" onClick={() => changeLanguage("de")}>
                          <img
                            src="/assets/images/flags/de.svg"
                            alt="German"
                            height="16"
                            width="16"
                          />{" "}
                          German
                        </a>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
              {isMobileView && (
                <span
                  className="mmenu-trigger"
                  onClick={() => handleShow("header_menu")}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ fontSize: "20px", marginLeft: "10px" }}>
                    <BsThreeDotsVertical />
                  </div>
                </span>
              )}

              <span
                className="mmenu-trigger"
                onClick={() => handleShow("dashboard_menu")}
              >
                <button className="hamburger hamburger--collapse" type="button">
                  <span className="hamburger-box">
                    <span className="hamburger-inner"></span>
                  </span>
                </button>
              </span>
            </div>
          </div>
        </nav>
      </header>
      <Offcanvas show={mobileView} onHide={handleClose}>
        <Offcanvas.Header closeButton className="border-bottom">
          <Link href={`/`}>
            <Offcanvas.Title>{translation?.real_estate || "RealEstate"}</Offcanvas.Title>
          </Link>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {menu === "dashboard_menu" && (
            <>
              {memberId || "1" ? (
                <ul className="user-nav">
                  <li>
                    <Link href="/dashboard" className="active">
                      <i className="bi bi-speedometer"></i>{" "}
                      <span>{translation?.dashboard || "Dashboard"}</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/my-profile">
                      <i className="bi bi-person"></i> <span>{translation?.profile || "Profile"}</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/review-list">
                      <i className="bi bi-chat-right-quote"></i>{" "}
                      <span>{translation?.reviews || "Reviews"}</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/message">
                      <i className="bi bi-chat-square-text"></i>{" "}
                      <span>{translation?.message || "Message"}</span>
                    </Link>
                  </li>

                  <li
                    className={`dropdown ${offCanvasPropertyCrm ? "open" : ""}`}
                    data-id="property-crm"
                    onClick={handlePropertyCrmClick}
                  >
                    <Link
                      href="#"
                      className="nav-toggle-1"
                      aria-expanded="true"
                    >
                      <i className="bi bi-building"></i>{" "}
                      <span>{translation?.property_crm || "Property CRM"}</span>
                      <i
                        className={`icon-line-awesome-angle-${
                          offCanvasPropertyCrm ? "up" : "down"
                        } ms-auto`}
                        data-id="property-crm"
                      ></i>
                    </Link>
                    <ul
                      className="nav-hide-menu"
                      id="hide-menu-1"
                      style={{
                        display: offCanvasPropertyCrm ? "block" : "none",
                      }}
                    >
                      <li>
                        <Link href="/property-crm">
                          <i className="icon-line-awesome-arrow-right"></i>{" "}
                          {translation?.leads || "Leads"}
                        </Link>
                      </li>
                    </ul>
                  </li>

                  <li>
                    <Link href="/my-property-listing">
                      <i className="bi bi-bookmark-star"></i>{" "}
                      <span> {translation?.my_properties || "My Properties"}</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/my-project">
                      <i className="bi bi-bookmark-star"></i>{" "}
                      <span>{translation?.my_projects || "My Projects"}</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/my-favourite-list">
                      <i className="bi bi-bookmark-star"></i>{" "}
                      <span>{translation?.my_property_favourites || "My Property Favourites"}</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/my-project-favourite-list">
                      <i className="bi bi-bookmark-star"></i>{" "}
                      <span>{translation?.my_project_favourites || "My Project Favourites"}</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/membership">
                      <i className="bi bi-box"></i> <span>{translation?.packages || "Packages"}</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/enquiry-list">
                      <i className="bi bi-bookmark-star"></i>{" "}
                      <span>{translation?.enquiries || "Enquiries"}</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/report">
                      <i className="bi bi-cursor"></i> <span>{translation?.user_report || "User Report"}</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/update-password">
                      <i className="bi bi-lock"></i>{" "}
                      <span>{translation?.change_password || "Change Password"}</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right"></i>{" "}
                      <span>{translation?.logout || "Logout"}</span>
                    </Link>
                  </li>
                </ul>
              ) : (
                <>
                  <ul className="user-nav">
                    <li>
                      <Link href="/login" className="active">
                        <i className="bi bi-speedometer"></i> <span>{translation?.login || "Login"}</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/register" className="active">
                        <i className="bi bi-speedometer"></i>{" "}
                        <span>{translation?.register || "Register"}</span>
                      </Link>
                    </li>
                  </ul>
                </>
              )}
            </>
          )}

          {menu === "header_menu" && <Menu />}

          <style>
            {`
    li:hover > ul li{
    color: "#3d3838"
    }
  `}
          </style>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Header;

const Menu = () => {
  const [openMenus, setOpenMenus] = useState({}); // Object to store state for main and sub collapses

  const toggleMenu = (menuName) => {
    setOpenMenus((prevState) => ({
      ...prevState,
      [menuName]: prevState[menuName] ? null : true, // Toggle the specific menu state
    }));
  };

  const selectedCity = "Kolkata";
  const menuData = [
    {
      name: "Buy",
      options: [
        {
          name: "Popular Choices",
          links: [
            {
              text: "Ready to Move",
              url: `/property-listing?post_for=sell&property_type=1&searchData=${JSON.stringify(
                { possession_status: [3] }
              )}`,
            },
            {
              text: "Owner Properties",
              url: `/property-listing?post_for=sell&property_type=1&searchData=${JSON.stringify(
                { posted_by: ["O"] }
              )}`,
            },
            {
              text: "Budget Homes",
              url: "/property-listing?sort_key=exp_price&sort_order=asc",
            },
            { text: "New Projects", url: "/project-listing" },
          ],
        },
        {
          name: "Property Types",
          links: [
            {
              text: `Flat for in ${selectedCity || ""} `,
              url: "/property-listing?property_type=1&property_for=1",
            },
            {
              text: `Villa for in ${selectedCity || ""} `,
              url: "/property-listing?property_type=1&property_for=2",
            },
            {
              text: `Residential House for in ${selectedCity || ""} `,
              url: "/property-listing?property_type=1&property_for=6",
            },
            {
              text: `Offices in ${selectedCity || ""} `,
              url: "/property-listing?property_type=2&property_for=3",
            },
            {
              text: `Commercial Office Space in ${selectedCity || ""} `,
              url: "/property-listing?post_for=sell&property_type=2&property_for=11",
            },
            {
              text: `Builder Floor Apartment in ${selectedCity || ""} `,
              url: "/property-listing?property_type=1&property_for=7",
            },
            {
              text: `Office in IT Park\/ SEZ in ${selectedCity || ""} `,
              url: "/property-listing?property_type=2&property_for=12",
            },
          ],
        },
        {
          name: "Budget",
          links: [
            {
              text: "Under AED 399.00",
              url: `/property-listing?post_for=sell&property_type=1&searchData=${JSON.stringify(
                { max_budget: 399 }
              )}`,
            },
            {
              text: "AED400.00 - AED699.00",
              url: `/property-listing?post_for=sell&property_type=1&searchData=${JSON.stringify(
                { min_budget: 400, max_budget: 699 }
              )}`,
            },
            {
              text: "AED700.00 - AED1199.00",
              url: `/property-listing?post_for=sell&property_type=1&searchData=${JSON.stringify(
                { min_budget: 700, max_budget: 1199 }
              )}`,
            },
            {
              text: "AED1200.00 - AED1599.00",
              url: `/property-listing?post_for=sell&property_type=1&searchData=${JSON.stringify(
                { min_budget: 1200, max_budget: 1599 }
              )}`,
            },
            {
              text: "Above AED1600.00",
              url: `/property-listing?post_for=sell&property_type=1&searchData=${JSON.stringify(
                { min_budget: 1600 }
              )}`,
            },
          ],
        },
        {
          name: "Explore",
          links: [
            { text: "Find an Agent", url: "/agent-list" },
            {
              text: `Projects in ${selectedCity || "Kolkata"}`,
              url: "/project-listing",
            },
            {
              text: `Popular Locaity in ${selectedCity || "Kolkata"}`,
              url: "#",
            },
            {
              text: `Property Valuation in ${selectedCity || "Kolkata"}`,
              url: "/property-valuation",
            },
            { text: `Top Agents in ${selectedCity || "Kolkata"}`, url: "#" },
          ],
        },
      ],
    },
    {
      name: "Rent",
      options: [
        {
          name: "Popular Choices",
          links: [
            {
              text: "Owner Properties",
              url: `/property-listing?post_for=rent&property_type=1&searchData=${JSON.stringify(
                { posted_by: ["O"] }
              )}`,
            },
            {
              text: "Furnished Properties",
              url: `/property-listing?post_for=rent&property_type=1&searchData=${JSON.stringify(
                { furnishing: [1] }
              )}`,
            },
            {
              text: "Semi Furnished Properties",
              url: `/property-listing?post_for=rent&property_type=1&searchData=${JSON.stringify(
                { furnishing: [2] }
              )}`,
            },
            {
              text: "Immediately Available",
              url: `/property-listing?post_for=rent&property_type=1&searchData=${JSON.stringify(
                { possession_status: [3] }
              )}`,
            },
          ],
        },
        {
          name: "Property Types",
          links: [
            {
              text: `Flat for rent in ${selectedCity || ""}`,
              url: "/property-listing?post_for=rent&property_type=1&property_for=1",
            },
            { text: `Villa for rent in ${selectedCity || ""}`, url: "#" },
            {
              text: `Residential House for rent in ${selectedCity || ""}`,
              url: "/property-listing?post_for=rent&property_type=1&property_for=2",
            },
            {
              text: `Offices for rent in ${selectedCity || ""}`,
              url: "/property-listing?post_for=rent&property_type=2&property_for=3",
            },
            {
              text: `Commercial Office Space for rent in ${selectedCity || ""}`,
              url: "/property-listing?post_for=rent&property_type=2&property_for=11",
            },
            {
              text: `Builder Floor Apartment for rent in ${selectedCity || ""}`,
              url: "/property-listing?post_for=rent&property_type=1&property_for=7",
            },
            {
              text: `Office in IT Park\/ SEZ for rent in ${selectedCity || ""}`,
              url: "/property-listing?post_for=rent&property_type=2&property_for=12",
            },
          ],
        },
        {
          name: "Budget",
          links: [
            {
              text: "Under AED 399.00",
              url: `/property-listing?post_for=rent&property_type=1&searchData=${JSON.stringify(
                { max_budget: 399 }
              )}`,
            },
            {
              text: "AED400.00 - AED699.00",
              url: `/property-listing?post_for=rent&property_type=1&searchData=${JSON.stringify(
                { min_budget: 400, max_budget: 699 }
              )}`,
            },
            {
              text: "AED700.00 - AED1199.00",
              url: `/property-listing?post_for=rent&property_type=1&searchData=${JSON.stringify(
                { min_budget: 700, max_budget: 1199 }
              )}`,
            },
            {
              text: "AED1200.00 - AED1599.00",
              url: `/property-listing?post_for=rent&property_type=1&searchData=${JSON.stringify(
                { min_budget: 1200, max_budget: 1599 }
              )}`,
            },
            {
              text: "Above AED1600.00",
              url: `/property-listing?post_for=rent&property_type=1&searchData=${JSON.stringify(
                { min_budget: 1600 }
              )}`,
            },
          ],
        },
        {
          name: "Explore",
          links: [
            { text: "Find an Agent", url: "/agent-list" },
            { text: "Localities", url: "/rent-agreement" },
          ],
        },
      ],
    },
    {
      name: "Sell",
      options: [
        {
          name: "For Owner",
          links: [
            { text: "Post Property Free", url: "/postproperty" },
            { text: "My Dashboard", url: "/dashboard" },
            { text: "Sell / Rent Ad Packages", url: "/membership" },
          ],
        },
        {
          name: "For Agent & Builder",
          links: [
            { text: "My Dashboard", url: "/dashboard" },
            { text: "Ad Packages", url: "/membership" },
            { text: "Sales Enquiry", url: "/sales-enquiry" },
          ],
        },
        {
          name: "Selling Tools",
          links: [
            { text: "Property Valuation", url: "/property-valuation" },
            { text: "Find an Agent", url: "/agent-list" },
          ],
        },
      ],
    },

    {
      name: "Help",
      options: [
        { text: "Help Center", url: "/help-center" },
        { text: "Sales Enquiry", url: "/sales-enquiry" },
      ],
    },
  ];

  return (
    <ul style={{ listStyleType: "none", padding: "0" }}>
      {menuData.map((item) => (
        <li key={item.name} style={{ padding: "10px", cursor: "pointer" }}>
          <div
            onClick={() => toggleMenu(item.name)}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {item.name}
            {openMenus[item.name] ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          <Collapse in={openMenus[item.name]}>
            <ul
              style={{
                padding: "10px",
                listStyleType: "none",
                backgroundColor: "transparent",
              }}
            >
              {item.options.map((option, index) => (
                <li key={index} style={{ padding: "5px 0" }}>
                  {option.name ? (
                    <>
                      <div
                        onClick={() => toggleMenu(option.name)}
                        style={{
                          cursor: "pointer",
                        }}
                      >
                        {option.name}
                        {openMenus[option.name] ? (
                          <FaChevronUp />
                        ) : (
                          <FaChevronDown />
                        )}
                      </div>
                      <Collapse in={openMenus[option.name]}>
                        <ul
                          style={{
                            padding: "10px",
                            listStyleType: "none",
                          }}
                        >
                          {option.links.map((link, linkIndex) => (
                            <li key={linkIndex} style={{ padding: "5px 0" }}>
                              <a href={link.url}>{link.text}</a>
                            </li>
                          ))}
                        </ul>
                      </Collapse>
                    </>
                  ) : (
                    <a href={option.url}>{option.text}</a>
                  )}
                </li>
              ))}
            </ul>
          </Collapse>
        </li>
      ))}
    </ul>
  );
};
