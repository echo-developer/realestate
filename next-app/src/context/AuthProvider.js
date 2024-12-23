"use client";
import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [propertyFor, setPropertyFor] = useState(null);

  return (
    <AuthContext.Provider
      value={{
        propertyFor,
        setPropertyFor,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
