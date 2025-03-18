"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import Mmenu from "mmenu-js";
import "mmenu-js/dist/mmenu.css";
import './mmenu.css'

const MobileMenu = ({ translation, handleLogout }) => {
  useEffect(() => {
    const menu = new Mmenu("#menu", {
      slidingSubmenus: true,
      theme: "dark",
      extensions: ["position-right", "fx-menu-slide"],
    });

    const api = menu.API;
    document
      .querySelector(".menu-trigger")
      .addEventListener("click", () => api.open());
  }, []);

  return (
    <>
      {/* Mobile Menu Button */}
      <button className="menu-trigger">☰ Menu</button>

      {/* Mobile Menu */}
      <nav id="menu">
        <ul className="user-nav">
          <li>
            <Link href="/dashboard">{translation?.dashboard || "Dashboard"}</Link>
          </li>
          <li>
            <Link href="/my-profile">{translation?.profile || "Profile"}</Link>
          </li>
          <li>
            <Link href="/review-list">{translation?.reviews || "Reviews"}</Link>
          </li>
          <li>
            <Link href="/message">{translation?.message || "Message"}</Link>
          </li>
          <li>
            <Link href="/my-property-listing">{translation?.my_properties || "My Properties"}</Link>
          </li>
          <li>
            <Link href="/my-project">{translation?.my_projects || "My Projects"}</Link>
          </li>
          <li>
            <Link href="/membership">{translation?.packages || "Packages"}</Link>
          </li>
          <li>
            <Link href="/update-password">{translation?.change_password || "Change Password"}</Link>
          </li>
          <li>
            <Link href="/" onClick={handleLogout}>{translation?.logout || "Logout"}</Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default MobileMenu;
