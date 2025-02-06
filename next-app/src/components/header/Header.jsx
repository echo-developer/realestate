"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import "../../app/globals.css";
import AuthUser from "../Authentication/AuthUser";
import Offcanvas from "react-bootstrap/Offcanvas";
import { AiOutlinePlus, AiOutlineDelete } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { Collapse } from "react-bootstrap";

const Header = () => {
  const { isLogin, logout } = AuthUser();
  const [showLocationDrop, setShowLocationDrop] = useState(false);
  const [mobileView, setMobileView] = useState(false);
  const [menu, setMenu] = useState("");
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 1200);
  const [activeHover, setActiveHover] = useState("");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1200) {
        setIsMobileView(true);
      } else {
        setIsMobileView(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const validLogin = isLogin();

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

  return (
    <>
      <header id="header-container" className="header-sticky transparentH">
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
                <Link
                  className="btn btn-link dropdown-toggle text-decoration-none"
                  href="#"
                  data-bs-toggle="dropdown"
                  aria-expanded={showLocationDrop ? "true" : "false"}
                  onClick={handleShowLocationDropDown}
                >
                  Kolkata
                </Link>
                <ul
                  className={`dropdown-menu ${showLocationDrop ? "show" : ""}`}
                >
                  <li>
                    <Link className="dropdown-item" href="#">
                      Chennai
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" href="#">
                      Delhi
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" href="#">
                      Mumbai
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="d-flex">
              <div id="navigation">
                <ul
                  id="desk-nav"
                  className="navbar-nav me-lg-auto mb-2 mb-lg-0"
                >
                  <li className="nav-item mega-menu">
                    <Link className="nav-link dropdown-toggle" href="#">
                      Buy
                    </Link>
                    <div className="dropdown-full">
                      <ul className="dropdown-nav">
                        <li>
                          <span>
                            <h5 className="mb-0">Properties in Abu Dhabi</h5>
                          </span>
                        </li>
                        <li>
                          <Link href="#">26K+ Flats</Link>
                        </li>
                        <li>
                          <Link href="#">2K+ House/Villa</Link>
                        </li>
                        <li>
                          <Link href="#">2K+ Commercial Properties</Link>
                        </li>
                      </ul>
                      <ul className="dropdown-nav">
                        <li>
                          <span>
                            <h5 className="mb-0">Property Types</h5>
                          </span>
                        </li>
                        <li>
                          <Link href="#">Ready to Move</Link>
                        </li>
                        <li>
                          <Link href="#">Owner Properties</Link>
                        </li>
                        <li>
                          <Link href="#">Budget Homes</Link>
                        </li>
                      </ul>
                      <ul className="dropdown-nav">
                        <li>
                          <span>
                            <h5 className="mb-0">Popular Commercial</h5>
                          </span>
                        </li>
                        <li>
                          <Link href="#">Property for Sale in Abu Dhabi</Link>
                        </li>
                        <li>
                          <Link href="#">Office Space in Abu Dhabi</Link>
                        </li>
                        <li>
                          <Link href="#">Hotel &amp; Shops in Abu Dhabi</Link>
                        </li>
                      </ul>
                      <ul className="dropdown-nav">
                        <li>
                          <span>
                            <h5 className="mb-0">Popular Residential</h5>
                          </span>
                        </li>
                        <li>
                          <Link href="#">Ready to Move</Link>
                        </li>
                        <li>
                          <Link href="#">Owner Properties</Link>
                        </li>
                        <li>
                          <Link href="#">Budget Homes</Link>
                        </li>
                      </ul>
                    </div>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link dropdown-toggle" href="#">
                      Sell
                    </Link>
                    <ul className="dropdown-single dropdown-nav">
                      <li>
                        <Link href="#">Action</Link>
                      </li>
                      <li>
                        <Link href="#">Another</Link>
                      </li>
                      <li>
                        <Link href="#">Something</Link>
                      </li>
                      <li>
                        <Link href={`/project-listing`}>Buy Project</Link>
                      </li>
                    </ul>
                  </li>
                  <li className="nav-item mega-menu">
                    <Link className="nav-link dropdown-toggle" href="#">
                      Rent
                    </Link>
                    <div className="dropdown-full">
                      <ul className="dropdown-nav">
                        <li>
                          <span>
                            <h5 className="mb-0">Popular Choices</h5>
                          </span>
                        </li>
                        <li>
                          <Link href="#">Owner Properties</Link>
                        </li>
                        <li>
                          <Link href="#">Verified Properties</Link>
                        </li>
                        <li>
                          <Link href="#">Furnished Homes</Link>
                        </li>
                        <li>
                          <Link href="#">Bachelor Friendly Homes</Link>
                        </li>
                        <li>
                          <Link href="#">Immediately Available</Link>
                        </li>
                      </ul>
                      <ul className="dropdown-nav">
                        <li>
                          <span>
                            <h5 className="mb-0">Property Types</h5>
                          </span>
                        </li>
                        <li>
                          <Link href="#">Flat for rent in Abu Dhabi</Link>
                        </li>
                        <li>
                          <Link href="#">House for rent in Abu Dhabi</Link>
                        </li>
                        <li>
                          <Link href="#">Villa for rent in Abu Dhabi</Link>
                        </li>
                        <li>
                          <Link href="#">PG in Abu Dhabi</Link>
                        </li>
                        <li>
                          <Link href="#">Office Space in Abu Dhabi</Link>
                        </li>
                        <li>
                          <Link href="#">Commercial Shop in Abu Dhabi</Link>
                        </li>
                        <li>
                          <Link href="#">Coworking Space in Abu Dhabi</Link>
                        </li>
                      </ul>
                      <ul className="dropdown-nav">
                        <li>
                          <span>
                            <h5 className="mb-0">Budget</h5>
                          </span>
                        </li>
                        <li>
                          <Link href="#">Under AED 399.00</Link>
                        </li>
                        <li>
                          <Link href="#">AED400.00 - AED699.00</Link>
                        </li>
                        <li>
                          <Link href="#">AED700.00 - AED1199.00</Link>
                        </li>
                        <li>
                          <Link href="#">AED1200.00 - AED1599.00</Link>
                        </li>
                        <li>
                          <Link href="#">Above AED1600.00</Link>
                        </li>
                      </ul>
                      <ul className="dropdown-nav">
                        <li>
                          <span>
                            <h5 className="mb-0">Explore</h5>
                          </span>
                        </li>
                        <li>
                          <Link href="#">Find an Agent</Link>
                        </li>
                        <li>
                          <Link href="#">Localities</Link>
                        </li>
                        <li>
                          <Link href="#">Buy Vs Rent</Link>
                        </li>
                        <li>
                          <Link href="#">Share Requirement</Link>
                        </li>
                        <li>
                          <Link href="#">Property Services</Link>
                        </li>
                        <li>
                          <Link href="#">Rent Agreement</Link>
                        </li>
                        <li>
                          <Link href="#">Pay Rent</Link>
                        </li>
                      </ul>
                    </div>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link dropdown-toggle" href="#">
                      Find an Agency
                    </Link>
                    <ul className="dropdown-single dropdown-nav">
                      <li>
                        <Link href="#">Action</Link>
                      </li>
                      <li>
                        <Link href="#">Another</Link>
                      </li>
                      <li>
                        <Link href="/agent-list">Agent</Link>
                      </li>
                    </ul>
                  </li>
                  {validLogin ? (
                    <React.Fragment>
                      <li className="nav-item">
                        <a className="nav-link dropdown-toggle" href="#">
                          Help
                        </a>
                        <ul className="dropdown-single dropdown-nav">
                          <li>
                            <a href="#">Help Center</a>
                          </li>
                          <li>
                            <a href="#">Sales Enquiry</a>
                          </li>
                        </ul>
                      </li>
                      <li className="nav-item me-lg-3">
                        <a className="nav-link dropdown-toggle" href="#">
                          <i className="icon-feather-user"></i> My Account
                        </a>
                        <ul className="dropdown-single dropdown-nav account-menu">
                          <li>
                            <a href="/dashboard">Dashboard</a>
                          </li>
                          <li>
                            <a href="#">My Activity</a>
                          </li>
                          <li>
                            <a href="#">Recommendations</a>
                          </li>
                          <li>
                            <Link href="/my-profile">My Profile</Link>
                          </li>
                          <li>
                            <Link href="/" onClick={logout}>
                              Logout
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
                          Log In
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link
                          href="/register"
                          className="btn btn-outline-primary mt-3 ms-3"
                        >
                          Sign Up
                        </Link>
                      </li>
                    </React.Fragment>
                  )}

                  <li className="nav-item mt-3 ms-3">
                    <Link
                      href="/postproperty"
                      className="btn btn-primary btn-post"
                    >
                      <i className="icon-line-awesome-mouse-pointer"></i> Post
                      Property{" "}
                      <img
                        src="/assets/images/icons/free-badge.png"
                        alt="Free Badge"
                        height="28"
                        width="28"
                      />
                    </Link>
                  </li>
                  <li className="nav-item ms-3 setlang">
                    <Link className="nav-link dropdown-toggle" href="#">
                      <img
                        src="/assets/images/flags/ae.svg"
                        alt="UAE"
                        height="20"
                        width="20"
                      />{" "}
                      UAE
                    </Link>
                    <ul className="dropdown-single dropdown-nav dropdown-menu-end">
                      <li>
                        <Link href="#">
                          <img
                            src="/assets/images/flags/de.svg"
                            alt="German"
                            height="16"
                            width="16"
                          />{" "}
                          German
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <img
                            src="/assets/images/flags/ae.svg"
                            alt="Arabic"
                            height="16"
                            width="16"
                          />{" "}
                          Arabic
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <img
                            src="/assets/images/flags/gb.svg"
                            alt="English"
                            height="16"
                            width="16"
                          />{" "}
                          English
                        </Link>
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
        <Offcanvas.Header closeButton>
          <Link href={`/`}>
            <Offcanvas.Title>RealEstate</Offcanvas.Title>
          </Link>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {menu === "dashboard_menu" && (
            <ul className="user-nav">
              <li>
                <Link
                  href="/dashboard"
                  className="active"
                  style={{ color: "#3d3838" }}
                >
                  <i className="bi bi-speedometer"></i> <span>Dashboard</span>
                </Link>
              </li>
              <li>
                <Link href="/my-profile" style={{ color: "#3d3838" }}>
                  <i className="bi bi-person"></i> <span>Profile</span>
                </Link>
              </li>
              <li>
                <Link href="/review-list" style={{ color: "#3d3838" }}>
                  <i className="bi bi-chat-right-quote"></i>{" "}
                  <span>Reviews</span>
                </Link>
              </li>
              <li>
                <Link href="/message" style={{ color: "#3d3838" }}>
                  <i className="bi bi-chat-square-text"></i>{" "}
                  <span>Message</span>
                </Link>
              </li>
              <li className="dropdown">
                <Link
                  href="#"
                  className="nav-toggle-1"
                  aria-expanded="false"
                  style={{ color: "#3d3838" }}
                >
                  <i className="bi bi-building"></i> <span>Property CRM</span>
                  <i className="icon-line-awesome-angle-down ms-auto"></i>
                </Link>
                <ul
                  className="nav-hide-menu"
                  id="hide-menu-1"
                  style={{ display: "none" }}
                >
                  <li>
                    <Link href="/property-crm" style={{ color: "#3d3838" }}>
                      <i className="icon-line-awesome-arrow-right"></i> Leads
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/property-crm-timeline"
                      style={{ color: "#3d3838" }}
                    >
                      <i className="icon-line-awesome-arrow-right"></i> TimeLine
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/property-crm-calender"
                      style={{ color: "#3d3838" }}
                    >
                      <i className="icon-line-awesome-arrow-right"></i> Calendar
                    </Link>
                  </li>
                </ul>
              </li>
              <li>
                <Link href="/my-property-listing" style={{ color: "#3d3838" }}>
                  <i className="bi bi-bookmark-star"></i>{" "}
                  <span>My Properties</span>
                </Link>
              </li>
              <li>
                <Link href="/my-project" style={{ color: "#3d3838" }}>
                  <i className="bi bi-bookmark-star"></i>{" "}
                  <span>My Projects</span>
                </Link>
              </li>
              <li>
                <Link href="/my-favourite-list" style={{ color: "#3d3838" }}>
                  <i className="bi bi-bookmark-star"></i>{" "}
                  <span>My Property Favourites</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/my-project-favourite-list"
                  style={{ color: "#3d3838" }}
                >
                  <i className="bi bi-bookmark-star"></i>{" "}
                  <span>My Project Favourites</span>
                </Link>
              </li>
              <li>
                <Link href="/membership" style={{ color: "#3d3838" }}>
                  <i className="bi bi-box"></i> <span>Packages</span>
                </Link>
              </li>
              <li>
                <Link href="/enquiry-list" style={{ color: "#3d3838" }}>
                  <i className="bi bi-bookmark-star"></i> <span>Enquiries</span>
                </Link>
              </li>
              <li>
                <Link href="/report" style={{ color: "#3d3838" }}>
                  <i className="bi bi-cursor"></i> <span>User Report</span>
                </Link>
              </li>
              <li>
                <Link href="/update-password" style={{ color: "#3d3838" }}>
                  <i className="bi bi-lock"></i> <span>Change Password</span>
                </Link>
              </li>
              <li>
                <Link href="/" style={{ color: "#3d3838" }}>
                  <i className="bi bi-box-arrow-right"></i> <span>Logout</span>
                </Link>
              </li>
            </ul>
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

  const menuData = [
    {
      name: "Buy",
      options: [
        {
          name: "Properties in Abu Dhabi",
          links: [
            { text: "26K+ Flats", url: "#" },
            { text: "2K+ House/Villa", url: "#" },
            { text: "2K+ Commercial Properties", url: "#" },
          ],
        },
        {
          name: "Property Types",
          links: [
            { text: "Ready to Move", url: "#" },
            { text: "Owner Properties", url: "#" },
            { text: "Budget Homes", url: "#" },
          ],
        },
      ],
    },
    {
      name: "Sell",
      options: [
        { text: "Action", url: "#" },
        { text: "Another", url: "#" },
        { text: "Something", url: "#" },
        { text: "Buy Project", url: "/project-listing" },
      ],
    },
    {
      name: "Rent",
      options: [
        {
          name: "Popular Choices",
          links: [
            { text: "Owner Properties", url: "#" },
            { text: "Verified Properties", url: "#" },
            { text: "Furnished Homes", url: "#" },
            { text: "Bachelor Friendly Homes", url: "#" },
          ],
        },
        {
          name: "Property Types",
          links: [
            { text: "Flat for rent in Abu Dhabi", url: "#" },
            { text: "House for rent in Abu Dhabi", url: "#" },
            { text: "Villa for rent in Abu Dhabi", url: "#" },
          ],
        },
      ],
    },
    {
      name: "Help",
      options: [
        { text: "Help Center", url: "#" },
        { text: "Sales Enquiry", url: "#" },
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
