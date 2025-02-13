"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import AuthUser from "@/components/Authentication/AuthUser";
import MainLayout from "@/components/layout/MainLayout";
import MyLoader from "@/components/LoadingSpinner/MyLoader";
import MainSlider from "@/components/MainSlder/MainSlider";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

const Banner = dynamic(() => import("@/components/home/Banner"), {
  ssr: false,
  loading: () => <MyLoader />,
});
const QuickSection = dynamic(() => import("@/components/home/QuickSection"), {
  ssr: false,
  loading: () => <MyLoader />,
});
const FindPropertySection = dynamic(
  () => import("@/components/home/FindPropertySection"),
  { ssr: false, loading: () => <MyLoader /> }
);
const VerifiedAgent = dynamic(() => import("@/components/home/VerifiedAgent"), {
  ssr: false,
  loading: () => <MyLoader />,
});
const PopularLocalities = dynamic(
  () => import("@/components/home/PopularLocalities"),
  { ssr: false, loading: () => <MyLoader /> }
);
const ProperTimeLine = dynamic(
  () => import("@/components/home/ProperTimeLine"),
  { ssr: false, loading: () => <MyLoader /> }
);
const Feedback = dynamic(() => import("@/components/home/Feedback"), {
  ssr: false,
  loading: () => <MyLoader />,
});
const AdviceSection = dynamic(() => import("@/components/home/AdviceSection"), {
  ssr: false,
  loading: () => <MyLoader />,
});
const TotolUserRecord = dynamic(
  () => import("@/components/home/TotolUserRecord"),
  { ssr: false, loading: () => <MyLoader /> }
);
const PostPropertyPath = dynamic(
  () => import("@/components/home/PostPropertyPath"),
  { ssr: false, loading: () => <MyLoader /> }
);

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
        method: "GET",
        data: {
          user_id: memberId || ""
        }
      };
      const response = await callApi(args);
      if (response?.status === 1) {
        setPropertyData(response?.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getProjectData = async () => {
    try {
      const response = await callApi({
        api: `/all-projects-list`,
        method: "GET",
        data: {
          user_id: memberId || ""
        }
      });

      if (response?.status === 1) {
        setProjectData(response?.data);
      }
    } catch (error) {
      console.error(error?.message || "Something went wrong");
    }
  };

  useEffect(() => {
      getPropertyData();
      getProjectData();
  }, [memberId]);

  const addRemoveFav = async (id, type, listKey) => {
    if (!memberId) {
      router.push("/login");
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
        if (res && res?.status === 1) {
          toast.success(res?.message || "Successful");
          addRemoveSuccessFunction(id, type, listKey);
        } else {
          toast.error(res?.message || "An error occurred. Please try again.");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const addRemoveSuccessFunction = (id, type, listKey) => {
    if(type === "property") {
      const list = propertyData[listKey];
      const newList = list?.map((item, i) => {
        if(item?.property_id === id) {
          return {
            ...item,
            is_favourite: !item?.is_favourite
          }
        } else {
          return item;
        }
      })

      setPropertyData(prev => {
        return {
          ...prev,
          [listKey]: newList
        }
      })

    } else if (type === "project") {
      const list = projectData[listKey];
      const newList = list?.map((item, i) => {
        if(item?.id === id) {
          return {
            ...item,
            is_favrourite: !item?.is_favrourite
          }
        } else {
          return item;
        }
      })

      setProjectData(prev => {
        return {
          ...prev,
          [listKey]: newList
        }
      })
    }
  }

  return (
    <div>
      <MainLayout>
        <Banner />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <QuickSection />
        <MainSlider
          data={propertyData?.featured_properties}
          title="Discover Our Featured Listings"
          miniTitle="Featured Homes"
          subTitle="Explore our featured property listings, offering a curated selection of the finest homes and real estate opportunities"
          logo="assets/images/icons/house-sm-1.png"
          type="normal"
          mainType="property"
          url="/property-details"
          listKey="featured_properties"
          addRemoveFav={addRemoveFav}
        />
        <MainSlider
          data={propertyData?.top_properties}
          title="Top Property"
          miniTitle="Top Most"
          subTitle="Top properties offer prime locations, modern amenities, premium architecture, and high investment value for luxury and convenience"
          logo="assets/images/icons/house-sm-1.png"
          type="card"
          mainType="property"
          url="/property-details"
          listKey="top_properties"
          addRemoveFav={addRemoveFav}
        />
        <MainSlider
          data={propertyData?.recent_properties}
          title="Recent Property"
          miniTitle="Most Recent"
          subTitle="Explore our recently added properties, showcasing the latest homes and investments available for you to consider"
          logo="assets/images/icons/house-sm-1.png"
          type="card"
          mainType="property"
          url="/property-details"
          listKey="recent_properties"
          addRemoveFav={addRemoveFav}
        />
        <FindPropertySection />
        <MainSlider
          data={propertyData?.popular_properties}
          title="Popular Property"
          miniTitle="Popular Property"
          subTitle="Browse our popular properties, featuring top-rated homes and investments that offer exceptional value and prime locations."
          logo="assets/images/icons/house-sm-1.png"
          type="normal"
          mainType="property"
          url="/property-details"
          listKey="popular_properties"
          addRemoveFav={addRemoveFav}
        />
        <VerifiedAgent />
        <PopularLocalities />
        <MainSlider
          data={projectData?.featured_project}
          title="Featured Projects"
          miniTitle="Featured Projects"
          subTitle="Discover our featured projects showcasing exceptional properties designed to offer luxury, comfort, and outstanding value for your investment."
          logo="assets/images/icons/house-sm-1.png"
          type="project card"
          mainType="project"
          url="/project-details"
          listKey="featured_project"
          addRemoveFav={addRemoveFav}
        />
        <ProperTimeLine />
        <MainSlider
          data={projectData?.new_project}
          title="New Project Gallery"
          miniTitle="New Projects"
          subTitle="Explore our latest new projects, offering innovative designs and modern amenities for a perfect blend of style and functionality."
          logo="assets/images/icons/house-sm-1.png"
          type="project gallery"
          mainType="project"
          url="/project-details"
          listKey="new_project"
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
