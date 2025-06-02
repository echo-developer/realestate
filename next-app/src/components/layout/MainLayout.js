"use client"
import React, { useState, useEffect } from "react";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import Loading from "../LoadingSpinner/Loading";
import useTranslation from "@/hooks/useTranslation";

const MainLayout = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
const translation = useTranslation();
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500); 

    return () => clearTimeout(timer);
  }, []);

  return (
    <React.Fragment>
      {!isLoaded ? (
        <Loading /> 
      ) : (
        <>
          <Header />
          {children}
          <Footer />
        </>
      )}
    </React.Fragment>
  );
};

export default MainLayout;
