
import React, { useState, useEffect } from "react";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import Loading from "../LoadingSpinner/Loading";

const MainLayout = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate loading delay or monitor actual data fetching process
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 1000); // You can change this to a dynamic loading condition

    return () => clearTimeout(timer); // Cleanup on unmount
  }, []);

  return (
    <React.Fragment>
      {!isLoaded ? (
        <Loading /> // Show spinner before content is ready
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
