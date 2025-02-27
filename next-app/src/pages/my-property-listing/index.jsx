import React, { useState, useEffect } from "react";
import AuthUser from "@/components/Authentication/AuthUser";
import PublishComponent from "@/components/MyPropertyList/PublishComponent";
import DraftComponent from "@/components/MyPropertyList/DraftComponent";
import ExpiredComponent from "@/components/MyPropertyList/ExpiredComponent";
import PendingComponent from "@/components/MyPropertyList/PendingComponent";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { toast } from "react-toastify";
import { ShimmerContentBlock } from "react-shimmer-effects";
import withAuth from "@/utils/withAuth";
import useTranslation from '../../hooks/useTranslation'


const TabComponent = () => {
    const [activeTab, setActiveTab] = useState("published_properties");
    const [loading, setLoading] = useState(true);
    const { callApi, GetMemberId } = AuthUser();
    const [propertyData, setPropertyData] = useState([]);
    const memberId = GetMemberId();
    const [publishPagination, setPublishPagination] = useState({
        
        page: 1,
        current_page: 0,
        total_page: 0
    })
    const [pendingPagination, setPendingPagination] = useState({
        page: 1,
        current_page: 0,
        total_page: 0
    })

    const [draftPagination, setDraftPagination] = useState({
        page: 1,
        current_page: 0,
        total_page: 0
    })

    const [expiredPagination, setExpiredPagination] = useState({
        page: 1,
        current_page: 0,
        total_page: 0
    })
const translation = useTranslation();


    useEffect(() => {
        if (memberId) {
            FetchPropertyData();
        }
    }, [memberId]);
    
    const FetchPropertyData = async (loadMore, nextPage=1) => {
        if(!loadMore) {
            setLoading(true);
        }
        const pageKey = generatePageKey(activeTab);
        const data = {};
        data[pageKey] = nextPage;
        try {
            const response = await callApi({
                api: `/my_property_list?user_id=${memberId}`,
                method: "GET",
                data: data
            });
            if (response && response?.status === 1) {
                if(!loadMore) {
                    setPropertyData(response?.data);
                } else {
                    updateLoadMoreState(response?.data);
                }
            } else {
                toast.error(response?.message || "Failed to fetch properties");
            }
        } catch (error) {
            console.error("API call failed:", error);
            toast.error("An error occurred while loading data.");
        } finally {
            setLoading(false);
        }
    };
    
    const updateLoadMoreState = (data) => {
        let state = propertyData?.[activeTab];
        state = {
            ...data[activeTab],
            data: [...state?.data, ...data?.[activeTab]?.data]
        }

        setPropertyData(prev => {
            return {
                ...prev,
                [activeTab]: state
            }
        })
    }

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const renderTabContent = () => {
        if (loading) {
            return (
                <ShimmerContentBlock
                    title
                    text
                    cta
                    thumbnailWidth={350}
                    thumbnailHeight={50}
                />
            );
        }

        switch (activeTab) {
            case "published_properties":
                return <PublishComponent propertiesData={propertyData}  />;
            case "pending_properties":
                return <PendingComponent propertiesData={propertyData}  />;
            case "expired_properties":
                return <ExpiredComponent propertiesData={propertyData}  />;
            case "draft_properties":
                return <DraftComponent propertiesData={propertyData}  />;
            default:
                return <PublishComponent propertiesData={propertyData}  />;
        }
    };

    const handleLoadMoreClick = () => {
        let nextPage = (() => {
            switch(activeTab) {
                case "pending_properties":
                    setPendingPagination(prev => ({...prev, page: prev?.page + 1}))
                    return pendingPagination?.page + 1;
                case "published_properties":
                    setPublishPagination(prev => ({...prev, page: prev?.page + 1}))
                    return publishPagination?.page + 1;
                case "draft_properties":
                    setDraftPagination(prev => ({...prev, page: prev?.page + 1}))
                    return draftPagination?.page + 1;
                case "expired_properties":
                    setExpiredPagination(prev => ({...prev, page: prev?.page + 1}))
                    return expiredPagination?.page + 1;
                default:
                    setPendingPagination(prev => ({...prev, page: prev?.page + 1}))
                    return pendingPagination?.page + 1;
            }
        })()
        FetchPropertyData(true, nextPage);
    }


    return (
        <DashboardLayout>
            <aside className="col-lg col-12">
                <div className="p-4">
                    <h1 className="h4 text-primary">{translation?.my_property_listing || "My Property Listing"}</h1>
                    <ul className="nav nav-underline mb-3 gap-4">
                        <li className="nav-item">
                            <a
                                className={`nav-link ${
                                    activeTab === "published_properties" ? "active" : ""
                                }`}
                               role="button"
                                onClick={() => handleTabChange("published_properties")}
                            >
                                {translation?.publish || "Publish"}
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                                className={`nav-link ${
                                    activeTab === "pending_properties" ? "active" : ""
                                }`}
                               role="button"
                                onClick={() => handleTabChange("pending_properties")}
                            >
                                {translation?.pending || "Pending"}
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                                className={`nav-link ${
                                    activeTab === "expired_properties" ? "active" : ""
                                }`}
                               role="button"
                                onClick={() => handleTabChange("expired_properties")}
                            >
                                {translation?.expired || "Expired"}
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                                className={`nav-link ${
                                    activeTab === "draft_properties" ? "active" : ""
                                }`}
                               role="button"
                                onClick={() => handleTabChange("draft_properties")}
                            >
                                 {translation?.draft || "Draft"}
                            </a>
                        </li>
                    </ul>
                    {renderTabContent()}
                    {propertyData[activeTab]?.current_page < propertyData[activeTab]?.total_pages && (
                        <button
                        className="btn btn-primary btn-lg d-block mx-auto mt-4"
                        onClick={() => handleLoadMoreClick(activeTab)}> {translation?.load_more || "Load More"}</button>
                     )} 
                </div>
            </aside>
            <aside className="col-xl-auto col-12">
                <div className="text-center mt-4">
                    <img
                        src="/assets/images/ads/8c178a3ead69fc4c042ecb0e550c2579.png"
                        alt="ads"
                        className="img-fluid"
                    />
                </div>
            </aside>
        </DashboardLayout>
    );
};

export default withAuth(TabComponent);


const generatePageKey = (tab) => {
    switch(tab) {
        case "published_properties":
            return "published_page";
        case "pending_properties":
            return "pending_page";
        case "expired_properties":
            return "expired_page";
        case "draft_properties":
            return "draft_page"
        default: 
        return "published_page";
    }
}
