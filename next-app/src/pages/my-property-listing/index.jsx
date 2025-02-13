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

const TabComponent = () => {
    const [activeTab, setActiveTab] = useState("publish");
    const [loading, setLoading] = useState(true);
    const { callApi, GetMemberId } = AuthUser();
    const [propertyData, setPropertyData] = useState([]);
    const memberId = GetMemberId();
    const [perPage, setPerPage] = useState(1);
    const [publishPage, setPublishPage] = useState(1);
    const [pendingPage, setPendingPage] = useState(1);
    const [draftPage, setDraftPage] = useState(1);
    const [expiredPage, setExpiredPage] = useState(1)

    useEffect(() => {
        if (memberId) {
            FetchPropertyData();
        }
    }, [memberId]);
    
    const FetchPropertyData = async (loadMore, nextPage) => {
        if(!loadMore) {
            setLoading(true);
        }
        const pageKey = generatePageKey(activeTab);
        const data = {};
        data[pageKey] = nextPage || 1;
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
                    let newState = propertyData;
                    if(activeTab === "publish") {
                        console.log("publish data", response?.data?.published_properties)
                        newState = {
                            ...newState,
                            published_properties: {
                                ...response?.data?.published_properties,
                                data: [...newState?.published_properties?.data, ...response?.data?.published_properties?.data]
                            }
                        }
                    } else if(activeTab === "pending") {
                        newState = {
                            ...newState,
                            pending_properties: {
                                ...response?.data?.pending_properties,
                                data: [...newState?.pending_properties?.data, ...response?.data?.pending_properties?.data]
                            }
                        }

                    } else if(activeTab === "expired") {
                        newState = {
                            ...newState,
                            expired_properties: {
                                ...response?.data?.expired_properties,
                                data: [...newState?.expired_properties?.data, ...response?.data?.expired_properties?.data]
                            }
                        }

                    } else if(activeTab === "draft") {
                        newState = {
                            ...newState,
                            draft_properties: {
                                ...response?.data?.expired_properties,
                                data: [...newState?.expired_properties?.data,  ...response?.data?.expired_properties?.data]
                            }
                        }
                    }

                    console.log("new updated state", newState)
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
            case "publish":
                return <PublishComponent propertiesData={propertyData} handleLoadMoreClick={handleLoadMoreClick}  />;
            case "pending":
                return <PendingComponent propertiesData={propertyData} handleLoadMoreClick={handleLoadMoreClick}  />;
            case "expired":
                return <ExpiredComponent propertiesData={propertyData} handleLoadMoreClick={handleLoadMoreClick}  />;
            case "draft":
                return <DraftComponent propertiesData={propertyData} handleLoadMoreClick={handleLoadMoreClick}  />;
            default:
                return <PublishComponent propertiesData={propertyData} handleLoadMoreClick={handleLoadMoreClick}  />;
        }
    };

    const handleLoadMoreClick = () => {
        let nextPage = 0;
        switch(activeTab) {
            case "publish":
            nextPage = publishPage + 1;
            setPublishPage(nextPage);
            break;
            case "pending":
            nextPage = pendingPage + 1;
            setPendingPage(nextPage);
            break;
            case "draft":
            nextPage = draftPage + 1;
            setDraftPage(nextPage);
            break;
            case "expired":
            nextPage = expiredPage + 1;
            setExpiredPage(nextPage);
            break;
            default: 
            nextPage = perPage + 1;
            setPerPage(nextPage);
        }
        FetchPropertyData(true, nextPage);
    }

console.log("active tab", activeTab);

    return (
        <DashboardLayout>
            <aside className="col-lg col-12">
                <div className="p-4">
                    <h1 className="h4 text-primary">My Property Listing</h1>
                    <ul className="nav nav-underline mb-3 gap-4">
                        <li className="nav-item">
                            <a
                                className={`nav-link ${
                                    activeTab === "publish" ? "active" : ""
                                }`}
                               role="button"
                                onClick={() => handleTabChange("publish")}
                            >
                                Publish
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                                className={`nav-link ${
                                    activeTab === "pending" ? "active" : ""
                                }`}
                               role="button"
                                onClick={() => handleTabChange("pending")}
                            >
                                Pending
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                                className={`nav-link ${
                                    activeTab === "expired" ? "active" : ""
                                }`}
                               role="button"
                                onClick={() => handleTabChange("expired")}
                            >
                                Expired
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                                className={`nav-link ${
                                    activeTab === "draft" ? "active" : ""
                                }`}
                               role="button"
                                onClick={() => handleTabChange("draft")}
                            >
                                Draft
                            </a>
                        </li>
                    </ul>
                    {renderTabContent()}
                    {/* <button
                                class="btn btn-primary btn-lg d-block mx-auto mt-4"
                                onClick={() => handleLoadMoreClick(activeTab)}
                            >
                                Load More
                            </button> */}
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
        case "publish":
            return "published_page";
        case "pending":
            return "pending_page";
        case "expired":
            return "expired_page";
        case "draft":
            return "draft_page"
        default: 
        return "page";
    }
}
