"use client";
import React, { useState } from "react";
import Image from "next/image";
import "./home.css";
import dynamic from "next/dynamic";
// import BannerForm from "./BannerForm";
import useTranslation from "@/hooks/useTranslation";
// const BannerForm = dynamic(() => import('./BannerForm'), { ssr: false })
import BannerForm from "./BannerForm";


const Banner = () => {
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [dropdownState, setDropdownState] = useState({});
  const translation = useTranslation();

  const handleClickOutside = (e) => {
    setDropdownState({});
    setIsOverlayVisible(false);
  };

  return (
    <React.Fragment>
      {isOverlayVisible && (
        <div
          className="page-overlay"
          style={{ zIndex: 1 }}
          onClick={handleClickOutside}
        ></div>
      )}
      <div className="clearfix"></div>
      <section
        className="banner"
      // style={{ backgroundImage: "url('/assets/images/banner-1.webp')" }}
      >
        <Image
          src="/assets/images/banner-1.webp"
          alt="Main banner"
          fill
          priority
          sizes="100vw"
          // placeholder="blur"
          // blurDataURL="/assets/images/banner-1-blur.webp" 
          style={{
            objectFit: "cover",
            objectPosition: "bottom center",
            zIndex: -1,
          }}
        />
        <div className="banner-layer">
          <div
            className="transparent-header-spacer"
            style={{ height: "50px" }}
          ></div>
          <div className="container-lg">
            <div className="banner-form">
              <div className="row justify-content-center align-items-center">
                <div className="col-xl-9 col-lg-11 col-12">
                  <div className="headline">
                    <h1>
                      {translation?.search_home_you_love ||
                        "Search A Home Which You’ll Love"}
                    </h1>
                  </div>
                  <BannerForm handleClickOutside={handleClickOutside} dropdownState={dropdownState} setDropdownState={setDropdownState} setIsOverlayVisible={setIsOverlayVisible} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
};

export default Banner;
