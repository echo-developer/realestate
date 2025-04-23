"use client";
import AuthUser from "@/components/Authentication/AuthUser";
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const { callApi, GetMemberId } = AuthUser()
  const memberId = GetMemberId();
  const [propertyFor, setPropertyFor] = useState(null);
  const [defaultCity, setDefaultCity] = useState(null);
  const [getAllCity, setGetAllCity] = useState([]);
  const [userLoading, setUserLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [currency, setCurrency] = useState("");
  const [currencyCode, setCurrencyCode] = useState("");
  const [localityList, setLocalityList] = useState([]);

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


  // const currencies = ["USD", "EUR", "GBP", "INR", "JPY", "AUD", "CAD", "CHF", "CNY", "AED"];

  function formatPrice(price) {
    if (!currencyCode) return price.toString();  
  
    const upperCurrency = currencyCode.toUpperCase();
  
    switch (upperCurrency) {
  
      case "INR":
        if (price >= 10000000) return `${upperCurrency} ${(price / 10000000).toFixed(1)} Cr`;
        if (price >= 100000) return `${upperCurrency} ${(price / 100000).toFixed(1)} Lac`;
        if (price >= 1000) return `${upperCurrency} ${(price / 1000).toFixed(1)}K`;
        return `${upperCurrency} ${price.toString()}`;
  
      case "JPY":
      case "CNY":
        if (price >= 1000000000) return `${upperCurrency} ${(price / 1000000000).toFixed(1)}B`;
        if (price >= 1000000) return `${upperCurrency} ${(price / 1000000).toFixed(1)}M`;
        if (price >= 1000) return `${upperCurrency} ${(price / 1000).toFixed(1)}K`;
        return `${upperCurrency} ${price.toString()}`;
  
      case "USD":
      case "EUR":
      case "GBP":
      case "AUD":
      case "CAD":
      case "CHF":
      case "AED":
        if (price >= 1000000000) return `${upperCurrency} ${(price / 1000000000).toFixed(1)}B`;
        if (price >= 1000000) return `${upperCurrency} ${(price / 1000000).toFixed(1)}M`;
        if (price >= 1000) return `${upperCurrency} ${(price / 1000).toFixed(1)}K`;
        return `${upperCurrency} ${price.toString()}`;
  
      default:
        return `${upperCurrency} ${price.toString()}`;
    }
}

  


  useEffect(() => {
    if(memberId) {
      fetchUserData();
      getCurrency();
      getCurrencyCode();
    }
  }, [memberId])

  useEffect(() => {
    if(defaultCity?.city_id) {
      const getLocalityList = async () => {
        try {
          const res = await callApi({
            api: `/locality-list`,
            method: "GET",
            data: {
              city_id: defaultCity.city_id
            }
          })
          if(res && res?.status == 1) {
            setLocalityList(res?.data || []);
          } 
        } catch (error) {
          console.error(error.message || 'Something went wrong')
        }

      }
      
      getLocalityList();
    }
  }, [defaultCity?.city_id])

  const getCurrency = async () => {
    try {
      const res = await callApi({
        api: `/get-settings-value/site-currency`,
        method: "GET",
      })
      if(res && res?.status == 1) {
        setCurrency(res?.value);
      }
    } catch (error) {
      console.error(error?.message)
    }
  }

  const getCurrencyCode = async () => {
    try {
      const res = await callApi({
        api: `/get-settings-value/site-currency-code`,
        method: "GET",
      })
      if(res && res?.status == 1) {
        setCurrencyCode(res?.value);
      }
    } catch (error) {
      console.error(error?.message)
    }
  }
  // site-currency-code
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
        console.error(error.message || "Failed to get User Data");
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
        userData,
        userLoading,
        setUserData,
        uploadUserImage,
        currency,
        currencyCode,
        formatPrice
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}