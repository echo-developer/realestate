import React, { useState ,useEffect } from "react";
import Link from "next/link";
import "../../app/globals.css";

const Header = () => {
  const [showLocationDrop, setShowLocationDrop] = useState(false);

  const handleShowLocationDropDown = () => {
    setShowLocationDrop((prev) => !prev);
  };

  const handleRightClick = (e) => {
    setShowLocationDrop(false);
  };
  useEffect(() => {
    document.addEventListener('contextmenu', handleRightClick);
    return () => {
      document.removeEventListener('contextmenu', handleRightClick);
    };
  }, []);

  return (
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
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded={showLocationDrop ? "true" : "false"}
                onClick={handleShowLocationDropDown}
              >
                Kolkata
              </Link>
              <ul className={`dropdown-menu ${showLocationDrop ? "show" : ""}`}>
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
              <ul id="desk-nav" className="navbar-nav me-lg-auto mb-2 mb-lg-0">
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
                      <Link href="#">Something</Link>
                    </li>
                  </ul>
                </li>
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
                <li className="nav-item mt-3 ms-3">
                  <Link href="/post" className="btn btn-primary btn-post">
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
            <span className="mmenu-trigger">
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
  );
};

export default Header;
