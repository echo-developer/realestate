import React, { useState, useEffect } from "react";
import ProjectDraftComponent from "@/components/projectListing/ProjectDraftComponent";
import ProjectPendingComponent from "@/components/projectListing/ProjectPendingComponent";
import ProjectExpiredComponent from "@/components/projectListing/ProjectExpiredComponent";
import ProjectPublishComponent from "@/components/projectListing/ProjectPublishComponent";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { ShimmerContentBlock } from "react-shimmer-effects";
import withAuth from "@/utils/withAuth";
import AuthUser from "@/components/Authentication/AuthUser";

const TabComponent = () => {
    const { callApi, GetMemberId } = AuthUser();
    const [activeTab, setActiveTab] = useState("pending");
    const [loading, setLoading] = useState(false);
    const [projectData, setProjectData] = useState([]);

    const memberId = GetMemberId();

    useEffect(() => {
        if (memberId) {
            fetchProjectData(activeTab);
        }
    }, [activeTab]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        fetchProjectData(tab);
    };




    const fetchProjectData = async (type) => {
        setLoading(true);
        try {
            const response = await callApi({
                api: `/get-myproject`,
                method: "GET",
                data: {
                    type: type,
                    uid: memberId,
                },
            });

            if (response && response.status === 1) {
                setProjectData(response.data);
            } else {
                console.error("Error fetching data:", response.message);
                setProjectData([]);
            }
        } catch (error) {
            console.error("API call failed:", error);
            setProjectData([]);
        } finally {
            setLoading(false);
        }
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
                return <ProjectPublishComponent projectData={projectData} />;
            case "pending":
                return <ProjectPendingComponent projectData={projectData} />;
            case "expired":
                return <ProjectExpiredComponent projectData={projectData} />;
            case "draft":
                return <ProjectDraftComponent projectData={projectData} />;
            default:
                return null;
        }
    };




    return (
        <DashboardLayout>
            <aside className="col-lg col-12">
                <div className="p-4">
                    <h1 className="h4 text-primary">My Project Listing</h1>
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

export default withAuth(TabComponent);
