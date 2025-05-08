"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthUser = () => {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  //const [isClient, setIsClient] = useState('');
  const isClient =true;

  /* useEffect(() => {
    setIsClient(true);
  }, []) */

  const saveToken = (userData) => {
    if (isClient) {
      localStorage.setItem("user", JSON.stringify(userData));
    }
  };

  const getToken = () => {
    if (typeof window !== "undefined") {
    if (isClient) {
      const user = localStorage.getItem("user");
      return user;
    }
    return null;
  }
  };

  const isLogin = () => {
    const token =  GetMemberId();
    if (!token) {
       localStorage.removeItem("user");
      return false;
    }

    return token;
  };

  const getMemberIdFromToken = (token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded && decoded.sub ? decoded.sub : null;
    } catch (error) {
      console.error("Error decoding JWT token:", error);
      return null;
    }
  };

  const GetMemberId = () => {
    const token = getToken();
    if (token) {
      return getMemberIdFromToken(token);
    }
    return null;
  };

  const logout = () => {
    if (isClient) {
      localStorage.removeItem("user");
    }
  };

  const callApi = async (apiData) => {
    const { method, api, data } = apiData;
    const token = getToken();
    const defaultHeaders = {};
    if (token) {
      defaultHeaders["OSPL"] = `Bearer ${JSON.parse(token)}`;
    }

    try {
      let response;
      switch (method) {
        case "GET":
          response = await axios.get(`${baseURL}${api}`, {
            headers: defaultHeaders,
            params: data,
          });
          break;
        case "POST":
          response = await axios.post(`${baseURL}${api}`, data, {
            headers: defaultHeaders,
          });
          break;
        case "UPLOAD":
          const imageDataToSend = new FormData();
          for (const key in data) {
            imageDataToSend.append(key, data[key]);
          }
          response = await axios.post(`${baseURL}${api}`, imageDataToSend, {
            headers: defaultHeaders,
          });
          break;
        case "DELETE":
          response = await axios.delete(`${baseURL}${api}`, {
            headers: defaultHeaders,
          });
          break;
        default:
          throw new Error("Unsupported HTTP method");
      }

      return response.data;
    } catch (error) {
      console.error("API call failed:", error);
      throw new Error("API call failed");
    }
  };

  function formatPrice(price) {
    if (price >= 10000000) {
      return (price / 10000000).toFixed(2) + " Cr";
    } else if (price >= 100000) {
      return (price / 100000).toFixed(2) + " Lac";
    } else if (price >= 1000) {
      return (price / 1000).toFixed(2) + " K";
    } else {
      return price.toString();
    }
  }

  return {
    saveToken,
    callApi,
    getToken,
    isLogin,
    logout,
    GetMemberId,
    formatPrice,
  };
};

export default AuthUser;
