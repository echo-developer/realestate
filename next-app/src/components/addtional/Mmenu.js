"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import useIsMobile from "@/hooks/useIsMobile";
import "mmenu-js/dist/mmenu.css";
import AuthUser from "../Authentication/AuthUser";
import { ImMenu } from "react-icons/im";
import Image from "next/image";
// import './mmenu.css'
import { Cursor, Cart, ChatRightQuote, People, Speedometer, Tag, List, Key, ChatSquareText, House, Building, HouseHeart, BookmarkStar, Box, Mic, Flag, Lock, BoxArrowRight, BoxArrowLeft, Person } from 'react-bootstrap-icons';

const MobileMenu = ({
  translation,
  handleLogout,
  selectedCity,
  currentLang,
  changeLanguage,
}) => {
  const isMobile = useIsMobile();
  const [menuReady, setMenuReady] = useState(false);
  const { GetMemberId } = AuthUser();

  const memberId = GetMemberId();

  useEffect(() => {
    if (isMobile && typeof window !== "undefined") {
      import("mmenu-js").then(({ default: Mmenu }) => {
        const menu = new Mmenu("#menu", {
          slidingSubmenus: true,
          theme: "light",
          extensions: ["position-right", "fx-menu-slide"],
          navbars: [
            {
              content: ["prev", "title"],
            },
          ],
        });

        const api = menu.API;
        api.bind("open:start", () => {
          setMenuReady(true);
        });

        // Hide menu again when closed
        api.bind("close:finish", () => {
          setMenuReady(false);
        });
        document
          .querySelector(".menu-trigger")
          ?.addEventListener("click", () => api.open());

      });
    }
  }, [isMobile, memberId]);

  const menuData = [
    {
      name: "Buy",
      icon: <Cart color="currentColor" size={18} />,
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
              text: "Flat for ",
              url: "/property-listing?property_type=1&property_for=1",
            },
            {
              text: "Villa for ",
              url: "/property-listing?property_type=1&property_for=2",
            },
            {
              text: "Residential House ",
              url: "/property-listing?property_type=1&property_for=6",
            },
            {
              text: "Offices ",
              url: "/property-listing?property_type=2&property_for=3",
            },
            {
              text: "Commercial Office Space",
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
            { text: "Projects", url: "/project-listing" },
            { text: "Property Valuation", url: "/property-valuation" },
            { text: "Top Agents ", url: "/agent-list" },
          ],
        },
      ],

    },
    {
      name: "Rent",
      icon: <Key color="currentColor" size={18} />,
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
              text: "Flat for rent",
              url: "/property-listing?post_for=rent&property_type=1&property_for=1",
            },
            {
              text: "Villa for rent ",
              url: "/property-listing?post_for=rent&property_type=1&property_for=2",
            },
            {
              text: "Residential House for rent ",
              url: "/property-listing?post_for=rent&property_type=1&property_for=6",
            },
            {
              text: "Offices for rent ",
              url: "/property-listing?post_for=rent&property_type=2&property_for=3",
            },
            {
              text: "Commercial Office Space for rent ",
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
      icon: <Tag color="currentColor" size={18} />,
      options: [
        {
          name: "For Owner",
          links: [
            { text: "Post Property", url: "/postproperty" },
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
      icon: <People color="currentColor" size={18} />,
      options: [{ text: "Find an Agent", url: "/agent-list" }],
    },
  ];

  console.log("menuReady", menuReady)

  if(isMobile === null) {
    return null;
  }

  return (
    <>
      {/* Trigger button */}
      <a
        href="#menu"
        role="button"
        className={`btn btn-outline-dark border-0 rounded-circle p-2 hamburger-btn ${!isMobile ? "d-none" : ""
          }`}
      >
        <List size={20} />
      </a>

      {/* The menu itself */}
      <nav id="menu" className={!isMobile ? "d-none" : ""}>
        <ul>
          <li className="setlang">
            <span>
              <Image
                src={`/assets/images/flags/${currentLang === "ar"
                  ? "ae"
                  : currentLang === "de"
                    ? "de"
                    : "gb"
                  }.svg`}
                alt={currentLang?.toUpperCase() || "EN"}
                width={20}
                height={20}
                loading="lazy"
              />
              {currentLang === "ar"
                ? "Arabic"
                : currentLang === "de"
                  ? "German"
                  : "English"}
            </span>
            <ul>
              <li className={currentLang === "en" ? "active" : ""}>
                <a role="button" onClick={() => changeLanguage("en")}>
                  <Image
                    src="/assets/images/flags/gb.svg"
                    alt="English"
                    width={16}
                    height={16}
                    loading="lazy"
                  />{" "}
                  English
                </a>
              </li>
              <li className={currentLang === "ar" ? "active" : ""}>
                <a role="button" onClick={() => changeLanguage("ar")}>
                  <Image
                    src="/assets/images/flags/ae.svg"
                    alt="Arabic"
                    width={16}
                    height={16}
                    loading="lazy"
                  />{" "}
                  Arabic
                </a>
              </li>
              <li className={currentLang === "de" ? "active" : ""}>
                <a role="button" onClick={() => changeLanguage("de")}>

                  <Image
                    src="/assets/images/flags/de.svg"
                    alt="Arabic"
                    width={16}
                    height={16}
                    loading="lazy"
                  />{" "}
                  German
                </a>
              </li>
            </ul>
          </li>
          {menuData?.length && menuData.map((item) => (
            <li key={item.name}>
              <span>{item.icon} {item.name}</span>
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
                  <Speedometer color="currentColor" size={18} />{" "}
                  {translation?.dashboard || "Dashboard"}
                </Link>
              </li>
              <li>
                <Link href="/my-profile">
                  <Person color="currentColor" size={18} />{" "}
                  {translation?.profile || "Profile"}
                </Link>
              </li>
              <li>
                <Link href="/review-list">
                  <ChatRightQuote color="currentColor" size={18} />{" "}
                  {translation?.reviews || "Reviews"}
                </Link>
              </li>
              <li>
                <Link href="/my-property-listing?post_for=sale">
                  <House color="currentColor" size={18} />{" "}
                  {translation?.my_properties || "My Properties"}
                </Link>
              </li>
              <li>
                <Link href="/my-project">
                  <Building color="currentColor" size={18} />{" "}
                  {translation?.my_projects || "My Projects"}
                </Link>
              </li>
              <li>
                <Link href="/my-favourite-list">
                  <HouseHeart color="currentColor" size={18} />{" "}
                  {translation?.my_property_favourites ||
                    "My Property Favourites"}
                </Link>
              </li>
              <li>
                <Link href="/my-project-favourite-list">
                  <BookmarkStar color="currentColor" size={18} />{" "}
                  {translation?.my_project_favourites ||
                    "My Project Favourites"}
                </Link>
              </li>
              <li>
                <Link href="/postproperty">
                  <Cursor color="currentColor" size={18} />{" "}
                  {translation?.post_property || "Post Property"}
                </Link>
              </li>
              <li>
                <Link href="/property-crm">
                  <i className="icon-line-awesome-arrow-right"></i>{" "}
                  {translation?.leads || "Leads"}
                </Link>
              </li>
              <li>
                <Link href="/membership">
                  <Box color="currentColor" size={18} />{" "}
                  {translation?.packages || "Packages"}
                </Link>
              </li>
              <li>
                <Link href="/enquiry-list">
                  <Mic color="currentColor" size={18} />{" "}
                  {translation?.enquiries || "Enquiries"}
                </Link>
              </li>
              <li>
                <Link href="/report">
                  <Flag color="currentColor" size={18} />{" "}
                  {translation?.user_report || "User Report"}
                </Link>
              </li>
              <li>
                <Link href="/update-password">
                  <Lock color="currentColor" size={18} />{" "}
                  {translation?.change_password || "Change Password"}
                </Link>
              </li>
              <li>
                <Link href="/" onClick={handleLogout}>
                  <BoxArrowRight color="currentColor" size={18} />{" "}
                  {translation?.logout || "Logout"}
                </Link>
              </li>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <li>
                <Link href="/login" className="active">
                  <BoxArrowLeft color="currentColor" size={18} />{" "}
                  <span>{translation?.login || "Login"}</span>
                </Link>
              </li>

              <li>
                <Link href="/register" className="active">
                  <Person color="currentColor" size={18} />{" "}
                  <span>{translation?.register || "Register"}</span>
                </Link>
              </li>
            </React.Fragment>
          )}
        </ul>
      </nav>
    </>
  )
}

export default MobileMenu;