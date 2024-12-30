
import { useEffect } from "react";
import { useRouter } from "next/router";
import AuthUser from "@/components/Authentication/AuthUser";

const withAuth = (WrappedComponent) => {
  const { GetMemberId } = AuthUser();

  let MemberId = GetMemberId();

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
