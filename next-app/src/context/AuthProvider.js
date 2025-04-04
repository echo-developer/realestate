"use client";
import AuthUser from "@/components/Authentication/AuthUser";
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const { callApi, GetMemberId } = AuthUser();

  const memberId = GetMemberId();
  
  const [propertyFor, setPropertyFor] = useState(null);
    const [defaultCity, setDefaultCity] = useState(null);
    const [userLoading, setUserLoading] = useState(true);
    const [userData, setUserData] = useState(null);
  
    useEffect(() => {
      
      if (typeof window !== "undefined") {
        setDefaultCity(JSON.parse(localStorage.getItem("city")) || {city_id:1,name:"Kolkata"});
      }
    }, []);

    useEffect(() => {
      if(memberId) {
        fetchUserData();
      }
    }, [memberId])
  
  
    const handleDefaultCityChange =  (city) => {
      setDefaultCity(city);
      localStorage.setItem("city", JSON.stringify(city));
    } 
      const fetchUserData = async () => {
        setUserLoading(true);
        try {
          const response = await callApi({
            api: '/get_user_data',
            method: "GET",
            data: {
              member_id: memberId,
            },
          });
    
          if(response?.success == 1) {
            setUserData(response?.data);
          }
        } catch (error) {
          toast.error(error.message || "Failed to get User Data");
        } finally {
          setUserLoading(false);
        }
      };

      // console.log("user data", userData);f

      const uploadUserImage = (imageUrl) => {
        setUserData(prev => {
          return {
            ...prev,
            image: imageUrl
          }
        })
      }

  return (
    <AuthContext.Provider
      value={{
        propertyFor,
        setPropertyFor,
        defaultCity,
        handleDefaultCityChange,
        userData,
        userLoading,
        setUserData,
        uploadUserImage
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}