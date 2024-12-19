// utils/withAuth.js
"use client";
import { useEffect } from "react";
import { useRouter } from "next/router";
import AuthUser from "@/components/authetication/AuthUser";

const withAuth = (WrappedComponent) => {
  const { isLogin } = AuthUser();

  let MemberId = isLogin();

  return (props) => {
    const router = useRouter();

    useEffect(() => {
      if (!MemberId) {
        router.push("/login");
      }
    }, [router]);

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
