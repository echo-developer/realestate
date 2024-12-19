import React, { useState, useEffect } from "react";
import AuthUser from "@/components/Authentication/AuthUser";
import PublishComponent from "@/components/MyPropertyList/PublishComponent";
import DraftComponent from "@/components/MyPropertyList/DraftComponent";
import ExpiredComponent from "@/components/MyPropertyList/ExpiredComponent";
import PendingComponent from "@/components/MyPropertyList/PendingComponent";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { toast } from "react-toastify";
import { ShimmerContentBlock } from "react-shimmer-effects";

const TabComponent = () => {
    const [activeTab, setActiveTab] = useState("publish");
    const [loading, setLoading] = useState(true);
    const { callApi ,GetMemberId} = AuthUser();
    const [propertyData, setPropertyData] = useState([]);
    const memberId= GetMemberId();

    useEffect(() => {
        FetchPropertyData();
    }, []);

  

    const FetchPropertyData = async () => {
        setLoading(true);
        let response;
        try {
            response = await callApi({
                api: `/my_property_list`,
                method: "GET",
                data: {
                    user_id: '9',
                },
            });
            if (response && response.status === 1) {
                setPropertyData(response.data);
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            console.error("Data not found", error);
            toast.error("Failed to load data");
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
                return <PublishComponent propertiesData={propertyData} />;
            case "pending":
                return <PendingComponent propertiesData={propertyData} />;
            case "expired":
                return <ExpiredComponent propertiesData={propertyData} />;
            case "draft":
                return <DraftComponent propertiesData={propertyData} />;
            default:
                return <PublishComponent propertiesData={propertyData} />;
        }
    };

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
                                href="#"
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
                                href="#"
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
                                href="#"
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
                                href="#"
                                onClick={() => handleTabChange("draft")}
                            >
                                Draft
                            </a>
                        </li>
                    </ul>
                    {renderTabContent()}
                </div>
            </aside>
            <aside className="col-xl-auto col-12">
                <div className="text-center mt-4">
                    <img
                        src="assets/images/ads/8c178a3ead69fc4c042ecb0e550c2579.png"
                        alt="ads"
                        className="img-fluid"
                    />
                </div>
            </aside>
        </DashboardLayout>
    );
};

export default TabComponent;
