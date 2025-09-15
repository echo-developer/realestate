"use client";

import React, { useEffect, useRef, useState } from "react";
import "mmenu-js/dist/mmenu.css";
import "./mmenu.css";
import Image from "next/image";
import AuthUser from "../Authentication/AuthUser";
import Link from "next/link";
import {
  Cursor, ChatRightQuote, Speedometer, List, House, Building,
  HouseHeart, BookmarkStar, Box, Mic, Flag, Lock,
  BoxArrowRight, BoxArrowLeft, Person, Cart, People,  Tag,  Key,
} from "react-bootstrap-icons";
// import { menuData } from "../header/headerData";

const MobileMenu = ({ translation, handleLogout, currency }) => {
  const [isMobile, setIsMobile] = useState(false);
  const { GetMemberId } = AuthUser();
  const memberId = GetMemberId();
  const menuInstanceRef = useRef(null);
  const [menuInitialized, setMenuInitialized] = useState(false);
  const [currentLang, setCurrentLang] = useState("ro");

  const breakpoint = 992;


  const menuData = [
    {
      name: translation?.buy || "Buy",
      icon: <Cart color="currentColor" size={18} />,
      options: [
        {
          name: translation?.popular_choices || "Popular Choices",
          links: [
            {
              text: translation?.ready_to_move || "Ready to Move",
              url: "/property-listing?post_for=sell&property_type=1",

            },
            {
              text: translation?.owner_properties || "Owner Properties",
              url: "/property-listing?post_for=sell&property_type=1",
            },
            {
              text: translation?.budget_homes || "Budget Homes",
              url: "/property-listing?sort_key=exp_price&sort_order=asc",
            },
            { text: translation?.new_projects || "New Projects", url: "/project-listing" },
          ],
        },
        {
          name: translation?.property_types || "Property Types",
          links: [
            {
              text: translation?.flat_for || "Flat for ",
              url: "/property-listing?property_type=1&property_for=1",
            },
            {
              text: translation?.villa_for || "Villa for ",
              url: "/property-listing?property_type=1&property_for=2",
            },
            {
              text: translation?.residential_house || "Residential House ",
              url: "/property-listing?property_type=1&property_for=6",
            },
            {
              text: translation?.offices || "Offices ",
              url: "/property-listing?property_type=2&property_for=3",
            },
            {
              text: translation?.commercial_office_space || "Commercial Office Space",
              url: "/property-listing?post_for=sell&property_type=2&property_for=11",
            },
          ],
        },
        {
          name: translation?.budget || "Budget",
          links: [
            {
              text: translation?.under_aed_399 || `Under ${currency} 399.00`,
              url: '/property-listing?post_for=sell&property_type=1&searchData={"max_budget":399}',
            },
            {
              text: `${currency}400.00 - ${currency}699.00`,
              url: '/property-listing?post_for=sell&property_type=1&searchData={"min_budget":400,"max_budget":699}',
            },
            {
              text: `${currency}700.00 - ${currency}1199.00`,
              url: '/property-listing?post_for=sell&property_type=1&searchData={"min_budget":700,"max_budget":1199}',
            },
            {
              text: `${currency}1200.00 - ${currency}1599.00`,
              url: '/property-listing?post_for=sell&property_type=1&searchData={"min_budget":1200,"max_budget":1599}',
            },
            {
              text: `Above ${currency}1600.00`,
              url: '/property-listing?post_for=sell&property_type=1&searchData={"min_budget":1600}',
            },
          ],
        },
        {
          name: translation?.explore || "Explore",
          links: [
            { text: translation?.find_an_agent || "Find an Agent", url: "/agent-list" },
            { text: translation?.projects || "Projects", url: "/project-listing" },
            { text: translation?.property_valuation || "Property Valuation", url: "/property-valuation" },
            { text: translation?.top_agents || "Top Agents ", url: "/agent-list" },
          ],
        },
      ],

    },
    {
      name: translation?.rent || "Rent",
      icon: <Key color="currentColor" size={18} />,
      options: [
        {
          name: translation?.popular_choices || "Popular Choices",
          links: [
            {
              text: translation?.owner_properties || "Owner Properties",
              url: "/property-listing?post_for=rent",
            },
            {
              text: translation?.furnished_properties || "Furnished Properties",
              url: "/property-listing?post_for=rent",
            },
            {
              text: translation?.semi_furnished_properties || "Semi Furnished Properties",
              url: "/property-listing?post_for=rent",
            },
            {
              text: translation?.immediately_available || "Immediately Available",
              url: "/property-listing?post_for=rent",
            },
          ],
        },
        {
          name: translation?.property_type || "Property Types",
          links: [
            {
              text: `${translation?.flat_for || "Flat for"} ${translation?.rent || "Rent"}`,
              url: "/property-listing?post_for=rent&property_type=1&property_for=1",
            },
            {
              text: `${translation?.villa_for || "Villa for"} ${translation?.rent || "Rent"}`,
              url: "/property-listing?post_for=rent&property_type=1&property_for=2",
            },
            {
              text: `${translation?.residential_house || "Residential House"} for rent `,
              url: "/property-listing?post_for=rent&property_type=1&property_for=6",
            },
            {
              text: translation?.offices_for_rent || "Offices for rent ",
              url: "/property-listing?post_for=rent&property_type=2&property_for=3",
            },
            {
              text: translation?.commercial_office_space_rent || "Commercial Office Space for rent ",
              url: "/property-listing?post_for=rent&property_type=2&property_for=11",
            },
          ],
        },
        {
          name: translation?.budget || "Budget",
          links: [
            {
              text: translation?.under_aed_399 || "Under AED 399.00",
              url: "/property-listing?post_for=rent",
            },
            {
              text: `${currency}400.00 - ${currency}699.00`,
              url: "/property-listing?post_for=rent",
            },
            {
              text: `${currency}700.00 - ${currency}1199.00`,
              url: "/property-listing?post_for=rent",
            },
            {
              text: `${currency}1200.00 - ${currency}1599.00`,
              url: "/property-listing?post_for=rent",
            },
            {
              text: translation?.above_aed_1600 || "Above AED1600.00",
              url: "/property-listing?post_for=rent",
            },
          ],
        },
        {
          name: translation?.explore || "Explore",
          links: [
            { text: translation?.find_an_agent || "Find an Agent", url: "/agent-list" },
            { text: translation?.rent_agreement || "Rent Agreement", url: "/rent-agreement" },
          ],
        },
      ],
    },
    {
      name: translation?.sell || "Sell",
      icon: <Tag color="currentColor" size={18} />,
      options: [
        {
          name: translation?.for_owner || "For Owner",
          links: [
            { text: translation?.post_property || "Post Property", url: "/postproperty" },
            { text: translation?.my_dashboard || "My Dashboard", url: "/dashboard" },
            { text: translation?.sell_rent_ad_packages || "Sell / Rent Ad Packages", url: "/membership" },
          ],
        },
        {
          name: translation?.for_agent_builder || "For Agent & Builder",
          links: [
            { text: translation?.my_dashboard || "My Dashboard", url: "/dashboard" },
            { text: translation?.ad_packages || "Ad Packages", url: "/membership" },
            { text: translation?.sales_enquiry || "Sales Enquiry", url: "/sales-enquiry" },
          ],
        },
        {
          name: translation?.selling_tools || "Selling Tools",
          links: [
            { text: translation?.property_valuation || "Property Valuation In", url: "/property-valuation" },
            { text: translation?.find_an_agent || "Find an Agent", url: "/agent-list" },
          ],
        },
      ],
    },
    {
      name: translation?.agent || "Agent",
      options: [
        { text: translation?.find_an_agent || "Find an Agent", url: "/find-agent" },
        { text: translation?.become_an_agent || "Become an Agent", url: "/become-agent" },
      ],
      icon: <People color="currentColor" size={18} />,
      options: [{ text: translation?.find_an_agent || "Find an Agent", url: "/agent-list" }],
    },
  ]

  // ✅ Detect if screen is mobile
  useEffect(() => {
    if (typeof window !== "undefined") {
      const checkMobile = () => {
        setIsMobile(window.innerWidth <= breakpoint);
      };
      checkMobile();
      window.addEventListener("resize", checkMobile);
      return () => window.removeEventListener("resize", checkMobile);
    }
  }, []);

  // ✅ Get language from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedLang = localStorage.getItem("lang") || "ro";
      setCurrentLang(storedLang);
    }
  }, []);

  // ✅ Initialize mmenu
  useEffect(() => {
    if (typeof window !== "undefined" && isMobile && !menuInitialized) {
      import("mmenu-js").then(({ default: Mmenu }) => {
        const menuElement = document.querySelector("#menu");
        const menu = new Mmenu("#menu", {
          extensions: ["theme-dark", "position-right", "pagedim-black"],
          navbar: { title: "Menu" },
          clone: false // Important: avoid duplicating menu
        });

        menuInstanceRef.current = menu;
        setMenuInitialized(true);

        if (menuElement) {
          menuElement.style.display = "block";
        }
      });
    }

    return () => {
      if (menuInstanceRef.current) {
        menuInstanceRef.current.API.close();
        menuInstanceRef.current = null;
        setMenuInitialized(false);
      }
    };
  }, [isMobile]);

  // ✅ Add click listener for language items after menu is ready
  useEffect(() => {
    if (!menuInitialized) return;

    const timeout = setTimeout(() => {
      const items = document.querySelectorAll(".mm-listitem__text[data-lang]");
      const handleClick = (e) => {
        const lang = e.target.getAttribute("data-lang");
        if (lang) {
          changeLanguage(lang);
        }
      };

      items.forEach((item) => item.addEventListener("click", handleClick));

      return () => {
        items.forEach((item) =>
          item.removeEventListener("click", handleClick)
        );
      };
    }, 300);

    return () => clearTimeout(timeout);
  }, [menuInitialized]);

  const changeLanguage = (lang) => {
    if (menuInstanceRef.current) {
      menuInstanceRef.current.API.close();
    }
    localStorage.setItem("lang", lang);
    setCurrentLang(lang);

    setTimeout(() => {
      window.location.reload();
    }, 300);
  };

  const flagCode = currentLang === "ro" ? "ro" : currentLang === "en" ? "gb" : "nl";
  const flagSrc = `/assets/images/flags/${flagCode}.svg`;

  return (
    <>
      <a
        href="#menu"
        role="button"
        className={`hamburger-btn ${!isMobile ? "d-none" : ""}`}
      >
        <button className="menu-trigger">
          <List color="currentColor" size={24} />
        </button>
      </a>

      <nav id="menu" className={!isMobile ? "d-none" : ""}>
        <ul>
          {/* ✅ Language Section */}
          <li className="setlang">
            <span>
              <Image
                src={flagSrc}
                alt={currentLang?.toUpperCase()}
                width={20}
                height={20}
              />
              {currentLang === "ro" ? "Ro" : currentLang === "en" ? "En" : "Nl"}
            </span>
            <ul>
              <li className={currentLang === "ro" ? "active" : ""}>
                <a role="button" data-lang="ro">
                  <Image
                    src={"/assets/images/flags/ro.svg"}
                    alt="Romanian"
                    width={16}
                    height={16}
                  /> Ro
                </a>
              </li>
              <li className={currentLang === "en" ? "active" : ""}>
                <a role="button" data-lang="en">
                  <Image
                    src={"/assets/images/flags/gb.svg"}
                    alt="English"
                    width={16}
                    height={16}
                  /> En
                </a>
              </li>
              <li className={currentLang === "nl" ? "active" : ""}>
                <a role="button" data-lang="nl">
                  <Image
                    src={"/assets/images/flags/nl.svg"}
                    alt="Dutch"
                    width={16}
                    height={16}
                  /> Nl
                </a>
              </li>
            </ul>
          </li>

          {/* ✅ Menu Items */}
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

          {/* ✅ User Section */}
          {memberId ? (
            <>
              <li>
                <Link href="/dashboard" className="active">
                  <Speedometer size={18} /> {translation?.dashboard || "Dashboard"}
                </Link>
              </li>
              <li>
                <Link href="/my-profile">
                  <Person size={18} /> {translation?.profile || "Profile"}
                </Link>
              </li>
              <li>
                <Link href="/review-list">
                  <ChatRightQuote size={18} /> {translation?.reviews || "Reviews"}
                </Link>
              </li>
              <li>
                <Link href="/my-property-listing?post_for=sale">
                  <House size={18} /> {translation?.my_properties || "My Properties"}
                </Link>
              </li>
              <li>
                <Link href="/my-project">
                  <Building size={18} /> {translation?.my_projects || "My Projects"}
                </Link>
              </li>
              <li>
                <Link href="/my-favourite-list">
                  <HouseHeart size={18} /> {translation?.my_property_favourites || "My Property Favourites"}
                </Link>
              </li>
              <li>
                <Link href="/my-project-favourite-list">
                  <BookmarkStar size={18} /> {translation?.my_project_favourites || "My Project Favourites"}
                </Link>
              </li>
              <li>
                <Link href="/postproperty">
                  <Cursor size={18} /> {translation?.post_property || "Post Property"}
                </Link>
              </li>
              <li>
                <Link href="/membership">
                  <Box size={18} /> {translation?.packages || "Packages"}
                </Link>
              </li>
              <li>
                <Link href="/enquiry-list">
                  <Mic size={18} /> {translation?.enquiries || "Enquiries"}
                </Link>
              </li>
              <li>
                <Link href="/report">
                  <Flag size={18} /> {translation?.user_report || "User Report"}
                </Link>
              </li>
              <li>
                <Link href="/update-password">
                  <Lock size={18} /> {translation?.change_password || "Change Password"}
                </Link>
              </li>
              <li>
                <Link href="/" onClick={handleLogout}>
                  <BoxArrowRight size={18} /> {translation?.logout || "Logout"}
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href="/login" className="active">
                  <BoxArrowLeft size={18} /> <span>{translation?.login || "Login"}</span>
                </Link>
              </li>
              <li>
                <Link href="/register" className="active">
                  <Person size={18} /> <span>{translation?.register || "Register"}</span>
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </>
  );
};

export default MobileMenu;
