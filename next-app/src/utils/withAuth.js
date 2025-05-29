import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { jwtDecode } from "jwt-decode";
import AuthUser from "@/components/Authentication/AuthUser";
const spinnerStyles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  spinner: {
    width: "50px",
    height: "50px",
    border: "5px solid #f3f3f3", 
    borderTop: "5px solidrgb(80, 116, 141)",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  '@keyframes spin': {
    from: {
      transform: "rotate(0deg)",
    },
    to: {
      transform: "rotate(360deg)",
    },
  }
};

const withAuth = (WrappedComponent) => {
  const{isLogin, getToken, logout}=AuthUser();
  return (props) => {
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
      const token = isLogin();
      const decodedToken = jwtDecode(getToken())
      const currentTime = Math.floor(Date.now() / 1000);
      if(decodedToken.exp < currentTime) {
        logout();
        router.push('/login');
      }
      if (!token) {
        router.push("/login");
      } else {
        setIsLoading(false);
      }
    }, [router]);

    if (isLoading) {
      return (
        <div style={spinnerStyles.container}>
          <div style={spinnerStyles.spinner}></div>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
