"use client";
import React, { useState, useEffect } from 'react'
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthUser from '../Authentication/AuthUser';
import useAdvertisement from "@/hooks/useAdvertisement";
import { useAuth } from '@/context/AuthProvider';
import { useInView } from "react-intersection-observer";
import dynamic from 'next/dynamic';
import useTranslation from '@/hooks/useTranslation';
import MainSlider from '../MainSlder/MainSlider';


const FindPropertySection = dynamic(() => import("./FindPropertySection"), { ssr: false });
const VerifiedAgent = dynamic(() => import("./VerifiedAgent"), { ssr: false });
const PopularLocalities = dynamic(() => import("./PopularLocalities"), { ssr: false });
const ProperTimeLine = dynamic(() => import("./ProperTimeLine"), { ssr: false });
const Testimonials = dynamic(() => import("./Testimonials"), { ssr: false });
const AdviceSection = dynamic(() => import("./AdviceSection"), { ssr: false });
const LoginErrorModal = dynamic(() => import("./LoginErrorModal"), { ssr: false });
const TotolUserRecord = dynamic(() => import("./TotolUserRecord"), { ssr: false });
const PostPropertyPath = dynamic(() => import("./PostPropertyPath"), { ssr: false });



const HomeContent = () => {
    const { callApi, isLogin, GetMemberId } = AuthUser();
    const translation = useTranslation();
    const [propertyData, setPropertyData] = useState(null);
    const [projectData, setProjectData] = useState(null);
    const [testimonialList, setTestimonialList] = useState([]);
    const [verifiedAgentList, setVerifiedAgentList] = useState([]);
    const { defaultCity, setAdminDetails, setCurrency, setCurrencyCode } = useAuth();
    const [showLoginErrorModal, setShowLoginErrorModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const { adsData, logAdClick } = useAdvertisement(
        "home-page",
        "footer",
        defaultCity?.city_id
    );
    const memberId = GetMemberId();

    const { ref: ref1, inView: view1 } = useInView({ triggerOnce: true, threshold: 0.1 });
    const { ref: ref2, inView: view2 } = useInView({ triggerOnce: true, threshold: 0.1 });
    const { ref: ref3, inView: view3 } = useInView({ triggerOnce: true, threshold: 0.1 });
    const { ref: ref4, inView: view4 } = useInView({ triggerOnce: true, threshold: 0.1 });
    const { ref: ref5, inView: view5 } = useInView({ triggerOnce: true, threshold: 0.1 });
    const { ref: ref6, inView: view6 } = useInView({ triggerOnce: true, threshold: 0.1 });
    const { ref: ref7, inView: view7 } = useInView({ triggerOnce: true, threshold: 0.1 });
    const { ref: ref8, inView: view8 } = useInView({ triggerOnce: true, threshold: 0.1 });
    const { ref: ref9, inView: view9 } = useInView({ triggerOnce: true, threshold: 0.1 });
    const { ref: ref10, inView: view10 } = useInView({ triggerOnce: true, threshold: 0.1 });



    useEffect(() => {
        getHomeData();
    }, [])


    const getHomeData = async () => {
        setLoading(true);
        try {
            const res = await callApi({
                api: '/get-home-data',
                method: "GET",
            })
            if (res && res.status == 1) {
                setPropertyData(res.data?.properties || {});
                setProjectData(res?.data?.projects || {});
                setTestimonialList(res.data?.testimonial || [])
                setVerifiedAgentList(res.data?.verified_agents || [])
                setAdminDetails(res.data?.admin_details || {})
                localStorage.setItem('admin', JSON.stringify(res.data?.admin_details));
                setCurrency(res.data?.currancy || "$");
                setCurrencyCode(res.data?.currancy_code || "USD")
            }
        } catch (error) {
            console.error(error.message)
        } finally {
            setLoading(false);
        }
    }

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
    const handleLoginErrorClose = () => setShowLoginErrorModal(false);

    return (
        <>
            <ToastContainer position="top-right" autoClose={5000} />

            <MainSlider
                data={propertyData?.featured_properties}
                title={translation?.discover_featured_listings || "Discover Our Featured Listings"}
                miniTitle={translation?.featured_homes || "Featured Homes"}
                subTitle={translation?.explore_featured_properties || ""}
                logo="assets/images/icons/house-sm-1.png"
                type="normal"
                mainType="property"
                url="/property-details"
                listKey="featured_properties"
                addRemoveFav={addRemoveFav}
                translation={translation}
                loading={loading}
            />

            <div ref={ref2}>
                {view2 && (
                    <MainSlider
                        data={propertyData?.top_properties}
                        title={translation?.top_property || "Top Property"}
                        miniTitle={translation?.top_most || "Top Most"}
                        subTitle={translation?.top_properties_description}
                        logo="assets/images/icons/house-sm-1.png"
                        type="card"
                        mainType="property"
                        url="/property-details"
                        listKey="top_properties"
                        addRemoveFav={addRemoveFav}
                        translation={translation}
                    />
                )}
            </div>

            <div ref={ref3}>
                {view3 && (
                    <>
                        <MainSlider
                            data={propertyData?.recent_properties}
                            title={translation?.recent_property}
                            miniTitle={translation?.most_recent}
                            subTitle={translation?.recent_properties_description}
                            logo="assets/images/icons/house-sm-1.png"
                            type="card"
                            mainType="property"
                            url="/property-details"
                            listKey="recent_properties"
                            addRemoveFav={addRemoveFav}
                            translation={translation}
                        />
                    </>
                )}
            </div>

            <div ref={ref4}>{view4 && <FindPropertySection translation={translation} />}</div>

            <div ref={ref5}>
                {view5 && (
                    <MainSlider
                        data={propertyData?.popular_properties}
                        title={translation?.popular_property}
                        miniTitle={translation?.popular_property}
                        subTitle={translation?.popular_properties_description}
                        logo="assets/images/icons/house-sm-1.png"
                        type="normal"
                        mainType="property"
                        url="/property-details"
                        listKey="popular_properties"
                        addRemoveFav={addRemoveFav}
                        translation={translation}
                        loading={loading}
                    />
                )}
            </div>

            <div ref={ref6}>{view6 && <VerifiedAgent translation={translation} verifiedAgentList={verifiedAgentList} />}</div>
            <div ref={ref7}>{view7 && <PopularLocalities translation={translation} />}</div>
            <div ref={ref8}>{view8 && <ProperTimeLine translation={translation} />}</div>
            <div ref={ref9}>{view9 && <Testimonials testimonialData={testimonialList} translation={translation} />}</div>
            <div ref={ref10}>{view10 && (
                <>
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
                            <></>
                        )}
                    </div>

                    <PostPropertyPath translation={translation} />
                </>
            )}</div>

            <LoginErrorModal
                showLoginErrorModal={showLoginErrorModal}
                handleLoginErrorClose={handleLoginErrorClose}
                translation={translation}
            />
        </>
    )
}

export default HomeContent
