
import React, { Suspense } from "react";
import MainLayout from "@/components/layout/MainLayout";

import Banner from "@/components/home/Banner";
import QuickSection from "@/components/home/QuickSection";
import HomeContent from "@/components/home/HomeContent";


// const Banner = dynamic(() => import("@/components/home/Banner"), {
//   ssr: false,
//   loading: () => <MyLoader />,
// });
// const HomeContent = dynamic(() => import("@/components/home/HomeContent"), { ssr: false});
// const QuickSection = dynamic(() => import("@/components/home/QuickSection"), {
//   ssr: false,
//   loading: () => <MyLoader />,
// });


export default function Home() {

  return (
    <>
      <div>
        <MainLayout>
           <Banner />
          <QuickSection />
          <Suspense fallback={<></>}>
         <HomeContent />
          </Suspense>
        </MainLayout>
      </div>
    </>
  );
}
