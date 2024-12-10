"use client";
import React from "react";
import dynamic from "next/dynamic";
import MainLayout from "@/components/layout/MainLayout";

const Banner = dynamic(() => import("@/components/home/Banner"), {
  ssr: false,
});
const QuickSection = dynamic(() => import("@/components/home/QuickSection"), {
  ssr: false,
});
const FeatureProperty = dynamic(
  () => import("@/components/home/FeatureProperty"),
  { ssr: false }
);
const TopPropertySection = dynamic(
  () => import("@/components/home/TopPropertySection"),
  { ssr: false }
);
const RecentPropertySection = dynamic(
  () => import("@/components/home/RecentPropertySection"),
  { ssr: false }
);
const FindPropertySection = dynamic(
  () => import("@/components/home/FindPropertySection"),
  { ssr: false }
);
const PopularProperty = dynamic(
  () => import("@/components/home/PopularProperty"),
  { ssr: false }
);
const VerifiedAgent = dynamic(() => import("@/components/home/VerifiedAgent"), {
  ssr: false,
});
const PopularLocalities = dynamic(
  () => import("@/components/home/PopularLocalities"),
  { ssr: false }
);
const ProjectSection = dynamic(
  () => import("@/components/home/ProjectSection"),
  { ssr: false }
);
const ProperTimeLine = dynamic(
  () => import("@/components/home/ProperTimeLine"),
  { ssr: false }
);
const PropertyGallery = dynamic(
  () => import("@/components/home/PropertyGallery"),
  { ssr: false }
);
const Feedback = dynamic(() => import("@/components/home/Feedback"), {
  ssr: false,
});
const AdviceSection = dynamic(() => import("@/components/home/AdviceSection"), {
  ssr: false,
});
const TotolUserRecord = dynamic(
  () => import("@/components/home/TotolUserRecord"),
  { ssr: false }
);
const PostPropertyPath = dynamic(
  () => import("@/components/home/PostPropertyPath"),
  { ssr: false }
);

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
