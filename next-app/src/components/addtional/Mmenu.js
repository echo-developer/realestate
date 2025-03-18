"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import useIsMobile from "@/hooks/useIsMobile";
import "mmenu-js/dist/mmenu.css";

const MobileMenu = ({ translation, handleLogout }) => {
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile && typeof window !== "undefined") {
      import("mmenu-js").then(({ default: Mmenu }) => {
        const menu = new Mmenu("#menu", {
          slidingSubmenus: true,
          theme: "dark",
          extensions: ["position-right", "fx-menu-slide"],
          navbars: [{
            content: ["prev", "title"]
          }]
        });

        const api = menu.API;
        document.querySelector(".menu-trigger")?.addEventListener("click", () => api.open());
      });
    }
  }, [isMobile]);

  const menuData = [
    {
      name: "Buy",
      options: [
        {
          name: "Popular Choices",
          links: [
            { text: "Ready to Move", url: "/property-listing?post_for=sell&property_type=1" },
            { text: "Owner Properties", url: "/property-listing?post_for=sell&property_type=1" },
            { text: "Budget Homes", url: "/property-listing?sort_key=exp_price&sort_order=asc" },
            { text: "New Projects", url: "/project-listing" },
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
            { text: "Owner Properties", url: "/property-listing?post_for=rent" },
            { text: "Furnished Properties", url: "/property-listing?post_for=rent" },
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
                      <span>{option.name}</span>
                      <ul>
                        {option.links?.map((link, linkIndex) => (
                          <li key={linkIndex}>
                            <Link href={link.url}>{link.text}</Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
            <li>
              <Link href="/" onClick={handleLogout}>{translation?.logout || "Logout"}</Link>
            </li>
          </ul>
        </nav>
      )}
    </>
  );
};

export default MobileMenu;