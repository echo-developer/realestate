"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import "mmenu-js/dist/mmenu.css";

const MobileMenu = ({ translation, handleLogout }) => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("mmenu-js").then(({ default: Mmenu }) => {
        const menu = new Mmenu("#menu", {
          slidingSubmenus: true,
          theme: "dark",
          extensions: ["position-right", "fx-menu-slide"],
        });

        const api = menu.API;
        document
          .querySelector(".menu-trigger")
          ?.addEventListener("click", () => api.open());
      });
    }
  }, []);

  return (
    <>
      {/* Mobile Menu Button */}
      <button className="menu-trigger">☰ Menu</button>

      {/* Mobile Menu */}
      <nav id="menu">
        <ul>
          <li>
            <Link href="/dashboard">{translation?.dashboard || "Dashboard"}</Link>
          </li>
          <li>
            <Link href="/my-profile">{translation?.profile || "Profile"}</Link>
          </li>

          {/* Properties with Submenu */}
          <li>
            <a href="#submenu-properties">{translation?.properties || "Properties"}</a>
            <ul id="submenu-properties">
              <li>
                <Link href="/my-property-listing">
                  {translation?.my_properties || "My Properties"}
                </Link>
              </li>
              <li>
                <Link href="/my-project">
                  {translation?.my_projects || "My Projects"}
                </Link>
              </li>
            </ul>
          </li>

          <li>
            <Link href="/membership">{translation?.packages || "Packages"}</Link>
          </li>
          <li>
            <Link href="/update-password">{translation?.change_password || "Change Password"}</Link>
          </li>
          <li>
            <Link href="/" onClick={handleLogout}>
              {translation?.logout || "Logout"}
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default MobileMenu;
