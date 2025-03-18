"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import useIsMobile from "@/hooks/useIsMobile";
import "mmenu-js/dist/mmenu.css";
import AuthUser from "../Authentication/AuthUser";

const MobileMenu = ({
  translation,
  handleLogout,
  currentLang,
  changeLanguage,
}) => {
  const isMobile = useIsMobile();

  const { GetMemberId } = AuthUser();

  const memberId = GetMemberId();

  useEffect(() => {
    if (isMobile && typeof window !== "undefined") {
      import("mmenu-js").then(({ default: Mmenu }) => {
        const menu = new Mmenu("#menu", {
          slidingSubmenus: true,
          theme: "dark",
          extensions: ["position-right", "fx-menu-slide"],
          navbars: [
            {
              content: ["prev", "title"],
            },
          ],
        });

        const api = menu.API;
        document
          .querySelector(".menu-trigger")
          ?.addEventListener("click", () => api.open());
          
      });
    }
  }, [isMobile, memberId]);

  const menuData = [
    {
      name: "Buy",
      options: [
        {
          name: "Popular Choices",
          links: [
            {
              text: "Ready to Move",
              url: "/property-listing?post_for=sell&property_type=1",
            },
            {
              text: "Owner Properties",
              url: "/property-listing?post_for=sell&property_type=1",
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
              text: "Flat for in City",
              url: "/property-listing?property_type=1&property_for=1",
            },
            {
              text: "Villa for in City",
              url: "/property-listing?property_type=1&property_for=2",
            },
            {
              text: "Residential House in City",
              url: "/property-listing?property_type=1&property_for=6",
            },
            {
              text: "Offices in City",
              url: "/property-listing?property_type=2&property_for=3",
            },
            {
              text: "Commercial Office Space in City",
              url: "/property-listing?post_for=sell&property_type=2&property_for=11",
            },
          ],
        },
        {
          name: "Budget",
          links: [
            {
              text: "Under AED 399.00",
              url: '/property-listing?post_for=sell&property_type=1&searchData={"max_budget":399}',
            },
            {
              text: "AED400.00 - AED699.00",
              url: '/property-listing?post_for=sell&property_type=1&searchData={"min_budget":400,"max_budget":699}',
            },
            {
              text: "AED700.00 - AED1199.00",
              url: '/property-listing?post_for=sell&property_type=1&searchData={"min_budget":700,"max_budget":1199}',
            },
            {
              text: "AED1200.00 - AED1599.00",
              url: '/property-listing?post_for=sell&property_type=1&searchData={"min_budget":1200,"max_budget":1599}',
            },
            {
              text: "Above AED1600.00",
              url: '/property-listing?post_for=sell&property_type=1&searchData={"min_budget":1600}',
            },
          ],
        },
        {
          name: "Explore",
          links: [
            { text: "Find an Agent", url: "/agent-list" },
            { text: "Projects in City", url: "/project-listing" },
            { text: "Property Valuation in City", url: "/property-valuation" },
            { text: "Top Agents in City", url: "/agent-list" },
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
              url: "/property-listing?post_for=rent",
            },
            {
              text: "Furnished Properties",
              url: "/property-listing?post_for=rent",
            },
            {
              text: "Semi Furnished Properties",
              url: "/property-listing?post_for=rent",
            },
            {
              text: "Immediately Available",
              url: "/property-listing?post_for=rent",
            },
          ],
        },
        {
          name: "Property Types",
          links: [
            {
              text: "Flat for rent in City",
              url: "/property-listing?post_for=rent&property_type=1&property_for=1",
            },
            {
              text: "Villa for rent in City",
              url: "/property-listing?post_for=rent&property_type=1&property_for=2",
            },
            {
              text: "Residential House for rent in City",
              url: "/property-listing?post_for=rent&property_type=1&property_for=6",
            },
            {
              text: "Offices for rent in City",
              url: "/property-listing?post_for=rent&property_type=2&property_for=3",
            },
            {
              text: "Commercial Office Space for rent in City",
              url: "/property-listing?post_for=rent&property_type=2&property_for=11",
            },
          ],
        },
        {
          name: "Budget",
          links: [
            {
              text: "Under AED 399.00",
              url: "/property-listing?post_for=rent",
            },
            {
              text: "AED400.00 - AED699.00",
              url: "/property-listing?post_for=rent",
            },
            {
              text: "AED700.00 - AED1199.00",
              url: "/property-listing?post_for=rent",
            },
            {
              text: "AED1200.00 - AED1599.00",
              url: "/property-listing?post_for=rent",
            },
            {
              text: "Above AED1600.00",
              url: "/property-listing?post_for=rent",
            },
          ],
        },
        {
          name: "Explore",
          links: [
            { text: "Find an Agent", url: "/agent-list" },
            { text: "Rent Agreement", url: "/rent-agreement" },
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
            { text: "Property Valuation In", url: "/property-valuation" },
            { text: "Find an Agent", url: "/agent-list" },
          ],
        },
      ],
    },
    {
      name: "Agent",
      options: [
        { text: "Find an Agent", url: "/find-agent" },
        { text: "Become an Agent", url: "/become-agent" },
      ],
    },
  ];

  return (
    <>
      {isMobile && <button className="menu-trigger">☰ Menu</button>}

      {isMobile && (
        <nav id="menu">
          <ul>
            {menuData.map((item) => (
              <li key={item.name}>
                <span>{item.name}</span>
                <ul>
                  {item.options?.map((option, index) => (
                    <li key={index}>
                      {option.name ? (
                        <>
                          <span>{option.name}</span>
                          <ul>
                            {option.links?.map((link, linkIndex) => (
                              <li key={linkIndex}>
                                <Link href={link.url}>{link.text}</Link>
                              </li>
                            ))}
                          </ul>
                        </>
                      ) : (
                        <Link href={option.url}>{option.text}</Link>
                      )}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
            {memberId ? (
              <React.Fragment>
                <li>
                  <Link href="/dashboard" className="active">
                    <i className="bi bi-speedometer"></i>{" "}
                    {translation?.dashboard || "Dashboard"}
                  </Link>
                </li>
                <li>
                  <Link href="/my-profile">
                    <i className="bi bi-person"></i>{" "}
                    {translation?.profile || "Profile"}
                  </Link>
                </li>
                <li>
                  <Link href="/review-list">
                    <i className="bi bi-chat-right-quote"></i>{" "}
                    {translation?.reviews || "Reviews"}
                  </Link>
                </li>
                <li>
                  <Link href="/message">
                    <i className="bi bi-chat-square-text"></i>{" "}
                    {translation?.message || "Message"}
                  </Link>
                </li>
                <li>
                  <Link href="/my-property-listing">
                    <i className="bi bi-house"></i>{" "}
                    {translation?.my_properties || "My Properties"}
                  </Link>
                </li>
                <li>
                  <Link href="/my-project">
                    <i className="bi bi-buildings"></i>{" "}
                    {translation?.my_projects || "My Projects"}
                  </Link>
                </li>
                <li>
                  <Link href="/my-favourite-list">
                    <i className="bi bi-house-heart"></i>{" "}
                    {translation?.my_property_favourites ||
                      "My Property Favourites"}
                  </Link>
                </li>
                <li>
                  <Link href="/my-project-favourite-list">
                    <i className="bi bi-bookmark-star"></i>{" "}
                    {translation?.my_project_favourites ||
                      "My Project Favourites"}
                  </Link>
                </li>
                <li>
                  <Link href="/membership">
                    <i className="bi bi-box"></i>{" "}
                    {translation?.packages || "Packages"}
                  </Link>
                </li>
                <li>
                  <Link href="/enquiry-list">
                    <i className="bi bi-mic"></i>{" "}
                    {translation?.enquiries || "Enquiries"}
                  </Link>
                </li>
                <li>
                  <Link href="/report">
                    <i className="bi bi-flag"></i>{" "}
                    {translation?.user_report || "User Report"}
                  </Link>
                </li>
                <li>
                  <Link href="/update-password">
                    <i className="bi bi-lock"></i>{" "}
                    {translation?.change_password || "Change Password"}
                  </Link>
                </li>
                <li>
                  <Link href="/" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right"></i>{" "}
                    {translation?.logout || "Logout"}
                  </Link>
                </li>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <li>
                  <Link href="/login" className="active">
                    <i className="bi bi-speedometer"></i>{" "}
                    <span>{translation?.login || "Login"}</span>
                  </Link>
                </li>

                <li>
                  <Link href="/register" className="active">
                    <i className="bi bi-speedometer"></i>{" "}
                    <span>{translation?.register || "Register"}</span>
                  </Link>
                </li>
              </React.Fragment>
            )}
            <li>
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
                />
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
        </nav>
      )}
    </>
  );
};

export default MobileMenu;
