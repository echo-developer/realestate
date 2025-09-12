"use client";
import React, { Suspense, useState } from "react";
import Image from "next/image";
import "./home.css";
import useTranslation from "@/hooks/useTranslation";
import useIsMobile from "@/hooks/useIsMobile";
import BannerForm from "./BannerForm";


const Banner = () => {
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [dropdownState, setDropdownState] = useState({});
  const translation = useTranslation();
  const isMobile = useIsMobile();

  const handleClickOutside = (e) => {
    setDropdownState({});
    setIsOverlayVisible(false);
  };

  // if (isMobile === null) {
  //   return null;
  // }

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
      >
        {!isMobile && (
          <Image
            src="/assets/images/banner-1.webp"
            alt="Main banner"
            fill
            priority
            sizes="100vw"
            style={{
              objectFit: "cover",
              objectPosition: "bottom center",
              zIndex: -1,
            }}
          />
        )}
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
                  <Suspense fallback={<></>}>
                    <BannerForm handleClickOutside={handleClickOutside} dropdownState={dropdownState} setDropdownState={setDropdownState} setIsOverlayVisible={setIsOverlayVisible} />
                  </Suspense>
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
