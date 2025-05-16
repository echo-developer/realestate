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
  const [localityInputSearch, setLocalityInputSearch] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const [localityDropdown, setLocalityDropdown] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setDefaultCity(
        JSON.parse(localStorage.getItem("city"))
      );
    }
  }, []);


  // const currencies = ["USD", "EUR", "GBP", "INR", "JPY", "AUD", "CAD", "CHF", "CNY", "AED"];

  function formatPrice(price) {
    if(!price) return;
    if (!currencyCode) return price?.toString();  
  
    const upperCurrency = currencyCode?.toUpperCase();
  
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
    }
    getCurrencyCode();
    getCurrency();
  }, [memberId])

  // useEffect(() => {
  //   if(defaultCity?.city_id) {
  //     const getLocalityList = async () => {
  //       try {
  //         const res = await callApi({
  //           api: `/locality-list`,
  //           method: "GET",
  //           data: {
  //             city_id: defaultCity.city_id
  //           }
  //         })
  //         if(res && res?.status == 1) {
  //           setLocalityList(res?.data || []);
  //         } 
  //       } catch (error) {
  //         console.error(error.message || 'Something went wrong')
  //       }

  //     }

  //     getLocalityList();
  //   }
  // }, [defaultCity?.city_id])

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(localityInputSearch)
    }, 500)

    return () => {
      clearTimeout(handler);
    }
  }, [localityInputSearch])


  useEffect(() => {
    if(debouncedValue?.length >= 3) {
      fetchLocalityList();
    }
  }, [debouncedValue])


  const fetchLocalityList = async () => {
    setLocalityList([
      { id: 1, name: "Salt Lake" },
      { id: 2, name: "New Town" },
      { id: 3, name: "Behala" },
      { id: 4, name: "Dum Dum" },
      { id: 5, name: "Garia" },
      { id: 6, name: "Tollygunge" },
      { id: 7, name: "Park Street" },
      { id: 8, name: "Jadavpur" },
      { id: 9, name: "Ballygunge" },
      { id: 10, name: "Howrah" }
    ])
  }

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

  const badgesObject = {
    'Responsive Broker': "bg-success-subtle text-success",
    'Quality Lister': "bg-primary-subtle text-primary",
    'Tru broker': "bg-warning-subtle text-warning",
    'Great performar': "bg-info-subtle text-info"
  }

  function getBadgeButtonClass(badgeName) {
    return badgesObject[badgeName] || 'bg-primary-subtle text-primary'
}


const buildAgentUrl = (agent) => {
  return `/agent-details/${agent.name.toLowerCase().replace(/\s+/g, '-')}?id=${agent.user_id}`;
}



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
        formatPrice,
        localityList,
        localityInputSearch,
        setLocalityInputSearch,
        localityDropdown,
        setLocalityDropdown, 
        getBadgeButtonClass,
        buildAgentUrl
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}