"use client"
import React, { useState, useEffect } from "react";
// import Header from "../header/Header";
// import Footer from "../footer/Footer";
import dynamic from "next/dynamic";
// import Loading from "../LoadingSpinner/Loading";
import { usePathname } from "next/navigation";
const Header = dynamic(() => import('../header/Header'), { ssr: false });
const Footer = dynamic(() => import('../footer/Footer'), { ssr: false });
const Loading = dynamic(() => import('../LoadingSpinner/Loading'), { ssr: false });
import { useInView } from "react-intersection-observer";

const MainLayout = ({ children }) => {
  const pathname = usePathname();
  const [isLoaded, setIsLoaded] = useState(false);
  const [footerRef, footerView] = useInView({ triggerOnce: true, threshold: 0.1})
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300); 

    return () => clearTimeout(timer);
  }, []);

  if(!isLoaded && pathname != '/') {
    return <Loading />
  }
  return (
    <React.Fragment>
      
        <>
          <Header />
          {children}
          <div ref={footerRef}>
          {footerView && (
            <Footer />
          )}
          </div>
        </>
    </React.Fragment>
  );
};

export default MainLayout;
