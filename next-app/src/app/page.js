"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import AuthUser from "@/components/Authentication/AuthUser";
import MainLayout from "@/components/layout/MainLayout";
import MyLoader from "@/components/LoadingSpinner/MyLoader";
import MainSlider from "@/components/MainSlder/MainSlider";
import toast from "react-toastify";
// import { useRouter } from "next/router";
import { useRouter } from "next/navigation";

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
  const { callApi, isLogin, GetMemberId } = AuthUser();
  const [propertyData, setPropertyData] = useState(null);
  const [projectData, setProjectData] = useState(null);
  const router = useRouter();


  const memberId = GetMemberId();

  const getPropertyData = async () => {
    try {
      const args = {
        api: "/get_properties",
        method: "GET"
      }
      const response = await callApi(args);
      if(response?.status === 1) {
        setPropertyData(response?.data);
      }

    } catch (error) {
      console.error(error);
    }
  }


  const getProjectData = async () => {
    try {
      const response = await callApi({
        api: `/all-projects-list`,
        method: "GET"
      })

      if(response?.status === 1) {
        setProjectData(response?.data);
      }
    } catch (error) {
      console.error(error?.message || "Something went wrong")
    }
  }


  useEffect(() => {
    getPropertyData();
    getProjectData();
  }, [])


  const addRemoveFav = async (id, type) => {

  
    if (!memberId) {
      router.push("/login")
    } else {
      try {
        let args = {};
        if (type === "property") {
          args = {
            api: "/add_my_fav_property",
            method: "POST",
            data: {
              user_id: memberId,
              property_id: id,
            },
          };
        } else if (type === "project") {
          args = {
            api: "/add_my_fav_project",
            method: "POST",
            data: {
              user_id: memberId,
              project_id: id,
            },
          };
        }
        const res = await callApi(args);
        if(res && res?.status === 1) {
          toast?.success(res?.message)
        } else {
          toast?.error(
            res?.message || "An error occurred. Please try again."
        );
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };
  
  


  return (
    <div>
      <MainLayout>
        <Banner />
        <QuickSection />
        {/* <FeatureProperty /> */}
        <MainSlider
          data={propertyData?.featured_properties}
          title={`Discover Our Featured Listings`}
          miniTitle={`Featured Homes`}
          subTitle={`Explore our featured property listings, offering a curated selection of the finest homes and real estate opportunities`}
          logo={`assets/images/icons/house-sm-1.png`}
          type="normal"
          mainType="property"
          url="/property-details"
          addRemoveFav={addRemoveFav}
           />
        {/* <TopPropertySection /> */}
        <MainSlider
          data={propertyData?.top_properties}
          title={`Top Property`}
          miniTitle={`Top Most`}
          subTitle={`Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua`}
          logo={`assets/images/icons/house-sm-1.png`}
          type="card"
          mainType="property"
          url="/property-details"
          addRemoveFav={addRemoveFav}
           />
        {/* <RecentPropertySection /> */}
        <MainSlider
          data={propertyData?.recent_properties}
          title={`Recent Property`}
          miniTitle={`Most Recent`}
          subTitle={`Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua`}
          logo={`assets/images/icons/house-sm-1.png`}
          type="card"
          mainType="property"
          url="/property-details"
          addRemoveFav={addRemoveFav}
           />
        <FindPropertySection />
        {/* <PopularProperty /> */}
        <MainSlider
          data={propertyData?.popular_properties}
          title={`Popular Property`}
          miniTitle={`Popular Property`}
          subTitle={`Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua`}
          logo={`assets/images/icons/house-sm-1.png`}
          type="normal"
          mainType="property"
          url="/property-details"
          addRemoveFav={addRemoveFav}
           />
        <VerifiedAgent />
        <PopularLocalities />
        {/* <ProjectSection /> */}
        <MainSlider
          data={projectData?.featured_project}
          title={`Featured Projects`}
          miniTitle={`Featured Projects`}
          subTitle={`Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua`}
          logo={`assets/images/icons/house-sm-1.png`}
          type="prject card"
          mainType="project"
          url="/project-details"
          addRemoveFav={addRemoveFav}
           />
        <ProperTimeLine />
        {/* <PropertyGallery /> */}
        <MainSlider
          data={projectData?.new_project}
          title={`New Project Gallery`}
          miniTitle={`New Projects`}
          subTitle={`Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua`}
          logo={`assets/images/icons/house-sm-1.png`}
          type="project galary"
          mainType="project"
          url="/project-details"
          addRemoveFav={addRemoveFav}
           />

        <Feedback />
        <AdviceSection />
        <TotolUserRecord />
        <PostPropertyPath />
      </MainLayout>
    </div>
  );
}
