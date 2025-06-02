import React, { useState, useEffect } from "react";
import useTranslation from "@/hooks/useTranslation";
import Link from "next/link";
import NextImage from "next/image";
import MobileMenu from "./Mmenu";
import useIsMobile from "@/hooks/useIsMobile";

const LoginHeader = () => {
  const translation = useTranslation();
  const [selectedCity, setSelectedCity] = useState("Kolkata");
  const [currentLang, setCurrentLang] = useState("en");
  const [scrollState, setScrollState] = useState("header-sticky");
  const [isDesktopLogoLoaded, setIsDesktopLogoLoaded] = useState(false);
  const [isMobileLogoLoaded, setIsMobileLogoLoaded] = useState(false);
  const [mobileView, setMobileView] = useState(false);

  useEffect(() => {
    const storedLang = localStorage.getItem("lang") || "en";
    setCurrentLang(storedLang);
  }, []);

  const changeLanguage = (lang) => {
    localStorage.setItem("lang", lang);
    setCurrentLang(lang);
    window.location.reload();
  };

  const handleLogout = () => {
    logout();
    setMobileView(false);
  };
  useEffect(() => {
      // const desktopImage = new Image();
      // desktopImage.src = "/assets/images/logo.png";
      // desktopImage.onload = () => setIsDesktopLogoLoaded(true);
      // desktopImage.onerror = () => setIsDesktopLogoLoaded(false);
  
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
                              >
                                {/* {!isDesktopLogoLoaded && (
                                  <div className="shimmer-placeholder"></div>
                                )} */}
                                {/* {isDesktopLogoLoaded && (
                                  <img
                                    src="/assets/images/logo.png"
                                    alt="Logo"
                                    loading="lazy"
                                    style={{ opacity: isDesktopLogoLoaded ? 1 : 0, transition: 'opacity 0.3s ease-in-out' }}
                                  />
                                )} */}
                                <NextImage
                                  src="/assets/images/logo.png"
                                  alt="Logo"
                                  width={151}
                                  height={56}
                                  priority
                                />
              
                              </div>
              
                              {/* Mobile Logo with Shimmer */}
                              <div
                                className="d-md-none"
                              >
                                {!isMobileLogoLoaded && (
                                  <div className="shimmer-placeholder"></div>
                                )}
                                {isMobileLogoLoaded && (
                                  <img
                                    src="/assets/images/logo-mobile.png"
                                    alt="Logo"
                                    loading="lazy"
                                  />
                                )}
                              </div>
              
                              <style jsx>{`
                                  .shimmer-placeholder {
                                    display: block;
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
            </div>
            <div className="d-none d-lg-flex">
              <div id="navigation">
                <ul
                  id="desk-nav"
                  className="navbar-nav me-lg-auto mb-2 mb-lg-0"
                >
                  <li className="nav-item ms-3">
                    <Link
                      href="/postproperty"
                      className="btn btn-primary btn-post"
                    >
                      <i className="icon-line-awesome-mouse-pointer"></i>{" "}
                      {translation?.post_property || "Post Property"}{" "}
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
            </div>

              <MobileMenu
                translation={translation}
                handleLogout={handleLogout}
                selectedCity={selectedCity}
                currentLang={currentLang}
                changeLanguage={changeLanguage}
              />
            
          </div>
        </nav>
      </header>
    </>
  );
};

export default LoginHeader;
