"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [propertyFor, setPropertyFor] = useState(null);
    const [defaultCity, setDefaultCity] = useState(null);
  
    useEffect(() => {
      
      if (typeof window !== "undefined") {
        setDefaultCity(JSON.parse(localStorage.getItem("city")) || {city_id:1,name:"Kolkata"});
      }
    }, []);
  
  
    const handleDefaultCityChange =  (city) => {
      setDefaultCity(city);
      localStorage.setItem("city", JSON.stringify(city));
    } 

  return (
    <AuthContext.Provider
      value={{
        propertyFor,
        setPropertyFor,
        defaultCity,
        handleDefaultCityChange
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
