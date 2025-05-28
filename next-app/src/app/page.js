
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
import { Modal } from "react-bootstrap";
import useTranslation from "@/hooks/useTranslation";
import useAdvertisement from "@/hooks/useAdvertisement";
import { useAuth } from "@/context/AuthProvider";
import Head from "next/head";


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
const Testimonials = dynamic(() => import("@/components/home/Testimonials"), {
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
  const { defaultCity } = useAuth();
  const router = useRouter();
  const [showLoginErrorModal, setShowLoginErrorModal] = useState(false);
  const { adsData, logAdClick } = useAdvertisement(
    "home-page",
    "footer",
    defaultCity?.city_id
  );
  const memberId = GetMemberId();

  const handleLoginErrorClose = () => setShowLoginErrorModal(false);
  const translation = useTranslation();

  const getPropertyData = async () => {
    try {
      const args = {
        api: "/get_properties",
        method: "GET",
        data: {
          user_id: memberId || "",
        },
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
          user_id: memberId || "",
        },
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
  }, [memberId,]);

  const addRemoveFav = async (id, type, listKey) => {
    if (isLogin()) {
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
          toast.success(res?.message || "Successfully");
          addRemoveSuccessFunction(id, type, listKey);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      setShowLoginErrorModal(true);
    }
  };

  const addRemoveSuccessFunction = (id, type, listKey) => {
    if (type === "property") {
      const list = propertyData[listKey];
      const newList = list?.map((item, i) => {
        if (item?.property_id === id) {
          return {
            ...item,
            // is_favourite: !item?.is_favourite
            is_favourite: !item?.is_favourite,
          };
        } else {
          return item;
        }
      });

      setPropertyData((prev) => {
        return {
          ...prev,
          [listKey]: newList,
        };
      });
    } else if (type === "project") {
      const list = projectData[listKey];
      const newList = list?.map((item, i) => {
        if (item?.id === id) {
          return {
            ...item,
            is_favourite: !item?.is_favourite,
          };
        } else {
          return item;
        }
      });

      setProjectData((prev) => {
        return {
          ...prev,
          [listKey]: newList,
        };
      });
    }
  };


  return (
    <> 
    
      <div>
        <MainLayout>
          <Banner translation={translation} />
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
          <QuickSection translation={translation} />
          <MainSlider
            data={propertyData?.featured_properties}
            title={
              translation?.discover_featured_listings ||
              "Discover Our Featured Listings"
            }
            miniTitle={translation?.featured_homes || "Featured Homes"}
            subTitle={
              translation?.explore_featured_properties ||
              "Discover our exclusive property collection, showcasing the best homes and prime real estate investment opportunities."
            }
            logo="assets/images/icons/house-sm-1.png"
            type="normal"
            mainType="property"
            url="/property-details"
            listKey="featured_properties"
            addRemoveFav={addRemoveFav}
            translation={translation}
          />
          <MainSlider
            data={propertyData?.top_properties}
            title={translation?.top_property || "Top Property"}
            miniTitle={translation?.top_most || "Top Most"}
            subTitle={
              translation?.top_properties_description ||
              "Prime locations, modern amenities, and premium architecture ensure high investment value."
            }
            logo="assets/images/icons/house-sm-1.png"
            type="card"
            mainType="property"
            url="/property-details"
            listKey="top_properties"
            addRemoveFav={addRemoveFav}
            translation={translation}
          />

          <MainSlider
            data={propertyData?.recent_properties}
            title={translation?.recent_property || "Recent Property"}
            miniTitle={translation?.most_recent || "Most Recent"}
            subTitle={
              translation?.recent_properties_description ||
              "Check out our newly listed properties, offering the most current homes and promising investment options for you."
            }
            logo="assets/images/icons/house-sm-1.png"
            type="card"
            mainType="property"
            url="/property-details"
            listKey="recent_properties"
            addRemoveFav={addRemoveFav}
            translation={translation}
          />
          <FindPropertySection translation={translation} />
          <MainSlider
            data={propertyData?.popular_properties}
            title={translation?.popular_property || "Popular Property"}
            miniTitle={translation?.popular_property || "Popular Property"}
            subTitle={
              translation?.popular_properties_description ||
              "Browse our popular properties, showcasing top-rated homes and investments offering exceptional value in prime, sought-after locations."
            }
            logo="assets/images/icons/house-sm-1.png"
            type="normal"
            mainType="property"
            url="/property-details"
            listKey="popular_properties"
            addRemoveFav={addRemoveFav}
            translation={translation}
          />

          <VerifiedAgent translation={translation} />
          <PopularLocalities translation={translation} />
          <MainSlider
            data={projectData?.featured_project}
            title={translation?.featured_projects || "Featured Projects"}
            miniTitle={translation?.featured_projects || "Featured Projects"}
            subTitle={
              translation?.featured_projects_description ||
              "Discover our featured projects, offering exceptional properties that combine luxury, comfort, and outstanding value for your investment.."
            }
            logo="assets/images/icons/house-sm-1.png"
            type="project card"
            mainType="project"
            url="/project-details"
            listKey="featured_project"
            addRemoveFav={addRemoveFav}
            translation={translation}
          />
          <ProperTimeLine translation={translation} />
          <MainSlider
            data={projectData?.new_project}
            title={translation?.new_project_gallery || "New Project Gallery"}
            miniTitle={translation?.new_projects || "New Projects"}
            subTitle={
              translation?.new_projects ||
              "Explore our latest new projects, offering innovative designs and modern amenities for a perfect blend of style and functionality"
            }
            logo="assets/images/icons/house-sm-1.png"
            type="project gallery"
            mainType="project"
            url="/project-details"
            listKey="new_project"
            addRemoveFav={addRemoveFav}
            translation={translation}
          />

          <Testimonials translation={translation} />

          <AdviceSection translation={translation} />
          <TotolUserRecord translation={translation} />
          <div className="text-center mt-1">
            {adsData.length > 0 ? (
              adsData.map((ad) => (
                <a
                  key={ad.advertisement_id}
                  role="button"
                  onClick={(e) => {
                    e.preventDefault();
                    logAdClick(ad.advertisement_id, ad.ad_url);
                  }}
                >
                  <img src={ad.ad_image} alt="Ad" />
                </a>
              ))
            ) : (
              <img
                alt="Advertisement"
                src="/assets/images/ads/ads-blank.jpg"
                className="img-fluid"
              />
            )}
          </div>
          <PostPropertyPath translation={translation} />

          <Modal
            show={showLoginErrorModal}
            onHide={handleLoginErrorClose}
            centered
            size="lg"
          >
            <Modal.Header>
              <button
                className="btn btn-secondary"
                onClick={handleLoginErrorClose}
                style={{ position: "absolute", left: "15px" }}
              >
                {translation?.cancel || "Cancel"}
              </button>
              <Modal.Title className="mx-auto">
                {" "}
                {translation?.login_required || "Login Required"}
              </Modal.Title>
              <button
                className="btn btn-danger"
                onClick={() => {
                  handleLoginErrorClose();
                  router?.push("/login");
                }}
                style={{ position: "absolute", right: "15px" }}
              >
                {translation?.login || "Login"}
              </button>
            </Modal.Header>
            <Modal.Body>
              <p className="text-center">
                {" "}
                {translation?.please_log_in_to_perform_this_action ||
                  "Please log in to perform this action."}
              </p>
            </Modal.Body>
          </Modal>
        </MainLayout>
      </div>
    </>
  );
}
