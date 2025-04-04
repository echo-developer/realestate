"use client";
import AuthUser from "@/components/Authentication/AuthUser";
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const { callApi, GetMemberId } = AuthUser()
  const [propertyFor, setPropertyFor] = useState(null);
  const [defaultCity, setDefaultCity] = useState(null);
  const [getAllCity, setGetAllCity] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setDefaultCity(
        JSON.parse(localStorage.getItem("city")) || {
          city_id: 1,
          name: "Kolkata",
        }
      );
    }
  }, []);

  const handleDefaultCityChange = (city) => {
    setDefaultCity(city);
    localStorage.setItem("city", JSON.stringify(city));
  };

  return (
    <AuthContext.Provider
      value={{
        propertyFor,
        setPropertyFor,
        defaultCity,
        handleDefaultCityChange,
        getAllCity,
        setGetAllCity,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}