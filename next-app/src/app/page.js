
"use client";
import React from "react";
import dynamic from "next/dynamic";
import MainLayout from "@/components/layout/MainLayout";
import MyLoader from "@/components/LoadingSpinner/MyLoader";

import useTranslation from "@/hooks/useTranslation";
// import Banner from "@/components/home/Banner";
import QuickSection from "@/components/home/QuickSection";
// import HomeContent from "@/components/home/HomeContent";


const Banner = dynamic(() => import("@/components/home/Banner"), {
  ssr: false,
  loading: () => <MyLoader />,
});
const HomeContent = dynamic(() => import("@/components/home/HomeContent"), { ssr: false});
// const QuickSection = dynamic(() => import("@/components/home/QuickSection"), {
//   ssr: false,
//   loading: () => <MyLoader />,
// });


export default function Home() {
  const translation = useTranslation();

  return (
    <>
      <div>
        <MainLayout>
          <Banner translation={translation} />
          <QuickSection translation={translation} />
          <HomeContent />
        </MainLayout>
      </div>
    </>
  );
}
