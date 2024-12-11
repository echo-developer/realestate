"use client";
import React from "react";
import dynamic from "next/dynamic";
import MainLayout from "@/components/layout/MainLayout";
import MyLoader from "@/components/LoadingSpinner/MyLoader";

const Banner = dynamic(() => import("@/components/home/Banner"), { ssr: false, loading: () => <MyLoader /> });
const QuickSection = dynamic(() => import("@/components/home/QuickSection"), { ssr: false, loading: () => <MyLoader /> });
const FeatureProperty = dynamic(() => import("@/components/home/FeatureProperty"), { ssr: false, loading: () => <MyLoader /> });
const TopPropertySection = dynamic(() => import("@/components/home/TopPropertySection"), { ssr: false, loading: () => <MyLoader /> });
const RecentPropertySection = dynamic(() => import("@/components/home/RecentPropertySection"), { ssr: false, loading: () => <MyLoader /> });
const FindPropertySection = dynamic(() => import("@/components/home/FindPropertySection"), { ssr: false, loading: () => <MyLoader /> });
const PopularProperty = dynamic(() => import("@/components/home/PopularProperty"), { ssr: false, loading: () => <MyLoader /> });
const VerifiedAgent = dynamic(() => import("@/components/home/VerifiedAgent"), { ssr: false, loading: () => <MyLoader /> });
const PopularLocalities = dynamic(() => import("@/components/home/PopularLocalities"), { ssr: false, loading: () => <MyLoader /> });
const ProjectSection = dynamic(() => import("@/components/home/ProjectSection"), { ssr: false, loading: () => <MyLoader /> });
const ProperTimeLine = dynamic(() => import("@/components/home/ProperTimeLine"), { ssr: false, loading: () => <MyLoader /> });
const PropertyGallery = dynamic(() => import("@/components/home/PropertyGallery"), { ssr: false, loading: () => <MyLoader /> });
const Feedback = dynamic(() => import("@/components/home/Feedback"), { ssr: false, loading: () => <MyLoader /> });
const AdviceSection = dynamic(() => import("@/components/home/AdviceSection"), { ssr: false, loading: () => <MyLoader /> });
const TotolUserRecord = dynamic(() => import("@/components/home/TotolUserRecord"), { ssr: false, loading: () => <MyLoader /> });
const PostPropertyPath = dynamic(() => import("@/components/home/PostPropertyPath"), { ssr: false, loading: () => <MyLoader /> });

export default function Home() {


  return (
    <div>
      <MainLayout>
        <Banner />
        <QuickSection />
        <FeatureProperty />
        <TopPropertySection />
        <RecentPropertySection />
        <FindPropertySection />
        <PopularProperty />
        <VerifiedAgent />
        <PopularLocalities />
        <ProjectSection />
        <ProperTimeLine />
        <PropertyGallery />
        <Feedback />
        <AdviceSection />
        <TotolUserRecord />
        <PostPropertyPath />
      </MainLayout>
    </div>
  );
}
