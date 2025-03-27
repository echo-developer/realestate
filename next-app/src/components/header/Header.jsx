"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import "../../app/globals.css";
import AuthUser from "../Authentication/AuthUser";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { Collapse } from "react-bootstrap";
import { toast } from "react-toastify";
import { useRouter, usePathname } from "next/navigation";
import useTranslation from "@/hooks/useTranslation";
import { useAuth } from "@/context/AuthProvider";
import MobileMenu from "../addtional/Mmenu";

const Header = () => {
  const { callApi, isLogin, logout, GetMemberId } = AuthUser();
  const { defaultCity, handleDefaultCityChange } = useAuth();
  const [isDesktopLogoLoaded, setIsDesktopLogoLoaded] = useState(false);
  const [isMobileLogoLoaded, setIsMobileLogoLoaded] = useState(false);
  const [showLocationDrop, setShowLocationDrop] = useState(false);
  const [mobileView, setMobileView] = useState(false);
  const [menu, setMenu] = useState(false);
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
  const [validLogin, setValidLogin] = useState(false);
  const [userData, setUserData] = useState();
  const memberId = GetMemberId();
  const [currentLang, setCurrentLang] = useState("en");

  useEffect(() => {
    const storedLang = localStorage.getItem("lang") || "en";
    setCurrentLang(storedLang);
  }, []);

  useEffect(() => {
    if (memberId) {
      FetchUserData(memberId);
      setValidLogin(true);
    }
  }, []);

  const FetchUserData = async (memberId) => {
    let response;
    try {
      response = await callApi({
        api: `/get_user_data`,
        method: "GET",
        data: {
          member_id: memberId,
        },
      });
      if (response && response.success === 1) {
        setUserData(response.data);
        setUserLogo(response?.data?.image);
      } else {
        toast.error(response.message);
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (defaultCity) {
      setSelectedCity(defaultCity?.name);
      setCityId(defaultCity?.city_id);
    }
  }, [defaultCity]);

  useEffect(() => {
    if (typeof window !== "undefined") {
    }
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

  const handleLogout = (e) => {
    e.preventDefault();
    logout();

    if (window.location.pathname === "/") {
      window.location.reload();
    } else {
      router.push("/");
    }
  };

  const changeLanguage = (lang) => {
    localStorage.setItem("lang", lang);
    setCurrentLang(lang);
    window.location.reload();
  };

  const renderLink = (link) => {
    const isProjectLink = link.includes("/project-listing");
    if (isProjectLink) {
      router.replace("/project-listing");
    } else {
      router.replace(link);
    }
  };

  const handlePropertyCrmClick = (e) => {
    if (e.currentTarget.getAttribute("data-id") === "property-crm") {
      setOffCanvasPropertyCrm(!offCanvasPropertyCrm);
    }
  };

  useEffect(() => {
    const desktopImage = new Image();
    desktopImage.src = "/assets/images/logo.png";
    desktopImage.onload = () => setIsDesktopLogoLoaded(true);
    desktopImage.onerror = () => setIsDesktopLogoLoaded(false);

    const mobileImage = new Image();
    mobileImage.src = "/assets/images/logo-mobile.png";
    mobileImage.onload = () => setIsMobileLogoLoaded(true);
    mobileImage.onerror = () => setIsMobileLogoLoaded(false);
  }, []);

  return (
    <>
      <header id="header-container" className={scrollState}>
        <nav className="navbar navbar-expand-xl">
          <div className="container-fluid position-relative">
            <div className="d-flex align-items-center">
              <Link href="/" className="navbar-brand">
                {/* Desktop Logo with Shimmer */}
                <div
                  className="d-none d-md-block"
                  style={{
                    width: "173px",
                    height: "64px",
                    position: "relative",
                  }}
                >
                  {!isDesktopLogoLoaded && (
                    <div className="shimmer-placeholder"></div>
                  )}
                  {isDesktopLogoLoaded && (
                    <img
                      src="/assets/images/logo.png"
                      alt="Logo"
                      loading="lazy"
                      style={{ width: "173px", height: "64px" }}
                    />
                  )}
                </div>

                {/* Mobile Logo with Shimmer */}
                <div
                  className="d-md-none"
                  style={{
                    width: "173px",
                    height: "64px",
                    position: "relative",
                  }}
                >
                  {!isMobileLogoLoaded && (
                    <div className="shimmer-placeholder"></div>
                  )}
                  {isMobileLogoLoaded && (
                    <img
                      src="/assets/images/logo-mobile.png"
                      alt="Logo"
                      loading="lazy"
                      style={{ width: "173px", height: "64px" }}
                    />
                  )}
                </div>

                <style jsx>{`
                  .shimmer-placeholder {
                    width: 100%;
                    height: 100%;
                    border-radius: 8px;
                    background: linear-gradient(
                      90deg,
                      #f0f0f0 25%,
                      #e0e0e0 50%,
                      #f0f0f0 75%
                    );
                    background-size: 200% 100%;
                    animation: shimmer 2s infinite;
                    position: absolute;
                    top: 0;
                    left: 0;
                  }

                  @keyframes shimmer {
                    0% {
                      background-position: -200% 0;
                    }
                    100% {
                      background-position: 200% 0;
                    }
                  }
                `}</style>
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
                        onClick={() => {
                          setShowLocationDrop(false);
                          handleDefaultCityChange(city);
                        }}
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
                            <h5 className="mb-0">
                              {" "}
                              {translation?.popular_choices ||
                                "Popular Choices"}
                            </h5>
                          </span>
                        </li>
                        <li>
                          <a
                            role="button"
                            onClick={() =>
                              renderLink(
                                `/property-listing?post_for=sale&property_type=1&searchData=${JSON.stringify(
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
                                `/property-listing?post_for=sale&property_type=1&searchData=${JSON.stringify(
                                  { posted_by: ["O"] }
                                )}`
                              )
                            }
                          >
                            {translation?.owner_properties ||
                              "Owner Properties"}
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
                          <Link href="/project-listing">
                            {translation?.new_projects || "New Projects"}
                          </Link>
                        </li>
                      </ul>
                      <ul className="dropdown-nav">
                        <li>
                          <span>
                            <h5 className="mb-0">
                              {translation?.property_types || "Property Types"}
                            </h5>
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
                            {translation?.flat_for || "Flat for in"}
                            {selectedCity || ""}
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
                            {translation?.villa_for || "Villa for in"}
                            {selectedCity || ""}
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
                            {translation?.residential_house ||
                              "Residential House in"}
                            {selectedCity || ""}
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
                            {translation?.offices || "Offices in"}
                            {selectedCity || ""}
                          </a>
                        </li>
                        <li>
                          <a
                            role="button"
                            onClick={() =>
                              renderLink(
                                "/property-listing?post_for=sale&property_type=2&property_for=11"
                              )
                            }
                          >
                            {translation?.commercial_office_space ||
                              "Commercial Office Space in"}{" "}
                            {selectedCity || ""}
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
                            {translation?.builder_floor_apartment ||
                              "Builder Floor Apartment in"}{" "}
                            {selectedCity || ""}
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
                            {translation?.office_in_it_park ||
                              "Office in IT Park/ SEZ in"}{" "}
                            {selectedCity || ""}
                          </a>
                        </li>
                      </ul>
                      <ul className="dropdown-nav">
                        <li>
                          <span>
                            <h5 className="mb-0">
                              {translation?.budget || "Budget"}{" "}
                            </h5>
                          </span>
                        </li>
                        <li>
                          {/* max_budget */}
                          <a
                            role="button"
                            onClick={() =>
                              renderLink(
                                `/property-listing?post_for=sale&property_type=1&searchData=${JSON.stringify(
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
                                `/property-listing?post_for=sale&property_type=1&searchData=${JSON.stringify(
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
                                `/property-listing?post_for=sale&property_type=1&searchData=${JSON.stringify(
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
                                `/property-listing?post_for=sale&property_type=1&searchData=${JSON.stringify(
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
                                `/property-listing?post_for=sale&property_type=1&searchData=${JSON.stringify(
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
                            <h5 className="mb-0">
                              {translation?.explore || "Explore"}
                            </h5>
                          </span>
                        </li>
                        <li>
                          <Link href="/agent-list">
                            {translation?.find_an_agent || "Find an Agent"}
                          </Link>
                        </li>
                        <li>
                          <Link href="/project-listing">
                            {translation?.projects_in || "Projects in"}{" "}
                            {selectedCity || "Kolkata"}
                          </Link>
                        </li>
                        {/* <li>
                          <Link href="#">
                          {translation?.popular_locality || "Popular Locaity in"}  {selectedCity || "Kolkata"}
                          </Link>
                        </li> */}
                        <li>
                          <Link href="/property-valuation">
                            {translation?.property_valuation ||
                              "Property Valuation in"}{" "}
                            {selectedCity || "Kolkata"}
                          </Link>
                        </li>
                        <li>
                          <Link href="/agent-list">
                            {translation?.top_agents || "Top Agents in"}{" "}
                            {selectedCity || "Kolkata"}
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
                            <h5 className="mb-0">
                              {" "}
                              {translation?.popular_choices ||
                                "Popular Choices"}
                            </h5>
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
                            {translation?.owner_properties ||
                              "Owner Properties"}
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
                            {translation?.furnished_properties ||
                              "Furnished Properties"}
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
                            {translation?.semi_furnished_properties ||
                              "Semi Furnished Properties"}
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
                            {translation?.immediately_available ||
                              "Immediately Available"}
                          </a>
                        </li>
                      </ul>
                      <ul className="dropdown-nav">
                        <li>
                          <span>
                            <h5 className="mb-0">
                              {translation?.property_types || "Property Types"}
                            </h5>
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
                            {translation?.villa_for_rent || "Flat for rent in"}{" "}
                            {selectedCity || ""}
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
                            {translation?.flat_for_rent || "Villa for rent in"}{" "}
                            {selectedCity || ""}
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
                            {translation?.residential_house_rent ||
                              "Residential House for rent in"}{" "}
                            {selectedCity || ""}
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
                            {translation?.offices_for_rent ||
                              "Offices for rent in"}{" "}
                            {selectedCity || ""}
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
                            {translation?.commercial_office_space_rent ||
                              "Commercial Office Space for rent in"}{" "}
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
                            {translation?.builder_floor_apartment_rent ||
                              "Builder Floor Apartment for rent in"}{" "}
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
                            {translation?.builder_floor_apartment_rent ||
                              "Builder Floor Apartment for rent in"}{" "}
                            {selectedCity || ""}
                          </a>
                        </li>
                      </ul>
                      <ul className="dropdown-nav">
                        <li>
                          <span>
                            <h5 className="mb-0">
                              {translation?.budget || "Budget"}
                            </h5>
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
                            <h5 className="mb-0">
                              {translation?.explore || "Explore"}
                            </h5>
                          </span>
                        </li>
                        <li>
                          <Link href="/agent-list">
                            {translation?.find_an_agent || "Find an Agent"}
                          </Link>
                        </li>
                        <li>
                          <Link href="/rent-agreement">
                            {translation?.rent_agreement || "Rent Agreement"}
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </li>
                  {/* for sale  */}
                  <li className="nav-item mega-menu">
                    <a className="nav-link dropdown-toggle" role="button">
                      {translation?.sale || "sale"}
                    </a>
                    <div className="dropdown-full">
                      <ul className="dropdown-nav">
                        <li>
                          <span>
                            <h5 className="mb-0">
                              {translation?.for_owner || "For Owner"}
                            </h5>
                          </span>
                        </li>
                        <li>
                          <Link href="/postproperty">
                            {translation?.post_property_free ||
                              "Post Property Free"}
                          </Link>
                        </li>
                        <li>
                          <Link href="/dashboard">
                            {translation?.my_dashboard || "My Dashboard"}
                          </Link>
                        </li>
                        <li>
                          <Link href="/membership">
                            {translation?.sell_rent_ad_packages ||
                              "sale / Rent Ad Packages"}
                          </Link>
                        </li>
                      </ul>
                      <ul className="dropdown-nav">
                        <li>
                          <span>
                            <h5 className="mb-0">
                              {translation?.for_agent_builder ||
                                "For Agent & Builder"}
                            </h5>
                          </span>
                        </li>
                        <li>
                          <Link href="/dashboard">
                            {translation?.my_dashboard || "My Dashboard"}
                          </Link>
                        </li>
                        <li>
                          <Link href="membership">
                            {translation?.ad_packages || "Ad Packages"}
                          </Link>
                        </li>
                        <li>
                          <Link href="/sales-enquiry">
                            {translation?.sales_enquiry || "Sales Enquiry"}
                          </Link>
                        </li>
                      </ul>
                      <ul className="dropdown-nav">
                        <li>
                          <span>
                            <h5 className="mb-0">
                              {translation?.selling_tools || "Selling Tools"}
                            </h5>
                          </span>
                        </li>
                        <li>
                          <Link href="/property-valuation">
                            {translation?.property_valuation ||
                              "Property Valuation In"}
                          </Link>
                        </li>
                        <li>
                          <Link href="/agent-list">
                            {translation?.find_an_agent || "Find an Agent"}
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </li>
                  {/* for agent  */}
                  <li className="nav-item">
                    <Link href="/agent-list" className="nav-link">
                      {translation?.agents || "Agents"}
                    </Link>
                  </li>
                  {translation ? (
                    validLogin ? (
                      <React.Fragment>
                        <li className="nav-item">
                          <a className="nav-link dropdown-toggle" role="button">
                            {translation.help}
                          </a>
                          <ul className="dropdown-single dropdown-nav">
                            <li>
                              <a href="/help-center">
                                {translation.help_center}
                              </a>
                            </li>
                            <li>
                              <a href="/sales-enquiry">
                                {translation.sales_enquiry}
                              </a>
                            </li>
                          </ul>
                        </li>
                        <li className="nav-item me-lg-3 userInitial">
                          <Link
                            href={`/`}
                            className="nav-link dropdown-toggle d-flex align-items-center"
                          >
                            <div className="letter">
                              {userData?.name ? (
                                userData.name.charAt(0).toUpperCase()
                              ) : (
                                <img
                                  src="/assets/images/user.jpg"
                                  alt="Default User"
                                  height={30}
                                  loading="lazy"
                                />
                              )}
                            </div>
                            <p>{userData?.name || "Guest"}</p>
                          </Link>
                          <ul className="dropdown-single dropdown-nav account-menu">
                            <li>
                              <a href="/dashboard">{translation.dashboard}</a>
                            </li>
                            <li>
                              <Link href="/my-profile">
                                {translation.my_profile}
                              </Link>
                            </li>
                            <li>
                              <Link href="/" onClick={handleLogout}>
                                {translation.logout}
                              </Link>
                            </li>
                          </ul>
                        </li>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        {translation.log_in ? (
                          <>
                            <li className="nav-item">
                              <Link
                                href="/login"
                                className="btn btn-outline-primary ms-3"
                              >
                                {translation.log_in || "Log In"}
                              </Link>
                            </li>
                            <li className="nav-item">
                              <Link
                                href="/register"
                                className="btn btn-outline-primary ms-3"
                              >
                                {translation.sign_up || "Sign Up"}
                              </Link>
                            </li>
                          </>
                        ) : (
                          <>
                            <a
                              className="nav-link dropdown-toggle"
                              role="button"
                              style={{
                                marginTop: "7px",
                                display: "inline-block",
                                width: "120px",
                                height: "30px",
                                borderRadius: "4px",
                                background:
                                  "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
                                backgroundSize: "200% 100%",
                                animation: "shimmer 2s infinite",
                                color: "transparent",
                              }}
                            >
                              <i className="icon-feather-user"></i> My Account
                            </a>

                            <style jsx>{`
                              @keyframes shimmer {
                                0% {
                                  background-position: -200% 0;
                                }
                                100% {
                                  background-position: 200% 0;
                                }
                              }
                            `}</style>
                          </>
                        )}
                      </React.Fragment>
                    )
                  ) : null}{" "}
                  <li className="nav-item ms-3">
                    <Link
                      href="/postproperty"
                      className="btn btn-primary btn-post"
                    >
                      <i className="icon-line-awesome-mouse-pointer"></i>{" "}
                      {translation?.post_property_free || "Post Property"}{" "}
                      <img
                        src="/assets/images/icons/free-badge.png"
                        alt="Free Badge"
                        height="28"
                        width="28"
                        loading="lazy"
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
                        loading="lazy"
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
                            loading="lazy"
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
                            loading="lazy"
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
                            loading="lazy"
                          />{" "}
                          German
                        </a>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>

              <MobileMenu
                handleLogout={handleLogout}
                selectedCity={selectedCity}
                currentLang={currentLang}
                changeLanguage={changeLanguage}
                translation={translation}
              />
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Header;

const Menu = () => {
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (menuName) => {
    setOpenMenus((prevState) => ({
      ...prevState,
      [menuName]: prevState[menuName] ? null : true,
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
              url: `/property-listing?post_for=sale&property_type=1&searchData=${JSON.stringify(
                { possession_status: [3] }
              )}`,
            },
            {
              text: "Owner Properties",
              url: `/property-listing?post_for=sale&property_type=1&searchData=${JSON.stringify(
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
              url: "/property-listing?post_for=sale&property_type=1&property_for=1",
            },
            {
              text: `Villa for in ${selectedCity || ""} `,
              url: "/property-listing?post_for=sale&property_type=1&property_for=2",
            },
            {
              text: `Residential House for in ${selectedCity || ""} `,
              url: "/property-listing?post_for=sale&property_type=1&property_for=6",
            },
            {
              text: `Offices in ${selectedCity || ""} `,
              url: "/property-listing?post_for=sale&property_type=2&property_for=3",
            },
            {
              text: `Commercial Office Space in ${selectedCity || ""} `,
              url: "/property-listing?post_for=sale&property_type=2&property_for=11",
            },
            {
              text: `Builder Floor Apartment in ${selectedCity || ""} `,
              url: "/property-listing?post_for=sale&property_type=1&property_for=7",
            },
            {
              text: `Office in IT Park\/ SEZ in ${selectedCity || ""} `,
              url: "/property-listing?post_for=sale&property_type=2&property_for=12",
            },
          ],
        },
        {
          name: "Budget",
          links: [
            {
              text: "Under AED 399.00",
              url: `/property-listing?post_for=sale&property_type=1&searchData=${JSON.stringify(
                { max_budget: 399 }
              )}`,
            },
            {
              text: "AED400.00 - AED699.00",
              url: `/property-listing?post_for=sale&property_type=1&searchData=${JSON.stringify(
                { min_budget: 400, max_budget: 699 }
              )}`,
            },
            {
              text: "AED700.00 - AED1199.00",
              url: `/property-listing?post_for=sale&property_type=1&searchData=${JSON.stringify(
                { min_budget: 700, max_budget: 1199 }
              )}`,
            },
            {
              text: "AED1200.00 - AED1599.00",
              url: `/property-listing?post_for=sale&property_type=1&searchData=${JSON.stringify(
                { min_budget: 1200, max_budget: 1599 }
              )}`,
            },
            {
              text: "Above AED1600.00",
              url: `/property-listing?post_for=sale&property_type=1&searchData=${JSON.stringify(
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
              url: "/project-listing?post_for=sale",
            },
            {
              text: `Property Valuation in ${selectedCity || "Kolkata"}`,
              url: "/property-valuation?post_for=sale",
            },
            {
              text: `Top Agents in ${selectedCity || "Kolkata"}`,
              url: "/agent-list?post_for=sale",
            },
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
            // { text: `Villa for rent in ${selectedCity || ""}`, url: "#" },
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
      name: "sale",
      options: [
        {
          name: "For Owner",
          links: [
            { text: "Post Property Free", url: "/postproperty" },
            { text: "My Dashboard", url: "/dashboard" },
            { text: "sale / Rent Ad Packages", url: "/membership" },
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
                              <Link href={link.url}>{link.text}</Link>
                            </li>
                          ))}
                        </ul>
                      </Collapse>
                    </>
                  ) : (
                    <Link href={option.url}>{option.text}</Link>
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
