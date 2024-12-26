"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";

const AuthUser = () => {
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const saveToken = (userData) => {
            localStorage.setItem("user", JSON.stringify(userData));
    };

    const getToken = () => {
            return localStorage.getItem("user");
    };

    const isLogin = () => getToken() !== null;

    const getMemberIdFromToken = (token) => {
        try {
            const decoded = jwtDecode(token);
            return decoded?.sub || null;
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

    const callApi = async ({ method, api, data }) => {
        const token = getToken();
        const headers = {
            Authorization: token ? `Bearer ${JSON.parse(token)}` : undefined,
            "Content-Type": "application/json",
        };

        try {
            let response;

            switch (method) {
                case "GET":
                    response = await axios.get(`${baseURL}${api}`, {
                        headers,
                        params: data,
                    });
                    break;
                case "POST":
                    response = await axios.post(`${baseURL}${api}`, data, {
                        headers,
                    });
                    break;
                case "UPLOAD":
                    const formData = new FormData();
                    Object.keys(data).forEach((key) =>
                        formData.append(key, data[key])
                    );
                    response = await axios.post(`${baseURL}${api}`, formData, {
                        headers: {
                            ...headers,
                            "Content-Type": "multipart/form-data",
                        },
                    });
                    break;
                case "DELETE":
                    response = await axios.delete(`${baseURL}${api}`, {
                        headers,
                    });
                    break;
                default:
                    throw new Error(`Unsupported HTTP method: ${method}`);
            }

            return response.data;
        } catch (error) {
            console.error("API call failed:", error?.response || error.message);
            throw error.response?.data || new Error("API call failed");
        }
    };

    return {
        saveToken,
        callApi,
        getToken,
        isLogin,
        logout,
        GetMemberId,
    };
};

export default AuthUser;
