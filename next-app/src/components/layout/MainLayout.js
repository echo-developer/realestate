"use client"
import React, { useState, useEffect } from "react";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import Loading from "../LoadingSpinner/Loading";

const MainLayout = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 1000); 

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
